const mysql = require("mysql")
const fs = require("fs-extra")
const util = require("util")
const path = require("path")

let config = fs.readJsonSync(path.join(__dirname, 'db.json'))

let _pool = mysql.createPool({
    connectionLimit: config.connectionLimit || 10,
    host: config.host || "localhost",
    port: config.port || 3306,
    user: config.user,
    password: config.passwd,
    database: config.database
})


function Query(sql, values = []) {
    return new Promise((resolve, reject) => {
        _pool.query(sql, values, (error, results, fields) => {
            if (error) return reject(error)
            resolve([results, fields])
        })
    })
}

let Close = function () {
    return new Promise((resolve, reject) => {
        _pool.end(function (err) {
            if (err) reject(err)
            resolve()
        })
    })
}

module.exports = {
    Query,
    Close
}