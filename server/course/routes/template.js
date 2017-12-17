const express = require("express")
const TemplateModel = require("../model/template")
const debug = require('debug')

const router = express.Router()
const _log = debug('COURSE:PROD')

/**
 * 获取所有模板
 */
router.get('/getTemplates', async function (req, res) {
    try {
        const templates = await TemplateModel.getTemplates()
        return res.status(200).send(templates)
    } catch (err) { 
        _log("Retrive templates caught an error: %o", err)
        return res.status(400).send('Internal Error')
    }
})

module.exports = router