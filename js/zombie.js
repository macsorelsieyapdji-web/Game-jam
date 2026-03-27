const zombieImg = new Image();
zombieImg.src = "img/zombie.png";
zombieImg.onload = () => console.log("✔ Sprite zombie chargé");
zombieImg.onerror = () => console.error("❌ Impossible de charger img/zombie.png");

class Zombie {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 56;
        this.speed = 0.6 + level * 0.1;
        this.maxHealth = 40 + level * 10;
        this.health = this.maxHealth; // ✅ vie PLEINE au spawn
        this.alive = true;

        this.vy = 0;
        this.gravity = 0.4;
    }

    update(player) {
        if (!this.alive) return;

        // Calcul du déplacement vers le joueur
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;

        //Déplacement fluide vers le joueur
        this.x += (dx / dist) * this.speed;

        // Gestion de la gravité
        this.vy += this.gravity;
        this.y += this.vy;

        //Collision avec le sol
        const groundLevel = canvas.height - 80 - this.height;
        if (this.y >= groundLevel) {
            this.y = groundLevel; // On force le zombie a rester au sol
            this.vy = 0; // on arrete la chute
        }
    }

    // affichage du zombie
    draw(ctx) {
        if (!this.alive) return;

        if (zombieImg.complete) {
            ctx.drawImage(zombieImg, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "#222";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // ✅ Barre rouge complète en fond
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.x, this.y - 8, this.width, 5);

        // ✅ Barre verte proportionnelle à la vie ACTUELLE / vie MAX
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(this.x, this.y - 8, this.width * (this.health / this.maxHealth), 5);
    }
}