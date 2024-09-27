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


router.patch('/complete-task/:taskId/:isCompleted', authorizer, async (req, res) => {
    const { taskId } = req.params;
    const { isCompleted } = req.params;
    // const complete = isCompleted == true;

    console.log(isCompleted);
    try {
        const updatedTask = await Task.findByIdAndUpdate({_id:taskId}, {completed: isCompleted},{ new: true }
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


// router.post('/update-task/:itemId', authorizer, async (req, res) => {
//     const { itemId } = req.params;

//     console.log(req);
//     // try {

//     //     const result = await Task.updateOne({ _id: itemId }, { $set: { detail: detail } });

//     //     if (result.matchedCount === 0) {
//     //         return res.status(404).json({ message: 'Task not found' });
//     //     }
//     //     if (result.modifiedCount === 0) {
//     //         return res.status(400).json({ message: 'No changes made to the task' });
//     //     }
        
//     //     res.json({ message: 'Task successfully updated' });
//     // } catch (err) {
//     //     res.status(500).send('Error updating task');
//     //     console.log(err.message);
//     // }

// });



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

// Grace1213157

module.exports = router;