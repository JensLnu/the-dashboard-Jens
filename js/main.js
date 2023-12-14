// references
const header = document.querySelector('.header');

// global varibles
let linkInfos = []; // saves links to localStorage

//document.addEventListener("DOMContentLoaded", addFunctionality);

// runs sites main functionality
function addFunctionality() {
    showClock();
    showDate();
    setInterval(showClock, 1000);
    getCustomHeader();
    changeHeader();
    getLinkfromUser();
    enablesGeoLocation();
    enableRandomizeBgBtn();
}

// -------------------------------------------------------
// -------------------- Time and date --------------------
// -------------------------------------------------------

// gets the time and render it
function showClock() {
    const timePlaceholder = document.querySelector('#time-and-date li');
    const date = new Date;
    timePlaceholder.textContent = date.toLocaleTimeString();
    if (timePlaceholder.textContent === '00:00:00') showDate();
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
Extra utmaning: Gör så att användaren kan anpassa orten som visas (och antal dagar som visas).
(lägg till en senast updaterad datum).
*/

// get users browser geo location
function enablesGeoLocation() {
    const testGeoBtn = document.getElementById('test-geo');
    testGeoBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition((position) => {
            getWeatherForcast(position.coords.latitude, position.coords.longitude);
        });
    });
}

// fetch weather data
async function getWeatherForcast(lat, lon) {
    const apikey = '4b5aeb9659d9492f8a161902231312';
    let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${lat},${lon}&days=3`);
    if (response.ok) {
        response = await response.json();
        renderWeatherData(response);
    } else {
        console.log('something went wrong with json fetch');
    };
}

// render weather data for each day
function renderWeatherData(weatherObj) {
    const dayContainers = document.querySelectorAll('.day-container');
    const townName = document.getElementById('town-name');
    townName.textContent = `${weatherObj.location.name}`; // town name
    for (let i = 0; i < dayContainers.length; i++) {
        dayContainers[i].querySelector('img').src = weatherObj.forecast.forecastday[i].day.condition.icon; // img.src url   
        dayContainers[i].querySelector('img').alt = weatherObj.forecast.forecastday[i].day.condition.text; // img.alt weather text
        dayContainers[i].querySelector('.weather-text-container').firstElementChild.textContent =
            weatherObj.forecast.forecastday[i].day.avgtemp_c; // avg temp
        dayContainers[i].querySelector('.weather-text-container').lastElementChild.textContent =
            weatherObj.forecast.forecastday[i].day.condition.text; // weather text 
        if (i > 1) {
            dayContainers[i].querySelector('h3').textContent = getWeekdayName(weatherObj.forecast.forecastday[i].date); // day name
        }
    }
}

// return the name of a day from a specific date
function getWeekdayName(date) {
    const fulldate = new Date(date);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let weekday = weekdays[fulldate.getDay()];
    return weekday;
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
Extra utmaning: Låt användaren fylla i ett sökord som används för att hitta en randomiserad bild så att det blir inom ett tema som användaren önskar.
*/

function enableRandomizeBgBtn() {
    randomizeBgBtn = document.getElementById('randomize-bg-btn');
    randomizeBgBtn.addEventListener('click', setBg);
}

async function setBg() {
    const imgUrl = await getBgImg();
    // console.log(imgUrl);
    document.body.style.backgroundImage = `url('${imgUrl.urls.regular}')`
}

async function getBgImg() {
    //const unsplashApplicationId = 54078;
    const unsplashAccessKey = 'HkKu-cGTTO9SDxD4IGSkio9JwaFL5TuMcI9gSU4UOYQ';
    //const unsplashSecretKey = '-BaS8HwFjGZPe0Lfv59F7E3-4nVQ3s0xB4EPhQHCOMM';
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}`);
    if (response.ok) {
        return response.json();
    } else {
        console.log(response)
    }
}

/*
**VG-fråga**

I din readme-fil på github ska du ha med ett resonemang kring din kod. I denna ska du nyanserat resonera kring styrkor och brister i ditt genomförandet, alltså i den kod du utvecklat.

VG-nivån bedöms genom kvalitén på koden i kombination med din förmåga att se just styrkor och brister i den.

*/