//login page

function goGuest() {
window.location.href = "home.html";
}
function goLogin() {
window.location.href = "login.html";
}

function submitLogin() {

let email = document.getElementById("email").value;
let pass = document.getElementById("password").value;

if(email === "" || pass === "") {
alert("Please fill all fields");
return;
}

window.location.href = "home.html";
}


function submitLogin() {

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

if(email.length === 0 || password.length === 0) {
alert("Please enter email and password");
return;
}

// Accept ANY email + password
window.location.href = "home.html";
}