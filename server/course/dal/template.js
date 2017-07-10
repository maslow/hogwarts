const fs = require("fs-extra")
const path = require("path")

const templateRoot = path.join(__dirname, '..', 'data', 'templates')

async function GetTemplateDirFiles(templateId, file) {
    let p = path.join(templateRoot, templateId, file)
    if (!await fs.pathExists(p))
        return null

    let files = await fs.readdir(p)
    files = files.map(f => {
        return {
            type: "",
            name: f
        }
    })

    for (let i = 0; i < files.length; i++) {
        let stats = await fs.stat(path.join(p, files[i].name))
        files[i].type = stats.isDirectory() ? 'dir' : 'file'
    }
    return files
}

async function GetTemplateFileContent(templateId, file) {
    let p = path.join(templateRoot, templateId, file)
    if (!await fs.pathExists(p))
        return null
    return await fs.readFile(p)
}

module.exports = {
    GetTemplateDirFiles,
    GetTemplateFileContent
}