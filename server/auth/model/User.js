const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 64
    },
    password_hash: {
        type: String,
        required: true,
        minlength :1,
        maxlength :64
    },
    roles: {
        type:[{
            type: String,
            enum: ['admin', 'author', 'user']
        }],
        default: ['user']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = mongoose.model('User', UserSchema)