const gameCardImg = document.querySelector(".game-card-img");
const gameCardHover = document.getElementById("game-card-hover");

gameCardImg.addEventListener("mouseover", () => {
  gameCardHover.style.display = "flex";
});

gameCardHover.addEventListener("mouseout", () => {
});
