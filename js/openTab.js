function openTab(evt, tabName) {
    // 1. Cacher tous les contenus d'onglets
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }

    // 2. Enlever la classe "active" de tous les boutons
    const buttons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(" active", "");
    }

    // 3. Afficher l'onglet actuel et ajouter la classe "active" au bouton
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}