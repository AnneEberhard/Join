let tasks = [];
let prios = ['urgent', 'medium', 'low'];
//let categ = ['New category','Backoffice', 'Design', 'Marketing', 'Media', 'Sales'];
let categories = [
  {'name': 'New category', 'colorCode': 0},
  {'name': 'Backoffice', 'colorCode': 1},
  {'name': 'Design', 'colorCode': 2},
  {'name': 'Media', 'colorCode': 3},
  {'name': 'Sales', 'colorCode': 4},
];
let contacts = ['Anton Mayer', 'Anja Schulz'];
let assignedPrio;
let subTasksArray = [];

async function initTask() {
  await includeHTML();
  renderCategories();
  renderContacts();
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
  document.getElementById('categoryOptions').innerHTML = '';
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]['name'];
    if (i==0) {
      document.getElementById('categoryOptions').innerHTML += /*html*/`
      <div id="category${i}" class="option" onclick="addNewCategory()">
      <div>${category}</div></div>
    </div>`;
    } else {
    document.getElementById('categoryOptions').innerHTML += /*html*/`
  <div id="category${i}" class="option" onclick="selectCategory(${i})">
  <div>${category}</div>
  <div class="circle colorCategory${i}"></div>
</div>`;}
  }
}

function renderContacts() {
  document.getElementById('contactsOptions').innerHTML = '';
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    document.getElementById('contactsOptions').innerHTML += /*html*/`
  <div id="contact${i}" class="options contactList">
  <div>${contact}</div>
  <div class="checkBox hover" id="contactCheckBox${i}" onclick="assignContact(${i})"></div>
</div>`;
  }
}

function assignContact(i) {
console.log('contactCheckBox', i)
}

function toggleOptions(id) {
  const optionsDiv = document.getElementById(`${id}`);
  optionsDiv.classList.toggle('hidden');
}

function selectCategory(i) {
  const category = categories[i]['name'];
 document.getElementById('selection').innerHTML = templateSelectedCategory(i, category);
  toggleOptions('categoryOptions');
}

function templateSelectedCategory(i, category) {
  let templateSelectedCategory = /*html*/ `  
  <div class='selectedCategoryBox'>
    <div id="category${i}" class="selectedCategory" onclick="selectCategory(${i})">
      <div>${category}</div>
      <div class="circle colorCategory${i}"></div>
    </div>
    <img src="assets/img/down-30.png" onclick="toggleOptions('categoryOptions')"/>
 </div>`;
 return templateSelectedCategory;
}

function addNewCategory() {
  document.getElementById('selection').innerHTML = templateCreateNewCategory();
  document.getElementById('newCategoryDotsContainer').innerHTML = templateNewCategoryDots();
  toggleOptions('categoryOptions');
}

function templateCreateNewCategory() {
 let templateCreateNewCategory = /*html*/ `  <div class='selectedCategoryBox'>
 <div  class="selectedCategory">
   <input id="newCategoryName" placeholder="New category name">
 </div>
 <div class="iconsNewCategory">
 <img src="assets/img/x.png" onclick="clearCategory()"/>
 <div class="dividerSmall"></div>
 <img src="assets/img/done-30.png" onclick="addCategory()"/>
</div>
</div>`;
 return templateCreateNewCategory;
}

function templateNewCategoryDots() {
  let templateNewCategoryDots = /*html*/ `<div class="newCategoryDots">
    <div class="circle colorCategory6 hover" onclick="addColor(6)"></div>
    <div class="circle colorCategory7 hover" onclick="addColor(7)"></div>
    <div class="circle colorCategory8 hover" onclick="addColor(8)"></div>
    <div class="circle colorCategory9 hover" onclick="addColor(9)"></div>
    <div class="circle colorCategory3 hover" onclick="addColor(3)"></div>
  </div>`;
  return templateNewCategoryDots;
}

function clearCategory() {
  console.log('clear Category');
}

function addCategory() {
  console.log('add Category');
}

function addColor() {
  console.log('add Color');
}

function addSubTask() {
  let subTask = document.getElementById("inputSubtask").value;
  subTasksArray.push(subTask);
  let index = findIndexOfItem (subTasksArray, subTask);
  document.getElementById("subTasks").innerHTML += /*html*/ `
    <div class="subTaskBox">
        <div id="checkBox${index}" class="checkBox hover" onclick="addCheck(${index})"></div>
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