import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
    getCourse,
    getUserCourses,
    getSection,
    createCourse,
    publishCourse
}

function createCourse(data){
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
 * TODO
 * @param {Integer} courseId 
 */
function publishCourse(courseId){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
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