// Tasks

// const tasks = {
//     '2024-09-09': [
//         {
//             title: 'Task 1',
//             category: 'Work',
//             priority: 'High'
//         }
//     ],
//     '2024-02-05': [
//         {
//             title: 'Task 2',
//             category: 'Personal',
//             priority: 'Low'
//         },
//         {
//             title: 'Task 3',
//             category: 'Fitness',
//             priority: 'Medium'
//         }
//     ]
//     // Add more task dates with task details here
// };



// Creating my calender

const months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];

let Month = new Date().getMonth();
let Year = new Date().getFullYear();

const updateCalendar = () => {
    let month = document.querySelector('.month');
    let year = document.querySelector('.year');

    month.textContent = months[Month];
    year.textContent = `${Year}`;
};

const createDays = () => {
    const daysInMonth = new Date(Year, Month + 1, 0).getDate();
    const dayBox_holder = document.querySelector('.cal-days');

    dayBox_holder.innerHTML = ''; 
    // am looping to create the days of the month
    let i;
    for(i = 0; i < daysInMonth; i++){
        const dayBox = document.createElement('div');
        dayBox.classList.add('cal-day');
        dayBox.textContent = i + 1;
        dayBox_holder.append(dayBox);

        const dateString = `${Year}-${String(Month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;

        // Working on my tasks
        // if(tasks[dateString]){
        //     dayBox.classList.add('cal-task-day');

        //     dayBox.addEventListener('mouseover', () => {
        //         tasks[dateString].forEach(task => {
        //             const pop_display = document.getElementById('c-d');
        
        //             pop_display.innerHTML = `Task title: ${task.title} <br> Category: ${task.category} <br> Priority: ${task.priority}`;

        //             dayBox.addEventListener('mouseleave', () => {
        //                 pop_display.textContent = '';
        //             });
        //         });
        //     });
        // }
    }

    
};

// Previous and Next Buttons config

const prevBtn = () => {
    Month--
    if(Month < 0){
        Month = 11;
        Year--
    }
    updateCalendar()
    createDays();
};

const prevbtn = document.getElementById('cal-prev');
prevbtn.addEventListener('click',prevBtn);


// Next button
const nextBtn = () => {
    Month++
    if(Month > 11){
        Month = 0;
        Year++
    }
    updateCalendar()
    createDays();
};

const nextbtn = document.getElementById('cal-next');
nextbtn.addEventListener('click',nextBtn);


updateCalendar();

createDays();
