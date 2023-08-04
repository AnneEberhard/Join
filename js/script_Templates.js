async function initTemplate(categoryName) {
  await includeHTMLTwo();
  showCategory(categoryName);
  createNameCircle();
}

/**
 * this function includes the templates for Sitebar & Topbar
 *
 * @param - no parameter
 */
async function includeHTMLTwo() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * function will highlight the active category on sitebar
 *
 * @param {string} categoryName - gives the last string-part of the ID conatainer
 */
async function showCategory(categoryName) {
    if (categoryName === "legal_notice" || categoryName === "privacy_policy") {
        document.getElementById("sidebar_categories").classList.add("d-none");
      } else {
    document.getElementById("sidebar_categories").classList.remove("d-none");
    let allCategories = document.getElementsByClassName("active_category");
    if (allCategories.length != 0) {
      for (let i = 0; i < allCategories.length; i++) {
        const element = allCategories[i];

        element.classList.remove("active_category");
      }
    }
    let string = "sidebar_categories_" + categoryName;
    let addCat = document.getElementById(string);
    addCat.classList.add("active_category");
  }
}

function togglePopupBar() {
  let popupBar = document.getElementById("popupBar");
  popupBar.classList.toggle("d-none");
  // if (popupBar.classList.contains('d-none')) {
  //     popupBar.classList.remove('d-none');
  //     popupBar.classList.add('d-flex');
  // } else {
  //     popupBar.classList.remove('d-flex');
  //     popupBar.classList.add('d-none');
  // }
}

/**
 * function create a namecircle with the first letters of first and last name of the User
 *
 * @param {} - no parameter
 */
async function createNameCircle() {
  await loadUsers();
  currentUser = users[0].name;
  let acronym = createAcronym(currentUser);
  let topbar = document.getElementById("topbar_icons");
  topbar.innerHTML += /*html*/ `
        <div id="topbar_Icons_Username" onclick="togglePopupBar()">${acronym}</div>
    `;
}

function createAcronym(currentUser) {
  let acronym;
  let matches = currentUser.match(/^(\w+)|(\w+)\W*$/g); //seperates first and last words of a string
  if (matches.length == 2) {
    acronym = matches[0].charAt(0) + matches[1].charAt(0); //combine first letters of this words
  } else {
    acronym = matches[0].charAt(0);
  }
  return acronym; // passes the beginning letter(s) back to createNameCircle()
}
