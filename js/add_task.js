let tasks = [];
let categories = ['Sales', 'Backoffice']
let prios = ['urgent', 'medium', 'low'];
let assignedPrio;
let subTasksArray = [];

async function initTask() {
  await includeHTML();
  renderCategories();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function renderCategories() {
    
}

function addSubTask() {
  let subTask = document.getElementById("inputSubtask").value;
  subTasksArray.push(subTask);
  let index = findIndexOfItem (subTasksArray, subTask);
  document.getElementById("subTasks").innerHTML += /*html*/ `
    <div class="subTaskBox">
        <div id="checkBox${index}" class="checkBox" onclick="addCheck(${index})"></div>
        <div class="subtask">${subTask}</div>
    </div>`;
  document.getElementById("inputSubtask").value = "";
}

function findIndexOfItem (array, item) {
    return array.indexOf(item);
}

function addCheck(index) {
    document.getElementById(`checkBox${index}`).innerHTML = /*html*/ `<img src="../assets/img/done-30.png">`;
}

function assignPrio(chosenPrio) {
  let capitalPrio = chosenPrio.charAt(0).toUpperCase() + chosenPrio.slice(1);
  assignedPrio = chosenPrio;
  for (let i = 0; i < prios.length; i++) {
    const prio = prios[i];
    prioBox = document.getElementById(`${prio}`);
    capitalPrio = prio.charAt(0).toUpperCase() + prio.slice(1);
     if (prio === chosenPrio && prioBox.classList.contains(prio) === false) {
        prioBox.classList.add(`${prio}`);
        prioBox.innerHTML = `${capitalPrio} <img src="../assets/img/${prio}_white.png" />`;
    } else {
        prioBox.classList.remove(`${prio}`);
        prioBox.innerHTML = `${capitalPrio} <img src="../assets/img/${prio}.png" />`;
    }
  }
}

function clearTask() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("contactToAssign").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("inputSubtask").value = "";
  document.getElementById("subTasks").innerHTML = "";
  document.getElementById("urgent").classList.remove("urgent");
  document.getElementById("medium").classList.remove("medium");
  document.getElementById("low").classList.remove("low");
  renderPrio();
  chosenPrio = "";
  subTasksArray = [];
}

function renderPrio() {
    document.getElementById("prioContainer").innerHTML = /*html*/`
    <button id="urgent" type="button" onclick="assignPrio('urgent')" class="prio height51">
      Urgent <img src="../assets/img/urgent.png" />
    </button>
    <button id="medium" type="button" onclick="assignPrio('medium')" class="prio height51">
      Medium <img src="../assets/img/medium.png" />
    </button>
    <button id="low" type="button" onclick="assignPrio('low')" class="prio height51">
      Low <img src="../assets/img/low.png" />
    </button>`;
}

function createTask() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let taskCategory = document.getElementById("taskCategory").value;
    let dueDate = document.getElementById("dueDate").value;
    let task = {
        'title': title,
        'description': description,
        'category': taskCategory,
        'assignedContacts': [],
        'dueDate': dueDate,
        'prio': assignedPrio,
        'subtasks': subTasksArray,
          }
    tasks.push(task);
    saveTask();
}

function saveTask() {
    //save to Server
}