import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  getTemplates,

  getUserCourses,
  getCourse,
  createCourse,
  publishCourse,
  renameCourse,
  updateCourseDescription,

  createChapter,
  renameChapter,
  updateChapterDescription,
  adjustChapterSeq,
  deleteChapter,

  getSection,
  createSection,
  publishSection,
  renameSection,
  updateSectionDescription,
  adjustSectionSeq,

  getSectionCodeFiles,
  getSectionCodeFileContent,
  createSectionCodeFolder,
  updateSectionCodeFileContent,
  deleteCodeFile,

  getSectionTests,
  updateSectionTests,
  getSectionDocs,
  updateSectionDocs
}

function getTemplates() {
  return $.ajax({
    url: G_API + '/getTemplates',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

/**************** Courses  ****************/
function getUserCourses() {
  return $.ajax({
    url: G_API + '/getUserCourses?uid=' + Identity.getUserId(),
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function getCourse(courseId) {
  return $.ajax({
    url: G_API + "/getCourseDetail?id=" + courseId,
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function createCourse(data) {
  return $.ajax({
    url: G_API + '/createCourse',
    data: data,
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function updateCourseDescription(course_id, description) {
  return _updateCourse({ course_id, description })
}

function renameCourse(course_id, name) {
  return _updateCourse({ course_id, name })
}

function publishCourse(courseId) {
  return $.ajax({
    url: G_API + '/publishCourse',
    data: { id: courseId },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

/**************  Chapters  **************/
function createChapter(courseId, chapterName, chapterDescription) {
  return $.ajax({
    url: G_API + '/createChapter',
    data: {
      course_id: courseId,
      name: chapterName,
      description: chapterDescription
    },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function renameChapter(chapter_id, name) {
  return _updateChapter({ chapter_id, name })
}

function updateChapterDescription(chapter_id, description) {
  return _updateChapter({ chapter_id, description })
}

function adjustChapterSeq(chapter_id, seq) {
  return _updateChapter({ chapter_id, seq })
}

function deleteChapter(chapterId) {
  return $.ajax({
    url: G_API + '/deleteChapter',
    data: { id: chapterId },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

/***********   Sections   ************/
function getSection(sectionId) {
  return $.ajax({
    url: G_API + "/getSectionDetail?id=" + sectionId,
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function createSection(courseId, chapterId, templateId, name, description, image) {
  return $.ajax({
    url: G_API + '/createSection',
    data: {
      course_id: courseId,
      chapter_id: chapterId,
      template_id: templateId || 0,
      name,
      description,
      image
    },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function publishSection(section_id) {
  return $.ajax({
    url: G_API + '/publishSection',
    data: { section_id },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function renameSection(section_id, name) {
  return _updateSection({ section_id, name })
}

function updateSectionDescription(section_id, description) {
  return _updateSection({ section_id, description })
}

function adjustSectionSeq(section_id, seq) {
  return _updateSection({ section_id, seq })
}

/**************** Codes ***************/
function getSectionCodeFiles(section_id, path, dev = false) {
  return $.ajax({
    url: G_API + `/getSectionCodeFiles?sid=${section_id}&path=${path}&dev=${dev}`,
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function getSectionCodeFileContent(section_id, path, dev = false) {
  return $.ajax({
    url: G_API + `/getSectionCodeFileContent?sid=${section_id}&path=${path}&dev=${dev}`,
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function createSectionCodeFolder(section_id, path) {
  return $.ajax({
    url: G_API + `/createSectionCodeFolder`,
    data: { sid: section_id, path },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function updateSectionCodeFileContent(section_id, path, content) {
  return $.ajax({
    url: G_API + `/updateSectionCodeFileContent`,
    data: { sid: section_id, path, content },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function deleteCodeFile(section_id, path) {
  return $.ajax({
    url: G_API + `/deleteCodeFile`,
    data: {
      sid: section_id,
      path
    },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

/****************** Tests ***************** */
function updateSectionTests(section_id, codes) {
  return $.ajax({
    url: G_API + '/updateSectionTests',
    data: { section_id, codes },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function getSectionTests(section_id) {
  return $.ajax({
    url: G_API + '/getSectionTests?section_id=' + section_id,
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

/************ Privates  *************/
function _updateCourse(data) {
  return $.ajax({
    url: G_API + '/updateCourse',
    data: {
      course_id: data.course_id,
      name: data.name || null,
      description: data.description || null
    },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function _updateChapter(data) {
  return $.ajax({
    url: G_API + '/updateChapter',
    data: {
      chapter_id: data.chapter_id,
      name: data.name || null,
      description: data.description || null,
      seq: data.seq || null
    },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function _updateSection(data) {
  return $.ajax({
    url: G_API + '/updateSection',
    data: {
      section_id: data.section_id,
      name: data.name || null,
      description: data.description || null,
      image: data.image || null,
      template_id: data.template_id || null,
      seq: data.seq || null
    },
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function getSectionDocs(sid) {
  return new Promise(function (resolve, reject) {
    let data = `> 编写一个程序，使用**异步**方法，读取一个文件，计算该文件内容的行数，并在终端输出行数。`
    resolve(data)
  })
}

function updateSectionDocs(sid, data) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000)
  })
}
