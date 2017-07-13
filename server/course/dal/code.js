const fs = require("fs-extra")
const path = require("path")
const tpl = require("./template")
const course = require("./course")
const _ = require("lodash")

/**
 * TODO 检查文件是否属于该课程；检查文件是否可读（非文件夹）；
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
    return _.sortedUniqBy(files, item => item.name)
}

/**
 * TODO 检查文件是否属于该课程；检查文件是否可读（非文件夹）；
 * @param {int} sectionId 
 * @param {int} templateId 
 * @param {string} file 
 */
async function GetCodeFileContent(sectionId, templateId, file, dev = false) {
    let p = path.join(CoursesRoot(dev), sectionId, 'codes', file)

    let tplFileData = await tpl.GetTemplateFileContent(templateId, file)
    if (!await fs.pathExists(p))
        return tplFileData

    return await fs.readFile(p)
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
    SecurityChecking
}