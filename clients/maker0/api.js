;
(function () {
    window.api = {
        getCourse: getCourse,
        getSection: getSection,
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

    function getFiles(jobid, path) {
        var url = "/jobs/" + jobid + '/files'
        url += path ? '?path=' + path : ''
        return $.ajax({
            url: G_API + url,
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