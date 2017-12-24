const request = require('superagent')
const debug = require('debug')

const _debug = debug('JOB:DEV')
/*
const section = require('./section')

async function () {
    let file = await section.GetFile(8, 'doc.yaml')
    console.log(file)
}
 */
const SERVER_COURSE = process.env['SERVER_COURSE']
const courseAddr = `http://${SERVER_COURSE}`

module.exports = {
    GetFiles,
    GetFile,
    GetCodesWithoutTemplate,
    GetTests,
    GetSectionById
}

async function GetFiles(sectionId, file) {
    const req = request
        .get(`${courseAddr}/getSectionCodeFiles`)
        .type('json')
        .query({ sid: sectionId, path: file })

    const res = await req
    return res.body
}

async function GetFile(sectionId, file) {
    const req = request
        .get(`${courseAddr}/getSectionCodeFileContent`)
        .type('json')
        .query({ sid: sectionId, path: file })

    const res = await req
    return res.body
}

/**
 * 获取section source，包括section code所有文件及内容、section tests文件内容
 * 返回值格式：
 * {
 *   codes: [{name,type,data}],
 *   tests: '',
 * }
 * @param {*} section_id 
 */
async function GetCodesWithoutTemplate(section_id) {
    const res = await request
        .get(`${courseAddr}/get-section-codes-without-template`)
        .type('json')
        .query({ section_id })

    _debug("Get section (id:%s) source from course service , response body: %o", section_id, res.body)
    return res.body
}

async function GetTests(section_id){
    const res = await request
        .get(`${courseAddr}/getSectionTests`)
        .set({'x-uid': -1 })
        .query({ section_id })

    _debug("Get section (id:%s) tests from course service , response body: %o", section_id, res.text)
    return res.text
}

async function GetSectionById(section_id) {
    const res = await request
        .get(`${courseAddr}/getSectionDetail`)
        .type('json')
        .query({ id: section_id })

    _debug("Get section (id:%s) from course service , response body: %o", section_id, res.body)
    return res.body
}