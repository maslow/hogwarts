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
async function GetCodeDirFiles(sectionId, templateId, file, dev = false) {
    let p = path.join(CoursesRoot(dev), sectionId, 'codes', file)

    let tplFiles = await tpl.GetTemplateDirFiles(templateId, file)
    if (!await fs.pathExists(p))
        return tplFiles

    let codeFiles = await fs.readdir(p)

    for (let i = 0; i < codeFiles.length; i++) {
        let stats = await fs.stat(path.join(p, codeFiles[i]))
        let type = stats.isDirectory() ? 'dir' : 'file'
        codeFiles[i] = {
            type,
            name: codeFiles[i]
        }
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
async function GetCodeFileContent(sectionId, templateId, file, dev = false) {
    let p = path.join(CoursesRoot(dev), sectionId, 'codes', file)

    if (!await fs.pathExists(p))
        return await tpl.GetTemplateFileContent(templateId, file)

    return await fs.readFile(p)
}

/**
 * 创建文件夹
 * @param {int} sectionId 小节ID
 * @param {String} file 文件夹目录
 */
async function CreateFolder(sectionId, file) {
    let codesPath = path.join(CoursesRoot(true), sectionId, 'codes')
    await fs.ensureDir(codesPath)

    let p = path.join(codesPath, file)
    if (await fs.pathExists(p))
        return false

    await fs.ensureDir(p)
    return true
}

async function WriteFile(sectionId, file, content) {
    let codesPath = path.join(CoursesRoot(true), sectionId, 'codes')
    await fs.ensureDir(codesPath)

    let p = path.join(codesPath, file)
    try {
        await fs.writeFile(p, content)
        return null
    } catch (err) {
        return err
    }
}

async function DeleteFile(sectionId, file) {
    let codesPath = path.join(CoursesRoot(true), sectionId, 'codes')
    await fs.ensureDir(codesPath)

    let p = path.join(codesPath, file)
    try {
        await fs.remove(p)
        return null
    } catch (err) {
        return err
    }
}

function CoursesRoot(dev = false) {
    let p = dev ? 'dev' : 'pub'
    return path.join(__dirname, '..', 'data', 'courses', p)
}

function SecurityChecking(sectionId, file, dev = false) {
    let p0 = path.join(CoursesRoot(dev), sectionId, 'codes')
    let p = path.join(p0, file)

    let p1 = path.relative(p0, p)
    if (p1.indexOf("..") >= 0)
        return false

    return true
}

module.exports = {
    GetCodeDirFiles,
    GetCodeFileContent,
    CoursesRoot,
    SecurityChecking,
    CreateFolder,
    WriteFile,
    DeleteFile
}