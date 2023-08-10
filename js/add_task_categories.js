/**
 * this function begins the rendering of the categories
 * @param - no parameter
 */
function renderCategories() {
    document.getElementById("newCategoryDotsContainer").innerHTML = "";
    document.getElementById('category').innerHTML = templateCategory();
    createFreecolors();
    renderCategoryOptions();
    resetCategories();
  }
  
  /**
   * this function returns the main template for categories
   * @param - no parameter
   */
  function templateCategory() {
    let templateCategory = /*html*/`
    <div class="inputWithList">
      <div class="inputCategory">
    <input id="categorySelection" class="selection" required placeholder="Select task category">
   <div id="categorySelectionCircle"></div> 
   </div>
   <div id="categorySelectionLeft"></div>
   <div id="dividerSmall"></div>
   <div id="categorySelectionRight">
    <img src="assets/img/dropdown.svg" class="hover" onclick="toggleOptions('categoryOptions')"/>
   </div>
  </div>
  <div class="hidden roundedBorder" id="categoryOptions"></div>
  </div>`;
    return templateCategory;
  }
  
  /**
   * this function renders the options for the dropdown menu of categories
   * @param - no parameter
   */
  function renderCategoryOptions() {
    document.getElementById('categoryOptions').innerHTML = '';
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]['name'];
      const colorCode = categories[i]['colorCode'];
      if (i==0) {
        document.getElementById('categoryOptions').innerHTML += templateCategoryOptionsFirst(category,i);
      } else {
      document.getElementById('categoryOptions').innerHTML += templateCategoryOptionsFurther(category,i, colorCode);}
    }
  }
  
  /**
   * this function returns the first line for new category
   * @param {string} category - first item from the JSON categories and set to 'New Category'
   * * @param {number} i - index of the JSON categories, in this case set to 0
   */
  function templateCategoryOptionsFirst(category, i) {
    let templateCategoryOptionsFirst = /*html*/ `  
    <div id="category${i}" class="option" onclick="addNewCategory()">
    <div>${category}</div></div>
  </div>`;
    return templateCategoryOptionsFirst;
  }
  
  /**
   * this function returns the template for further lines of category option
   * @param {string} category - i. category from the JSON categories
   * @param {number} i - index of the JSON categories
   * @param {string} colorCode - i. hexcode of the JSON categories
   */
  
  function templateCategoryOptionsFurther(category,i, colorCode) {
    let templateCategoryOptionsFurther = /*html*/`
    <div class="option">
      <div id="category${i}" class="categoryLine" onclick="selectCategory(${i})">
        <div>${category}</div>
        <div class="circle" style="background-color: ${colorCode}"></div>
      </div>
      <img src="assets/img/delete.png" class="hover" onclick="deleteCategory('${category}', '${i}')"/>
    </div>`;
    return templateCategoryOptionsFurther;
  } 
  
  
  /**
   * this function toggles the dropdown menu of cetagories and contacts
   * @param {string} id - id of either categories or contacts
   */
  function toggleOptions(id) {
    const optionsDiv = document.getElementById(`${id}`);
    optionsDiv.classList.toggle('hidden');
    document.getElementById('categoryAlert').innerHTML ='';
  }
  
  
  /**
   * this function selects the clicked-on category, writes it into the input field and adds the respective color dot
   * @param {number} i - index of the JSON categories
   */
  function selectCategory(i) {
    const category = categories[i]['name'];
    const colorCode = categories[i]['colorCode'];
    assignedCategory = category;
    document.getElementById('categorySelection').value = category;
    document.getElementById('categorySelectionCircle').innerHTML = /*html*/ `
    <div class="circle" style="background-color: ${colorCode}"></div>`;
    toggleOptions('categoryOptions');
  }
  
  
  /**
   * this function resets NewCategories and respective color code to empty
   * @param - no parameter
   */
  function resetCategories () {
    newCategoryName = '';
    newCategoryColor = '';
  }
  
  
  /**
   * this function renders the line for adding a New Category and adds the color dots to choose from
   * @param - no parameter
   */
  function addNewCategory() {
    document.getElementById('categorySelection').value='';
    document.getElementById('categorySelection').setAttribute('placeholder', 'New category Name');
    document.getElementById('categorySelection').setAttribute('onkeydown', 'checkIfNewCategoryReady()');
    document.getElementById('categorySelectionCircle').innerHTML = '';
    document.getElementById('categorySelectionLeft').innerHTML = templateCategorySelectionLeft();
    document.getElementById('dividerSmall').innerHTML = templatedividerSmall();
    document.getElementById('categorySelectionRight').innerHTML = templateCategorySelectionRight();
    document.getElementById('newCategoryDotsContainer').innerHTML = `<div id="newCategoryDots"></div>`;
    for (let i = 0; i < freeColors.length; i++) {
      document.getElementById('newCategoryDots').innerHTML += templateNewCategoryDots(i);
    }
    toggleOptions('categoryOptions');
  }
  
  
  /**
   * this function returns the HTML code for the cancel button in the adding New Category line
   * @param - no parameter
   */
  function templateCategorySelectionLeft() {
    let templateCategorySelectionLeft = `
    <img src="assets/img/cancel.png" class="hover" onclick="renderCategories()"/>`;
    return templateCategorySelectionLeft;
  }
  
  
  /**
   * this function returns the HTML code for the small divider in the adding New Category line
   * @param - no parameter
   */
  function templatedividerSmall() {
    let templatedividerSmall = `<div class="dividerSmall"></div>`;
    return templatedividerSmall;
  }
  
  
  /**
   * this function returns the HTML code for the checkmark in the adding New Category line
   * @param - no parameter
   */
  function templateCategorySelectionRight() {
    let templateCategorySelectionRight = `
    <img src="assets/img/done-30.png" class="iconsNewCategory" id="addCategory" />`;
    return templateCategorySelectionRight;
  }
  
  
  /**
   * this function returns the HTML code for the color dots to choose from beneath the New Category line
   * @param {number} i - index of the array freeColors
   */
  function templateNewCategoryDots(i) { 
    let colorCode = freeColors[i];
    let templateNewCategoryDots = /*html*/ `
      <div class="circle hover" id="newCategoryDot${i}" style="background-color: ${colorCode}" onclick="addColor(${i})"></div>`;
    return templateNewCategoryDots;
  }
  
  
  /**
   * this function checks if a category name has been entered plus a color code selected and then enables the click function addCategory
   * @param - no parameter
   */
  function checkIfNewCategoryReady() {
    newCategoryName = document.getElementById('categorySelection').value;
    if (newCategoryName !== '' && newCategoryColor !== null) {
      const addCategoryButton = document.getElementById('addCategory');
      addCategoryButton.addEventListener('click', addCategory);
      addCategoryButton.classList.add('hover');
    }
  }
  
  
  /**
   * this function saves 6 random colorCodes to choose from of them in the array freeColors
   * @param - no parameter
   */
  function createFreecolors() {
    freeColors = [];
    for (let i = 0; i < 5; i++) {
      let freeColorCode = getRandomColor();
      freeColors.push(freeColorCode);
    }
  }
  
  
  /**
   * this function creates random colors in hexcode
   * @param - no parameter
   */
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  
  /**
   * this function highlights the selected free color and checks if the button to add can bei disabled
   * @param - {number} i - index of the array freeColors
   */
  function addColor(i) {
    newCategoryColor = freeColors[i];
    for (let j = 0; j < freeColors.length; j++) {
        document.getElementById(`newCategoryDot${j}`).classList.remove('selected');
    }
    document.getElementById(`newCategoryDot${i}`).classList.add('selected');
    checkIfNewCategoryReady();
  }
  
  
  /**
   * this function adds the new category with its respective color to the JSON categories and removes the selected color from the array freeColors
   * @param {string} newCategoryName - is a global variable
   * @param {string} newCategoryColor - is a global variable
   */
  function addCategory() {
    const newCategoryObject = { 'name': newCategoryName, 'colorCode': newCategoryColor };
    categories.push(newCategoryObject);
    let lastItem = categories.length -1;
    const indexToRemove = freeColors.indexOf(newCategoryColor);
  if (indexToRemove !== -1) {
    freeColors.splice(indexToRemove, 1);
  }
    renderCategories();
    selectCategory(lastItem);
    toggleOptions('categoryOptions');
  }
  
  
  /**
   * this function deletes a category if it's not in use in the board
   * @param {string} categoryToDelete - this category has been selected to be deleted
   * @param {number} i - index of the JSON categories 
   */
  function deleteCategory(categoryToDelete, i) {
    checkCategoryIfUsed = checkCategoryToDelete(categoryToDelete); 
    if (checkCategoryIfUsed === false) {
      categories.splice(i, 1);
      document.getElementById('categoryAlert').innerHTML ='';
      renderCategories();
      saveOnlyCategories()
    } else {
      document.getElementById('categoryAlert').innerHTML ='Category is in use';
    }
  }
  
  
  /**
   * this function checks if the category to delete is not in use in the board.html
   * @param {string} categoryToDelete - this category has been selected to be deleted
   */
  function checkCategoryToDelete(categoryToDelete) {
    for (let i = 0; i < tasks.length; i++) {
      const categoryToCheck = tasks[i]['category'];
      if (categoryToDelete === categoryToCheck) {
        return true; 
      }
    }
    return false;
  }
  