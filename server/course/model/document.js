const fs = require('fs-extra')
const CodeModel = require('./code')
const path = require('path')

module.exports = {
    write,
    read
}

async function write(section_id, doc_data) {
    const doc_file_path = await _get_doc_file_path(section_id)
    await fs.writeFile(doc_file_path, doc_data)
}

async function read(section_id) {
    const doc_file_path = await _get_doc_file_path(section_id)
    let data = ""
    if (await fs.pathExists(doc_file_path))
        data = await fs.readFile(doc_file_path)

    return data.toString()
}

/** private function */
async function _get_doc_file_path(section_id) {
    const section_path = path.join(CodeModel.root(true), section_id)
    await fs.ensureDir(section_path)
    return path.join(section_path, 'document.md')
}