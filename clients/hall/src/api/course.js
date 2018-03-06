import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  getPublishedCourses,
  getCourse,

  getSection
}

/**************** Courses  ****************/
function getPublishedCourses() {

  return $.ajax({
    url: G_API + '/getPublishedCourses',
    method: 'get',
    headers: {
      'Authorization': getBearer()
    }
  })
}

function getCourse(courseId) {
  return $.ajax({
    url: G_API + "/getCourse?id=" + courseId,
    method: 'get',
    headers: {
      'Authorization': getBearer()
    }
  })
}

/***********   Sections   ************/
function getSection(sectionId) {
  return $.ajax({
    url: G_API + "/getSectionDetail?id=" + sectionId,
    method: 'get',
    headers: {
      'Authorization': getBearer()
    }
  })
}

function getBearer() {
  const token = Identity.getAccessToken()
  if (!token)
    return ""
    
  return 'Bearer ' + token
}