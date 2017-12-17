const express = require('express')
const body_parser = require('body-parser');
const path = require('path')
const fs = require('fs-extra')
const debug = require('debug')

const eval = require('./eval')

const app = express()
const _log = debug('EVAL:PROD')
const DATA_TMP_SRC_PATH = path.resolve('./data')
fs.ensureDirSync(DATA_TMP_SRC_PATH)

app.use(body_parser.json())
app.use(function (req, res, next) {
    _log("Accept request (hostname:%s, method:%s, url:%s) from %s", req.hostname, req.method, req.url, req.ip)
    next()
})

app.post('/eval', async function (req, res) {
    const job_id = req.body.job_id
    const job_codes = req.body.job_codes
    const job_tests = req.body.job_tests
    const job_image = req.body.job_image

    try {
        const tmp_src_path = await get_tmp_src_path(job_id)   // TODO: imp get_tmp_src_path()
        await extract_codes(tmp_src_path)  // TODO: imp extract_codes()
        await extract_tests(tmp_src_path)  // TODO: imp extract_tests()

        const result = await eval.run(job_image, tmp_src_path)
        if(!result)
            throw new Error('EMPTY RESULT')

        return res.status(200).send(result)
    } catch (err) {
        _log("Evaluating job caught an error:%o", err)
        return res.status(404).send('Internal Error')
    }
})

const port = process.argv[2] || 80
app.listen(port, (err) => {
    if (err) throw err
    _log(`listening on port %s`, port)
})

async function get_tmp_src_path(job_id){
    const time = (new Date()).getMilliseconds()
    const number = Math.random() * 10000 * 10000 | 0
    const tmp_path = path.join(DATA_TMP_SRC_PATH, `tmp-${job_id}.${time}.${number}`)
    return tmp_path
}

// TODO
async function extract_codes(tmp_src_path){
}

// TODO
async function extract_tests(tmp_src_path){
}