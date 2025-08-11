const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const gameOverMenu = document.getElementById("gameOverMenu")
const pauseMenu = document.getElementById("pauseMenu");
const pauseScore = document.getElementById("score");
const startButtons = document.querySelectorAll("#startBtn");
const scoreTexts = document.querySelectorAll("#score");

const gridSize = 40;
const tileCount = canvas.width / gridSize;

let sneck = [{ x: randomSpawn(), y: randomSpawn() }];
let dx = 1;
let dy = 0;
let food = randomFood();
let score = 0;
let gameInterval;
let paused = false;

// Load images
const headImage = new Image();
headImage.src = "./assets/head-close-mouth.png";
const neckHorizontalImage = new Image();
neckHorizontalImage.src = "./assets/neck-horizontal.png";
const neckVerticalImage = new Image();
neckVerticalImage.src = "./assets/neck-vertical.png";

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max - min + 1))
}

function randomSpawn() {
  return generateRandomInteger(0, tileCount-4)
}

// Game Loop
function startGame() {
  sneck = [{ x: randomSpawn(), y: randomSpawn() }];
  dx = 1;
  dy = 0;
  score = 0;
  food = randomFood();
  paused = false;

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100); // Adjust speed here
}

// Random food position
function randomFood() {
  let newFood;

  // Loops infinitely until return statement.
  // Will end loop, then spawn food when random tile for new food is empty.
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    }

    // Code to avoid spawning food in tiles with sneck
    if (!sneck.some(neck => neck.x === newFood.x && neck.y === newFood.y)) {
      return newFood;
    }
  }
}

// Draw everything
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < sneck.length; i++) {
    const neck = sneck[i];
    const x = neck.x * gridSize;
    const y = neck.y * gridSize;

    if (i === 0) {
      // Draw head with rotation
      context.save();
      context.translate(x + gridSize / 2, y + gridSize / 2);
      if (dx === 1) context.rotate(Math.PI / 2);         // right
      else if (dx === -1) context.rotate(-Math.PI / 2); // left
      else if (dy === -1) context.rotate(0); // up
      else if (dy === 1) context.rotate(Math.PI);  // down
      context.drawImage(headImage, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
      context.restore();
    } else {
      // Determine if sneck is horizontal or vertical
      const prev = sneck[i - 1];
      if (prev.x !== neck.x) {
        // Horizontal
        context.drawImage(neckHorizontalImage, x, y, gridSize, gridSize);
      } else {
        // Vertical
        context.drawImage(neckVerticalImage, x, y, gridSize, gridSize);
      }
    }
  }

  // Draw food
  context.fillStyle = "red";
  context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw score
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("Score: " + score, 10, 20);
}

// Update game logic
function update() {
  const head = { x: sneck[0].x + dx, y: sneck[0].y + dy };

  // Collision with walls
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  // Collision with self
  for (let i = 1; i < sneck.length; i++) {
    if (sneck[i].x === head.x && sneck[i].y === head.y) {
      gameOver();
      return;
    }
  }

  sneck.unshift(head);

  // Eating food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
  } else {
    sneck.pop();
  }
}

function updateScore() {
  scoreTexts.forEach((scoreText) => {
    scoreText.textContent = "Score: " + score;
  });
}

function gameLoop() {
  if (paused) {
    pauseMenu.style.display = "block";
    return;
  }



  pauseMenu.style.display = "none";
  updateScore();
  update();
  draw();
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverMenu.style.display = "block";
}

// Controls (Arrow keys + WASD)
document.addEventListener("keydown", (e) => {
  if ((e.key === "ArrowUp" || e.key === "w") && dy === 0) {
    dx = 0;
    dy = -1;
  }
  if ((e.key === "ArrowDown" || e.key === "s") && dy === 0) {
    dx = 0;
    dy = 1;
  }
  if ((e.key === "ArrowLeft" || e.key === "a") && dx === 0) {
    dx = -1;
    dy = 0;
  }
  if ((e.key === "ArrowRight" || e.key === "d") && dx === 0) {
    dx = 1;
    dy = 0;
  }
  if (e.key === "Escape" || e.key === " ") {
    paused = !paused;
  }
});

startButtons.forEach((startButton) => {
  startButton.addEventListener("click", (event) => {
    mainMenu.style.display = "none";
    gameOverMenu.style.display = "none";
    startGame();
  });
});
