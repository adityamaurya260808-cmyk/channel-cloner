// Runs on your own website (the URLs listed for it in manifest.json).
// Relays window.postMessage calls from the page to the extension, and
// generation progress from the extension back to the page.
// web/flowpilot-client.js is the page-side half of this protocol.
(() => {
  'use strict';
  const FROM_PAGE = 'flowpilot-web';
  const TO_PAGE = 'flowpilot-ext';
  const post = (data) => window.postMessage({ source: TO_PAGE, ...data }, window.location.origin);

  window.addEventListener('message', async (e) => {
    if (e.source !== window || e.data?.source !== FROM_PAGE) return;
    const { requestId, type, jobId, prompts, mode, speed } = e.data;
    let result;
    try {
      result = await chrome.runtime.sendMessage({ type: 'FP_WEB', action: type, jobId, prompts, mode, speed });
    } catch (err) {
      result = { ok: false, error: err.message };
    }
    post({ type: 'response', requestId, result });
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'FP_WEB_EVENT') post({ type: 'event', ...msg.event });
    return false;
  });
})();
