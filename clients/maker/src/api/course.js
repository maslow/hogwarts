import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  getCourse,
  getUserCourses,
  getSection,
  createCourse,
  publishCourse,
  renameCourse,
  updateCourseDescription,
  createChapter,
  renameChapter,
  updateChapterDescription,
  adjustChapterSeq,
  deleteChapter
}

/**
 * @param {*} courseId
 * @param {*} newValue
 */
function updateCourseDescription(courseId, newValue) {
  return $.ajax({
    url: G_API + '/updateCourseDescription',
    data: {
      id: courseId,
      description: newValue
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

/**
 * @param {*} courseId
 * @param {*} name
 */
function renameCourse(courseId, name) {
  return $.ajax({
    url: G_API + '/renameCourse',
    data: {
      id: courseId,
      name: name
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function createCourse(data) {
  return $.ajax({
    url: G_API + '/createCourse',
    data: data,
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

/**
 * @param {Integer} courseId
 */
function publishCourse(courseId) {
  return $.ajax({
    url: G_API + '/publishCourse',
    data: {
      id: courseId
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function getUserCourses() {
  return $.ajax({
    url: G_API + '/getUserCourses?uid=' + Identity.getUserId(),
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function getCourse(courseId) {
  return $.ajax({
    url: G_API + "/getCourseDetail?id=" + courseId,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function getSection(sectionId) {
  return $.ajax({
    url: G_API + "/getSectionDetail?id=" + sectionId,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function createChapter(courseId, chapterName, chapterDescription) {
  return $.ajax({
    url: G_API + '/createChapter',
    data: {
      course_id: courseId,
      name: chapterName,
      description: chapterDescription
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

/**
 * @param {*} courseId
 * @param {*} name
 */
function renameChapter(chapterId, name) {
  return $.ajax({
    url: G_API + '/renameChapter',
    data: {
      id: chapterId,
      name
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

/**
 * @param {*} courseId
 * @param {*} name
 */
function updateChapterDescription(chapterId, description) {
  return $.ajax({
    url: G_API + '/updateChapterDescription',
    data: {
      id: chapterId,
      description
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function adjustChapterSeq(chapterId, seq) {
  return $.ajax({
    url: G_API + '/adjustChapterSeq',
    data: {
      id: chapterId,
      seq
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function deleteChapter(chapterId) {
  return $.ajax({
    url: G_API + '/deleteChapter',
    data: {
      id: chapterId
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}
