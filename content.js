// Funktion zum Filtern der Ereignisse, Entfernen von Duplikaten und Anzeigen nur der letzten X Minuten alten Einträge
function filterEvents(userSettings) {
    const { minScore, minPopulation, maxPopulation, timeLimitMinutes } = userSettings;
    const events = document.querySelectorAll('.realmstock-panel.event');
    const seenEvents = new Set();
    const currentTime = new Date();

    events.forEach(event => {
        const scoreElement = event.querySelector('.event-score');
        const populationElement = event.querySelector('.event-population');
        const titleElement = event.querySelector('.event-title');
        const serverElement = event.querySelector('.event-server');
        const timeElement = event.querySelector('.event-time');

        if (scoreElement && populationElement && titleElement && serverElement && timeElement) {
            const scoreText = scoreElement.textContent.trim();
            const scoreMatch = scoreText.match(/Score:\s*(\d+)%/);
            const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

            const populationText = populationElement.textContent.trim();
            const populationMatch = populationText.match(/(\d+)\/(\d+)/);
            const currentPopulation = populationMatch ? parseInt(populationMatch[1], 10) : 0;
            const maxPopulationValue = populationMatch ? parseInt(populationMatch[2], 10) : 0;

            const eventTimeText = timeElement.textContent.trim();
            const [eventHours, eventMinutes] = eventTimeText.split(':').map(num => parseInt(num, 10));
            const eventTime = new Date(currentTime);
            eventTime.setHours(eventHours);
            eventTime.setMinutes(eventMinutes);

            const timeDifference = (currentTime - eventTime) / 1000 / 60; // in Minuten

            const eventKey = `${titleElement.textContent.trim()}-${serverElement.textContent.trim()}-${currentPopulation}/${maxPopulationValue}`;

            if (seenEvents.has(eventKey) || 
                score < minScore || 
                currentPopulation < minPopulation || 
                maxPopulationValue !== maxPopulation || 
                timeDifference > timeLimitMinutes) {
                event.style.display = 'none';
            } else {
                event.style.display = 'block';
                seenEvents.add(eventKey);
            }
        }
    });
}

// Einstellungen laden und Filter anwenden
chrome.storage.sync.get(['minScore', 'minPopulation', 'maxPopulation', 'timeLimitMinutes'], (userSettings) => {
    filterEvents(userSettings);

    // Wiederholtes Filtern alle 1000 Millisekunden
    setInterval(() => filterEvents(userSettings), 1000);
});
