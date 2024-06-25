import { waitForElementToLoad } from "../util/waitforelement";
/* relevant element IDs */
const TOOLBAR_ELEMENT_ID = ":m7";
const MESSAGEBOX_ELEMENT_ID = ":nf";

/* fill the email body with relevant text */
chrome.runtime.onMessage.addListener( async (request, sender, sendResponse) => {
    if (request.message === "autofill the email") {

        // once the email's toolbar loads, it's safe to inject the content
        // if the content is injected too soon, it gets overwritten 
        await waitForElementToLoad(TOOLBAR_ELEMENT_ID);

        // turn the HTML string into an actual document object
        console.log(request.content);
        let parsedDoc = new DOMParser().parseFromString(request.content, "text/html");

        let messageBody = document.getElementById(MESSAGEBOX_ELEMENT_ID);
        parsedDoc.querySelectorAll('p, h1, h2, h3').forEach((element) => {
            messageBody.appendChild(element);
        });
    }
});
