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
    getLinkfromUser();
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

// Extra utmaning: Hämta länkens favicon och visa som bild i dashboarden.
// gör om 'close' till ett kryss

const linkModal = document.querySelector('.link-modal');
const submitLink = document.getElementById('link-submit-btn');

// adds save link functionallity
function getLinkfromUser() {
    const closeLinkModal = document.querySelector('.close-link-modal');
    closeLinkModal.addEventListener('click', () => {
        linkModal.classList.toggle('display-none');
    });
    const addLinkBtn = document.getElementById('add-links-btn');
    addLinkBtn.addEventListener('click', () => {
        linkModal.classList.toggle('display-none');
        submitLink.addEventListener('click', checkUserInputs);
    });
}

// render user input and creates link template, enabels user to remove link
function createLink(UsersLinkName, UsersLinkUrl) {
    console.log('start creatLink')
    const linkUl = document.querySelector('.link-ul');
    createNewElemAndClass('li', null, linkUl, 'flex');
    createNewElemAndClass('a', null, linkUl.lastElementChild);
    createNewElemAndClass('i', 'bild', linkUl.lastElementChild);
    createNewElemAndClass('p', UsersLinkName, linkUl.lastElementChild);
    createNewElemAndClass('i', '', linkUl.lastElementChild, 'close-tag', 'hover');
    linkUl.lastElementChild.querySelector('.close-tag').innerHTML = '&times;'; // only for not using innerHTML from an input field
    const aElem = linkUl.lastElementChild.querySelector('a');
    aElem.setAttribute('href', `http://${UsersLinkUrl}`);
    aElem.setAttribute('target', '_blank');
    const closeTags = document.querySelectorAll('.close-tag');
    closeTags.forEach(closeTag => closeTag.addEventListener('click', (e) => {
        e.target.parentElement.remove();
    }));
    linkModal.classList.toggle('display-none');
}

// creates an element with content and adds classes then adds it to its parent
function createNewElemAndClass(elem, content, appendTo, className1, className2) {
    console.log('start createNewElem')
    const newElem = document.createElement(elem);
    newElem.textContent = content;
    if (className1 !== undefined) newElem.classList.add(className1);
    if (className2 !== undefined) newElem.classList.add(className2);
    appendTo.appendChild(newElem);
}

// controll of userers input for valid URL and resets inputfields
async function checkUserInputs() {
    const inputLinkName = document.getElementById('link-name');
    const inputLinkUrl = document.getElementById('link-url');
    const messageElem = linkModal.querySelector('p');
    if (inputLinkName.value === '') {
        inputLinkName.value = 'Enter a name..';
        inputLinkName.focus();
        return
    }
    if (inputLinkUrl.value == '') {
        inputLinkUrl.value = 'You must enter a url..';
        inputLinkUrl.focus();
        return;
    }
    try {
        await fetch(`http://${inputLinkUrl.value}`, { mode: 'no-cors' });
        messageElem.textContent = 'i.e "google.com"';
        submitLink.removeEventListener('click', checkUserInputs);
        createLink(inputLinkName.value, inputLinkUrl.value);
        inputLinkUrl.value = '';
        inputLinkName.value = '';
    } catch (error) {
        messageElem.innerHTML = 'i.e "google.com"<br>Invalid url, check your spelling and format!';
        inputLinkUrl.focus();
    }
}