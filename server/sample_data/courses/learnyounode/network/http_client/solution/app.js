const http = require('http')

http.get(process.argv[2], response => {
    let buffers = []
    response.on('data', data => buffers.push(data.toString()))
    response.on('end', () => {
        console.log(buffers.join(''))
    })
})