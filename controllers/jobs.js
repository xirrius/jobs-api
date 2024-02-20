const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require("../errors")

const getAllJobs = async(req, res) => {
    const jobs = await Job.find({createdBy: req.user.userid}).sort('updatedAt');
    res.status(StatusCodes.OK).json({jobs: jobs, count: jobs.length});
}

const getJob = async(req, res) => {
    const {user: {userid}, params: {id: jobId}} = req
    const job = await Job.findOne({createdBy: userid, _id: jobId})
    if(!job) {
        throw new NotFoundError(`No job found for id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job)
}

const createJob = async(req, res) => { 
    req.body.createdBy = req.user.userid;
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async(req, res) => {
    const {user: {userid}, params: {id: jobId}} = req
    const {company, position} = req.body;
    if(company === '' || position === '') {
        throw new BadRequestError(`Company and position cannot be empty`)
    }
    const job = await Job.findOneAndUpdate({createdBy: userid, _id: jobId}, req.body, {
        new:true,
        useFindAndModify: false,
        runValidators: true
    })
    if(!job) {
        throw new NotFoundError(`Job with id ${jobId} not found`)
    }
    res.status(StatusCodes.OK).json(job)
}

const deleteJob = async(req, res) => {
    const {user: {userid}, params: {id: jobId}} = req
    const job = await Job.findOneAndDelete({createdBy: userid, _id: jobId}, {
        useFindAndModify: false
    })
    if(!job) {
        throw new NotFoundError(`Job with id ${jobId} not found`)
    }
    res.status(StatusCodes.OK).send(`Job deleted.`)
}

module.exports = {
    getAllJobs, 
    getJob,
    createJob,
    updateJob,
    deleteJob
}