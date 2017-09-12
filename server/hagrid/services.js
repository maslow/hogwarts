const servers = {
    AUTH: 'http://127.0.0.1:8000',
    COURSE: 'http://127.0.0.1:8001',
    JOB: 'http://127.0.0.1:8002',
    EVAL: 'http://127.0.0.1:8003',
    DBM: 'http://127.0.0.1:8004'
}

let services = [
    {
        routes: ['/db/mysql/:jobid'],
        target: servers.DBM,
        auth: true
    }, {
        routes: [
            "/tokens", "/users"
        ],
        target: servers.AUTH,
        auth: false
    }, {
        routes: ["/users/:id"],
        target: servers.AUTH,
        auth: true
    }, {
        routes: [
            "/getTemplates",
            "/getUserCourses",
            "/getCourseDetail",
            "/getSectionDetail",
            "/getSectionCodeFiles",
            "/getSectionCodeFileContent"
        ],
        target: servers.COURSE,
        auth: false
    }, {
        routes: [
            "/createCourse",
            "/updateCourse",
            "/publishCourse",

            "/createChapter",
            "/updateChapter",
            "/deleteChapter",

            "/createSection",
            "/updateSection",

            "/createSectionCodeFolder",
            "/updateSectionCodeFileContent",
            "/deleteCodeFile",

            "/updateSectionTests",
            "/getSectionTests"
        ],
        target: servers.COURSE,
        auth: true
    }, {
        routes: ["/eval/:jobid"],
        target: servers.EVAL,
        auth: true
    }, {
        routes: [
            "getUserJobBySectionId"
        ],
        target: servers.JOB,
        auth: true
    }
]
module.exports = {
    servers,
    services
}