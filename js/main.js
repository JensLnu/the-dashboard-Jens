
document.addEventListener("DOMContentLoaded", addFunctionality);

function addFunctionality() {
    showClock();
    showDate();
    setInterval(showClock, 1000);
}

// gets the time and render it
function showClock() {
    const timePlaceholder = document.querySelector('#time-and-date li');
    const date = new Date;
    timePlaceholder.textContent = date.toLocaleTimeString();
}

// gets the date and render it
function showDate() {
    const datePlaceholder = document.querySelector('#time-and-date li').nextElementSibling;
    const date = new Date;
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    datePlaceholder.textContent = `${date.getDay()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// enabel the main header to be changed by the user
function changeMenu() {
    const header = document.querySelector('h1');
    header.addEventListener('click', () => {
        
    });
}