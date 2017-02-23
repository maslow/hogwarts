const cp = require('child_process')
const path = require('path')
const report = require('./report.js')
const fs = require('fs-extra')
const commands = require('./commands.js')

module.exports = function (codespath, lang, tester) {

    let containerName = getName(codespath)
    let cmd = getCommand(codespath, lang, tester, containerName)
    let hasRemoved = false

    return new Promise((resolve, reject) => {
        if(!cmd) return reject('ERROR: getCommand() Failed.')
        function removeContainer() {
            if (hasRemoved) return false
            hasRemoved = true
            cp.exec(`docker rm ${containerName}`, (e, so, te) => {
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

function getCommand(codespath, lang, tester, containerName) {
    let rs = commands.filter(cmd => {
        return cmd.lang === lang && cmd.tester === tester
    })
    if (!rs || !rs.length)
        return null

    let obj = rs.shift()
    let cmd = obj.cmd
    let image = obj.image

    let docker_cmd = `docker run --name ${containerName} -v ${codespath}:/app:ro ${image} ${cmd}`
    return docker_cmd
}

function getName(codespath) {
    return 'container-' + codespath.replace(/[\/\\:]/g, '-')
}