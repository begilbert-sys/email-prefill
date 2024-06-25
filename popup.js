/*
When the extension is clicked on, send a message to `service_worker.js` telling it to start 
*/
document.addEventListener("DOMContentLoaded", async function() {
    chrome.runtime.sendMessage({ message: "start service worker" });
});