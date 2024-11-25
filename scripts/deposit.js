import { userLogged } from "./global.js";
import { updateHeader } from "./header.js";

const depositForm = document.getElementById("deposit-form");
const depositButton = document.getElementById("deposit-button");
const depositBackground = document.getElementById("deposit-background");
const depositAmount = document.getElementById("deposit-amount");
const closeDepositModal = document.getElementById("close-deposit-modal");

// Open the modal
depositButton.addEventListener("click", () => {
  depositBackground.style.display = "flex";
});

// Close the modal
closeDepositModal.addEventListener("click", () => {
  depositBackground.style.display = "none";
});

// Format the input value
depositAmount.addEventListener("input", function (e) {
  // Remove everything that is not a number
  let value = e.target.value.replace(/\D/g, "");
  // Add the currency symbol and format the number
  e.target.value = "R$ " + (value ? parseInt(value, 10).toLocaleString("pt-BR") : "0");
});

// Handle the deposit confirmation
depositForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let userData = userLogged();
  let currentBalance = userData.balance;

  // Get the deposit amount from the input field (removing "R$" and formatting)
  let depositValue = depositAmount.value.replace(/\D/g, "");
  depositValue = parseInt(depositValue, 10); // Convert to integer

  // Add the deposit value to the user's current balance
  if (depositValue > 0) {
    userData.balance = currentBalance + depositValue;
    localStorage.setItem("userLogged", JSON.stringify(userData));

    let users = JSON.parse(localStorage.getItem("users"));
    users[userData.username].balance = userData.balance;
    localStorage.setItem("users", JSON.stringify(users));

    updateHeader();

    // Clear the input field
    depositAmount.value = "";

    toastr.success(`Depósito de R$ ${depositValue.toFixed(2)} efetuado com sucesso!`);
    // Close the modal
    depositBackground.style.display = "none";
  } else {
    toastr.error("Valor de depósito inválido!");
  }
});
