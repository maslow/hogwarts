const mongoose = require('mongoose')

const TemplateMetaSchema = new mongoose.Schema({
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
    tags: {
        type: [String]
    },
    docker_image: {
        type: String,
        maxlength: 64
    },
    Dockerfile: {
        type: String,
        maxlength: 1024 * 4
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('TemplateMeta', TemplateMetaSchema)