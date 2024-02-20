const {UnauthenticatedError} = require('../errors')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticationMiddleware = async (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if(!authHeaders || !authHeaders.startsWith('Bearer ')) {
        throw new UnauthenticatedError(`No token provided`)
    }
    try {
        const token = authHeaders.split(' ')[1];
        const payload = jwt.verify(token, process.env.SECRET)
        console.log(payload);
        req.user = {userid: payload.userID, name: payload.name};
        next();
    } catch (error) {
        throw new UnauthenticatedError(`Invalid authentication.`)
    }
}

module.exports = authenticationMiddleware