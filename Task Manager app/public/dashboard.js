// To handle all dashboard functionalities
// const { response } = require("express");

// to make dashboard creator appear and dissapear 

let task_show_btn = document.getElementById('add_task');
let dash_creator = document.getElementById('dash-creator');
let dash_exit_btn = document.getElementById('ta-exit-btn');

task_show_btn.addEventListener('click', () => {
    dash_creator.style.display = 'block';
});

dash_exit_btn.addEventListener('click', () => {
    dash_creator.style.display = 'none';
});

// Working on ved
const vedExit = document.getElementById('ved-exit');

vedExit.addEventListener('click', () => {
    const ved = document.getElementById('ved');
    ved.style.display = 'none';
});


// Working on displaying list of tasks on dashboard

let showTasks = tasks => {
    const taskList = document.getElementById('tasks-row');

    tasks.forEach(task => {
        // taskList.textContent = task.title;
        let taskBrief = document.createElement('div');
        taskBrief.classList.add('task-brief');
        
        taskBrief.innerHTML = `
            <div class="tb-l">
                            <div class="tb-title">
                                ${task.title}
                            </div>

                            <div class="tb-duedate">
                                Due: ${new Date(task.duedate).toLocaleDateString()}
                            </div>
                        </div>

                        <div class="tb-r">
                            <button type="button" class='tb-view' data-task-id="${task._id}" id="tb-view">View</button>

                            <button type="button" data-task-id="${task._id}" id="tb-edit">Edit</button>

                            <button type="button" data-task-id="${task._id}" id="tb-delete">Delete</button>
                        </div>
        `;
        // send created class to dashboard
        taskList.appendChild(taskBrief);
    });

    // Working on my view btn... retrieve task id for further processing
    document.querySelectorAll('.tb-view').forEach(view => {
        view.addEventListener('click',(e) => {
            const taskId = e.target.getAttribute('data-task-id');
            displayTaskDetails(taskId);
        });
    });
};

const displayTaskDetails = (taskId) => {
    fetch(`task-details/${taskId}`)
    .then(response => response.json())
    .then(task => {

        const ved = document.getElementById('ved');
        ved.style.display = 'block';

        const vedShow = document.getElementById('ved-show');
        vedShow.innerHTML= `
                    <div class="v-title">
                        Task: ${task.title}
                    </div>

                    <div class="v-duedate">
                        Due-date: ${new Date(task.duedate).toLocaleDateString()}
                    </div>

                    <div class="v-priority">
                        Priority: ${task.priority ? 'Yes' : 'No'}
                    </div>

                    <div class="v-brief">
                        ${task.detail}
                    </div>

                    <div class="v-buttons">
                        <button class="v-edit" type="edit">Edit</button>
                        <button class="v-delete" type="edit">Delete</button>
                    </div>
        `;
    })
    .catch(err => console.log(err.message));
};

window.onload = () => {
    fetch('/show-tasks')
    .then(response => {
        if (response.status === 401) {
            throw new Error('Unauthorized: You need to login first');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(tasks => showTasks(tasks))
    .catch(err => {
        console.log('Error fetching tasks:', err.message);
    });
};






