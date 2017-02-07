const fs = require('fs')
const path = require('path')

module.exports = function (filespath, extname, callback) {
    fs.readdir(filespath, function (err, files) {
        if (err) return callback(err)
        callback(null, files.filter(f => path.extname(f) === `.${extname}`))
    })
}