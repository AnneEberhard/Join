/**
 * opens a card, which shows the detailed task
 * @param {*} id index of task which was clicked
 * @param {*} category category of the clicked task
 */
function openTaskOverview(id, category) {
    let task = tasks[id];
    column = task.column;
    assignedCategory = category;
    subTasksArray = task['subtasks'];
    let colorCode = determineColorCategory(task['category']);
    renderEditOverviewTemplate(colorCode, task['prio'], id);
    let taskOverview = document.getElementById('editTask');
    taskOverview.classList.remove('d-none');
    renderTaskOverview(task, id);


    renderAssignementsInTaskOverview(task, "editTaskContainerAssignedNames");
    renderSubtasksInTaskOverview(task, id);
}

/**
 * render values in Overview Container
 * @param {*} task which is opened
 * @param {*} id task id
 */
function renderTaskOverview(task, id) {
    document.getElementById('editTaskContainerCategory').innerHTML = `${task['category']}`;
    document.getElementById('editTaskContainerTitle').innerHTML = `${task['title']}`;
    document.getElementById('editTaskContainerDescription').innerHTML = `${task['description']}`;
    document.getElementById('editTaskContainerDueDateDate').innerHTML = `${task['dueDate']}`;
    document.getElementById('editTaskContainerDelete').innerHTML = `<img src="/assets/img/Icon_delete.png" onclick="askBeforeDelete(${id})">`;
    document.getElementById('editTaskContainerPrioPrio').innerHTML = `${task['prio']} <img src="../assets/img/${task['prio']}_white.png"/>`;
}

/**
 * template of the card
 * @param {*} colorCode colorCode of the category
 * @param {*} prio prio of the task
 * @param {*} id index of the task
 */
function renderEditOverviewTemplate(colorCode, prio, id) {
    document.getElementById('editTask').innerHTML = /*html*/`
        <div id="confirmDeleteTask" class="d-none">
        </div>
        <div id="editTaskContainer">
            <div id="editTaskContainerClose" onclick="closeEditTask()"><img src="/assets/img/Icon_close.png" alt="">
            </div>
            <div id="editTaskContainerEditDelete">
                <div id="editTaskContainerDelete"></div>
                <div id="editTaskContainerEdit" onclick="openEditMode(${id})"><img src="/assets/img/Icon_edit.png"></div>
            </div>
            <div id="editTaskContainerInner">
                <div id="editTaskContainerCategory" style="background-color: ${colorCode}"></div>
                <div id="editTaskContainerTitle"></div>
                <div id="editTaskContainerDescription"></div>
                <div id="editTaskContainerDueDate">
                    <div id="editTaskContainerDueDateText">Due Date:</div>
                    <div id="editTaskContainerDueDateDate"></div>
                </div>
                <div id="editTaskContainerPrio">
                    <div id="editTaskContainerPrioText">Priority:</div>
                    <div id="editTaskContainerPrioPrio"class="prio_${prio}"></div>
                </div>
                <div id="editTaskContainerAssigned">
                    <div id="editTaskContainerAssignedText">Assigned to:</div>
                    <div id="editTaskContainerAssignedNames"></div>
                </div>
                <div id=editTaskContainerSubtasks>
                <div id=editTaskContainerSubtasksText>Subtasks</div>
                <div id=editTaskContainerSubtasksTasks></div>
                </div>
            </div>
        </div>
    `
    disableBackgroundScroll();
}

/**
 * 
 * @param {*} task 
 * @param {*} idContainer container to render in
 */
function renderAssignementsInTaskOverview(task, idContainer) {
    let assignedUsers = task['assignedContacts'];
    document.getElementById(`${idContainer}`).innerHTML = "";
    for (let i = 0; i < assignedUsers.length; i++) {
        const assignedUser = assignedUsers[i];

        for (let k = 0; k < contacts.length; k++) {
            const contact = contacts[k];
            renderAssignmentIconsInCard(assignedUser, contact, idContainer);
        }
    }
}

/**
 * compares if assignedUser is an User in contact List --> creates and IconCircle
 * @param {*} assignedUser 
 * @param {*} contact 
 * @param {*} idContainer 
 */
function renderAssignmentIconsInCard(assignedUser, contact, idContainer) {
    if (assignedUser.user_name === contact.user_name) {

        let newContainer = document.createElement('div');
        newContainer.classList.add('editTaskUsername');
        let newCircle = document.createElement('div');
        newCircle.classList.add('editTaskUsernameCircle');
        newCircle.style.backgroundColor = getColor(assignedUser.user_name);
        let newName = document.createElement('div');
        newName.classList.add('editTaskUsernameName');

        let un = document.getElementById(idContainer);

        newContainer.appendChild(newCircle);
        newContainer.appendChild(newName);
        newCircle.innerHTML = assignedUser.acronym;

        newName.innerHTML = assignedUser.user_name;
        un.appendChild(newContainer);
    }
}

/**
 * renders Subtasks in Overview
 */
async function renderSubtasksInTaskOverview() {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML = "";

    for (let s = 0; s < subTasksArray.length; s++) {
        if (subTasksArray[s].subTaskDone == 0) {
            renderSubtasksWithoutHook(s);
        } else {
            renderSubtasksWithHook(s);
        }
    }
    renderAddSubtasksInOverview();
}

/**
 * Subtask Input and Add Button in Overview
 */
function renderAddSubtasksInOverview() {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
        <div class="subtaskEdit">
            <input id="inputSubtaskEdit" placeholder="Add new subtask" />
            <div class="buttonAddSubTask hover" onclick="addSubTaskEdit()">
                <img src="assets/img/plus.png" />
            </div>
        </div>
    `
}

/**
 * render checkbox without hook
 * @param {*} index 
 */
function renderSubtasksWithoutHook(index) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
            <div class="subtaskInOverview">
                <div id="checkBox${index}" class="checkBox hover" onclick="addCheck(${index})"></div>
                <div>${subTasksArray[index].subTaskName}</div>
            </div>
        `
}

/**
 * render checkbox with hook
 * @param {*} index 
 */
function renderSubtasksWithHook(index) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
            <div class="subtaskInOverview">
                <div id="checkBox${index}" class="checkBox hover" onclick="addCheck(${index})"><img src="assets/img/done-30.png"></div>
                <div>${subTasksArray[index].subTaskName}</div>
            </div>
        `
}


/**
 * this function renders the field for adding subtasks
 * @param - no parameter
 */
async function addSubTaskEdit() {
    let subTaskName = document.getElementById("inputSubtaskEdit").value;
    let subTaskDone = 0;
    let subTask = {
        'subTaskName': subTaskName,
        'subTaskDone': subTaskDone
    }
    subTasksArray.push(subTask);
    renderSubtasksInTaskOverview();
    await saveTask();
    renderBoard();
    document.getElementById("inputSubtaskEdit").value = "";
}


/**
 * confirm Container if task should be deleted
 * @param {*} a 
 */
function askBeforeDelete(id) {
    let confirmDelete = document.getElementById('confirmDeleteTask');
    confirmDelete.classList.remove('d-none');
    confirmDelete.innerHTML += /*html*/`
        <div id="confirmDeleteTaskQuestion">Delete Task?</div>
        <div id="confirmDeleteTaskAnswers">
                <div id="confirmDeleteTaskAnswersYes" onclick="deleteTaskFinally(${id})">Delete</div>
                <div id="confirmDeleteTaskAnswersNo" onclick="closeDeleteRequest()">Back</div>
        </div>
    `
}

/**
 * look at className 
 * @param {*} a 
 */
async function deleteTaskFinally(id) {
    closeDeleteRequest();
    await deleteTask(id);
    renderBoardCards();
    closeEditTask();
}


function closeDeleteRequest() {
    document.getElementById('confirmDeleteTask').innerHTML = "";
    document.getElementById('confirmDeleteTask').classList.add('d-none');
}


function closeEditTask() {
    enableBackgroundScroll();
    document.getElementById('editTask').classList.add('d-none');

}


function openEditMode(id) {
    let task = tasks[id];
    renderEditModeTemplates(task, id);
}

/**
 * render Edit Container 
 * @param {*} task 
 * @param {*} id 
 */
function renderEditModeTemplates(task, id) {
    let editTask = document.getElementById('editTask');
    editTask.innerHTML = "";
    editTask.innerHTML = /*html*/`
        <div id="editTaskContainer">
            <div id="editTaskContainerClose" onclick="closeEditTask()"><img src="assets/img/Icon_close.png" alt="">
            </div>
            <div id="editTaskContainerSave" onclick="saveEditedBoard(${id})">
                <div id="editTaskContainerSaveText">Ok</div>
                <div id="editTaskContainerSaveIcon"><img src="assets/img/done-30.png"></div>
            </div>
            <div id="editTaskContainerInner" class="editContainerInner">
                <div id="editTaskTitle" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskTitleFixed">Title</div>
                    <input id="editTaskTitleChangable" class="inputsAddTask" value="${task['title']}" maxlength="30">
                </div>
                <div id="editTaskDescription" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskDescriptionFixed">Description</div>
                    <textarea id="editTaskDescriptionChangable" class="inputsAddTask" maxlength="100">${task['description']}</textarea>
                </div>
                <div id="editTaskDueDate" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskDueDateFixed">Due Date</div>
                        <input
                            id="dueDate"
                            class="inputsAddTask height51 padding hover"
                            type="date"
                            required
                            value="${task['dueDate']}"       
                            />
                </div> 
                <div id="editTaskPrio" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskPrioFixed">Priority</div>
                    <div id="editTaskPrioChangable"> 
                        <button id="urgentEdit" type="button" onclick="assignPrio('urgent', 'Edit')" class="prio height51 hover">
                        Urgent <img src="assets/img/urgent.png" />
                        </button>
                        <button id="mediumEdit" type="button" onclick="assignPrio('medium', 'Edit')" class="prio height51 hover">
                            Medium <img src="assets/img/medium.png" />
                        </button>
                        <button id="lowEdit" type="button" onclick="assignPrio('low', 'Edit')" class="prio height51 hover">
                            Low <img src="assets/img/low.png" />
                        </button>
                    </div>
                    <div id="prioAlert" class="alert"></div>
                </div>
                <div id="editTaskAssigned" class="editTaskTitleFixed">
                    <div id="editTaskAssignedFix">Assigned to</div>
                    <div id="editContactContainer" class="inputsAddTask editAssignment"></div>
                    <div id="editContactAlert" class="alert"></div>
                    <div id="editTaskAssignedChangable"></div>
                </div>
            </div>
        </div>
    `
    let assignedCard = task['assignedContacts'];
    renderContacts('editContactContainer');
    renderContactsAssignContacts(assignedCard);
    createAssignmentIcons(assignedCard, "editTaskAssignedChangable");
    assignPrio(task["prio"], 'Edit');
}

/**
 * 
 * @param {*} assContacts 
 */
function renderContactsAssignContacts(assContacts) {
    let searchArea = document.getElementsByClassName("contactList");
    for (let c = 0; c < assContacts.length; c++) {
        const assContact = assContacts[c];
        for (let d = 0; d < searchArea.length; d++) {
            const searchElement = searchArea[d];
            searchValue = searchElement.textContent || searchElement.innerText;

            if (searchValue.indexOf(assContact.user_name) > -1) {
                classContainer = d;
                assignContact(d)
            }
        }
    }
    updateAssignedContacts(); //Array with assignedContacts loaded and avoid alert 
}


/**
 * save edited Task, close EditMode and render board
 * @param {*} id 
 */
async function saveEditedBoard(id) {
    let prioFilled = checkPrio();
    let correctContact = checkCorrectContact();
    if (prioFilled == true && correctContact == true) {
        let title = document.getElementById("editTaskTitleChangable").value;
        let description = document.getElementById("editTaskDescriptionChangable").value;
        let dueDate = document.getElementById("dueDate").value;
        let task = {
            'title': title,
            'description': description,
            'category': assignedCategory,
            'assignedContacts': assignedContacts,
            'dueDate': dueDate,
            'prio': assignedPrio,
            'column': column,
            'subtasks': subTasksArray,
        }
        tasks[id] = task;
        await saveTask();
        closeEditTask();
        await renderBoardCards();
    }
}


function preventBackgroundScroll() {
    if (isMobileDevice()) {
        document.getElementById('board_container_bottom').style.overflow = 'hidden'; 
        
    }
}


function enableBackgroundScroll() {
    document.getElementById('board_container_bottom').style.overflow = ''; 
}


function disableBackgroundScroll() {
    if (isMobileDevice()) {
        preventBackgroundScroll();
    }
}


function handleDragOver(ev) {
    ev.preventDefault();
}

function handleDragLeave(ev) {
    removeHighlight(ev);
}

function handleDrop(category, ev) {
    ev.preventDefault();
    moveTo(category);
}

function handleTouchMove(ev) {
    ev.preventDefault();
    allowDrop(ev);
    highlight(ev);
}

function handleTouchEnd(category, ev) {
    removeHighlight(ev);
    moveTo(category);
}