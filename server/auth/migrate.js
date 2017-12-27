/**
 * Created by wangfugen on 7/28/16.
 */
let mysql = require("mysql")
let path = require("path")
let fs = require("fs-extra")
let config = fs.readJsonSync(path.join(__dirname, 'db.json'))

let connection = mysql.createConnection({
    host: process.env['SERVER_MYSQL'] || config.host || "localhost",
    port: config.port || 3306,
    user: config.user,
    password: config.passwd
})

connection.connect()

let Query = function (sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error) return reject(error)
            return resolve(results)
        })
    })
}

let createDbSql = `create database ${config.db} CHARACTER SET utf8 COLLATE utf8_unicode_ci;`


let createSql = "CREATE TABLE users (" +
    "id int NOT NULL AUTO_INCREMENT, " +
    "email varchar(255) NOT NULL," +
    "password_hash varchar(64) NOT NULL, " +
    "PRIMARY KEY (id)," +
    "UNIQUE (email)" +
    ")"

let dropSql = `DROP DATABASE ${config.db};`

main()

async function main() {
    let cmd = process.argv[2] || 'init'

    try {
        if (cmd === 'init') {
            await Query(createDbSql)
            await Query(`use ${config.db};`)
            await Query(createSql)
        } else if (cmd === 'clear') {
            let ret = await Query(dropSql)
        } else
            console.error('Unacceptable Command')
    } catch (err) {
        console.log(err)
    }
    connection.end()
}