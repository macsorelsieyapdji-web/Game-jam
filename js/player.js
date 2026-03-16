class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.speed = 3;
    this.health = 100;
  }

  update() {
    // Déplacements
    if (keys["ArrowUp"] || keys["z"]) this.y -= this.speed;
    if (keys["ArrowDown"] || keys["s"]) this.y += this.speed;
    if (keys["ArrowLeft"] || keys["q"] || keys["a"]) this.x -= this.speed;
    if (keys["ArrowRight"] || keys["d"]) this.x += this.speed;

    // Limites du canvas
    this.x = Math.max(0, Math.min(this.x, canvas.width - this.size));
    this.y = Math.max(0, Math.min(this.y, canvas.height - this.size));
  }

  draw(ctx) {
    // Skin du shop
    let skin = localStorage.getItem("skin");

    if (skin === "skin_red") ctx.fillStyle = "red";
    else if (skin === "skin_blue") ctx.fillStyle = "blue";
    else ctx.fillStyle = "cyan"; // skin par défaut

    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Gestion des touches
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);