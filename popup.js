document.getElementById('applySettings').addEventListener('click', () => {
    const minScore = parseInt(document.getElementById('minScore').value, 10);
    const minPopulation = parseInt(document.getElementById('minPopulation').value, 10);
    const timeLimitMinutes = parseInt(document.getElementById('timeLimitMinutes').value, 10);

    chrome.storage.sync.set({
        minScore,
        minPopulation,
        timeLimitMinutes
    }, () => {
        alert('Settings saved');

        // Reload the current page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
    });
});
