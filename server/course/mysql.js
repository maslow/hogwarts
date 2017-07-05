const mysql = require("mysql")
const config = require("./db.js")
const util = require("util")

let _pool = mysql.createPool({
    connectionLimit: 100,
    host: config.host,
    user: config.user,
    password: config.passwd,
    database: config.db
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