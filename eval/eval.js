const cp = require('child_process')
const path = require('path')
const report = require('./report.js')
const fs = require('fs-extra')
const commands = require('./commands.js')

module.exports = function (codespath, lang, tester, version) {

    let name = getName(codespath)
    let cmd = getCommand(codespath, lang, tester, name, version)
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
            } else if (error) reject(error)
            if (!hasRemoved) {
                clearTimeout(timer)
                removeContainer()
            }
        })

    })
}

function getCommand(codespath, lang, tester, name, version) {
    let rs = commands.filter(cmd => {
        return cmd.lang === lang && cmd.tester === tester
    })
    if (!rs || !rs.length)
        return null
    if(rs.length > 1)
        rs = rs.filter( r => r.version === version)

    let obj = rs.shift()
    let cmd = obj.cmd
    let image = ""
    if(obj.version)
        image = `${lang}:${version}-${tester}`
    else
        image = `${lang}:${tester}`

    let docker_cmd = `docker run --name ${name} -v ${codespath}:/app:ro ${image} ${cmd}`
    return docker_cmd
}

function getName(codespath) {
    return 'container-' + codespath.replace(/[\/\\:]/g, '-')
}