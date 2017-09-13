const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const mysql = require('./mysql')

let app = express()
app.use(bodyParser.json())

app.post('/getMysqlForJob', async function (req, res) {
    const jobid = req.query.jobId
    const uid = req.query.uid

    try {
        const data = {
            jobid, host: '127.0.0.1', port: 3306,
            db: getDatabaseName(uid, jobid),
            user: generateUserName(uid, jobid),
            passwd: generatePasswd(uid, jobid)
        }
        await getDatabase(data.db, data.user, data.passwd)

        return res.status(200).send(data)
    } catch (err) {
        console.error(err)
        return res.status(500).send(`服务器提出了一个问题: ${err.message}`)
    }
})

const server = app.listen(process.argv[2] || 8004, '127.0.0.1', (err) => {
    if (err)
        throw err
    console.log(`listening on port ` + (process.argv[2] || 8004))
})

server.on('request', function (r) {
    const time = new Date().toLocaleString()
    console.log(`${time}  ${r.headers.host} ${r.url}`)
})

/**
 * Get a database
 * @param {string} uid
 * @param {string} jobid
 * @param {string} name
 */
async function getDatabase(name, user, passwd) {
    let conn = mysql()
    await deleteDatabase(conn, name)
    await createDatabase(conn, name)
    await grantDatabase(conn, name, user, passwd)
}

/**
 * Get a database name
 * @param {string} uid
 * @param {string} jobid
 */
function getDatabaseName(uid, jobid) {
    return `mysql_db_${uid}_${jobid}`
}

/**
 * Generate User Name
 * @param {string} uid
 * @param {string} jobid
 */
function generateUserName(uid, jobid) {
    return `mysql_user_${uid}_${jobid}`
}

/**
 * Generate a temporary password
 * @param {string} uid
 * @param {string} jobid
 */
function generatePasswd(uid, jobid) {
    return `mysql_passwd_${uid}_${jobid}_` + Math.floor(Math.random() * 1000)
}

/**
 * TODO
 * @param  conn
 * @param {string} name
 */
function createDatabase(conn, name) {
    return conn.query(`create database ${name} CHARACTER SET utf8 COLLATE utf8_unicode_ci`)
}

/**
 * TODO
 * @param {*} conn
 * @param {string} name
 */
function deleteDatabase(conn, name) {
    return conn.query(`drop database if exists ${name}`)
}

function grantDatabase(conn, name, user, passwd) {
    let sql = `GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER ON ${name}.* TO ${user}@'%' IDENTIFIED BY '${passwd}'`
    return conn.query(sql)
}