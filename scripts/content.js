chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "get page contents") {
        var documentClone = document.cloneNode(true);
        const parsedDocument = new Readability(documentClone).parse();
        let parsedDoc = new DOMParser().parseFromString(parsedDocument.content, "text/html");
        console.log(parsedDoc);
        sendResponse({ 
            content: parsedDocument.content, 
            title: document.title
        });
    }
});
