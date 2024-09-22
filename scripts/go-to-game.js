const gameCardSlotMachine = document.getElementById("game-card-slot-machine");
const gameCardSnake = document.getElementById("game-card-snake");

gameCardSlotMachine.addEventListener("click", () => {
  window.location.href = "../games/slot-machine/slot-machine.html";
});

gameCardSnake.addEventListener("click", () => {
  window.location.href = "../games/snake/snake.html";
});
