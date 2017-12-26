const mongoose = require('mongoose')

const CourseCodeSchema = new mongoose.Schema({
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        maxlength: 1024 * 32
    },
    status: {
        type: Number,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('CourseCode', CourseCodeSchema)