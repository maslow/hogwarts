;
(function () {
    window.api = {
        getSection: getSection,
        getChapter: getChapter,
        getCourse: getCourse,
        getJob: getJob,
        saveCodes: saveCodes,
        eval: eval,
        Login: Login,
        Register: Register,
        getFile: getFile
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

    function saveCodes(jobid, codes) {
        var reqs = _.map(codes, function (code) {
            return $.ajax({
                url: G_API + '/jobs/' + jobid + '/file',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + Identity.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    name: code.name,
                    content: code.content
                })
            })
        })
        return $.when.apply($, reqs)
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

    function getJob(courseName, chapterName, sectionName) {
        return $.ajax({
            url: G_API + "/jobs/" + courseName + '/' + chapterName + '/' + sectionName,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }

    function getFile(jobid, filename) {
        return $.ajax({
            url: G_API + "/jobs/" + jobid + '/file?file=' + filename,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + Identity.getAccessToken()
            }
        })
    }
})();