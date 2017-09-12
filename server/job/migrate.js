
const mysql = require("mysql")
const path = require("path")
const fs = require("fs-extra")
const config = fs.readJsonSync(path.join(__dirname, 'db.json'))

const connection = mysql.createConnection({
    host: config.host || "localhost",
    port: config.port || 3306,
    user: config.user,
    password: config.passwd
})

connection.connect()

const Query = function (sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error) return reject(error)
            return resolve(results)
        })
    })
}

const createDbSql = `create database ${config.database} CHARACTER SET utf8 COLLATE utf8_unicode_ci;`

const createSql0 = `
CREATE TABLE job (
    id int NOT NULL AUTO_INCREMENT, 
    uid varchar(64) NOT NULL UNIQUE,
    sectionId varchar(255), 
    status int DEFAULT 0 NOT NULL,
    updated_at int NOT NULL,
    PRIMARY KEY (id)
);
`

const dropSql = `DROP DATABASE ${config.database}`

main()

async function main() {
    const cmd = process.argv[2] || 'init'

    try {
        if (cmd === 'init') {
            await Query(createDbSql)
            await Query(`use ${config.database};`)
            await Query(createSql0)
        } else if (cmd === 'clear') {
            await Query(dropSql)
        } else
            console.error('Unacceptable Command')
    } catch (err) {
        console.log(err)
    }
    connection.end()
}