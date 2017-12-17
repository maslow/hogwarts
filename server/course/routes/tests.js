const express = require("express")
const debug = require('debug')

const TestsModel = require("../model/tests")
const CourseModel = require("../model/course")

const router = express.Router()
const _log = debug('COURSE:PROD')

router.post('/updateSectionTests', async function (req, res) {
    const section_id = req.body.section_id
    const tests_code = req.body.codes || null

    try {
        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(422).send("Section not found")

        if (section.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const tests = await TestsModel.updateCode(section_id, tests_code)
        return res.status(200).send(tests)
    } catch (err) {
        _log("Updating section (id:%s) tests caught an error: %o", section_id, err)
        return res.status(400).send('Internal Error')
    }
})

router.get('/getSectionTests', async function (req, res) {
    const section_id = req.query.section_id

    try {
        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(422).send("Section not found")

        if (section.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const tests = await TestsModel.getCode(section_id)
        return res.status(200).send(tests)
    } catch (err) {
        _log("Updating section (id:%s) tests caught an error: %o", section_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router