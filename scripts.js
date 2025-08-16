// #region HTML objects
const canvas = document.getElementById("gameCanvas");
const mainMenu = document.getElementById("mainMenu");
const gameOverMenu = document.getElementById("gameOverMenu");
const pauseMenu = document.getElementById("pauseMenu");
const startButtons = document.querySelectorAll("#startBtn");
const scoreTexts = document.querySelectorAll("#score");
const resumeButton = document.getElementById("resumeBtn");
const restartButtons = document.querySelectorAll("#restartBtn");

// #endregion

// #region Images
const backgroundImage = new Image();
backgroundImage.src = "./assets/background-image.png";
const headImageMouthClosed = new Image();
headImageMouthClosed.src = "./assets/head-closed-mouth-transparent.png";
const headImageMouthOpen = new Image();
headImageMouthOpen.src = "./assets/head-open-mouth-transparent.png";
const tailImage = new Image();
tailImage.src = "./assets/tail-transparent.png";
const neckHorizontalImage = new Image();
neckHorizontalImage.src = "./assets/neck-horizontal-transparent.png";
const neckVerticalImage = new Image();
neckVerticalImage.src = "./assets/neck-vertical-transparent.png";
const neckConnectorImage = new Image();
neckConnectorImage.src = "./assets/neck-connector-transparent.png";
// #endregion

// #region Orb Class
class Orb {
  constructor(image, frameCount, frameWidth, frameHeight, animationSpeed) {
    this.image = new Image();
    this.image.src = image;
    this.frameCount = frameCount;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.animationSpeed = animationSpeed;
    this.currentFrame = 0;
    this.animationCounter = 0;
  }

  nextFrame() {
    return this.currentFrame + 1;
  }

  resetFrame() {
    this.currentFrame = 0;
    return this.currentFrame;
  }

  nextAnimationCounter() {
    this.animationCounter++;
    return this.animationCounter;
  }

  resetAnimationCounter() {
    this.animationCounter = 0;
    return this.animationCounter;
  }
}
// #endregion

// #region Orb Definitions
let foodOrb = new Orb("./assets/food-sprite-sheet.png", 10, 100, 100, 1);
// #endregion

// #region States
const context = canvas.getContext("2d");
let gridSize;
let tileCount;
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let paused = false;
let frameCount = 0;
let currentHeadImage = headImageMouthClosed;
let speed = 150;
let animationFrameInterval = Math.floor(speed / 50);
let xInitial;
let yInitial;
let sneck = [{ x: xInitial, y: yInitial }];
let food = randomFood();
// #endregion

// #region Dynamic Game Resizing
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
// #endregion

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function randomSpawn() {
  return generateRandomInteger(0, tileCount - 4);
}

// Game Loop
function startGame() {
  xInitial = randomSpawn();
  yInitial = randomSpawn();
  sneck = [{ x: xInitial, y: yInitial }];
  dx = 0;
  dy = 0;
  score = 0;
  food = randomFood();
  paused = false;
  mainMenu.style.display = "none";
  pauseMenu.style.display = "none";
  gameOverMenu.style.display = "none";

  backgroundImage.onload = () => {
    // Only set this once at startup
    gameLoop();
  };

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
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
    };

    // Code to avoid spawning food in tiles with sneck
    if (!sneck.some((neck) => neck.x === newFood.x && neck.y === newFood.y)) {
      return newFood;
    }
  }
}

// Draw everything
function draw() {
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  for (let i = 0; i < sneck.length; i++) {
    const neck = sneck[i];
    const x = neck.x * gridSize;
    const y = neck.y * gridSize;

    if (i === 0) {
      // Animate only when moving

      if (dx !== 0 || dy !== 0) {
        frameCount++;
        if (frameCount % animationFrameInterval === 0) {
          currentHeadImage =
            currentHeadImage === headImageMouthClosed
              ? headImageMouthOpen
              : headImageMouthClosed;
        }
      } else {
        currentHeadImage = headImageMouthClosed; // idle still image
      }

      // Draw head with rotation
      context.save();
      context.translate(x + gridSize / 2, y + gridSize / 2);
      if (dx === 1) context.rotate(Math.PI / 2); // right
      else if (dx === -1) context.rotate(-Math.PI / 2); // left
      else if (dy === -1) context.rotate(0); // up
      else if (dy === 1) context.rotate(Math.PI); // down
      context.drawImage(
        currentHeadImage,
        -gridSize / 2,
        -gridSize / 2,
        gridSize,
        gridSize
      );
      context.restore();
    } else if (i === sneck.length - 1) {
      // Tail segment
      const prev = sneck[i - 1];
      const tailDir = { x: neck.x - prev.x, y: neck.y - prev.y };

      context.save();
      context.translate(x + gridSize / 2, y + gridSize / 2);

      if (tailDir.x === 1) {
        // Tail pointing right
        context.rotate(Math.PI / 2);
      } else if (tailDir.x === -1) {
        // Tail pointing left
        context.rotate(-Math.PI / 2);
      } else if (tailDir.y === -1) {
        // Tail pointing up
        context.rotate(0);
      } else if (tailDir.y === 1) {
        // Tail pointing down
        context.rotate(Math.PI);
      }

      context.drawImage(
        tailImage,
        -gridSize / 2,
        -gridSize / 2,
        gridSize,
        gridSize
      );
      context.restore();
    } else {
      const prev = sneck[i - 1];
      const next = sneck[i + 1];

      const prevDir = { x: prev.x - neck.x, y: prev.y - neck.y };
      const nextDir = { x: next.x - neck.x, y: next.y - neck.y };

      // Check if straight
      if (prevDir.x === nextDir.x || prevDir.y === nextDir.y) {
        if (prevDir.x !== 0) {
          context.drawImage(neckHorizontalImage, x, y, gridSize, gridSize);
        } else {
          context.drawImage(neckVerticalImage, x, y, gridSize, gridSize);
        }
      }
      // If not straight
      else {
        context.save();
        context.translate(x + gridSize / 2, y + gridSize / 2);

        if (
          (prevDir.x === -1 && nextDir.y === -1) ||
          (nextDir.x === -1 && prevDir.y === -1)
        ) {
          context.rotate(-Math.PI / 2); // Top-left
        } else if (
          (prevDir.y === -1 && nextDir.x === 1) ||
          (nextDir.y === -1 && prevDir.x === 1)
        ) {
          context.rotate(0); // Top-right
        } else if (
          (prevDir.x === 1 && nextDir.y === 1) ||
          (nextDir.x === 1 && prevDir.y === 1)
        ) {
          context.rotate(Math.PI / 2); // Bottom-right
        } else if (
          (prevDir.y === 1 && nextDir.x === -1) ||
          (nextDir.y === 1 && prevDir.x === -1)
        ) {
          context.rotate(Math.PI); // Bottom-left
        }

        context.drawImage(
          neckConnectorImage,
          -gridSize / 2,
          -gridSize / 2,
          gridSize,
          gridSize
        );
        context.restore();
      }
    }
  }

  // Draw food
  context.drawImage(
    foodOrb.image,
    foodOrb.currentFrame * 100,
    0, // source x, y (100px per frame)
    100,
    100, // source width, height
    food.x * gridSize,
    food.y * gridSize, // destination x, y
    gridSize,
    gridSize // destination width, height (scaled to grid)
  );

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

  foodOrb.nextAnimationCounter();
  if (foodOrb.animationCounter >= foodOrb.animationSpeed) {
    foodOrb.resetAnimationCounter();
    foodOrb.currentFrame = (foodOrb.currentFrame + 1) % foodOrb.frameCount;
  }

  pauseMenu.style.display = "none";
  updateScore();
  update();
  draw();
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverMenu.style.display = "flex";
}

function resizeCanvas() {
  // Match canvas to screen size
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;

  // Recalculate grid size and tile count
  gridSize = Math.floor(canvas.width / 15); // adjust divisor to control size
  tileCount = Math.floor(canvas.width / gridSize);
}

function pauseGame() {
  paused = true;
  pauseMenu.style.display = "flex"; // show pause screen
}

function resumeGame() {
  pauseMenu.style.display = "none";
  paused = false;
}

// #region Controls
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
    if (paused) {
      resumeGame();
      return;
    }
    pauseGame();
  }
});
// #endregion

startButtons.forEach((startButton) => {
  startButton.addEventListener("click", (event) => {
    mainMenu.style.display = "none";
    gameOverMenu.style.display = "none";
    startGame();
  });
});

resumeBtn.addEventListener("click", resumeGame);

restartButtons.forEach((restartButton) => {
  restartButton.addEventListener("click", startGame);
});
