// Clicking the toolbar icon opens the side panel.
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});
chrome.runtime.onStartup.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});

// Content scripts cannot use chrome.downloads, so they ask us to save files.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== 'FP_DOWNLOAD') return false;
  chrome.downloads.download(
    { url: msg.url, filename: msg.filename, conflictAction: 'uniquify', saveAs: false },
    (id) => {
      const err = chrome.runtime.lastError;
      sendResponse(err ? { ok: false, error: err.message } : { ok: true, id });
    }
  );
  return true;
});
