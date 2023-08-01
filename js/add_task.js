//these will come from server and will need to be saved at the end
// if loadItems and save() are enabled, delete these
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
let inputDone = false; //use as safety for priority and category

//these are needed to fill task
let assignedCategory;
let assignedContacts = [];
let assignedContactsStatus = new Array(contacts.length).fill(false);
//an array as long as contacts is on default filled with false
let assignedPrio;
let subTasksArray = [];

async function initTask() {
  await includeHTML();
  //await loadItems();
  renderCategories();
  renderContacts();
  renderDueDate();
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

async function loadItems() {
  await getItem("tasks"); 
  await getItem("contacts"); 
  await getItem("categories"); 
  await getItem("freeColors"); 
}

function renderCategories() {
  document.getElementById("newCategoryDotsContainer").innerHTML = "";
  document.getElementById('category').innerHTML = templateCategory();
  renderCategoryOptions();
  resetCategories();
}

function templateCategory() {
  let templateCategory = /*html*/`
  <div class="inputWithList">
  <input id="categorySelection" class="selection" required placeholder="Select task category">
 <div id="categorySelectionCircle"></div> 
 <div id="categorySelectionLeft"></div>
 <div id="dividerSmall"></div>
 <div id="categorySelectionRight">
  <img src="assets/img/dropdown.svg" class="hover" onclick="toggleOptions('categoryOptions')"/>
 </div>
</div>
<div class="hidden roundedBorder" id="categoryOptions"></div>
</div>`;
  return templateCategory;
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
//  document.getElementById('contactAlert').innerHTML='';
}

function selectCategory(i) {
  const category = categories[i]['name'];
  assignedCategory = category;
  document.getElementById('categorySelection').value = category;
  document.getElementById('categorySelectionCircle').innerHTML = /*html*/ `
  <div class="circle colorCategory${i}"></div>`;
  toggleOptions('categoryOptions');
}

function resetCategories () {
 newCategoryName = '';
  newCategoryColor = '';
}

function addNewCategory() {
  document.getElementById('categorySelection').value='';
  document.getElementById('categorySelection').setAttribute('placeholder', 'New category Name');
  document.getElementById('categorySelection').setAttribute('onkeydown', 'checkIfNewCategoryReady()');
  document.getElementById('categorySelectionCircle').innerHTML = '';
  document.getElementById('categorySelectionLeft').innerHTML = templateCategorySelectionLeft();
  document.getElementById('dividerSmall').innerHTML = templatedividerSmall();
  document.getElementById('categorySelectionRight').innerHTML = templateCategorySelectionRight();
  document.getElementById('newCategoryDotsContainer').innerHTML = `<div id="newCategoryDots"></div>`;
  for (let i = 0; i < freeColors.length; i++) {
    document.getElementById('newCategoryDots').innerHTML += templateNewCategoryDots(i);
  }
  toggleOptions('categoryOptions');
}

function templateCategorySelectionLeft() {
  let templateCategorySelectionLeft = `
  <img src="assets/img/iconoir_cancel.svg" class="hover" onclick="renderCategories()"/>`;
  return templateCategorySelectionLeft;
}

function templatedividerSmall() {
  let templatedividerSmall = `<div class="dividerSmall"></div>`;
  return templatedividerSmall;
}

function templateCategorySelectionRight() {
  let templateCategorySelectionRight = `
  <img src="assets/img/done-30.png" class="iconsNewCategory" id="addCategory" />`;
  return templateCategorySelectionRight;
}

function templateNewCategoryDots(i) { 
  let colorCode = freeColors[i];
  let templateNewCategoryDots = /*html*/ `
    <div class="circle colorCategory${colorCode} hover" id="newCategoryDot${i}" onclick="addColor(${i})"></div>`;
  return templateNewCategoryDots;
}

function checkIfNewCategoryReady() {
  newCategoryName = document.getElementById('categorySelection').value;
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
  let lastItem = categories.length -1;
  const indexToRemove = freeColors.indexOf(newCategoryColor);
if (indexToRemove !== -1) {
  freeColors.splice(indexToRemove, 1);
}
  renderCategories();
  selectCategory(lastItem);
  toggleOptions('categoryOptions');
}

function renderContacts() {
  document.getElementById('contactContainer').innerHTML = templateContactSelection();
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    document.getElementById('contactsOptions').innerHTML += templateContactsOptions(contact, i);
  }
  document.getElementById('contactsOptions').innerHTML += templateNewContact();
}

function templateContactSelection() {
  let templateContactSelection = /*html*/`
  <div class="inputWithList">
  <input id="contactSelection" class="selection" required disabled placeholder="Select contacts to assign">
  <img src="assets/img/dropdown.svg" class="hover" onclick="toggleOptions('contactsOptions')"/>
  </div>
  <div class="hidden roundedBorder" id="contactsOptions"></div>`;
  return templateContactSelection;
}

function templateContactsOptions(contact,i) {
  let templateContactsOptions = /*html*/`
  <div class="option contactList">
    <div id="contact${i}">${contact}</div>
    <div class="checkBox hover" id="contactCheckBox${i}" onclick="checkContact(${i})"></div>
  </div>`;
  return templateContactsOptions;
}

function templateNewContact() {
  let templateNewContact = /*html*/`
  <div class="option contactList">
    <div id="newContact">Invite new contact</div>
    <div class="newContact roundedBorder"><img src="assets/img/Icon_Contacts_white.png" onclick="inviteContact()"></div>
  </div>`;
  return templateNewContact;
}

function checkContact(i) {
  debugger;
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
  document.getElementById('contactAlert').innerHTML = '';
  for (let i = 0; i < assignedContactsStatus.length; i++) {
    const contact = contacts[i];
    const assignedStatus = assignedContactsStatus[i];
    if (assignedStatus == true) {
      assignedContacts.push(contact);
    }
  }
  if (!assignedContacts.includes(true)) {
    document.getElementById('contactSelection').removeAttribute('required');
  } else {
    document.getElementById('contactSelection').setAttribute('required', 'true');
  }
}

// MISSING link to contact page
function inviteContact() {
  console.log('invite new contact');
}

function renderDueDate() {
  let currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  document.getElementById('dueDate').setAttribute('min', `${year}-${month}-${day}`);
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
  document.getElementById('prioAlert').innerHTML ='';
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
    document.getElementById(`checkBox${index}`).innerHTML = /*html*/ `<img src="assets/img/done-30.png">`;
}


function clearTask() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("categoryOptions").innerHTML = "";
  document.getElementById("categoryAlert").innerHTML = "";
  document.getElementById("contactAlert").innerHTML = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("inputSubtask").value = "";
  document.getElementById("subTasks").innerHTML = "";
  document.getElementById("urgent").classList.remove("urgent");
  document.getElementById("medium").classList.remove("medium");
  document.getElementById("low").classList.remove("low");
  document.getElementById("popupNotice").classList.remove("visible");
  renderCategories();
  renderContacts();
  renderPrio();
  assignedPrio = "";
  subTasksArray = [];
}


function createTask(event) {
  event.preventDefault();
  let prioFilled = checkPrio();
  let correctCategory = checkCorrectCategory();
  let correctContact = checkCorrectContact();
  if (prioFilled == true && correctCategory == true && correctContact == true){
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
      popUpNotice();
      //saveTask();
  }
}

function checkPrio() {
  if (typeof assignedPrio !== 'undefined' && assignedPrio !== null && assignedPrio !== '') {
    return true;
  } else {
   document.getElementById('prioAlert').innerHTML ='Please select a priority!';
  }
}

function checkCorrectCategory() {
  let inputCategory = document.getElementById("categorySelection").value;
  const categoryExists = categories.some(category => category.name === inputCategory);
  if (categoryExists) {
    return true;
  } else {
    document.getElementById('categoryAlert').innerHTML ='Please enter a valid category or choose from the dropdown Menu';
  }
}

function checkCorrectContact() {
  if (assignedContacts.length != 0) {
    return true;
  } else {
    document.getElementById('contactAlert').innerHTML ='Please choose an option from the dropdown Menu';
  }
}

function popUpNotice() {
  document.getElementById('popupNotice').classList.add('visible');
}

function switchToBoard() {
  window.location.href = "board.html";
}

async function saveTask() {
  //save to Server
  await setItem("tasks", JSON.stringify(tasks));
  await setItem("categories", JSON.stringify(tasks));
  await setItem("freeColors", JSON.stringify(tasks));
}