const db = require('../mysql')
const request = require('superagent')
const debug = require('debug')

const _debug = debug('JOB:DEV')
const evalAddr = "http://eval.hogwarts:80"

const CREATED = 0
const FAILED = 1
const PASSED = 2

module.exports = {
    CREATED,
    FAILED,
    PASSED,
    GetUserJobBySectionId,
    CreateUserJob,
    GetJobById,
    EvalRequest
}

async function GetUserJobBySectionId(userId, sectionId) {
    const sql = "select * from job where uid = ? and sectionId = ?"
    const params = [userId, sectionId]

    const [rets] = await db.Query(sql, params)
    if (rets.length === 0)
        return false

    return rets[0]
}

async function GetJobById(jobId) {
    const sql = "select * from job where id = ?"
    const params = [jobId]

    const [rets] = await db.Query(sql, params)
    if (rets.length === 0)
        return false

    return rets[0]
}

async function CreateUserJob(userId, sectionId) {
    const sql = "insert into job set ?"
    const params = {
        uid: userId,
        sectionId,
        status: CREATED,
        updated_at: time()
    }

    const [rets] = await db.Query(sql, params)
    const [rets0] = await db.Query("select * from job where id = ?", [rets.insertId])
    return rets0[0]
}

async function EvalRequest(job_id, job_image, job_source) {
    const res = await request
        .post(`${evalAddr}/eval`)
        .send({ job_id, job_source, job_image })
        .type('json')

    _debug("Eval job (id:%s), image_name:%s , response body: %o", job_id, job_image, res.body)
    return res.body
}

function time() {
    return Math.round(new Date().getTime() / 1000)
}