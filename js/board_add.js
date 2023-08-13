function openAddTask(column) {
    localStorage.setItem('column', column);
    if (isMobileDevice()) {
        window.location.href = "add_task.html";
    } else {
        document.getElementById('addTaskBoard').classList.remove('d-none');
        initTask();
        document.getElementById('addTaskBoardContainer').classList.add('slideIn');
    }
}

function closeAddTask() {
    document.getElementById('addTaskBoard').classList.add('d-none');
    document.getElementById('addTaskBoardContainer').classList.remove('slideOut');
}
