let email = document.getElementById('email');
let password = document.getElementById('password');

function signupUser() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let confirmPassword = document.getElementById('confirm-password').value;
    if (password.value !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }   
    users.push({ email: email.value, password: password.value });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Signup successful! Please login.");
    window.location.href = "./login.html";
}
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    signupUser();
}

);

function loginUser() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let user = users.find(u => u.email === email && u.password === password);
    if (user) {
        alert("Login successful!");         
        // Redirect to dashboard or home page
        window.location.href = "./dashboard.html";
    } else {
        alert("Invalid email or password!");
    }   
}
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    loginUser();
});






  