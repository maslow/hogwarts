
const assert = require('assert')
const http = require('http')
const path = require('path')
const cp = require('child_process')

describe("第一章", function () {
    const port = 9999
    var app = null
    before(function (done) {
        let p = path.join(__dirname, "../src/app.js")
        app = cp.exec(`node ${p} ${port}`, (err, stdout, stderr) => assert.ifError(err))
        setTimeout(done, 200)
    })

    it("访问HTTP JSON API : /api/unixtime", function (done) {
        let date = new Date()
        let time = date.getTime()
        let url = `http://127.0.0.1:${port}/api/unixtime?t=${time}`
        let formattedTime = getFormattedTime(date)
        http.get(url, (res) => {
            let buffers = []
            res.on('data', data => buffers.push(data))
            res.on('end', () => {
                let actual = Buffer.concat(buffers).toString()
                let expected = JSON.stringify(formattedTime)
                assert.equal(
                    actual,
                    expected,
                    `你的服务返回:${actual}\n正确的答案是:${expected}`
                )
                done()
            })
            res.on('error', (err) => done(err))
        }).on('aborted', (err) => done(err))
    })

    after(function () { })

    function getFormattedTime(date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        }
    }
})