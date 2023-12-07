// references
const header = document.querySelector('.header');
const linksContainer = document.querySelector('.links-container')

document.addEventListener("DOMContentLoaded", addFunctionality);

// runs sites main functionality
function addFunctionality() {
    showClock();
    showDate();
    setInterval(showClock, 1000);
    getCustomHeader();
    changeHeader();
}

// -------------------------------------------------------
// -------------------- Time and date --------------------
// -------------------------------------------------------

// gets the time and render it
function showClock() {
    const timePlaceholder = document.querySelector('#time-and-date li');
    const date = new Date;
    timePlaceholder.textContent = date.toLocaleTimeString();
}

// gets the date and renders it
function showDate() {
    const datePlaceholder = document.querySelector('#time-and-date li').nextElementSibling;
    const date = new Date;
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    datePlaceholder.textContent = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ---------------------------------------------------------
// -------------------- Changing header --------------------
// ---------------------------------------------------------

// enabel the main header to be changed by the user
function changeHeader() {
    header.addEventListener('click', () => {
        header.classList.toggle('display-none');
        header.nextElementSibling.classList.toggle('display-none');
        header.nextElementSibling.focus();
        header.nextElementSibling.addEventListener('keydown', saveNewHeader);
    });
}

// saves the "new" header and displays it
function saveNewHeader(e) {
    if (e.keyCode == 13) {
        localStorage.setItem('customHeader', header.nextElementSibling.value);
        header.classList.toggle('display-none');
        header.nextElementSibling.classList.toggle('display-none');
        getCustomHeader();
    }
}

// gets the saved customaized header and renders it
function getCustomHeader() {
    const customHeader = localStorage.getItem('customHeader');
    if (customHeader) header.textContent = customHeader;
}

// ------------------------------------------------------
// -------------------- Adding links --------------------
// ------------------------------------------------------

/* 
3. Användaren kan lägga till nya, samt ta borts länkar
(3b). När användaren lägger till nya länkar ska användaren fylla i länken samt en rubrik som denna vill ska synas i dashboarden.
*/
    
// Extra utmaning: Hämta länkens favicon och visa som bild i dashboarden.
const linkModal = document.querySelector('.link-modal');
const inputLinkName = document.getElementById('link-name');
const inputLinkUrl = document.getElementById('link-url');
const submitLink = document.getElementById('link-submit-btn');
const linkUl = document.querySelector('.link-ul');

getLinkfromUser();

function getLinkfromUser() {
    const addLinkBtn = document.getElementById('add-links-btn');
    addLinkBtn.addEventListener('click', () => {
        linkModal.classList.toggle('display-none');
        submitLink.addEventListener('click', createLink);
    });
}

function createLink() {
    console.log('start creatLink')
    const newUl = createNewElem('ul', null, null);
    console.log(newUl)
    const newLi = createNewElem('li', null, linkUl);
    createNewElem('i', 'bild', newLi);
    createNewElem('p', inputLinkName.value, newLi);
    createNewElem('i', 'close', newLi);
    submitLink.addEventListener('click', addLink);
}

// creates an element with content and adds it to its parent
function createNewElem(elem, content, appendTo) {
    console.log('start createNewElem')
    console.log(appendTo)
    const newElem = document.createElement(elem);
    newElem.textContent = content;
    appendTo.appendChild(newElem);
}

function addLink() {
    console.log('start addLink')
    linkModal.classList.toggle('display-none');
}