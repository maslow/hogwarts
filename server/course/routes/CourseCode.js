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
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')
        
        // find section codes and template codes
        const codes = await CourseCodeModel.find({section_id, parent})
        const codes_from_templates = await TemplateCodeModel.find({template_id: section.template_id, parent})

        // Merge section codes & template codes
        let merged = codes.concat(codes_from_templates)
        merged = _.uniqBy(merged, 'name')
        merged = merged.filter(code => code.template_id || code.status === 'normal')

        // return merged codes
        return res.status(200).send(merged)
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
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        // find section code 
        const code = await CourseCodeModel.findOne({section_id, type: 'file', name: filename, parent})

        // return directly if code has been marked as deleted
        if(code && code === 'deleted') 
            return res.status(404).send('Section code file not found')

        // find code from template if it is not found above
        let code_from_template = null
        if(!code)
            code_from_template = await TemplateCodeModel.findOne({template_id: section.template_id, type:'file', name: filename, parent})

        // return directly if code totally not exists
        if (!code && !code_from_template)
            return res.status(404).send('Section code file not found')
        
        // return data from section code or template code
        const data = code ? code.data : code_from_template.data
        return res.status(200).send({
            name: req.query.path,
            hash: Helper.md5(data),
            content: data
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
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        // lock the section if published
        if(section.status === 'published'){
            section.status = 'locked'
            await section.save()
        }

        // find course for permission checking
        const course = await CourseMetaModel.findById(section.course_id)
        if (req.uid != course.created_by)
            return res.status(401).send('Permission denied')

        // find section code
        let code = await CourseCodeModel.findOne({section_id, name: foldername, type: 'dir', parent})

        // return directly if folder exists and its status is normal
        if(code && code.status === 'normal'){
            return res.status(422).send('Section code foler already existed')
        }else if(code){
            // this folder had been deleted and now recover it
            code.status = 'normal'
        }else{
            // create the folder
            code = new CourseCodeModel()
            code.section_id = section_id
            code.name = foldername
            code.type = 'dir'
            code.parent = parent
            code.status = 'normal'
        }

        // save it
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
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        // lock the section if published
        if(section.status === 'published'){
            section.status = 'locked'
            await section.save()
        }

        // find course for permission checking
        const course = await CourseMetaModel.findById(section.course_id)
        if (req.uid != course.created_by)
            return res.status(401).send('Permission denied')

        // find section code or create a new section code if not exists
        let code = await CourseCodeModel.findOne({section_id, name:filename, type: 'file', parent})
        if(!code)
            code = new CourseCodeModel({section_id, name: filename, type: 'file', parent, status: 'normal'})
        
        // if code had been deleted, recover it
        if(code.status === 'deleted')
            code.status = 'normal'

        // save code
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
router.post("/deleteSectionCodeFile", async function (req, res) {
    const section_id = req.body.sid
    const parent = path.dirname(req.body.path)
    const filename = path.basename(req.body.path)

    try {
        // find section
        const section = await CourseSectionModel.findById(section_id)
        if (!section)
            return res.status(404).send('Section not found')

        // lock the section if published
        if(section.status === 'published'){
            section.status = 'locked'
            await section.save()
        }

        // find course for permission validation
        const course = await CourseMetaModel.findById(section.course_id)
        if (req.uid != course.created_by)
            return res.status(401).send('Permission denied')

        // find section code
        const code = await CourseCodeModel.findOne({section_id, name:filename, parent})
        const exists_in_template = await TemplateCodeModel.findOne({template_id: section.template_id, name: filename, parent})

        // return if code not exists 
        if(!code && !exists_in_template)
            return res.status(404).send('Section code not found')

        // mark deleted if code exists in template , or remove it directly
        if(exists_in_template){
            code.status = 'deleted'
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
        // find sectioin
        const section = await CourseSectionModel.findById(section_id)
        if(!section)
            return res.status(422).send('Section not found')
        
        // get section codes without template codes
        const result = await CourseCodeModel.find({section_id, status: 'normal'})
        return res.status(200).send(result)
    }catch(err){
        _log("get_section_sources (section id: %s) caught an error: %o", section_id, err)
        return res.status(400).send('Internal Error')
    }
})
module.exports = router