const canvas = document.getElementById("sneckCanvas");
const context = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width/gridSize;
let sneck = [ {x: 10, y:10} ]
let dx = 0;
let dy = 0;
let food = spawnFood();
let gameOver = false;

function gameLoop() {
  if (gameOver) return;

  // We add music and shit here outside of game loop

  // Actually game loop
  setTimeout(() => {
    update();
    draw();
    gameLoop();
  }, 100);
}

function update() {
  const head = { x: sneck[0].x + dx, y: sneck[0].y + dy };

  // GAME OVER if sneck collides with wall
  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
    gameOver = true;

    //TO DO: change into Game Over Pop-up ↓↓↓
    alert("Game Over!");
    return;
  }

  //GAME OVER if sneck collides with neck
  for (let neck of sneck) {
    if (neck.x === head.x && neck.y == sneck.y) {
      gameOver = true;

      //TO DO: change into Game Over Pop-up ↓↓↓
      alert("Game Over!");

      return;
    }
  }

  // CONTINUE if no wall collision
  sneck.unshift(head);

  // EAT FOOD
  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
  } else {
    sneck.pop(); // remove tail
  }
}

function draw() {
  context.clearRect(0,0, canvas.width, canvas.height);

    // TO DO: add doki-head.png

  // Draw Sneck
  // TO DO: Replace with doki-neck.png ↓↓↓
  context.fillStyle = 'lime';
  sneck.forEach(neck => {
    context.fillRect(neck.x * gridSize, neck.y * gridSize, gridSize, gridSize);
  });

  // Draw Food.
  // TO DO: Replace with food.png ↓↓↓
  context.fillStyle = "red";
  context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function spawnFood() {
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

// controls

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case "W":
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case "ArrowDown":
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case "S":
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case "ArrowLeft":
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case "A":
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case "ArrowRight":
      if (dx === 0) { dx = 1; dy = 0; }
      break;
    case "D":
      if (dy === 0) { dx = 1; dy = 0; }
      break;
  }
});

gameLoop();