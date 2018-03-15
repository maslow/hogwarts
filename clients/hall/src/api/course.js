import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  getPublishedCourses,
  getCourse,

  getSection,
  getSectionCodeFiles,
  getSectionCodeFileContent,
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

/**************** Codes ***************/
function getSectionCodeFiles(section_id, path) {
  return $.ajax({
    url: G_API + `/getSectionCodeFiles?sid=${section_id}&path=${path}`,
    method: 'get',
    headers: { 'Authorization': getBearer() }
  })
}

function getSectionCodeFileContent(section_id, path) {
  return $.ajax({
    url: G_API + `/getSectionCodeFileContent?sid=${section_id}&path=${path}`,
    method: 'get',
    headers: { 'Authorization': getBearer() }
  })
}

function getBearer() {
  const token = Identity.getAccessToken()
  if (!token)
    return ""
    
  return 'Bearer ' + token
}

