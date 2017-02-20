;
(function () {
    window.api = {
        getSection: getSection,
        getChapter: getChapter,
        getCourse: getCourse,
        getJob: getJob,
        getNextSection: getNextSection,
        eval: eval,
        Login: Login,
        Register: Register,
        getFile: getFile,
        getFiles: getFiles,
        saveFiles: saveFiles        
    }

    function Register(email, password) {
        return $.ajax({
            url: G_API + '/users',
            method: 'post',
            data: {
                email: email,
                password: password
            }
        })
    }

    function Login(email, password) {
        return $.ajax({
            url: G_API + '/tokens',
            method: 'post',
            data: {
                email: email,
                password: password
            }
        })
    }

    function eval(jobid) {
        return $.ajax({
            url: G_API + '/eval/' + jobid,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }

    function getCourse(courseName) {
        return $.ajax({
            url: G_API + "/courses/" + courseName,
            method: 'get'
        })
    }

    function getChapter(courseName, chapterName) {
        return $.ajax({
            url: G_API + "/courses/" + courseName + "/" + chapterName,
            method: 'get'
        })
    }

    function getSection(courseName, chapterName, sectionName) {
        return $.ajax({
            url: G_API + "/courses/" + courseName + '/' + chapterName + '/' + sectionName,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }

    function getNextSection(courseName, chapterName, sectionName) {
        return $.ajax({
            url: G_API + "/courses/" + courseName + '/' + chapterName + '/' + sectionName + '/next',
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }

    function getJob(courseName, chapterName, sectionName) {
        return $.ajax({
            url: G_API + "/jobs/" + courseName + '/' + chapterName + '/' + sectionName,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }

    function getFiles(jobid, path) {
        return $.ajax({
            url: G_API + "/jobs/" + jobid + '/files?path=' + path,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }

    function saveFiles(jobid, files) {
        var reqs = _.map(files, function (file) {
            return $.ajax({
                url: G_API + '/jobs/' + jobid + '/files/' + file.id,
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + Identity.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(file)
            })
        })
        return $.when.apply($, reqs)
    }

    function getFile(jobid, fileid) {
        return $.ajax({
            url: G_API + "/jobs/" + jobid + '/files/' + fileid,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }
})();