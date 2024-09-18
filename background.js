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

        // Parametri per la disposizione a griglia
        const gridColumns = 3; // Numero di colonne nella griglia
        const windowWidth = 400; // Larghezza della finestra
        const windowHeight = 300; // Altezza della finestra

        // Crea nuove finestre per ogni dominio
        let index = 0;
        for (const [domain, tabIds] of Object.entries(domainMap)) {
            // Calcola la posizione della finestra
            const row = Math.floor(index / gridColumns);
            const col = index % gridColumns;

            chrome.windows.create({
                tabId: tabIds[0], // Apri la prima scheda del dominio nella nuova finestra
                width: windowWidth,
                height: windowHeight,
                left: col * windowWidth,
                top: row * windowHeight
            }, (newWindow) => {
                // Sposta le altre schede nella nuova finestra
                chrome.tabs.move(tabIds.slice(1), { windowId: newWindow.id, index: -1 });
            });

            index++; // Incrementa l'indice per la prossima finestra
        }
    });
});