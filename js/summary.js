//to be deleted once loadTasks() works
let summaryTasksInBoard = 0;
let summaryTasksInProgress = 0;
let summaryAwaitingFeedback = 0;
let summaryToDo = 0;
let summaryDone = 0;
let summaryUrgentTasks = 0;
let summaryDueDate = "3000-12-31";
let newSummaryDueDate;

async function loadSummary(){    
    await loadItems();    
    await countTasks();       
    greetingSummary(); 
}


async function countTasks(){    
    for (let t = 0; t < tasks.length; t++) {
        const task = tasks[t];
        let column = task.column;
        let urgent = task.prio;
        let date = task.dueDate;
        countBoard(column);    
        countTodo(column);
        countInProgress(column);
        countAwaitingFeedback(column);
        countDone(column);
        countUrgent(urgent);
        checkDueDate(date);
    }
    await renderSummary();
}


function renderSummary() {
    //to be deleted once loadTasks() works
    document.getElementById('tasks_in_Board_number').innerHTML = `${summaryTasksInBoard}`;
    document.getElementById('tasks_in_progress_number').innerHTML = `${summaryTasksInProgress}`;
    document.getElementById('awaiting_feedback_number').innerHTML = `${summaryAwaitingFeedback}`;
    document.getElementById('summary_bottom_stats_mid_left_container_number').innerHTML = `${summaryUrgentTasks}`;
    document.getElementById('summary_bottom_stats_mid_right_date').innerHTML = `${newSummaryDueDate}`;
    document.getElementById('summary_bottom_stats_bottom_left_todo_number').innerHTML = `${summaryToDo}`;
    document.getElementById('summary_bottom_stats_bottom_right_done_number').innerHTML = `${summaryDone}`;
   
}


function countBoard(){
    summaryTasksInBoard++;
}


function countTodo(column){
    if(column === 'board_container_bottom_todo'){
        summaryToDo++
    }
}


function countInProgress(column){
    if(column === 'board_container_bottom_inprogress'){
        summaryTasksInProgress++
    }
}


function countAwaitingFeedback(column){
    if(column === 'board_container_bottom_awaitingfeedback'){
        summaryAwaitingFeedback++
    }
}


function countDone(column){
    if(column === 'board_container_bottom_done'){
        summaryDone++
    }
}


function countUrgent(prio){
    if(prio === 'urgent'){
        summaryUrgentTasks++
    }
}


function checkDueDate(date){
    if(date < summaryDueDate || summaryDueDate == 'undefinded'){
        formatedDate = formatDate(date)      
        summaryDueDate = date;
        newSummaryDueDate = formatedDate;
    }
}


function formatDate(inputDate) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const parts = inputDate.split('-');
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const formattedDate = `${months[month - 1]} ${day}, ${year}`;
      return formattedDate;
    } else {
      console.error('Ungültiges Datum.');
      return null;
    }
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
        greeting = "Good Afternoon,"
    } else {
        greeting = "Good Evening,"
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

