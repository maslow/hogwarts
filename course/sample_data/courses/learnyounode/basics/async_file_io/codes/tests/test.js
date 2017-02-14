const fs = require('fs')
const path = require('path')
const assert = require('assert')
const cp = require('child_process')

describe("第一章", function () {
	let tmpfile = path.join(__dirname, '../tmp.file')
	let lineNumber = 0

	before(done => fs.writeFile(tmpfile, generateTmpFile(), done))

	it("统计文件内容行数", function (done) {
		let p = path.join(__dirname, '../src/app.js')
		let cmd = `node ${p} ${tmpfile}`
		cp.exec(cmd, (err, stdout, stderr) => {
			if (err) return done(err)
			let actual = Number(stdout)
			let expected = lineNumber
			assert.equal(
				actual,
				expected,
				`你的程序输出的是:${actual}\n正确的结果应该是:${expected}`
			)
			done()
		})
	})

	after(done => fs.unlink(tmpfile, done))

	function generateTmpFile() {
		let n = lineNumber = Math.floor(Math.random() * 50 + 1)
		let buffers = []
		while (n--) buffers.push('abc')
		return buffers.join('\n')
	}
})