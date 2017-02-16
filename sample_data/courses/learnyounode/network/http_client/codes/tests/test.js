const http = require('http')
const cp = require('child_process')
const assert = require('assert')
const path = require('path')

describe("第一章", function () {
    let content = generateText()
    const server = http.createServer(function (req, res) {
        res.writeHead(200)
        res.end(content)
    })

    before(function (done) {
        server.listen(9999, done)
    })

    it("请求指定URL内容", function (done) {
        let url = 'http://127.0.0.1:9999'
        let srcPath = path.join(__dirname, '../src/app.js')
        cp.exec(`node ${srcPath} ${url}`, function (err, stdout, stderr) {
            if (err) return done(err)
            let actual = stdout.split('\n').join('')
            let expected = content
            assert.equal(
                actual,
                expected,
                `你的程序输出:${actual}\n正确的输出是:${expected}`
            )
            done()
        })
    })

    after(function () {
        server.close()
    })

    function generateText() {
        let texts = ['爸爸', '妈妈', '姐姐', '弟弟', '妹妹', '哥哥', '爷爷', '姐姐', '女儿', '儿子']
        return Array(5)
            .fill(0)
            .map(() => texts[random(texts.length - 1)])
            .join('的')
    }

    function random(length) {
        return Math.round(Math.random() * length)
    }
})