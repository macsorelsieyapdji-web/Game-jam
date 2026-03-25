const bossImages = [
    (() => { const i = new Image(); i.src = "img/boss1.png"; i.onload = () => console.log("✔ Boss1"); return i; })(),
    (() => { const i = new Image(); i.src = "img/boss2.png"; i.onload = () => console.log("✔ Boss2"); return i; })(),
    (() => { const i = new Image(); i.src = "img/boss3.png"; i.onload = () => console.log("✔ Boss3"); return i; })()
];

class Boss {
    constructor(x, y, level, typeIndex) {
        this.x = x;
        this.y = y;
        this.width = 96;
        this.height = 96;
        this.maxHealth = 800 + level * 120;
        this.health = this.maxHealth;
        this.health = this.maxHealth;
        this.shootCooldown = 0;
        this.img = bossImages[typeIndex] || bossImages[0];

        this.vy = 0;
        this.gravity = 0.3;
    }

    update() {
        this.vy += this.gravity;
        this.y += this.vy;

        const groundLevel = canvas.height - 80 - this.height;
        if (this.y >= groundLevel) {
            this.y = groundLevel;
            this.vy = 0;
        }

        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.shootCooldown === 0) {
            this.shoot();
            this.shootCooldown = 40;
        }
    }

    shoot() {
        enemyBullets.push(new EnemyBullet(this.x, this.y + this.height / 2, -6, 0));
    }

    draw(ctx) {
        if (this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "#ff0033";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.x, this.y - 15, this.width, 6);
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(this.x, this.y - 15, this.width * (this.health / this.maxHealth), 6);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            onBossDefeated();
        }
    }
}

class EnemyBullet {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speedX = speedX;
        this.speedY = speedY;
        this.alive = true;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -20 || this.y < -20 || this.y > canvas.height + 20) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}