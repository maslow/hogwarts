const express = require("express")
const validator = require("validator")
const debug = require('debug')

const CourseMetaModel = require('../model/CourseMeta')
const CourseChapterModel = require('../model/CourseChapter')
const CourseSectionModel = require('../model/CourseSection')
const CourseCodeModel = require('../model/CourseCode')
const TemplateMetaModel = require('../model/TemplateMeta')

const router = express.Router()
const _log = debug('COURSE:PROD')
const _debug = debug('COURSE:DEV')

/**
 * Get section meta
 */
router.get('/getSectionDetail', async function (req, res) {
    const section_id = req.query.id

    try {
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(422).send("Section not found")
        
        // find course for permission checking
        const course = await CourseMetaModel.findById(section.course_id)
        if(req.uid != course.created_by & section.status !== 'published')
            return res.status(422).send("Permisson denied")

        // return
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
        // find course for validating course_id
        const course = await CourseMetaModel.findById(course_id)
        if(!course)
            return res.status(422).send('Course not found')

        // perform permission checking
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // find chapter for validating chapter_id
        const chapter = await CourseChapterModel.findById(chapter_id)
        if(!chapter || chapter.course_id != course_id)
            return res.status(422).send('Invalid chapter id')

        // find template for validating template
        const template = await TemplateMetaModel.findById(template_id)
        if(!template)
            return res.status(422).send('Invalid template id')

        // create a new section and fill it with fileds given
        const section = new CourseSectionModel()
        section.name = section_name
        section.desc = section_description
        section.chapter_id = chapter_id
        section.course_id = course_id
        section.template_id = template_id

        // save it and return
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
        // find section for updating
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(404).send('Section not found')

         // lock the section if published
         if(testcase && section.status === 'published'){
            section.status = 'locked'
            await section.save()
        }

        // find course for validating course_id
        const course = await CourseMetaModel.findById(section.course_id)
        if(!course)
            return res.status(422).send('Course not found')

        // perform permission checking
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // update fileds which given valid-value
        if(section_name) section.name = section_name
        if(section_description) section.desc = section_description
        if(section_seq) section.sequence = section_seq
        if(template_id) section.template_id = template_id
        if(chapter_id) section.chapter_id = chapter_id
        if(document) section.document = document
        if(testcase) section.testcase = testcase

        // save it and return
        await section.save()
        return res.status(200).send(section)
    } catch (err) {
        _log('Updating section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Publish section
 */
router.post('/publishSection', async function (req, res) {
    const section_id = req.body.section_id

    try {
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(404).send('Section not found')

        // find course for permission checking
        const course = await CourseMetaModel.findById(section.course_id)
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // publish section if it's not published
        if(section.status !== 'published'){
            section.status = 'published'
            await section.save()
        }

        return res.status(200).send(section)
    } catch (err) {
        _log('Publishing section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})


/**
 * Unpublish section
 */
router.post('/unpublishSection', async function (req, res) {
    const section_id = req.body.section_id

    try {
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(404).send('Section not found')

        // find course for permission checking
        const course = await CourseMetaModel.findById(section.course_id)
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // publish section if it's not published
        if(section.status !== 'unpublished'){
            section.status = 'unpublished'
            await section.save()
        }

        return res.status(200).send(section)
    } catch (err) {
        _log('Publishing section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})


/**
 * Update section meta and codes
 */
router.post('/deleteSection', async function (req, res) {
    const section_id = req.body.section_id

    try {
        // find section for updating
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(404).send('Section not found')

        // find course
        const course = await CourseMetaModel.findById(section.course_id)
        if(!course)
            return res.status(422).send('Course not found')

        // perform permission checking
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // delete section codes
        let ret = await CourseCodeModel.remove({section_id})
        _debug("Delete section(%s) codes result: %o", section_id, ret)

        // delete section meta
        ret = await CourseSectionModel.remove({_id: section_id})
        _debug("Delete section(%s) meta result: %o", section_id, ret)

        return res.status(204).send('ok')
    } catch (err) {
        _log('Updating section (id:%s) caught an error: %o', section_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router