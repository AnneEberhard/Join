let tasks = [
  {
    title: "",
    description: "",
    category: "",
    assignedContacts: [],
    dueDate: "",
    prio: "",
    subtasks: [],
  },
];

let prios = ['urgent', 'medium', 'low'];
let chosenPrio;
let subTasksArray = [];

async function initTask() {
  await includeHTML();
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

function addSubTask() {
  let subTask = document.getElementById("inputSubtask").value;
  document.getElementById("subTasks").innerHTML += /*html*/ `
    <div class="subTaskBox">
        <div class="square"></div>
        <div class="subtask">${subTask}</div>
    </div>`;
  subTasksArray.push(subTask);
  document.getElementById("inputSubtask").value = "";
}

function assignPrio(chosenPrio) {
  capitalPrio = chosenPrio.charAt(0).toUpperCase() + chosenPrio.slice(1);
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
  //create Task
  console.log("createTask");
}
