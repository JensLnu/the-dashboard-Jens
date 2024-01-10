// references
const header = document.querySelector('.header');                           // changing header funktion
const linkModal = document.querySelector('.link-modal');                    // Links gadget
const submitLink = document.getElementById('link-submit-btn');              // Links gadget

const townName = document.getElementById('town-name');                      // weather gadget
const weatherInput = document.getElementById('weather-input');              // weather gadget
const dayContainers = document.querySelectorAll('.day-container');          // weather gadget

const amountToExchangeInput = document.getElementById('Exchange-amount');   // Exchange gadget
const fromContryInput = document.getElementById('Fromcountries');           // Exchange gadget
const toContryInput = document.getElementById('toCountries');               // Exchange gadget

// global varibles
let linkInfos = []; // saves links to localStorage
const weatherApiKey = '4b5aeb9659d9492f8a161902231312';

document.addEventListener("DOMContentLoaded", addFunctionality);

// runs sites main functionality
function addFunctionality() {
    showClock();
    showDate();
    setInterval(showClock, 1000);
    getCustomHeader();
    changeHeader();
    getLinkfromUser();
    enablesUserToChooseTown();
    enablesGeoLocation();
    enableRandomizeBgBtn();
    getNotesAndSave();
    buildExchangeFunctionalyity();
}

// --------------------------------------------------------
// ------------------- 1. Time and date -------------------
// --------------------------------------------------------

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

// ----------------------------------------------------------
// ------------------- 2. Changing header -------------------
// ----------------------------------------------------------

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

// -------------------------------------------------------
// ------------------- 3. Adding links -------------------
// -------------------------------------------------------

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
    linkUl.lastElementChild.appendChild(getFavIcon(UsersLinkUrl));
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

//get favicon and creates img-elem for it
function getFavIcon(UsersLinkUrl) {
    const imgElem = document.createElement('img');
    imgElem.src =`${UsersLinkUrl}/favicon.ico`;
    imgElem.alt = 'favicon';
    imgElem.addEventListener('error', () => {
        imgElem.src = '../img/placeholder50x50.jpg';
    });
    return imgElem;
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

// --------------------------------------------------------
// ------------ 3. Links LocalStorage handling ------------
// --------------------------------------------------------

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

// ---------------------------------------------------------
// ----------------- 4. Todays weather API -----------------
// ---------------------------------------------------------

// get users browser geo location
function enablesGeoLocation() {
    const testGeoBtn = document.getElementById('test-geo');
    testGeoBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition((position) => {
            getWeatherForcast(position.coords.latitude, position.coords.longitude);
        });
    });
}

// makes it possible to choose which town to render weather from
function enablesUserToChooseTown() {
    townName.addEventListener('click', () => {
        townName.classList.toggle('display-none');
        weatherInput.classList.toggle('display-none');
        weatherInput.focus();
        weatherInput.addEventListener('keydown', getTownGeoLocation);
    });
}

// get towns geo location and render choosed town as header
async function getTownGeoLocation(e) {
    if (e.keyCode == 13) {
        const choosedTown = weatherInput.value.toLowerCase();
        townName.textContent = choosedTown.charAt(0).toUpperCase() + choosedTown.slice(1);
        townName.classList.toggle('display-none');
        weatherInput.classList.toggle('display-none');   
        let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${choosedTown}&days=3`);
        if (response.ok) {
            response = await response.json();
            weatherInput.value = '';
            getWeatherForcast(response.location.lat, response.location.lon);
        } else {
            console.log('didnt found town');
            townName.textContent = 'didnt found town';
            resetWeaterData();
        };
    }
}

// if geo location is not found, resets renderd weather
function resetWeaterData() {
    for (let i = 0; i < dayContainers.length; i++) {
        dayContainers[i].querySelector('img').src = '../img/placeholder50x50.jpg';
        dayContainers[i].querySelector('img').alt = 'placeholder img';
        dayContainers[i].querySelector('.weather-text-container').firstElementChild.textContent = 'temp';
        dayContainers[i].querySelector('.weather-text-container').lastElementChild.textContent = 'weather';
        weatherInput.value = '';
    }
}

// fetch weather data
async function getWeatherForcast(lat, lon) {
    let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${lat},${lon}&days=3`);
    if (response.ok) {
        response = await response.json();
        renderWeatherData(response);
    } else {
        console.log('something went wrong with json fetch');
    };
}

// render weather data for each day
function renderWeatherData(weatherObj) {
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

// ---------------------------------------------------------
// -------------- 5. Your choies Exchange Rates-------------
// ---------------------------------------------------------

function buildExchangeFunctionalyity() {
    const calculateRateBtn = document.getElementById('calculate-rate-btn');
    currencies.forEach(obj => {
        createNewElemAndClass('option', `${obj.country}, ${obj.code}`, fromContryInput);
        createNewElemAndClass('option', `${obj.country}, ${obj.code}`, toContryInput);
    });
    calculateRateBtn.addEventListener('click', validateExchangeInputs);
}

// checks users input for exchange rates
function validateExchangeInputs() {
    const validateInputField = (inputField, condition) => {
        if (condition) {
            inputField.classList.remove('required-field');
            return true;
        } else {
            inputField.classList.add('required-field');
            return false;
        }
    };

    const onlyNumberReg = /^\d+$/;
    const isValidAmount = validateInputField(amountToExchangeInput, onlyNumberReg.test(amountToExchangeInput.value));
    const isValidFromCountry = validateInputField(fromContryInput, fromContryInput.value);
    const isValidToCountry = validateInputField(toContryInput, toContryInput.value);

    if (isValidAmount && isValidFromCountry && isValidToCountry) getExchangeRates();
}

// gets exchange rates
async function getExchangeRates() {
    const apikey = 'dc058b70680f82e26cbe4a8a';
    const fromCurrencyCode = fromContryInput.value.split(', ')[1];
    let response = await fetch(`https://v6.exchangerate-api.com/v6/${apikey}/latest/${fromCurrencyCode}`);
    if (response.ok) {
        response = await response.json();
        renderCurrenciesExchangeRate(response, fromCurrencyCode);
    } else {
        console.log('Something went wrong with API fetch!');
        console.log(response);
    }
}

// displays choosed currencies exchange rate
function renderCurrenciesExchangeRate(currencyObj, fromCurrencyCode) {
    const renderExchange = document.getElementById('render-exchange');
    const toCurrencyCode = toContryInput.value.split(', ')[1];
    const fromCurrencyName = getCurrencyName(fromCurrencyCode);
    const toCurrencyName = getCurrencyName(toCurrencyCode);

    renderExchange.textContent = `${amountToExchangeInput.value} "${fromCurrencyName.name}"
     is ${currencyObj.conversion_rates[toCurrencyCode] * amountToExchangeInput.value}
     in "${toCurrencyName.name}"`;
}

// gets currency name
function getCurrencyName(currencyCode) {
    return currencies.find(currency => {
        if (currency.code === currencyCode) return currency.name;
    });
}

// ---------------------------------------------------------
// ------------------------ 6.  Notes ----------------------
// ---------------------------------------------------------

// get saved note from localStorage and saves new
function getNotesAndSave() {
    const noteTextarea = document.getElementById('note-textarea');
    const savedNotes = localStorage.getItem('notes');
    noteTextarea.value = savedNotes;
    noteTextarea.addEventListener('blur', () => {
        localStorage.setItem('notes', noteTextarea.value);
    });
}

// ---------------------------------------------------------
// ------------- 7. Randomize background image -------------
// ---------------------------------------------------------

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

I din readme-fil på github ska du ha med ett resonemang kring din kod. I denna ska du nyanserat resonera kring styrkor och brister i ditt genomförandet, i din kod.

VG-nivån bedöms genom kvalitén på koden i kombination med din förmåga att se just styrkor och brister i den.
*/