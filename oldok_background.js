chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({}, (tabs) => {
        const domainMap = {};

        // Raggruppa le schede per dominio
        tabs.forEach((tab) => {
            try {
                const url = new URL(tab.url);
                const domain = url.hostname;

                if (!domainMap[domain]) {
                    domainMap[domain] = [];
                }
                domainMap[domain].push(tab.id);
            } catch (error) {
                console.error(`URL non valido: ${tab.url}`, error);
            }
        });

        // Crea nuove finestre per ogni dominio
        for (const [domain, tabIds] of Object.entries(domainMap)) {
            chrome.windows.create({ tabId: tabIds[0] }, (newWindow) => {
                chrome.tabs.move(tabIds, { windowId: newWindow.id, index: -1 });
            });
        }
    });
});