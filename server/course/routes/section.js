const express = require("express")
const course = require("../dal/course")

let router = express.Router()


router.get('/getSectionDetail', async function (req, res) {
    req.checkQuery('id').notEmpty().isInt({min: 1})

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty)
        return res.status(422).send(errors.mapped())

    let section = await course.GetSection(req.query.id)
    if (!section)
        return res.status(404).send("Section not exists")

    if (req.uid != section.created_by && section.status === course.COURSE_CREATED)
        return res.status(403).send("Permisson denied")

    return res.status(200).send(section)
})

/**
 * 创建小节
 */
router.post('/createSection', async function (req, res) {
    req.checkBody('course_id').notEmpty().isInt({min: 1})
    req.checkBody('chapter_id').notEmpty().isInt({min: 1})
    req.checkBody('name').notEmpty().isLength(1, 64)
    req.checkBody('description').notEmpty().isLength(1, 255)
    req.checkBody('image').notEmpty()

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
        template_id,
        seq,
        env,
        req.uid)

    return res.status(200).send(section)
})


module.exports = router