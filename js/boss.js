export class Boss {
    constructor() {
        this.x = canvas.width - 150;
        this.y = 100;
        this.width = 80;
        this.height = 80;
        this.health = 100;
        this.speed = 2;
        this.direction = -1;
    }

    update() {
        this.x += this.speed * this.direction;

        if (this.x < 400) this.direction = 1;
        if (this.x + this.width > canvas.width - 20) this.direction = -1;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}