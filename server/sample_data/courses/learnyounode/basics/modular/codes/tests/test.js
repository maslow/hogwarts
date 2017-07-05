const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')
const cp = require('child_process')

const tmpPath = path.join(__dirname, '../tmp')
const srcPath = path.join(__dirname, '../src/app.js')
var extname = ''
var files = []

describe("第一章", function () {

    before(function () {
        fs.ensureDirSync(tmpPath)
        files = generateFiles()
        extname = path.extname(files[files.length - 1])
    })

    it('执行(app.js)文件过滤文件', function (done) {
        let ext = extname.slice(1)
        let cmd = `node ${srcPath} ${tmpPath} ${ext}`
        cp.exec(cmd, (err, stdout, stderr) => {
            if (err) return done(err)
            let actual = stdout
                .split('\n')
                .filter(item => item.length)
                .sort()
                .join(',')
            let expected = files
                .filter(f => path.extname(f) === extname)
                .sort()
                .join(',')
            assert.equal(
                actual,
                expected,
                `你的输出:${actual}\n正确答案:${expected}`
            )
            done()
        })
    })

    it('调用模块(filter.js)过滤文件', function (done) {
        let ext = extname.slice(1)
        const filterFiles = require('../src/filter.js')
        if (typeof filterFiles !== 'function')
            throw new Error('你的filter.js模块应该导出一个函数')

        filterFiles(tmpPath, ext, function (err, data) {
            if (err) return done(err)
            if (!data || !(data instanceof Array))
                throw new Error("你的模块导出的函数，回调的结果应该是个数组")
                
            let actual = data.sort().join(',')
            let expected = files.filter(f => path.extname(f) === extname).sort().join(',')
            assert.equal(
                actual,
                expected,
                `你的模块输出:${actual}\n正确结果是:${expected}`
            )
            done()
        })
        setTimeout(() => assert.ifError(new Error('你的模块导出的函数未按要求调用回调函数')), 500)
    })

    after(() => fs.removeSync(tmpPath))
})


function generateFiles() {
    let extnames = ['js', 'html', 'css']
    let names = ['abc', 'index', 'home', 'about', 'IBM', 'Microsoft', 'app', 'Google', '123']

    var files = names.map(f => `${f}.${extnames[random(extnames.length - 1)]}`)
    files.forEach(f => fs.writeFileSync(path.join(tmpPath, f), f))
    return files
}

function random(length) {
    return Math.round(Math.random() * length)
}