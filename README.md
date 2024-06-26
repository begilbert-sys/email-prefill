# Email Prefill 
<img src="https://i.imgur.com/XXomUje.mp4">
Copies the contents of an article into a new email body. 
So far, it works well on news sites / articles. I've just been testing it on random webpages and adjusting accordingly. 

## How it works
1. User clicks the extension 
2. `popup.js` sends a message to `service_worker.js` telling it to start
3. `service_worker.js` sends a message to the current tab (`content.js`), requesting the page contents
4. `content.js` uses Readability.js to extract relevant HTML content from the current tab, and sends it back to `service_worker.js`
5. `service_worker.js` opens a new email body in a new tab, waits for it to load, and then sends the HTML content to the email tab (`email_prefill.js`)
6. `email_prefill.js` does some more HTML parsing, and then adds the content into the email's message body. 

## External Libraries used
* <a href="https://github.com/mozilla/readability">Readability.js</a> - Mozilla's library for extracting 'readable' text from a webpage
* <a href="https://github.com/cure53/DOMPurify">DOMPurify</a> - sanitizes HTML to prevent cross-site scripting attacks

Both libraries are licensed under Apache 2.0, which I believe means it's okay to use. 


## Issues/To-Do List

* Implement DOMPurify 
* `<p>` elements won't display if they're inside of a `<li>` element
* Figure out how to handle licensing 
* Make the code look nicer (lol)