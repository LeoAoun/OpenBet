import {
  userLogged,
  updateLocalStorage,
  updateUserBalance,
} from "../../scripts/global.js";

// DOM elements
const userBalance = document.getElementById("user-balance");
const exitToHome = document.getElementById("exit-to-home");

// Bet elements
const betContainer = document.getElementById("bet-container");
const betInput = document.getElementById("bet-input");
const foodInput = document.getElementById("food-input");
const startGameBtn = document.getElementById("start-game-button");
const openHowToPlay = document.getElementById("open-how-to-play");

// How to play aside
const howToPlayAside = document.getElementById("how-to-play-aside");
const closeHowToPlay = document.getElementById("close-how-to-play");

// Game elements
const snakeContainer = document.getElementById("snake-container");
const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

// End game elements
const endGameAside = document.getElementById("end-game-aside");
const endGameMessage1 = document.getElementById("end-game-message-1");
const endGameMessage2 = document.getElementById("end-game-message-2");
const exitToSnakeMenu = document.getElementById("exit-to-snake-menu");

// Audios
const audioFood = document.getElementById("audio-food");
const audioWin = document.getElementById("audio-win");
const audioLose = document.getElementById("audio-lose");

// Volume of audios
audioFood.volume = 0.3;
audioWin.volume = 0.3;
audioLose.volume = 0.3;

const box = 32;

const snake = [{ x: 8 * box, y: 8 * box }]; // Initial position of the snake
let direction = "right"; // Initial direction of the snake
let food = getRandomFoodPosition(); // Initial food position
let canChangeDirection = true; // Allow the player to change the direction of the snake
let foodsEaten = 0; // Foods eaten by the player
let requiredFoods = 5; // Number of foods required to win
let betValue = 0; // Value of the bet

let gameSpeed = 100; // Initial speed of the game
let game; // Game interval

// Set the canvas size
function createBG() {
  context.fillStyle = "#fff";
  context.fillRect(0, 0, 16 * box, 16 * box);
}

// Create the snake
function createSnake() {
  snake.forEach(({ x, y }, index) => {
    // Toggle the color of the snake segments
    if (index === 0) {
      context.fillStyle = "#0f0"; // Snake head color
      context.fillRect(x, y, box, box);

      // Draw the eyes of the snake head
      context.fillStyle = "#000";
      context.beginPath();
      if (direction === "right") {
        context.arc(x + 24, y + 8, 4, 0, Math.PI * 2); // Right eye
        context.arc(x + 24, y + 24, 4, 0, Math.PI * 2); // Left eye
      } else if (direction === "left") {
        context.arc(x + 8, y + 8, 4, 0, Math.PI * 2); // Right eye
        context.arc(x + 8, y + 24, 4, 0, Math.PI * 2); // Left eye
      } else if (direction === "up") {
        context.arc(x + 8, y + 8, 4, 0, Math.PI * 2); // Left eye
        context.arc(x + 24, y + 8, 4, 0, Math.PI * 2); // Right eye
      } else if (direction === "down") {
        context.arc(x + 8, y + 24, 4, 0, Math.PI * 2); // Left eye
        context.arc(x + 24, y + 24, 4, 0, Math.PI * 2); // Right eye
      }
      context.fill();
    } else {
      // Toggle the color of the snake segments
      context.fillStyle = index % 2 === 0 ? "#32a852" : "#2a7b32";
      context.fillRect(x, y, box, box);
    }
  });
}

// Create the food
function createFood() {
  context.fillStyle = "#f00";
  context.fillRect(food.x, food.y, box, box);
}

// Function to get a random food position
function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box,
  };
}

// Function to update the direction of the snake
function updateDirection({ keyCode }) {
  // Stop the function if the direction can't be changed
  if (!canChangeDirection) return;

  const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };
  const oppositeDirections = {
    left: "right",
    right: "left",
    up: "down",
    down: "up",
  };
  if (
    directions[keyCode] &&
    direction !== oppositeDirections[directions[keyCode]]
  ) {
    direction = directions[keyCode];
    canChangeDirection = false; // Prevent the player from changing the direction again
  }
}

// Function to start the game
function startGame() {
  // Verify if the snake hit the wall or itself
  if (
    snake[0].x >= 16 * box ||
    snake[0].x < 0 ||
    snake[0].y >= 16 * box ||
    snake[0].y < 0
  ) {
    endGame(false); // Indicate that the player lost
    return; // Stop the function
  }

  snake.slice(1).forEach((segment) => {
    if (snake[0].x === segment.x && snake[0].y === segment.y) {
      endGame(false); // Indicate that the player lost
    }
  });

  createBG();
  createSnake();
  createFood();

  const { x: snakeX, y: snakeY } = getNextPosition();

  if (snakeX === food.x && snakeY === food.y) {
    food = getValidFoodPosition();
    foodsEaten++; // Increment the number of foods eaten

    audioFood.play(); // Play the food sound

    if (foodsEaten >= requiredFoods) {
      endGame(true); // Indicate that the player won
    } else {
      // Increase the speed of the game
      increaseSpeed();
    }
  } else {
    snake.pop();
  }

  snake.unshift({ x: snakeX, y: snakeY });

  canChangeDirection = true; // Allow the player to change the direction of the snake
}

// Function to increase the speed of the game
function increaseSpeed() {
  // Increase the speed of the game
  gameSpeed = Math.max(gameSpeed - 10, 50);

  // Clear the interval and start a new one with the updated speed
  clearInterval(game);
  game = setInterval(startGame, gameSpeed);
}

// Function to start the game after the user bets
function startGameAfterBet() {
  let userData = userLogged();
  let currentBalance = userData.balance;

  betValue = betInput.value.replace(/\D/g, ""); // Remove non-numeric characters
  betValue = parseInt(betValue, 10); // Parse the bet value to integer

  if (betValue === 0 || isNaN(betValue)) {
    alert("Insira um valor para apostar!");
    return;
  } else if (betValue <= currentBalance) {
    // Define the number of foods required to win
    requiredFoods = parseInt(foodInput.value, 10);

    betContainer.style.display = "none"; // Hide the bet screen
    snakeContainer.style.display = "flex"; // Show the game screen

    gameSpeed = 100; // Reset the speed of the game
    game = setInterval(startGame, gameSpeed); // Start the game
  } else {
    alert("Saldo insuficiente.");
  }
}

// Function to get the next position of the snake head
function getNextPosition() {
  const head = { ...snake[0] };
  if (direction === "right") head.x += box;
  if (direction === "left") head.x -= box;
  if (direction === "up") head.y -= box;
  if (direction === "down") head.y += box;
  return head;
}

// Function to get a valid food position
function getValidFoodPosition() {
  let newFood;
  do {
    newFood = getRandomFoodPosition();
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );
  return newFood;
}

// Function to end the game
function endGame(isWin) {
  clearInterval(game);

  let userData = userLogged();
  if (isWin) {
    //Multiplier increases by 1% for each food eaten
    const multiplier = 1 + foodsEaten * 0.01;
    const winnings = betValue * multiplier;
    userData.balance += winnings; // Add the winnings to the balance

    audioWin.play(); // Play the win sound

    endGameMessage1.textContent = "Você venceu!";
    endGameMessage2.textContent = `Seu prêmio é de: R$ ${winnings
      .toFixed(2)
      .toLocaleString("pt-BR")}!`;
    endGameAside.style.display = "flex"; // Show the end game screen
  } 
  else {
    audioLose.play(); // Play the lose sound

    userData.balance -= betValue; // Subtract the bet value from the balance

    endGameMessage1.textContent = "Você perdeu!";
    endGameMessage2.textContent = "Tente novamente!";
    endGameAside.style.display = "flex"; // Show the end game screen
  }

  updateLocalStorage(userData); // Update the user balance in localStorage
  updateUserBalance(userBalance); // Update the user balance in the DOM
}

// Function to reset the game
function resetGame() {
  foodsEaten = 0;
  snake.length = 1;
  snake[0] = { x: 8 * box, y: 8 * box };
  direction = "right";
  food = getRandomFoodPosition();
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

// Parse the food input to integer format
foodInput.addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "");
  // Limit the number of foods required to win
  e.target.value = Math.max(e.target.value, 5);
});

// Open and close the how to play aside
openHowToPlay.addEventListener("click", () => {
  howToPlayAside.style.display = "flex";
});

// Close the how to play aside
closeHowToPlay.addEventListener("click", () => {
  howToPlayAside.style.display = "none";
});

// Start the game after the user bets
startGameBtn.addEventListener("click", startGameAfterBet);

// Exit to snake menu
exitToSnakeMenu.addEventListener("click", () => {
  resetGame();
  endGameAside.style.display = "none"; // Hide the end game screen
  snakeContainer.style.display = "none"; // Hide the game screen
  betContainer.style.display = "flex"; // Show the bet screen
});

// Event listener to update the direction of the snake
document.addEventListener("keydown", updateDirection);

// Update the user balance in the DOMG
updateUserBalance(userBalance);
