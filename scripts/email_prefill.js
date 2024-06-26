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
                    // wait another 100 ms, just in case
                    setTimeout(() => {
                        resolve();
                        observer.disconnect();
                    }, 100);
                }
            });
        });
        observer.observe(target, config);
    });
}


function isValidElement(element) {
    const text = element.textContent.toLowerCase();
    const wordList = text.split(' ');
    if (text.length < 1 || (wordList.length < 10 && (text.includes('advertisement') || text.includes('ad')))) {
        console.log('eliminated ^');
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
        const tables = parsedDoc.querySelectorAll('table');
        tables.forEach((fig) => {
            fig.parentNode.removeChild(fig);
        });

        const videos = parsedDoc.querySelectorAll('[attribute*="video"]');
        videos.forEach((vid) => {
            vid.parentNode.removeChild(vid);
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
        const elements = parsedDoc.querySelectorAll('p, h1, h2, h3, h4, ul, ol');


        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            console.log(element);
            if (element.tagName === 'P') {
                if (!isValidElement(element)) {
                    continue;
                }
            } else if (element.tagName.startsWith('h')) {
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
ISSUES:

Videos are displayed:
https://www.babycenter.com/baby/crying-colic/what-to-do-when-your-baby-cries-for-no-reason_10320516

maybe remove classes with "video" in them? 

Figure this one out:
https://www.cnbc.com/2018/01/29/money-habits-of-self-made-billionaire-ikea-founder-ingvar-kamprad.html


Fix HTML characters appearing in titles: 
https://www.billboard.com/music/music-news/snoop-dogg-dionne-warwick-confronted-him-over-misogynistic-lyrics-1235193028/amp/


Sanitize HTML before putting it in the email


Ignore <p> if it is within a <li> 
https://docs.python.org/3/library/asyncio.html

*/