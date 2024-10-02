const express = require('express');
const path = require('path');
const router = express.Router();
const Task = require('../models/task');
const app = express();
const bodyParser = require('body-parser');
const User = require('../models/user');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

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

router.get('/show-prior-tasks',authorizer,async(req,res) => {
    try{
        const userId = req.session.user.id;
        const priorTask = await Task.find({user: userId, priority:true})

        res.json(priorTask);
    }catch(err){
        res.status(500).send('Tasks could not be found');
        console.log(err.message)
    }
});

router.get('/show-due-tasks',authorizer,async(req,res)=> {
    try{
        const userId = req.session.user.id;
        const starter = new Date;
        starter.setHours(0,0,0,0);

        const ender = new Date;
        ender.setHours(23,59,59,999);

        const dueTasks = await Task.find({
            user:userId,
            duedate:{$gte:starter, $lte:ender}
        });

        res.json(dueTasks);
    }catch(err){
        res.status(500).send('Tasks could not be found');
        console.log(err.message)
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


router.patch('/complete-task/:taskId', authorizer, async (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId, // Pass the ID directly
            { completed: completed }, // Update object
            { new: true } // Options
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating task' });
        console.log(err.message);
    }
});

router.patch('/update-task/:itemId', authorizer, async (req, res) => {
    const { itemId } = req.params;
    const { update } = req.body;
    try {
        const result = await Task.findByIdAndUpdate(itemId,{detail:update}, {new:true});

        if(result){
            res.json({ message: 'Task successfully updated' });
        }
    } catch (err) {
        res.status(500).send('Error updating task');
        console.log(err.message);
    }
});

router.get('/delete-task/:itemId', authorizer, async (req, res) => {
    const { itemId } = req.params;

    try {
        const deleteTask = await Task.findByIdAndDelete(itemId);

        if (deleteTask) {
            res.json({ message: 'Task successfully deleted' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }

    } catch (err) {
        res.status(500).json({ message: 'Task could not be deleted' });
        console.log(err.message);
    }
});

router.get('/show-completed-tasks', authorizer, async (req, res) => {
    const userId = req.session.user.id;

    try {
        const completedTasks = await Task.find({ user: userId, completed: true });

        if (completedTasks) {
            res.json(completedTasks);
        } else {
            res.status(404).json({ success: false, message: 'No completed tasks found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error loading tasks' });
        console.log(err.message);
    }
});


router.get('/sort-due-date/:tInput',authorizer, async(req,res) => {
    const userId = req.session.user.id;
    const taskInput = req.params.tInput;

    try{
        const starter = new Date(taskInput);

        const tasks = await Task.find({
            user:userId,
            duedate:{$lte:starter}
        });

        if(tasks){
            res.json(tasks);
        }
    }catch(err){
        console.log(err.message);
        res.status(500).send('Tasks not found');
    }
});


router.get('/sort-creation-date/:tInput',authorizer, async(req,res) => {
    const userId = req.session.user.id;
    const taskInput = req.params.tInput;

    try{
        const starter = new Date(taskInput);

        const tasks = await Task.find({
            user:userId,
            createdAt:{$lte:starter}
        });

        if(tasks){
            res.json(tasks);
        }
    }catch(err){
        console.log(err.message);
        res.status(500).send('Tasks not found');
    }
});

router.get('/user-name',authorizer,async(req,res) => {
    const userId = req.session.user.id;

    try{
        const user = await User.findById(userId);

        if(user){
            res.json({
                user: user.username,
                profile:user.profilepic,
                ptype: user.profilepicType
            });
        }
    } catch(err){
        console.log(err.message);
        res.status(500).send('User not found');
    }
});


// Grace1213157

module.exports = router;