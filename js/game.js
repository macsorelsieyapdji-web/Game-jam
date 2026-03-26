const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player;
let zombies = [];
let bullets = [];
let enemyBullets = [];
let boss = null;

let level = parseInt(localStorage.getItem("currentLevel") || "1", 10);
let money = parseInt(localStorage.getItem("money") || "500", 10);
let gameOver = false;

/* -------- SPAWN PROGRESSIF -------- */
let spawnQueue = [];
let spawnTimer = 0;
const SPAWN_INTERVAL = 120; // ~2 secondes entre chaque zombie
/* ---------------------------------- */

/* -------- BACKGROUND QUI CHANGE À CHAQUE NIVEAU -------- */
function drawBackground() {
    const backgrounds = [
        ["#0a0a0f", "#1a001f"],
        ["#00111a", "#003344"],
        ["#1a0000", "#440000"],
        ["#001a00", "#004400"],
        ["#1a1a00", "#444400"],
        ["#0a001a", "#220044"],
        ["#0a0a0a", "#222222"],
        ["#260013", "#550022"],
        ["#001a26", "#004466"],
        ["#260000", "#660000"]
    ];

    const index = (level - 1) % backgrounds.length;
    const [color1, color2] = backgrounds[index];

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.0003;
    ctx.fillStyle = `rgba(255, 0, 80, ${0.10 + Math.sin(time) * 0.05})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/* ------------------------------------------------------- */

/* ------------------------- SOL ------------------------- */
function drawGround() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, canvas.height - 90, canvas.width, 10);
}
/* ------------------------------------------------------- */

function initGame() {
    player = new Player(100, canvas.height / 2);
    resetGameState();
    startNewRound();
    gameLoop();
}

function resetGameState() {
    zombies = [];
    bullets = [];
    enemyBullets = [];
    boss = null;
    gameOver = false;
    spawnQueue = [];
    spawnTimer = 0;
}

function startNewRound() {
    spawnZombies(level);
}

function spawnZombies(level) {
    zombies = [];
    spawnQueue = [];
    spawnTimer = 0;
    const count = 5 + level * 2;

    for (let i = 0; i < count; i++) {
        spawnQueue.push(new Zombie(
            canvas.width + 50,
            0,
            level
        ));
    }
}

function spawnBossForLevel(level) {
    const bossTypes = 3;
    const index = ((Math.floor(level / 2) - 1) % bossTypes + bossTypes) % bossTypes;
    boss = new Boss(canvas.width - 200, 0, level, index);
}

function onZombieKilled() {
    money += 5; // réduit à 5 par kill
    localStorage.setItem("money", money);

    const bonusTypes = ["health", "speed", "damage", "multishot"];
    const randomBonus = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
    player.giveBonus(randomBonus);
}

function onBossDefeated() {
    level++;
    localStorage.setItem("currentLevel", level);

    money += 50; // bonus boss réduit à 50
    localStorage.setItem("money", money);

    location.href = "shop.html";
}

function setGameOver() {
    gameOver = true;
}

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
    } else {
        drawGameOver();
    }
    requestAnimationFrame(gameLoop);
}

function update() {
    /* -------- SPAWN PROGRESSIF : un zombie à la fois -------- */
    if (spawnQueue.length > 0) {
        spawnTimer++;
        if (spawnTimer >= SPAWN_INTERVAL) {
            zombies.push(spawnQueue.shift());
            spawnTimer = 0;
        }
    }
    /* -------------------------------------------------------- */

    player.update();

    zombies.forEach(z => z.update(player));
    if (boss) boss.update();

    bullets.forEach(b => b.update());
    enemyBullets.forEach(b => b.update());

    // Nettoyer les balles mortes
    bullets = bullets.filter(b => b.alive);
    enemyBullets = enemyBullets.filter(b => b.alive);

    handleZombieCollisions(player, zombies, bullets);
    handleBossCollisions(player, boss, bullets, enemyBullets);

    // Tous les zombies morts ET plus aucun en attente de spawn
    const allZombiesDead = zombies.every(z => !z.alive) && spawnQueue.length === 0;

    if (allZombiesDead && !boss) {
        if (level % 2 === 0) {
            spawnBossForLevel(level);
        } else {
            level++;
            localStorage.setItem("currentLevel", level);
            resetGameState();
            startNewRound();
        }
    }
}

function draw() {
    drawBackground();
    drawGround();

    player.draw(ctx);
    zombies.forEach(z => z.draw(ctx));
    if (boss) boss.draw(ctx);

    bullets.forEach(b => b.draw(ctx));
    enemyBullets.forEach(b => b.draw(ctx));

    drawHUD();
}

function drawHUD() {
    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText("Niveau : " + level, 20, 30);
    ctx.fillText("Vie : " + player.health + "/" + player.maxHealth, 20, 55);
    ctx.fillText("💰 " + money, 20, 80);

    // Affiche le nombre de zombies restants (en attente + vivants)
    const remaining = zombies.filter(z => z.alive).length + spawnQueue.length;
    ctx.fillText("🧟 " + remaining, 20, 105);
}

// AFFICHER L'ÉCRAN DE FIN AVEC LES SCORES
function drawGameOver() {
    const screen = document.getElementById("gameOverScreen");
    const lvlDisplay = document.getElementById("finalLevel");
    const moneyDisplay = document.getElementById("finalMoney");

    if (screen && lvlDisplay && moneyDisplay) {
        lvlDisplay.innerText = level;
        moneyDisplay.innerText = money;
        screen.style.display = "block";
    }
    
    // On fige le rendu du jeu en dessous
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// LOGIQUE DU BOUTON RECOMMENCER
document.getElementById("restartBtn").addEventListener("click", () => {
    // 1. Cacher l'écran
    document.getElementById("gameOverScreen").style.display = "none";
    
    // 2. Remettre les variables à zéro
    level = 1;
    money = 0;
    localStorage.setItem("currentLevel", 1);
    localStorage.setItem("money", 0);
    
    // 3. Réinitialiser le jeu (on recrée le joueur et les zombies)
    gameOver = false;
    resetGameState();
    player = new Player(100, canvas.height - 138); 
    startNewRound();
    
    console.log("Partie réinitialisée !");
});

window.addEventListener("keydown", (e) => {
    if ((e.key === "r" || e.key === "R") && gameOver) {
        level = 1;
        localStorage.setItem("currentLevel", level);
        resetGameState();
        startNewRound();
        gameOver = false;
    }
});

initGame();


document.getElementById("restartBtn").addEventListener("click", () => {
    // 1. Cacher l'écran de Game Over
    document.getElementById("gameOverScreen").style.display = "none";
    
    // 2. Réinitialiser les scores et niveaux (si tu veux repartir de zéro)
    level = 1;
    money = 0;
    localStorage.setItem("currentLevel", 1);
    localStorage.setItem("money", 0);
    
    // 3. Relancer le jeu
    resetGameState();
    player = new Player(100, canvas.height - 138); // On recrée un joueur tout neuf
    startNewRound();
    gameOver = false;
});