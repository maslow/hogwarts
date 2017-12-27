const express = require("express")
const body_parser = require('body-parser')
const debug = require('debug')
const mongoose = require('mongoose')

const app = express()
const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

// init database connection
mongoose.Promise = Promise
const uri = `mongodb://mongo.hogwarts/tech_job`
mongoose.connect(uri, { useMongoClient:true })

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    req.uid = req.get('x-uid')
    _log('Accept [%s %s %s] request from [%s]', req.hostname, req.method, req.url, req.ip)
    next()
})

/**
 * Routes
 */
app.use(require("./routes/job"))
app.use(require("./routes/code"))


const port = process.argv[2] || 80
app.listen(port, () => _log(`listening on ${port}`))