// Handles routes requests from signup
const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs'); //For hashing my password
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage:storage});

// Handling my form submission
router.post('/submit',upload.single('profilepic'), async (req,res) => {
    const {username,email,password} = req.body;
    let profilepic = '';
    let profilepicType = '';

    if(req.file){
        profilepic = req.file.buffer.toString('base64');
        profilepicType = req.file.mimetype;
    }

    try {    
        let user = await User.findOne({email});
        if(user){
            return res.status(400).send('User is Already Registered');
        }

        const cryptedpassword = await bcrypt.hash(password,10);

        user = new User({
            username,
            email,
            password:cryptedpassword,
            profilepic,
            profilepicType
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

