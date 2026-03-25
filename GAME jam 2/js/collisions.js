function rectCircleCollide(rect, circle) {
    const distX = Math.abs(circle.x - (rect.x + rect.width / 2));
    const distY = Math.abs(circle.y - (rect.y + rect.height / 2));

    if (distX > (rect.width / 2 + circle.radius)) return false;
    if (distY > (rect.height / 2 + circle.radius)) return false;

    if (distX <= (rect.width / 2)) return true;
    if (distY <= (rect.height / 2)) return true;

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

function rectRectCollide(a, b) {
    return !(
        a.x + a.width < b.x ||
        a.x > b.x + b.width ||
        a.y + a.height < b.y ||
        a.y > b.y + b.height
    );
}

function handleZombieCollisions(player, zombies, bullets) {
    bullets.forEach(b => {
        zombies.forEach(z => {
            if (z.alive && rectCircleCollide(z, b)) {
                z.health -= player.damage;
                b.alive = false;

                if (z.health <= 0) {
                    z.alive = false;
                    onZombieKilled();
                }
            }
        });
    });

    zombies.forEach(z => {
        if (z.alive && rectRectCollide(player, z)) {
            player.takeDamage(10);
        }
    });
}

function handleBossCollisions(player, boss, bullets, enemyBullets) {
    bullets.forEach(b => {
        if (boss && rectCircleCollide(boss, b)) {
            boss.takeDamage(player.damage);
            b.alive = false;
        }
    });

    enemyBullets.forEach(b => {
        if (rectCircleCollide(player, b)) {
            player.takeDamage(10);
            b.alive = false;
        }
    });
}