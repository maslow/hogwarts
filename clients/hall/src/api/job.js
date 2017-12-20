import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  getUserJobBySectionId,
  evalUserJobByJobId,

  getFiles,
  getFileContent,
  updateFileContent,
  createFolder,
  deleteFile
}

/**************** Jobs  ****************/
function getUserJobBySectionId(sectionId) {
  return $.ajax({
    url: G_API + '/getUserJobBySectionId?sid=' + sectionId,
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

function evalUserJobByJobId(job_id) {
  return $.ajax({
    url: G_API + '/evalUserJobByJobId',
    data:{job_id},
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + Identity.getAccessToken() }
  })
}

/**************** Job Codes ***************/
function getFiles(jobId, path) {
  return $.ajax({
    url: G_API + `/getJobFiles?jid=${jobId}&path=${path}`,
    method: 'get',
    headers: {'Authorization': 'Bearer ' + Identity.getAccessToken()}
  })
}

function getFileContent(jobId, path) {
  return $.ajax({
    url: G_API + `/getJobFileContent?jid=${jobId}&path=${path}`,
    method: 'get',
    headers: {'Authorization': 'Bearer ' + Identity.getAccessToken()}
  })
}

function createFolder(jobId, path) {
  return $.ajax({
    url: G_API + `/createJobFolder`,
    data: {jid: jobId,path},
    method: 'post',
    headers: {'Authorization': 'Bearer ' + Identity.getAccessToken()}
  })
}

function updateFileContent(jobId, path, content) {
  return $.ajax({
    url: G_API + `/updateJobFileContent`,
    data: {jid: jobId,path,content},
    method: 'post',
    headers: {'Authorization': 'Bearer ' + Identity.getAccessToken()}
  })
}

function deleteFile(jobId, path) {
  return $.ajax({
    url: G_API + `/deleteJobFile`,
    data: {jid: jobId,path},
    method: 'post',
    headers: {'Authorization': 'Bearer ' + Identity.getAccessToken()}
  })
}