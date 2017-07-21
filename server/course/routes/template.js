const express = require("express")
const template = require("../dal/template")

let router = express.Router()


/**
 * 获取所有模板
 */
router.get('/getTemplates', async function (req, res) {
    let rets = await template.GetTemplates()
    res.status(200).send(rets)
})


module.exports = router