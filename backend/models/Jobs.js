const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JobSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
    },
    application_no : {
        type: Number,
        required: true
    },
    positions_no : {
        type: Number,
        required: true
    },
    date_of_posting: {
        type: Date,
        required: true,
        default: Date.now 
    },
    deadline : {
        type: Date,
        required: true,
    },
    required_skill : {
        type : Array,
        required: true
    },
    type : {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        require: true,
    },
    salary: {
        type: Number,
        required: true
    },
    number_of_ratings: {
        type: Number,
        default: 0
    },
    rating_sum: {
        type: Number,
        default: 0
    },
    accepted_applicants: {
        type: Array,
        default: []
    },
    pending_applicants: {
        type: Array,
        default: []
    }
});

module.exports = Job = mongoose.model('job', JobSchema);