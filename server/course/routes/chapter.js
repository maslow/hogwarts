const express = require("express")
const course = require("../dal/course")

let router = express.Router()

/**
 * 创建章节
 */
router.post('/createChapter', async function (req, res) {
    req
        .checkBody('course_id')
        .notEmpty()
        .isInt({min: 1})
    req
        .checkBody('name')
        .notEmpty()
        .isLength(1, 64)
    req
        .checkBody('description')
        .notEmpty()
        .isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty()) 
        return res.status(422).send(errors.mapped())

    let courseId = req.body.course_id
    let seq = req.body.seq || 50
    let course0 = await course.GetCourseById(courseId)
    if (!course0) 
        return res.status(422).send("Course Id is invalid")

    if (course0.created_by != req.uid) 
        return res.status(401).send('Permission denied')

    let chapter = await course.CreateChapter(courseId, req.body.name, req.body.description, seq)
    return res
        .status(201)
        .send(chapter)
})

/**
 * 更新章节
 */
router.post('/updateChapter', async function (req, res) {
    let chapter_id = req.body.chapter_id
    let name = req.body.name || null
    let description = req.body.description || null
    let seq = req.body.seq || null

    let chapter = await course.GetChapterById(chapter_id)
    if (!chapter) 
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0) 
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid) 
        return res.status(401).send('Permission denied')

    let data = {}
    !name || (data.name = name)
    !description || (data.description = description)
    !seq || (data.seq = seq)

    let ret = await course.UpdateChapter(chapter_id, data)
    res
        .status(201)
        .send(ret)
})

/**
 * 删除章节
 */
router.post('/deleteChapter', async function (req, res) {
    req
        .checkBody('id')
        .notEmpty()
        .isInt({min: 1})

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false) 
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter) 
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0) 
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid) 
        return res.status(401).send('Permission denied')

    let sections = await course.GetSections(chapter.course_id)
    sections = sections.filter(s => s.chapter_id === chapter.id)
    if (sections.length) 
        return res.status(422).send('The chapter cannot be deleted util no sections in it.')

    let ret = await course.DeleteChapter(chapterId)
    console.log(ret)
    res
        .status(201)
        .send(ret)
})

module.exports = router