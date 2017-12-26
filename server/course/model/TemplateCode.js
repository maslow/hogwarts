const mongoose = require('mongoose')

const TemplateCodeSchema = new mongoose.Schema({
    template_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    type: {
        type: String,
        required: true,
        enum: ['file', 'dir']
    },
    parent: {
        type: String,
        required: true
    },
    data: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('TemplateCode', TemplateCodeSchema)