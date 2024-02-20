const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, `Please provide a company`],
        maxLength: 50,
    }, 
    position: {
        type: String,
        required: [true, `Please provide a position`],
        maxLength: 100,
    }, 
    status: {
        type: String, 
        enum: [`Interview`, `Declined`, `Pending`],
        default: `Pending`,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, `Please provide user`],
    }, 

},{timestamps:true}
)

module.exports = mongoose.model('Job', jobSchema);