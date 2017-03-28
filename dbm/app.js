const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const EventEmitter = require('events')
const mysql = require('./mysql')
let evt = new EventEmitter()

let app = express()
app.use(bodyParser.json())
app.use(function (req, res, next) {
    req.uid = req.get('x-uid')
    if (!req.uid) 
        return res.status(422).send('params missing: uid is required')
    next()
})

app.post('/db/mysql/:jobid', function (req, res) {
    let jobid = req.param('jobid')
    let uid = req.uid
    let status = null
    let name = getDatabaseName(uid, jobid)
    let user = generateUserName(uid, jobid)
    let passwd = generatePasswd(uid, jobid)
    getDatabase(name, user, passwd).then(() => {
        let data = {
            jobid: jobid,
            host: '127.0.0.1',
            port: 3306,
            db: name,
            user: user,
            passwd: passwd
        }
        return res
            .status(200)
            .send(data)
    }).catch(err => evt.emit('error', err, req, res))
})

app.listen(process.argv[2] || 8004, '127.0.0.1', (err) => {
    if (err) 
        throw err
    console.log(`listening on port ` + (process.argv[2] || 8004))
}).on('request', (r) => console.log(new Date().toLocaleString() + ' ' + r.headers.host + r.url))

evt.on('error', (err, req, res) => {
    res
        .status(500)
        .send(`服务器提出了一个问题: ${err.message}`)
    console.error(err)
})

/**
 * Get a database
 * @param {string} uid
 * @param {string} jobid
 * @param {string} name
 */
function getDatabase(name, user, passwd) {
    let conn = mysql()
    return deleteDatabase(conn, name).then(() => {
        return createDatabase(conn, name)
    }).then(() => grantDatabase(conn, name, user, passwd))
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
    return `mysql_passwd_${uid}_${jobid}_`+ Math.floor(Math.random()*1000)
}

/**
 * TODO
 * @param  conn
 * @param {string} name
 */
function createDatabase(conn, name) {
    return conn.query(`create database ${name}`)
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