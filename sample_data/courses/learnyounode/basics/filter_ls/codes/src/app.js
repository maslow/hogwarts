const fs = require('fs')
const path = require('path')

fs.readdir(process.argv[2], function (err, files) {
    files
        .filter(f => path.extname(f) === '.' + process.argv[3])
        .forEach(f => console.log(f))
})