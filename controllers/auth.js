const User = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const {StatusCodes} = require('http-status-codes')

const register = async(req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({name: user.name, token})
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new BadRequestError(`Please provide email and password.`)
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError(`Invalid credentials.`)
    }
    const isPasswordCorrect = await user.matchPassword(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError(`Invalid credentials.`)
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({name: user.name, token})
} 

module.exports = {register, login}


