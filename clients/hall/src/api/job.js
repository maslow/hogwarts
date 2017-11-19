import $ from 'jquery'
import Identity from '@/api/identity'

let G_API = Identity.G_API

export default {
  getUserJobBySectionId,

  getFiles,
  getFileContent,
  createSectionCodeFolder,
  updateSectionCodeFileContent,
  deleteCodeFile
}

/**************** Jobs  ****************/
function getUserJobBySectionId(sectionId) {
  return $.ajax({
    url: G_API + '/getUserJobBySectionId?sid=' + sectionId,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}


/**************** Codes ***************/
function getFiles(jobId, path) {
  return $.ajax({
    url: G_API + `/getJobFiles?jid=${jobId}&path=${path}`,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function getFileContent(jobId, path) {
  return $.ajax({
    url: G_API + `/getJobFileContent?jid=${jobId}&path=${path}`,
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function createSectionCodeFolder(section_id, path) {
  return $.ajax({
    url: G_API + `/createSectionCodeFolder`,
    data: {
      sid: section_id,
      path
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

function updateSectionCodeFileContent(section_id, path, content) {
  return $.ajax({
    url: G_API + `/updateSectionCodeFileContent`,
    data: {
      sid: section_id,
      path,
      content
    },
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
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
    headers: {
      'Authorization': 'Bearer ' + Identity.getAccessToken()
    }
  })
}

