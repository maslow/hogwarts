const net = require('net')
const path = require('path')
const cp = require('child_process')
const assert = require('assert')

describe("第一章", function () {
    const port = "9999"
    before(function (done) {
        let srcPath = path.join(__dirname, '../src/app.js')
        cp.exec(`node ${srcPath} ${port}`, (err, stdout, stderr) => {
            if (err) throw err
            if(stdout.length) throw new Error(stdout)
            if(stderr.length) throw new Error(stderr)
        })
        done()
    })

    it("启动一个TCP时间服务器", function (done) {
        setTimeout(function () {
            let client = net.connect(port, '127.0.0.1')
            client.on('data', data => {
                let actual = data.toString()
                let expected = getTime()
                assert.equal(
                    actual,
                    expected,
                    `你的服务返回:${actual}\n正确的结果是:${expected}`
                )
                client.end()
                done()
            })
            client.on('error', err => done(new Error("无法连接到你创建的服务器")))
        }, 200)
    })

    after(function () { })

    function getTime() {
        let t = new Date()
        let year = t.getFullYear()
        let month = t.getMonth() + 1
        let day = t.getDate()
        let hour = t.getHours()
        let min = t.getMinutes()
        return `${year}-${month}-${day} ${hour}:${min}`
    }
})
