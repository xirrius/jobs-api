
require('dotenv').config()
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, `Please provide a name`],
        minlength:3,
        maxlength:30
    },
    email: {
        type:String,
        required:[true, `Please provide an email address`],
        minlength:5,
        maxlength:50,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique:true
    },
    password: {
        type:String,
        required:[true, `Please provide a password`],
        minlength:3,
      
    },
})

//Hashing the pasword before moving onto the next middleware function
userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createJWT = function() {
    return jwt.sign({userID: this._id, name: this.name}, process.env.SECRET, {expiresIn:process.env.LIFETIME})
}

userSchema.methods.matchPassword = async function(candidatePassword) {
    const ismatch = await bcrypt.compare(candidatePassword, this.password)
    return ismatch;
}

module.exports = mongoose.model('User', userSchema)