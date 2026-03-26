const sounds = {
    music:     new Audio("audio/music.mp3"),
    shoot:     new Audio("audio/shoot.wav"),
    hitZombie: new Audio("audio/hit1.wav"),
    hitBoss:   new Audio("audio/hit2.wav"),
    gameOver:  new Audio("audio/gameover.wav")
};

// Volume
sounds.music.volume     = 0.4;
sounds.shoot.volume     = 0.5;
sounds.hitZombie.volume = 0.7;
sounds.hitBoss.volume   = 0.7;
sounds.gameOver.volume  = 0.8;

// Boucle musique
sounds.music.loop = true;

// ✅ Démarre la musique dès que l'utilisateur interagit (obligatoire sur navigateur)
let musicStarted = false;
function tryStartMusic() {
    if (!musicStarted) {
        sounds.music.play().catch(() => {});
        musicStarted = true;
    }
}
window.addEventListener("keydown", tryStartMusic);
window.addEventListener("click",   tryStartMusic);

// ✅ Fonction utilitaire pour jouer un son sans bloquer
function playSound(name) {
    const s = sounds[name];
    if (!s) return;
    s.currentTime = 0; // repart du début si déjà en cours
    s.play().catch(() => {}); // ignore erreur si bloqué par navigateur
}

// ✅ Sons game over
function playSoundGameOver() {
    sounds.music.pause();
    sounds.music.currentTime = 0;
    playSound("gameOver");
}

// ✅ Redémarre la musique quand on recommence
function restartMusic() {
    sounds.music.currentTime = 0;
    sounds.music.play().catch(() => {});
}