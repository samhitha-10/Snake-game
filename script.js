
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score-text");

const box = 20;
const canvasSize = 400;
let score = 0;
let gameInterval;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = generateFood();

// --- Input Handling ---

// Keyboard support
document.addEventListener("keydown", (e) => handleInput(e.key));

// Touch support for buttons
const addTouchListener = (id, keyName) => {
  document.getElementById(id).addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleInput(keyName);
  }, { passive: false });
};

addTouchListener("upBtn", "ArrowUp");
addTouchListener("downBtn", "ArrowDown");
addTouchListener("leftBtn", "ArrowLeft");
addTouchListener("rightBtn", "ArrowRight");

function handleInput(key) {
  if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// --- Game Logic ---

function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function checkCollision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function draw() {
  // Reset Canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw Snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#0f0" : "#080"; // Bright green head, darker body
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  // Draw Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move Head
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Eat Food
  if (headX === food.x && headY === food.y) {
    score++;
    scoreElement.innerText = "Score: " + score;
    food = generateFood();
  } else {
    snake.pop(); // Remove tail
  }

  const newHead = { x: headX, y: headY };

  // Hit Wall or Self
  if (
    headX < 0 || headY < 0 || headX >= canvasSize || headY >= canvasSize ||
    checkCollision(newHead, snake)
  ) {
    clearInterval(gameInterval);
    alert("Game Over! Your score: " + score);
    location.reload();
  }

  snake.unshift(newHead); // Add new head
}

// Start Game
gameInterval = setInterval(draw, 120);


