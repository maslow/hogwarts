const mongoose = require('mongoose')

const JobCodeSchema = new mongoose.Schema({
    job_id :{
        type : mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 64
    },
    type: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        required: true
    },
    data: {
        type: String,
        maxlength: 1024 * 32,
        default:''
    },
    status: {
        type: String,
        enum: ['normal', 'deleted'],
        default: 'normal',
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}) 

module.exports = mongoose.model('JobCode', JobCodeSchema)