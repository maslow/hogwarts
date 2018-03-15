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
const _ = require('lodash')

const _log = debug('GATEWAY:PROD')
const _debug = debug('GATEWAY:DEV')

const { servers, services, roles } = require('./services.js')

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

    // look up route target
    const {target, access} = look_up_route(req.url)
    if (!target) {
        _log('Gateway Not Found,  [%s %s %s] request from [%s]', req.hostname, req.method, req.url, req.ip)
        return res.status(502).send('Gateway Not Found')
    }
    _log("[%s %s %s] mapped to [%s] (access: %o)", req.hostname, req.method, req.url, target, access)    

    // parse & validate token
    const token = parse_token(req)
    let token_payload = false
    let actual_roles = null
    req.headers['x-uid'] = null

    if (token) token_payload = await validate_token(token)

    if (token_payload){
        actual_roles = token_payload.roles || []
        req.headers['x-uid'] = token_payload.uid
    }else{
        actual_roles = [roles.guest]
    }

    // intersection between access and actual_roles
    const intersection = _.intersection(access, actual_roles)
    if(intersection.length === 0){
        _log("Permission denied [%s %s %s] to [%s], access: %o, user roles: %o", req.hostname, req.method, req.url, target, access, actual_roles)
        return res.status(407).send('Unauthroized Request: Token Validation Failed')
    }

    _log("Delivery [%s %s %s] to [%s], access: %o", req.hostname, req.method, req.url, target, access)
    return proxy.web(req, res, { target })
})

const port = process.argv[2] || 80
app.listen(port, (err) => {
    if (err) throw err
    _log(`Listening on port ${port}`)
})

function look_up_route(req_url){
    const parsedUrl = url.parse(req_url)
    const pn = parsedUrl.pathname
    let access = false, target = null
    if(pn in services){
        access = services[pn].access
        target = services[pn].target
    }
    return { target, access }
}

function parse_token(req) {
    if (!('authorization' in req.headers)) return false
    const token = req.headers['authorization'].split('Bearer ').slice(1).join().trim()
    if (!token || !token.length) return false
    return token
}

async function validate_token(token) {
    if (!token) return false
    try {
        const _url = services['/validateToken'].target + '/validateToken'
        const res = await request
            .post(_url)
            .type('json')
            .send({ token })

        _debug("Request [%s] for Validating token (%s)  , response body: %o", _url, token, res.body)
        return res.body
    } catch (err) {
        _debug("Validating token (%s) caught an error: %o  , response body: %o", token, err)
        return false
    }
}

function _sleep(duration){
    return new Promise((r,e)=>{
        setTimeout(function(){
            r()
        }, duration)
    })
}