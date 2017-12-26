const express = require("express")
const debug = require('debug')
const validator = require('validator')

const CourseMetaModel = require('../model/CourseMeta')
const CourseChapterModel = require('../model/CourseChapter')
const CourseSectionModel = require('../model/CourseSection')

//const CourseModel = require("../model/course")
const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * 获取所有已发布的课程列表
 */
router.get('/getPublishedCourses', async function (req, res) {
    try {
        // let courses = await CourseModel.GetCourses()
        // courses = courses.filter(c => c.status == CourseModel.COURSE_PUBLISHED)
        const courses = await CourseMetaModel.find({status: 1})
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
    const user_id = req.query.uid
    if (!user_id)
        return res.status(422).send('User Id can not be empty')

    try {
        // let courses = await CourseModel.GetCoursesByUserId(user_id)
        // courses = courses.filter(c => {
        //     const s = (req.uid == user_id) ? CourseModel.COURSE_CREATED : CourseModel.COURSE_PUBLISHED
        //     return c.status >= s
        // })
        let courses = await CourseMetaModel.find({ created_by: user_id })
        courses = courses.filter(c => {
            if (req.uid == user_id)
                return (c.status == 0 || c.status == 1)
            else
                return c.status == 1
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
    const course_id = req.query.id

    try {
        // const course = await CourseModel.GetCourseById(course_id)
        // if (!course)
        //     return res.status(404).send("Object not found")

        // if (course.created_by != req.uid && course.status === CourseModel.COURSE_CREATED)
        //     return res.status(403).send("Permission denied")

        // const chapters = await CourseModel.GetChapters(course_id)
        // let sections = await CourseModel.GetSections(course_id)
        // sections = sections.filter(s => {
        //     const status = (req.uid == s.created_by) ? CourseModel.COURSE_CREATED : CourseModel.COURSE_PUBLISHED
        //     return s.status >= status
        // })
        const course = await CourseMetaModel.findById(course_id)
        if(!course)
            return res.status(404).send("Course not found")

        if (course.created_by != req.uid && course.status === 0)
            return res.status(403).send("Permission denied")

        const chapters = await CourseChapterModel.find({course_id: course._id})
        const sections = await CourseSectionModel.find({course_id: course._id})
        return res.status(200).send({ course, chapters, sections })
    } catch (err) {
        _log('Retrieve course detail caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 创建课程
 */
router.post('/createCourse', async function (req, res) {
    const course_name = req.body.name
    const course_description = req.body.description

    try {
        // if (await CourseModel.GetCourseByName(course_name))
        //     return res.status(422).send({ name: "Chapter name exists" })

        // const course = await CourseModel.CreateCourse(course_name, course_description, req.uid)

        const course = new CourseMetaModel({name: course_name, desc: course_description, created_by: req.uid})
        const created_course = await course.save()
        res.status(201).send(created_course)
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
    const course_name = req.body.name
    const course_description = req.body.description

    try {
        // const course = await CourseModel.GetCourseById(course_id)
        // if (!course)
        //     return res.status(404).send("Object not found")

        // if (course.created_by != req.uid)
        //     return res.status(401).send('Permission denied')

        // const course_data = {}
        // !course_name || (course_data.name = course_name)
        // !course_description || (course_data.description = course_description)

        // const updated_course = await CourseModel.UpdateCourse(course_id, course_data)
        // res.status(201).send(updated_course)

        const course = await CourseMetaModel.findById(course_id)
        if(!course)
            return res.status(404).send('Course not found')

        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        if(course_name) course.name = course_name
        if(course_description) course.desc = course_description
        !course_description || (course.desc = course_description)

        await course.save()
        return res.status(201).send(course)
    } catch (err) {
        _log('Updating course (id:%s) detail caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * 发布课程
 */
router.post('/publishCourse', async function (req, res) {
    const course_id = req.body.id

    try {
        // const course = await CourseModel.GetCourseById(course_id)
        // if (!course)
        //     return res.status(404).send("Object not found")

        // if (course.created_by != req.uid)
        //     return res.status(401).send('Permission denied')

        // if (course.status !== CourseModel.COURSE_CREATED)
        //     return res.status(422).send("Course was already published or deleted")

        // const published_course = await CourseModel.UpdateCourse(course_id, { status: CourseModel.COURSE_PUBLISHED })

        const course = await CourseMetaModel.findById(course_id)
        if(!course)
            return res.status(404).send('Object not found')

        if(course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        if(course.status !== 0)
            return res.status(422).send('Course was already published or deleted')

        course.status = 1
        await course.save()
        return res.status(201).send(course)
    } catch (err) {
        _log('Publishing course (id:%s) detail caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router