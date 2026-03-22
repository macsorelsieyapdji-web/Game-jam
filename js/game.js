function update() {
  // player updating
  player.update();

  // objects updating
  updateObjects(objects);

  // collisions handling among players and objects
  handleCollisions(player, objects);

  // score handling
  score++;

  // Difficulty handling (...increasing each level)
  levelTimer++;
  if (levelTimer > 600) { // every ~10 seconds
    level++;
    spawnNewObjects();
    increaseCorruption();
    levelTimer = 0;
  }

  // Display updating
  updateHUD();

  // Game condition checking
  if (player.health <= 0) {
    endGame();
  }
}

// Function to create new object
function spawnNewObjects() {
  //between 1 and 3 objects are made each steps
  const newObjectsCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < newObjectsCount; i++) {
    objects.push(new GameObject(rand(50, 550), rand(50, 550)));
  }
}

// Function to increase corruption (remindre to "Nothng is Safe
function increaseCorruption() {
  corruptionRate += 0.05;

  // Exemple : some objects randomly become dangerous
  objects.forEach(obj => {
    if (Math.random() < corruptionRate) {
      obj.makeDangerous(); // méthode à définir dans GameObject
    }
  });
}