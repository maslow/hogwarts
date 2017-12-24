const express = require("express")
const body_parser = require('body-parser')
const expressValidator = require('express-validator')
const debug = require('debug')

const app = express()
const _log = debug('COURSE:PROD')
const _debug = debug('COURSE:DEV')

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))

app.use(function (req, res, next) {
    _log('Accept [%s %s %s] request from [%s]', req.hostname, req.method, req.url, req.ip)    
    req.uid = req.get('x-uid')
    next()
})

app.use(expressValidator())

/**
 * Routes
 */
app.use(require("./routes/course"))
app.use(require("./routes/chapter"))
app.use(require("./routes/section"))
app.use(require('./routes/code'))
app.use(require('./routes/template'))
app.use(require('./routes/tests'))
app.use(require('./routes/document'))

const port = process.argv[2] || 80
app.listen(port,  () => _log(`listening on ${port}`))