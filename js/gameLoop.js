function gameLoop(timestamp) {
  update();    
  drawGame();  

  if (player.health > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    endGame(); //GAme over , final score
  }
}


requestAnimationFrame(gameLoop);