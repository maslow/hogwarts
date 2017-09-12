const db = require('../mysql')

const CREATED = 0
const FAILED = 1
const PASSED = 2

module.exports = {
    CREATED,
    FAILED,
    PASSED,
    GetUserJobBySectionId,
    CreateUserJob
}

async function GetUserJobBySectionId(userId, sectionId) {
    const sql = "select * from job where uid = ? and sectionId = ?"
    const params = [userId, sectionId]

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

function time() {
    return Math.round(new Date().getTime() / 1000)
}