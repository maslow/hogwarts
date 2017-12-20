const express = require('express')
const path = require('path')
const debug = require('debug')

const CodeModel = require('../model/code')
const CourseModel = require('../model/course')
const util = require('../util')

const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * url: /getSectionCodeFiles
 * query:
 *  - sid required
 *  - path optional default /
 *  - dev optional default false
 */
router.get("/getSectionCodeFiles", async function (req, res) {
    const code_path = req.query.path || "/"
    let dev = req.query.dev || false
    if (dev == 'false' || dev == '0')
        dev = false

    const section_id = req.query.sid || 0

    try {
        if (!CodeModel.SecurityChecking(section_id, code_path, dev))
            return res.status(422).send('File Path invalid')

        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        // Only author can access developing-version codes
        if (dev && req.uid != section.created_by)
            return res.status(401).send('Permission denied')

        const code_files = await CodeModel.GetFiles(section.id.toString(), section.template_id.toString(), code_path, dev)
        if (code_files === null)
            return res.status(404).send('Section Code not found')

        return res.status(200).send(code_files)
    } catch (err) {
        _log('Retrieve section (id: %s) code files (code_path: %s) caught an error: %o', section_id, code_path, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * url: /getSectionCodeFileContent
 * query:
 *  - sid required
 *  - path optional default /
 *  - dev optional default false
 */
router.get("/getSectionCodeFileContent", async function (req, res) {
    const code_path = req.query.path
    let dev = req.query.dev || false
    if (dev == 'false' || dev == '0')
        dev = false

    const section_id = req.query.sid || 0

    try {
        if (!CodeModel.SecurityChecking(section_id, code_path, dev))
            return res.status(422).send('File Path invalid')

        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        // Only the author have access to developing-version codes
        if (dev && req.uid != section.created_by)
            return res.status(401).send('Permission denied')

        const code_file = await CodeModel.GetFile(section.id.toString(), section.template_id.toString(), code_path, dev)
        if (code_file === null)
            return res.status(404).send('Section code file not found')

        const code_file_data = code_file.toString('utf-8')
        return res.status(200).send({
            name: req.query.path,
            hash: util.md5(code_file_data),
            content: code_file_data
        })
    } catch (err) {
        _log('Retrieve section (id: %s) code file content (code_path: %s) caught an error: %o', section_id, code_path, err)
        return res.status(400).send('Internal Error')
    }
})

router.post("/createSectionCodeFolder", async function (req, res) {
    const folder_path = req.body.path
    const section_id = req.body.sid || 0

    try {
        if (!CodeModel.SecurityChecking(section_id, folder_path, true))
            return res.status(422).send('File Path invalid')

        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        if (req.uid != section.created_by)
            return res.status(401).send('Permission denied')

        await CodeModel.CreateFolder(section_id, folder_path)
        return res.status(200).send('ok')
    } catch (err) {
        _log('Creating section (id: %s) code folder (folder_path: %s) caught an error: %o', section_id, folder_path, err)
        return res.status(400).send('Internal Error')
    }
})

router.post("/updateSectionCodeFileContent", async function (req, res) {
    const code_path = req.body.path || null
    const section_id = req.body.sid || 0
    const content = req.body.content || ''

    if (!code_path || !code_path.length)
        return res.status(422).send('File Path invalid')

    try {

        if (!CodeModel.SecurityChecking(section_id, code_path, true))
            return res.status(422).send('File Path invalid # from security checking')

        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        if (req.uid != section.created_by)
            return res.status(401).send('Permission denied')

        await CodeModel.WriteFile(section_id, code_path, content)
        return res.status(200).send('ok')
    } catch (err) {
        _log('Updating section (id: %s) code file content (code_path: %s) caught an error: %o', section_id, code_path, err)
        return res.status(400).send('Internal Error')
    }
})

router.post("/deleteCodeFile", async function (req, res) {
    const code_path = req.body.path
    const section_id = req.body.sid || 0

    try {
        if (!CodeModel.SecurityChecking(section_id, code_path, true))
            return res.status(422).send('File Path invalid')

        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        if (req.uid != section.created_by)
            return res.status(401).send('Permission denied')

        let err = await CodeModel.DeleteFile(section_id, code_path)
        return res.status(200).send('deleted')
    } catch (err) {
        _log('Deleting section (id: %s) code file (code_path: %s) caught an error: %o', section_id, code_path, err)        
        return res.status(400).send('Internal Error')
    }
})

router.post("/renameSectionCodeFileName", async function (req, res) {
    let section = await CourseModel.GetSection(req.query.sid)
    if (!section)
        return res.status(404).send('Section not found')

    //TODO 
    return res.status(200).send('API TBD')
})

module.exports = router