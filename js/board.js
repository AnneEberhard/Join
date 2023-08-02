async function createBoardCard() {
    await loadItems();
    let ID = 1;
    let task = tasks[0];
    let titleCard = task['title'];
    let descriptionCard = task['description'];
    let categoryCard = task['category'];
    let assignedCard = task['assignedContacts'];
    let dueDateCard = task['dueDate'];
    let prioCard = task['prio'];
    let subtaskCard = task['subtasks'];

    renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard);

    if (subtaskCard.length > 0) {
        createProgressbar(subtaskCard, ID);
    }
}


function renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard) {
    let board_todo = document.getElementById('board_container_bottom_todo');
    board_todo.innerHTML += /*html*/`
        <div id="${ID}" draggable="true" ondragstart="startDragging(ID)" class="board_task_container">
            <div class="board_task_container_inner">
                <div class="board_task_container_category">${categoryCard}</div>
                <div class="board_task_container_title_and_description">
                    <div class="board_task_container_title">${titleCard}</div>
                    <div class="board_task_container_description">${descriptionCard}</div>
                </div>
                <div class="board_task_progress">
                    <div class="board_task_progressbar" id="progressbar${ID}"></div>
                    <div class="board_task_progress_text" id="progressbarText${ID}"></div>
                </div>
                <div class="board_task_assignments">
                    <div class="board_task_working">
                        <div class="board_Icons_Username">KN</div>
                        <div class="board_prio"><img src="../assets/img/${prioCard}.png" /></div>
                    </div>                            
                </div>
            </div>
        </div> 
    `
}


function createProgressbar(subtaskCard, id) {
    let tasksNumber = subtaskCard.length;
    let doneTasksNumber = (tasksNumber / 2).toFixed(0)        //nur zu Testzwecken ist die Hälfte der Aufgavben erfüllt
    let procentDoneTasks = doneTasksNumber / tasksNumber;
    let filledprogressbar = 138 * procentDoneTasks;

    renderProgressBar(filledprogressbar, id);
    renderProgressText(doneTasksNumber, tasksNumber, id);
}


function renderProgressBar(filledprogressbar, id) {
    let progresID = "progressbar" + id;
    document.getElementById(progresID).style = `width: ${filledprogressbar}px`;
}


function renderProgressText(doneTasksNumber, tasksNumber, id) {
    let progresTextID = "progressbarText" + id;
    document.getElementById(progresTextID).innerHTML = /*html*/`
        ${doneTasksNumber}/${tasksNumber} Done
    `
}


function createAssignmentIcons(assignedCard) {

}