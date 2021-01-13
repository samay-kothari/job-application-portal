const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicantProfile = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
    },
    education: {
        type: Array,
        required: true,
    },
    skills: {
        type: Array,
        required: true
    },
    rating:{
        type: Number,
        default: 0
    },
    total_ratings: {
        type: Number,
        default: 0
    }
});

module.exports = User = mongoose.model('applicantProfile', ApplicantProfile);