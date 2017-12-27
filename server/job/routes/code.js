const express = require("express")
const path = require('path')
const _ = require('lodash')
const debug = require('debug')

const JobMetaModel = require('../model/JobMeta')
const JobCodeModel = require('../model/JobCode')
const Helper = require('../util')

const router = express.Router()
const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

/**
 * Get job code list in specified path
 */
router.get('/getJobCodeFiles', async function (req, res) {
    const parent = req.query.path || "/"
    const job_id = req.query.jid 

    try {
        // find job
        const job = await JobMetaModel.findById(job_id)
        if (!job)
            return res.status(404).send('Job Not Exists')

        // get job codes & section codes
        const job_codes = await JobCodeModel.find({job_id, parent})
        const section_codes = await job.getSectionCodes(parent)
        
        // Merge job codes & section codes
        let merged = job_codes.concat(section_codes)
        merged = _.uniqBy(merged, 'name')
        merged = merged.filter(code => code.template_id || code.status === 'normal')

        return res.status(200).send(merged)
    } catch (err) {
        _log('Retrieve job files by job id %s caught an error: %o', job_id, err)
        return res.status(400).send('Internal Error')
    }
})

router.get('/getJobFileContent', async function (req, res) {
    const job_id = req.query.jid

    const parent = path.dirname(req.query.path)
    const filename = path.basename(req.query.path)

    try {
        // find job
        const job = await JobMetaModel.findById(job_id)
        if (!job)
            return res.status(404).send('Job Not Exists')

        // get job file
        const code = await JobCodeModel.findOne({job_id, name:filename, type: 'file', parent})
        
        // return directly if code has been marked as deleted
        if(code && code === 'deleted') 
            return res.status(404).send('Job code file not found')
        
        // find code from section if it is not found above
        let code_from_section = null
        if(!code)
            code_from_section = await job.getSectionCodeFile(req.query.path)

        // return directly if code totally not exists
        if (!code && !code_from_section)
            return res.status(404).send('Job code file not found')

        // return data from section code or template code
        const data = code ? code.data : code_from_section.content
        return res.status(200).send({
            name: req.query.path,
            hash: Helper.md5(data),
            content: data
        })
    } catch (err) {
        _log('Retrieve job file contents by job id %s caught an error: %o', job_id, err)
        return res.status(400).send('Internal Error')
    }
})

router.post("/updateJobFileContent", async function (req, res) {
    const job_id = req.body.jid 

    const parent = path.dirname(req.body.path)
    const filename = path.basename(req.body.path)
    const filedata = req.body.content || ''

    try {
         // find job
        const job = await JobMetaModel.findById(job_id)
        if (!job)
            return res.status(404).send('Job Not Exists')

        // find job code or create a new job code if not exists
        let code = await JobCodeModel.findOne({job_id, name:filename, type: 'file', parent})
        if(!code)
            code = new JobCodeModel({job_id, name: filename, type: 'file', parent, status: 'normal'})
        
        // if code had been deleted, recover it
        if(code.status === 'deleted')
            code.status = 'normal'

        // save code
        code.data = filedata
        await code.save()
        return res.status(200).send('ok')
    } catch (err) {
        _log('Updata job file contents by job id %s caught an error: %o', job_id, err)
    }

})

router.post("/createJobFolder", async function (req, res) {
    const job_id = req.body.jid
    const parent = path.dirname(req.body.path)
    const foldername = path.basename(req.body.path)

    try {
        // find job
        const job = await JobMetaModel.findById(job_id)
        if (!job)
            return res.status(404).send('Job not found')

        // find job code
        let code = await JobCodeModel.findOne({job_id, name: foldername, type: 'dir', parent})

        // return directly if folder exists and its status is normal
        if(code && code.status === 'normal'){
            return res.status(422).send('Job code foler already existed')
        }else if(code){
            // this folder had been deleted and now recover it
            code.status = 'normal'
        }else{
            // create the folder
            code = new JobCodeModel({job_id, name:foldername, type:'dir', parent})
        }

        // save it
        await code.save()
        return res.status(200).send('ok')
    } catch (err) {
        _log('Create job folder by job id %s caught an error: %o', job_id, err)
        return res.status(400).send('Internal Error')
    }
})

router.post("/deleteJobFile", async function (req, res) {
    const job_id = req.body.jid
    const parent = path.dirname(req.body.path)
    const filename = path.basename(req.body.path)

    try {
        // find job
        const job = await JobMetaModel.findById(job_id)
        if (!job)
            return res.status(404).send('Job not found')

        // find job code
        const code = await JobCodeModel.findOne({job_id, name:filename, parent})
        const exists_in_section = await job.getSectionCodeFile(req.body.path)
        // return if code not exists 
        if(!code && !exists_in_section)
            return res.status(404).send('Job code not found')

        // mark deleted if code exists in section , or remove it directly
        if(!code && exists_in_section){
            const newcode = new JobCodeModel({job_id, name:filename, type:'file', parent, status:'deleted'})
            await newcode.save()
        }else{
            await code.remove()
        }
        return res.status(200).send('deleted')
    } catch (err) {
        _log('Delete job file by job id %s caught an error: %o', job_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router

/**
 * Utilities
 */
const crypto = require('crypto');
function md5(content) {
    return crypto.createHash('md5').update(content).digest('hex')
}
