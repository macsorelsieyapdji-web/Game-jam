class GameObject {
  constructor(x, y, type = "safe") {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.type = type; // "safe" ou "danger"
  }

  draw(ctx) {
    if (this.type === "safe") {
      ctx.fillStyle = "lime";
    } else {
      ctx.fillStyle = "red";
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Génération d’objets
function generateObjects(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new GameObject(rand(50, 550), rand(50, 550), "safe"));
  }
  return arr;
}

// Mise à jour (si objets mobiles plus tard)
function updateObjects(objects) {
  // Pour l’instant les objets ne bougent pas
}