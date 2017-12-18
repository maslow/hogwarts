const express = require("express")
const debug = require('debug')
const JobModel = require("../model/job")
const CodeModel = require("../model/code")

const router = express.Router()
const _debug = debug('JOB:DEV')

/**
 * 获取当前登录用户的一个作业详情
 */
router.get('/getUserJobBySectionId', async function (req, res) {
    const section_id = req.query.sid || 0
    if (!section_id)
        return res.status(422).send('Section Id can not be empty')

    const user_id = req.uid
    try {
        let job = await JobModel.GetUserJobBySectionId(user_id, section_id)
        if (!job)
            job = await JobModel.CreateUserJob(user_id, section_id)
        return res.status(200).send(job)
    } catch (err) {
        _debug('Retrieve user job by section id %s caught an error: %o', section_id, err)
    }
})

router.post('/evalUserJobByJobId', async function (req, res) {
    const jobId = req.body.jid || 0
    if (!jobId)
        return res.status(422).send('Job Id can not be empty')

    const user_id = req.uid

    try {
        const job = await JobModel.GetJobById(jobId)
        if (!job)
            return res.status(404).send("Job not exists")

        const source = await CodeModel.GetSource(jobId, job.section_id)
        _debug("source %O", source)
        // 请求eval
        // return result
        return res.status(200).send('To be done...')
    } catch (err) {
        _debug('Evaluate job by job id %s caught an error: %o', jobId, err)
    }
})

module.exports = router