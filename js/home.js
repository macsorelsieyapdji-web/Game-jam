function updateLevel(val) {
  document.getElementById('levelValue').innerText = val;
  localStorage.setItem('startLevel', val);
}

function setMode(mode) {
  localStorage.setItem('mode', mode);
  alert("Mode " + mode + " activé !");
}

function startGamePage() {
  const level = document.getElementById("startLevel").value;
  localStorage.setItem("startLevel", level);
  location.href = "game.html";
}