function openTaskOverview(id) {
    
    let task = tasks[id];
    let colorCode = `colorCategory${determineColorCategory(task['category'])}`;
    renderEditOverviewTemplate(colorCode, task['prio'], id);
    let taskOverview = document.getElementById('editTask');
    taskOverview.classList.remove('d-none');
    document.getElementById('editTaskContainerCategory').innerHTML = `${task['category']}`;
    document.getElementById('editTaskContainerTitle').innerHTML = `${task['title']}`;
    document.getElementById('editTaskContainerDescription').innerHTML = `${task['description']}`;
    document.getElementById('editTaskContainerDueDateDate').innerHTML = `${task['dueDate']}`;
    document.getElementById('editTaskContainerDelete').innerHTML = `<img src="/assets/img/Icon_delete.png" onclick="askBeforeDelete(${id})">`;
    document.getElementById('editTaskContainerPrioPrio').innerHTML = `${task['prio']} <img src="../assets/img/${task['prio']}_white.png"/>`;

    renderAssignementsInTaskOverview(task, "editTaskContainerAssignedNames");
}


function renderEditOverviewTemplate(colorCode, prio, id){
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
                <div id="editTaskContainerCategory" class="${colorCode}"></div>
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
            </div>
        </div>
    `
}


function renderAssignementsInTaskOverview(task, idContainer) {
    let assign = task['assignedContacts'];
    document.getElementById(`${idContainer}`).innerHTML = "";
    for (let i = 0; i < assign.length; i++) {
        const a = assign[i];

        let newContainer = document.createElement('div');
        newContainer.classList.add('editTaskUsername');
        let newCircle = document.createElement('div');
        newCircle.classList.add('editTaskUsernameCircle');
        let newName = document.createElement('div');
        newName.classList.add('editTaskUsernameName');

        let un = document.getElementById(idContainer);

        newContainer.appendChild(newCircle);
        newContainer.appendChild(newName);
        newCircle.innerHTML = a.acronym;
        newName.innerHTML = a.user_name;
        un.appendChild(newContainer);
    }
}


function askBeforeDelete(a) {
    let confirmDelete = document.getElementById('confirmDeleteTask');
    confirmDelete.classList.remove('d-none');
    confirmDelete.innerHTML += /*html*/`
        <div id="confirmDeleteTaskQuestion">Delete Task?</div>
        <div id="confirmDeleteTaskAnswers">
                <div id="confirmDeleteTaskAnswersYes" onclick="deleteTaskFinally(${a})">Delete</div>
                <div id="confirmDeleteTaskAnswersNo" onclick="closeDeleteRequest()">Back</div>
        </div>
    `
}


async function deleteTaskFinally(a) {
    closeDeleteRequest();
    await deleteTask(a);
    window.location.href = "board.html";
}


function closeDeleteRequest() {
    document.getElementById('confirmDeleteTask').innerHTML = "";
    document.getElementById('confirmDeleteTask').classList.add('d-none');
}


function closeEditTask() {
    document.getElementById('editTask').classList.add('d-none');
}


function openEditMode(id){    
    let task = tasks[id];
    renderEditModeTemplates(task)
}


function renderEditModeTemplates(task){
    document.getElementById('editTask').innerHTML = "";
    document.getElementById('editTask').innerHTML = /*html*/`
        <div id="editTaskContainer">
            <div id="editTaskContainerClose" onclick="closeEditTask()"><img src="assets/img/Icon_close.png" alt="">
            </div>
            <div id="editTaskContainerSave">
                <div id="editTaskContainerSaveText">Ok</div>
                <div id="editTaskContainerSaveIcon"><img src="assets/img/done-30.png"></div>
            </div>

            <div id="editTaskContainerInner" class="editContainerInner">
                <div id="editTaskTitle" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskTitleFixed">Title</div>
                    <input id="editTaskTitleChangable" class="inputsAddTask" value="${task['title']}">
                </div>

                <div id="editTaskDescription" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskDescriptionFixed">Description</div>
                    <textarea id="editTaskDescriptionChangable" class="inputsAddTask">${task['description']}</textarea>
                </div>

                <div id="editTaskDueDate" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskDueDateFixed">Due Date</div>
                        <input
                            id="dueDate"
                            class="inputsAddTask height51 padding hover"
                            type="date"
                            required
                            placeholder="${task['dueDate']}"            
                            />
                </div> 

                <div id="editTaskPrio" class="editTaskTitleFixed editTasksWidth80">
                    <div id="editTaskPrioFixed">Priority</div>
                    <div id="editTaskPrioChangable"> 
                        <button id="urgent" type="button" onclick="assignPrio('urgent')" class="prio height51 hover">
                        Urgent <img src="assets/img/urgent.png" />
                        </button>
                        <button id="medium" type="button" onclick="assignPrio('medium')" class="prio height51 hover">
                            Medium <img src="assets/img/medium.png" />
                        </button>
                        <button id="low" type="button" onclick="assignPrio('low')" class="prio height51 hover">
                            Low <img src="assets/img/low.png" />
                        </button>
                    </div>
                </div>

                <div id="editTaskAssigned" class="editTaskTitleFixed">
                    <div id="editTaskAssignedFix">Assigned to</div>
                    <div id="contactContainer" class="inputsAddTask editAssignment"></div>
                    <div id="editTaskAssignedChangable"></div>
                </div>
            </div>
        </div>
    `
    let assignedCard = task['assignedContacts'];
    createAssignmentIcons(assignedCard, "editTaskAssignedChangable");
    renderContacts();
}