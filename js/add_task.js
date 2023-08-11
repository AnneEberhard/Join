//for includeHTML() and initTemplate('addTask') see script_Templates.js
//for categories see add_task_categories.js
//for saving see save_add_tasks.js
//for backend see storage.js

//these come from server and will be saved at the end
let tasks = [];
let contacts = [];
let categories = [];
let freeColors = [];

//these are needed to fill task
let assignedCategory;
let assignedContacts = [];
let assignedContactsStatus = new Array(contacts.length).fill(false);
let assignedPrio ='';
let subTasksArray = [];

//these are needed for the site to function
let prios = ['urgent', 'medium', 'low'];
let newCategoryName;
let newCategoryColor;
let inputDone = false; 


/**
 * this function starts loading the page
 *
 * @param - no parameter
 */
async function initTask() {
  await includeHTML();  
  await loadItems();
  renderCategories();
  renderContacts();
  renderDueDate();
}


/**
 * this function loads the needed items from the backend
 * @param - no parameter
 */
async function loadItems() {
  try {
  tasks = JSON.parse(await getItem("tasks")); 
  contacts = JSON.parse(await getItem("contacts"));
  categories = JSON.parse(await getItem("savedCategories")); 
  freeColors = JSON.parse(await getItem("savedFreeColors")); 
} catch (e) {
  console.error("Loading error:", e);
}
}


/**
 * this function begins the rendering of the contacts
 * @param - no parameter
 */
function renderContacts() {
  document.getElementById('contactContainer').innerHTML = templateContactSelection();
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]['user_name'];
    document.getElementById('contactsOptions').innerHTML += templateContactsOptions(contact, i);
  }
  document.getElementById('contactsOptions').innerHTML += templateNewContact();
}


/**
 * this function returns the main template for contacts
 * @param - no parameter
 */
function templateContactSelection() {
  let templateContactSelection = /*html*/`
  <div class="inputWithList">
  <input id="contactSelection" class="selection" required disabled placeholder="Select contacts to assign">
  <img src="assets/img/dropdown.svg" class="hover" onclick="toggleOptions('contactsOptions')"/>
  </div>
  <div class="hidden roundedBorder" id="contactsOptions"></div>`;
  return templateContactSelection;
}


/**
 * this function returns the regular lines for the dropdown menu of contacts
 * @param {string} ccontact - the contact from the global JSON contacts
 * @param {number} i - index of the JSON contacts 
 */
function templateContactsOptions(contact,i) {
  let templateContactsOptions = /*html*/`
  <div class="option contactList" onclick="checkContact(${i})">
    <div id="contact${i}">${contact}</div>
    <div class="checkBox hover" id="contactCheckBox${i}"></div>
  </div>`;
  return templateContactsOptions;
}


/**
 * this function returns the HTML code for the last line the dropdown menu of contacts to invite a new contact
 * @param - no parameter
 */
function templateNewContact() {
  let templateNewContact = /*html*/`
  <div class="option contactList">
    <div id="newContact">Invite new contact</div>
    <div class="newContact roundedBorder"><img src="assets/img/Icon_Contacts_white.png" onclick="inviteContact()"></div>
  </div>`;
  return templateNewContact;
}


/**
 * this function checks if a contact has been assigned to the task and starts assigning of unassigning
 * @param {number} i - index of the JSON contacts 
 */
function checkContact(i) { 
  if (assignedContactsStatus[i]===true) {
    unassignContact(i);
  } else {
    assignContact(i);
  }
  updateAssignedContacts();
}


/**
 * this function fills the box of an assigned contact and sets the i. value of assignedContactsStatus[] to true
 * @param {number} i - index of the JSON contacts 
 */
function assignContact(i) {
  document.getElementById(`contactCheckBox${i}`).innerHTML = /*html*/`
    <div class="checkBoxChecked hover"></div>
  </div>`;
  assignedContactsStatus[i] = true; 
  }


/**
 * this function clears the box of an assigned contact and sets the i. value of assignedContactsStatus[] to false
 * @param {number} i - index of the JSON contacts 
 */
function unassignContact(i) {
  document.getElementById(`contactCheckBox${i}`).innerHTML = /*html*/``;
  assignedContactsStatus[i] = false; 
}


/**
 * this function adds assigned contacts to the global array assignedContacts
 * @param - no parameter
 */
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
}


/**
 * this function links to the contact page to add a new contact
 * @param - no parameter
 */
function inviteContact() {
  window.location.href = "contacts.html";
}


/**
 * this function renders the field Due Date, enabling only future dates to be selected
 * @param - no parameter
 */
function renderDueDate() {
  let currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  document.getElementById('dueDate').setAttribute('min', `${year}-${month}-${day}`);
}


/**
 * this function renders the priorities
 * @param - no parameter
 */
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


/**
 * this function assigns the clicked-on priority to the global variable assignedPrio or unassigns it at the 2nd click
 * @param {string} chosenPrio - id of clicked-on priority
 */
function assignPrio(chosenPrio) {
  document.getElementById('prioAlert').innerHTML ='';
  if (assignedPrio === chosenPrio) {
    assignedPrio = '';
  } else {
    assignedPrio = chosenPrio;}
  renderAssignedPrio(chosenPrio);
}


/**
 * this function either highlights or de-highlights the clicked-on priority depending on 1st or 2nd click as well as de-highlights all others
 * @param {string} chosenPrio - id of clicked-on priority
 */
function renderAssignedPrio(chosenPrio) {
  for (let i = 0; i < prios.length; i++) {
    const prio = prios[i];
    const prioBox = document.getElementById(`${prio}`);
    const capitalPrio = prio.charAt(0).toUpperCase() + prio.slice(1);
     if (prio === chosenPrio && prioBox.classList.contains(prio) === false) {
        prioBox.classList.add(`${prio}`);
        prioBox.innerHTML = `${capitalPrio} <img src="../assets/img/${prio}_white.png" />`;
    } 
    else {
        prioBox.classList.remove(`${prio}`);
        prioBox.innerHTML = `${capitalPrio} <img src="../assets/img/${prio}.png" />`;
    }
  }
}


/**
 * this function renders the field for adding subtasks
 * @param - no parameter
 */
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


/**
 * this function returns the index of an item in an array
 * @param {string} array - name of respective array
 * @param {string} item - name of respective item
 */
function findIndexOfItem (array, item) {
    return array.indexOf(item);
}


/**
 * this function add checksmarks to the subtaks if clicked on
 * @param {value} index - index of the subtask in the global array subTasksArray
 */
function addCheck(index) {
    document.getElementById(`checkBox${index}`).innerHTML = /*html*/ `<img src="assets/img/done-30.png">`;
}

