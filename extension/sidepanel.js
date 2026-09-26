'use strict';

const STATE_KEY = 'fp_state';
const SETTINGS_KEY = 'fp_settings';
const FLOW_URL = 'https://labs.google/fx/tools/flow';
const STATUS_LABEL = { pending: 'Queued', submitting: 'Sending…', generating: 'Generating…', done: 'Done', failed: 'Failed' };

const $ = (id) => document.getElementById(id);
const choice = { mode: 'image', speed: 'balanced' };
let flowTabId = null;
let running = false;

// ---------- talking to the Flow tab ----------

async function findFlowTab() {
  const tabs = await chrome.tabs.query({ url: 'https://labs.google/fx/*' });
  const flowTabs = tabs.filter((t) => /\/tools\/flow/.test(t.url || ''));
  return flowTabs.find((t) => t.active) || flowTabs[0] || null;
}

async function send(msg) {
  if (!flowTabId) throw new Error('No Flow tab open');
  return chrome.tabs.sendMessage(flowTabId, msg);
}

async function checkConnection() {
  const tab = await findFlowTab();
  flowTabId = tab?.id ?? null;
  const status = $('status');
  let text = 'Not connected';
  let cls = 'status-off';
  let hint = null;
  let showReload = false;

  if (!tab) {
    hint = 'Open a Google Flow project to start.';
  } else {
    try {
      const res = await send({ type: 'FP_PING' });
      if (res?.running) { text = 'Running'; cls = 'status-busy'; }
      else if (res?.hasEditor) { text = 'Connected'; cls = 'status-on'; }
      else { text = 'No project'; hint = 'Open or create a project in Flow so the prompt box is visible.'; }
    } catch (_) {
      hint = 'Reload the Flow tab once so FlowPilot can connect to it.';
      showReload = true;
    }
  }

  status.textContent = text;
  status.className = `status ${cls}`;
  $('connect-hint').hidden = !hint;
  $('connect-text').textContent = hint || '';
  $('btn-open-flow').hidden = !!tab;
  $('btn-reload-flow').hidden = !showReload;
}

// ---------- rendering ----------

function promptLines() {
  return $('prompts').value.split('\n').map((l) => l.trim()).filter(Boolean);
}

function updatePromptCount() {
  const n = promptLines().length;
  $('prompt-count').textContent = `${n} prompt${n === 1 ? '' : 's'}`;
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function render(state) {
  const items = state?.items || [];
  const logs = state?.logs || [];
  running = !!state?.running;

  const count = (s) => items.filter((i) => i.status === s).length;
  const done = count('done');
  const failed = count('failed');
  const active = count('submitting') + count('generating');
  const pending = count('pending');

  $('btn-stop').disabled = !running;
  $('btn-start').textContent = running ? 'Add to queue' : pending && !promptLines().length ? 'Resume' : 'Start';
  $('queue-badge').textContent = items.length ? String(items.length) : '';

  $('progress').hidden = !items.length;
  const finished = done + failed;
  $('progress-fill').style.width = items.length ? `${(finished / items.length) * 100}%` : '0';
  $('progress-text').textContent = `${finished} / ${items.length} finished` + (failed ? ` · ${failed} failed` : '');
  $('queue-summary').textContent = `${pending} queued · ${active} generating · ${done} done · ${failed} failed`;

  const list = $('queue-list');
  list.replaceChildren();
  if (!items.length) list.append(el('li', 'empty', 'No prompts yet. Add some on the Create tab.'));
  for (const item of items) {
    const li = el('li');
    const body = el('div', 'q-prompt', item.prompt);
    if (item.error) body.append(el('span', 'q-err', item.error));
    const outputs = item.outputs?.length ? ` (${item.outputs.length})` : '';
    li.append(el('span', 'q-num', `#${item.n}`), body, el('span', `q-status st-${item.status}`, STATUS_LABEL[item.status] + outputs));
    list.append(li);
  }

  const logList = $('log-list');
  logList.replaceChildren();
  if (!logs.length) logList.append(el('li', 'empty', 'Nothing yet.'));
  for (const entry of [...logs].reverse()) {
    const li = el('li', `log-${entry.level}`);
    li.append(el('span', 'log-time', new Date(entry.t).toLocaleTimeString()), document.createTextNode(entry.msg));
    logList.append(li);
  }
}

// ---------- settings ----------

async function loadSettings() {
  const { [SETTINGS_KEY]: s = {} } = await chrome.storage.local.get(SETTINGS_KEY);
  $('set-folder').value = s.folder || 'flowpilot';
  $('set-auto-images').checked = s.autoImages !== false;
  $('set-auto-videos').checked = s.autoVideos !== false;
  $('set-naming').value = s.naming || 'numbered';
  if (s.mode) choice.mode = s.mode;
  if (s.speed) choice.speed = s.speed;
  for (const group of document.querySelectorAll('.pills')) {
    for (const pill of group.children) pill.classList.toggle('active', pill.dataset.value === choice[group.dataset.group]);
  }
}

function saveSettings() {
  chrome.storage.local.set({
    [SETTINGS_KEY]: {
      folder: $('set-folder').value.trim(),
      autoImages: $('set-auto-images').checked,
      autoVideos: $('set-auto-videos').checked,
      naming: $('set-naming').value,
      mode: choice.mode,
      speed: choice.speed,
    },
  });
}

// ---------- events ----------

function alertError(e) {
  $('connect-hint').hidden = false;
  $('connect-text').textContent = e?.message || String(e);
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', p.id === `tab-${tab.dataset.tab}`));
  });
}

for (const group of document.querySelectorAll('.pills')) {
  group.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    choice[group.dataset.group] = pill.dataset.value;
    for (const p of group.children) p.classList.toggle('active', p === pill);
    saveSettings();
  });
}

$('prompts').addEventListener('input', updatePromptCount);
['set-folder', 'set-auto-images', 'set-auto-videos', 'set-naming'].forEach((id) => $(id).addEventListener('change', saveSettings));

$('btn-import').addEventListener('click', () => $('file-input').click());
$('file-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const current = $('prompts').value.trim();
  $('prompts').value = current ? `${current}\n${text.trim()}` : text.trim();
  e.target.value = '';
  updatePromptCount();
});

$('btn-start').addEventListener('click', async () => {
  await checkConnection();
  try {
    const res = await send({ type: 'FP_START', prompts: promptLines(), speed: choice.speed, mode: choice.mode });
    if (!res?.ok) throw new Error(res?.error || 'Could not start');
    $('prompts').value = '';
    updatePromptCount();
  } catch (e) {
    alertError(e);
  }
});

$('btn-stop').addEventListener('click', () => send({ type: 'FP_STOP' }).catch(alertError));
$('btn-retry').addEventListener('click', () => send({ type: 'FP_RETRY_FAILED' }).catch(alertError));
$('btn-clear').addEventListener('click', async () => {
  const res = await send({ type: 'FP_CLEAR' }).catch((e) => ({ error: e.message }));
  if (!res?.ok) alertError(new Error(res?.error || 'Could not clear'));
});
$('btn-clear-logs').addEventListener('click', () => send({ type: 'FP_CLEAR_LOGS' }).catch(alertError));

$('btn-open-flow').addEventListener('click', () => chrome.tabs.create({ url: FLOW_URL }));
$('btn-reload-flow').addEventListener('click', async () => {
  if (flowTabId) await chrome.tabs.reload(flowTabId);
  setTimeout(checkConnection, 3000);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes[STATE_KEY]) render(changes[STATE_KEY].newValue);
});

(async function init() {
  await loadSettings();
  const { [STATE_KEY]: state } = await chrome.storage.local.get(STATE_KEY);
  render(state);
  updatePromptCount();
  checkConnection();
  setInterval(checkConnection, 4000);
})();
