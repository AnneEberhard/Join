let currentHighlightedDiv = null;

/**
 * 
 * This function renders the Contact List.
 */

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

  // Sort the keys (letters) of the groupedContacts object
  const sortedLetters = Object.keys(groupedContacts).sort();

  // Render the headers, contacts, and dividers
  for (const letter of sortedLetters) {
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
      contactInnerContainer.addEventListener("click", function () {
        let container = document.getElementById("contact_container");
        container.style.display = "flex";
        if (currentHighlightedDiv !== null) {
          currentHighlightedDiv.classList.remove("highlighted"); // Remove highlighting
        }
        contactContainer.classList.toggle("highlighted");
        currentHighlightedDiv = contactContainer;
        renderContact(contact.user_name);
      });

      const acronymDiv = document.createElement("div");
      acronymDiv.className = "contact_list_name_icon";
      acronymDiv.textContent = contact.acronym;
      acronymDiv.style.backgroundColor = contact.color;

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
