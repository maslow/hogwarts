/**
 * Created by wangfugen on 7/25/16.
 * @api GET  /tokens?token      # 获取token payload
 * @api POST /tokens            # 获取token
 * @api POST /users             # 创建用户
 * @api GET  /users/:id         # 获取用户
 */

let crypto = require('crypto')
let express = require('express')
let bodyParser = require('body-parser')
let expressValidator = require('express-validator')
let mysql = require('./mysql')

let app = express()
let secret = "adf344t9fdslf4i3qjf"

// 跨域
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(expressValidator())

app.get('/users/:id', (req, res) => {
    req
        .checkParams('id')
        .notEmpty()
        .isInt()
    let errors = req.validationErrors()
    if (errors) 
        return res.status(422).send(errors)
    let conn = mysql()
    conn
        .query("select id,email from users where id = ?", [req.params.id])
        .then(rows => {
            if (!rows.length) 
                return res.status(404).send({param: 'id', msg: 'Not exist'})
            return res
                .status(200)
                .send(rows[0])
        })
        .catch(err => res.status(500).send('Server Exception'))
        .then(() => conn.close())
})

app.post('/users', (req, res) => {
    req
        .checkBody('email', 'Email is incorrect')
        .notEmpty()
        .isEmail()
    req
        .checkBody('password', 'Password is incorrect')
        .notEmpty()
        .isLength({min: 6, max: 16})
    let errors = req.validationErrors()
    if (errors) 
        return res.status(422).send(errors)
    let conn = mysql()
    conn
        .query('SELECT email from users where email = ?', [req.body.email])
        .then(rows => {
            if (rows.length) 
                return res.status(422).send({param: 'email', msg: 'Already existed'})
            let password_hash = hash(req.body.password)
            return conn
                .query('INSERT INTO users(email, password_hash) VALUES(?, ?)', [req.body.email, password_hash])
                .then(result => res.status(201).send(result))
        })
        .catch(err => res.status(500).send({msg: err}))
        .then(() => conn.close())
})

app.post('/tokens', (req, res) => {
    req
        .checkBody('email')
        .notEmpty()
        .isEmail()
    req
        .checkBody('password')
        .notEmpty()
        .isLength({min: 6, max: 16})
    let errors = req.validationErrors()
    if (errors) 
        return res.status(422).send(errors)
    let conn = mysql()
    conn
        .query('SELECT id, email, password_hash from users where email = ?', [req.body.email])
        .then(rows => {
            if (!rows.length) 
                return res.status(404).send({param: 'email', msg: 'Not Found'})
            let user = rows[0];
            if (user.password_hash !== hash(req.body.password)) 
                return res.status(401).send({msg: "Invalid Params"})
            let expire = new Date().getTime() + 60 * 60 * 24 * 7 * 1000
            let result = {
                uid: user.id,
                expire: expire,
                access_token: getToken(user.id, expire)
            }
            return res
                .status(200)
                .send(result)
        })
        .catch(err => {
            res
                .status(500)
                .send({msg: 'Server Exception'})
            console.log(err)
        })
        .then(() => conn.close())
})

app.get('/tokens', (req, res) => {
    req
        .checkQuery('token')
        .notEmpty()
    let errors = req.validationErrors()
    if (errors) 
        return res.status(422).send(errors)
    let payload = fromToken(req.query.token)
    if (!payload) 
        return res.status(401).send({msg: 'Invalid Token'})
    return res
        .status(200)
        .send(payload)
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

app.listen(process.argv[2] || 8000, '127.0.0.1', () => console.log(`listening on 8000`))