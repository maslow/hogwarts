const crypto = require('crypto')

const CAPTCHA_SECRET = process.env['CAPTCHA_SECRET'] || '!@#asdWQE543GFD$t43t$#t4#t6u^%4#@T'

module.exports = {
    generateCaptchaToken, 
    verifyCaptchaToken
}

function generateCaptchaToken(captcha_text){
    const expire = (new Date().getTime() + 120 * 1000)

    const expire_encoded = Buffer.from(expire.toString()).toString("base64")
    const sig = _hash(captcha_text + expire_encoded, CAPTCHA_SECRET)
    const token = `${expire_encoded}.${sig}`
    return {
        expire,
        token
    }
}

function verifyCaptchaToken(captcha_text, token){
    try{
        const [expire_encoded, sig] = token.split('.')
        if(_hash(captcha_text + expire_encoded, CAPTCHA_SECRET) !== sig)
            return false

        const buf = Buffer.from(expire_encoded, "base64")
        const expire = Number(buf.toString())

        const current_time = (new Date().getTime())
        if(current_time > expire)
            return false

        return true
    }catch(err){
        return false
    }
}


function _hash(content, secret) {
    return crypto
        .createHash('md5')
        .update(secret + content)
        .digest('hex')
}