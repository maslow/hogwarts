const express = require("express")
const validator = require("validator")
const debug = require('debug')

const CourseMetaModel = require('../model/CourseMeta')
const CourseChapterModel = require('../model/CourseChapter')
const CourseSectionModel = require('../model/CourseSection')
const TemplateMetaModel = require('../model/TemplateMeta')

const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * Get section meta
 */
router.get('/getSectionDetail', async function (req, res) {
    const section_id = req.query.id

    try {
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(422).send("Section not found")
        
        const course = await CourseMetaModel.findById(section.course_id)
        if(!course)
            return res.status(422).send("Course not found")

        if(req.uid != course.created_by & section.status !== 1)
            return res.status(422).send("Permisson denied")

        return res.status(200).send(section)
    } catch (err) {
        _log('Retrieve section (id:%s) detail caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Create section meta
 */
router.post('/createSection', async function (req, res) {
    const course_id = req.body.course_id
    const chapter_id = req.body.chapter_id
    const template_id = req.body.template_id    
    const section_name = req.body.name
    const section_description = req.body.description

    try {
        const course = await CourseMetaModel.findById(course_id)
        if(!course)
            return res.status(422).send('Course not found')

        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const chapter = await CourseChapterModel.findById(chapter_id)
        if(!chapter || chapter.course_id != course_id)
            return res.status(422).send('Invalid chapter id')

        const template = await TemplateMetaModel.findById(template_id)
        if(!template)
            return res.status(422).send('Invalid template id')

        const section = new CourseSectionModel()
        section.name = section_name
        section.desc = section_description
        section.chapter_id = chapter_id
        section.course_id = course_id
        section.template_id = template_id

        await section.save()
        return res.status(200).send(section)
    } catch (err) {
        _log('Creating section (course id:%s, chapter id:%s) caught an error: %o', course_id, chapter_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Update section meta
 */
router.post('/updateSection', async function (req, res) {
    const section_id = req.body.section_id
    const section_name = req.body.name 
    const section_description = req.body.description
    const section_seq = req.body.seq 
    const template_id = req.body.template_id
    const chapter_id = req.body.chapter_id
    const document = req.body.document
    const testcase = req.body.testcase

    try {
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(404).send('Section not found')

        const course = await CourseMetaModel.findById(section.course_id)
        if(!course)
            return res.status(422).send('Course not found')

        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        if(section_name) section.name = section_name
        if(section_description) section.desc = section_description
        if(section_seq) section.sequence = section_seq
        if(template_id) section.template_id = template_id
        if(chapter_id) section.chapter_id = chapter_id
        if(document) section.document = document
        if(testcase) section.testcase = testcase

        await section.save()
        return res.status(200).send(section)
    } catch (err) {
        _log('Updating section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * TODO rebuild code.publish()
 * Publish section
 */
router.post('/publishSection', async function (req, res) {
    const section_id = req.body.section_id

    try {
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(404).send('Section not found')

        const course = await CourseMetaModel.findById(section.course_id)
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // Update section status, 0 means unpublished, 1 means published
        if(section.status === 0){
            section.status = 1
            await section.save()
        }

        return res.status(200).send(section)
    } catch (err) {
        _log('Publishing section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router