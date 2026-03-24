export const platforms = [
    { x: 0, y: 420, width: 800, height: 30 },
    { x: 150, y: 330, width: 120, height: 15 },
    { x: 350, y: 260, width: 140, height: 15 },
    { x: 550, y: 200, width: 120, height: 15 }
];

export const walls = [
    { x: 0, y: 0, width: 20, height: 450 },
    { x: 780, y: 0, width: 20, height: 450 }
];

export function drawPlatforms(ctx) {
    ctx.fillStyle = "#555";
    for (let p of platforms) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }

    ctx.fillStyle = "#777";
    for (let w of walls) {
        ctx.fillRect(w.x, w.y, w.width, w.height);
    }
}