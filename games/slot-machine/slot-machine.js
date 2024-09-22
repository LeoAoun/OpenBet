import {
  userLogged,
  updateLocalStorage,
  updateUserBalance,
} from "../../scripts/global.js";

// DOM elements
const userBalance = document.getElementById("user-balance");
const exitToHome = document.getElementById("exit-to-home");

// Slot elements
const status = document.getElementById("status");
const bet = document.getElementById("play");
const betInput = document.getElementById("bet-input");

// Win table elements
const openWinTable = document.getElementById("open-win-table-button");
const winTable = document.getElementById("win-table");
const closeWinTable = document.getElementById("close-win-table-button");

// Audios
const audioWin = document.getElementById("audio-win");
const audioLose = document.getElementById("audio-lose");
const audioSpin = document.getElementById("audio-spin");
const audioCoin = document.getElementById("audio-coin");

// Volume of audios
audioWin.volume = 0.3;
audioLose.volume = 0.3;
audioSpin.volume = 0.3;
audioCoin.volume = 0.3;

let doing = false; // Variable to control if the slot is spinning

const numberOfFruits = 15; // Number of fruits in the slot machine

// Function to get the fruit name based on the index
function getTileName(index) {
  switch (index) {
    case 1:
      return "bananas";
    case 2:
      return "bananas";
    case 3:
      return "bananas";
    case 4:
      return "bananas";
    case 5:
      return "bananas";
    case 6:
      return "grapes";
    case 7:
      return "grapes";
    case 8:
      return "grapes";
    case 9:
      return "grapes";
    case 10:
      return "orange";
    case 11:
      return "orange";
    case 12:
      return "orange";
    case 13:
      return "avocado";
    case 14:
      return "avocado";
    case 15:
      return "strawberry";
    default:
      return "fruits";
  }
}

// Function to play the slot machine
function doSlot() {
  if (doing) return; // If the slot is spinning, return

  let userData = userLogged();
  let currentBalance = userData.balance;

  let betValue = betInput.value.replace(/\D/g, "");
  betValue = parseInt(betValue, 10); // Parse the bet value to integer

  if (betValue === 0 || isNaN(betValue)) {
    alert("Insira um valor para apostar!");
    return;
  } else if (betValue <= currentBalance) {
    doing = true;

    const numChanges = 200; // Number of changes before the slot stops

    // Random number of changes for each slot
    const numberSlot1 = numChanges + randomInt(1, numberOfFruits);
    const numberSlot2 =
      numChanges + 20 * (numberOfFruits / 2) + randomInt(1, numberOfFruits);
    const numberSlot3 =
      numChanges + 40 * (numberOfFruits / 2) + randomInt(1, numberOfFruits);

    // Variables to control the slot
    let i1 = 0;
    let i2 = 0;
    let i3 = 0;

    status.innerHTML = "GIRANDO...";

    audioSpin.loop = true; // Activate loop for spin sound
    audioSpin.play(); // Play spin sound

    // Spin the slot
    const spin1 = setInterval(() => {
      updateSlot("slot1", i1++, numberSlot1);
      if (i1 >= numberSlot1) clearInterval(spin1);
    }, 10);

    const spin2 = setInterval(() => {
      updateSlot("slot2", i2++, numberSlot2);
      if (i2 >= numberSlot2) clearInterval(spin2);
    }, 10);

    const spin3 = setInterval(() => {
      updateSlot("slot3", i3++, numberSlot3);
      if (i3 >= numberSlot3) {
        clearInterval(spin3);

        audioSpin.loop = false; // Stop spin sound
        audioSpin.pause(); // Pause spin sound
        audioSpin.currentTime = 0; // Reset spin sound

        // After the slot stops, check if the user won
        const winned = testWin();
        processResult(winned, betValue, userData, currentBalance);
      }
    }, 10);

    // Function to update the slot
    function updateSlot(id, counter, limit) {
      if (counter >= limit) return;
      const slotTile = document.getElementById(id);
      const currentIndex = parseInt(slotTile.dataset.index || "1");

      const newIndex = currentIndex === numberOfFruits ? 1 : currentIndex + 1;
      slotTile.dataset.index = newIndex;

      const tileImage = `assets/fruits/${getTileName(newIndex)}.png`;
      slotTile.src = tileImage;
    }
  } else {
    alert("Saldo insuficiente!");
    return;
  }

  // Update the user balance in the DOM
  updateUserBalance(userBalance);
}

// Function to check if the user won
function testWin() {
  const slot1 = parseInt(document.getElementById("slot1").dataset.index);
  const slot2 = parseInt(document.getElementById("slot2").dataset.index);
  const slot3 = parseInt(document.getElementById("slot3").dataset.index);

  // Get the fruit name
  const fruit1 = getTileName(slot1);
  const fruit2 = getTileName(slot2);
  const fruit3 = getTileName(slot3);

  // Verify if the user won
  const isWin = fruit1 === fruit2 && fruit2 === fruit3;

  if (isWin) {
    status.innerHTML = "VOCÊ GANHOU!";
    audioWin.play(); // Play win sound
    return true;
  } else {
    status.innerHTML = "VOCÊ PERDEU!";
    audioLose.play(); // Play lose sound
    return false;
  }
}

// Function to process the result
function processResult(winned, betValue, userData, currentBalance) {
  if (winned) {
    switch (slot1) {
      case "bananas":
        userData.balance = currentBalance + betValue * 5;
        break;
      case "grapes":
        userData.balance = currentBalance + betValue * 10;
        break;
      case "orange":
        userData.balance = currentBalance + betValue * 25;
        break;
      case "avocado":
        userData.balance = currentBalance + betValue * 50;
        break;
      case "strawberry":
        userData.balance = currentBalance + betValue * 100;
        break;
      default:
        userData.balance = currentBalance + betValue * 1;
    }

    userData.balance = currentBalance + betValue * 100;
    audioCoin.play(); // Play coin sound when win
  } else {
    userData.balance = currentBalance - betValue;
  }

  doing = false; // Set doing to false
  updateLocalStorage(userData); // Update the user balance in localStorage
  updateUserBalance(userBalance); // Update the user balance in the DOM
}

// Function to generate a random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Exit to home page
exitToHome.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

// Parse the bet input to currency format
betInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  e.target.value =
    "R$ " + (value ? parseInt(value, 10).toLocaleString("pt-BR") : "0");
});

// Open and close the win table
openWinTable.addEventListener("click", () => {
  winTable.style.display = "flex";
});

// Close the win table
closeWinTable.addEventListener("click", () => {
  winTable.style.display = "none";
});

// Play the slot machine
bet.addEventListener("click", doSlot);

// Update the user balance in the DOM
updateUserBalance(userBalance);
