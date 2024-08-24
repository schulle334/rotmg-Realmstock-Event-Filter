document.getElementById('applySettings').addEventListener('click', () => {
    const minScore = parseInt(document.getElementById('minScore').value, 10);
    const minPopulation = parseInt(document.getElementById('minPopulation').value, 10);
    const maxPopulation = parseInt(document.getElementById('maxPopulation').value, 10);
    const timeLimitMinutes = parseInt(document.getElementById('timeLimitMinutes').value, 10);

    chrome.storage.sync.set({
        minScore,
        minPopulation,
        maxPopulation,
        timeLimitMinutes
    }, () => {
        alert('Einstellungen gespeichert');
    });
});
