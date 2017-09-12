const express = require("express")
const course = require("../model/course")
const code = require("../model/code")
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
    if (dev == 'false' || dev == '0')
        dev = false

    let sectionId = req.query.sid || 0

    if (!code.SecurityChecking(sectionId, p, dev))
        return res.status(422).send('File Path invalid')

    let section = await course.GetSection(sectionId)
    if (!section)
        return res.status(404).send('Section not found')

    if (dev && req.uid != section.created_by)
        return res.status(401).send('Permission denied')

    let rets = await code.GetFiles(section.id.toString(), section.template_id.toString(), p, dev)
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
    let p = req.query.path
    let dev = req.query.dev || false
    if (dev == 'false' || dev == '0')
        dev = false

    let sectionId = req.query.sid || 0

    if (!code.SecurityChecking(sectionId, p, dev))
        return res.status(422).send('File Path invalid')

    let section = await course.GetSection(sectionId)
    if (!section)
        return res.status(404).send('Section not found')

    if (dev && req.uid != section.created_by)
        return res.status(401).send('Permission denied')

    let rets = await code.GetFile(section.id.toString(), section.template_id.toString(), p, dev)
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
    let p = req.body.path
    let sectionId = req.body.sid || 0

    if (!code.SecurityChecking(sectionId, p, true))
        return res.status(422).send('File Path invalid')

    let section = await course.GetSection(sectionId)
    if (!section)
        return res.status(404).send('Section not found')

    if (req.uid != section.created_by)
        return res.status(401).send('Permission denied')

    let ret = await code.CreateFolder(sectionId, p)
    if (ret)
        return res.status(201).send('ok')
    else
        return res.status(200).send('exist')
})

router.post("/updateSectionCodeFileContent", async function (req, res) {
    let p = req.body.path
    let sectionId = req.body.sid || 0
    let content = req.body.content || ''

    if (!code.SecurityChecking(sectionId, p, true))
        return res.status(422).send('File Path invalid')

    let section = await course.GetSection(sectionId)
    if (!section)
        return res.status(404).send('Section not found')

    if (req.uid != section.created_by)
        return res.status(401).send('Permission denied')

    let err = await code.WriteFile(sectionId, p, content)
    if (!err)
        return res.status(200).send('ok')
    else
        return res.status(400).send(err)
})

router.post("/deleteCodeFile", async function (req, res) {
    let p = req.body.path
    let sectionId = req.body.sid || 0

    if (!code.SecurityChecking(sectionId, p, true))
        return res.status(422).send('File Path invalid')

    let section = await course.GetSection(sectionId)
    if (!section)
        return res.status(404).send('Section not found')

    if (req.uid != section.created_by)
        return res.status(401).send('Permission denied')

    let err = await code.DeleteFile(sectionId, section.template_id.toString(), p)
    if (!err)
        return res.status(200).send('deleted')
    else
        return res.status(400).send(err)
})

router.post("/renameSectionCodeFileName", async function (req, res) {
    let section = await course.GetSection(req.query.sid)
    if (!section)
        return res.status(404).send('Section not found')

    //TODO 
    return res.status(200).send('API TBD')
})

module.exports = router