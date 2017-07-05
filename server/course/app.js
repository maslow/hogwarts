const express = require("express")
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const course = require("./course.js")
let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(function (req, res, next) {
    req.uid = req.get('x-uid')
    next()
})

app.use(expressValidator())

/* ----------------- Course APIs ------------------*/
app.get('/courses', async function (req, res) {
    let results = await course.GetCourses(req.uid)
    res.status(200).send(results)
})

app.get('/courses/:id', async function (req, res) {
    req.checkParams('id').notEmpty().isInt()
    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let ret = await course.GetCourseById(req.params.id, req.uid)
    if (!ret)
        return res.status(404).send({
            id: "Object not found"
        })

    return res.status(200).send(ret)
})

app.post('/courses', async function (req, res) {
    req.checkBody('name')
        .notEmpty().withMessage('Name is required')
        .isLength({
            min: 1,
            max: 64
        })
    req.checkBody('description')
        .notEmpty()
        .isLength({
            min: 1,
            max: 256
        })
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

/* --------------- Chapters APIs ------------------- */
app.get('/courses/:cid/chapters', async function (req, res) {
    req.checkParams('cid').notEmpty().isInt()
    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    if (!await course.GetCourseById(req.params.cid, req.uid))
        return res.status(422).send({
            cid: "Course Id is invalid"
        })
    let chapters = await course.GetChapters(req.params.cid)
    return res.status(200).send(chapters)
})

app.post('/courses/:cid', async function (req, res) {
    req.checkParams('cid').notEmpty().isInt()
    req.checkBody('name').notEmpty().isLength({
        min: 1,
        max: 64
    })
    req.checkBody('description').notEmpty().isLength({
        min: 1,
        max: 256
    })
    req.checkBody('seq').notEmpty().isInt()
    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    if (!await course.GetCourseById(req.params.cid, req.uid))
        return res.status(422).send({
            cid: "Course Id is invalid"
        })

    let chapter = await course.CreateChapter(req.params.cid, req.body.name, req.body.description, req.body.seq)
    return res.status(201).send(chapter)
})

/* --------------- Sections APIs ------------------- */

app.get('/courses/:cid/sections', async function (req, res) {
    req.checkParams('cid').notEmpty().isInt()
    let errors = await req.getValidationResult()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    if (!await course.GetCourseById(req.params.cid, req.uid))
        return res.status(422).send({
            cid: "Course Id is invalid"
        })

    let sections = await course.GetSections(req.params.cid, req.uid)
    return res.status(200).send(sections)
})

app.post('/courses/:cid/sections', async function (req, res) {
    req.checkParams('cid').notEmpty().isInt()
    req.checkBody('chapter_id').notEmpty().isInt()
    req.checkBody('name').notEmpty().isLength({
        min: 1,
        max: 64
    })
    req.checkBody('description').notEmpty().isLength({
        min: 1,
        max: 255
    })
    req.checkBody('seq').notEmpty().isInt()
    req.checkBody('image').notEmpty()
    
    let errors = await req.getValidationResult()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    if (!await course.GetCourseById(req.params.cid, req.uid))
        return res.status(422).send({
            cid: "Course Id is invalid"
        })

    if (!await course.GetChapterById(req.params.cid, req.body.chapter_id))
        return res.status(422).send({
            chapter_id: "Chapter Id is invalid"
        })

    let env = {
        image: req.body.image
    }

    let section = await course.CreateSection(
        req.params.cid,
        req.body.chapter_id,
        req.body.name,
        req.body.description,
        req.body.seq,
        env,
        req.uid)

    return res.status(200).send(section)
})
app.post('')

app.listen(process.argv[2] || 8001, '127.0.0.1', () => console.log(`listening on 8001`))