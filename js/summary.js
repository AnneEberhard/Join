function loadSummary(){
    greetingSummary();
    currentDate();
    getTaskAmount();
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


// async function getTaskAmount(){
//     let i = await loadTasks('tasksInBoard');



    
//     console.log(i);
//     console.log();
//     console.log();
// }