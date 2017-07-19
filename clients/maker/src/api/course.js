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
  updateCourseDescription
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
