const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JobApplication = new Schema({
    
    job_id : {
        type: String,
        required: true
    },
    job_title : {
        type: String,
        required: true
    },
    applicant_name : {
        type: String,
        required: true
    },
    applicant_email : {
        type: String,
        required: true,
    },
    recruiter_name : {
        type: String,
        required: true
    },
    recruiter_email : {
        type: String,
        required: true
    },
    date_of_posting: {
        type: Date,
        required: true,
        default: Date.now 
    },
    sop: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    applicant_rating: {
        type: Number,
        required: true,
        default: 0
    },
    recuiter_rating: {
        type: Number,
        required: true,
        default: 0
    }

});

module.exports = JobApp = mongoose.model('jobApplication', JobApplication);