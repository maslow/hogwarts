const express = require("express")
const debug = require('debug')

const DocumentModel = require("../model/document")
const CourseModel = require("../model/course")
const CodeModel = require("../model/code")

const router = express.Router()
const _log = debug('COURSE:PROD')

router.post('/updateSectionDocument', async function (req, res) {
    const section_id = req.body.section_id
    const document = req.body.document_data || ''

    try {
        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(422).send("Section not found")

        if (section.created_by != req.uid)
            return res.status(401).send('Permission denied')

        await DocumentModel.write(section_id, document)
        const updated_document = await DocumentModel.read(section_id)
        return res.status(200).send(updated_document)
    } catch (err) {
        _log("Updating section (id:%s) document caught an error: %o", section_id, err)
        return res.status(400).send('Internal Error')
    }
})

router.get('/getSectionDocument', async function (req, res) {
    const section_id = req.query.section_id
    let dev = req.query.dev || false
    if (dev == 'false' || dev == '0')
        dev = false

    try {
        const section = await CourseModel.GetSection(section_id)
        if (!section)
            return res.status(422).send("Section not found")

        if (section.created_by != req.uid)
            return res.status(401).send('Permission denied')

        const document = await DocumentModel.read(section_id, dev)
        return res.status(200).send(document)
    } catch (err) {
        _log("Updating section (id:%s) document caught an error: %o", section_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router