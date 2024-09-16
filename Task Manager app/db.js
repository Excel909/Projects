const mongoose = require('mongoose');

const mongo_url = 'mongodb://localhost:27017/Task_Manager';

const connectDB = () => {
    mongoose.connect(mongo_url);
    mongoose.connection.on('connected', () => {
        console.log('App connected to Database successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.log('Connection Error:', err);
    });
}

module.exports = connectDB;
