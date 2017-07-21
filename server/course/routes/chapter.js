const express = require("express")
const course = require("../dal/course")

let router = express.Router()


/**
 * 创建章节
 */
router.post('/createChapter', async function (req, res) {
    req.checkBody('course_id').notEmpty().isInt({min: 1})
    req.checkBody('name').notEmpty().isLength(1, 64)
    req.checkBody('description').notEmpty().isLength(1, 255)

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
    return res.status(201).send(chapter)
})

/**
 * 重命名章节
 */
router.post('/renameChapter', async function (req, res) {
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('name').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let name = req.body.name
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter)
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0)
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateChapter(chapterId, {
        name
    })
    res.status(201).send(ret)
})

/**
 * 修改章节简介
 */
router.post('/updateChapterDescription', async function (req, res) {
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('description').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let description = req.body.description
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter)
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0)
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateChapter(chapterId, {
        description
    })
    res.status(201).send(ret)
})

router.post('/adjustChapterSeq', async function(req, res){
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('seq').notEmpty().isInt({ min: 0, max: 100 })

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let seq = req.body.seq
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter)
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0)
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateChapter(chapterId, {
        seq
    })
    res.status(201).send(ret)
})

router.post('/deleteChapter', async function(req, res){
    req.checkBody('id').notEmpty().isInt({min: 1})

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
    if(sections.length)
        return res.status(422).send('The chapter cannot be deleted util no sections in it.')

    let ret = await course.DeleteChapter(chapterId)
    console.log(ret)
    res.status(201).send(ret)
})


module.exports = router