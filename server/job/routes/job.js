const express = require("express")
const debug = require('debug')
const _ = require('lodash')

const JobModel = require("../model/job")
const CodeModel = require("../model/code")
const SectionModel = require("../model/section")

const router = express.Router()
const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

/**
 * 获取一个用户作业详情
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
        _log('Retrieve user job by section id %s caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 测试用户作业
 */
router.post('/evalUserJobByJobId', async function (req, res) {
    const job_id = req.body.job_id || 0
    if (!job_id)
        return res.status(422).send('Job Id can not be empty')

    try {
        const job = await JobModel.GetJobById(job_id)
        if (!job)
            return res.status(404).send("Job not exists")

        const section_id = job.sectionId

        const section = await SectionModel.GetSectionById(section_id)
        const docker_image = `template:${section.template_id}`

        const job_codes = await CodeModel.GetJobCodes(job_id)
        const section_codes = await SectionModel.GetCodesWithoutTemplate(section_id)

        // Merge job codes and section codes
        let codes = job_codes.concat(section_codes)
        codes = _.uniqBy(codes, 'name')
    
        const tests = await SectionModel.GetTests(section_id)
        const source = {
            codes,
            tests
        }
        const results = await JobModel.EvalRequest(job_id, docker_image, source)

        return res.status(200).send(results)
    } catch (err) {
        _log('Evaluate job by job id %s caught an error: %o', job_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router