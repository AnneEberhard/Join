let user_name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");

let contacts = [
  new Contact("Anja Schulz", +4917672446077, "schulz@gmail.com", "AS"),
  new Contact("Alen Alduk", +4917672446077, "alen-1997@hotmail.de", "AA"),
  new Contact("Anne Eberhard", +4917672446077, "anne.e@gmail.com", "AE"),
  new Contact("Klemens Naue", +4917672446077, "klemens.n@gmail.com", "KN"),
];

// Code for Letters in Contacts:

{
  /* <div id="beginn_d" class="contact_list_letter_container">
        <div class="letter">D</div>
      </div>

Code for Line divider: 
<div class="contact_list_stroke"></div>

Code for mini Contact Card:

<div id="contact_list_name_2" class="contact_list_name_container">
        <div class="contact_list_name_container_inner">
          <div class="contact_list_name_icon">DH</div>
          <div class="contact_list_name_mail">
            <div class="contact_list_name">Danny Herzog</div>
            <div class="contact_list_mail">HerzogD@gmail.com</div>
          </div>
        </div>
      </div> */
}

async function init() {
  await includeHTMLTwo();
  showCategory("contacts");
  createNameCircle();
  await loadContacts();
  renderContactList();
}

function closeModal(id) {
  let modal = document.getElementById(id);
  modal.style = "display: none;";
}

function openModal(id) {
  let modal = document.getElementById(id);
  modal.style = "display: flex;";
}

function cancelContact(id) {
  resetForm();
  closeModal(id);
}

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

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function resetForm() {
  user_name.value = "";
  email.value = "";
  phone.value = "";
}

// async function createNameCircle() {
//   await loadUsers();
//   currentUser = users[0].name;
//   let acronym = createAcronym(currentUser);
//   let topbar = document.getElementById('topbar_icons');
//   topbar.innerHTML += /*html*/`
//       <div id="topbar_Icons_Username" onclick="togglePopupBar()">${acronym}</div>
//   `
// }

function renderContactList() {
  const contactsContainer = document.getElementById("contacts_container");
  contactsContainer.innerHTML = "";

  const groupedContacts = {};

  // Group contacts by their acronym
  for (const contact of contacts) {
    const firstLetter = contact.acronym.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  }

  // Sort the grouped contacts by name
  for (const letter in groupedContacts) {
    groupedContacts[letter].sort((a, b) =>
      a.user_name.localeCompare(b.user_name)
    );
  }

  // Render the headers, contacts, and dividers
  for (const letter in groupedContacts) {
    const letterContainer = document.createElement("div");
    letterContainer.id = `beginn_${letter.toLowerCase()}`;
    letterContainer.className = "contact_list_letter_container";

    const letterHeader = document.createElement("div");
    letterHeader.className = "letter";
    letterHeader.textContent = letter;
    letterContainer.appendChild(letterHeader);

    const strokeDiv = document.createElement("div");
    strokeDiv.className = "contact_list_stroke";
    letterContainer.appendChild(strokeDiv);

    for (const contact of groupedContacts[letter]) {
      const contactContainer = document.createElement("div");
      contactContainer.className = "contact_list_name_container";

      const contactInnerContainer = document.createElement("div");
      contactInnerContainer.className = "contact_list_name_container_inner";
      contactInnerContainer.onclick = function () {
        renderContact(contact.user_name);
      };

      const acronymDiv = document.createElement("div");
      acronymDiv.className = "contact_list_name_icon";
      acronymDiv.textContent = contact.acronym;

      const nameMailContainer = document.createElement("div");
      nameMailContainer.className = "contact_list_name_mail";

      const nameDiv = document.createElement("div");
      nameDiv.className = "contact_list_name";
      nameDiv.textContent = contact.user_name;

      const mailDiv = document.createElement("div");
      mailDiv.className = "contact_list_mail";
      mailDiv.textContent = contact.email;

      nameMailContainer.appendChild(nameDiv);
      nameMailContainer.appendChild(mailDiv);

      contactInnerContainer.appendChild(acronymDiv);
      contactInnerContainer.appendChild(nameMailContainer);

      contactContainer.appendChild(contactInnerContainer);
      letterContainer.appendChild(contactContainer);
    }

    contactsContainer.appendChild(letterContainer);
  }
}

function renderContact(username) {
  let contact = findContactByUserName(username);
  let email = contact.email;
  let phone = contact.phone;
  let name = contact.user_name;
  let acronym = contact.acronym;
  content = document.getElementById("render");
  render.innerHTML = htmlUserTemplate(email, phone, name, acronym);
}

function findContactByUserName(userName) {
  return contacts.find((contact) => contact.user_name === userName);
}

// function editContact(user){
//   let contact = findContactByUserName(user);
//   contact.user_name =
// }

function htmlUserTemplate(email, phone, name, acronym) {
  return `<div class="user_container">
  <div class="user">
  <div class="user_icon">${acronym}</div>
  <div class="user_edit_container">
  <div class="username">${name}</div>
  
  <div class="edit_user">
  <div id="edit_contact" onclick="editContact(${name})">
    <img src="/assets/img/edit.png">
    <span>Edit</span>
    </div>
    <div id="delete_contact" onclick="deleteContact(${name})>
    <img src="assets/img/delete.png">
    <span>Delete</span>
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
