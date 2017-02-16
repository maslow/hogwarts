const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const EventEmitter = require('events')
const request = require('request')

const eval = require('./eval.js')

let evt = new EventEmitter()
let config = fs.readJsonSync(path.join(__dirname, 'config.json'))
let jobsBasePath = config.jobsBasePath
let jobs_server = config.jobs_server

let app = express()
app.use(bodyParser.json())
app.use(function (req, res, next) {
    req.uid = req.get('x-uid')
    if (!req.uid)
        return res.status(422).send('params missing: uid is required')
    next()
})

app.post('/eval/:jobid', function (req, res) {
    let job_id = req.param('jobid')

    let codespath = path.join(jobsBasePath, job_id)

    let status = null
    getJob(req.uid, job_id)
        .then(data => {
            status = data.job.status
            return eval(codespath, data.lang, data.tester)
        })
        .then(data => {
            let s = data.ok ? 1 : -1
            if (status === s)
                return res.status(200).send(data)
            return setJobStatus(req.uid, job_id, status).then(() => res.status(200).send(data))
        })
        .catch(err => evt.emit('error', err, req, res))
})

const server = app.listen(process.argv[2] || 8003, '127.0.0.1', (err) => {
    if (err) throw err
    let host = server.address().address;
    let port = server.address().port;
    console.log(`listening on port ${host}:${port}`)
})

evt.on('error', (err, req, res) => {
    res.status(500).send(`服务器提出了一个问题: ${err.message}`)
    console.error(err)
})
server.on('request', (r) => console.log(new Date().toLocaleString() + ' ' + r.headers.host + r.url))

function setJobStatus(uid, jobid, status) {
    return new Promise((resolve, reject) => {
        let _url = jobs_server + `/jobs/${jobid}/status/${status}`
        request({
            url: _url,
            method: 'POST',
            headers: {
                'x-uid': uid
            }
        }, (err, response, body) => {
            if (err) return reject(err)
            if (response.statusCode === 200) {
                resolve(JSON.parse(body))
            } else {
                reject(response)
            }
        })
    })
}

function getJob(uid, jobid) {
    return new Promise((resolve, reject) => {
        let _url = jobs_server + `/jobs/${jobid}`
        request({
            url: _url,
            headers: {
                'x-uid': uid
            }
        }, (err, response, body) => {
            if (err) return reject(err)
            if (response.statusCode === 200) {
                resolve(JSON.parse(body))
            } else {
                reject(response)
            }
        })
    })
}