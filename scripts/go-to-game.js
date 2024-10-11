const gameCardSlotMachine = document.getElementById("game-card-slot-machine");
const gameCardFlappyBird = document.getElementById("game-card-flappy-bird");
const gameCardSnake = document.getElementById("game-card-snake");

gameCardSlotMachine.addEventListener("click", () => {
  window.location.href = "../games/slot-machine/slot-machine.html";
});

gameCardFlappyBird.addEventListener("click", () => {
  window.location.href = "../games/flappy-bird/flappy-bird.html";
});

gameCardSnake.addEventListener("click", () => {
  window.location.href = "../games/snake/snake.html";
});
