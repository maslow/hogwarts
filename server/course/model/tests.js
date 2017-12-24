const fs = require('fs-extra')
const path = require('path')

const CodeModel = require('./code')

module.exports = {
    write,
    read
}

async function write(section_id, tests_file_data) {
    const tests_file_path = _get_tests_file_path(section_id)
    await fs.writeFile(tests_file_path, tests_file_data)
}

async function read(section_id) {
    const tests_file_path = _get_tests_file_path(section_id)
    let data = ""
    if (await fs.pathExists(tests_file_path))
        data = await fs.readFile(tests_file_path)

    return data.toString()
}

/** private functions */

async function _get_tests_file_path(section_id) {
    const tests_folder_path = path.join(CodeModel.root(true), section_id, 'tests')
    await fs.ensureDir(tests_folder_path)
    return path.join(tests_folder_path, 'tests.js')
}