const express = require("express")
const debug = require('debug')
const svgCaptcha = require('svg-captcha')
const {generateCaptchaToken} = require('../captcha_token')

const router = express.Router()
const _log = debug('AUTH:PROD')


router.get('/captcha', async function (req, res) {
    try {
        let captcha = svgCaptcha.create({
            size: 4,
            noise: 2,
            ignoreChars: '0o1iIlL',
            color: true,
            height: 35,
            width: 200
        })

        let result = generateCaptchaToken(captcha.text.toLowerCase())
        console.log(captcha.text, result)        
        result['data'] = captcha.data
        res.status(200).send(result)
    } catch (err) {
        _log('Retrieve captcha caught an error: %o', err)
        return res.status(400).send('Internal Error')
    }
})


module.exports = router