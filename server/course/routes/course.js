const express = require("express")
const CourseModel = require("../model/course")
const debug = require('debug')

const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * 获取所有已发布的课程列表
 */
router.get('/getPublishedCourses', async function (req, res) {
    try {
        let courses = await CourseModel.GetCourses()
        courses = courses.filter(c => c.status == CourseModel.COURSE_PUBLISHED)

        res.status(200).send(courses)
    } catch (err) {
        _log('Retrieve published courses caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 获取一个用户创建的课程
 */
router.get('/getUserCourses', async function (req, res) {
    const user_id = req.query.uid || false
    if (!user_id)
        return res.status(422).send('User Id can not be empty')

    try {

        let courses = await CourseModel.GetCoursesByUserId(user_id)
        courses = courses.filter(c => {
            const s = (req.uid == user_id) ? CourseModel.COURSE_CREATED : CourseModel.COURSE_PUBLISHED
            return c.status >= s
        })

        res.status(200).send(courses)
    } catch (err) {
        _log('Retrieve user (id:%s) courses caught an error: %o', user_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 获取课程详情
 */
router.get('/getCourseDetail', async function (req, res) {
    const course_id = req.query.id || null
    if (!course_id || !validator.isInt(course_id))
        return res.status(422).send('Invalid course id')

    try {
        const course = await CourseModel.GetCourseById(course_id)
        if (!course)
            return res.status(404).send("Object not found")

        if (course.created_by != req.uid && course.status === CourseModel.COURSE_CREATED)
            return res.status(403).send("Permission denied")

        const chapters = await CourseModel.GetChapters(course_id)
        let sections = await CourseModel.GetSections(course_id)
        sections = sections.filter(s => {
            const status = (req.uid == s.created_by) ? CourseModel.COURSE_CREATED : CourseModel.COURSE_PUBLISHED
            return s.status >= status
        })

        return res.status(200).send({ course: course, chapters, sections })
    } catch (err) {
        _log('Retrieve course detail caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 创建课程
 */
router.post('/createCourse', async function (req, res) {
    const chapter_name = req.body.name || null
    const chapter_description = req.body.description || null

    if (!chapter_name || !validator.isLength(chapter_name, { min: 1, max: 64 }))
        return res.status(422).send('Invalid chapter name')

    if (!chapter_description || !validator.isLength(chapter_description, { min: 1, max: 255 }))
        return res.status(422).send('Invalid chapter description')

    try {
        if (await CourseModel.GetCourseByName(chapter_name))
            return res.status(422).send({ name: "Chapter name exists" })

        const course = await CourseModel.CreateCourse(chapter_name, chapter_description, req.uid)
        res.status(201).send(ret)
    } catch (err) {
        _log('Creating course detail caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 更新课程
 */
router.post('/updateCourse', async function (req, res) {
    const course_id = req.body.course_id
    const chapter_name = req.body.name || null
    const chapter_description = req.body.description || null

    // Validation
    if (!course_id || !validator.isInt(course_id))
        return res.status(422).send('Invalid course id')

    if (!chapter_name || !validator.isLength(chapter_name, { min: 1, max: 64 }))
        return res.status(422).send('Invalid chapter name')

    if (!chapter_description || !validator.isLength(chapter_description, { min: 1, max: 255 }))
        return res.status(422).send('Invalid chapter description')

    try {
        const course = await CourseModel.GetCourseById(course_id)
        if (!course)
            return res.status(404).send("Object not found")

        if (course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const course_data = {}
        !chapter_name || (course_data.name = chapter_name)
        !chapter_description || (course_data.description = chapter_description)

        const updated_course = await CourseModel.UpdateCourse(course_id, course_data)
        res.status(201).send(updated_course)
    } catch (err) {
        _log('Updating course (id:%s) detail caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 发布课程
 */
router.post('/publishCourse', async function (req, res) {
    const course_id = req.body.course_id || null

    if (!course_id || !validator.isInt(course_id))
        return res.status(422).send('Invalid course id')

    try {
        const course = await CourseModel.GetCourseById(course_id)
        if (!course)
            return res.status(404).send("Object not found")

        if (course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        if (course.status !== CourseModel.COURSE_CREATED)
            return res.status(422).send("Course was already published or deleted")

        const published_course = await CourseModel.UpdateCourse(course_id, { status: CourseModel.COURSE_PUBLISHED })
        return res.status(201).send(published_course)
    } catch (err) {
        _log('Publishing course (id:%s) detail caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router