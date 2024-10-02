const axios = require('axios');

let task_show_btn = document.getElementById('add_task');
let dash_creator = document.getElementById('dash-creator');
let dash_exit_btn = document.getElementById('ta-exit-btn');

task_show_btn.addEventListener('click', () => {
    dash_creator.style.display = 'block';
});

dash_exit_btn.addEventListener('click', () => {
    dash_creator.style.display = 'none';
});

document.querySelector('.t-title').addEventListener('input', () => {
    let t_value = document.querySelector('.t-title');
    t_value.value = t_value.value.replace(/[^a-zA-z\s]/g,'');
})

// Working on ved
const vedExit = document.getElementById('ved-exit');

vedExit.addEventListener('click', () => {
    const ved = document.getElementById('ved')
    ved.style.display = 'none';
});


// Working on displaying list of tasks on dashboard

let showTasks = tasks => {
    const taskList = document.getElementById('tasks-row');
    taskList.innerHTML = '';

    if(tasks < 1){
        taskList.innerHTML = '<h1 style="padding:30px; color:lightgrey; font-family:candara;">No Tasks</h1>';
    };
    tasks.forEach(task => {
        // taskList.textContent = task.title;
        let taskBrief = document.createElement('div');
        taskBrief.classList.add('task-brief');

        const uniqueId = `complete-${task._id || index}`; 
        const isChecked = task.completed ? 'checked' : '';

        taskBrief.innerHTML = `
        <div class="tb-l">  
            <div class="task-complete">
                <input type="checkbox" class="cc complete" id="${uniqueId}" data-task-id="${task._id}" ${isChecked}>  
                <label for="${uniqueId}" class="cc_label complete" data-task-id="${task._id}"></label> 
            </div>
            <div>
                <div class="tb-title">
                    ${task.title}
                </div>
                <div class="tb-duedate">
                    Due: ${new Date(task.duedate).toLocaleDateString()}
                </div>
            </div>
        </div>
        <div class="tb-r">
            <button type="button" class='tb-view' data-task-id="${task._id}" id="tb-view">View</button>
            <button type="button" data-task-id="${task._id}" id="tb-edit" class='tb-edit'>Edit</button>
            <button type="button" data-task-id="${task._id}" id="tb-delete" class='tb-delete'>Delete</button>
        </div>
    `;

    // Append the created taskBrief to the taskList
    taskList.appendChild(taskBrief);
});

    // Working on my view btn... retrieve task id for further processing
    document.querySelectorAll('.tb-view').forEach(view => {
        view.addEventListener('click',(e) => {
            const taskId = e.target.getAttribute('data-task-id');
            displayTaskDetails(taskId);
        });
    });

    document.querySelectorAll('.tb-delete').forEach(del => {
        del.addEventListener('click',(e) => {
            const taskId = e.target.getAttribute('data-task-id');
            deleteTask(taskId);
        });
    });

    document.querySelectorAll('.tb-edit').forEach(edit => {
        edit.addEventListener('click',(e) => {
            const taskId = e.target.getAttribute('data-task-id');
            displayTaskDetails(taskId); 
        });
    });

    document.querySelectorAll('.complete').forEach(com => {
        com.addEventListener('change',(e) => {
            const taskId = e.target.getAttribute('data-task-id');
            let isCompleted = e.target.checked;
            completeTask(taskId,isCompleted);
        });
    });
};

const completeTask = (taskId,isCompleted) => {
    // fetch(`complete-task/${taskId}/${isCompleted}`,{
    //     method:'PATCH'
    //     // headers: {
    //     //     'Content-Type': 'application/json'
    //     // },
    //     // body: JSON.stringify({completed: isCompleted})
    // })
        // const completeTask = (taskId, isCompleted) => {

    // Using Axios to send a PATCH request
    axios.patch(`complete-task/${taskId}`,
       {completed: isCompleted.toString()}
)
    .then(response => {
        // Access response data directly
        if (response.data.success) {
            console.log('Task updated');
        } else {
            alert('Error updating task');
        }
    })
    .catch(error => {
        console.log(error.message); // Handle any errors
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

        editBtn.addEventListener('click', (e) => {
            editTask(e);
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


const updateTask = (itemId, updateText) => {
    
    axios.patch(`update-task/${itemId}`,
        {update:updateText.toString()}
    )
    .then(response => { 
        if(response.ok){
            alert(response.message);
        } 
    })
    .catch(err => console.log(err.message));
};


// Working on my search bar for tasks

const searchBar = document.getElementById('ts-search');
const searchBtn = document.querySelector('.ts-btn');

searchBar.addEventListener('input',() => {
    searchBar.value = searchBar.value.replace(/[^a-zA-Z\s]/g,'');

    const searchValue = searchBar.value.toLowerCase();

    document.querySelectorAll('.task-brief').forEach(taskBrief => {
        const taskTitle= taskBrief.querySelector('.tb-title').textContent.toLowerCase();

        if(taskTitle.includes(searchValue)){
            taskBrief.style.display = 'flex';
        } else {
            taskBrief.style.display = 'none';
        }
    });
    
});

searchBar.addEventListener('blur',() => {
    document.querySelectorAll('.task-brief').forEach(task => {
        task.style.display = 'flex';
    })
});

searchBtn.addEventListener('click', () => {
    const searchValue = searchBar.value;
    searchValue.toLowerCase();

    document.querySelectorAll('.task-brief').forEach(taskBrief => {
        const taskTitle= taskBrief.querySelector('.tb-title').textContent.toLowerCase();

        if(taskTitle.includes(searchValue)){
            taskBrief.style.display = 'flex';
        } else {
            taskBrief.style.display = 'none';

        }
    });
});



// Working on my filters
const priorCheck = document.querySelector('.prior');
let priorLoading = true;

const dueCheck = document.querySelector('.dueday');
let dueLoading = true;

const completeCheck = document.querySelector('.checker');
let checkLoading = true;

const taskDealer = () => {
    if ((!priorCheck.checked || !dueCheck.checked || !completeCheck) || (!priorCheck.checked && !dueCheck.checked && !completeCheck)) {
        priorLoading = false;
        dueLoading = false;
        checkLoading = false;
        loadTask();
    } 

    dueCheck.addEventListener('change',(e) => {
        if(e.target.checked){
            dueLoading = true;
            loadTask();
        } else {
            dueLoading = false;
            loadTask();
        }
    });

    priorCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            priorLoading = true;  
            loadTask();   
        } else {
            priorLoading = false;
            loadTask();       
        }
    });

    completeCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            checkLoading = true;  
            loadTask();   
        } else {
            checkLoading = false;
            loadTask();       
        }
    });
};


const loadPriorTask = () => {
    fetch('/show-prior-tasks')
    .then(response => response.json())
    .then(tasks => showTasks(tasks))
    .catch(err => err.message);
}

const loadDueTask = () => {
    fetch('/show-due-tasks')
    .then(response => response.json())
    .then(tasks => showTasks(tasks))
    .catch(err => err.message);
}

const loadCompletedTask = () => {
    fetch('/show-completed-tasks')
    .then(response => response.json())
    .then(tasks => showTasks(tasks))
    .catch(err => err.message);
}

const loadTask = () => {
    const taskList = document.getElementById('tasks-row');
    if(priorLoading){
        taskList.innerHTML = '';
        loadPriorTask();
    }else if(dueLoading){
        loadDueTask();
    }else if(checkLoading){
        loadCompletedTask();
    }
    else if((dueLoading === false) || (priorLoading === false)){
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
    }
};

// Working on my sort functions

const sortDate = document.getElementById('sort_date');
const sortDateBtn = document.querySelector('.dd-btn');

sortDate.addEventListener('change', () => {
    const dateInput = document.querySelector('.dd');    
    dateInput.focus();
});

sortDateBtn.addEventListener('click', () => {
    const dInput = document.querySelector('.dd').value;
    const dParsed = new Date(dInput);
    const isoDate = dParsed.toISOString();

    fetch(`sort-due-date/${isoDate}`)
    .then(response => response.json())
    .then(tasks => showTasks(tasks))
    .catch(err => console.log(err.message));
});



const creationDate = document.getElementById('sort_c_date');
const creationDateBtn = document.querySelector('.tt-btn');

creationDate.addEventListener('change', () => {
    const dateInput = document.querySelector('.tt');    
    dateInput.focus();
});

creationDateBtn.addEventListener('click', () => {
    const dInput = document.querySelector('.tt').value;
    const dParsed = new Date(dInput);
    const isoDate = dParsed.toISOString();

    fetch(`sort-creation-date/${isoDate}`)
    .then(response => response.json())
    .then(tasks => showTasks(tasks))
    .catch(err => console.log(err.message));
});

// for priority in sort group

const sPriority = document.getElementById('sort_priority');

sPriority.addEventListener('change',() => {
    loadPriorTask();
});

taskDealer();   

// Functions to run as soon as the window loads

window.onload = () => {
    const userName = document.querySelector('.user-name');
    const profilePic = document.querySelector('.user-pic');

    fetch(`user-name`)
    .then(response => response.json())
    .then(data => {
        userName.innerHTML = data.user;
        profilePic.setAttribute('src',`data:${data.ptype};base64,${data.profile}`);
    })
    .catch(err => console.log(err.message));
};