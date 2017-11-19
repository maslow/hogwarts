const servers = {
    AUTH: 'http://127.0.0.1:8000',
    COURSE: 'http://127.0.0.1:8001',
    JOB: 'http://127.0.0.1:8002'
}

let services = [
    {
        routes: [
            "/tokens", "/users"
        ],
        target: servers.AUTH,
        auth: false
    },
    {
        routes: ["/getUser"],
        target: servers.AUTH,
        auth: true
    },
    {
        routes: [
            "/getTemplates",
            "/getUserCourses",

            "/getPublishedCourses",
            "/getCourseDetail" ,           

            "/getSectionDetail",
            "/getSectionCodeFiles",
            "/getSectionCodeFileContent"
        ],
        target: servers.COURSE,
        auth: false
    },
    {
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
    },
    {
        routes: [
            "/getUserJobBySectionId",
            "/getJobFiles",
            "/getJobFileContent",
            "/updateJobFileContent",
            "/createJobFolder",
            "/deleteJobFile"
        ],
        target: servers.JOB,
        auth: true
    }
]
module.exports = {
    servers,
    services
}