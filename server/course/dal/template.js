const fs = require("fs-extra")
const path = require("path")
const mysql = require("../mysql.js")

/**
 * 获取所有模板信息
 */
async function getTemplates() {
    let [rets] = await mysql.Query("select * from template")
    return rets
}

const root = path.join(__dirname, '..', 'data', 'templates')

/**
 * 获取指定目标下文件列表
 * @param {integer} templateId 模板Id
 * @param {string} file 目录路径
 */
async function getFiles(templateId, file) {
    const p = path.join(root, templateId, file)
    if (!await fs.pathExists(p))
        return null

    let files = await fs.readdir(p)
    for (let i = 0; i < files.length; i++) {
        const name = files[i]
        const stats = await fs.stat(path.join(p, name))
        const type = stats.isDirectory() ? 'dir' : 'file'
        files[i] = { type, name }
    }
    return files
}

/**
 * 获取指定文件内容
 * @param {integer} templateId 模板Id
 * @param {string} file 文件路径
 */
async function getFile(templateId, file) {
    let p = path.join(root, templateId, file)
    if (!await fs.pathExists(p))
        return null
    return await fs.readFile(p)
}

/**
 * 判断指定模板文件是否存在
 * @param {integer} templateId 模板Id
 * @param {string} file 文件路径
 */
async function exists(templateId, file) {
    let p = path.join(root, templateId, file)
    return await fs.pathExists(p)
}

module.exports = {
    getFiles,
    getFile,
    getTemplates,
    exists
}