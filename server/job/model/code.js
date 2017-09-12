const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

async function GetFiles(jobId, dir) {
    const codePath = path.join(root(), jobId, 'codes', dir)
    
}

async function GetFile(jobId, file) {

}

async function CreateFolder(jobId, dir) {

}

async function WriteFile(jobId, file, content) {

}

async function DeleteFile(jobId, file) {

}

function root() {
    return path.join(__dirname, '..', 'data', 'jobs')
}