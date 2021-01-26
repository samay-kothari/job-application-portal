const express = require('express');
const router = express.Router();

const JobApp = require('../../models/jobApplication')
const ApplicantProfile = require('../../models/applicantProfile');
const Job = require('../../models/Jobs')

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

router.post('/updateApplicationStatus', (req, res) => {
    const { _id, update } = req.body.together
    const filter = { _id: _id }
    JobApp.findByIdAndUpdate(filter, update)
        .then(
            data => {
                if(!data) return res.status(400).json({ msg:'Can not update the application' })
                res.json({data})
            }
        )
})

router.post('/removePendingApplicant', (req, res) => {
    const { _id, update } = req.body.together
    const filter = { _id: _id }
    Job.findByIdAndUpdate(filter, update)
        .then(
            data => {
                if(!data) return res.status(400).json({ msg:'Can not update the application' })
                res.json({data})
            }
        )
})

router.post('/rejectApplicationsofApplicant', (req, res) => {
    const { applicant_email, update } = req.body.together
    const filter = { applicant_email: applicant_email }
    JobApp.find(filter, update)
        .then(
            data => {
                if(!data) return res.status(400).json({ msg:'Can not update the application' })
                res.json({data})
            }
        )
})

router.post('/getApplicantJob', (req, res) => {
    const { _id } = req.body.update
    const filter = { _id: _id }
    Job.findById( filter )
        .then(
            jobdata => {
                res.json({jobdata})
            }
        )
})

router.post('/getRecruiterApplications', (req, res) => {
    const { recruiter_email } = req.body
    console.log(recruiter_email)
    const filter = { recruiter_email: recruiter_email }
    JobApp.find(filter)
        .then(
            data => {
                if(!data) return res.status(400).json({ msg:'Can get Applications for this recruiter' })
                res.json({data})
            }
        )
})

module.exports = router
