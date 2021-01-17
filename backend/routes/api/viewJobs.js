const express = require('express');
const router = express.Router();

const Jobs = require('../../models/Jobs');


router.post('/getJobs', (req, res) => {
    const { email } = req.body;
    console.log(`${email}`)
    Jobs.find({ email })
        .then( jobs => {
            if(!jobs) return res.status(400).json({ msg: 'No user from this Email ID' })
            res.json({ jobs })
        })
})

// router.post('/', (req, res) => {
//     const { name, email, contact_number, bio } = req.body;
//     console.log(`${name}`)
//     // if(!name || !email || !contact_number || !bio){
//     //     return res.status(400).json({ msg: 'Please enter all feilds' });
//     // }
//     const newRecruiter = new RecruiterProfile({
//         name, email, contact_number, bio
//     })
//     newRecruiter.save()
//         .then( recruiterData => {
//             res.json(recruiterData)
//         })
//         .catch(err => res.status(404).json(`${err}`));
// })

// router.post('/update', (req, res) => {
//     const {_id} = req.body;
//     console.log(`${_id}`)
//     const { name, email, contact_number, bio } = req.body;

//     const newRecruiter = new RecruiterProfile({
//         name, email, contact_number, bio
//     })

//     RecruiterProfile.findById(_id)
//         .then(item => 
//             {item.remove()
//                 .then(() => {
//                 res.json({success: true}),
//                 newRecruiter.save()
//                     .then( recruiterData => {
//                         res.json(recruiterData)
//                     })
//                     .catch(err => res.status(404).json(`${err}`))
//                 }
//             )
//             .catch(err => res.status(500).json({success: false}))}
//             )
//         .catch(err => res.status(404).json({success: false}));


//     // ApplicantProfile.findByIdAndUpdate(_id, applicantProfile, function(err, applicantProfile){
//     //     if(err){
//     //         console.log("err", err);
//     //         res.status(500).send(err)
//     //     } else{
//     //         console.log("success"),
//     //         res.send(applicantProfile);
//     //     }
//     // })
// })

module.exports = router;