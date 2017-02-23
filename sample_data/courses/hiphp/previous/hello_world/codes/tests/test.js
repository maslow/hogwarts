const cp = require('child_process')
const path = require('path')
const assert = require('assert')

describe('第一章', function () {

	const expected = 'HELLO WORLD'

	it(`控制台输出${expected}`, function (done) {
		let p = path.join(__dirname, '../src/hello.php')
		cp.exec(`php ${p}`, (err, stdout, stderr) => {
			if (err) throw err;
			var actual = stdout
			assert.equal(
				actual,
				expected,
				`你的程序输出的是:${actual}\n正确的结果应该是:${expected}`
			)
			done()
		})
	})
})