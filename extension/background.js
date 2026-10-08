// Clicking the toolbar icon opens the side panel.
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});
chrome.runtime.onStartup.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});

async function findFlowTab() {
  const tabs = await chrome.tabs.query({ url: 'https://labs.google/fx/*' });
  const flowTabs = tabs.filter((t) => /\/tools\/flow/.test(t.url || ''));
  return flowTabs.find((t) => t.active) || flowTabs[0] || null;
}

// ---------- requests from your website (via bridge.js) ----------

async function handleWebRequest(msg, sender) {
  const tab = await findFlowTab();
  if (!tab) return { ok: false, error: 'Open a Google Flow project in this browser first' };

  const toFlow = (m) => chrome.tabs.sendMessage(tab.id, m).catch(() => ({
    ok: false,
    error: 'Reload the Flow tab once so FlowPilot can connect to it',
  }));

  switch (msg.action) {
    case 'ping': {
      const res = await toFlow({ type: 'FP_PING' });
      return res?.error ? res : { ok: true, ...res };
    }
    case 'generate': {
      const prompts = (Array.isArray(msg.prompts) ? msg.prompts : [])
        .map((p) => String(p ?? '').trim());
      if (!prompts.length || prompts.some((p) => !p)) return { ok: false, error: 'Send at least one prompt, none empty' };
      // The ref lets results find their way back to this exact tab and job.
      const items = prompts.map((prompt, index) => ({
        prompt,
        ref: { tabId: sender.tab.id, jobId: String(msg.jobId), index },
      }));
      const mode = msg.mode === 'video' ? 'video' : 'image';
      const speed = ['fast', 'balanced', 'slow'].includes(msg.speed) ? msg.speed : undefined;
      return toFlow({ type: 'FP_START', prompts: items, mode, speed });
    }
    case 'stop':
      return toFlow({ type: 'FP_STOP' });
    default:
      return { ok: false, error: `Unknown action: ${msg.action}` };
  }
}

// ---------- results back to your website ----------

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

// Images go to the site as data URLs so it can show or upload them without
// running into CORS. Videos are too big for that and keep their Flow URL.
async function inlineImage(media) {
  if (media.kind !== 'image' || media.url.startsWith('data:')) return media;
  try {
    const res = await fetch(media.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') || 'image/jpeg';
    return { ...media, url: `data:${type};base64,${toBase64(await res.arrayBuffer())}` };
  } catch (_) {
    return media;
  }
}

async function forwardResult({ ref, event }) {
  if (event.outputs) event = { ...event, outputs: await Promise.all(event.outputs.map(inlineImage)) };
  chrome.tabs.sendMessage(ref.tabId, {
    type: 'FP_WEB_EVENT',
    event: { jobId: ref.jobId, index: ref.index, ...event },
  }).catch(() => {});
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg?.type) {
    // Content scripts cannot use chrome.downloads, so they ask us to save files.
    case 'FP_DOWNLOAD':
      chrome.downloads.download(
        { url: msg.url, filename: msg.filename, conflictAction: 'uniquify', saveAs: false },
        (id) => {
          const err = chrome.runtime.lastError;
          sendResponse(err ? { ok: false, error: err.message } : { ok: true, id });
        }
      );
      return true;

    case 'FP_WEB':
      if (!sender.tab) return false;
      handleWebRequest(msg, sender).then(sendResponse, (e) => sendResponse({ ok: false, error: e.message }));
      return true;

    case 'FP_WEB_RESULT':
      forwardResult(msg);
      return false;
  }
  return false;
});
