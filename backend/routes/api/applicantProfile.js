const express = require('express');
const router = express.Router();

const ApplicantProfile = require('../../models/applicantProfile');


router.post('/getData', (req, res) => {
    const { email } = req.body;
    ApplicantProfile.findOne({ email })
        .then( applicantProfile => {
            if(!applicantProfile) return res.status(400).json({ msg: 'No user from this Email ID' })
            res.json({ applicantProfile })
        })
})

router.post('/', (req, res) => {
    const { name, email, education, skills } = req.body;
    if(!name || !email || !education || !skills){
        return res.status(400).json({ msg: 'Please enter all feilds' });
    }
    const newApplicant = new ApplicantProfile({
        name, email, education, skills
    })
    newApplicant.save()
        .then( applicantData => {
            res.json(applicantData)
        })
        .catch(err => res.status(404).json(`${err}`));
})

router.post('/update', (req, res) => {
    var _id = req.body._id;
    const { name, email, education, skills } = req.body;
    console.log(`${name}`)

    const newApplicant = new ApplicantProfile({
        name, email, education, skills
    })

    ApplicantProfile.findById(_id)
        .then(item => item.remove()
            .then(() => 
                res.json({success: true}),
                newApplicant.save()
                    .then( applicantData => {
                        res.json(applicantData)
                    })
                    .catch(err => res.status(404).json(`${err}`))
            )
            .catch(err => res.status(500).json({success: fail})))
        .catch(err => res.status(404).json({success: false}));


    // ApplicantProfile.findByIdAndUpdate(_id, applicantProfile, function(err, applicantProfile){
    //     if(err){
    //         console.log("err", err);
    //         res.status(500).send(err)
    //     } else{
    //         console.log("success"),
    //         res.send(applicantProfile);
    //     }
    // })
})

module.exports = router;