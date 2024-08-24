chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'startFiltering') {
        // Debugging: Überprüfe, ob sender.tab vorhanden ist
        console.log('Message received from tab:', sender);

        // Sicherstellen, dass sender.tab id vorhanden ist
        if (sender.tab && sender.tab.id) {
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: ['content.js']
            }).then(() => {
                console.log('Script injected successfully');
            }).catch(err => {
                console.error('Error injecting script:', err);
            });
        } else {
            console.error('Tab ID not found');
        }
    }
});
