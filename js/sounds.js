const sounds = {
    music: new Audio("audio/music.mp3"),
    shoot: new Audio("audio/shoot.wav"),
    hitZombie: new Audio("audio/hit1.wav"),
    hitBoss: new Audio("audio/hit2.wav"),
    gameOver: new Audio("audio/gameover.wav")
};

// Volume
sounds.music.volume = 0.4;
sounds.shoot.volume = 0.6;
sounds.hitZombie.volume = 0.7;
sounds.hitBoss.volume = 0.7;
sounds.gameOver.volume = 0.8;

// Boucle de la musique
sounds.music.loop = true;