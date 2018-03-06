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

const roles = {
    admin: 'admin',
    author: 'author',
    user: 'user',
    guest: 'guest'
}

const LOGINED_ROLES = [roles.user, roles.author, roles.admin]
const ALL_ROLES = LOGINED_ROLES.concat(roles.guest)

const services = {
    "/login": {
        target: servers.AUTH,
        access: [roles.guest]
    },
    "/createUser": {
        target: servers.AUTH,
        access: [roles.guest]
    },
    "/validateToken": {
        target: servers.AUTH,
        access: ALL_ROLES
    },
    "/getUserById": {
        target: servers.AUTH,
        access: LOGINED_ROLES
    },
    "/getUserCourses": {
        target: servers.COURSE,
        access: ALL_ROLES
    },
    "/getPublishedCourses": {
        target: servers.COURSE,
        access: ALL_ROLES
    },
    "/getCourseDetail": {
        target: servers.COURSE,
        access: ALL_ROLES
    },
    "/getSectionDetail": {
        target: servers.COURSE,
        access: ALL_ROLES
    },
    "/getSectionCodeFiles": {
        target: servers.COURSE,
        access: ALL_ROLES
    },
    "/getSectionCodeFileContent": {
        target: servers.COURSE,
        access: ALL_ROLES
    },
    "/getTemplates": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/createCourse": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/updateCourse": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/publishCourse": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/createChapter": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/updateChapter": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/deleteChapter": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/createSection": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/updateSection": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/publishSection": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/createSectionCodeFolder": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/updateSectionCodeFileContent": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/deleteSectionCodeFile": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/updateSectionTests": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/getSectionTests": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/updateSectionDocument": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/getSectionDocument": {
        target: servers.COURSE,
        access: [roles.author, roles.admin]
    },
    "/getUserJobBySectionId": {
        target: servers.JOB,
        access: LOGINED_ROLES
    },
    "/getJobCodeFiles": {
        target: servers.JOB,
        access: LOGINED_ROLES
    },
    "/getJobFileContent": {
        target: servers.JOB,
        access: LOGINED_ROLES
    },
    "/updateJobFileContent": {
        target: servers.JOB,
        access: LOGINED_ROLES
    },
    "/createJobFolder": {
        target: servers.JOB,
        access: LOGINED_ROLES
    },
    "/deleteJobFile": {
        target: servers.JOB,
        access: LOGINED_ROLES
    },
    "/evalUserJobByJobId": {
        target: servers.JOB,
        access: LOGINED_ROLES
    }
}

module.exports = {
    services,
    roles
}