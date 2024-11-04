// Set the time limit (in milliseconds) for the Facebook tab
const TIME_LIMIT = 3 * 60 * 1000; // 3 minutes

// Dictionary to track active timers by tabId
const facebookTabTimers = {};

// Monitor tab updates to find Facebook tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("facebook.com")) {
    // If a timer is already set for this tab, do nothing
    if (facebookTabTimers[tabId]) return;

    // Start a new timer for the Facebook tab
    const timeoutId = setTimeout(() => {
      chrome.tabs.remove(tabId, () => {
        // Clean up the timer reference after closing the tab
        delete facebookTabTimers[tabId];
      });
    }, TIME_LIMIT);

    // Store the timeout ID so we don't set a new one if the tab is updated again
    facebookTabTimers[tabId] = timeoutId;
  }
});

// Monitor tab removal to clear any active timers
chrome.tabs.onRemoved.addListener((tabId) => {
  if (facebookTabTimers[tabId]) {
    // Clear the timer if the tab is closed manually
    clearTimeout(facebookTabTimers[tabId]);
    delete facebookTabTimers[tabId];
  }
});
