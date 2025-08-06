const canvas = document.getElementById("sneckCanvas");
const context = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width/gridSize;
let pausey = document.getElementById("pause-text");
let sneck = [ {x: 10, y:10} ]
let dx = 0;
let dy = 0;
let food = spawnFood();
let gameOver = false;
let pause = false;

function gameLoop() {
  if (gameOver) return;

  // We add music and shit here outside of game loop

  // Actually game loop
  setTimeout(() => {
    if (pause) {
      pausey.style.display = "block";
      gameLoop();
      return;
    }
    pausey.style.display = "none";
    update();
    draw();
    gameLoop();
  }, 100);
}

function update() {

  // updates head direction on key press
  const head = { x: sneck[0].x + dx, y: sneck[0].y + dy };

  // GAME OVER if sneck collides with wall
  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
    gameOver = true;

    //TO DO: change into Game Over Pop-up ↓↓↓
    alert("Game Over! Didn't see the wall coming!");
    return;
  }

  // GAME OVER if sneck collides with neck
    for (let i = 1; i < sneck.length; i++) {
    if (sneck[i].x === head.x && sneck[i].y === head.y) {
      gameOver = true;
      alert("Game Over! You bit your neck!");
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

function updateCoordinates(newdx, newdy) {
  if(pause) {
    return;
  }
  dx = newdx;
  dy = newdy;
}

function resume() {
  pause = false;
}

function up() {
  resume(); 
  updateCoordinates(0,-1);
}

function down() {
  resume();
  updateCoordinates(0,1);
}

function left() {
  resume();
  updateCoordinates(-1,0);
}

function right() {
  resume();
  updateCoordinates(1,0);
}

// controls
document.addEventListener("keydown", (e) => {
  switch (e.key) {

    // ARROWS
    case "ArrowUp":
      if (dy === 0) { up(); }
      break;
    case "ArrowDown":
      if (dy === 0) { down(); }
      break;
    case "ArrowLeft":
      if (dx === 0) { left(); }
      break;
    case "ArrowRight":
      if (dx === 0) { right(); }
      break;

    // UPPERCASE!
    case 'W':
      if (dy === 0) { up(); }
      break;
    case 'S':
      if (dy === 0) { down(); }
      break;
    case 'A':
      if (dx === 0) { left(); }
      break;
    case 'D':
      if (dx === 0) { right(); }
      break;

    // lowercase!
    case 'w':
      if (dy === 0) { up(); }
      break;
    case 's':
      if (dy === 0) { down(); }
      break;
    case 'a':
      if (dx === 0) { left(); }
      break;
    case 'd':
      if (dx === 0) { right(); }
      break;

    case 'Escape':
      pause = !pause;
      break;
    case " ":
      pause = !pause;
      break;
  }
});

gameLoop();