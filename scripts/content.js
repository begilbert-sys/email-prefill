chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "get page contents") {
        var documentClone = document.cloneNode(true);
        var article = new Readability(documentClone).parse();

        sendResponse({pageContents: article.content});
    }
});
