const mongoose = require('mongoose');

const { mongoUri } = require('./config');


module.exports = () => {
    mongoose
        //connecting to the database(mongoDB)
        .connect(mongoUri, { useNewUrlParser: true }) // return promise
        .then((() => console.log('MongoDB has been connected')))
        .catch((e) => console.log(e)) //catching all errors
}