const cp = require('child_process')
const assert = require('assert')
const path = require('path')
const fs = require('fs')



describe('第一章', function () {
	var srcpath = path.join(__dirname, '../src/app.js')

	it(`处理命令行参数`, function (done) {
		let numbers = generateNumbers()
		cp.exec(`node ${srcpath} ${numbers.str}`, function (error, stdout, stderr) {
			if (error) return done(error)
			let actual = stdout.trim('\n')
			let expected = numbers.sum
			assert.equal(
				actual,
				expected,
				`你的程序输出的是:${actual}\n正确的结果应该是:${expected}`
			)
			done()
		})
	})

	function generateNumbers() {
		let count = Math.floor(Math.random() * 5 + 2);
		let numbers = []
		for (var i = 0; i < count; i++)
			numbers.push(Math.floor(Math.random() * 10))
		return {
			str: numbers.join(' '),
			sum: numbers.reduce((s, n) => s + n)
		}
	}
})