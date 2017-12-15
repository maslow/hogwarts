const servers = {
    AUTH: 'http://auth.hogwarts:80',
    COURSE: 'http://course.hogwarts:80',
    JOB: 'http://job.hogwarts:80'
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