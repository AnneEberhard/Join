//these will come from server and will need to be saved at the end
let tasks = [];
let categories = [
  {'name': 'New category', 'colorCode': 0},
  {'name': 'Backoffice', 'colorCode': 1},
  {'name': 'Design', 'colorCode': 2},
  {'name': 'Media', 'colorCode': 3},
  {'name': 'Sales', 'colorCode': 4},];
let contacts = ['Anton Mayer', 'Anja Schulz'];
let freeColors = [6,7,8,9];

//these are needed for the site to function
let prios = ['urgent', 'medium', 'low'];
let newCategoryName;
let newCategoryColor;

//these are needed to fill task
let assignedCategory;
let assignedContacts = [];
let assignedContactsStatus = new Array(contacts.length).fill(false);
//an array as long as contacts is on default filled with false
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
  document.getElementById("newCategoryDotsContainer").innerHTML = "";
  document.getElementById('category').innerHTML = /*html*/`<div id="categorySelection" class="selection">
  <p>Select task category</p>
  <img src="assets/img/down-30.png" class="hover dropdown" onclick="toggleOptions('categoryOptions')"/>
</div>
<div class="hidden" id="categoryOptions"></div>
</div>`;
renderCategoryOptions();
resetCategories();
}

function renderCategoryOptions() {
  document.getElementById('categoryOptions').innerHTML = '';
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]['name'];
    if (i==0) {
      document.getElementById('categoryOptions').innerHTML += templateCategoryOptionsFirst(category,i);
    } else {
    document.getElementById('categoryOptions').innerHTML += templateCategoryOptionsFurther(category,i);}
  }
}

function templateCategoryOptionsFirst(category, i) {
  let templateCategoryOptionsFirst = /*html*/ `  
  <div id="category${i}" class="option" onclick="addNewCategory()">
  <div>${category}</div></div>
</div>`;
  return templateCategoryOptionsFirst;
}

function templateCategoryOptionsFurther(category,i) {
  let templateCategoryOptionsFurther = /*html*/`
  <div id="category${i}" class="option" onclick="selectCategory(${i})">
  <div>${category}</div>
  <div class="circle colorCategory${i}"></div>
</div>`;
  return templateCategoryOptionsFurther;
}

function toggleOptions(id) {
  const optionsDiv = document.getElementById(`${id}`);
  optionsDiv.classList.toggle('hidden');
}

function selectCategory(i) {
  const category = categories[i]['name'];
  assignedCategory = category;
 document.getElementById('categorySelection').innerHTML = templateSelectedCategory(i, category);
  toggleOptions('categoryOptions');
}

function templateSelectedCategory(i, category) {
  let templateSelectedCategory = /*html*/ `  
  <div class='selectedCategoryBox'>
    <div id="category${i}" class="selectedCategory" onclick="selectCategory(${i})">
      <div>${category}</div>
      <div class="circle colorCategory${i}"></div>
    </div>
    <img src="assets/img/down-30.png" class="hover dropdown" onclick="toggleOptions('categoryOptions')"/>
 </div>`;
 return templateSelectedCategory;
}

function resetCategories () {
 newCategoryName = '';
newCategoryColor = '';
}

function addNewCategory() {
  document.getElementById('categorySelection').innerHTML = templateCreateNewCategory();
  document.getElementById('newCategoryDotsContainer').innerHTML = `<div id="newCategoryDots"></div>`;
  for (let i = 0; i < freeColors.length; i++) {
    document.getElementById('newCategoryDots').innerHTML += templateNewCategoryDots(i);
  }
  toggleOptions('categoryOptions');
}

function templateCreateNewCategory() {
 let templateCreateNewCategory = /*html*/ `  <div class='selectedCategoryBox'>
 <div  class="selectedCategory">
   <input id="newCategoryName" onkeydown="checkIfNewCategoryReady()" placeholder="New category name">
 </div>
 <div class="iconsNewCategory">
 <img src="assets/img/x.png" class="hover" onclick="renderCategories()"/>
 <div class="dividerSmall"></div>
 <img src="assets/img/done-30.png" id="addCategory" />
</div>
</div>`;
 return templateCreateNewCategory;
}

function templateNewCategoryDots(i) { 
  let colorCode = freeColors[i];
  let templateNewCategoryDots = /*html*/ `
    <div class="circle colorCategory${colorCode} hover" id="newCategoryDot${i}" onclick="addColor(${i})"></div>`;
  return templateNewCategoryDots;
}


function checkIfNewCategoryReady() {
  newCategoryName = document.getElementById('newCategoryName').value;
  if (newCategoryName !== '' && newCategoryColor !== null) {
    const addCategoryButton = document.getElementById('addCategory');
    addCategoryButton.addEventListener('click', addCategory);
    addCategoryButton.classList.add('hover');
  }
}

function addColor(i) {
  newCategoryColor = freeColors[i];
  for (let j = 0; j < freeColors.length; j++) {
      document.getElementById(`newCategoryDot${j}`).classList.remove('selected');
  }
  document.getElementById(`newCategoryDot${i}`).classList.add('selected');
  checkIfNewCategoryReady();
}

function addCategory() {
  const newCategoryObject = { 'name': newCategoryName, 'colorCode': newCategoryColor };
  categories.push(newCategoryObject);
  const indexToRemove = freeColors.indexOf(newCategoryColor);
if (indexToRemove !== -1) {
  freeColors.splice(indexToRemove, 1);
}
renderCategories();
}


function renderContacts() {
  document.getElementById('contactsOptions').innerHTML = '';
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    document.getElementById('contactsOptions').innerHTML += /*html*/`
      <div class="option contactList">
        <div id="contact${i}">${contact}</div>
        <div class="checkBox hover" id="contactCheckBox${i}" onclick="checkContact(${i})"></div>
      </div>`;
  }
}

function checkContact(i) {
  if (assignedContactsStatus[i]==false) {
    assignContact(i);
  } else {
    unassignContact(i);
  }
  updateAssignedContacts();
}

function assignContact(i) {
  document.getElementById(`contactCheckBox${i}`).innerHTML = /*html*/`
    <div class="checkBoxChecked hover"></div>
  </div>`;
  assignedContactsStatus[i] = true; 
  }

function unassignContact(i) {
  document.getElementById(`contactCheckBox${i}`).innerHTML = /*html*/``;
  assignedContactsStatus[i] = false; 
}

function updateAssignedContacts() {
  assignedContacts = [];
  for (let i = 0; i < assignedContactsStatus.length; i++) {
    const contact = contacts[i];
    const assignedStatus = assignedContactsStatus[i];
    if (assignedStatus==true) {
      assignedContacts.push(contact);
    }
  }
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


function clearTask() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("categoryOptions").innerHTML = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("inputSubtask").value = "";
  document.getElementById("subTasks").innerHTML = "";
  document.getElementById("urgent").classList.remove("urgent");
  document.getElementById("medium").classList.remove("medium");
  document.getElementById("low").classList.remove("low");
  renderCategories();
  renderContacts();
  renderPrio();
  chosenPrio = "";
  subTasksArray = [];
}


function createTask(event) {
  event.preventDefault();
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let dueDate = document.getElementById("dueDate").value;
  let task = {
      'title': title,
      'description': description,
      'category': assignedCategory,
      'assignedContacts': assignedContacts,
      'dueDate': dueDate,
      'prio': assignedPrio,
      'subtasks': subTasksArray,
        }
    tasks.push(task);
    console.log(task);
    saveTask();
}

function saveTask() {
  //save to Server
  // tasks;
  // categories;
  // freeColors;
}