const express = require('express');
const connectDB = require('./db.js');
const path = require('path');
const signup = require('./routes/sign-up');

connectDB();
const app = express();

// First route the sign up page
const signup_path = path.join(__dirname,'views','sign-up.html');
const public_path = path.join(__dirname,'public');

app.use(express.static(public_path));

app.get('/',(req,res) => {
    res.sendFile(signup_path);
});

// For sign up page
app.use('/', signup);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})