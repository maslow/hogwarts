const fs = require('fs-extra')
const code = require('./code')
const path = require('path')

module.exports = {
    updateCode,
    getCode
}

async function updateCode(section_id, tests) {
    try {
        let testsPath = path.join(code.root(true), section_id, 'tests')
        await fs.ensureDir(testsPath)

        let file = path.join(testsPath, 'tests.js')
        await fs.writeFile(file, tests)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

async function getCode(section_id, tests) {
    try {
        let testsPath = path.join(code.root(true), section_id, 'tests')
        await fs.ensureDir(testsPath)

        let file = path.join(testsPath, 'tests.js')
        let data = ""
        if(await fs.pathExists(file))
            data = await fs.readFile(file, tests)

        return data.toString()
    } catch (err) {
        console.error(err)
        return false
    }
}