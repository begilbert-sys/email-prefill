import { waitForTabToLoad } from './util/waitfortab.js';

/*
Returns a "tab" object representing the currently opened tab
https://developer.chrome.com/docs/extensions/reference/api/tabs#type-Tab
*/
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab == undefined) {
        console.error("tab is undefined");
        return undefined;
    }
    return tab;
}

/* 
Asks the `content.js` script to return a string with the page's contents
*/
async function getPageContents(tab) {
    const response = await chrome.tabs.sendMessage(tab.id, { message: "get page contents" });
    return response.pageContents;
}

/* 
Opens an email prompt in a new tab, and sends the current page's parsed HTML contents to the new tab in a message
*/
chrome.runtime.onMessage.addListener(async (request, sender, reply) => {
    if (request.message === "start service worker") {
        const tab = await getCurrentTab();

        const pageContents = await getPageContents(tab);

        const tabUrl =
            "https://mail.google.com/mail/?view=cm&fs=1&tf=1"
            + "&su=" + encodeURIComponent(tab.title)
            + "&boomerangtheweb=1";
        
        const emailTab = await chrome.tabs.create({ "url": tabUrl });

        // the new page must be fully loaded, or else it won't receive the message 
        await waitForTabToLoad(emailTab.id);

        await chrome.tabs.sendMessage(emailTab.id, { message: "autofill the email", content: pageContents });
    }
});

