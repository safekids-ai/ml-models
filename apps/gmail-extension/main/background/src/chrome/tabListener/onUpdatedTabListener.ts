
export const onUpdatedTabListener = async (tabId: number, tabInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  const tabURL = tab.url || tabInfo.url
  if (!tabURL || (tabURL.startsWith('chrome-extension:') || tabURL.startsWith('chrome:'))) {
    return
  }
}
