const fs = require("fs-extra")
const path = require("path")
const tpl = require("./template")
const course = require("./course")
const _ = require("lodash")

/**
 * TODO 检查文件是否可读（非文件夹）；
 * @param {int} sectionId 
 * @param {int} templateId 
 * @param {string} file 
 */
async function GetFiles(sectionId, templateId, file, dev = false) {
    const codesPath = path.join(root(dev), sectionId, 'codes')
    const p = path.join(codesPath, file)

    const tplFiles = await tpl.getFiles(templateId, file) || null
    if (!await fs.pathExists(p))
        return tplFiles

    let codeFiles = await fs.readdir(p)
    for (let i = 0; i < codeFiles.length; i++) {
        const stats = await fs.stat(path.join(p, codeFiles[i]))
        const type = stats.isDirectory() ? 'dir' : 'file'
        codeFiles[i] = { type, name: codeFiles[i] }
    }

    let files = codeFiles.concat(tplFiles || [])
    files = _.uniqBy(files, 'name')
    return _.sortedUniqBy(files, item => item.name)
}

/**
 * TODO 检查文件是否可读（文件夹）；
 * @param {int} sectionId 
 * @param {int} templateId 
 * @param {string} file 
 */
async function GetFile(sectionId, templateId, file, dev = false) {
    let p = path.join(root(dev), sectionId, 'codes', file)

    if (!await fs.pathExists(p))
        return await tpl.getFile(templateId, file)

    return await fs.readFile(p)
}

/**
 * 创建文件夹
 * @param {int} sectionId 小节ID
 * @param {String} file 文件夹目录
 */
async function CreateFolder(sectionId, file) {
    let filePath = path.join(root(true), sectionId, 'codes', file)

    if (await fs.pathExists(filePath))
        return false

    await fs.ensureDir(filePath)
    return true
}

async function WriteFile(sectionId, file, content) {
    let filePath = path.join(root(true), sectionId, 'codes', file)

    try {
        await fs.ensureDir(path.dirname(filePath))
        await fs.writeFile(filePath, content)
        return null
    } catch (err) {
        return err
    }
}

async function DeleteFile(sectionId, file) {
    const filePath = path.join(root(true), sectionId, 'codes', file)

    try {
        if (await fs.pathExists(filePath))
            await fs.remove(filePath)
        return null
    } catch (err) {
        return err
    }
}

function root(dev = false) {
    let p = dev ? 'dev' : 'pub'
    return path.join(__dirname, '..', 'data', 'courses', p)
}

function SecurityChecking(sectionId, file, dev = false) {
    let p0 = path.join(root(dev), sectionId, 'codes')
    let p = path.join(p0, file)

    let p1 = path.relative(p0, p)
    if (p1.indexOf("..") >= 0)
        return false

    return true
}

module.exports = {
    GetFiles,
    GetFile,
    root,
    SecurityChecking,
    CreateFolder,
    WriteFile,
    DeleteFile
}