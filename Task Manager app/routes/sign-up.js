// Handles routes requests from signup
const express = require('express');
const path = require('path');
const router = express.Router();


router.post('/submit',(req,res) => {
    res.send('hello');
});

module.exports = router;

