const servers = {
    AUTH: 'http://127.0.0.1:8000',
    COURSE: 'http://127.0.0.1:8001',
    JOB: 'http://127.0.0.1:8002',
    EVAL: 'http://127.0.0.1:8003',
    DBM: 'http://127.0.0.1:8004'
}

let services = [{
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
        "/renameCourse",
        "/updateCourseDescription",
        "/publishCourse",
        "/createChapter",
        "/createSection",
        "/createSectionCodeFolder",
        "/renameSectionCodeFileName",
        "/updateSectionCodeFileContent"
    ],
    target: servers.COURSE,
    auth: true
}, {
    routes: ["/eval/:jobid"],
    target: servers.EVAL,
    auth: true
}, {
    routes: [
        "/jobs", "/jobs/:jobId", "/jobs/:courseId/:chapterId/:sectionId", "/jobs/:jobId/files", "/jobs/:jobId/files/:fileId"
    ],
    target: servers.JOB,
    auth: true
}]
module.exports = {
    servers,
    services
}