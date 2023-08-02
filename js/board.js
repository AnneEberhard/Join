// let task = {
//     'title': title,
//     'description': description,
//     'category': assignedCategory,
//     'assignedContacts': assignedContacts,
//     'dueDate': dueDate,
//     'prio': assignedPrio,
//     'subtasks': subTasksArray,
//   }
//   tasks.push(task);



/** 
 * 
<div draggable="true" ondragstart="startDragging(ID)" class="board_task_container">
<div class="board_task_container_inner">
<div class="board_task_container_category">Design</div>
<div class="board_task_container_title_and_description">
    <div class="board_task_container_title">Webdesign redesign</div>
    <div class="board_task_container_description">Modify the Content of the main website</div>
</div>
<div class="board_task_progress">
    <div class="board_task_progressbar"></div>
    <div class="board_task_progress_text">1/2 Done</div>
</div>
<div class="board_task_assignments">
    <div class="board_task_working">
        <div class="board_Icons_Username">KN</div>
        <img src="/assets/img/medium.png" alt="">
    </div>                            
</div>
</div>
</div> 
*/

async function createBoardCard() {
    await loadItems();
    let task = tasks[0];
    let titleCard = task['title'];
    let descriptionCard = task['description'];
    let categoryCard = task['category'];
    let assignedCard = task['assignedContacts'];
    let dueDateCard = task['dueDate'];
    let prioCard = task['prio'];
    let subtaskCard = task['subtasks'];

    createProgressbar(subtaskCard);

    console.log(task)
    console.log(assignedCard)
    console.log(subtaskCard)

    let board_todo = document.getElementById('board_container_bottom_todo');
    board_todo.innerHTML += /*html*/`
        <div id="1" draggable="true" ondragstart="startDragging(ID)" class="board_task_container">
            <div class="board_task_container_inner">
                <div class="board_task_container_category">${categoryCard}</div>
                <div class="board_task_container_title_and_description">
                    <div class="board_task_container_title">${titleCard}</div>
                    <div class="board_task_container_description">${descriptionCard}</div>
                </div>
                <div class="board_task_progress">
                    <div class="board_task_progressbar"></div>
                    <div class="board_task_progress_text">1/2 Done</div>
                </div>
                <div class="board_task_assignments">
                    <div class="board_task_working">
                        <div class="board_Icons_Username">KN</div>
                        ${prioCard}
                    </div>                            
                </div>
            </div>
        </div> 
    `
}


function createProgressbar(subtaskCard){
    let tasksNumber = subtaskCard.length;
    console.log(tasksNumber)
}