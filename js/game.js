const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// VARIABLES DU JEU
let player;
let objects = [];
let score = 0;
let level = 1;
let corruptionTimer = 0;
let levelTimer = 0;
let corruptionRate = 0.35;
let gameRunning = false;

function startGame() {
  // RESET
  const gameOverDiv = document.getElementById("gameOver");
  if (gameOverDiv) gameOverDiv.classList.add("hidden");

  player = new Player(canvas.width / 2 - 10, canvas.height / 2 - 10);
  objects = generateObjects(10);

  score = 0;
  corruptionTimer = 0;
  levelTimer = 0;

  // MODE DE JEU
  let mode = localStorage.getItem("mode") || "normal";
  let startLevel = parseInt(localStorage.getItem("startLevel") || "1");

  level = startLevel;

  if (mode === "hardcore") {
    player.health = 50;
    player.speed = 4;
    corruptionRate = 0.6;
  } else {
    player.health = 100;
    player.speed = 3;
    corruptionRate = 0.35;
  }

  gameRunning = true;
  gameLoop();
}

function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

function update() {
  player.update();
  updateObjects(objects);
  handleCollisions(player, objects);

  // CORRUPTION
  corruptionTimer++;
  if (corruptionTimer > 240) {
    applyCorruption(objects, corruptionRate);
    corruptionTimer = 0;
  }

  // PROGRESSION DU NIVEAU
  levelTimer++;
  if (levelTimer > 600) {
    level++;
    objects.push(new GameObject(rand(50, 550), rand(50, 550)));
    corruptionRate += 0.05;
    levelTimer = 0;
  }

  // SCORE + HUD
  score++;
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("health").textContent = "Health: " + player.health;
  document.getElementById("level").textContent = "Level: " + level;

  // GAME OVER
  if (player.health <= 0) {
    endGame();
  }
}

function draw() {
  drawBackground();

  objects.forEach(obj => obj.draw(ctx));
  player.draw(ctx);
}

// FOND ANIMÉ
function drawBackground() {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = Date.now() / 100;

  for (let i = 0; i < canvas.width; i += 40) {
    ctx.fillStyle = "#333";
    ctx.fillRect(i + (t % 40), 0, 20, canvas.height);
  }
}

function endGame() {
  gameRunning = false;

  document.getElementById("finalScore").textContent = "Score: " + score;
  document.getElementById("gameOver").classList.remove("hidden");
}

// IMPORTANT : démarrer le jeu quand la page est chargée
window.onload = () => {
  startGame();
};