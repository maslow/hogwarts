const express = require("express")
const course = require("../dal/course")

let router = express.Router()


/**
 * 获取一个用户创建的课程
 */
router.get('/getUserCourses', async function (req, res) {
    req.checkQuery('uid').notEmpty().isInt()
    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let uid = req.query.uid
    let rets = await course.GetCoursesByUserId(uid, req.uid)
    res.status(200).send(rets)
})

/**
 * 获取课程详情
 */
router.get('/getCourseDetail', async function (req, res) {
    req.checkQuery('id').notEmpty().isInt()

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let courseId = req.query.id
    let course0 = await course.GetCourseById(courseId, req.uid)
    if (!course0)
        return res.status(404).send("Object not found")

    let chapters = await course.GetChapters(courseId)
    let sections = await course.GetSections(courseId, req.uid)
    return res.status(200).send({
        course: course0,
        chapters,
        sections
    })
})

/**
 * 创建课程
 */
router.post('/createCourse', async function (req, res) {
    req.checkBody('name').notEmpty().isLength(1, 64)
    req.checkBody('description').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    if (await course.GetCourseByName(req.body.name))
        return res.status(422).send({
            name: "Name exist"
        })

    let ret = await course.CreateCourse(req.body.name, req.body.description, req.uid)
    res.status(201).send(ret)
})

/**
 * 创建章节
 */
router.post('/createChapter', async function (req, res) {
    req.checkBody('course_id').notEmpty().isInt()
    req.checkBody('name').notEmpty().isLength(1, 64)
    req.checkBody('description').notEmpty().isLength(1, 255)
    req.checkBody('seq').notEmpty().isInt()

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    let courseId = req.body.course_id
    if (!await course.GetCourseById(courseId, req.uid))
        return res.status(422).send({
            cid: "Course Id is invalid"
        })

    let chapter = await course.CreateChapter(courseId, req.body.name, req.body.description, req.body.seq)
    return res.status(201).send(chapter)
})

router.get('/getSectionDetail', async function (req, res) {
    req.checkQuery('id').notEmpty().isInt()

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty)
        return res.status(422).send(errors.mapped())

    let section = await course.GetSection(req.query.id, req.uid)
    if (!section)
        return res.status(404).send("Section not exists")

    return res.status(200).send(section)
})

/**
 * 创建小节
 */
router.post('/createSection', async function (req, res) {
    req.checkBody('course_id').notEmpty().isInt()
    req.checkBody('chapter_id').notEmpty().isInt()
    req.checkBody('name').notEmpty().isLength(1, 64)
    req.checkBody('description').notEmpty().isLength(1, 255)
    req.checkBody('seq').notEmpty().isInt()
    req.checkBody('image').notEmpty()

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    let courseId = req.body.course_id
    if (!await course.GetCourseById(courseId, req.uid))
        return res.status(422).send({
            cid: "Course Id is invalid"
        })

    if (!await course.GetChapterById(courseId, req.body.chapter_id))
        return res.status(422).send({
            chapter_id: "Chapter Id is invalid"
        })

    let env = {
        image: req.body.image
    }

    let section = await course.CreateSection(
        courseId,
        req.body.chapter_id,
        req.body.name,
        req.body.description,
        req.body.seq,
        env,
        req.uid)

    return res.status(200).send(section)
})

module.exports = router