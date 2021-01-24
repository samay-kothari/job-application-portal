const express = require('express');
const router = express.Router();

const JobApp = require('../../models/jobApplication')
const ApplicantProfile = require('../../models/applicantProfile');

router.post('/getJobApplications', (req, res) => {
    const { _id } = req.body;
    const  condition = {
        job_id: _id
    }
    JobApp.find(condition)
        .then(
            applications => {
                res.json({applications})
            }
        )
})


router.get('/getUsers', (req, res) => {
    ApplicantProfile.find()
        .then(
            profiles => {
                res.json({profiles})
            }
        )
})


module.exports = router
