const mongoose = require('mongoose');

const config = require('./config');


module.exports = () => {
    mongoose
        //connecting to the database(mongoDB)
        .connect(config.mongoUri, { useNewUrlParser: true }) // return promise
        .then((() => console.log('MongoDB has been connected')))
        .catch((e) => console.log(e)) //cathing all errors
}