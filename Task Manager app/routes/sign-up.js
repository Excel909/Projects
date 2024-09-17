// Handles routes requests from signup
const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs'); //For hashing my password


// Handling my form submission
router.post('/submit', async (req,res) => {
    const {username,email,password} = req.body;

    try {    
        let user = await User.findOne({email});
        if(user){
            return res.status(400).send('User is Already Registered');
        }

        const cryptedpassword = await bcrypt.hash(password,10);

        user = new User({
            username,
            email,
            password:cryptedpassword
        });

        // save the user in the database
        await user.save();  

        // respond
        res.redirect('/sign-up-success');
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

