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
            "/courses",
            "/courses/:id",
            "/courses/:courseId/:chapterId",
            "/courses/:courseId/:chapterId/:sectionId",
            "/courses/:courseId/:chapterId/:sectionId/next",
            "/courses/:courseId/:chapterId/:sectionId/prev"
        ],
        target: servers.COURSE,
        auth: false
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
    }
]
module.exports = {
    servers,
    services
}