document.addEventListener('DOMContentLoaded', function () {
    console.log('Buzzer-Spiel geladen');

    const player1Buzzer = document.getElementById('player1-buzzer');
    const player2Buzzer = document.getElementById('player2-buzzer');
    const resultDiv = document.getElementById('result');
    let buzzed = false;

    // Funktion zum Verarbeiten der Buzzer-Klicks
    function handleBuzz(player) {
        if (!buzzed) {
            buzzed = true;
            resultDiv.innerHTML = `<p>${player} hat zuerst gedrückt!</p>`;
        }
    }

    // Event Listener für Buzzer-Buttons
    player1Buzzer.addEventListener('click', function () {
        handleBuzz('Spieler 1');
    });

    player2Buzzer.addEventListener('click', function () {
        handleBuzz('Spieler 2');
    });
});
