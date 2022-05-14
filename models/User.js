const mongoose = require('mongoose')
const privatePaths = require('mongoose-private-paths')
const Post = require('./Post')


const Schema = mongoose.Schema

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        private: true
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
})

userSchema.plugin(privatePaths)

module.exports = mongoose.model('users', userSchema)