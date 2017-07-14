const mysql = require("../mysql.js")

const COURSE_DELETED = -1
const COURSE_CREATED = 0
const COURSE_PUBLISHED = 1


async function GetCoursesByUserId(userId) {
    let [rets] = await mysql.Query("select * from course where created_by = ?", [userId])
    return rets
}

async function GetCourseById(id) {
    let [rets] = await mysql.Query("select * from course where id = ?", [id])
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

async function CreateCourse(name, description, userId) {
    let createCourseSql = "insert into course set ?"
    let params = {
        name,
        description,
        status: COURSE_CREATED,
        created_by: userId,
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

async function GetSections(course_id) {
    let [rets] = await mysql.Query("select * from section where course_id = ?", [course_id])
    return rets
}

async function GetSection(section_id) {
    let [rets] = await mysql.Query("select * from section where id = ?", [section_id])
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
        status: COURSE_CREATED,
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
    GetSection,
    COURSE_DELETED,
    COURSE_CREATED,
    COURSE_PUBLISHED

}

function time() {
    return Math.round(new Date().getTime() / 1000)
}