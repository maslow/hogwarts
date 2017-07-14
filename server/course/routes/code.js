const express = require("express")
const course = require("../dal/course")
const code = require("../dal/code")
const path = require("path")
const util0 = require("../util")

let router = express.Router()

/**
 * url: /getSectionCodeFiles
 * query:
 *  - sid required
 *  - path optional default /
 *  - dev optional default false
 */
router.get("/getSectionCodeFiles", async function (req, res) {
    let p = req.query.path || "/"
    let dev = req.query.dev || false
    let sectionId = req.query.sid || 0

    if (!code.SecurityChecking(sectionId, p, dev))
        return res.status(422).send('File Path invalid')

    let section = await course.GetSection(sectionId)
    if (!section)
        return res.status(404).send('Section not found')

    if (dev && req.uid != section.created_by)
        return res.status(401).send('Permission denied')

    let rets = await code.GetCodeDirFiles(section.id.toString(), section.template_id.toString(), p, dev)
    if (rets === null)
        return res.status(404).send('Section Code not found')

    return res.status(200).send(rets)
})

/**
 * url: /getSectionCodeFileContent
 * query:
 *  - sid required
 *  - path optional default /
 *  - dev optional default false
 */
router.get("/getSectionCodeFileContent", async function (req, res) {
    let p = req.query.path || '/'
    let dev = req.query.dev || false
    let sectionId = req.query.sid || 0

    if (!code.SecurityChecking(sectionId, p, dev))
        return res.status(422).send('File Path invalid')

    let section = await course.GetSection(sectionId)
    if (!section)
        return res.status(404).send('Section not found')

    if (dev && req.uid != section.created_by)
        return res.status(401).send('Permission denied')

    let rets = await code.GetCodeFileContent(section.id.toString(), section.template_id.toString(), p, dev)
    if (rets === null)
        return res.status(404).send('Section code file not found')

    let data = rets.toString('utf-8')
    return res.status(200).send({
        name: req.query.path,
        hash: util0.md5(data),
        content: rets.toString('utf-8')
    })
})

router.post("/createSectionCodeFolder", async function (req, res) {
    let section = await course.GetSection(req.query.sid)
    if (!section)
        return res.status(404).send('Section not found')

    //TODO 
    return res.status(200).send('API TBD')
})

router.post("/renameSectionCodeFileName", async function (req, res) {
    let section = await course.GetSection(req.query.sid)
    if (!section)
        return res.status(404).send('Section not found')

    //TODO 
    return res.status(200).send('API TBD')
})

router.post("/updateSectionCodeFileContent", async function (req, res) {
    let section = await course.GetSection(req.query.sid)
    if (!section)
        return res.status(404).send('Section not found')

    //TODO 
    return res.status(200).send('API TBD')
})

module.exports = router