const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
    fs.createReadStream(process.argv[3]).pipe(res)
}).listen(process.argv[2])