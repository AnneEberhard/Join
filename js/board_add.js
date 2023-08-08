function openAddTask() {
    document.getElementById('addTaskBoard').classList.remove('d-none');
    document.getElementById('addTaskBoardContainer').classList.add('slideIn');
}

function closeAddTask() {
    document.getElementById('addTaskBoard').classList.add('d-none');
    document.getElementById('addTaskBoardContainer').classList.remove('slideOut');
}
