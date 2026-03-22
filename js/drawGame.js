function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // objects drawing
  objects.forEach(obj => obj.update());

  // player drawing
  player.draw();

  // HUD 
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Health: ${player.health}`, 10, 60);
  ctx.fillText(`Level: ${level}`, 10, 90);

  // special effect for dangerous object
  objects.forEach(obj => {
    if (obj.isDangerous) obj.drawDangerEffect();
  });
}