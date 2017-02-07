const net = require('net')

let server = net.createServer(function (socket) {
    let t = new Date()
    let year = t.getFullYear()
    let month = t.getMonth() + 1
    let day = t.getDate()
    let hour = t.getHours()
    let min = t.getMinutes()
    let time = `${year}-${month}-${day} ${hour}:${min}`
    socket.write(time)
    socket.end()
})

server.listen(process.argv[2])