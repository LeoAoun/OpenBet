const userBalance = document.getElementById("user-balance");
const exitToHome = document.getElementById("exit-to-home");
const status = document.getElementById("status");
const openWinTable = document.getElementById("open-win-table-button");
const winTable = document.getElementById("win-table");
const closeWinTable = document.getElementById("close-win-table-button");
const bet = document.getElementById("play");
const betInput = document.getElementById("bet-input");

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

let doing = false;

const numberOfFruits = 15;

const userLogged = () => {
  const user = JSON.parse(localStorage.getItem("userLogged"));
  return user ? user : null;
};

const updateUserBalance = () => {
  const userData = userLogged();
  userBalance.textContent =
    "R$ " + userData.balance.toFixed(2).toLocaleString("pt-BR");
};

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

function doSlot() {
  if (doing) return;

  let userData = userLogged();
  let currentBalance = userData.balance;

  let betValue = betInput.value.replace(/\D/g, "");
  betValue = parseInt(betValue, 10); // Parse the bet value to integer

  if (betValue === 0 || isNaN(betValue)) {
    alert("Insira um valor para apostar!");
    return;
  } else if (betValue <= currentBalance) {
    doing = true;

    const numChanges = 200;
    const numberSlot1 = numChanges + randomInt(1, numberOfFruits);
    const numberSlot2 =
      numChanges + 20 * (numberOfFruits / 2) + randomInt(1, numberOfFruits);
    const numberSlot3 =
      numChanges + 40 * (numberOfFruits / 2) + randomInt(1, numberOfFruits);

    let i1 = 0;
    let i2 = 0;
    let i3 = 0;

    status.innerHTML = "GIRANDO...";

    // Play spin sound
    audioSpin.loop = true;
    audioSpin.play();

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

        // Stop spin sound
        audioSpin.loop = false;
        audioSpin.pause();
        audioSpin.currentTime = 0; // Reset the sound

        // After the slot stops, check if the user won
        const winned = testWin();
        processResult(winned, betValue, userData, currentBalance);
      }
    }, 10);

    function updateSlot(id, counter, limit) {
      if (counter >= limit) return;
      const slotTile = document.getElementById(id);
      const currentIndex = parseInt(slotTile.dataset.index || "1");

      const newIndex = currentIndex === numberOfFruits ? 1 : currentIndex + 1;
      slotTile.dataset.index = newIndex;

      const tileImage = `res/fruits/${getTileName(newIndex)}.png`;
      slotTile.src = tileImage;
    }
  } else {
    alert("Saldo insuficiente!");
    return;
  }

  updateUserBalance();
}

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

  // Update the userLogged in localStorage
  localStorage.setItem("userLogged", JSON.stringify(userData));

  // Update the user balance in the users object
  let users = JSON.parse(localStorage.getItem("users"));
  users[userData.username].balance = userData.balance;
  localStorage.setItem("users", JSON.stringify(users));

  doing = false;
  updateUserBalance();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exitToHome.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

// Parse the bet input to currency format
betInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  e.target.value =
    "R$ " + (value ? parseInt(value, 10).toLocaleString("pt-BR") : "0");
});

openWinTable.addEventListener("click", () => {
  winTable.style.display = "flex";
});

closeWinTable.addEventListener("click", () => {
  winTable.style.display = "none";
});

bet.addEventListener("click", doSlot);

updateUserBalance();
