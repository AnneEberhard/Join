async function init() {
    includeHTML();
}

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








function togglePopupBar() {
    let popupBar = document.getElementById('popupBar');
    if (popupBar.classList.contains('d-none')) {
        popupBar.classList.remove('d-none');
        popupBar.classList.add('d-flex');
    } else{
        popupBar.classList.remove('d-flex');
        popupBar.classList.add('d-none');
    }

}