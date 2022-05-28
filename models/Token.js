const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    }
})

module.exports = model('Token', TokenSchema);