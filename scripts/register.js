const registerForm = document.getElementById("register-form");
const registerEmail = document.getElementById("register-email");
const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");
const registerConfirmPassword = document.getElementById("register-confirm-password");

// Handle the registration form submission
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = registerEmail.value;
    const username = registerUsername.value;
    const password = registerPassword.value;
    const confirmPassword = registerConfirmPassword.value;

    if (password !== confirmPassword) {
        alert("Senhas não coincidem");
        return;
    }

    // Get users from localStorage or an empty object
    let users = JSON.parse(localStorage.getItem("users")) || {};

    // Verify if the email or username already exists
    if (Object.values(users).some(user => user.email === email)) {
        alert("E-mail já existe");
        return;
    }

    // Verify if the email or username already exists
    if (users[username]) {
        alert("Nome de usuário já existe");
        return;
    }

    // Hash the password
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Add the new user to the object
    users[username] = {
        email: email,
        password: hashedPassword,
        balance: 0
    };

    // Save the object back to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // If the registration is successful
    alert("Registro bem-sucedido!");

    // Redirect to the login page
    window.location.href = "login.html";
});
