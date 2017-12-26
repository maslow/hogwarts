const express = require("express")
const debug = require('debug')
const validator = require('validator')

const CourseMetaModel = require('../model/CourseMeta')
const CourseChapterModel = require('../model/CourseChapter')
const CourseSectionModel = require('../model/CourseSection')

const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * Create chapter
 */
router.post('/createChapter', async function (req, res) {
    const course_id = req.body.course_id
    const chapter_name = req.body.name
    const chapter_description = req.body.description
        
    try {
        const course = await CourseMetaModel.findById(course_id)
        if(!course)
            return res.status(404).send('Object not found')

        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')
        
        const chapter = new CourseChapterModel({course_id, name: chapter_name, desc: chapter_description})
        await chapter.save()
        return res.status(201).send(chapter)
    } catch (err) {
        _log('Creating chapter of course id %s caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Update chapter
 */
router.post('/updateChapter', async function (req, res) {
    const chapter_id = req.body.chapter_id
    const chapter_name = req.body.name
    const chapter_description = req.body.description
    const seq = req.body.seq

    try {
        const chapter = await CourseChapterModel.findById(chapter_id)
        if(!chapter)
            return res.status(404).send('Object not found')
            
        const course = await CourseMetaModel.findById(chapter.course_id)
        if(!course)
            return res.status(404).send('Object not found')
    
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        if(chapter_name) chapter.name = chapter_name
        if(chapter_description) chapter.desc = chapter_description
        if(seq) chapter.sequence = seq
        await chapter.save()

        return res.status(201).send(chapter)
    } catch (err) {
        _log('Updating chapter (id: %s) of course (id %s) caught an error: %o', chapter_id, course_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Delete chapter
 */
router.post('/deleteChapter', async function (req, res) {
    const chapter_id = req.body.id

    try {
        const chapter = await CourseChapterModel.findById(chapter_id)
        if(!chapter)
            return res.status(404).send('Object not found')
            
        const course = await CourseMetaModel.findById(chapter.course_id)
        if(!course)
            return res.status(404).send('Object not found')
    
        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const section_count = await CourseSectionModel.count({chapter_id: chapter_id})
        if(section_count)
            return res.status(422).send('The chapter cannot be deleted util no sections in it.')

        await chapter.remove()
        res.status(201).send('Deleted')
    } catch (err) {
        _log('Deleting chapter (id: %s) of course (id %s) caught an error: %o', chapter_id, course_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router