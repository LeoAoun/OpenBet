// Function to check if the user is logged in
export const userLogged = () => {
  const user = JSON.parse(localStorage.getItem("userLogged"));
  return user ? user : null;
};

export const updateLocalStorage = (userData) => {
  // Update the userLogged in localStorage
  localStorage.setItem("userLogged", JSON.stringify(userData));

  // Update the user balance in the users object
  let users = JSON.parse(localStorage.getItem("users"));
  users[userData.username].balance = userData.balance;
  localStorage.setItem("users", JSON.stringify(users));
};

// Function to update the user balance in the DOM
export const updateUserBalance = (userBalance) => {
  const userData = userLogged();
  userBalance.textContent =
    "R$ " + userData.balance.toFixed(2).toLocaleString("pt-BR");
};
