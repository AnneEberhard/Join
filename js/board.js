let currentDraggedElement;
let tasksInBoard;
let tasksInProgress;
let awaitingFeedback;
let toDo;
let done;


async function renderBoard(){
    await createBoardCard();
    countTasks();
    saveTasks();
}

async function createBoardCard() {
    await loadItems();
    //load position of the card
    let cat = await loadCategory();     
    let ID = 1;
    let task = tasks[0];
    let titleCard = task['title'];
    let descriptionCard = task['description'];
    let categoryCard = task['category'];
    let assignedCard = task['assignedContacts'];
    let prioCard = task['prio'];
    let subtaskCard = task['subtasks'];

    renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard, cat);

    if (subtaskCard.length > 0) {
        createProgressbar(subtaskCard, ID)
    };
    createAssignmentIcons(assignedCard, ID);
}


function renderBoardCard(categoryCard, titleCard, descriptionCard, ID, prioCard, cat) {
    let board_todo = document.getElementById(`${cat}`);
    board_todo.innerHTML += /*html*/`
        <div id="${ID}" draggable="true" ondragstart="startDragging(${ID})" class="board_task_container">
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


function createAssignmentIcons(assignedCard, id) {

    for (let i = 0; i < assignedCard.length; i++) {
        const assiggned = assignedCard[i];

        let acronym = createAcronym(assiggned); //erstellt zwei Buchstaben

        const randColor = () => {
            return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
        }

        let newCircle = document.createElement('div');
        newCircle.classList.add('board_Icons_Username');
        newCircle.style.backgroundColor = randColor();
        // newCircle.setAttribute('id', `icon_circle_${id}_${i}`);
        
        newCircle.innerHTML = acronym;
        

        let username = document.getElementById(`board_icons_username${id}`);
        
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
    await saveCategory(category);
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
async function saveCategory(savedCategory){
    await setItem("savedCategory", savedCategory);
}

async function loadCategory(){    
    return (await getItem("savedCategory"));      
}



async function countTasks(){
    tasksInBoard = document.getElementsByClassName('board_task_container').length;
    tasksInProgress = document.getElementById('board_container_bottom_inprogress').getElementsByClassName('board_task_container').length;
    awaitingFeedback = document.getElementById('board_container_bottom_awaitingfeedback').getElementsByClassName('board_task_container').length;
    toDo = document.getElementById('board_container_bottom_todo').getElementsByClassName('board_task_container').length;
    done = document.getElementById('board_container_bottom_done').getElementsByClassName('board_task_container').length;
    await saveTasks();
    console.log("Board: ", tasksInBoard);
    console.log("progress: ", tasksInProgress);
    console.log("awaiting: ", awaitingFeedback);
    console.log("todo: ", toDo);
    console.log("done: ", done);
}


async function saveTasks() {  
    // Speichere die Werte auf dem Server
    await setItem("tasksInBoard", tasksInBoard);
    await setItem("tasksInProgress", tasksInProgress);
    await setItem("awaitingFeedback", awaitingFeedback);
    await setItem("toDo", toDo);
    await setItem("done", done);
  }

function openAddTask(){
    window.location.href = "add_task.html";
}


function searchTasksOnBoard() {
    let searchedTask = document.getElementById('board_input').value.toUpperCase();
    let searchingArea = document.getElementById("board_container_bottom_category");
    let searchingElements = searchingArea.getElementsByClassName('pokemonName');

    for (let p = 0; p < searchingElements.length; p++) {
        let pokemon = searchingElements[p];
        searchValue = pokemon.textContent || pokemon.innerText;
        if (searchValue.toUpperCase().indexOf(searchedPokemon) > -1) {
            searchingElements[p].parentElement.style.display = "flex";
        } else {
            searchingElements[p].parentElement.style.display = "none";
        }
    }
}
