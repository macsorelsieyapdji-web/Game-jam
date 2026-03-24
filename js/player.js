export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;

        this.speed = 3;
        this.vx = 0;
        this.vy = 0;

        this.gravity = 0.6;
        this.jumpForce = -12;
        this.doubleJumpForce = -11;
        this.onGround = false;
        this.canDoubleJump = false;

        this.isDashing = false;
        this.dashSpeed = 10;
        this.dashTime = 150;
        this.dashCooldown = 400;
        this.lastDash = 0;

        this.isSliding = false;
        this.slideTime = 300;
        this.lastSlide = 0;

        this.onWall = false;
        this.wallJumpForceX = 7;
        this.wallJumpForceY = -11;
        this.facing = 1;

        this.health = 100;
    }

    update(input, platforms, walls, delta) {
        this.vx = 0;

        if (input.left) {
            this.vx = -this.speed;
            this.facing = -1;
        }
        if (input.right) {
            this.vx = this.speed;
            this.facing = 1;
        }

        if (input.dash && !this.isDashing && performance.now() - this.lastDash > this.dashCooldown) {
            this.isDashing = true;
            this.lastDash = performance.now();
            this.vx = this.dashSpeed * this.facing;
        }
        if (this.isDashing && performance.now() - this.lastDash > this.dashTime) {
            this.isDashing = false;
        }

        this.vy += this.gravity;

        if (input.slide && this.onGround && !this.isSliding) {
            this.isSliding = true;
            this.lastSlide = performance.now();
            this.vx = this.facing * (this.speed * 2);
        }
        if (this.isSliding && performance.now() - this.lastSlide > this.slideTime) {
            this.isSliding = false;
        }

        this.onWall = walls.some(w => this.collidesWith(w));

        if (input.jumpPressed) {
            if (this.onGround) {
                this.vy = this.jumpForce;
                this.onGround = false;
                this.canDoubleJump = true;
            } else if (this.onWall) {
                this.vy = this.wallJumpForceY;
                this.vx = -this.facing * this.wallJumpForceX;
                this.canDoubleJump = true;
            } else if (this.canDoubleJump) {
                this.vy = this.doubleJumpForce;
                this.canDoubleJump = false;
            }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.onGround = false;
        for (let p of platforms) {
            if (this.collidesWith(p)) {
                if (this.vy > 0 && this.y + this.height <= p.y + this.vy) {
                    this.y = p.y - this.height;
                    this.vy = 0;
                    this.onGround = true;
                }
            }
        }

        if (this.y > canvas.height) {
            this.y = canvas.height - this.height;
            this.vy = 0;
            this.onGround = true;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    collidesWith(rect) {
        return (
            this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }

    draw(ctx) {
        ctx.fillStyle = "cyan";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export const input = {
    left: false,
    right: false,
    jumpPressed: false,
    dash: false,
    slide: false
};

window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "q") input.left = true;
    if (e.key === "ArrowRight" || e.key === "d") input.right = true;
    if (e.key === " " || e.key === "ArrowUp" || e.key === "z") input.jumpPressed = true;
    if (e.key === "Shift") input.dash = true;
    if (e.key === "Control") input.slide = true;
});

window.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft" || e.key === "q") input.left = false;
    if (e.key === "ArrowRight" || e.key === "d") input.right = false;
    if (e.key === " " || e.key === "ArrowUp" || e.key === "z") input.jumpPressed = false;
    if (e.key === "Shift") input.dash = false;
    if (e.key === "Control") input.slide = false;
});