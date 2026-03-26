let money = parseInt(localStorage.getItem("money") || "0", 10);

document.getElementById("moneyDisplay").innerText = money;

function buy(type) {
    let cost = 0;

    switch (type) {
        case "damage":   cost = 150; break;  // était 50
        case "speed":    cost = 120; break;  // était 40
        case "health":   cost = 180; break;  // était 60
        case "multishot": cost = 300; break; // était 100
    }

    if (money < cost) {
        alert("Pas assez d'argent !");
        return;
    }

    money -= cost;
    localStorage.setItem("money", money);
    document.getElementById("moneyDisplay").innerText = money;

    let upgrades = JSON.parse(localStorage.getItem("upgrades") || "[]");
    upgrades.push(type);
    localStorage.setItem("upgrades", JSON.stringify(upgrades));

    alert("Achat effectué !");
}

function startNextLevel() {
    location.href = "game.html";
}