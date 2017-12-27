const mongoose = require('mongoose')
const request = require('superagent')
const debug = require('debug')

const _log = debug('JOB:PROD')
const _debug = debug('JOB:DEV')

const SERVER_COURSE = process.env['SERVER_COURSE']
const courseAddr = `http://${SERVER_COURSE}`

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
 * Get section code list in a specified path from Course Service
 */
JobMetaSchema.methods.getSectionCodes = async function(path){
    try {
        const res = await request
            .get(`${courseAddr}/getSectionCodeFiles`)
            .type('json')
            .query({ sid: `${this.section_id}`, path })

        return res.body 

    } catch (error) {
        _log("Retrieve section codes (section_id: %s) from course (request by job service) caught an error: %o", this.section_id, error)
    }
}

/**
 * Get a section code file from Course Service
 */
JobMetaSchema.methods.getSectionCodeFile = async function(path){
    try {
        const res = await request
            .get(`${courseAddr}/getSectionCodeFileContent`)
            .type('json')
            .query({ sid: `${this.section_id}`, path })

        // according the return value from API getSectionCodeFileContent
        return res.status === 200 ? res.body : undefined

    } catch (error) {
        _log("Retrieve section codes (section_id: %s) from course (request by job service) caught an error: %o", this.section_id, error)
    }
}


module.exports = mongoose.model('JobMeta', JobMetaSchema)