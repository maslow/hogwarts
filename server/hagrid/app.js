/** 
 * Proxy Gate
 *
 * 1. Get service by url's pathname from services list. Response 404 if no service matched
 * 2. Proxy the service to target server directly if the service needn't to be authrized
 * 3. Validate the token before proxy services that should be authrized
 *    i.   Parse token from request object
 *    ii.  Validate token by calling the api provided by auth service
 *    iii. Proxy the service to target server if the token is valid
 */

const httpProxy = require('http-proxy')
const https = require('https')
const url = require('url')
const request = require('request')
const fs = require('fs-extra')
const path = require('path')
const express = require('express')

const {
    servers,
    services
} = require('./services.js')

// let config = fs.readJsonSync(path.join(__dirname, 'config.json'))
// let keyPath = config.ssl_key
// let certPath = config.ssl_cert

// let options = {
//     key: fs.readFileSync(keyPath, 'utf8'),
//     cert: fs.readFileSync(certPath, 'utf8')
// }

let app = express()
let proxy = httpProxy
    .createProxyServer({})
    .on('error', (err, req, res) => {
        console.error(err)
        res.writeHead(502)
        res.end('Something went wrong')
    })

app.all('*', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Authorization,Content-Type")
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    next()
})

app.options('*', (req, res) => res.send())

services.forEach(function (service) {
    let handler = proxy_to(service.target, service.auth)
    service.routes.forEach((route) => app.all(route, handler))
})

const server = app
    .listen(process.argv[2] || 8888, '127.0.0.1', (err) => {
        if (err) throw err
        let host = server.address().address;
        let port = server.address().port;
        console.log(`listening on port ${host}:${port}`)
    })
    .on('request', (r) => console.log(new Date().toLocaleString() + ' ' + r.headers.host + r.url))

function proxy_to(target, auth) {
    let handler = function (req, res) {
        let token = parseToken(req)
        if (!token && auth === false) {
            return proxy.web(req, res, {
                target: target
            })
        }

        if (!token)
            return res.status(407).send('Unauthroized Request : INVALID TOKEN')

        validateToken(token)
            .then(payload => {
                req.headers['x-uid'] = payload.uid
                req.headers['x-token-expire'] = payload.expire
                proxy.web(req, res, {
                    target: target
                })
            }).catch(err => {
                res.status(407).send('Unauthroized Request: TOKEN VALIDATION FAILED')
            })
    }
    return handler
}

function parseToken(req) {
    if (!('authorization' in req.headers)) return false
    let token = req.headers['authorization'].split('Bearer ').slice(1).join().trim()
    if (!token || !token.length) return false
    return token
}

function validateToken(token) {
    return new Promise((resolve, reject) => {
        let _url = servers.AUTH + `/tokens?token=${token}`
        request(_url, (err, response, body) => {
            if (err) return reject(err)
            if (response.statusCode === 200) {
                let payload = JSON.parse(body)
                resolve(payload)
            } else {
                reject(response)
            }
        })
    })
}