let money = parseInt(localStorage.getItem("money") || "0", 10);

document.getElementById("moneyDisplay").innerText = money;

function buy(type) {
    let cost = 0;

    switch (type) {
        case "damage": cost = 50; break;
        case "speed": cost = 40; break;
        case "health": cost = 60; break;
        case "multishot": cost = 100; break;
    }

    if (money < cost) {
        alert("Pas assez d'argent !");
        return;
    }

    money -= cost;
    localStorage.setItem("money", money);
    document.getElementById("moneyDisplay").innerText = money;

    // On stocke l'amélioration pour le prochain niveau
    let upgrades = JSON.parse(localStorage.getItem("upgrades") || "[]");
    upgrades.push(type);
    localStorage.setItem("upgrades", JSON.stringify(upgrades));

    alert("Achat effectué !");
}

function startNextLevel() {
    location.href = "game.html";
}