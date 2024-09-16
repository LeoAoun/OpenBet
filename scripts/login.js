const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

// Handle the login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = loginUsername.value;
  const password = loginPassword.value;

  // Retrieve the users object from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || {};

  // Retrieve the user from the users object
  const user = users[username];

  // Hash the entered password
  const hashedPassword = CryptoJS.SHA256(password).toString();

  // Check if the user exists and the password is correct
  if (!user || user.password !== hashedPassword) {
    alert("Nome de usuário ou senha incorretos");
    return;
  }

  // Save the user visible data in a variable
  userVisibleData = {
    username: username,
    balance: user.balance,
  };

  // Save the logged user in localStorage
  localStorage.setItem("userLogged", JSON.stringify(userVisibleData));

  // If credentials are correct
  alert("Login bem-sucedido!");

  // Redirect to the home page
  window.location.href = "home.html";
});
