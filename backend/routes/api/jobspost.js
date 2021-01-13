const express = require('express');
const router = express.Router();
const config = require('config');

const Job = require('../../models/Jobs')

router.post('/', (req,res) => {
    const { title, name, email, application_no, positions_no, deadline, required_skill, type, duration, salary } = req.body;
    if(!name || !title || !email || !application_no || !positions_no || !deadline || !required_skill || !type || !duration || !salary ){
        return res.status(400).json({ msg: 'Please enter all feilds' });
    }

    const newJob = new Job({
        title, name, email, application_no, positions_no, deadline, required_skill, type, duration, salary
    })
    newJob.save()
        .then( jobData => {
            res.json(jobData)
        })
        .catch(err => res.status(404).json(`${err}`));
})
module.exports = router;