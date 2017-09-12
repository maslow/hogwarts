const express = require("express")
const template = require("../model/template")

let router = express.Router()


/**
 * 获取所有模板
 */
router.get('/getTemplates', async function (req, res) {
    let rets = await template.getTemplates()
    res.status(200).send(rets)
})


module.exports = router