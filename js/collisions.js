function handleCollisions(player, objects) {
  objects.forEach(obj => {
    const dist = distance(
      player.x + player.size / 2,
      player.y + player.size / 2,
      obj.x,
      obj.y
    );

    if (dist < player.size / 2 + obj.radius) {

      if (obj.type === "safe") {
        player.health = Math.min(100, player.health + 10);
      }

      if (obj.type === "danger") {
        player.health -= 20;
      }

      obj.x = rand(50, canvas.width - 50);
      obj.y = rand(50, canvas.height - 50);
    }
  });

  document.getElementById("health").textContent = "Health: " + player.health;
}