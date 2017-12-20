const express = require("express")
const debug = require('debug')
const JobModel = require("../model/job")
const CodeModel = require("../model/code")

const router = express.Router()
const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

/**
 * 获取作业指定目录的文件列表
 */
router.get('/getJobFiles', async function (req, res) {
    const jobId = req.query.jid || 0
    if (!jobId)
        return res.status(422).send('Job Id can not be empty')

    const file = req.query.path || '/'

    try {
        if (!CodeModel.SecurityChecking(jobId, file))
            return res.status(422).send('Path is Invalid')

        const job = await JobModel.GetJobById(jobId)
        if (!job)
            return res.status(404).send('Object Not Exists')

        if (req.uid != job.uid)
            return res.status(401).send('Permission denied')

        const files = await CodeModel.GetFiles(jobId, file, job.sectionId)
        if (!files)
            return res.status(404).send('Job Code Files Not Found')

        return res.status(200).send(files)

    } catch (err) {
        _log('Retrieve job files by job id %s caught an error: %o', jobId, err)
        return res.status(400).send('Internal Error')
    }
})

router.get('/getJobFileContent', async function (req, res) {
    const jobId = req.query.jid || 0
    if (!jobId)
        return res.status(422).send('Job Id can not be empty')

    const file = req.query.path || null
    try {
        if (!file || !CodeModel.SecurityChecking(jobId, file))
            return res.status(422).send('Path is Invalid')

        let job0 = await JobModel.GetJobById(jobId)
        if (!job0)
            return res.status(404).send('Object Not Exists')

        if (req.uid != job0.uid)
            return res.status(401).send('Permission denied')

        const rets = await CodeModel.GetFile(jobId, file, job0.sectionId)
        if (rets === false)
            return res.status(404).send('Job Code File Not Found')

        const data = rets.toString('utf-8')

        return res.status(200).send({
            name: file,
            hash: md5(data),
            content: data
        })

    } catch (err) {
        _log('Retrieve job file contents by job id %s caught an error: %o', jobId, err)
        return res.status(400).send('Internal Error')
    }
})

router.post("/updateJobFileContent", async function (req, res) {
    let p = req.body.path || null
    let jobId = req.body.jid || 0
    let content = req.body.content || ''

    if (!p || !p.length)
        return res.status(422).send('File Path invalid #0')
    try {
        if (!CodeModel.SecurityChecking(jobId, p))
            return res.status(422).send('File Path invalid')

        let jobObj = await JobModel.GetJobById(jobId)
        if (!jobObj)
            return res.status(404).send('Job not found')

        if (req.uid != jobObj.uid)
            return res.status(401).send('Permission denied')

        let err = await CodeModel.WriteFile(jobId, p, content)
        if (!err)
            return res.status(200).send('ok')
        else
            return res.status(400).send(err)
    } catch (err) {
        _log('Updata job file contents by job id %s caught an error: %o', jobId, err)
    }

})

router.post("/createJobFolder", async function (req, res) {
    let p = req.body.path || null
    let jobId = req.body.jid || 0

    if (!p || !p.length)
        return res.status(422).send('File Path invalid #0')
    try {
        if (!CodeModel.SecurityChecking(jobId, p))
            return res.status(422).send('File Path invalid')

        let jobObj = await JobModel.GetJobById(jobId)
        if (!jobObj)
            return res.status(404).send('Job not found')

        if (req.uid != jobObj.uid)
            return res.status(401).send('Permission denied')

        let ret = await CodeModel.CreateFolder(jobId, p)
        if (ret)
            return res.status(201).send('ok')
        else
            return res.status(200).send('exist')
    } catch (err) {
        _log('Create job folder by job id %s caught an error: %o', jobId, err)
        return res.status(400).send('Internal Error')
    }
})


router.post("/deleteJobFile", async function (req, res) {
    let p = req.body.path || null
    let jobId = req.body.jid || 0

    if (!p || !p.length)
        return res.status(422).send('File Path invalid #0')
    try {
        if (!CodeModel.SecurityChecking(jobId, p))
            return res.status(422).send('File Path invalid')

        let jobObj = await JobModel.GetJobById(jobId)
        if (!jobObj)
            return res.status(404).send('Job not found')

        if (req.uid != jobObj.uid)
            return res.status(401).send('Permission denied')

        let err = await CodeModel.DeleteFile(jobId, p)
        if (!err)
            return res.status(200).send('deleted')
        else
            return res.status(400).send(err)
    } catch (err) {
        _log('Delete job file by job id %s caught an error: %o', jobId, err)
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
