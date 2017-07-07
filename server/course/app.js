const express = require("express")
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

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

/**
 * Routes
 */
app.use(require("./routes/course"))
app.use(require('./routes/code'))

app.listen(process.argv[2] || 8001, '127.0.0.1', () => console.log(`listening on 8001`))