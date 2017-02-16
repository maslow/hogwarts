const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')
const cp = require('child_process')

const tmpPath = path.join(__dirname, '../tmp')
const srcPath = path.join(__dirname, '../src/app.js')
let extname = ''
let files = []

describe("第一章", function () {

    before(function (done) {
        fs.ensureDirSync(tmpPath)
        generateFiles()
            .then(data => {
                files = data
                let i = random(files.length - 1)
                // drop the first char : dot(.)
                extname = path.extname(files[i]).slice(1)
                done()
            })
    })

    it('过滤指定目录下的文件列表', function (done) {
        cp.exec(`node ${srcPath} ${tmpPath} ${extname}`, (err, stdout, stderr) => {
            if (err) return done(err)
            let actual = stdout
                .split('\n')
                .filter(item => item.length)
                .sort()
                .join(',')

            let expected = files
                .filter(f => path.extname(f).slice(1) === extname)
                .sort()
                .join(',')

            assert.equal(
                actual,
                expected,
                `你的程序输出的是:${actual}\n正确的结果应该是:${expected}`
            )
            done()
        })
    })

    after(() => fs.removeSync(tmpPath))
})


function generateFiles() {
    let extnames = ['js', 'html', 'css']
    let names = ['abc', 'index', 'home', 'about', 'IBM', 'Microsoft', 'app', 'Google', '123']
    let files = names.map(f => `${f}.${extnames[random(extnames.length - 1)]}`)
    return Promise.all(files.map(f => writeFile(f)))
}

function writeFile(filename) {
    let data = filename
    let filepath = path.join(tmpPath, filename)
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => err ? reject(err) : resolve(filename))
    })
}

function random(length) {
    return Math.round(Math.random() * length)
}