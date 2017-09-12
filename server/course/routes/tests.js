const express = require("express")
const tests = require("../model/tests")
const course = require("../model/course")
let router = express.Router()

router.post('/updateSectionTests', async function (req, res) {
    let section_id = req.body.section_id
    let codes = req.body.codes || null

    let section = await course.GetSection(section_id)
    if (!section)
        return res.status(422).send("Section not found")

    if (section.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let rets = await tests.updateCode(section_id, codes)
    return res.status(200).send(rets)
})

router.get('/getSectionTests', async function (req, res) {
    let section_id = req.query.section_id

    let section = await course.GetSection(section_id)
    if (!section)
        return res.status(422).send("Section not found")

    if (section.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let rets = await tests.getCode(section_id)
    return res.status(200).send(rets)
})

module.exports = router