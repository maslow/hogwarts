const express = require("express")
const job = require("../model/job")
const code = require("../model/code")

const router = express.Router()

/**
 * 获取作业指定目录的文件列表
 */
router.get('/getJobFiles', async function (req, res) {
    const jobId = req.query.jid || 0
    if (!jobId)
        return res.status(422).send('Job Id can not be empty')

    const file = req.query.path || '/'
    if (!code.SecurityChecking(jobId, file))
        return res.status(422).send('Path is Invalid')

    let job0 = await job.GetJobById(jobId)
    if (!job0)
        return res.status(404).send('Object Not Exists')

    if (req.uid != job0.uid)
        return res.status(401).send('Permission denied')

    const files = await code.GetFiles(jobId, file, job0.sectionId)
    if (!files)
        return res.status(404).send('Job Code Files Not Found')

    return res.status(200).send(files)
})

router.get('/getJobFileContent', async function (req, res) {
    const jobId = req.query.jid || 0
    if (!jobId)
        return res.status(422).send('Job Id can not be empty')

    const file = req.query.path || null
    if (!file || !code.SecurityChecking(jobId, file))
        return res.status(422).send('Path is Invalid')

    let job0 = await job.GetJobById(jobId)
    if (!job0)
        return res.status(404).send('Object Not Exists')

    if (req.uid != job0.uid)
        return res.status(401).send('Permission denied')

    const rets = await code.GetFile(jobId, file, job0.sectionId)
    if (!rets)
        return res.status(404).send('Job Code File Not Found')

    const data = rets.toString('utf-8')
    return res.status(200).send({
        name: file,
        hash: md5(data),
        content: data
    })
})

router.post("/updateJobFileContent", async function (req, res) {
    let p = req.body.path || null
    let jobId = req.body.jid || 0
    let content = req.body.content || ''

    if (!p || !p.length)
        return res.status(422).send('File Path invalid #0')

    if (!code.SecurityChecking(jobId, p))
        return res.status(422).send('File Path invalid')

    let jobObj = await job.GetJobById(jobId)
    if (!jobObj)
        return res.status(404).send('Job not found')

    if (req.uid != jobObj.uid)
        return res.status(401).send('Permission denied')

    let err = await code.WriteFile(jobId, p, content)
    if (!err)
        return res.status(200).send('ok')
    else
        return res.status(400).send(err)
})

router.post("/createJobFolder", async function (req, res) {
    let p = req.body.path || null
    let jobId = req.body.jid || 0

    if (!p || !p.length)
        return res.status(422).send('File Path invalid #0')

    if (!code.SecurityChecking(jobId, p))
        return res.status(422).send('File Path invalid')

    let jobObj = await job.GetJobById(jobId)
    if (!jobObj)
        return res.status(404).send('Job not found')

    if (req.uid != jobObj.uid)
        return res.status(401).send('Permission denied')

    let ret = await code.CreateFolder(jobId, p)
    if (ret)
        return res.status(201).send('ok')
    else
        return res.status(200).send('exist')
})


router.post("/deleteJobFile", async function (req, res) {
    let p = req.body.path || null
    let jobId = req.body.jid || 0

    if (!p || !p.length)
        return res.status(422).send('File Path invalid #0')

    if (!code.SecurityChecking(jobId, p))
        return res.status(422).send('File Path invalid')

    let jobObj = await job.GetJobById(jobId)
    if (!jobObj)
        return res.status(404).send('Job not found')

    if (req.uid != jobObj.uid)
        return res.status(401).send('Permission denied')

    let err = await code.DeleteFile(jobId, p)
    if (!err)
        return res.status(200).send('deleted')
    else
        return res.status(400).send(err)
})

module.exports = router

/**
 * Utilities
 */
const crypto = require('crypto');
function md5(content) {
    return crypto.createHash('md5').update(content).digest('hex')
}
