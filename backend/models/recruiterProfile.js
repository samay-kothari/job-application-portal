const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruiterProfile = new Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
    },
    bio: {
        type: String,
    },
});

module.exports = User = mongoose.model('recruiterProfile', RecruiterProfile);