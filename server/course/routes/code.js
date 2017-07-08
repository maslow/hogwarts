const express = require("express")
const course = require("../dal/course")
const code = require("../dal/code")

let router = express.Router()

/**
 * 
 */
router.get('/section/:sid/codes/:path', async function (req, res) {
    req.checkParams('sid').notEmpty().isInt()
    req.checkParams('path').notEmpty()

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let section = await course.GetSection(req.params.sid, req.uid)
    if(!section)
        return res.status(404).send('Section not found')

    // TODO
})

module.exports = router