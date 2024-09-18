const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.post('/user-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // check if user exists

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // Check if password matches
        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(400).send('Invalid password');
        }

        // Setting session data for logged-in user
        req.session.user = {
            id: user._id,
            email: user.email,
        };

        // Redirect to dashboard after login 
        res.redirect('/dashboard');

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
