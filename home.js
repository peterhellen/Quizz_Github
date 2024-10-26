document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startGame');
    const playerCountSelect = document.getElementById('playerCount');
    const gameModeSelect = document.getElementById('gameMode');
    const playerNamesDiv = document.getElementById('playerNames');

    // Anzahl der Spieler dynamisch eingeben lassen
    playerCountSelect.addEventListener('change', function() {
        playerNamesDiv.innerHTML = ''; // Vorherige Eingabefelder löschen
        const playerCount = parseInt(playerCountSelect.value);

        // Erstelle Eingabefelder für Spielernamen
        for (let i = 1; i <= playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Spieler ${i} Name`;
            input.id = `player${i}`;
            input.classList.add('player-input');
            playerNamesDiv.appendChild(input);
            playerNamesDiv.appendChild(document.createElement('br'));
        }
    });

    // Event-Listener zum Starten des ausgewählten Spiels
    startButton.addEventListener('click', function() {
        const playerCount = parseInt(playerCountSelect.value);
        const gameMode = gameModeSelect.value;

        if (playerCount < 2) {
            alert("Bitte wähle mindestens 2 Spieler aus, um das Spiel zu starten.");
            return;
        }

        if (gameMode === "0") {
            alert("Bitte wähle einen Spielmodus aus.");
            return;
        }

        const players = [];
        for (let i = 1; i <= playerCount; i++) {
            const playerName = document.getElementById(`player${i}`).value.trim();
            if (playerName === "") {
                alert("Bitte gib für alle Spieler einen Namen ein.");
                return;
            }
            players.push(playerName);
        }

        // Speichere die Spielernamen im localStorage, damit sie in den Spielen verwendet werden können
        localStorage.setItem('players', JSON.stringify(players));

        // Speichere die Spielerinformationen in Firebase
        const gameId = `game_${Date.now()}`; // Einzigartige ID basierend auf der aktuellen Zeit
        firebase.database().ref('games/' + gameId).set({
            players: players,
            gameMode: gameMode,
            timestamp: new Date().toISOString()
        }).then(() => {
            console.log('Spielinformationen in Firebase gespeichert!');
        }).catch((error) => {
            console.error('Fehler beim Speichern der Daten in Firebase:', error);
        });

        // Weiterleitung zur entsprechenden Spielseite
        if (gameMode === "fragespiel") {
            window.location.href = 'Fragespiel/game.html';
        } else if (gameMode === "schaetzspiel") {
            window.location.href = 'Schaetzspiel/game.html';
        }
    });
});
