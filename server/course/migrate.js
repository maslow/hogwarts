/**
 * Created by wangfugen on 7/28/16.
 */

let mysql = require("mysql")
let path = require("path")
let config = require("./db.js")

let connection = mysql.createConnection({
    host: config.host,
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

let createSql0 = `
CREATE TABLE course (
    id int NOT NULL AUTO_INCREMENT, 
    name varchar(64) NOT NULL,
    description varchar(255), 
    status int DEFAULT 0 NOT NULL,
    created_by int NOT NULL,
    created_at int NOT NULL,
    updated_at int NOT NULL,
    PRIMARY KEY (id)
);
`

let createSql1 = `
CREATE TABLE chapter (
    id int NOT NULL AUTO_INCREMENT, 
    course_id int NOT NULL,
    name varchar(64) NOT NULL,
    description varchar(255),
    seq int default 0, 
    created_at int NOT NULL,
    updated_at int NOT NULL,
    PRIMARY KEY (id)
);
`
let createSql2 = `
CREATE TABLE section (
    id int NOT NULL AUTO_INCREMENT, 
    course_id int NOT NULL,
    chapter_id int NOT NULL,
    name varchar(64) NOT NULL,
    description varchar(255),
    seq int default 0,
    status int default 0,
    env JSON,
    created_by int NOT NULL,
    created_at int NOT NULL,
    updated_at int NOT NULL,
    PRIMARY KEY (id)
);
`

let dropSql = `DROP DATABASE ${config.db}`

main()

async function main() {
    let cmd = process.argv[2] || 'init'

    try {
        if (cmd === 'init') {
            await Query(createDbSql)
            await Query(`use ${config.db};`)
            await Query(createSql0)
            await Query(createSql1)
            await Query(createSql2)
        } else if (cmd === 'clear') {
            let ret = await Query(dropSql)
        } else
            console.error('Unacceptable Command')
    } catch (err) {
        console.log(err)
    }
    connection.end()
}