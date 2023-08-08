let currentDraggedElement;
let tasksInBoard;
let boardTasksInProgress = 0;
let boardAwaitingFeedbacks = 0;
let boardToDos = 0;
let boardDones = 0;

async function renderBoard() {
    await saveTasks();
    await renderBoardCards(); 
    
}


async function renderBoardCards() {
    await loadItems();
    await deleteBoard()
    for (let i = 0; i < tasks.length; i++) {
        createBoardCard(i)
    }
}

async function deleteBoard(){
    document.getElementById('board_container_bottom_todo').innerHTML = "";
    document.getElementById('board_container_bottom_inprogress').innerHTML = "";
    document.getElementById('board_container_bottom_awaitingfeedback').innerHTML = "";
    document.getElementById('board_container_bottom_done').innerHTML = "";
}


async function createBoardCard(i) {
    //load position of the card
    let ID = i;   
    let task = tasks[i];
    let titleCard = task['title'];
    let descriptionCard = task['description'];
    let categoryCard = task['category'];
    let categoryColorCode = determineColorCategory(categoryCard);
    let assignedCard = task['assignedContacts'];
    let prioCard = task['prio'];

    //verschieben
   
    let cats = task['column'];
    console.log(cats) 

    let subtaskCard = task['subtasks'];
    let idContainerAssignements = `board_icons_username${ID}`;

    renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard, cats, categoryColorCode);
    if (subtaskCard.length > 0) {
        createProgressbar(subtaskCard, ID)
    };
    createAssignmentIcons(assignedCard, idContainerAssignements);
    tasksInBoard++;
    // console.log(tasksInBoard)
    addToCounter(cats);
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


function addToCounter(cats){
    if(cats === 'board_container_bottom_inprogress'){        
        boardTasksInProgress ++;   
    }
    if(cats === 'board_container_bottom_todo'){        
        boardToDos ++;    
        console.log(boardToDos)    
    }
    if(cats === 'board_container_bottom_awaitingfeedback'){        
        boardAwaitingFeedbacks ++;        
    }
    if(cats === 'board_container_bottom_done'){        
        boardDones ++;        
    }
}


function renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard, cats, categoryColorCode) {
    
    let board_todo = document.getElementById(`${cats}`);
    board_todo.innerHTML += /*html*/`
        <div id="${ID}" draggable="true" ondragstart="startDragging(${ID})" onclick="openTaskOverview(${ID}, '${categoryCard}')" class="board_task_container" >
            <div class="board_task_container_inner">
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
        const assignedUser = assignedCard[i].user_name;

        for (let k = 0; k < contacts.length; k++) {
            const contact = contacts[k];

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
    }
}


function getColor(assignedUser) {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        if (contact.user_name === assignedUser) {
            return contact.color
        }
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
    let draggedCard = document.getElementById(currentDraggedElement); //ID
    targetContainer.appendChild(draggedCard);
    targetContainer.style.backgroundColor = '';

    console.log(category);
    console.log(currentDraggedElement);    
    
        changeTaskColumn(currentDraggedElement, category)
}


async function changeTaskColumn(taskIndex, newColumn) {
    if (taskIndex >= 0 && taskIndex < tasks.length) {
      tasks[taskIndex].column = newColumn;
      await saveTask(); // Speichern der Aufgaben, falls nötig
    } else {
      console.error('Ungültiger Index für Aufgabe.');
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


// Speichere die Werte auf dem Server
async function saveTasks() {
    await setItem("tasksInBoard", JSON.stringify(tasksInBoard));
    await setItem("tasksInProgress", tasksInProgress);
    await setItem("awaitingFeedback", awaitingFeedback);
    await setItem("toDo", toDo);
    await setItem("done", done);
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





