/* returns a Promise that only resolves once the element is loaded */
function waitForElementToLoad(elementId) {

    const target = document.querySelector("body");
    const config = { childList: true };

    return new Promise((resolve) => {
        const observer = new MutationObserver((mutationList, observer) => {
            const element = document.getElementById(elementId);
            if (element) {
                resolve();
            }
        });
        observer.observe(target, config);
    });
}