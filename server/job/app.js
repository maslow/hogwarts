const express = require("express")
const body_parser = require('body-parser')
const debug = require('debug')

const app = express()
const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

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