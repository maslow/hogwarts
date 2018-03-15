const auth_server = process.env['SERVER_AUTH']
const course_server = process.env['SERVER_COURSE']
const job_server = process.env['SERVER_JOB']

if (!auth_server || !course_server || !job_server)
    throw new Error('one or more of environment variables missing : `SERVER_AUTH` `SERVER_COURSE` `SERVER_JOB`')

const servers = {
    AUTH: `http://${auth_server}`,
    COURSE: `http://${course_server}`,
    JOB: `http://${job_server}`
}

const roles = {
    author: 'author',
    user: 'user',
    guest: 'guest'
}

const LOGINED_ROLES = [roles.user, roles.author]
const ALL_ROLES = LOGINED_ROLES.concat(roles.guest)

const services = {
    "/captcha":{
        target: servers.AUTH,
        access: ALL_ROLES
    },
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
    "/getCourse": {
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
        access: ALL_ROLES
    },
    "/getOwnCourses": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/getOwnCourse": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/createCourse": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/updateCourse": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/publishCourse": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/unpublishCourse": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/deleteCourse": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/createChapter": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/updateChapter": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/deleteChapter": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/createSection": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/updateSection": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/publishSection": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/unpublishSection": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/deleteSection": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/createSectionCodeFolder": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/updateSectionCodeFileContent": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/deleteSectionCodeFile": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/updateSectionTests": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/getSectionTests": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/updateSectionDocument": {
        target: servers.COURSE,
        access: [roles.author]
    },
    "/getSectionDocument": {
        target: servers.COURSE,
        access: [roles.author]
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