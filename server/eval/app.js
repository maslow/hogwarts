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
    _log("Content Length: %s, (hostname:%s, method:%s, url:%s) from %s", req.headers['content-length'], req.hostname, req.method, req.url, req.ip)
    const job_id = req.body.job_id
    const job_source = req.body.job_source
    const job_image = req.body.job_image

    const tmp_src_path = get_tmp_src_path(job_id)

    try {
        await extract_source(job_source, tmp_src_path)  // TODO: imp extract_codes()

        const result = await eval.run(job_image, tmp_src_path)
        if(!result)
           throw new Error('EMPTY RESULT')

        await fs.remove(tmp_src_path)                
        return res.status(200).send(result)
    } catch (err) {
        await fs.remove(tmp_src_path)                
        _log("Evaluating job caught an error:%o", err)
        return res.status(404).send('Internal Error')
    }
})

const port = process.argv[2] || 80
app.listen(port, (err) => {
    if (err) throw err
    _log(`listening on port %s`, port)
})

function get_tmp_src_path(job_id) {
    const time = (new Date()).getMilliseconds()
    const number = Math.random() * 10000 * 10000 | 0
    const tmp_path = path.join(DATA_TMP_SRC_PATH, `tmp-${job_id}.${time}.${number}`)
    return tmp_path
}

async function extract_source(job_source, tmp_src_path) {
    const codes_path = path.join(tmp_src_path, 'codes')
    const tests_path = path.join(tmp_src_path, 'tests', 'tests.js')

    const codes = job_source.codes
    const tests = job_source.tests

    // Extract tests
    await fs.ensureDir(path.dirname(tests_path))
    await fs.writeFile(tests_path, tests)
    
    // Extract codes
    for (let i = 0; i < codes.length; i++) {
        const file = codes[i]
        const file_path = path.join(codes_path, file.name)
        if (file.type == 'dir') {
            await fs.ensureDir(file_path)
            continue
        }
        await fs.ensureDir(path.dirname(file_path))
        await fs.writeFile(file_path, file.data)
    }
}