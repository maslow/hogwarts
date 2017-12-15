const express = require("express")
const body_parser = require('body-parser')

const app = express()

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    req.uid = req.get('x-uid')
    next()
})

/**
 * Routes
 */
app.use(require("./routes/job"))
app.use(require("./routes/code"))

const port = process.argv[2] || 80
app.listen(port, '0.0.0.0', () => console.log(`listening on ${port}`))