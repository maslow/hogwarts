const http = require('http')
const path = require('path')
const cp = require('child_process')
const fs = require('fs')
const assert = require('assert')

describe("第一章", function () {

    const port = 9999
    const tmpFile = path.join(__dirname, '../tmp.file')
    let text = generateText()

    before(function (done) {
        fs.writeFileSync(tmpFile, text)

        let p = path.join(__dirname, "../src/app.js")
        cp.exec(`node ${p} ${port} ${tmpFile}`, (err, stdout, stderr) => {
            if (err) throw err
            if (stdout.length) throw new Error(stdout)
            if (stderr.length) throw new Error(stderr)
        })
        done()
    })

    it("创建一个HTTP文件服务器", function (done) {
        let url = `http://127.0.0.1:${port}`
        setTimeout(() => {
            http.get(url, (res) => {
                let buffers = []
                res.on('data', data => buffers.push(data))
                res.on('end', () => {
                    let actual = Buffer.concat(buffers).toString()
                    let expected = text
                    assert(
                        actual,
                        expected,
                        `你的服务返回:${actual}\n正确的答案是:${expected}`
                    )
                    done()
                })
                res.on('error', (err) => done(err))
            }).on('aborted', (err) => done(err))
        }, 200)
    })

    after(function () {
        fs.unlink(tmpFile)
    })

    function generateText() {
        let text = Array(10)
            .fill(0)
            .map(() => random(1000))
            .join('+')
        return text
    }

    function random(length) {
        return Math.round(Math.random() * length)
    }
})