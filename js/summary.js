function greetingSummary(){
    createGreetingPhrase();
    createNameGreating();
}


function createGreetingPhrase(){
    let timeNow = new Date().getHours();
    let greeting;
    if(5 < timeNow < 12){
        greeting = "Good morning,"
    } else if (12 <= timeNow < 18){
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

    
}