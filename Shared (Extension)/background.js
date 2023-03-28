// Archive Page extension for Mozilla Firefox for use with archive.today
// Based on original extension Written by John Navas, ported to Safari by Gerald Normandin
// 1. Toolbar icon to send current tab to archive.today in new tab
// 2. Page context menu to search archive.today for the page URL
// 3. Link context menu items to Archive or Search with archive.today
// Option to open in adjacent tab, tab at end, or current tab (archive only)
// Options to control activation of new archive.today tabs (archive & search)
// For Firefox, options saved in local, not sync!

const URLA = 'https://archive.today/?run=1&url='; // URL to invoke archive.today
const URLS = 'https://archive.today/search/?q=' // URL to search archive.today

// Archive page URL
function doArchivePage(uri, act) {
    console.log('doArchivePage act: ' + act); // DEBUG
    chrome.storage.local.get({ tabOption: 0 }, function(result) {
        console.log('tabOption: ' + result.tabOption); // DEBUG
        switch (result.tabOption) {
            case 1: // NEW TAB AT END
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.create({
                        url: URLA + encodeURIComponent(uri),
                        index: 999, // CLAMPED TO END BY BROWSER
                        openerTabId: tabs[0].id,
                        active: act
                    });
                });
                break;
            case 2: // ACTIVE TAB
                chrome.tabs.update({
                    url: URLA + encodeURIComponent(uri)
                });
                break;
            default: // NEW TAB ADJACENT
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.create({
                        url: URLA + encodeURIComponent(uri),
                        index: tabs[0].index + 1, // ADJACENT
                        openerTabId: tabs[0].id,
                        active: act
                    });
                });
        }
    });
}



// Listen for toolbar button click
chrome.browserAction.onClicked.addListener(function(tab) {
    // get activate option
    chrome.storage.local.get({ activateButtonNew: true }, function(result) {
        console.log('activateButtonNew: ' + result.activateButtonNew); // DEBUG
        doArchivePage(tab.url, result.activateButtonNew);
    });
});




// END
