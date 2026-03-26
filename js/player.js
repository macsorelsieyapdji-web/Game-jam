const playerImg = new Image();
playerImg.src = "img/player.png";
playerImg.onload = () => console.log("✔ Sprite joueur chargé");
playerImg.onerror = () => console.error("❌ Impossible de charger img/player.png");

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.speed = 4;
        this.health = 100;
        this.maxHealth = 100;
        this.damage = 20; // ✅ Dégâts augmentés (20 au lieu de 10)
        this.multishot = false;

        this.vy = 0;
        this.gravity = 0.5;
        this.onGround = false;

        let upgrades = JSON.parse(localStorage.getItem("upgrades") || "[]");

        upgrades.forEach(u => {
            switch (u) {
                case "damage": this.damage += 5; break;
                case "speed": this.speed += 0.5; break;
                case "health":
                    this.maxHealth += 20;
                    this.health = this.maxHealth;
                    break;
                case "multishot": this.multishot = true; break;
            }
        });

        localStorage.setItem("upgrades", "[]");

        /* ------------------ FIX TIR : DÉTECTION DE SPACE ------------------ */
        this.keys = {};
        this.shootCooldown = 0;

        window.addEventListener("keydown", e => {
            this.keys[e.key] = true;
            this.keys[e.code] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key] = false;
            this.keys[e.code] = false;
        });
        /* ------------------------------------------------------------------ */
    }

    update() {
        if (this.keys["ArrowLeft"] || this.keys["q"]) this.x -= this.speed;
        if (this.keys["ArrowRight"] || this.keys["d"]) this.x += this.speed;

        this.vy += this.gravity;
        this.y += this.vy;

        const groundLevel = canvas.height - 80 - this.height;
        if (this.y >= groundLevel) {
            this.y = groundLevel;
            this.vy = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }

        if ((this.keys["ArrowUp"] || this.keys["z"]) && this.onGround) {
            this.vy = -12;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;

        if (this.shootCooldown > 0) this.shootCooldown--;

        /* ------------------ FIX TIR : CONDITIONS COMPLÈTES ------------------ */
        if (
            (this.keys[" "] ||
             this.keys["Space"] ||
             this.keys["Spacebar"]) &&
            this.shootCooldown === 0
        ) {
            this.shoot();
            this.shootCooldown = 10;
        }
        /* -------------------------------------------------------------------- */
    }

    shoot() {
        bullets.push(new Bullet(
            this.x + this.width,
            this.y + this.height / 2,
            8,
            0
        ));

        if (this.multishot) {
            bullets.push(new Bullet(this.x + this.width, this.y + this.height / 2 - 10, 8, -0.5));
            bullets.push(new Bullet(this.x + this.width, this.y + this.height / 2 + 10, 8, 0.5));
        }
    }

    draw(ctx) {
        if (playerImg.complete) {
            ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "#ffff00";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Barre de vie joueur
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(this.x, this.y - 10, this.width * (this.health / this.maxHealth), 5);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            setGameOver();
        }
    }

    giveBonus(type) {
        switch (type) {
            case "health":
                this.health = Math.min(this.maxHealth, this.health + 25);
                break;
            case "speed":
                this.speed += 0.3;
                break;
            case "damage":
                this.damage += 2;
                break;
            case "multishot":
                this.multishot = true;
                break;
        }
    }
}

class Bullet {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.speedX = speedX;
        this.speedY = speedY;
        this.alive = true;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.fillStyle = "#ff9900";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}