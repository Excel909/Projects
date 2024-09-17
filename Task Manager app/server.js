const express = require('express');
const connectDB = require('./db.js'); 
const path = require('path');
const signup = require('./routes/sign-up');//For signup page
const log_in = require('./routes/login.js');
const bodyParser = require('body-parser');

connectDB();
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

// First route the sign up page
const signup_path = path.join(__dirname,'views','sign-up.html');
const public_path = path.join(__dirname,'public');

app.use(express.static(public_path));

app.get('/',(req,res) => {
    res.sendFile(signup_path);
});

// For sign up page
app.use('/', signup);

app.get('/sign-up',(req,res) => {
    const signup_page = path.join(__dirname,'views','sign-up.html');
    res.sendFile(signup_page);
});

// sign up success
app.get('/sign-up-success',(req,res) => {
    const success_page = path.join(__dirname,'views','sign-up-success.html');
    res.sendFile(success_page);
});

// For login page
app.get('/login',(req,res) => {
    const pathway = path.join(__dirname,'views','login.html');
    res.sendFile(pathway);
});

app.use('/',log_in);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})