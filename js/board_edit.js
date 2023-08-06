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

    renderAssignementsInTaskOverview(task);
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


function renderAssignementsInTaskOverview(task) {
    let assign = task['assignedContacts'];
    document.getElementById(`editTaskContainerAssignedNames`).innerHTML = "";
    for (let i = 0; i < assign.length; i++) {
        const a = assign[i];

        let newContainer = document.createElement('div');
        newContainer.classList.add('editTaskUsername');
        let newCircle = document.createElement('div');
        newCircle.classList.add('editTaskUsernameCircle');
        let newName = document.createElement('div');
        newName.classList.add('editTaskUsernameName');

        let un = document.getElementById(`editTaskContainerAssignedNames`);

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
    console.log(task);
    renderEditModeTemplates()
}


function renderEditModeTemplates(){
    document.getElementById('editTask').innerHTML = "";
    document.getElementById('editTask').innerHTML = /*html*/`
        <div id="editTaskContainer">
            <div id="editTaskContainerClose" onclick="closeEditTask()"><img src="assets/img/Icon_close.png" alt="">
            </div>
            <div id="editTaskContainerSave">
                <div id="editTaskContainerSaveText">Save</div>
                <div id="editTaskContainerSaveIcon"><img src="assets/img/done-30.png"> </div>
            </div>
            <div id="editTaskContainerInner">
                <div id="editTaskTitle" class="editTaskTitleFixed">
                    <div id="editTaskTitleFixed">Title</div>
                    <input id="editTaskTitleChangable">
                </div>
                <div id="editTaskDescription" class="editTaskTitleFixed">
                    <div id="editTaskDescriptionFixed">Description</div>
                    <textarea id="editTaskDescriptionChangable"></textarea>
                </div>
                <div id="editTaskDueDate" class="editTaskTitleFixed">
                    <div id="editTaskDueDateFixed">Due Date</div>
                    <div id="editTaskDueDateDate Changable"></div>
                </div>
                <div id="editTaskPrio" class="editTaskTitleFixed">
                    <div id="editTaskPrioFixed">Priority</div>
                    <div id="editTaskPrioChangable"></div>
                </div>
                <div id="editTaskAssigned" class="editTaskTitleFixed">
                    <div id="editTaskAssignedFix">Assigned to</div>
                    <div id="editTaskAssignedChangable"></div>
                </div>
            </div>
        </div>
    `
}