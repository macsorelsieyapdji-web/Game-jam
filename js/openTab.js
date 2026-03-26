document.addEventListener('input', function (event) {
    if (event.target.id === 'difficulty') {
        const value = event.target.value;
        const output = document.getElementById('diff-value');

        if(output) {
            output.textContent = value + "%";

            if (parseInt(value) > 70) {
                output.style.color = "#ff0000";
            } else {
                output.style.color = "#ffffff";
            }
        }
    }
});

function openTab(evt, tabName) {
    // 1. Cacher tous les contenus d'onglets
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";3
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

// Curseur de difficulté
if (tabName === 'gameplay') {
    const diffSlider = document.getElementById('difficulty');
    const diffOutput = document.getElementById('diff-value');

    if (diffSlider && diffOutput) {
        // Cette ligne force la mise à jour dès l'ouverture de l'onglet
        diffOutput.innerHTML = diffSlider.value + "%";

        diffSlider.oninput = function() {
            diffOutput.innerHTML = this.value + "%";

            if (parseInt(this.value) > 70) {
                diffOutput.style.color = "#ff0000";
            } else {
                diffOutput.style.color = "#ffffff";
            }
        };
    }
}