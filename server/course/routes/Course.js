const express = require("express")
const debug = require('debug')
const validator = require('validator')

const CourseMetaModel = require('../model/CourseMeta')
const CourseChapterModel = require('../model/CourseChapter')
const CourseSectionModel = require('../model/CourseSection')

const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * Get published courses
 */
router.get('/getPublishedCourses', async function (req, res) {
    try {
        const courses = await CourseMetaModel.find({ status: 'published' })
        res.status(200).send(courses)
    } catch (err) {
        _log('Retrieve published courses caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Get user courses
 */
router.get('/getUserCourses', async function (req, res) {
    const user_id = req.query.uid

    try {
        const courses = await CourseMetaModel
            .find({ created_by: user_id })
            .where({ status: 'published' })
        return res.status(200).send(courses)
    } catch (err) {
        _log('Retrieve user (id:%s) courses caught an error: %o', user_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Get own courses
 */
router.get('/getOwnCourses', async function (req, res) {
    const user_id = req.uid
    try {
        const courses = await CourseMetaModel.find({ created_by: user_id })
        return res.status(200).send(courses)
    } catch (err) {
        _log('Retrieve user (id:%s) courses caught an error: %o', user_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Get course detail
 */
router.get('/getCourse', async function (req, res) {
    const course_id = req.query.id

    try {
        // find course
        const course = await CourseMetaModel.findById(course_id)
        if (!course)
            return res.status(404).send("Course not found")

        // perform permission checking
        if (course.created_by != req.uid && course.status === 'unpublished')
            return res.status(403).send("Permission denied")

        // find relevant chapters & sections
        const chapters = await CourseChapterModel.find({ course_id: course._id })
        const sections = await CourseSectionModel.find({ course_id: course._id }).where({status:'published'})

        // return them in a Object
        return res.status(200).send({ course, chapters, sections })
    } catch (err) {
        _log('Retrieve course detail caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Get own course detail
 */
router.get('/getOwnCourse', async function (req, res) {
    const course_id = req.query.id
    const user_id = req.uid
    try {
        // find course
        const course = await CourseMetaModel.findById(course_id)
        if (!course)
            return res.status(404).send("Course not found")

        // perform permission checking
        if (course.created_by != user_id)
            return res.status(403).send("Permission denied")

        // find relevant chapters & sections
        const chapters = await CourseChapterModel.find({ course_id: course._id })
        const sections = await CourseSectionModel.find({ course_id: course._id })

        // return them in a Object
        return res.status(200).send({ course, chapters, sections })
    } catch (err) {
        _log('Retrieve course detail caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Create course
 */
router.post('/createCourse', async function (req, res) {
    const course_name = req.body.name
    const course_description = req.body.description

    try {
        const course = new CourseMetaModel({ name: course_name, desc: course_description, created_by: req.uid })
        const created_course = await course.save()
        res.status(201).send(created_course)
    } catch (err) {
        _log('Creating course detail caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Update course
 */
router.post('/updateCourse', async function (req, res) {
    const course_id = req.body.course_id
    const course_name = req.body.name
    const course_description = req.body.description

    try {
        // find course for updating
        const course = await CourseMetaModel.findById(course_id)
        if (!course)
            return res.status(404).send('Course not found')

        // permission checking
        if (course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // update course with given fields
        if (course_name) course.name = course_name
        if (course_description) course.desc = course_description

        // save & return it
        await course.save()
        return res.status(201).send(course)
    } catch (err) {
        _log('Updating course (id:%s) detail caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Publish course
 */
router.post('/publishCourse', async function (req, res) {
    const course_id = req.body.id

    try {
        // find course for publishing
        const course = await CourseMetaModel.findById(course_id)
        if (!course)
            return res.status(404).send('Object not found')

        // permission checking
        if (course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // return if course is already published
        if (course.status !== 'unpublished')
            return res.status(422).send('Course was already published')

        // update course status
        course.status = 'published'

        // save & return it
        await course.save()
        return res.status(201).send(course)
    } catch (err) {
        _log('Publishing course (id:%s) detail caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Unpublish course
 */
router.post('/unpublishCourse', async function (req, res) {
    const course_id = req.body.id

    try {
        // find course for publishing
        const course = await CourseMetaModel.findById(course_id)
        if (!course)
            return res.status(404).send('Object not found')

        // permission checking
        if (course.created_by != req.uid)
            return res.status(401).send('Permission denied')

        // return if course is already published
        if (course.status !== 'published')
            return res.status(422).send('Course was already unpublished')

        // update course status
        course.status = 'unpublished'

        // save & return it
        await course.save()
        return res.status(201).send(course)
    } catch (err) {
        _log('Unpublishing course (id:%s) detail caught an error: %o', course_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router