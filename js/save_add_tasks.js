
function clearTask() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("categoryOptions").innerHTML = "";
    document.getElementById("categoryAlert").innerHTML = "";
    document.getElementById("contactAlert").innerHTML = "";
    document.getElementById("prioAlert").innerHTML = "";
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
          'column': 'board_container_bottom_todo'
            }
        tasks.push(task);
        saveTask();
        popUpNotice();
        
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
    await setItem("tasks", JSON.stringify(tasks));
    await setItem("savedCategories", JSON.stringify(categories));
    await setItem("savedFreeColors", JSON.stringify(freeColors));
  }
  
  async function saveOnlyCategories() {
    await setItem("savedCategories", JSON.stringify(categories));
  }