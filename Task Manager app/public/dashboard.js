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

        const t_Id = task._id;
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

                    <div class="v-bri">
                        <textarea class='v-brief'>${task.detail}</textarea>
                    </div>

                    <div class="v-buttons">
                        <button class="v-edit" type="button">Edit</button>
                        <button class="v-update" type="button" data-task-id=${task._id}>Update</button>
                        <button class="v-delete" type="button" data-task-id=${task._id}>Delete</button>
                    </div>
        `;
        
        const editBtn = document.querySelector('.v-edit');
        const updateBtn = document.querySelector('.v-update');
        const delBtn = document.querySelector('.v-delete');

        editBtn.addEventListener('click', () => {
            editTask();
        });

        updateBtn.addEventListener('click', () => { 
            const updateText = document.querySelector('.v-brief').value;
            const itemId = document.querySelector('.v-update').getAttribute('data-task-id');

            updateTask(itemId,updateText);
        });


        delBtn.addEventListener('click', () => {
            const itemId = document.querySelector('.v-delete').getAttribute('data-task-id');

            deleteTask(itemId);
        });
    })
    .catch(err => console.log(err.message));
};
// Ved btns function

const editTask = () => {
    const briefDiv = document.querySelector('.v-brief');
    briefDiv.focus();
}

const deleteTask = (itemId) => {
    fetch(`/delete-task/${itemId}`, {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to delete task');
        }
    })
    .then(data => {
        window.location.reload();
    })
    .catch(err => alert(err.message));
};


// const updateTask = async (itemId, updateText) => {
//     // console.log(updateText);
//     await fetch(`update-task/${itemId}`,{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json'
//         },
//         body:JSON.stringify({detail:updateText})
//     })
//     .then(response => response.json())
//     .then(response => {
//         console.log(response);
//         if(response.ok){
//             alert(response.message)
//         } 
//     })
//     .catch(err => alert(err.message));
// };


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






