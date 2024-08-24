// Funktion zum Filtern der Ereignisse
function filterEvents() {
    const events = document.querySelectorAll('.realmstock-panel.event');
    events.forEach(event => {
        const scoreElement = event.querySelector('.event-score');
        const populationElement = event.querySelector('.event-population');

        // Sicherstellen, dass sowohl Score als auch Population vorhanden sind
        if (scoreElement && populationElement) {
            // Punktzahl extrahieren
            const scoreText = scoreElement.textContent.trim();
            const scoreMatch = scoreText.match(/Score:\s*(\d+)%/);
            const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

            // Spieleranzahl extrahieren
            const populationText = populationElement.textContent.trim();
            const populationMatch = populationText.match(/(\d+)\/(\d+)/);
            const currentPopulation = populationMatch ? parseInt(populationMatch[1], 10) : 0;
            const maxPopulation = populationMatch ? parseInt(populationMatch[2], 10) : 0;

            // Ereignis filtern, wenn Score > 70 und Spieleranzahl > 60/85
            if (score > 50 && currentPopulation > 40 && maxPopulation === 85) {
                event.style.display = 'block';
            } else {
                event.style.display = 'none';
            }
        }
    });
}

// Initiales Filtern
filterEvents();

// Wiederholtes Filtern alle 500 Millisekunden
setInterval(filterEvents, 500);
