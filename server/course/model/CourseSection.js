const mongoose = require('mongoose')

const CourseSectionSchema = new mongoose.Schema({
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    chapter_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    template_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 64
    },
    desc: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    status: {
        type: String,
        enum: ['unpublished', 'published', 'locked'],
        default: 'unpublished'
    },
    testcase: {
        type: String,
    },
    document: {
        type: String
    },
    sequence: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
    },
    dependencies: [mongoose.Schema.Types.ObjectId]
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('CourseSection', CourseSectionSchema)