// Creating a User Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        minlength:4,
        maxlength:20,
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilepic:{
        type:String
    },
    profilepicType:{
        type:String
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;