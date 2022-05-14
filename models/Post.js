const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    body: {
        type: String,
        required: true
    },

    user: {
        type: Schema.ObjectId,
        ref: 'users',
        required: true
    },
    
    likes: [
        {
            user: {
                type: Schema.ObjectId,
                ref: 'users',
                required: true
            },
        
            createdDate: {
                type: Date,
                default: Date.now
            }
        }
    ],

    comments: [
        {
            body: {
                type: String,
                required: true
            },

            user: {
                type: Schema.ObjectId,
                ref: 'users',
                required: true
            },

            createdDate: {
                type: Date,
                default: Date.now
            }
        }
    ],

    createdDate: {
        type: Date,
        default: Date.now
    }
})

const populationFields = 'user comments.user'

postSchema.post('find', async function (docs, next) {
    for (let doc of docs) {
        if (doc.isPublic) {
            await doc.populate(populationFields)
        }
    }
})

postSchema.post('save', function(doc, next) {
    doc.populate(populationFields).then(function() {
        next();
    });
});

function populateFields() {
    this.populate(populationFields)
}

postSchema.pre('find', populateFields);
postSchema.pre('findOne', populateFields);
postSchema.pre('findOneAndUpdate', populateFields);

module.exports = mongoose.model('posts', postSchema)