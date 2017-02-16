/**
 * Created by wangfugen on 7/28/16.
 */

let conn = require('./mysql')()

let createSql = "CREATE TABLE users (" +
    "id int NOT NULL AUTO_INCREMENT, " +
    "email varchar(255) NOT NULL," +
    "password_hash varchar(64) NOT NULL, " +
    "PRIMARY KEY (id)," +
    "UNIQUE (email)" +
    ")"

let dropSql = "DROP TABLE users"

let cmd = process.argv[2] || 'init'

if (cmd === 'init')
    execute(createSql)
else if (cmd === 'clear')
    execute(dropSql)
else
    console.error('Unacceptable Command')

function execute(sql) {
    conn.query(sql)
        .then(() => console.log('Done!'))
        .catch(err => console.error(err.message))
        .then(() => conn.close())
}
