import { userLogged, updateUserBalance, updateLocalStorage } from "../../scripts/global.js";

const userBalance = document.getElementById("user-balance");
const exitToHome = document.getElementById("exit-to-home");

// Bet elements
const betContainer = document.getElementById("bet-container");
const betInput = document.getElementById("bet-input");
const kmInput = document.getElementById("km-input");
const startGameBtn = document.getElementById("start-game-button");
const openHowToPlay = document.getElementById("open-how-to-play");

// How to play aside
const howToPlayAside = document.getElementById("how-to-play-aside");
const closeHowToPlay = document.getElementById("close-how-to-play");

// Count
const countdown = document.getElementById("countdown");

// Game elements
const dinoContainer = document.getElementById("board-container");
const boardDiv = document.getElementById("board");

// End game elements
const endGameAside = document.getElementById("end-game-aside");
const endGameMessage1 = document.getElementById("end-game-message-1");
const endGameMessage2 = document.getElementById("end-game-message-2");
const exitToDinoMenu = document.getElementById("exit-to-snake-menu");

// User variables
let userData = userLogged();

// Countdown variables
let countdownInterval; // Variable to store the countdown interval

//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// Flag to track if the countdown has already started
let countdownStarted = false;

// Start the countdown before the game starts
function startCountdown() {
  // Prevent starting the countdown if it's already running
  if (countdownStarted) return;

  clearInterval(countdownInterval);
  let countdownValue = 3;
  countdown.style.display = "flex";
  countdown.innerHTML = countdownValue;
  countdownInterval = setInterval(() => {
    countdownValue--;
    countdown.innerHTML = countdownValue;
    if (countdownValue === 0) {
      clearInterval(countdownInterval);
      countdown.style.display = "none";
      startGame();
    }
  }, 1000);

  // Set the flag to true after the countdown has started
  countdownStarted = true;
}

// Function to start the game after the user bets
function startGameAfterBet() {
  let betValue = betInput.value.replace(/\D/g, "");
  betValue = parseInt(betValue, 10);

  if (betValue === 0 || isNaN(betValue) || kmInput.value === "") {
    toastr.error("Insira um valor válido para a aposta");
    return;
  } else if (kmInput.value < 1) {
    toastr.error("A quantidade mínima de quilômetros é 1");
    return;
  } else if (betValue <= userData.balance) {
    betContainer.style.display = "none"; // Hide the bet screen
    dinoContainer.style.display = "flex"; // Show the game screen
    startCountdown();
  } else {
    toastr.error("Saldo insuficiente para a aposta");
  }
}

function startGame() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  dinoImg = new Image();
  dinoImg.src = "./img/dino.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
  document.addEventListener("keydown", moveDino);
}

function calcBetResult() {
  let betValue = betInput.value.replace(/\D/g, "");
  let kmValue = kmInput.value;
  const km = Math.floor(score / 1000);

  if (km >= kmValue) {
    const multiplier = 1 + km * 0.01;
    const winnings = betValue * multiplier - betValue;
    userData.balance += winnings; // Add the winnings to the balance

    console.log("Você venceu!");

    endGameMessage1.innerHTML = "Você venceu!";
    endGameMessage2.innerHTML = `Seu prêmio é de R$ ${winnings.toLocaleString("pt-BR")}`;
    endGameAside.style.display = "flex"; // Show the end game screen

    gameOver = true;

    updateLocalStorage(userData); // Update the user balance in localStorage
    updateUserBalance(userBalance); // Update the user balance in the DOM
  } else if (gameOver && km < kmValue) {
    userData.balance -= betValue;

    endGameMessage1.innerHTML = "Você perdeu!";
    endGameMessage2.innerHTML = `Tente novamente!`;
    endGameAside.style.display = "flex"; // Show the end game screen

    updateLocalStorage(userData); // Update the user balance in localStorage
    updateUserBalance(userBalance); // Update the user balance in the DOM
  }
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImg.src = "./img/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  //score
  context.fillStyle = "black";
  context.font = "24px courier";
  score++;
  calcBetResult();
  context.fillText(score, 10, 20);
}

function moveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    //jump
    velocityY = -10;
  } else if (e.code == "ArrowDown" && dino.y == dinoY) {
    //duck
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random(); //0 - 0.9999...

  if (placeCactusChance > 0.9) {
    //10% you get cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% you get cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% you get cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

// Exit to home page
exitToHome.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

// Parse the bet input to currency format
betInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  e.target.value = "R$ " + (value ? parseInt(value, 10).toLocaleString("pt-BR") : "0");
});

kmInput.addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "");
  // Limit the number of kms required to win
  e.target.value = Math.max(e.target.value, 1);
});

// Open and close the how to play aside
openHowToPlay.addEventListener("click", () => {
  howToPlayAside.style.display = "flex";
});

// Close the how to play aside
closeHowToPlay.addEventListener("click", () => {
  howToPlayAside.style.display = "none";
});

// Start the game when the user clicks the button
startGameBtn.addEventListener("click", startGameAfterBet);

// Exit to the dino menu
exitToDinoMenu.addEventListener("click", () => {
  endGameAside.style.display = "none"; // Hide the end game screen
  dinoContainer.style.display = "none"; // Hide the game screen
  betContainer.style.display = "flex"; // Show the bet screen
  window.location.reload();
});

// Update the user balance in the DOM
updateUserBalance(userBalance);
