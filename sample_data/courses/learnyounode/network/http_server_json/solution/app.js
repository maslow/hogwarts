const http = require('http')
const url = require('url')

http.createServer(function (req, res) {
    let parsedUrl = url.parse(req.url, true)
    let t = parsedUrl.query.t
    if (parsedUrl.pathname === '/api/unixtime') {
        if (!t) {
            res.writeHead(422)
            res.end('query param missing: t')
        }
        let date = new Date()
        date.setTime(t)
        let formattedTime = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        }
        res.writeHead(200)
        res.end(JSON.stringify(formattedTime))
    } else {
        res.writeHead(404)
        res.end('Not Found')
    }
}).listen(process.argv[2])