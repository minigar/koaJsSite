const jwt = require("jsonwebtoken");
const config = require("../lib/config");

module.exports = (data, options) => jwt.sign(data, config.secret, options);