let user_name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");

let contacts = [
  new Contact("Anja Schulz", +4917672446077, "schulz@gmail.com"),
  new Contact("Alen Alduk", +4917672446077, "alen-1997@hotmail.de"),
  new Contact("Anne Eberhard", +4917672446077, "anne.e@gmail.com"),
  new Contact("Klemens Naue", +4917672446077, "klemens.n@gmail.com"),
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

function closeModal(id) {
  let modal = document.getElementById(id);
  modal.style = "display: none;";
}

function openModal(id) {
  let modal = document.getElementById(id);
  modal.style = "display: flex;";
}

function cancelContact(id) {
  user_name.value = "";
  email.value = "";
  phone.value = "";
  closeModal(id);
}

async function createContact(id) {
  let contact = new Contact(user_name.value, +phone.value, email.value);
  contacts.push(contact);
  await setItem("contacts", JSON.stringify(contacts));
  await loadContacts();
  resetForm();
  closeModal(id);
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
