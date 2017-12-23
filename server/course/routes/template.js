const express = require("express")
const TemplateModel = require("../model/template")
const debug = require('debug')

const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * Get template list
 */
router.get('/getTemplates', async function (req, res) {
    try {
        const templates = await TemplateModel.getTemplates()
        return res.status(200).send(templates)
    } catch (err) {
        _log("Retrieve templates caught an error: %o", err)
        return res.status(400).send('Internal Error')
    }
})

/**
 * Get an template info by its id
 */
router.get('/getTemplate', async function (req, res) {
    const template_id = req.query.template_id
    try {
        const template = await TemplateModel.getTemplateById(template_id)
        if(!template)
            return res.status(404).send('Object Not Found')
        return res.status(200).send(template)
    } catch (err) {
        _log("Retrieve template by id (%s) caught an error: %o", template_id, err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router