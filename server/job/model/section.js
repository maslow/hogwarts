const request = require('superagent')

/*
const section = require('./section')

async function () {
    let file = await section.GetFile(8, 'doc.yaml')
    console.log(file)
}
 */
const courseAddr = "http://127.0.0.1:8888"

module.exports = {
    GetFiles,
    GetFile
}

async function GetFiles(sectionId, file) {
    try {
        const req = request
            .get(`${courseAddr}/getSectionCodeFiles`)
            .type('json')
            .query({ sid: sectionId, path: file })

        const res = await req
        return res.body
    } catch (err) {
        console.error(err)
        return false
    }
}

async function GetFile(sectionId, file) {
    try {
        const req = request
            .get(`${courseAddr}/getSectionCodeFileContent`)
            .type('json')
            .query({ sid: sectionId, path: file })

        const res = await req
        return res.body
    } catch (err) {
        console.error(err)
        return false
    }
}