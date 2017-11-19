const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const section = require('./section')

/**
 * 获取作业代码中的指定目录的文件列表
 * @param {integer} jobId 作业Id
 * @param {string} file 目录路径
 * @param {integer} sectionId 作业所属小节Id
 */
async function GetFiles(jobId, file, sectionId) {
    const codePath = path.join(root(), jobId, 'codes')
    const filePath = path.join(codePath, file)

    const sectionFiles = await section.GetFiles(sectionId, file) || null
    if (!await fs.pathExists(filePath))
        return sectionFiles

    const s = await fs.stat(filePath)
    if (s.isDirectory() === false)
        return false

    let codeFiles = await fs.readdir(filePath)
    for (let i = 0; i < codeFiles.length; i++) {
        const name = codeFiles[i]
        const stats = await fs.stat(path.join(filePath, name))
        const type = stats.isDirectory() ? 'dir' : 'file'
        codeFiles[i] = { type, name }
    }

    let files = codeFiles.concat(sectionFiles || [])
    files = _.uniqBy(files, 'name')
    return _.sortedUniqBy(files, file => file.name)
}

/**
 * 获取作业代码中一个文件内容
 * @param {integer} jobId 作业Id
 * @param {string} file 文件路径
 * @param {integer} sectionId 作业所属小节Id
 */
async function GetFile(jobId, file, sectionId) {
    const filePath = path.join(root(), jobId, 'codes', file)

    if (!await fs.pathExists(filePath)){
        let f =  await section.GetFile(sectionId, file)
        return f.content
    }

    const s = await fs.stat(filePath)
    if (s.isDirectory() === true)
        return false

    return await fs.readFile(filePath)
}

async function CreateFolder(jobId, file) {
    const filePath = path.join(root(), jobId, 'codes', file)

    if (await fs.pathExists(filePath))
        return false

    await fs.ensureDir(filePath)
    return true
}

async function WriteFile(jobId, file, content) {
    const filePath = path.join(root(), jobId, 'codes', file)

    try {
        await fs.ensureDir(path.dirname(filePath))
        await fs.writeFile(filePath, content)
        return false
    } catch (err) {
        return err
    }
}

async function DeleteFile(jobId, file) {
    const filePath = path.join(root(), jobId, 'codes', file)

    try {
        if (await fs.pathExists(filePath))
            await fs.remove(filePath)
        return false
    } catch (err) {
        return err
    }
}

function root() {
    return path.join(__dirname, '..', 'data', 'jobs')
}

function SecurityChecking(jobId, file) {
    const codePath = path.join(root(), jobId, 'codes')
    const filePath = path.join(codePath, file)

    const p = path.relative(codePath, filePath)
    if (p.indexOf("..") >= 0)
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