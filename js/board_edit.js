function openTaskOverview(id, category) {
    assignedCategory = category;
    let task = tasks[id];
    column = task.column;
    let colorCode = determineColorCategory(task['category']);
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
            </div>
        </div>
    `
}


function renderAssignementsInTaskOverview(task, idContainer) {
    let assignedUsers = task['assignedContacts'];
    document.getElementById(`${idContainer}`).innerHTML = "";
    for (let i = 0; i < assignedUsers.length; i++) {
        const assignedUser = assignedUsers[i];

        for (let k = 0; k < contacts.length; k++) {
            const contact = contacts[k];

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
    renderBoardCards();
    closeEditTask();
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
    renderEditModeTemplates(task, id);
}


function renderEditModeTemplates(task, id){
    
    document.getElementById('editTask').innerHTML = "";
    document.getElementById('editTask').innerHTML = /*html*/`
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
                    <div id="prioAlert" class="alert"></div>
                </div>

                <div id="editTaskAssigned" class="editTaskTitleFixed">
                    <div id="editTaskAssignedFix">Assigned to</div>
                    <div id="contactContainer" class="inputsAddTask editAssignment"></div>
                    <div id="contactAlert" class="alert"></div>
                    <div id="editTaskAssignedChangable"></div>
                </div>
            </div>
        </div>
    `
    let assignedCard = task['assignedContacts'];
    
    renderContacts();
    renderContactsAssignContacts(assignedCard);
    createAssignmentIcons(assignedCard, "editTaskAssignedChangable");
    assignPrio(task["prio"]);
    
}


function renderContactsAssignContacts(assContacts){
    let searchArea = document.getElementsByClassName("contactList");
    for (let c = 0; c < assContacts.length; c++) {
        const assContact = assContacts[c];
        for (let d = 0; d < searchArea.length; d++) {
            const searchElement = searchArea[d];            
            searchValue = searchElement.textContent || searchElement.innerText;

            if(searchValue.indexOf(assContact.user_name) > -1){
                classContainer = d;
                assignContact(d)
            }            
        }
    }
    updateAssignedContacts(); //Array mit assignedContacts wird geladen und somit die Fehlermeldung vemieden
}

async function saveEditedBoard(id){
        
        let prioFilled = checkPrio();
        // let correctCategory = checkCorrectCategory();
        let correctContact = checkCorrectContact();
        if (prioFilled == true && correctContact == true){
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