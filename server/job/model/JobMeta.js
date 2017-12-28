const mongoose = require('mongoose')
const request = require('superagent')
const debug = require('debug')

const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

const SERVER_COURSE = process.env['SERVER_COURSE']
const SERVER_EVAL = process.env['SERVER_EVAL']

const JobMetaSchema = new mongoose.Schema({
    section_id :{
        type : mongoose.Schema.Types.ObjectId,
        required: true
    },
    status : {
        type:String,
        enum:['created', 'failed', 'sucess'],
        default:'created'
    },
    try_times : {
        type : Number,
        default:0
    },
    created_by :Number
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

/**
 * Get template
 * @static
 */
JobMetaSchema.statics.getTemplate = async function(template_id){
    try {
        const res = await request
            .get(`http://${SERVER_COURSE}/getTemplate`)
            .type('json')
            .query({ template_id })

        return res.body 
    } catch (error) {
        _log("Retrieve template (template_id: %s) from course (request by job service) caught an error: %o", template_id, error)
        return null
    }
}

/**
 * Eval job
 * @static
 */
JobMetaSchema.statics.eval = async function(job_id, data){
    try {
        const res = await request
            .post(`http://${SERVER_EVAL}/eval`)
            .send(data)
            .type('json')

        return res.body 
    } catch (error) {
        _log("Eval job (job_id: %s) caught an error: %o", job_id, error)
        return null
    }
}

/**
 * Get section
 */
JobMetaSchema.methods.getSection = async function(){
    try {
        const res = await request
            .get(`http://${SERVER_COURSE}/getSectionDetail`)
            .type('json')
            .query({ id: `${this.section_id}` })

        return res.body 
    } catch (error) {
        _log("Retrieve section (section_id: %s) from course (request by job service) caught an error: %o", this.section_id, error)
        return null
    }
}

/**
 * Get section code list in a specified path from Course Service
 */
JobMetaSchema.methods.getSectionCodes = async function(path){
    try {
        const res = await request
            .get(`http://${SERVER_COURSE}/getSectionCodeFiles`)
            .type('json')
            .query({ sid: `${this.section_id}`, path })

        return res.body 
    } catch (error) {
        _log("Retrieve section codes (section_id: %s) from course (request by job service) caught an error: %o", this.section_id, error)
        return null
    }
}

/**
 * Get a section code file from Course Service
 */
JobMetaSchema.methods.getSectionCodeFile = async function(path){
    try {
        const res = await request
            .get(`http://${SERVER_COURSE}/getSectionCodeFileContent`)
            .type('json')
            .query({ sid: `${this.section_id}`, path })

        return res.body
    } catch (error) {
        _log("Retrieve section codes (section_id: %s) from course (request by job service) caught an error: %o", this.section_id, error)
        return null
    }
}

/**
 * Get Section codes without template codes
 */
JobMetaSchema.methods.getSectionCodesWithoutTemplate = async function(){
    try {
        const res = await request
            .get(`http://${SERVER_COURSE}/get-section-codes-without-template`)
            .type('json')
            .query({ section_id: `${this.section_id}` })

        return res.body
    } catch (error) {
        _log("Retrieve section codes(without template) (section_id: %s) from course (request by job service) caught an error: %o", this.section_id, error)
        return null
    }
}

module.exports = mongoose.model('JobMeta', JobMetaSchema)