import { userLogged } from './global.js';


const headerNotLogged = document.getElementById("header-not-logged");
const headerLogged = document.getElementById("header-logged");
const userBalance = document.getElementById("user-balance");
const logoutButton = document.getElementById("logout");

// Function to update the header based on login state
export const updateHeader = () => {
  const user = userLogged();
  if (user) {
    const { balance } = user;
    userBalance.textContent = "R$ " + balance.toFixed(2);
    headerNotLogged.style.display = "none";
    headerLogged.style.display = "flex";
  } else {
    headerNotLogged.style.display = "flex";
    headerLogged.style.display = "none";
  }
};

// Event listener to update the header when the storage changes
window.addEventListener("storage", () => {
  updateHeader();
});

// Logout button event listener
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("userLogged");
  updateHeader();
});

// Initial update of the header
updateHeader();
