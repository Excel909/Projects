// Creating a Schema for my tasks in dashboard
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    
    title: {
        type:String,
        required:true
    },

    duedate: { 
        type: Date, 
        required: true 
    },
    detail: { 
        type: String, 
        required: true 
    },
    priority: { 
        type: Boolean, 
        default: false 
    },
    completed:{
        type:Boolean,
        default:false
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
});

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;