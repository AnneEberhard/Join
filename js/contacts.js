let user_name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");

let edit_email = document.getElementById("edit_email");
let edit_name = document.getElementById("edit_name");
let edit_phone = document.getElementById("edit_phone");
let edit_picture = document.getElementById("edit_avatar");

let contacts = [
  new Contact("Anja Schulz", +4917672446077, "schulz@gmail.com", "AS"),
  new Contact("Alen Alduk", +4917672446077, "alen-1997@hotmail.de", "AA"),
  new Contact("Anne Eberhard", +4917672446077, "anne.e@gmail.com", "AE"),
  new Contact("Klemens Naue", +4917672446077, "klemens.n@gmail.com", "KN"),
];

let editingContact;

/**
 * This function is used to first load the Templates, then it will load the Contacts from
 * the Backend.
 * After its loaded from the Backend. The Contactlist is getting rendered.
 *
 */
async function init() {
  checkLogIn();
  await loadContacts();
  renderContactList();
}

/**
 *
 * This function takes the ID of the Modal as a paramter and closes it.
 * @param {string} - id of the Modal
 *
 *
 */
function closeModal(id) {
  let modal = document.getElementById(id);
  modal.classList.remove("slideIn");
  modal.classList.add("slideOut");
}

/**
 *
 * This function takes the ID of the Modal as a paramter and opens it.
 * @param {string} - id of the Modal
 *
 *
 */
function openModal(id) {
  let modal = document.getElementById(id);
  modal.style = "display: flex;";
  modal.className = "slideIn";
}

/**
 *
 * This function calls another function that resets the input of the user
 * and closes the Modal with the given ID.
 * @param {string} - id of the Modal
 *
 *
 */
function cancelContact(id) {
  resetForm();
  closeModal(id);
}

/**
 *
 * This function creates the Contact.
 * @param {string} - id of the Modal
 *
 *
 */
async function createContact(id) {
  let acronym = createAcronym(user_name.value);
  let contact = new Contact(
    user_name.value,
    +phone.value,
    email.value,
    acronym.toUpperCase()
  );
  contacts.push(contact);
  await setItem("contacts", JSON.stringify(contacts));
  await loadContacts();
  resetForm();
  closeModal(id);
  renderContactList();
}

/**
 *
 * This function loads the Contacts from the Backend.
 *
 */
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 *
 * This help function resets the User Input.
 *
 *
 */
function resetForm() {
  user_name.value = "";
  email.value = "";
  phone.value = "";
}

/**
 *
 * This function renders the Contact Details in the render Element ID.
 * @param {string} - the contact that should be rendered is taken as a parameter.
 *
 *
 */
function renderContact(username) {
  let contact = findContactByUserName(username);
  let email = contact.email;
  let phone = contact.phone;
  let name = contact.user_name;
  let acronym = contact.acronym;
  let color = contact.color;
  content = document.getElementById("render");
  render.innerHTML = htmlUserTemplate(email, phone, name, acronym, color);
}

/**
 *
 * This help function finds the wanted contact.
 * @param {string} - @param {string} - the contact that should be found is taken as a parameter.
 *
 *
 */
function findContactByUserName(userName) {
  return contacts.find((contact) => contact.user_name === userName);
}

/**
 *
 * This function edits the Contact Info of the User.
 * @param {string} - the contact that should be found is taken as a parameter.
 *
 *
 */
function editContact(user) {
  openModal("edit_contact_modal");

  editingContact = findContactByUserName(user);
  edit_name.value = editingContact.user_name;
  edit_email.value = editingContact.email;
  edit_phone.value = editingContact.phone;
  edit_picture.innerHTML = editingContact.acronym;
  edit_picture.style.backgroundColor = editingContact.color;
}

/**
 *
 * This function saves the edited Contact in the Backend.
 *
 *
 *
 */
async function saveEditedContact() {
  let acronym = createAcronym(edit_name.value);
  editingContact.user_name = edit_name.value;
  editingContact.email = edit_email.value;
  editingContact.phone = edit_phone.value;
  editingContact.acronym = acronym;
  resetEditForm();
  await setItem("contacts", JSON.stringify(contacts));
  await loadContacts();
  renderContactList();
  closeModal("edit_contact_modal");
  renderContact(editingContact.user_name);
}

/**
 *
 * This function deletes the Contact and saves the Contactlist in the Backend again.
 * @param {string} - the contact that should be deleted is taken as a parameter.
 *
 *
 */

async function deleteContact(user) {
  let target = user;
  let indexToRemove = contacts.findIndex(
    (contact) => contact.user_name === target
  );

  if (indexToRemove !== -1) {
    contacts.splice(indexToRemove, 1);
    await setItem("contacts", JSON.stringify(contacts));
    loadContacts();
    renderContactList();
    document.getElementById("render").innerHTML = "";
    window.location.href = "contacts.html";
  }
}

/**
 *
 * This function deletes the Contact inside of a Modal.
 * @param {string} - the Modal that should be closed.
 *
 *
 */
async function deleteContactInModal(id) {
  let modal = document.getElementById(id);
  target = modal.value;
  let toDelete = contacts.findIndex((contact) => contact.user_name === target);

  if (toDelete !== -1) {
    contacts.splice(toDelete, 1);
    await setItem("contacts", JSON.stringify(contacts));
    loadContacts();
    renderContactList();
    closeModal("edit_contact_modal");
    document.getElementById("render").innerHTML = "";
  }
}

/**
 *
 * This help function deletes User Input inside the Edit Modal.
 *
 *
 */
function resetEditForm() {
  edit_name.value = "";
  edit_email.value = "";
  edit_phone.value = "";
}

/**
 *
 * This function is for highlighting the current chosen User
 *
 *
 */
function changeDisplay() {
  let container = document.getElementById("contact_container");
  container.style.display = "none";
  currentHighlightedDiv.classList.remove("highlighted");
}



/**
 *
 * This function puts a upper case on the first and last Name as the user types
 *
 *
 */

function capitalizeName(modal) {
  let nameOnInput = document.getElementById(modal).value;
  let arr = nameOnInput.split(" ");
  for(let i = 0; i < arr.length; i++){
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    let fullName = arr.join(" ");
    document.getElementById(modal).value = fullName;
  }
}



/**
 *
 * This help function is used for the HTML Template to render Contact Details.
 * @param {string} - email - email of Contact
 * @param {string} - phone - phone of Contact
 * @param {string} - name - name of Contact
 * @param {string} - acronym - acronym of Contact
 * @param {string} - color - color of Contact
 *
 *
 */

function htmlUserTemplate(email, phone, name, acronym, color) {
  return /*html*/ `<div class="user_container">
  <div class="user">
  <div class="user_icon" style="background-color: ${color}">${acronym}</div>
  <div class="user_edit_container">
  <div class="username">${name}</div>
  
  <div class="edit_user">
  <div id="edit_contact" onclick="editContact('${name}')">
    <img src="/assets/img/edit.png">
    <span>Edit</span>
    </div>
    <div id="delete_contact" onclick="deleteContact('${name}')">
    <img src="assets/img/delete.png">
    <span>Delete</span>
    </div>
  </div>
  <div class="dropdown_for_mobile">
    <img src="assets/img/more_vert.png">
    <div class="dropdown-content">
    <div id="edit_contact" onclick="editContact('${name}')">
    <img src="/assets/img/edit.png">
    <span>Edit</span>
    </div>
    <div id="delete_contact" onclick="deleteContact('${name}')">
    <img src="assets/img/delete.png">
    <span>Delete</span>
    </div>
</div>
</div>
</div>
</div>

</div>
<div class="contact_information">
    <span class="information">Contact Information</span>
  </div>
  <div class="user_details">
    <div class="details_container">
        <div class="email">
        
            <h3>Email</h3>
            <a href="mailto: ${email}">${email}</a>
            </div>
        
        <div class="phone">
            <h3>Phone</h3>
            <a href="tel: ${phone}">${phone}</a>
        </div>
    </div>
  </div>
</div>`;
}
