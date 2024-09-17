// User login
const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');


router.post('/user-login', async(req,res) => {
    const {email,password} = req.body;

    try{    
        const user = await User.findOne({email});//check if user exists
        if(!user){
            res.status(400).send('Invalid email or password');
        }

        // Check if password matches
        const matchPassword = await bcrypt.compare(password,user.password);

        if(!matchPassword){
            console.error(err.message);
            res.status(400).send('Invalid Password');
        }

        res.send('Login Successfull!');
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
}); 

module.exports = router;


