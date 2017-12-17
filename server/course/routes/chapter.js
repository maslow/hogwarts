const express = require("express")
const debug = require('debug')
const validator = require('validator')
const CourseModel = require("../model/course")

const router = express.Router()
const _log = debug('JOB:PROD')

/**
 * Create Chapter
 */
router.post('/createChapter', async function (req, res) {
    const course_id = req.body.course_id || null
    const chapter_name = req.body.name || null
    const chapter_description = req.body.description || null

    if (!course_id || !validator.isInt(course_id))
        return res.status(422).send('Invalid course id')

    if (!validator.isLength(chapter_name, { min: 1, max: 64 }))
        return res.status(422).send('Invalid chapter name')

    if (!validator.isLength(chapter_description, { min: 1, max: 255 }))
        return res.status(422).send('INvalid chapter description')

    const seq = req.body.seq || 50

    try {
        const course = await CourseModel.GetCourseById(course_id)
        if (!course)
            return res.status(422).send("Course Id is invalid")

        if (course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const chapter = await CourseModel.CreateChapter(course_id, chapter_name, chapter_description, seq)
        return res.status(201).send(chapter)
    } catch (err) {
        _log('Creating chapter of course id %s caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Update Chapter
 */
router.post('/updateChapter', async function (req, res) {
    const chapter_id = req.body.chapter_id
    const chapter_name = req.body.name || null
    const chapter_description = req.body.description || null
    const seq = req.body.seq || null

    try{
        const chapter = await CourseModel.GetChapterById(chapter_id)
        if (!chapter)
        return res.status(404).send("Chapter not found")
        
        const course = await CourseModel.GetCourseById(chapter.course_id)
        if (!course)
        return res.status(404).send("Course not found")
        
        if (course.created_by != req.uid)
        return res.status(401).send('Permission denied')
        
        const chapter_data = {}
        !chapter_name || (chapter_data.name = chapter_name)
        !chapter_description || (chapter_data.description = chapter_description)
        !seq || (chapter_data.seq = seq)
        
        const chapter = await CourseModel.UpdateChapter(chapter_id, chapter_data)
        return res.status(201).send(chapter)
    }catch(err){
        _log('Updating chapter (id: %s) of course (id %s) caught an error: %o', chapter_id, course_id, err)        
        return res.status(400).send('Internal Error')
    }
})

/**
 * 删除章节
 */
router.post('/deleteChapter', async function (req, res) {
    const chapter_id = req.body.id || null
    if(!chapter_id || !validator.isInt(chapter_id))
        return res.status(422).send('Invalid chapter id')

    try{
        const chapter = await CourseModel.GetChapterById(chapter_id)
        if (!chapter)
        return res.status(404).send("Chapter not found")
        
        const course = await CourseModel.GetCourseById(chapter.course_id)
        if (!course)
        return res.status(404).send("Course not found")
        
        if (course.created_by != req.uid)
        return res.status(401).send('Permission denied')
        
        const sections = await CourseModel.GetSections(chapter.course_id)
        sections = sections.filter(s => s.chapter_id === chapter.id)
        if (sections.length)
        return res.status(422).send('The chapter cannot be deleted util no sections in it.')
        
        const ret = await CourseModel.DeleteChapter(chapter_id)
        res.status(201).send(ret)
    }catch(err){
        _log('Deleting chapter (id: %s) of course (id %s) caught an error: %o', chapter_id, course_id, err)                
        return res.status(400).send('Internal Error')
    }
})

module.exports = router