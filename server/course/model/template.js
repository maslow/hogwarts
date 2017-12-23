const fs = require("fs-extra")
const path = require("path")
const mysql = require("../mysql.js")

const TEMPLATE_DATA_ROOT = path.join(__dirname, '..', 'data', 'templates')

/**
 * 获取所有模板信息
 */
async function getTemplates() {
    let [rets] = await mysql.Query("select * from template")
    return rets
}

/**
 * 根据模板ID获取一个模板信息
 */
async function getTemplateById(template_id) {
    const sql = "select * from template where id = ?"
    let [rets] = await mysql.Query(sql, [template_id])
    if (rets.length === 0)
        return false
    return rets[0]
}

/**
 * 获取指定目标下文件列表
 * @param {integer} template_id 模板Id
 * @param {string} file 目录路径
 */
async function getFiles(template_id, file) {
    const tpl_file_path = _get_template_file_path(template_id, file)
    if (!await fs.pathExists(tpl_file_path))
        return null

    const files = await fs.readdir(tpl_file_path)
    for (let i = 0; i < files.length; i++) {
        const file_name = files[i]
        const stats = await fs.stat(path.join(tpl_file_path, file_name))
        const type = stats.isDirectory() ? 'dir' : 'file'
        files[i] = { type, name: file_name }
    }
    return files
}

/**
 * 获取指定文件内容
 * @param {integer} template_id 模板Id
 * @param {string} file 文件路径
 */
async function getFile(template_id, file) {
    const tpl_file_path = _get_template_file_path(template_id, file)
    if (!await fs.pathExists(tpl_file_path))
        return null
    return await fs.readFile(tpl_file_path)
}

/**
 * 判断指定模板文件是否存在
 * @param {integer} template_id 模板Id
 * @param {string} file 文件路径
 */
async function exists(template_id, file) {
    const tpl_file_path = _get_template_file_path(template_id, file)
    return await fs.pathExists(tpl_file_path)
}

function _get_template_file_path(template_id, file) {
    return path.join(TEMPLATE_DATA_ROOT, template_id.toString(), 'codes', file)
}

module.exports = {
    getFiles,
    getFile,
    getTemplates,
    getTemplateById,
    exists
}