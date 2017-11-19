const express = require("express")
const course = require("../model/course")

let router = express.Router()

/**
 * 获取所有已发布的课程列表
 */
router.get('/getPublishedCourses', async function (req, res) {

    let rets = await course.GetCourses()
    rets = rets.filter(c => c.status == course.COURSE_PUBLISHED)

    res.status(200).send(rets)
})

/**
 * 获取一个用户创建的课程
 */
router.get('/getUserCourses', async function (req, res) {
    let uid = req.query.uid || false
    if (!uid)
        return res.status(422).send('User Id can not be empty')

    let rets = await course.GetCoursesByUserId(uid)
    rets = rets.filter(c => {
        let s = (req.uid == uid)
            ? course.COURSE_CREATED
            : course.COURSE_PUBLISHED
        return c.status >= s
    })

    res.status(200).send(rets)
})

/**
 * 获取课程详情
 */
router.get('/getCourseDetail', async function (req, res) {
    req
        .checkQuery('id')
        .notEmpty()
        .isInt({ min: 1 })

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let courseId = req.query.id
    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(404).send("Object not found")

    if (course0.created_by != req.uid && course0.status === course.COURSE_CREATED)
        return res.status(403).send("Permission denied")

    let chapters = await course.GetChapters(courseId)
    let sections = await course.GetSections(courseId)
    sections = sections.filter(s => {
        let status = (req.uid == s.created_by)
            ? course.COURSE_CREATED
            : course.COURSE_PUBLISHED
        return s.status >= status
    })

    return res
        .status(200)
        .send({ course: course0, chapters, sections })
})

/**
 * 创建课程
 */
router.post('/createCourse', async function (req, res) {
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
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    if (await course.GetCourseByName(req.body.name))
        return res.status(422).send({ name: "Name exist" })

    let ret = await course.CreateCourse(req.body.name, req.body.description, req.uid)
    res
        .status(201)
        .send(ret)
})

/**
 * 更新课程
 */
router.post('/updateCourse', async function (req, res) {
    let course_id = req.body.course_id
    let name = req.body.name || null
    let description = req.body.description || null

    let course0 = await course.GetCourseById(course_id)
    if (!course0)
        return res.status(404).send("Object not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let data = {}
    !name || (data.name = name)
    !description || (data.description = description)

    let ret = await course.UpdateCourse(course_id, data)
    res
        .status(201)
        .send(ret)
})

/**
 * 发布课程
 */
router.post('/publishCourse', async function (req, res) {
    req
        .checkBody('id')
        .notEmpty()
        .isInt({ min: 1 })

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let courseId = req.body.id
    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(404).send("Object not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    if (course0.status !== 0)
        return res.status(422).send("Course was already published or deleted")

    let ret = await course.UpdateCourse(courseId, { status: course.COURSE_PUBLISHED })
    res
        .status(201)
        .send(ret)
})

module.exports = router