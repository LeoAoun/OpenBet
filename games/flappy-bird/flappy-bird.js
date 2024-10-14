import {
  userLogged,
  updateUserBalance,
  updateLocalStorage,
} from "../../scripts/global.js";

// DOM elements
const userBalance = document.getElementById("user-balance");
const exitToHome = document.getElementById("exit-to-home");

// Bet elements
const betContainer = document.getElementById("bet-container");
const betInput = document.getElementById("bet-input");
const pipeInput = document.getElementById("pipe-input");
const startGameBtn = document.getElementById("start-game-button");
const openHowToPlay = document.getElementById("open-how-to-play");

// How to play aside
const howToPlayAside = document.getElementById("how-to-play-aside");
const closeHowToPlay = document.getElementById("close-how-to-play");

// Game elements
const flappyBirdContainer = document.getElementById("flappy-bird-container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./assets/flappy-bird.png";

// Audio elements
const musicAudio = document.getElementById("audio-music");
const swingAudio = document.getElementById("audio-swing");
const pointAudio = document.getElementById("audio-point");
const hitAudio = document.getElementById("audio-hit");
const dieAudio = document.getElementById("audio-die");

// End game elements
const endGameAside = document.getElementById("end-game-aside");
const endGameMessage1 = document.getElementById("end-game-message-1");
const endGameMessage2 = document.getElementById("end-game-message-2");
const exitToFlappyBirdMenu = document.getElementById(
  "exit-to-flappy-bird-menu"
);

// Audio settings
musicAudio.volume = 0.3;
swingAudio.volume = 0.3;
pointAudio.volume = 0.3;
hitAudio.volume = 0.3;
dieAudio.volume = 0.3;

// Game variables
let gamePlaying = false;
const gravity = 0.3;
const speed = 2.2;
const birdSize = { width: 51, height: 36 };
const jump = -7.5;
const cTenth = canvas.width / 10;

let index = 0;
let bestScore = 0;
let flight;
let flyHeight;
let currentScore;
let pipes;

// User variables
let userData = userLogged();

// Pipe variables
const pipeWidth = 78;
const pipeGap = 250;

// Generate random pipe Y position
const getPipeY = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth)) + pipeWidth;

// Reset the game
const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - birdSize.height / 2;
  pipes = Array(3)
    .fill()
    .map((_, i) => [canvas.width + i * (pipeGap + pipeWidth), getPipeY()]);
};

// Draw the background
const drawBackground = () => {
  // First part of background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  // Second part of background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(index * (speed / 2)) % canvas.width,
    0,
    canvas.width,
    canvas.height
  );
};

// Draw the pipes
const drawPipes = () => {
  pipes.forEach((pipe) => {
    pipe[0] -= speed;

    // Upper pipe
    ctx.drawImage(
      img,
      432,
      588 - pipe[1],
      pipeWidth,
      pipe[1],
      pipe[0],
      0,
      pipeWidth,
      pipe[1]
    );

    // Lower pipe
    ctx.drawImage(
      img,
      432 + pipeWidth,
      108,
      pipeWidth,
      canvas.height - pipe[1] + pipeGap,
      pipe[0],
      pipe[1] + pipeGap,
      pipeWidth,
      canvas.height - pipe[1] + pipeGap
    );

    // If the pipe has moved out of the screen
    if (pipe[0] <= -pipeWidth) {
      pointAudio.play();
      currentScore++;
      bestScore = Math.max(bestScore, currentScore);
      if (currentScore >= pipeInput.value) {
        wonGame(true);
      }
      pipes = [
        ...pipes.slice(1),
        [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, getPipeY()],
      ];
    }

    // Verify if the bird hits the pipe
    if (
      [
        pipe[0] <= cTenth + birdSize.width,
        pipe[0] + pipeWidth >= cTenth,
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + birdSize.height,
      ].every(Boolean)
    ) {
      hitAudio.play();
      wonGame(false);
      dieAudio.play();
    }
  });
};

// Draw the bird
const drawBird = () => {
  const birdFrame = Math.floor((index % 9) / 3) * birdSize.height;
  const birdX = gamePlaying ? cTenth : canvas.width / 2 - birdSize.width / 2;

  ctx.drawImage(
    img,
    432,
    birdFrame,
    birdSize.width,
    birdSize.height,
    birdX,
    flyHeight,
    birdSize.width,
    birdSize.height
  );

  if (gamePlaying) {
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - birdSize.height);
  } else {
    swingAudio.pause();
    flyHeight = canvas.height / 2 - birdSize.height / 2;
    ctx.font = "1rem 'Press Start 2P', cursive";
    ctx.fillText("Clique para jogar", 80, 365);
  }
};

// Function to start the game after the user bets
function startGameAfterBet() {
  let betValue = betInput.value.replace(/\D/g, "");
  betValue = parseInt(betValue, 10);

  if (betValue === 0 || isNaN(betValue) || pipeInput.value === "") {
    alert("Insira um valor para apostar!");
    return;
  } else if (pipeInput.value < 3) {
    alert("Insira um valor maior ou igual a 3 para o número de canos!");
    return;
  } else if (betValue <= userData.balance) {
    betContainer.style.display = "none"; // Hide the bet screen
    flappyBirdContainer.style.display = "flex"; // Show the game screen
    setup();
  } else {
    alert("Saldo insuficiente.");
  }
}

// Render the game
const render = () => {
  index++;
  drawBackground();
  
  if (gamePlaying) {
    musicAudio.play();
    drawPipes();
  }

  drawBird();

  document.getElementById("bestScore").textContent = `Melhor: ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).textContent = `Atual: ${currentScore}`;

  window.requestAnimationFrame(render);
};

const wonGame = (winned) => {
  musicAudio.pause(); // Pause the music
  musicAudio.currentTime = 0; // Reset the music time

  let betValue = betInput.value.replace(/\D/g, "");
  betValue = parseInt(betValue, 10);

  let winnings = 0;

  if (winned) {
    //Multiplier increases by 1% for each pipe passed
    const multiplier = 1 + currentScore * 0.01;
    winnings = betValue * multiplier;
    userData.balance += winnings - betValue; // Add the winnings to the balance
  } else {
    userData.balance -= betValue; // Subtract the bet value from the balance
  }

  // Update the user balance in the DOM
  endGameAside.style.display = "flex";
  endGameMessage1.textContent = winned ? "Você venceu!" : "Você perdeu!";
  endGameMessage2.textContent = winned
    ? `Seu prêmio é de R$ ${(winnings - betValue).toFixed(2)}`
    : "Tente novamente!";

  updateLocalStorage(userData); // Update the user balance in localStorage
  updateUserBalance(userBalance); // Update the user balance in the DOM

  gamePlaying = false;
  setup();
};

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

// Parse the pipe input to integer format
pipeInput.addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "");
  // Limit the number of foods required to win
  e.target.value = Math.max(e.target.value, 3);
});

// Open and close the how to play aside
openHowToPlay.addEventListener("click", () => {
  howToPlayAside.style.display = "flex";
});

closeHowToPlay.addEventListener("click", () => {
  howToPlayAside.style.display = "none";
});

// Start the game when the user clicks the button
startGameBtn.addEventListener("click", startGameAfterBet);

// Exit to the flappy bird menu
exitToFlappyBirdMenu.addEventListener("click", () => {
  endGameAside.style.display = "none";
  flappyBirdContainer.style.display = "none";
  betContainer.style.display = "flex";
});

// Play the game
canvas.addEventListener("click", () => (gamePlaying = true));

// Control the bird with click and space bar
window.onclick = () => {
  swingAudio.play();
  flight = jump;
};
window.onkeydown = (e) => {
  if (e.keyCode === 32) {
    swingAudio.play();
    flight = jump;
  }
};

// Start the game
setup();
img.onload = render;

// Update the user balance in the DOM
updateUserBalance(userBalance);
