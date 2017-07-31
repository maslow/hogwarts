const fs = require('fs-extra')
const code = require('./code')
const path = require('path')

module.exports = {
    updateTests,
    getTests
}

async function updateTests(section_id, tests) {
    try {
        let testsPath = path.join(code.SectionsRoot(true), section_id)
        await fs.ensureDir(testsPath)

        let file = path.join(testsPath, 'tests.xml')
        await fs.writeFile(file, tests)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

async function getTests(section_id, tests) {
    try {
        let testsPath = path.join(code.SectionsRoot(true), section_id)
        await fs.ensureDir(testsPath)

        let file = path.join(testsPath, 'tests.xml')
        let data = ""
        if(await fs.pathExists(file))
            data = await fs.readFile(file, tests)

        return data.toString()
    } catch (err) {
        console.error(err)
        return false
    }
}