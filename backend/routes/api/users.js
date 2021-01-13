const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

router.post('/', (req,res) => {
    const { name, email, role, password } = req.body;
    if(!name || !email || !password || !role){
        return res.status(400).json({ msg: 'Please enter all feilds' });
    }
    User.findOne({ email: email })
        .then( user => {
            if(user) return res.status(400).json({ msg: 'User already exists' })

            const newUser = new User({
                name,
                email,
                role,
                password
            })

            // Create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                (err, token) => {
                                    if(err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            role: user.role,
                                            email: user.email
                                        }
                                    })
                                }
                            )
                        })
                })
            })
        })
});

module.exports = router;