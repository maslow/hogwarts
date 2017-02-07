const filterFiles = require('./filter.js')

filterFiles(process.argv[2], process.argv[3], function (err, files) {
    if (err) return console.error(err)
    files.forEach(f => console.log(f))
})