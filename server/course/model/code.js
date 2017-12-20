const fs = require("fs-extra")
const path = require("path")
const klaw = require('klaw')
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
    const p = path.join(root(dev), sectionId, 'codes', file)

    if (!await fs.pathExists(p))
        return await tpl.getFile(templateId, file)

    return await fs.readFile(p)
}

async function GetSectionAllFileContents(sectionId){
    const  p = path.join(root(true), `${sectionId}/codes`)
    return _get_files_and_content(p)
}

/**
 * 创建文件夹
 * @param {int} sectionId 小节ID
 * @param {String} file 文件夹目录
 */
async function CreateFolder(sectionId, file) {
    let filePath = path.join(root(true), sectionId, 'codes', file)
    await fs.ensureDir(filePath)
}

async function WriteFile(sectionId, file, content) {
    let filePath = path.join(root(true), sectionId, 'codes', file)

    await fs.ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, content)
}

async function DeleteFile(sectionId, file) {
    const filePath = path.join(root(true), sectionId, 'codes', file)
    if (await fs.pathExists(filePath))
        await fs.remove(filePath)
}

function root(dev = false) {
    let p = dev ? 'dev' : 'pub'
    return path.join(__dirname, '..', 'data', 'courses', p)
}

async function Publish(section_id){
    const dev_code_path = path.join(root(true), section_id)
    const pub_code_path = path.join(root(false), section_id)
    await fs.ensureDir(pub_code_path)
    await fs.copy(dev_code_path, pub_code_path)
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
    GetSectionAllFileContents,
    root,
    SecurityChecking,
    CreateFolder,
    WriteFile,
    DeleteFile,
    Publish
}


/**
 * 获取指定目录下的所有文件及内容
 * @param {*} code_path 
 */
async function _get_files_and_content(code_path){
    const dir_path = path.resolve(code_path)
    
    let absolute_paths = await _get_file_list(dir_path)
    absolute_paths = absolute_paths.filter(p => path.relative(dir_path, p) != '')

    const relative_paths = absolute_paths.map(p => path.relative(dir_path, p))

    const files = []
    for(let i =0; i< absolute_paths.length; i++){ 
	const stats = await fs.stat(absolute_paths[i])
	
	let file = {
	    name: relative_paths[i],
	    type: stats.isDirectory() ? 'dir' : 'file',
	    data: null
	}
	if(file.type === 'file'){
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
function _get_file_list(dir_path){
    return new Promise(function(resolve,reject){
        const files = []
        klaw(dir_path)
          .on('data', item => files.push(item.path))
          .on('end', () => resolve(files))
	  .on('error', reject)
    })
}