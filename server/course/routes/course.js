const express = require("express")
const course = require("../dal/course")

let router = express.Router()


/**
 * 获取一个用户创建的课程
 */
router.get('/getUserCourses', async function (req, res) {
    let uid = req.query.uid || false
    if (!uid)
        return res.status(422).send(errors.mapped())

    let rets = await course.GetCoursesByUserId(uid)
    rets = rets.filter(c => {
        let s = (req.uid == uid) ? course.COURSE_CREATED : course.COURSE_PUBLISHED
        return c.status >= s
    })

    res.status(200).send(rets)
})

/**
 * 获取课程详情
 */
router.get('/getCourseDetail', async function (req, res) {
    req.checkQuery('id').notEmpty().isInt({min: 1})

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let courseId = req.query.id
    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(404).send("Object not found")

    if (course0.created_by != req.uid && course0.status === course.COURSE_CREATED)
        return res.status(403).send("Permission denied")

    let chapters = await course.GetChapters(courseId)
    let sections = await course.GetSections(courseId)
    sections = sections.filter(s => {
        let status = (req.uid == s.created_by) ? course.COURSE_CREATED : course.COURSE_PUBLISHED
        return s.status >= status
    })

    return res.status(200).send({
        course: course0,
        chapters,
        sections
    })
})

/**
 * 创建课程
 */
router.post('/createCourse', async function (req, res) {
    req.checkBody('name').notEmpty().isInt({min: 1})
    req.checkBody('description').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    if (await course.GetCourseByName(req.body.name))
        return res.status(422).send({
            name: "Name exist"
        })

    let ret = await course.CreateCourse(req.body.name, req.body.description, req.uid)
    res.status(201).send(ret)
})

/**
 * 重命名课程
 */
router.post('/renameCourse', async function (req, res) {
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('name').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let courseId = req.body.id
    let name = req.body.name
    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(404).send("Object not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateCourse(courseId, {
        name
    })
    res.status(201).send(ret)
})

/**
 * 发布课程
 */
router.post('/publishCourse', async function (req, res) {
    req.checkBody('id').notEmpty().isInt({min: 1})

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let courseId = req.body.id
    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(404).send("Object not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    if (course0.status !== 0)
        return res.status(422).send("Course was already published or deleted")

    let ret = await course.UpdateCourse(courseId, {
        status: course.COURSE_PUBLISHED
    })
    res.status(201).send(ret)
})

/**
 * 更新课程简介
 */
router.post('/updateCourseDescription', async function (req, res) {
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('description').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let courseId = req.body.id
    let description = req.body.description
    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(404).send("Object not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateCourse(courseId, {
        description
    })
    res.status(201).send(ret)
})

/**
 * 创建章节
 */
router.post('/createChapter', async function (req, res) {
    req.checkBody('course_id').notEmpty().isInt({min: 1})
    req.checkBody('name').notEmpty().isLength(1, 64)
    req.checkBody('description').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    let courseId = req.body.course_id
    let seq = req.body.seq || 50
    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(422).send("Course Id is invalid")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let chapter = await course.CreateChapter(courseId, req.body.name, req.body.description, seq)
    return res.status(201).send(chapter)
})

/**
 * 重命名章节
 */
router.post('/renameChapter', async function (req, res) {
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('name').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let name = req.body.name
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter)
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0)
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateChapter(chapterId, {
        name
    })
    res.status(201).send(ret)
})

/**
 * 修改章节简介
 */
router.post('/updateChapterDescription', async function (req, res) {
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('description').notEmpty().isLength(1, 255)

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let description = req.body.description
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter)
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0)
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateChapter(chapterId, {
        description
    })
    res.status(201).send(ret)
})

router.post('/adjustChapterSeq', async function(req, res){
    req.checkBody('id').notEmpty().isInt({min: 1})
    req.checkBody('seq').notEmpty().isInt({ min: 0, max: 100 })

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let seq = req.body.seq
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter)
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0)
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let ret = await course.UpdateChapter(chapterId, {
        seq
    })
    res.status(201).send(ret)
})

router.post('/deleteChapter', async function(req, res){
    req.checkBody('id').notEmpty().isInt({min: 1})

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (errors.isEmpty() === false)
        return res.status(422).send(errors.mapped())

    let chapterId = req.body.id
    let chapter = await course.GetChapterById(chapterId)
    if (!chapter)
        return res.status(404).send("Chapter not found")

    let course0 = await course.GetCourseById(chapter.course_id)
    if (!course0)
        return res.status(404).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    let sections = await course.GetSections(chapter.course_id)
    sections = sections.filter(s => s.chapter_id === chapter.id)
    if(sections.length)
        return res.status(422).send('The chapter cannot be deleted util no sections in it.')

    let ret = await course.DeleteChapter(chapterId)
    console.log(ret)
    res.status(201).send(ret)
})

router.get('/getSectionDetail', async function (req, res) {
    req.checkQuery('id').notEmpty().isInt({min: 1})

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty)
        return res.status(422).send(errors.mapped())

    let section = await course.GetSection(req.query.id)
    if (!section)
        return res.status(404).send("Section not exists")

    if (req.uid != section.created_by && section.status === course.COURSE_CREATED)
        return res.status(403).send("Permisson denied")

    return res.status(200).send(section)
})

/**
 * 创建小节
 */
router.post('/createSection', async function (req, res) {
    req.checkBody('course_id').notEmpty().isInt({min: 1})
    req.checkBody('chapter_id').notEmpty().isInt({min: 1})
    req.checkBody('name').notEmpty().isLength(1, 64)
    req.checkBody('description').notEmpty().isLength(1, 255)
    req.checkBody('image').notEmpty()

    let errors = await req.getValidationResult()
    errors.useFirstErrorOnly()
    if (!errors.isEmpty())
        return res.status(422).send(errors.mapped())

    let courseId = req.body.course_id
    let seq = req.body.seq || 50
    let template_id = req.body.template_id || 0

    let course0 = await course.GetCourseById(courseId)
    if (!course0)
        return res.status(422).send("Course not found")

    if (course0.created_by != req.uid)
        return res.status(401).send('Permission denied')

    if (!await course.GetChapterById(courseId, req.body.chapter_id))
        return res.status(422).send({
            chapter_id: "Chapter Id is invalid"
        })

    let env = {
        image: req.body.image
    }

    let section = await course.CreateSection(
        courseId,
        req.body.chapter_id,
        req.body.name,
        req.body.description,
        template_id,
        seq,
        env,
        req.uid)

    return res.status(200).send(section)
})

module.exports = router