const cp = require('child_process')
const path = require('path')
const report = require('./report.js')
const fs = require('fs-extra')

module.exports = function (codespath, lang, tester) {

    let name = codespath.replace(/[\/\\:]/g, '-')
    let cmd = `docker run --name ${name} -v ${codespath}:/app:ro ${lang}:${tester} ${tester} -t 10000 /app/tests -R json`
    let hasRemoved = false

    return new Promise((resolve, reject) => {
        function removeContainer() {
            if (hasRemoved) return false
            hasRemoved = true
            cp.exec(`docker rm ${name}`, (e, so, te) => {
                if (e) return console.error(e)
            })
        }
        let timer = setTimeout(removeContainer, 1000 * 60)
        cp.exec(cmd, (error, stdout, stderr) => {
            if (stdout) {
                let rs = report(stdout, tester)
                let savedPath = path.join(codespath, 'report.json')
                fs.writeJson(savedPath, rs, err => err ? reject(err) : resolve(rs))
            }
            else if (error) reject(error)
            if (!hasRemoved) {
                clearTimeout(timer)
                removeContainer()
            }
        })

    })
}