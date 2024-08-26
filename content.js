// HTML for the filter
const filterHTML = `
    <div class="option-section">
        <strong>Event Filter</strong>
        <label for="minScore">Min. Score:</label>
        <input type="number" id="minScore" value="70" style="width: 80px; background-color: transparent; border: 1px solid #ccc; color: white;">
        
        <label for="minPopulation">Min. Players:</label>
        <input type="number" id="minPopulation" value="40" style="width: 80px; background-color: transparent; border: 1px solid #ccc; color: white;">
        
        <label for="timeLimitMinutes">Time Limit (min):</label>
        <input type="number" id="timeLimitMinutes" value="5" style="width: 80px; background-color: transparent; border: 1px solid #ccc; color: white;">
        
        <button id="applySettings">Apply Settings</button>
        <div id="feedback" style="margin-top: 10px;"></div>
    </div>
`;
// Insert the filter into the <div class="options-grid">
function injectFilterIntoOptionsGrid() {
    const optionsGrid = document.querySelector('.options-grid');
    if (optionsGrid) {
        optionsGrid.insertAdjacentHTML('beforeend', filterHTML);
        console.log('Filter HTML in options-grid eingefügt');
        initFilterEventHandlers();
    } else {
        console.warn('options-grid nicht gefunden.');
    }
}

// Initialize event handler for the filter
function initFilterEventHandlers() {
    const applySettingsButton = document.getElementById('applySettings');
    if (applySettingsButton) {
        applySettingsButton.addEventListener('click', () => {
            const minScore = parseInt(document.getElementById('minScore').value, 10) || 0;
            const minPopulation = parseInt(document.getElementById('minPopulation').value, 10) || 0;
            const timeLimitMinutes = parseInt(document.getElementById('timeLimitMinutes').value, 10) || 0;

            if (isNaN(minScore) || isNaN(minPopulation) || isNaN(timeLimitMinutes)) {
                document.getElementById('feedback').textContent = 'Please enter valid numbers.';
                document.getElementById('feedback').style.color = 'red';
                return;
            }

            chrome.storage.sync.set({
                minScore,
                minPopulation,
                timeLimitMinutes
            }, () => {
                document.getElementById('feedback').textContent = 'Settings saved';
                document.getElementById('feedback').style.color = 'green';

                // Apply filter immediately after settings are saved
                filterEvents({
                    minScore,
                    minPopulation,
                    timeLimitMinutes
                });
            });
        });
    } else {
        console.warn('Button für Einstellungen nicht gefunden.');
    }
}


// Function to filter the events
// Function to filter the events
function filterEvents(userSettings) {
    const { minScore, minPopulation, timeLimitMinutes } = userSettings;
    const events = document.querySelectorAll('.realmstock-panel.event');
    const seenEvents = new Set();
    const currentTime = new Date();

    events.forEach(event => {
        const scoreElement = event.querySelector('.event-score');
        const populationElement = event.querySelector('.event-population');
        const titleElement = event.querySelector('.event-title');
        const serverElement = event.querySelector('.event-server');
        const timeElement = event.querySelector('.event-time');

        // Check that the elements exist
        if (scoreElement && populationElement && titleElement && serverElement && timeElement) {
            // Extract event details
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
            eventTime.setSeconds(0);

            const timeDifference = (currentTime - eventTime) / (1000 * 60); // in minutes

            const eventKey = `${titleElement.textContent.trim()}-${serverElement.textContent.trim()}-${currentPopulation}/${maxPopulationValue}`;

            // Check if the event is "Realm Closed"
            const isRealmClosed = titleElement.textContent.trim() === "Realm Closed";

            // Logic to determine if event should be displayed
            if (isRealmClosed) {
                // Always display "Realm Closed" events
                event.style.display = 'block';
            } else {
                // Apply filtering for non-"Realm Closed" events
                const shouldHideEvent = timeDifference > timeLimitMinutes || 
                                        seenEvents.has(eventKey) || 
                                        score < minScore || 
                                        currentPopulation < minPopulation || 
                                        maxPopulationValue !== 85;

                // Toggle visibility based on filters
                if (shouldHideEvent) {
                    event.style.display = 'none';
                } else {
                    event.style.display = 'block';
                    seenEvents.add(eventKey);
                }
            }
        } else {
            console.warn('One or more required elements are missing:', {
                scoreElement,
                populationElement,
                titleElement,
                serverElement,
                timeElement
            });
        }
    });
}

// Use MutationObserver to ensure that the options-grid is fully loaded
function observeOptionsGrid() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && document.querySelector('.options-grid')) {
                injectFilterIntoOptionsGrid();
                observer.disconnect(); // Stop watching after the filter is inserted
            }
        }
    });

// Watch the document
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the filter after loading the page
observeOptionsGrid();

// Repeat filtering every 1000 milliseconds (1 seconds) 
setInterval(() => {
    chrome.storage.sync.get(['minScore', 'minPopulation', 'maxPopulation', 'timeLimitMinutes'], (updatedSettings) => {
        filterEvents(updatedSettings);
    });
}, 1000);
