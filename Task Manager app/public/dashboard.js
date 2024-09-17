// To handle all dashboard functionalities

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

