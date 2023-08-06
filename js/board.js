let currentDraggedElement;
let tasksInBoard;
let tasksInProgress;
let awaitingFeedback;
let toDo;
let done;

async function renderBoard() {
    await saveTasks();
    await renderBoardCards();
    countTasks();
}


async function renderBoardCards() {
    await loadItems();
    for (let i = 0; i < tasks.length; i++) {
        createBoardCard(i)
    }
}


async function createBoardCard(i) {
    //load position of the card
    let ID = i;
    let cat = await assignCategory(ID);
    let task = tasks[i];
    let titleCard = task['title'];
    let descriptionCard = task['description'];
    let categoryCard = task['category'];
    let categoryColorCode = `colorCategory${determineColorCategory(categoryCard)}`;
    let assignedCard = task['assignedContacts'];
    let prioCard = task['prio'];
    let subtaskCard = task['subtasks'];
    let idContainerAssignements = `board_icons_username${ID}`;    

    renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard, cat, categoryColorCode);
    if (subtaskCard.length > 0) {
        createProgressbar(subtaskCard, ID)
    };
    createAssignmentIcons(assignedCard, idContainerAssignements);
}


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


async function assignCategory(id) {
    try {
        let cat = await loadCategory(id);
        return cat
    } catch {
        let cat = "board_container_bottom_todo"
        return cat
    }
}


function renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard, cat, categoryColorCode) {
    let board_todo = document.getElementById(`${cat}`);
    board_todo.innerHTML += /*html*/`
        <div id="${ID}" draggable="true" ondragstart="startDragging(${ID})" onclick="openTaskOverview(${ID})" class="board_task_container" >
            <div class="board_task_container_inner">
                <div class="board_task_container_category ${categoryColorCode}">${categoryCard}</div>
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
}


function createProgressbar(subtaskCard, id) {
    let tasksNumber = subtaskCard.length;
    let doneTasksNumber = (tasksNumber / 2).toFixed(0)        //nur zu Testzwecken ist die Hälfte der Aufgaben erfüllt
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

/**
 * Noch aufhübschen und entschlacken
 * @param {*} assignedCard passes Array with names of the editors of the task
 * @param {*} id   passes id of the boardcard
 */
function createAssignmentIcons(assignedCard, idContainer) {


    for (let i = 0; i < assignedCard.length; i++) {
        const assiggned = assignedCard[i].user_name;

        let acronym = createAcronym(assiggned); //erstellt zwei Buchstaben

        const randColor = () => {
            return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
        }

        let newCircle = document.createElement('div');
        newCircle.classList.add('board_Icons_Username');
        newCircle.style.backgroundColor = randColor();
        // newCircle.setAttribute('id', `icon_circle_${id}_${i}`);

        newCircle.innerHTML = acronym;


        let username = document.getElementById(idContainer);

        username.appendChild(newCircle);


        newCircle.innerHTML = acronym;
    }
}


function startDragging(id) {
    currentDraggedElement = id;
}


function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(category) {
    let targetContainer = document.getElementById(category);
    let draggedCard = document.getElementById(currentDraggedElement);
    targetContainer.appendChild(draggedCard);
    targetContainer.style.backgroundColor = '';
    saveCat = "saveTask" + currentDraggedElement;
    console.log(saveCat);
    await saveCategory(saveCat, category);
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
 * Save and load just a String, so don' need JSON.stringify and parse
 * 
 * @param {*} savedCategory passes the actually category of the TaskCard 
 */
async function saveCategory(saveCat, savedCategory) {
    await setItem(saveCat, savedCategory);
}

async function loadCategory(id) {
    let cat = "saveTask" + id;
    return (await getItem(cat));
}



async function countTasks() {
    tasksInBoard = document.getElementsByClassName('board_task_container');
    let tib = tasksInBoard.length;
    // tasksInProgress = document.getElementById('board_container_bottom_inprogress').getElementsByClassName('board_task_container').length;
    // awaitingFeedback = document.getElementById('board_container_bottom_awaitingfeedback').getElementsByClassName('board_task_container').length;
    // toDo = document.getElementById('board_container_bottom_todo').getElementsByClassName('board_task_container').length;
    // done = document.getElementById('board_container_bottom_done').getElementsByClassName('board_task_container').length;
    // await saveTasks();
    console.log(tasksInBoard)
    console.log(tib)
}

// Speichere die Werte auf dem Server
async function saveTasks() {
    await setItem("tasksInBoard", JSON.stringify(tasksInBoard));
    // await setItem("tasksInProgress", tasksInProgress);
    // await setItem("awaitingFeedback", awaitingFeedback);
    // await setItem("toDo", toDo);
    // await setItem("done", done);
}


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


function openAddTask() {
    window.location.href = "add_task.html";
}



