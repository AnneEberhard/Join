//for includeHTML() and initTemplate('addTask') see script_Templates.js
//for categories see add_task_categories.js
//for overall functions of the site see add_task.js
//for backend see storage.js

/**
 * this function clears the entire template and resets to original state
 * @param - no param
 */
function clearTask() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("categoryOptions").innerHTML = "";
  document.getElementById("categoryAlert").innerHTML = "";
  document.getElementById("contactAlert").innerHTML = "";
  document.getElementById(`prioAlertAdd`).innerHTML = "";
  document.getElementById("dueDateAdd").value = "";
  document.getElementById("inputSubtaskAdd").value = "";
  document.getElementById("subTasks").innerHTML = "";
  document.getElementById("urgentAdd").classList.remove("urgent");
  document.getElementById("mediumAdd").classList.remove("medium");
  document.getElementById("lowAdd").classList.remove("low");
  document.getElementById("popupNotice").classList.remove("visible");
  renderCategories();
  renderContacts();
  renderPrio();
  assignedPrio = "";
  subTasksArray = [];
}

/**
 * this function creates the respective JSOn tasks if all requirements are met and adds it to the array tasks
 * @param {Event} event - needed to prevent new loading of form
 */
function createTask(event) {
  event.preventDefault();
  let prioFilled = checkPrio();
  let correctCategory = checkCorrectCategory();
  let correctContact = checkCorrectContact();
  if (prioFilled == true && correctCategory == true && correctContact == true) {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let dueDate = document.getElementById("dueDateAdd").value;
    let task = {
      title: title,
      description: description,
      category: assignedCategory,
      assignedContacts: assignedContacts,
      dueDate: dueDate,
      prio: assignedPrio,
      subtasks: subTasksArray,
      column: column,
    };
    tasks.push(task);
    saveTask();
    popUpNotice();
    flushSubtasks();
  }
}

function flushSubtasks() {
  subTasksArray = [];
}

/**
 * this function checks if a priority is assigned to task and writes an alert otherwise
 * @param - no param
 */
function checkPrio() {
  if (
    typeof assignedPrio !== "undefined" &&
    assignedPrio !== null &&
    assignedPrio !== ""
  ) {
    return true;
  } else {
    document.getElementById(`prioAlertAdd`).innerHTML =
      "Please select a priority!";
  }
}

/**
 * this function checks if a correct category is assigned to task and writes an alert otherwise
 * @param - no param
 */
function checkCorrectCategory() {
  let inputCategory = document.getElementById("categorySelection").value;
  const categoryExists = categories.some(
    (category) => category.name === inputCategory
  );
  if (categoryExists) {
    return true;
  } else {
    document.getElementById("categoryAlert").innerHTML =
      "Please enter a valid category or choose from the dropdown Menu";
  }
}

/**
 * this function checks if at least one contact is assigned to task and writes an alert otherwise
 * @param - no param
 */
function checkCorrectContact() {
  if (assignedContacts.length != 0) {
    return true;
  } else {
    document.getElementById("contactAlert").innerHTML =
      "Please choose an option from the dropdown Menu";
  }
}

/**
 * this function shows popUp Notice when task is added and saved
 * @param - no param
 */
function popUpNotice() {
  document.getElementById("popupNotice").classList.add("visible");
  setTimeout(function () {
    switchToBoard();
  }, 1000);
}

/**
 * this function refers to the site board.html
 * @param - no param
 */
function switchToBoard() {
  window.location.href = "board.html";
}

/**
 * this function seves the JSONs tasks, savedCategories and the array savedfreeColors to the backend
 * @param - no param
 */
async function saveTask() {
  await setItem("tasks", JSON.stringify(tasks));
  await setItem("savedCategories", JSON.stringify(categories));
  await setItem("savedFreeColors", JSON.stringify(freeColors));
}

/**
 * this function saves only the savedCategories to the backend and is used when a category is deleted
 * @param - no param
 */
async function saveOnlyCategories() {
  await setItem("savedCategories", JSON.stringify(categories));
}
