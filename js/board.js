/** für Drag&Drop  */
let currentDraggedElement;

async function renderBoard() {
    await renderBoardCards();
}

/**
 * 
 * load alle Datas from Backend, delete tasks columns and build new Cards out of loaded Datas
 */
async function renderBoardCards() {
    await loadItems();
    await deleteBoard()
    for (let i = 0; i < tasks.length; i++) {
        createBoardCard(i)
    }
    fillEmptyColumns();
}

/** delete tasks Columns when refreshing Board */
async function deleteBoard() {
    document.getElementById('board_container_bottom_todo').innerHTML = "";
    document.getElementById('board_container_bottom_inprogress').innerHTML = "";
    document.getElementById('board_container_bottom_awaitingfeedback').innerHTML = "";
    document.getElementById('board_container_bottom_done').innerHTML = "";
}

/**
 * creates variabeles for every attribut of the task with id & functions for creating an card for this task
 * 
 * @param {*} id passes index of the task
 */
async function createBoardCard(id) {
    //load position of the card 
    let task = tasks[id];
    let titleCard = task['title'];
    let descriptionCard = task['description'];
    let categoryCard = task['category'];
    let categoryColorCode = determineColorCategory(categoryCard);
    let assignedCard = task['assignedContacts'];
    let prioCard = task['prio'];
    let cats = task['column'];
    let subtaskCard = task['subtasks'];
    let idContainerAssignements = `board_icons_username${id}`;

    renderBoardCard(categoryCard, titleCard, descriptionCard, id, prioCard, cats, categoryColorCode);
    if (subtaskCard.length > 0) {
        createProgressbar(subtaskCard, id)
    };
    createAssignmentIcons(assignedCard, idContainerAssignements);
}

/**
 * 
 * 
 * @param {} category passes category of the task
 * @returns BgColor for the category
 */
function determineColorCategory(category) {
    let colorCode;
    for (let i = 0; i < categories.length; i++) {
        const compareCategory = categories[i].name;
        if (category === compareCategory) {
            colorCode = categories[i].colorCode
        }
    }
    return colorCode
}

/**
 * create template of a taskCard
 * 
 * @param {*} attributes passes attributes of the task to create the template of this taskCard
 */
function renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard, cats, categoryColorCode) {

    let board_todo = document.getElementById(`${cats}`);
    board_todo.innerHTML += /*html*/`
        <div id="${ID}" draggable="true" ondragstart="startDragging(${ID})" 
        onclick="openTaskOverview(${ID}, '${categoryCard}')" class="board_task_container" >
            <div id="innerContainer${ID}" class="board_task_container_inner">
                <div class="board_task_container_category" style="background-color: ${categoryColorCode}">${categoryCard}</div>
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
                        <div class="icons_container" id="board_icons_username${ID}"></div>
                        <div class="board_prio"><img src="../assets/img/${prioCard}.png" /></div>
                    </div>                            
                </div>
            </div>
        </div> 
    `
    if(isMobileDevice()){
    renderMoveBtns(cats, ID);
    }
}



function renderMoveBtns(cats, id){    
        document.getElementById(`${id}`).innerHTML += /*html*/`
            <div class="lastCategory" onclick="moveToLastCat(${cats}, ${id}); stopPropagation(event)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14l5-5 5 5H7z"/></svg></div>
            <div class="nextCategory" onclick="moveToNextCat(${cats}, ${id}); stopPropagation(event)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg></div>
        `
        if(cats == "board_container_bottom_todo"){
            let lastCat = document.getElementById(`${id}`).getElementsByClassName("lastCategory");
            lastCat[0].classList.add("d-none")
        }

        if(cats == "board_container_bottom_done"){
            let lastCat = document.getElementById(`${id}`).getElementsByClassName("nextCategory");
            lastCat[0].classList.add("d-none")
        }
}


function stopPropagation(event) {
    event.stopPropagation();
}


function moveToLastCat(column, id){
    if(column.id == "board_container_bottom_inprogress"){
        newColumn = "board_container_bottom_todo"
    }
    if(column.id == "board_container_bottom_awaitingfeedback"){
        newColumn = "board_container_bottom_inprogress"
    }
    if(column.id == "board_container_bottom_done"){
        newColumn = "board_container_bottom_awaitingfeedback"
    }
    changeTaskColumn(id, newColumn)
}


function moveToNextCat(column, id){
    if(column.id == "board_container_bottom_inprogress"){
        newColumn = "board_container_bottom_awaitingfeedback"
    }
    if(column.id == "board_container_bottom_todo"){
        newColumn = "board_container_bottom_inprogress"
    }
    if(column.id == "board_container_bottom_awaitingfeedback"){
        newColumn = "board_container_bottom_done"
    }
    changeTaskColumn(id, newColumn)
}

// function renderMoveBtns(){

// }

/**
 * creates progresbar for subtasks --> 138 is width of the complete Progressbar
 * @param {*} subtaskCard Array with all subtasks of the task
 * @param {*} id index of the task
 */
function createProgressbar(subtaskCard, id) {
    let tasksNumber = subtaskCard.length;
    let done = countDoneSubtasks(subtaskCard);
    let percentDoneTasks = done / tasksNumber;
    let filledprogressbar = 138 * percentDoneTasks;

    renderProgressBar(filledprogressbar, id);
    renderProgressText(done, tasksNumber, id);
}


function countDoneSubtasks(subtaskCard) {
    let counter = 0;
    for (let s = 0; s < subtaskCard.length; s++) {
        const sub = subtaskCard[s];
        if (sub.subTaskDone == 1) {
            counter++
        }
    }
    return counter
}


/**
 * creates the filled Part of the progressbar
 * @param {*} filledprogressbar fillment of the progressbar in px
 * @param {*} id index of the task
 */
function renderProgressBar(filledprogressbar, id) {
    let progresID = "progressbar" + id;
    document.getElementById(progresID).style = `width: ${filledprogressbar}px`;
}


/**
 * creates the text shich shows how many subtasks of all have been finished
 * @param {*} doneTasksNumbe number of finished subtasksr 
 * @param {*} tasksNumber number of all subtasks
 * @param {*} id index of the task
 */
function renderProgressText(doneTasksNumber, tasksNumber, id) {
    let progresTextID = "progressbarText" + id;
    document.getElementById(progresTextID).innerHTML = /*html*/`
        ${doneTasksNumber}/${tasksNumber} Done
    `
}


/**
 * 
 * @param {*} assignedCard passes Array with names of the editors of the task
 * @param {*} id   passes id of the boardcard
 */
function createAssignmentIcons(assignedCard, idContainer) {
    for (let i = 0; i < assignedCard.length; i++) {
        const assignedUser = assignedCard[i].user_name;

        if(i < 5){
        for (let k = 0; k < contacts.length; k++) {
            const contact = contacts[k];
            renderAssignmentIcons(assignedUser, contact, idContainer)
        }
    }
    }
}


/**
 * compare if assignedUser is an contactand creates the IconCircle
 * @param {*} assignedUser user who is working on task  
 * @param {*} contact contact from the contact list
 * @param {*} idContainer 
 */
function renderAssignmentIcons(assignedUser, contact, idContainer) {
    if (assignedUser === contact.user_name) {

        let acronym = createAcronym(assignedUser);
        let newCircle = document.createElement('div');
        newCircle.classList.add('board_Icons_Username');
        newCircle.style.backgroundColor = getColor(assignedUser);
        newCircle.innerHTML = acronym;
        newCircle.title = assignedUser;

        let username = document.getElementById(idContainer);
        username.appendChild(newCircle);
    }
}


/**
 * 
 * @param {*} assignedUser User who is working on the task 
 * @returns color of the user in contact list
 */
function getColor(assignedUser) {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        if (contact.user_name === assignedUser) {
            return contact.color
        }
    }
}


/**
 * searching function, to show task who hast the searched word in title 
 */
function searchTasksOnBoard() {
    let searchedTask = document.getElementById('board_input').value.toUpperCase();
    let searchingElements = document.getElementsByClassName('board_task_container_title');

    for (let p = 0; p < searchingElements.length; p++) {
        let title = searchingElements[p];
        searchValue = title.textContent || title.innerText;
        if (searchValue.toUpperCase().indexOf(searchedTask) > -1) {
            searchingElements[p].parentElement.parentElement.parentElement.style.display = "flex";
        } else {
            searchingElements[p].parentElement.parentElement.parentElement.style.display = "none";
        }
    }
}


function searchTasksOnBoardMobile() {
    let searchedTask = document.getElementById('board_input_mobile').value.toUpperCase();
    let searchingElements = document.getElementsByClassName('board_task_container_title');

    for (let p = 0; p < searchingElements.length; p++) {
        let title = searchingElements[p];
        searchValue = title.textContent || title.innerText;
        if (searchValue.toUpperCase().indexOf(searchedTask) > -1) {
            searchingElements[p].parentElement.parentElement.parentElement.style.display = "flex";
        } else {
            searchingElements[p].parentElement.parentElement.parentElement.style.display = "none";
        }
    }
}


/**
 * Drag and Drop functions
 * 
 */

function startDragging(id) {
    currentDraggedElement = id;
    let draggedCard = document.getElementById(currentDraggedElement);
}

function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(category) {
    let targetContainer = document.getElementById(category);
    let draggedCard = document.getElementById(currentDraggedElement); //ID
    targetContainer.appendChild(draggedCard);
    targetContainer.style.backgroundColor = '';
    changeTaskColumn(currentDraggedElement, category)
}


async function changeTaskColumn(taskIndex, newColumn) {
    if (taskIndex >= 0 && taskIndex < tasks.length) {
        tasks[taskIndex].column = newColumn;
        await saveTask();
        renderBoard();
    }
}


function highlight(event) {
    event.preventDefault();
    let targetContainer = event.target;
    targetContainer.style.backgroundColor = 'white';
}


function removeHighlight(event) {
    event.preventDefault();
    let targetContainer = event.target;
    targetContainer.style.backgroundColor = '';
}


/**
 * add "NoTasks Container" to empty columns
 */
function fillEmptyColumns() {
    var columnsToCheck = [
        "board_container_bottom_todo",
        "board_container_bottom_inprogress",
        "board_container_bottom_awaitingfeedback",
        "board_container_bottom_done"
    ];

    for (let c = 0; c < columnsToCheck.length; c++) {
        const column = columnsToCheck[c];
        let isEmpty = isDivEmpty(column)
        if(isEmpty){
            document.getElementById(column).innerHTML = /*html*/`
                <div class="emptyColumnContainer">No Tasks</div>
            `
        }
    }
}


/**
 * 
 * @param {*} checkedColumn 
 * @returns true if div is empty or undefined is
 */
function isDivEmpty(checkedColumn) {
    let div = document.getElementById(checkedColumn);
    return !div || div.innerHTML.trim() === "";
}


/**
 * 
 * @returns breakpoint, when screen is in mobile Modus
 */
function isMobileDevice() {
    return window.innerWidth < 900;
}




/**
 * Eventlistner to render board if screen changes between desktop and MobileMode
 */
window.addEventListener('resize', handleScreenResize);


function handleScreenResize() {
    if (window.innerWidth < 900 && window.location.pathname === '/board.html') {
        renderBoard();
    } else if (window.innerWidth >= 900 && window.location.pathname === '/board.html') {
        renderBoard();
    }
}