async function initTask() {
    await includeHTML();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); 
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function addSubTask() {
    //fill field subTasks
    let subTask = document.getElementById('inputSubtask').value;
    console.log(subTask);
    document.getElementById('subTasks').innerHTML= /*html*/ `
    <div>
        <div class="square">+</div>
        <div>${subTask}</div>
    </div>`;
}

function assignPrio(prio) {
    //assign Prio
    console.log(prio);
}

function clearTask() {
    //empty form
    console.log('clearTask');
}

function createTask() {
    //create Task
    console.log('createTask');
}