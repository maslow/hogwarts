const express = require('express')
const path = require('path')
const debug = require('debug')
const _ = require('lodash')

const CourseCodeModel = require('../model/CourseCode')
const CourseSectionModel = require('../model/CourseSection')
const CourseMetaModel = require('../model/CourseMeta')
const TemplateCodeModel = require('../model/TemplateCode')

const Helper = require('../util')
const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * Get section code list in specified path
 */
router.get("/getSectionCodeFiles", async function (req, res) {
    const parent = req.query.path || "/"
    const section_id = req.query.sid

    try {
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')
        
        let codes = await CourseCodeModel.find({section_id, parent, status: 0})
        const codes_from_templates = await TemplateCodeModel.find({template_id: section.template_id, parent})

        codes = codes.concat(codes_from_templates)
        codes = _.uniqBy(codes, 'name')
        codes = codes.filter(code => code.status === 0)
        return res.status(200).send(codes)
    } catch (err) {
        _log('Retrieve section (id: %s) code list (path: %s) caught an error: %o', section_id, req.query.path, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Get section code file by specified filename
 */
router.get("/getSectionCodeFileContent", async function (req, res) {
    const section_id = req.query.sid

    const parent = path.dirname(req.query.path)
    const filename = path.basename(req.query.path)

    try {
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        let code = await CourseCodeModel.findOne({section_id, type: 'file', name: filename, parent, status: 0})            
        if(!code)
            code = await TemplateCodeModel.findOne({template_id: section.template_id, type:'file', name: filename, parent})

        if (!code)
            return res.status(404).send('Section code file not found')
        
        return res.status(200).send({
            name: req.query.path,
            hash: Helper.md5(code.data),
            content: code.data
        })
    } catch (err) {
        _log('Retrieve section (id: %s) code file content (path: %s) caught an error: %o', section_id, req.query.path, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Create section code folder
 */
router.post("/createSectionCodeFolder", async function (req, res) {
    const section_id = req.body.sid
    const parent = path.dirname(req.body.path)
    const foldername = path.basename(req.body.path)

    try {
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        const course = await CourseMetaModel.findById(section.course_id)
        if (req.uid != course.created_by)
            return res.status(401).send('Permission denied')

        let code = await CourseCodeModel.findOne({section_id, name: foldername, type: 'dir', parent})

        if(code && code.status === 0){
            return res.status(422).send('Section code foler already existed')
        }else if(code){
            // This folder had been deleted so recover it now
            code.status = 0
        }else{
            code = new CourseCodeModel()
            code.section_id = section_id
            code.name = foldername
            code.type = 'dir'
            code.parent = parent
            code.status = 0
        }

        await code.save()
        return res.status(200).send('ok')
    } catch (err) {
        _log('Creating section (id: %s) code folder (path: %s) caught an error: %o', section_id, req.body.path, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Update section code file
 */
router.post("/updateSectionCodeFileContent", async function (req, res) {
    const section_id = req.body.sid 
    const parent = path.dirname(req.body.path)
    const filename = path.basename(req.body.path)
    const filedata = req.body.content || ''

    try {
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        const course = await CourseMetaModel.findById(section.course_id)
        if (req.uid != course.created_by)
            return res.status(401).send('Permission denied')

        let code = await CourseCodeModel.findOne({section_id, name:filename, type: 'file', parent})
        if(!code)
            code = new CourseCodeModel({section_id, name: filename, type: 'file', parent, status: 0})
        
        if(code.status === -1)
            code.status = 0

        code.data = filedata
        await code.save()
        return res.status(200).send('ok')
    } catch (err) {
        _log('Updating section (id: %s) code file content (path: %s) caught an error: %o', section_id, req.body.path, err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Delete code file
 * TODO: Recursively delete the directory
 */
router.post("/deleteCodeFile", async function (req, res) {
    const section_id = req.body.sid
    const parent = path.dirname(req.body.path)
    const filename = path.basename(req.body.path)

    try {
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        const course = await CourseMetaModel.findById(section.course_id)
        if (req.uid != course.created_by)
            return res.status(401).send('Permission denied')

        const code = await CourseCodeModel.findOne({section_id, name:filename, status: 0, parent})
        const exists_in_template = await TemplateCodeModel.findOne({template_id: section.template_id, name: filename, parent})            
        if(!code && !exists_in_template)
            return res.status(404).send('Section code not found')

        if(exists_in_template){
            code.status = -1  // mark deleted
            await code.save()
        }else{
            await code.remove()
        }
        return res.status(200).send('deleted')
    } catch (err) {
        _log('Deleting section (id: %s) code file (path: %s) caught an error: %o', section_id, req.body.path, err)        
        return res.status(400).send('Internal Error')
    }
})

/**
 * This API is only requested internally by internal service
 */
router.get('/get-section-codes-without-template', async function(req, res){
    const section_id = req.query.section_id
    try{
        const section = await CourseModel.GetSection(section_id)
        if(!section)
            return res.status(422).send('Invalid section id')
            
        const result = await CodeModel.GetSectionAllCodesContents(section_id)
        return res.status(200).send(result)
    }catch(err){
        _log("get_section_sources (section id: %s) caught an error: %o", section_id, err)
        return res.status(400).send('Internal Error')
    }
})
module.exports = router