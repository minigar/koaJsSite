const jwt = require("jsonwebtoken");

module.exports = data => jwt.sign(data, 'forTests');