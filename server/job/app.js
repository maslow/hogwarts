const express = require("express")
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(function (req, res, next) {
    req.uid = req.get('x-uid')
    next()
})

/**
 * Routes
 */
app.use(require("./routes/job"))
app.use(require("./routes/code"))

const port = process.argv[2] || 8002
app.listen(port, '127.0.0.1', () => console.log(`listening on ${port}`))