/* returns a Promise that only resolves once it's safe to edit the message body */
function pageFinishedLoading() {
    /*
    'DOMContentLoaded' and 'onload' do not work here:
    Slightly after the page loads, the contents of the message body gets wiped automatically (I don't know why).
    So if anything were added to the message body before this happened, it would get deleted. 
    This function only resolves the promise once that event has completed.
    */
    const target = document.querySelector("body");
    const config = { subtree: true, attributes: true, childList: true };

    return new Promise((resolve) => {
        const observer = new MutationObserver((mutationList, observer) => {
            mutationList.forEach((mutationRecord) => {
                if (mutationRecord.target.id === ":nf" && mutationRecord.removedNodes.length >  0) {
                    resolve();
                    observer.disconnect();
                }
            });
        });
        observer.observe(target, config);
    });
}


function isValidElement(element) {
    const text = element.textContent.toLowerCase();
    if (text.split(' ').length < 3 && (text.includes('advertisement') || text.includes('ad'))) {
        return false;
    }
    return true;
}
/* relevant element IDs */
const MESSAGEBOX_ELEMENT_ID = "#\\:nf";

/* fill the email body with relevant text */
chrome.runtime.onMessage.addListener( async (request, sender, sendResponse) => {
    if (request.message === "autofill the email") {

        // if the content is injected too soon, it gets overwritten 
        // so, we wait for the email's toolbar to load before injecting

        // turn the received HTML string into an actual document object
        let parsedDoc = new DOMParser().parseFromString(request.content, "text/html");



        // remove all figures from the document 
        const figures = parsedDoc.querySelectorAll('figure');
        figures.forEach((fig) => {
            fig.parentNode.removeChild(fig);
        });

        await pageFinishedLoading();

        let messageBody = document.querySelector(MESSAGEBOX_ELEMENT_ID);

        // add the title as a link to the site
        const aTitle = document.createElement('a');
        const h2Title = document.createElement('h1');
        h2Title.style.margin = '0';
        const textTitle = document.createTextNode(request.title);
        h2Title.appendChild(textTitle);
        aTitle.appendChild(h2Title);
        aTitle.href = request.url;

        messageBody.appendChild(aTitle)

        // we only really care about 'p' and 'h' elements
        const elements = parsedDoc.querySelectorAll('p, h1, h2, h3, h4');


        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.tagName === 'P' && !isValidElement(element)) {
                continue;
            } else {
                // ignore 'h' elements that are not followed by a valid 'p' element
                if ((i === elements.length - 1) || elements[i+1].tagName !== 'P') {
                    continue;
                }
            }
            messageBody.appendChild(element);
        }
    }
});


/*
TODO:

* remove links internal to the website 

*/