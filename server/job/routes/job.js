const express = require("express")
const JobModel = require("../model/job")

const router = express.Router()

/**
 * 获取当前登录用户的一个作业详情
 */
router.get('/getUserJobBySectionId', async function (req, res) {
    const section_id = req.query.sid || 0
    if (!section_id)
        return res.status(422).send('Section Id can not be empty')

    const user_id = req.uid
    let job = await JobModel.GetUserJobBySectionId(user_id, section_id)
    if (!job)
        job = await JobModel.CreateUserJob(user_id, section_id)

    return res.status(200).send(job)
})

module.exports = router