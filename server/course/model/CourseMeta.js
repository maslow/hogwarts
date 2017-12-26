const mongoose = require('mongoose')

const CourseMetaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 64
    },
    desc: {
        type: String,
        required: true,
        minlength :1,
        maxlength :255
    },
    tags: {
        type:[String]
    },
    status: {
        type: String,
        enum: ['unpublished', 'published'],
        default: 'unpublished'
    },
    created_by: Number
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('CourseMeta', CourseMetaSchema)