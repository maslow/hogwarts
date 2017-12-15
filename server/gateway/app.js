/** 
 * Proxy Gate
 */

const httpProxy = require('http-proxy')
const url = require('url')
const request = require('request')
const fs = require('fs-extra')
const path = require('path')
const express = require('express')

const { servers, services } = require('./services.js')

const app = express()
const proxy = httpProxy.createProxyServer({})

proxy.on('error', (err, req, res) => {
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

app.all('*', async function (req, res) {
    const urlObj = url.parse(req.url)
    const pn = urlObj.pathname
    let auth = false, target = null
    for (let i = 0; i < services.length; i++) {
        for (let j = 0; j < services[i].routes.length; j++) {
            const r = services[i].routes[j]
            if (r == pn) {
                target = services[i].target
                auth = services[i].auth
                break
            }
        }
        if (target) break
    }

    if (!target)
        return res.status(502).send('Gateway Not Found')

    const token = parseToken(req)
    if (!token && auth === false)
        return proxy.web(req, res, { target })

    if (!token)
        return res.status(407).send('Unauthroized Request : Invalid Token')

    try {
        const payload = await validateToken(token)
        req.headers['x-uid'] = payload.uid
        req.headers['x-token-expire'] = payload.expire
        return proxy.web(req, res, { target })
    } catch (err) {
        return res.status(407).send('Unauthroized Request: Token Validation Failed')
    }
})

const port = process.argv[2] || 80

const server = app.listen(port, (err) => {
    if (err) throw err
    console.log(`listening on port ${port}`)
})

server.on('request', (r) => console.log(new Date().toLocaleString() + ' ' + `${r.headers.host}${r.url}  ${r.method}`))


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