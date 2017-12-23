const auth_server = process.env['SERVER_AUTH']
const course_server = process.env['SERVER_COURSE']
const job_server = process.env['SERVER_JOB']

if(!auth_server || !course_server || !job_server)
    throw new Error('one or more of environment variables missing : `SERVER_AUTH` `SERVER_COURSE` `SERVER_JOB`')

const servers = {
    AUTH: `http://${auth_server}`,
    COURSE: `http://${course_server}`,
    JOB: `http://${job_server}`
}

const services = [
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
            "/publishSection",            

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
            "/deleteJobFile",
            "/evalUserJobByJobId"
        ],
        target: servers.JOB,
        auth: true
    }
]
module.exports = {
    servers,
    services
}