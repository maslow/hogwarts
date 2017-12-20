const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const klaw = require('klaw')
const SectionModal = require('./section')

/**
 * 获取作业代码中的指定目录的文件列表
 * @param {integer} jobId 作业Id
 * @param {string} file 目录路径
 * @param {integer} sectionId 作业所属小节Id
 */
async function GetFiles(jobId, file, sectionId) {
    const codePath = path.join(root(), jobId, 'codes')
    const filePath = path.join(codePath, file)

    const sectionFiles = await SectionModal.GetFiles(sectionId, file)
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
        codeFiles[i] = {
            type,
            name
        }
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

    if (!await fs.pathExists(filePath)) {
        let f = await SectionModal.GetFile(sectionId, file)
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

/**
 * 获取job code的所有文件及内容，包括所属section code的所有文件和内容 和 section tests的文件内容
 * @param {*} job_id 
 * @param {*} section_id 
 */
async function GetSource(job_id, section_id) {
    const code_path = path.join(root(), job_id, 'codes')
    await fs.ensureDir(code_path)

    const job_codes = await _get_files_and_content(code_path)

    const section_source = await SectionModal.GetSource(section_id)
    const section_codes = section_source.codes
    const tests = section_source.tests

    // 合并去重job_codes 与 section_codes
    let codes = job_codes.concat(section_codes)
    codes = _.uniqBy(codes, 'name')
    return {
        codes,
        tests
    }
}


/**
 * 获取指定目录下的所有文件及内容
 * @param {*} code_path 
 */
async function _get_files_and_content(code_path) {
    const dir_path = path.resolve(code_path)
    let absolute_paths = await _get_file_list(dir_path)
    absolute_paths = absolute_paths.filter(p => path.relative(dir_path, p) != '')
    
    const relative_paths = absolute_paths.map(p => path.relative(dir_path, p))

    const files = []
    for (let i = 0; i < absolute_paths.length; i++) {
        const stats = await fs.stat(absolute_paths[i])

        let file = {
            name: relative_paths[i],
            type: stats.isDirectory() ? 'dir' : 'file',
            data: null
        }
        if (file.type === 'file') {
            const file_data = await fs.readFile(absolute_paths[i])
            file.data = file_data.toString()
        }
        files.push(file)
    }
    return files
}

/**
 * 获取指定目录下的所有文件列表,包括子目录中的文件
 * @param {*} dir_path 
 */
function _get_file_list(dir_path) {
    return new Promise(function (resolve, reject) {
        const files = []
        klaw(dir_path)
            .on('data', item => files.push(item.path))
            .on('end', () => resolve(files))
            .on('error', reject)
    })
}

module.exports = {
    GetSource,
    GetFiles,
    GetFile,
    root,
    SecurityChecking,
    CreateFolder,
    WriteFile,
    DeleteFile
}