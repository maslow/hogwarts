const mongoose = require('mongoose')

const CourseChapterSchema = new mongoose.Schema({
    course_id: mongoose.Schema.Types.ObjectId,
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
    sequence: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
    }
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('CourseChapter', CourseChapterSchema)