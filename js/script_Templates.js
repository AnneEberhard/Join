async function initTemplate(categoryName) {
    await includeHTML();
    showCategory(categoryName);
}

/**
 * this function includes the templates for Sitebar & Topbar
 *  
 * @param - no parameter
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * function will highlight the active category on sitebar
 * 
 * @param {string} categoryName - gives the last string-part of the ID conatainer
 */
async function showCategory(categoryName) {
    let allCategories = document.getElementsByClassName('active_category');
    if (allCategories.length != 0) {
        for (let i = 0; i < allCategories.length; i++) {
            const element = allCategories[i];

            element.classList.remove('active_category');
        }
    }
    let string = "sidebar_categories_" + categoryName;
    let addCat = document.getElementById(string);    
    console.log(addCat);
    addCat.classList.add('active_category');
}


function togglePopupBar() {
    let popupBar = document.getElementById('popupBar');
    popupBar.classList.toggle('d-none');
    // if (popupBar.classList.contains('d-none')) {
    //     popupBar.classList.remove('d-none');
    //     popupBar.classList.add('d-flex');
    // } else {
    //     popupBar.classList.remove('d-flex');
    //     popupBar.classList.add('d-none');
    // }
}