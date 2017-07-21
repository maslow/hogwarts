const express = require("express")
const $ = require("validator")

const course = require("../dal/course")
const template = require("../dal/template")

let router = express.Router()

router.get('/getSectionDetail', async function (req, res) {
    let id = req.query.id
    if (validator.isInt(id, {min: 1})) 
        return res.status(422).send('Invalid section id')

    let section = await course.GetSection(id)
    if (!section) 
        return res.status(422).send("Section not exists")

    if (req.uid != section.created_by && section.status === course.COURSE_CREATED) 
        return res.status(403).send("Permisson denied")

    return res
        .status(200)
        .send(section)
})

/**
 * 创建小节
 */
router.post('/createSection', async function (req, res) {
    req
        .checkBody('course_id')
        .notEmpty()
        .isInt({min: 1})
    req
        .checkBody('chapter_id')
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
    req
        .checkBody('image')
        .notEmpty()

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty()) 
        return res.status(422).send(errors.mapped())

    let courseId = req.body.course_id
    let seq = req.body.seq || 50
    let template_id = req.body.template_id || 0

    let course0 = await course.GetCourseById(courseId)
    if (!course0) 
        return res.status(422).send("Course not found")

    if (course0.created_by != req.uid) 
        return res.status(401).send('Permission denied')

    if (!await course.GetChapterById(courseId, req.body.chapter_id)) 
        return res.status(422).send({chapter_id: "Chapter Id is invalid"})

    let env = {
        image: req.body.image
    }

    let section = await course.CreateSection(courseId, req.body.chapter_id, req.body.name, req.body.description, template_id, seq, env, req.uid)

    return res
        .status(200)
        .send(section)
})

/**
 * 更新章节
 */
router.post('/updateSection', async function (req, res) {
    let section_id = req.body.section_id
    let name = req.body.name || null
    let description = req.body.description || null
    let seq = req.body.seq || null
    let template_id = req.body.template_id || null
    let image = req.body.image || null

    /* Validations */
    // TODO templateId (if exists)

    let section = await course.GetSection(section_id)
    if (!section) 
        return res.status(422).send("Section not found")

    if (section.created_by != req.uid) 
        return res.status(401).send('Permission denied')

    let data = {}
    !name || (data.name = name)
    !description || (data.description = description)
    !seq || (data.seq = seq)
    !template_id || (data.template_id = template_id)

    if (image !== null) {
        data.env = section.env
        data.env.image = image
    }
    let rets = await course.UpdateSection(section_id, data)
    return res
        .status(200)
        .send(rets)
})

module.exports = router