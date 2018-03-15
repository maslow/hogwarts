/**
 * @api GET  /tokens?token      # 获取token payload
 * @api POST /tokens            # 获取token
 * @api POST /users             # 创建用户
 * @api GET  /getUser           # 获取用户
 */

const crypto = require('crypto')
const express = require('express')
const body_parser = require('body-parser')
const $ = require('validator')
const mongoose = require('mongoose')
const debug = require('debug')

const UserModel = require('./model/User')

// mongoose connection
mongoose.Promise = Promise
const SERVER_MONGO = process.env['SERVER_MONGO'] || 'localhost'
const uri = `mongodb://${SERVER_MONGO}/tech_auth`
mongoose.connect(uri, { useMongoClient: true })

const app = express()
const _log = debug('AUTH:PROD')
const _debug = debug('AUTH:DEV')

const secret = process.env['AUTH_SECRET'] || "abcdefg1234567!@#$%^&"

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    _log('Accept [%s %s %s] request from [%s]', req.hostname, req.method, req.url, req.ip)
    next()
})

/**
 * Get user by id
 */
app.get('/getUserById', async (req, res) => {
    const user_id = req.query.id

    try {
        const user = await UserModel.findById(user_id).select({ password_hash: 0 })
        if (!user)
            return res.status(404).send('User not found')

        return res.status(200).send(user)
    } catch (err) {
        _log('Get user (id:%s) detail caught an error: %o', user_id, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Create a user
 */
app.post('/createUser', async (req, res) => {
    _log('Accept [POST /createUser] request, email: %s', req.body.email)

    const email = req.body.email
    const username = req.body.email
    const password = req.body.password

    try {
        // validations
        if (!$.isEmail(email) || !$.isLength(email, { min: 6, max: 64 }))
            return res.status(422).send('Invalid email')

        if (!$.isLength(username, { min: 2, max: 32 }))
            return res.status(422).send('Invalid username')

        if (!$.isLength(password, { min: 5, max: 16 }))
            return res.status(422).send('Invalid password')

        let user = await UserModel.find({ email })
        if (!user)
            return res.status(422).send('Email already existed')

        user = await UserModel.find({ email })
        if (!user)
            return res.status(422).send('Email already existed')

        // create new user
        const new_user = new UserModel({ username, email })
        new_user.password_hash = hash(password)
        new_user.roles = ['user']

        // save & return
        await new_user.save()
        return res.status(201).send('ok')
    } catch (err) {
        _log('Create user detail caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Login, get token
 */
app.post('/login', async (req, res) => {
    const username = req.body.username || req.body.email
    const password = req.body.password || ''
    const password_hash = hash(password)

    try {
        // find user
        const user = await UserModel.findOne({ username, password_hash })
        if (!user)
            return res.status(422).send('Username or password is invalid')

        // get token
        const expire = new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        const result = {
            uid: user._id,
            expire,
            access_token: getToken(user._id, expire)
        }
        return res.status(200).send(result)
    } catch (err) {
        _log('Retrieve token caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Validate token
 */
app.post('/validateToken', async (req, res) => {
    const token = req.body.token || ''

    try {
        const payload = fromToken(token)
        if (!payload)
            return res.status(401).send('Invalid Token')

        const user = await UserModel.findById(payload.uid)
        if (!user)
            return res.status(404).send('User not found')

        const data = {
            uid: payload.uid,
            roles: user.roles
        }
        return res.status(200).send(data)
    } catch (err) {
        _log('Validate token caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})

function getToken(user_id, expire) {
    let exp = expire || (new Date().getTime() + 60 * 60 * 1000)
    let payload = {
        uid: user_id,
        expire: exp
    }
    let buf = new Buffer(JSON.stringify(payload))
    let base64str = buf.toString('base64')
    let sign_str = hash(base64str)
    return base64str + '.' + sign_str
}

function fromToken(token) {
    let pair = token.split('.')
    if (2 !== pair.length || hash(pair[0]) !== pair[1])
        return false;
    let buf = new Buffer(pair[0], 'base64')
    let payload = JSON.parse(buf.toString())
    if (!payload.expire || payload.expire <= new Date().getTime())
        return false
    return payload
}

function hash(content) {
    return crypto
        .createHash('md5')
        .update(secret + content)
        .digest('hex')
}

const port = process.argv[2] || 80
app.listen(port, () => console.log(`listening on ${port}`))