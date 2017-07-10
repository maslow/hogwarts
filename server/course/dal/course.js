const mysql = require("../mysql.js")

const status = {
    COURSE_DELETED: -1,
    COURSE_CREATED: 0,
    COURSE_PUBLISHED: 1,
    COURSE_MODIFIED: 2
}

async function GetCoursesByUserId(uid, currentUserId) {
    let params = [uid, status.COURSE_PUBLISHED]
    if (uid === currentUserId)
        params = [uid, status.COURSE_CREATED]

    let [rets] = await mysql.Query("select * from course where created_by = ? and status >= ?", params)
    return rets
}

async function GetCourseById(id, uid) {
    let sql = "select * from course where id = ? and  (status >= ? or (status = ? and created_by = ?))"
    let [rets] = await mysql.Query(sql, [id, status.COURSE_PUBLISHED, status.COURSE_CREATED, uid])
    if (rets.length === 0)
        return false
    return rets[0]
}

async function GetCourseByName(name) {
    let [rets] = await mysql.Query("select * from course where name = ?", [name])
    if (rets.length === 0)
        return false
    return rets[0]
}

async function CreateCourse(name, description, uid) {
    let createCourseSql = "insert into course set ?"
    let params = {
        name,
        description,
        status: status.COURSE_CREATED,
        created_by: uid,
        created_at: time(),
        updated_at: time()
    }
    let [rets] = await mysql.Query(createCourseSql, params)
    let [rets0] = await mysql.Query("select * from course where `id` = ?", [rets.insertId])
    return rets0
}

async function CreateChapter(course_id, name, description, seq = 0) {
    let sql = "insert into chapter set ?"
    let params = {
        course_id,
        name,
        description,
        seq,
        created_at: time(),
        updated_at: time()
    }
    let [rets] = await mysql.Query(sql, params)
    let [rets0] = await mysql.Query("select * from chapter where id = ?", [rets.insertId])
    return rets0
}

async function GetChapters(course_id) {
    let [rets] = await mysql.Query("select * from chapter where course_id = ?", [course_id])
    return rets
}

async function GetChapterById(course_id, chapter_id) {
    let [rets] = await mysql.Query("select * from chapter where course_id = ? and id = ?", [course_id, chapter_id])
    if (rets.length === 0)
        return false
    return rets[0]
}

async function GetSections(course_id, uid) {
    let sql = "select * from section where course_id = ? and (status >= ? or (status = ? and created_by = ?))"
    let [rets] = await mysql.Query(sql, [course_id, status.COURSE_PUBLISHED, status.COURSE_CREATED, uid])
    return rets
}

async function GetSection(section_id, uid) {
    let sql = "select * from section where id = ? and (status >= ? or (status = ? and created_by = ?))"
    let [rets] = await mysql.Query(sql, [section_id, status.COURSE_PUBLISHED, status.COURSE_CREATED, uid])
    if (rets.length === 0)
        return false
    return rets[0]
}

async function CreateSection(course_id, chapter_id, name, description, template_id, seq, env, created_by) {
    let sql = "insert into section set ?"
    let params = {
        course_id,
        chapter_id,
        name,
        description,
        template_id,
        seq,
        status: status.COURSE_CREATED,
        env: JSON.stringify(env),
        created_by,
        created_at: time(),
        updated_at: time()
    }
    let [rets] = await mysql.Query(sql, params)
    let [rets0] = await mysql.Query("select * from section where id = ?", [rets.insertId])
    return rets0
}

module.exports = {
    GetCoursesByUserId,
    GetCourseById,
    GetCourseByName,
    CreateCourse,
    CreateChapter,
    GetChapters,
    GetChapterById,
    GetSections,
    CreateSection,
    GetSection
}

function time() {
    return Math.round(new Date().getTime() / 1000)
}