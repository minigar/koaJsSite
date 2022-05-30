const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { secret, tokens } = require('../lib/config').jwt;
const mongoose = require('mongoose');

const Token = require('../models/Token');

const generateAccessToken = (userId) => {
    const payload = {
        userId,
        type: tokens.access.type,
    };

    const options = { expiresIn: tokens.access.expiresIn };

    return jwt.sign(payload, secret, options)
};


const generateRefreshToken = () => {
    const payload = {
        id: uuidv4(),
        type: tokens.refresh.type
    };

    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        id: payload.id,
        token: jwt.sign(payload, secret, options)
    }
};


const replaceRefreshTokenInDb = async (_id, userId) => {
    Token.findOneAndRemove({ userId })
    .exec()
    .then(() => Token.create({ _id, userId }));
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceRefreshTokenInDb
}