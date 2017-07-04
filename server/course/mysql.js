const mysql = require("mysql")
const config = require("./db.js")
const util = require("util")

let pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.passwd,
    database: config.db
})

let GetConnection = function () {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) return reject(err)
            resolve(conn)
        })
    })
}

let Query = function (conn, sql) {
    return new Promise((resolve, reject) => {
        conn.query(sql, (error, results, fields) => {
            if (error) return reject(error)
            resolve([results, fields])
        })
    })
}

let Close = function () {
    return new Promise((resolve, reject) => {
        pool.end(function (err) {
            if (err) reject(err)
            resolve()
        })
    })
}

module.exports = {
    GetConnection,
    Query,
    Close
}