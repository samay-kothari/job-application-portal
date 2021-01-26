const express = require('express');
const router = express.Router();

const Jobs = require('../../models/Jobs');
const JobApp = require('../../models/jobApplication')

router.get('/getJobs', (req, res) => {
    Jobs.find()
        .then( jobs => {
            if(!jobs) return res.status(400).json({ msg: 'No user from this Email ID' })
            res.json({ jobs })
        })
})

router.post('/postApplication', (req, res) => {
    const { job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status } = req.body
    console.log(`${req.body.sop}`)
    const newApplication = new JobApp ({ job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status })
    newApplication.save()
        .then( applicationData => {
            console.log(`${applicationData}`)
            res.json({applicationData})
        })
        .catch( err => {
            res.status(404).json(`${err}`)
        } )
})

router.post('/getApplicantApplications', (req, res) => {
    console.log(`lollmaolol`)
    const { email } = req.body
    const condition = {
        applicant_email : email
    }
    JobApp.find(condition)
        .then( applications => {
            res.json({applications})
        }
    )
})

router.post('/updateJobData', (req, res) => {
    console.log(req.body.together)
    const { _id, update } = req.body.together;
    const filter = { _id: _id }
    Jobs.findByIdAndUpdate(filter, update)
        .then(
            updatedJob => {
                if(!updatedJob) return res.status(400).json({ msg:'Can not update the job' })
                res.json({updatedJob})
            }
        )
})
module.exports = router;