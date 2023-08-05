//to be deleted once loadTasks() works
tasksInBoard = 1;
tasksInProgress = 1;
awaitingFeedback = 1;
toDo = 1;
done = 1;

async function loadSummary(){
    greetingSummary();
    currentDate();
    loadTasks();
    renderSummary();
}

function greetingSummary(){
    createGreetingPhrase();
    createNameGreating();
}


function createGreetingPhrase(){
    let timeNow = new Date().getHours();
    let greeting;
    if(5 < timeNow && timeNow < 12){
        greeting = "Good morning,"
    } else if (12 <= timeNow && timeNow < 18){
        greeting = "Good Afternoon"
    } else {
        greeting = "Good Evening"
    }
    document.getElementById('summary_container_bottom_right_greeting').innerHTML = /*html*/`
        ${greeting}
    `
}

async function createNameGreating(){
    await loadUsers();
    currentUser = users[0].name;

    document.getElementById('summary_container_bottom_right_Name').innerHTML = /*html*/`
        ${currentUser}
    `

}


function currentDate(){
    const currentDate = new Date();
    const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
    ];
    const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    document.getElementById('summary_bottom_stats_mid_right_date').innerHTML = /*html*/`
        ${formattedDate}
    `
}


async function loadTasks(){
    let i = await getItem("tasksInProgress");   
}

function renderSummary() {
    //to be deleted once loadTasks() works
    tasksInBoard = 1;
    tasksInProgress = 2;
    awaitingFeedback = 3;
    let urgentTasks = 4;
    let deadline = 'August 10, 2023'
    toDo = 5;
    done = 6;
    //stop of deleting once loadTasks() works
    document.getElementById('tasks_in_Board_number').innerHTML = `${tasksInBoard}`;
    document.getElementById('tasks_in_progress_number').innerHTML = `${tasksInProgress}`;
    document.getElementById('awaiting_feedback_number').innerHTML = `${awaitingFeedback}`;
    document.getElementById('summary_bottom_stats_mid_left_container_number').innerHTML = `${urgentTasks}`;
    document.getElementById('summary_bottom_stats_mid_right_date').innerHTML = `${deadline}`;
    document.getElementById('summary_bottom_stats_bottom_left_todo_number').innerHTML = `${toDo}`;
    document.getElementById('summary_bottom_stats_bottom_right_done_number').innerHTML = `${done}`;
   
}