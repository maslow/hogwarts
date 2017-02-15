const servers = {
    AUTH: 'http://127.0.0.1:8000',
    COURSE: 'http://127.0.0.1:8001',
    JOB: 'http://127.0.0.1:8002',    
    EVAL: 'http://127.0.0.1:8003'
}

module.exports = [{
        route: "/courses",
        target: servers.COURSE,
        auth: false
    },
    {
        route: "/courses/:id",
        target: servers.COURSE,
        auth: false
    },
    {
        route: "/courses/:courseId/:chapterId/:sectionId",
        target: servers.COURSE,
        auth: false
    },
    {
        route: "/courses/:courseId/:chapterId",
        target: servers.COURSE,
        auth: false
    },
    {
        route: "/eval/:jobid",
        target: servers.EVAL,
        auth: true
    },
    {
        route: "/jobs/:courseId",
        target: servers.JOB,
        auth: true
    },
    {
        route: "/jobs/:courseId/:chapterId/:sectionId",
        target: servers.JOB,
        auth: true
    },
    {
        route: "/jobs/:jobId/file",
        target: servers.JOB,
        auth: true
    }
]