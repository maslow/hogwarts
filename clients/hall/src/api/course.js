import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {

  getPublishedCourses,
  getCourse,

  getSection,
  getSectionDocs
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
    url: G_API + "/getCourseDetail?id=" + courseId,
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

function getSectionDocs(sid) {
  return new Promise(function (resolve, reject) {
    let data = `> 编写一个程序，使用**异步**方法，读取一个文件，计算该文件内容的行数，并在终端输出行数。`
    resolve(data)
  })
}

function getBearer() {
  const token = Identity.getAccessToken()
  if (!token)
    return ""
    
  return 'Bearer ' + token
}