// references
const header = document.querySelector('.header');
const linksContainer = document.querySelector('.links-container');

// global varibles
let linkInfos = [];

//document.addEventListener("DOMContentLoaded", addFunctionality);

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

const linkModal = document.querySelector('.link-modal');
const submitLink = document.getElementById('link-submit-btn');

// enables save link functionallity
function getLinkfromUser() {
    getUsersLink();
    const closeLinkModal = document.querySelector('.close-link-modal');
    closeLinkModal.addEventListener('click', () => {
        linkModal.classList.add('display-none');
    });
    const addLinkBtn = document.getElementById('add-links-btn');
    addLinkBtn.addEventListener('click', () => {
        linkModal.classList.remove('display-none');
        submitLink.addEventListener('click', checkUserInputs);
    });
}

// render user input and creates link template, enabels user to remove link
function createLink(UsersLinkName, UsersLinkUrl) {
    const linkUl = document.querySelector('.link-ul');
    createNewElemAndClass('li', null, linkUl, 'flex');
    createNewElemAndClass('a', null, linkUl.lastElementChild);
    createNewElemAndClass('i', 'img', linkUl.lastElementChild);
    createNewElemAndClass('p', UsersLinkName, linkUl.lastElementChild);
    createNewElemAndClass('i', '', linkUl.lastElementChild, 'close-tag', 'hover');
    linkUl.lastElementChild.querySelector('.close-tag').innerHTML = '&times;'; // only for not using innerHTML from an input field
    const aElem = linkUl.lastElementChild.querySelector('a');
    aElem.setAttribute('href', UsersLinkUrl);
    aElem.setAttribute('target', '_blank');
    const closeTags = document.querySelectorAll('.close-tag');
    closeTags.forEach(closeTag => closeTag.addEventListener('click', (e) => {
        e.target.parentElement.remove();
        removeUsersLink(e);
    }));
    linkModal.classList.add('display-none');
}

// creates an element with content and adds classes then adds it to its parent
function createNewElemAndClass(elem, content, appendTo, className1, className2) {
    const newElem = document.createElement(elem);
    newElem.textContent = content;
    if (className1 !== undefined) newElem.classList.add(className1);
    if (className2 !== undefined) newElem.classList.add(className2);
    appendTo.appendChild(newElem);
}

// control of userers input for valid url and resets inputfields
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
        saveUsersLink(inputLinkName.value, `http://${inputLinkUrl.value}`);
        createLink(inputLinkName.value, `http://${inputLinkUrl.value}`);
        inputLinkUrl.value = '';
        inputLinkName.value = '';
    } catch (error) {
        messageElem.innerHTML = 'i.e "google.com"<br>Invalid url, check your spelling and format!';
        inputLinkUrl.focus();
    }
}

// -------------------------------------------------------
// ------------- Links LocalStorage handling -------------
// -------------------------------------------------------

// saves users added links to localStorage
function saveUsersLink(UsersLinkName, UsersLinkUrl) {
    linkInfos.push({ "linkName": UsersLinkName, "linkUrl": UsersLinkUrl });
    localStorage.setItem('linkInfo', JSON.stringify(linkInfos));
};

// gets users links from localStorage
function getUsersLink() {
    const checkValues = JSON.parse(localStorage.getItem('linkInfo') || 'null');
    if (checkValues === null) return;
    linkInfos = checkValues;
    checkValues.forEach(linkInfo => {
        createLink(linkInfo.linkName, linkInfo.linkUrl);
    });
}

// removes users links from localStorage
function removeUsersLink(e) {
    const urlToRemove = e.target.parentNode.firstElementChild.getAttribute('href'); // url
    let linksFromLocalStorages = JSON.parse(localStorage.getItem('linkInfo'));
    linksFromLocalStorages = linksFromLocalStorages.filter(link => {
        return link.linkUrl != urlToRemove;
    })
    linkInfos = [];
    linksFromLocalStorages.forEach(link => {
        saveUsersLink(link.linkName, link.linkUrl);
    })
}

// --------------------------------------------------------
// ------------------ Todays weather API ------------------
// --------------------------------------------------------

/*
Här ska vädret i närtid visas. 
Denna behöver inte se ut exakt som i skissen men det ska vara data som hämtas från något öppet API. 
För att avgöra vilken stad vädret ska visas för ska browserns geolocation-api användas.
    
Extra utmaning: Gör så att användaren kan anpassa orten som visas
*/


enablesGeoLocation(); // tillfällig

function enablesGeoLocation() {
    const testGeoBtn = document.getElementById('test-geo');
    testGeoBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition((position) => {
            getWeatherForcast(position.coords.latitude, position.coords.longitude);
        });
    });
}


async function getWeatherForcast(lat, lon) {
    const apikey = '4b5aeb9659d9492f8a161902231312';
    let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${lat},${lon}&days=3`);
    if (response.ok) {
        console.log('got json');
        response = await response.json();
        console.log(response);
        renderWeatherData(response);
    } else {
        console.log('something went wrong with json fetch');
    };
}

function renderWeatherData(weatherObj) {
    const dayContainer = document.querySelectorAll('.day-container');
    console.log(dayContainer);

}






// --------------------------------------------------------
// ---------------------- Your choies ---------------------
// --------------------------------------------------------

/*
Denna del får du fritt bestämma vad den ska innehålla.
Det ska dock vara data från ett externt API och exempelvis kan det vara senaste nyheterna eller aktiekurser.
*/

// --------------------------------------------------------
// ------------------------- Notes ------------------------
// --------------------------------------------------------

/*
I den här delen ska användaren kunna skriva snabba anteckningar.
Tänk en stor textarea bara där det som skrivs sparas hela tiden.
Det ska inte finnas flera olika anteckningar utan bara just en yta.
*/

// --------------------------------------------------------
// -------------- Randomize background image --------------
// --------------------------------------------------------

/*
När användaren klickar på denna knapp ska en randomiserad bild från Unsplash API hämtas och läggas in som bakgrund på dashboarden.
    
Extra utmaning: Låt användaren fylla i ett sökord som används för att hitta en randomiserad bild så att det blir inom ett tema som användaren önskar.
*/


/*
**VG-fråga**

Denna del behöver du bara göra om du satsar på VG.

I din readme-fil på github ska du ha med ett resonemang kring din kod. I denna ska du nyanserat resonera kring styrkor och brister i ditt genomförandet, alltså i den kod du utvecklat.

VG-nivån bedöms genom kvalitén på koden i kombination med din förmåga att se just styrkor och brister i den. Detta betyder att om din kod har allt för låg kvalité räcker det inte med resonemang kring det för att rädda upp, men det betyder också att ingen kod behöver vara helt perfekt men det är bra att du själv kan peka på de brister du då ser.

</aside>
*/