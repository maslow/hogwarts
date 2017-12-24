const express = require("express")
const validator = require("validator")
const debug = require('debug')

const CourseModel = require("../model/course")
const TemplateModel = require("../model/template")
const CodeModel = require('../model/code')

const router = express.Router()
const _log = debug('COURSE:PROD')

router.get('/getSectionDetail', async function (req, res) {
    const section_id = req.query.id || null

    try {
        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(422).send("Section not exists")

        if (req.uid != section.created_by && section.status !== CourseModel.COURSE_PUBLISHED)
            return res.status(403).send("Permisson denied")

        return res.status(200).send(section)
    } catch (err) {
        _log('Retrieve section (id:%s) detail caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 创建小节
 */
router.post('/createSection', async function (req, res) {
    const course_id = req.body.course_id
    const chapter_id = req.body.chapter_id
    const section_name = req.body.name
    const section_description = req.body.description
    const section_seq = req.body.seq || 50
    const section_template_id = req.body.template_id || 0

    if (!validator.isLength(section_name, { min: 1, max: 64 }))
        return res.status(422).send('Invalid section name')

    if (!validator.isLength(section_description, { min: 1, max: 64 }))
        return res.status(422).send('Invalid section description')

    try {
        const course = await CourseModel.GetCourseById(course_id)
        if (!course)
            return res.status(422).send("Course not found")

        const template = await TemplateModel.getTemplateById(section_template_id)
        if (!template)
            return res.status(422).send('Invalid template id')

        if (course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        if (!await CourseModel.GetChapterById(req.body.chapter_id))
            return res.status(422).send({ chapter_id: "Invalid chapter id" })

        // just ignore it now (TBD)
        const env = {}
        const section = await CourseModel.CreateSection(course_id, chapter_id,
            section_name, section_description, section_template_id, section_seq, env, req.uid)

        return res.status(200).send(section)
    } catch (err) {
        _log('Creating section (course id:%s, chapter id:%s) caught an error: %o', course_id, chapter_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 更新小节
 */
router.post('/updateSection', async function (req, res) {
    const section_id = req.body.section_id
    const section_name = req.body.name || null
    const section_description = req.body.description || null
    const section_seq = req.body.seq || null
    const section_template_id = req.body.template_id || null

    try {
        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(422).send("Section not found")

        const template = await TemplateModel.getTemplateById(section_template_id)
        if (!template)
            return res.status(422).send('Template not found')

        if (section.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const section_data = {}
        !section_name || (section_data.name = section_name)
        !section_description || (section_data.description = section_description)
        !section_seq || (section_data.seq = section_seq)
        !section_template_id || (section_data.template_id = section_template_id)

        const updated_section = await CourseModel.UpdateSection(section_id, section_data)
        return res.status(200).send(updated_section)
    } catch (err) {
        _log('Updating section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 发布小节
 */
router.post('/publishSection', async function (req, res) {
    const section_id = req.body.section_id

    try {
        let section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(422).send("Section not found")

        if (section.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // Update section status
        if (section.status !== CourseModel.COURSE_PUBLISHED) {
            const section_data = { status: CourseModel.COURSE_PUBLISHED }
            section = await CourseModel.UpdateSection(section_id, section_data)
        }

        // Publish section code
        await CodeModel.Publish(section_id)
        return res.status(200).send(section)
    } catch (err) {
        _log('Publishing section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router