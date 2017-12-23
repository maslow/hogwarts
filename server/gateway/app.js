/** 
 * Proxy Gate
 */

const httpProxy = require('http-proxy')
const url = require('url')
const request = require('superagent')
const fs = require('fs-extra')
const path = require('path')
const express = require('express')
const debug = require('debug')

const _log = debug('GATEWAY:PROD')
const _debug = debug('GATEWAY:DEV')

const { servers, services } = require('./services.js')

const app = express()
const proxy = httpProxy.createProxyServer({})

proxy.on('error', (err, req, res) => {
    _log('Proxy request (%s %s) got an error %o', req.method, req.url, err)
    _debug('Proxy request [%s %s, headers:%o] got an error: %o, ', req.method, req.url, req.headers, err)

    res.writeHead(502)
    res.end('Server Internal Error')
})

app.all('*', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Authorization,Content-Type")
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    next()
})

app.options('*', (req, res) => res.send())

app.all('*', async function (req, res) {
    _log('Accept [%s %s %s] request from [%s]', req.hostname, req.method, req.url, req.ip)

    const urlObj = url.parse(req.url)
    const pn = urlObj.pathname
    let auth = false, target = null
    for (let i = 0; i < services.length; i++) {
        for (let j = 0; j < services[i].routes.length; j++) {
            const r = services[i].routes[j]
            if (r == pn) {
                target = services[i].target
                auth = services[i].auth
                _log("[%s %s %s] mapped to [%s] (auth: %s)", req.hostname, req.method, req.url, target, auth ? 'true' : 'false')
                break
            }
        }
        if (target) break
    }

    if (!target) {
        _log('Gateway Not Found,  [%s %s %s] request from [%s]', req.hostname, req.method, req.url, req.ip)
        return res.status(502).send('Gateway Not Found')
    }

    const token = parse_token(req)
    if (!token && auth === false) {
        _log("Delivery [%s %s %s] to [%s] (auth: %s)", req.hostname, req.method, req.url, target, auth ? 'true' : 'false')
        return proxy.web(req, res, { target })
    }

    if (!token) {
        _log('Delivery [%s %s %s] to [%s] Cancelled: Unauthroized Request - Invalid Token', req.hostname, req.method, req.url, target)
        return res.status(407).send('Unauthroized Request : Invalid Token')
    }

    try {
        const payload = await validate_token(token)
        req.headers['x-uid'] = payload.uid
        req.headers['x-token-expire'] = payload.expire
        _log("Delivery [%s %s %s] to [%s] (auth: %s)", req.hostname, req.method, req.url, target, auth ? 'true' : 'false')
        return proxy.web(req, res, { target })
    } catch (err) {
        _debug('Unauthroized request [%s %s], token validation failed, error: %o', req.method, req.url, err)
        return res.status(407).send('Unauthroized Request: Token Validation Failed')
    }
})

const port = process.argv[2] || 80

const server = app.listen(port, (err) => {
    if (err) throw err
    _log(`Listening on port ${port}`)
})


function parse_token(req) {
    if (!('authorization' in req.headers)) return false
    let token = req.headers['authorization'].split('Bearer ').slice(1).join().trim()
    if (!token || !token.length) return false
    return token
}

async function validate_token(token) {
    try {
        const _url = `${servers.AUTH}/tokens`
        const res = await request
            .get(_url)
            .type('json')
            .query({ token })

        _debug("Request [%s] for Validating token (%s)  , response body: %o", _url, token, res.body)            
        return res.body
    } catch (err) {
        _debug("Validating token (%s) caught an error: %o  , response body: %o", _url, token, err)                    
        return err
    }
}