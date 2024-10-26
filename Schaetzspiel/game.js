document.addEventListener('DOMContentLoaded', function () {
    console.log('Schätzspiel geladen');

    const revealPlayersButton = document.getElementById('reveal-players');
    const revealAnswerButton = document.getElementById('reveal-correct-answer');
    const correctAnswerInput = document.getElementById('correctAnswerInput');
    const lineChartContainer = document.getElementById('line-chart-container');

    // Event Listener für den Button zum Enthüllen der Spielerantworten
    revealPlayersButton.addEventListener('click', function () {
        const answer1 = parseFloat(document.getElementById('answer1').value);
        const answer2 = parseFloat(document.getElementById('answer2').value);

        if (isNaN(answer1) || isNaN(answer2)) {
            alert("Bitte geben Sie alle Antworten ein.");
            return;
        }

        drawMarkers([answer1, answer2], ['Person 1', 'Person 2']);
        revealPlayersButton.disabled = true;
    });

    // Event Listener für den Button zum Enthüllen der korrekten Antwort
    revealAnswerButton.addEventListener('click', function () {
        const correctAnswer = parseFloat(correctAnswerInput.value);
        if (isNaN(correctAnswer)) {
            alert("Bitte geben Sie die korrekte Antwort ein.");
            return;
        }

        drawMarkers([correctAnswer], [''], true);
        revealAnswerButton.disabled = true;

        // Färbung der bisherigen Antworten
        highlightClosest(correctAnswer);
    });

    // Funktion zum Zeichnen der Pins basierend auf den Spielerantworten
    function drawMarkers(values, labels, isCorrectAnswer = false) {
        values.forEach((value, index) => {
            const marker = document.createElement('div');
            marker.classList.add('marker');
            if (isCorrectAnswer) {
                marker.classList.add('correct-marker');
            }

            const percentage = calculatePercentage(value);
            marker.style.left = `${percentage}%`;

            const pin = document.createElement('div');
            pin.classList.add('pin');

            const labelElement = document.createElement('div');
            labelElement.classList.add('label');

            if (labels[index]) {
                // Darstellung des Labels in zwei Zeilen (Name und Wert)
                labelElement.innerHTML = `<p>${labels[index]}:</p><p>${value}</p>`;
            } else {
                // Nur der Wert für die korrekte Antwort
                labelElement.innerHTML = `<p>${value}</p>`;
            }

            marker.appendChild(pin);
            marker.appendChild(labelElement);
            lineChartContainer.appendChild(marker);

            // Zeige die Pins mit einer kleinen Verzögerung, damit sie schön animiert eingeblendet werden
            setTimeout(() => {
                marker.style.display = 'block';
            }, 500);
        });
    }

    // Funktion zur Berechnung des prozentualen Werts auf der Linie
    function calculatePercentage(value) {
        const answer1 = parseFloat(document.getElementById('answer1').value);
        const answer2 = parseFloat(document.getElementById('answer2').value);
        const correctAnswer = parseFloat(correctAnswerInput.value);

        const minAnswer = Math.min(answer1, answer2, correctAnswer);
        const maxAnswer = Math.max(answer1, answer2, correctAnswer);
        const padding = 0.05 * (maxAnswer - minAnswer);
        const adjustedMin = minAnswer - padding;
        const adjustedMax = maxAnswer + padding;
        const range = adjustedMax - adjustedMin;

        return ((value - adjustedMin) / range) * 100;
    }

    // Funktion zur Hervorhebung der Antwort, die am nächsten liegt
    function highlightClosest(correctAnswer) {
        const markers = document.querySelectorAll('.marker:not(.correct-marker)');
        let closestMarker = null;
        let smallestDifference = Infinity;

        markers.forEach(marker => {
            const value = parseFloat(marker.querySelector('.label p:last-child').textContent);
            const difference = Math.abs(correctAnswer - value);
            if (difference < smallestDifference) {
                smallestDifference = difference;
                closestMarker = marker;
            }
        });

        if (closestMarker) {
            closestMarker.querySelector('.pin').style.backgroundColor = 'rgba(0, 123, 255, 0.5)'; // Grau-Blau Abstufung
        }
    }
});
