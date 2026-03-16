// Nombre aléatoire entre min et max
function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Distance entre deux points
function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}