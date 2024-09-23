const express = require('express');
const path = require('path');
const router = express.Router();
const Task = require('../models/task');


const authorizer = (req,res,next) => {
    if(!req.session.user){
        return res.status(401).send('You need to login first');
    };
    next();
};

router.post('/create-task',authorizer, async(req,res) => {
    const {title,duedate,detail,priority} = req.body;

    try{
        const userId = req.session.user.id;

        // Because of err i have to convert priority value to boolean

        const edit_prime = priority === 'on';

        const task = new Task({
            user:userId,
            title,
            duedate,
            detail,
            priority:edit_prime
        });

        await task.save();
        res.redirect('/dashboard');

    } catch(err) {  
        console.log(err.message);
        res.status(500).send('Error creating task');
    }
});

router.get('/show-tasks', authorizer, async(req,res) =>{
    try{
        const userId = req.session.user.id;

        const tasks = await Task.find({user: userId});
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Tasks could not be retrieved');
        console.log(err.message);
    }
});

router.get('/task-details/:taskId', authorizer, async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.json(task);
    } catch (err) {
        res.status(500).send('Error retrieving task details');
        console.log(err.message);
    }
});

router.post('/update-task/:itemId', authorizer, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { detail } = req.body;

        // Checking if detail exists to prevent validation errors
        if (!detail) {
            return res.status(400).send('Task detail is required');
        }

        const updatedTask = await Task.findByIdAndUpdate(itemId, { detail }, { new: true });

        if (updatedTask) {
            res.json(updatedTask);
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        res.status(500).send('Error updating task');
        console.log(err.message);
    }
});


module.exports = router;