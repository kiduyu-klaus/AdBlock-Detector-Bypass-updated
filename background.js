// Auto-inject on page load
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only inject when page has fully loaded
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["changeDom.js"]
      });
    } catch (err) {
      console.log('Could not inject script:', err);
    }
  }
});

// Also keep manual trigger option
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["changeDom.js"]
  });
});