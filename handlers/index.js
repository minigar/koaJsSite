const bodyParser = require('./body-parser');
const errors = require("./errors");
const passportInit = require('./passport -init');
const catchMongooseErrors = require('./catch-mongoose-errors');

module.exports = [
    bodyParser,
    errors,
    passportInit,
    catchMongooseErrors
]