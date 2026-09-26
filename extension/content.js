// Runs inside the Google Flow tab. Owns the prompt queue: types each prompt
// into Flow's editor, clicks the create button, and matches the generated
// media (reported by page-hook.js) back to the prompt that produced it.
(() => {
  'use strict';

  const STATE_KEY = 'fp_state';
  const SETTINGS_KEY = 'fp_settings';
  const MAX_IN_FLIGHT = { fast: 4, balanced: 2, slow: 1 };
  const MIN_GAP_MS = { fast: 4000, balanced: 10000, slow: 3000 };
  const TIMEOUT_MS = { image: 3 * 60 * 1000, video: 10 * 60 * 1000 };
  const MAX_LOGS = 300;
  const ACTIVE = ['submitting', 'generating'];

  let state = { running: false, speed: 'balanced', mode: 'image', items: [], logs: [] };
  let lastSubmitAt = 0;
  let loopActive = false;
  let saveTimer = null;
  const seenMedia = new Set();

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => chrome.storage.local.set({ [STATE_KEY]: state }).catch(() => {}), 150);
  }

  function log(msg, level = 'info') {
    state.logs.push({ t: Date.now(), level, msg });
    if (state.logs.length > MAX_LOGS) state.logs.splice(0, state.logs.length - MAX_LOGS);
    save();
  }

  // ---------- Flow page helpers ----------

  function findEditor() {
    return document.querySelector('div[data-slate-editor="true"]');
  }

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  // Flow's send button has an "arrow_forward" icon; fall back to aria-labels.
  function findSubmitButton(editor) {
    const buttons = [...document.querySelectorAll('button')].filter(isVisible);
    const byIcon = buttons.filter((b) => /arrow_forward/.test(b.textContent || ''));
    const byLabel = buttons.filter((b) => /create|generate|send|submit/i.test(b.getAttribute('aria-label') || ''));
    const candidates = byIcon.length ? byIcon : byLabel;
    if (!candidates.length) return null;
    if (!editor) return candidates[0];
    // Prefer the button that shares the closest container with the editor.
    let node = editor.parentElement;
    while (node) {
      const hit = candidates.find((b) => node.contains(b));
      if (hit) return hit;
      node = node.parentElement;
    }
    return candidates[0];
  }

  async function waitFor(fn, timeoutMs, stepMs = 250) {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      const v = fn();
      if (v) return v;
      await sleep(stepMs);
    }
    return null;
  }

  function editorText(editor) {
    return (editor.textContent || '').replace(/﻿/g, '').trim();
  }

  async function setEditorText(editor, text) {
    editor.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    document.execCommand('insertText', false, text);
    await sleep(200);
    if (editorText(editor) === text.trim()) return;

    // Fallback: paste the text, which Slate editors handle natively.
    editor.focus();
    document.execCommand('selectAll', false, null);
    const dt = new DataTransfer();
    dt.setData('text/plain', text);
    editor.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    await sleep(300);
    if (editorText(editor) !== text.trim()) throw new Error('Could not type the prompt into Flow');
  }

  // ---------- queue runner ----------

  async function submit(item) {
    item.status = 'submitting';
    save();
    const editor = await waitFor(findEditor, 15000);
    if (!editor) throw new Error('Flow prompt box not found — open a Flow project');
    await setEditorText(editor, item.prompt);

    const button = await waitFor(() => {
      const b = findSubmitButton(editor);
      return b && !b.disabled && b.getAttribute('aria-disabled') !== 'true' ? b : null;
    }, 20000);
    if (!button) throw new Error('Create button not found or stayed disabled');
    button.click();

    item.status = 'generating';
    item.submittedAt = Date.now();
    lastSubmitAt = Date.now();
    log(`Sent #${item.n}: ${item.prompt.slice(0, 60)}`);
    save();
  }

  function expireTimeouts() {
    const now = Date.now();
    for (const item of state.items) {
      if (item.status !== 'generating' || !item.submittedAt) continue;
      const limit = TIMEOUT_MS[item.mode] || TIMEOUT_MS.image;
      if (now - item.submittedAt > limit) {
        if (item.outputs.length) {
          item.status = 'done';
        } else {
          item.status = 'failed';
          item.error = 'Timed out waiting for result';
          log(`#${item.n} timed out`, 'error');
        }
        save();
      }
    }
  }

  async function runLoop() {
    if (loopActive) return;
    loopActive = true;
    let failStreak = 0;
    try {
      while (state.running) {
        expireTimeouts();
        const inFlight = state.items.filter((i) => ACTIVE.includes(i.status)).length;
        const next = state.items.find((i) => i.status === 'pending');

        if (!next && inFlight === 0) {
          state.running = false;
          const done = state.items.filter((i) => i.status === 'done').length;
          const failed = state.items.filter((i) => i.status === 'failed').length;
          log(`Finished: ${done} done, ${failed} failed`, 'success');
          break;
        }

        const speed = state.speed;
        if (next && inFlight < MAX_IN_FLIGHT[speed] && Date.now() - lastSubmitAt >= MIN_GAP_MS[speed]) {
          try {
            await submit(next);
            failStreak = 0;
          } catch (e) {
            next.status = 'failed';
            next.error = e.message;
            log(`#${next.n} failed: ${e.message}`, 'error');
            if (++failStreak >= 3) {
              state.running = false;
              log('Stopped after 3 failures in a row. Check the Flow tab.', 'error');
            }
          }
          save();
        }
        await sleep(1000);
      }
    } finally {
      loopActive = false;
      save();
    }
  }

  // ---------- matching results to prompts ----------

  const URL_KEYS = ['fifeUrl', 'fifeUri', 'videoUrl', 'servingUri', 'servingUrl'];

  // Collect media from any JSON shape: URL fields plus inline base64 images.
  // An object carrying both a URL and base64 of the same image yields only the URL.
  function findMedia(obj, out = []) {
    if (!obj || typeof obj !== 'object') return out;
    const hasUrl = URL_KEYS.some((k) => typeof obj[k] === 'string' && /^https?:\/\//.test(obj[k]));
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        if (URL_KEYS.includes(k) && /^https?:\/\//.test(v)) {
          out.push({ url: v, kind: k === 'videoUrl' || /\.mp4|video/i.test(v) ? 'video' : 'image' });
        } else if (k === 'encodedImage' && !hasUrl && v.length > 100) {
          const mime = v.startsWith('iVBOR') ? 'image/png' : 'image/jpeg';
          out.push({ url: `data:${mime};base64,${v}`, kind: 'image' });
        }
      } else if (v && typeof v === 'object') {
        findMedia(v, out);
      }
    }
    return out;
  }

  function mediaKey(url) {
    return url.startsWith('data:') ? `${url.length}:${url.slice(-120)}` : url.split('?')[0];
  }

  // The request body contains the prompt text, which tells us which item it was.
  function itemForRequest(body, mode) {
    const waiting = state.items.filter((i) => ACTIVE.includes(i.status));
    const byPrompt = waiting.find((i) => body && body.includes(JSON.stringify(i.prompt).slice(1, -1)));
    return byPrompt || waiting.find((i) => i.mode === mode && !i.outputs.length) || waiting[0] || null;
  }

  function extFor(media) {
    if (media.kind === 'video') return 'mp4';
    return media.url.startsWith('data:image/png') ? 'png' : 'jpg';
  }

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'prompt';
  }

  async function downloadMedia(item, media) {
    const { [SETTINGS_KEY]: s = {} } = await chrome.storage.local.get(SETTINGS_KEY);
    const autoDownload = media.kind === 'video' ? s.autoVideos !== false : s.autoImages !== false;
    if (!autoDownload) return;

    const folder = (s.folder || 'flowpilot').replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'flowpilot';
    const num = String(item.n).padStart(3, '0');
    const suffix = item.outputs.length > 1 ? `-${item.outputs.length}` : '';
    const base = s.naming === 'prompt' ? `${num}-${slug(item.prompt)}` : num;
    const filename = `${folder}/${base}${suffix}.${extFor(media)}`;

    const res = await chrome.runtime.sendMessage({ type: 'FP_DOWNLOAD', url: media.url, filename }).catch((e) => ({ ok: false, error: e.message }));
    if (res?.ok) log(`Saved ${filename}`, 'success');
    else log(`Download failed for #${item.n}: ${res?.error || 'unknown error'}`, 'error');
  }

  function addOutputs(item, mediaList) {
    for (const media of mediaList) {
      const key = mediaKey(media.url);
      if (seenMedia.has(key)) continue;
      seenMedia.add(key);
      item.outputs.push(media.url.startsWith('data:') ? 'inline-image' : media.url);
      item.status = 'done';
      downloadMedia(item, media);
    }
    save();
  }

  function onApiEvent({ kind, body, data, status }) {
    if (status >= 400) {
      const item = itemForRequest(body, kind === 'image' ? 'image' : 'video');
      if (item && kind !== 'video-status') {
        item.status = 'failed';
        item.error = data?.error?.message || `Flow returned HTTP ${status}`;
        log(`#${item.n} failed: ${item.error}`, 'error');
        save();
      }
      return;
    }

    if (kind === 'image') {
      const item = itemForRequest(body, 'image');
      const media = findMedia(data);
      if (item && media.length) addOutputs(item, media);
      return;
    }

    const ops = Array.isArray(data?.operations) ? data.operations : [];
    if (kind === 'video-start') {
      const item = itemForRequest(body, 'video');
      if (!item) return;
      item.opNames = ops.map((op) => op?.operation?.name || op?.name).filter(Boolean);
      save();
      return;
    }

    // video-status: each operation reports its own progress.
    for (const op of ops) {
      const name = op?.operation?.name || op?.name;
      const item = state.items.find((i) => i.opNames?.includes(name))
        || state.items.find((i) => i.status === 'generating' && i.mode === 'video' && !i.outputs.length);
      if (!item) continue;
      const media = findMedia(op).map((m) => ({ ...m, kind: 'video' }));
      if (media.length) {
        addOutputs(item, media);
      } else if (/FAILED/.test(op?.status || '')) {
        item.failedOps = (item.failedOps || 0) + 1;
        if (item.failedOps >= (item.opNames?.length || 1) && !item.outputs.length) {
          item.status = 'failed';
          item.error = 'Flow reported the video failed';
          log(`#${item.n} video failed`, 'error');
        }
        save();
      }
    }
  }

  window.addEventListener('message', (e) => {
    if (e.source !== window || e.data?.source !== 'flowpilot') return;
    try {
      onApiEvent(e.data);
    } catch (err) {
      log(`Could not read Flow response: ${err.message}`, 'error');
    }
  });

  // ---------- commands from the side panel ----------

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    switch (msg?.type) {
      case 'FP_PING':
        sendResponse({ ok: true, hasEditor: !!findEditor(), running: state.running });
        return false;

      case 'FP_START': {
        state.speed = msg.speed || state.speed;
        state.mode = msg.mode || state.mode;
        let n = state.items.reduce((m, i) => Math.max(m, i.n), 0);
        for (const prompt of msg.prompts || []) {
          state.items.push({ n: ++n, prompt, mode: state.mode, status: 'pending', outputs: [] });
        }
        if (!state.items.some((i) => i.status === 'pending')) {
          sendResponse({ ok: false, error: 'No prompts in the queue' });
          return false;
        }
        if (!state.running) {
          state.running = true;
          log(`Started (${state.speed}, ${state.mode})`);
          runLoop();
        } else if (msg.prompts?.length) {
          log(`Added ${msg.prompts.length} prompts to the running queue`);
        }
        save();
        sendResponse({ ok: true });
        return false;
      }

      case 'FP_STOP':
        state.running = false;
        for (const i of state.items) if (i.status === 'submitting') i.status = 'pending';
        log('Stopped. Prompts already sent to Flow may still finish.');
        sendResponse({ ok: true });
        return false;

      case 'FP_RETRY_FAILED':
        for (const i of state.items) {
          if (i.status === 'failed') Object.assign(i, { status: 'pending', error: null, outputs: [], opNames: [], failedOps: 0 });
        }
        save();
        sendResponse({ ok: true });
        return false;

      case 'FP_CLEAR':
        if (state.running) {
          sendResponse({ ok: false, error: 'Stop the queue first' });
          return false;
        }
        state.items = [];
        state.logs = [];
        save();
        sendResponse({ ok: true });
        return false;

      case 'FP_CLEAR_LOGS':
        state.logs = [];
        save();
        sendResponse({ ok: true });
        return false;
    }
    return false;
  });

  // ---------- restore after a page reload ----------

  chrome.storage.local.get(STATE_KEY).then(({ [STATE_KEY]: saved }) => {
    if (!saved) return;
    state = { ...state, ...saved };
    for (const item of state.items) {
      for (const url of item.outputs || []) if (url !== 'inline-image') seenMedia.add(mediaKey(url));
      if (item.status === 'submitting') item.status = 'pending';
    }
    if (state.running) {
      state.running = false;
      log('Flow page reloaded — press Start to continue the queue.');
    }
    save();
  });
})();
