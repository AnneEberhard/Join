async function deleteTask(id) {
      await loadToDelete();  
      tasks.splice(id, 1);   
      await setItem("tasks", JSON.stringify(tasks));
}

async function deleteContact(contactNameToDelete) {
    await loadToDelete();
     for (let i = 0; i < contacts.length; i++) {
       const contactToDelete = contacts[i];
       const nameOfContact = contactToDelete["user_name"];
       if (contactNameToDelete === nameOfContact) {
        contacts.splice(i, 1);
       }
     }
     await setItem("contacts", JSON.stringify(contacts));
   }


   //could also be spliced into 2 functions, one for each JSON
   async function loadToDelete() {
    try {
    tasks = JSON.parse(await getItem("tasks")); 
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
  }