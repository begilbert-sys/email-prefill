chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "get page contents") {
        var documentClone = document.cloneNode(true);
        const parsedDocument = new Readability(documentClone).parse();
        console.log(parsedDocument);
        sendResponse({ 
            content: parsedDocument.content, 
            title: parsedDocument.title
        });
    }
});
