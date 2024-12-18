import { userLogged, updateUserBalance, updateLocalStorage } from "./global.js";

const gameCardSlotMachine = document.getElementById("game-card-slot-machine");
const gameCardFlappyBird = document.getElementById("game-card-flappy-bird");
const gameCardSnake = document.getElementById("game-card-snake");
const gameCardDino = document.getElementById("game-card-dino");

const userData = userLogged();

gameCardSlotMachine.addEventListener("click", () => {
  if (userData) {
    window.location.href = "../games/slot-machine/slot-machine.html";
  }
});

gameCardFlappyBird.addEventListener("click", () => {
  if (userData) {
    window.location.href = "../games/flappy-bird/flappy-bird.html";
  }
});

gameCardSnake.addEventListener("click", () => {
  if (userData) {
    window.location.href = "../games/snake/snake.html";
  }
});

gameCardDino.addEventListener("click", () => {
  if (userData) {
    window.location.href = "../games/roulette/dino.html";
  }
});
