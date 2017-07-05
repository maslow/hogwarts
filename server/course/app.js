const express = require("express")
const mysql = require("./mysql.js")
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

const status = {
    COURSE_DELETED: -1,
    COURSE_CREATED: 0,
    COURSE_PUBLISHED: 1,
    COURSE_MODIFIED: 2
}

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

app.get('/courses', async function (req, res) {
    let [results] = await mysql.Query("select * from course where status >= ? or (status = ? and created_by = ?)", [status.COURSE_PUBLISHED, status.COURSE_CREATED, req.uid])
    res.status(200).send(results)
})

app.get('/courses/:id', async function (req, res) {
    req.checkParams('id').notEmpty().isInt()
    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let sql = "select * from course where id = ? and  (status >= ? or (status = ? and created_by = ?))"
    let [ret] = await mysql.Query(sql, [req.params.id, status.COURSE_PUBLISHED, status.COURSE_CREATED, req.uid])
    if (ret.length === 0)
        return res.status(404).send({
            id: "Object not found"
        })

    return res.status(200).send(ret[0])
})

app.post('/courses', async function (req, res) {
    req.checkBody('name')
        .notEmpty().withMessage('Name is required')
        .isLength({
            min: 1,
            max: 64
        })

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let [ret] = await mysql.Query("select * from course where name = ?", [req.body.name])
    if (ret.length) {
        console.log(ret)
        return res.status(422).send({
            name: "Name exist"
        })
    }
    let timestamp = Math.round(new Date().getTime() / 1000)
    let createCourseSql = "insert into course set ?"
    let params = {
        name: req.body.name,
        description: req.body.description,
        created_by: req.uid,
        created_at: timestamp,
        updated_at: timestamp
    }
    let [results] = await mysql.Query(createCourseSql, params)
    let [results0] = await mysql.Query("select * from course where `id` = ?", [results.insertId])
    res.status(201).send(results0)
})

app.listen(process.argv[2] || 8001, '127.0.0.1', () => console.log(`listening on 8001`))