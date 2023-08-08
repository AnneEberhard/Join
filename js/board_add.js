function openAddTask() {
    //window.location.href = "add_task.html";
    console.log('open');
    document.getElementById('addTaskBoard').classList.remove('d-none');
}

function closeAddTask() {
    console.log('close');
    document.getElementById('addTaskBoard').classList.add('d-none');
}
