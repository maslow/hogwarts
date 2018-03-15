const express = require("express")
const debug = require('debug')
const _ = require('lodash')

const JobMetaModel = require('../model/JobMeta')
const JobCodeModel = require('../model/JobCode')

const router = express.Router()
const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

/**
 * Get a user job by section id
 */
router.get('/getUserJobBySectionId', async function (req, res) {
    const section_id = req.query.sid 
    const user_id = req.uid
    
    try {
        let job = await JobMetaModel.findOne({section_id, created_by:user_id})
        
        if(!job){
            job = new JobMetaModel({section_id, created_by:user_id})
            await job.save()
        }
            
        return res.status(200).send(job)
    } catch (err) {
        _log('Retrieve user job by section id %s caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Eval a user job by job id
 */
router.post('/evalUserJobByJobId', async function (req, res) {
    const job_id = req.body.job_id

    try {
        // find job
        const job = await JobMetaModel.findById(job_id)
        if (!job)
            return res.status(404).send("Job not found")

        // get section for retrieving template and section testcase
        const section = await job.getSection()
        if(!section) 
            throw new Error(`Section not found: ${job.section_id}`)

        // get template for retrieving docker image name
        const template_id = section.template_id
        const template = await JobMetaModel.getTemplate(template_id)
        if(!template)
            throw new Error(`Template not found: ${template_id}`)

        const docker_image = template.docker_image

        // get job codes
        const job_codes = await JobCodeModel.find({job_id, status: 'normal'})

        // get section codes
        const section_codes = await job.getSectionCodesWithoutTemplate()
    
        // tests
        const testcase = section.testcase

        // perform eval request
        const eval_data = {
            docker_image,
            job_codes,
            section_codes,
            testcase
        }
        const results = await JobMetaModel.eval(job_id, eval_data)
        if(!results)
            throw new Error('Evaluate job caught an error: empty results')
        
        // update job
        if(results.ok){
            job.status = 'success'
        }else{
            job.status = 'failed'
        }
        job.try_times = job.try_times + 1
        await job.save()
        
        return res.status(200).send(results)
    } catch (err) {
        _log('Evaluate job by job id %s caught an error: %o', job_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router