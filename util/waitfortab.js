var tabLoadingTrap = { tabId: undefined, resolve: undefined };

/* 
returns a Promise that only resolves once the tab is loaded
*/
export function waitForTabToLoad(tab) {
    console.log('function entered');
    tabLoadingTrap.tabId = tab.id;

    return new Promise((resolve) => {
        tabLoadingTrap.resolve = resolve;
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (tabId === tabLoadingTrap.tabId && changeInfo.status === 'complete') {
        tabLoadingTrap.resolve();

        tabLoadingTrap.tabId = undefined;
        tabLoadingTrap.resolve = undefined;
    }
});