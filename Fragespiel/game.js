document.addEventListener('DOMContentLoaded', function () {
    console.log('Spiel geladen');

    // Spieler aus dem localStorage laden
    const players = JSON.parse(localStorage.getItem('players')) || [];
    let currentPlayerIndex = 0;

    // Punktestände initialisieren
    const playerScores = players.map(player => ({ name: player, score: 0 }));

    // Spieleranzeige und Scoreboard
    const playerDisplay = document.createElement('div');
    playerDisplay.id = 'player-display';
    document.body.insertBefore(playerDisplay, document.getElementById('categories'));

    const scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard';
    playerDisplay.appendChild(scoreboard);

    updatePlayerDisplay();

    // Fragen-Daten aus der eingebundenen JavaScript-Datei
    const questions = questionsData;

    // Lade Kategorien basierend auf den Daten
    loadCategories(questions);

    function loadCategories(questions) {
        const categoriesDiv = document.getElementById('categories');
        categoriesDiv.innerHTML = ""; // Vorherigen Inhalt löschen

        // Extrahiere einzigartige Kategorien und mische sie
        let categories = [...new Set(questions.map(q => q.Kategorie))];
        categories = shuffleArray(categories).slice(0, 8); // Wähle zufällig 8 Kategorien aus
        console.log("Verfügbare Kategorien:", categories);

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');

            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            // Füge Punkteschaltflächen hinzu (z.B. 100, 200, 300, 400 Punkte)
            [100, 200, 300, 400].forEach(points => {
                const questionButton = document.createElement('button');
                questionButton.textContent = `${points} Punkte`;
                questionButton.classList.add('question-button');
                questionButton.addEventListener('click', function () {
                    loadQuestion(category, points, questions);
                    questionButton.disabled = true; // Disable the button after it was clicked
                });
                categoryDiv.appendChild(questionButton);
            });

            categoriesDiv.appendChild(categoryDiv);
        });
    }

    function loadQuestion(category, points, questions) {
        // Filtere die Fragen nach Kategorie und Punktewert
        const filteredQuestions = questions.filter(q => q.Kategorie === category && q.Punkte === points);
        if (filteredQuestions.length > 0) {
            // Zufällige Frage aus den gefilterten Fragen auswählen
            const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
            showQuestionInModal(category, points, randomQuestion);
        } else {
            console.error("Keine Fragen gefunden für diese Kategorie und Punkte.");
        }
    }

    function showQuestionInModal(category, points, question) {
        if (question) {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modal-content');
            modalContent.innerHTML = `
                <div class="category-points">
                    <span id="category">${category}</span>
                    <span id="points">${points} Punkte</span>
                </div>
                <p class="question-text" id="question">${question.Frage}</p>
                <button id="showTip">Tipp</button>
                <p id="tip" style="display: none;">${question.Tipp}</p>
                <button id="showOptions">Auswahl</button>
                <ul id="options" style="display: none;">
                    ${question.Optionen.split(';').map(option => `<li>${option}</li>`).join('')}
                </ul>
                <button id="showAnswer">Antwort anzeigen</button>
                <p id="answer" style="display: none;">${question.Antwort}</p>
                <h3>Bewertung der Antworten:</h3>
                <div class="evaluation-grid">
            `;

            // Füge die Bewertungsschaltflächen für jeden Spieler hinzu
            playerScores.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.classList.add('player-evaluation');
                playerDiv.innerHTML = `
                    <span>${player.name}</span>
                    <div class="button-group">
                        <button class="correct" data-player="${player.name}" data-points="${points}">Richtig</button>
                        <button class="wrong" data-player="${player.name}" data-points="${points}">Falsch</button>
                    </div>
                `;
                modalContent.querySelector('.evaluation-grid').appendChild(playerDiv);
            });

            modalContent.innerHTML += `</div><button id="closeModal">Fertig</button>`;
            document.getElementById('closeModal').addEventListener('click', closeModal);

            document.getElementById('showTip').addEventListener('click', function () {
                document.getElementById('tip').style.display = 'block';
            });

            document.getElementById('showOptions').addEventListener('click', function () {
                document.getElementById('options').style.display = 'block';
            });

            document.getElementById('showAnswer').addEventListener('click', function () {
                document.getElementById('answer').style.display = 'block';
            });

            // Event Listener für Bewertungsbuttons
            document.querySelectorAll('.correct').forEach(button => {
                button.addEventListener('click', function () {
                    const playerName = this.getAttribute('data-player');
                    const points = parseInt(this.getAttribute('data-points'));
                    updateScore(playerName, points);
                });
            });

            document.querySelectorAll('.wrong').forEach(button => {
                button.addEventListener('click', function () {
                    const playerName = this.getAttribute('data-player');
                    const points = parseInt(this.getAttribute('data-points'));
                    updateScore(playerName, -points);
                });
            });

            modal.style.display = 'block';
        }
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    function updateScore(playerName, points) {
        const player = playerScores.find(p => p.name === playerName);
        if (player) {
            player.score = Math.max(0, player.score + points);
            updatePlayerDisplay();
            console.log(`Punkte für ${player.name}: ${player.score}`);
        }
    }

    function updatePlayerDisplay() {
        const playerDisplay = document.getElementById('player-display');
        playerDisplay.innerHTML = playerScores.map(player => `
            <div class="player-score">
                <h3>${player.name}</h3>
                <p>${player.score} Punkte</p>
            </div>
        `).join('');
    }

    // Hilfsfunktion zum Mischen eines Arrays
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
