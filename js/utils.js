/** * UTILS.JS - Boîte à outils du moteur (Partie 4)
 * Ces fonctions sont utilisées par les collisions et la génération d'objets.
 */

// Génère un nombre aléatoire (utilisé pour faire apparaître les dangers)
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calcule la distance entre deux points (utilisé pour les collisions)
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}