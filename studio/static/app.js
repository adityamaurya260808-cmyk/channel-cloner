'use strict';

const $ = (id) => document.getElementById(id);
const WORDS_PER_MINUTE = 150;
const AUTO_SCENE_WORDS = 28;

let project = null;
let saveTimer = null;
let pollTimer = null;
// Per-scene UI state that is not saved: alternative images and progress text.
const choices = new Map();   // scene id -> [data URLs]
const busy = new Map();      // scene id -> status text
const failures = new Map();  // scene id -> error

// ---------- helpers ----------

async function api(path, options = {}) {
  const res = await fetch(path, options);
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : null;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

function toast(message, ms = 4000) {
  const t = $('toast');
  t.textContent = message;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, ms);
}

const newId = () => Math.random().toString(36).slice(2, 10);
const wordCount = (s) => (s.match(/\S+/g) || []).length;
const readFile = (file) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = () => reject(r.error);
  r.readAsDataURL(file);
});

// ---------- script to scenes ----------

function splitScript(script, mode) {
  const paragraphs = script.replace(/\r/g, '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const scenes = [];
  for (const para of paragraphs) {
    const lines = para.split('\n');
    const imageLine = lines.find((l) => /^\s*image\s*:/i.test(l));
    const text = lines.filter((l) => l !== imageLine).join(' ').replace(/\s+/g, ' ').trim();
    const custom = imageLine ? imageLine.replace(/^\s*image\s*:\s*/i, '').trim() : '';
    if (!text) continue;
    if (mode === 'paragraph' || custom) {
      scenes.push({ text, prompt: custom || text });
      continue;
    }
    const sentences = text.match(/[^.!?]+[.!?]+["'”’)\]]*|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) || [text];
    let current = '';
    for (const s of sentences) {
      if (current && wordCount(`${current} ${s}`) > AUTO_SCENE_WORDS) {
        scenes.push({ text: current, prompt: current });
        current = s;
      } else {
        current = current ? `${current} ${s}` : s;
      }
    }
    if (current) scenes.push({ text: current, prompt: current });
  }
  return scenes.map((s) => ({ id: newId(), image: null, ...s }));
}

function fullPrompt(scene) {
  return [scene.prompt || scene.text, project.character, project.style]
    .map((s) => (s || '').trim().replace(/[.\s]+$/, ''))
    .filter(Boolean)
    .join('. ');
}

// ---------- saving ----------

function save(now = false) {
  clearTimeout(saveTimer);
  const body = {
    title: project.title, script: project.script, style: project.style, character: project.character,
    splitMode: project.splitMode, voice: project.voice, rate: project.rate, format: project.format,
    captions: project.captions, useMusic: project.useMusic, speed: project.speed, scenes: project.scenes,
  };
  const run = () => api(`/api/projects/${project.id}`, json('PUT', body)).catch((e) => toast(`Not saved: ${e.message}`));
  if (now) return run();
  saveTimer = setTimeout(run, 600);
  return Promise.resolve();
}

// ---------- projects ----------

async function loadProjectList(selectId) {
  const list = await api('/api/projects');
  const select = $('project-select');
  select.replaceChildren(...list.map((p) => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = `${p.title}${p.hasVideo ? ' ✓' : ''}`;
    return o;
  }));
  if (selectId) select.value = selectId;
  return list;
}

async function openProject(id) {
  if (project) await save(true);
  project = await api(`/api/projects/${id}`);
  for (const s of project.scenes) if (!s.id) s.id = newId();
  choices.clear();
  busy.clear();
  failures.clear();
  try { localStorage.setItem('studio:last', id); } catch (_) {}
  fillForm();
  renderScenes();
  $('project-select').value = id;
  pollStatus();
}

async function newProject() {
  const p = await api('/api/projects', json('POST', { title: 'Untitled video' }));
  await loadProjectList(p.id);
  await openProject(p.id);
  $('title').focus();
  $('title').select();
}

// ---------- form ----------

const FIELDS = ['title', 'script', 'style', 'character', 'splitMode:split-mode', 'voice', 'rate', 'format', 'speed'];

function fillForm() {
  for (const f of FIELDS) {
    const [key, id = key] = f.split(':');
    $(id).value = project[key] ?? '';
  }
  $('captions').checked = project.captions !== false;
  $('use-music').checked = project.useMusic !== false;
  updateMusic();
  updateScriptStats();
  updateFormatHint();
}

function updateScriptStats() {
  const words = wordCount(project.script || '');
  $('script-stats').textContent = `${words} words`;
  $('script-minutes').textContent = (words / WORDS_PER_MINUTE).toFixed(1);
}

function updateFormatHint() {
  const shorts = project.format === 'shorts';
  $('format-hint').textContent = `In Flow, set the aspect ratio to ${shorts ? '9:16 (portrait)' : '16:9 (landscape)'} for this format.`;
  $('scenes').classList.toggle('shorts', shorts);
}

function updateMusic() {
  const has = !!project.music;
  $('music-name').textContent = has ? project.music : 'None';
  $('btn-music-remove').hidden = !has;
  $('use-music-wrap').hidden = !has;
}

function bindForm() {
  for (const f of FIELDS) {
    const [key, id = key] = f.split(':');
    $(id).addEventListener('input', () => {
      project[key] = $(id).value;
      if (key === 'script') updateScriptStats();
      if (key === 'format') updateFormatHint();
      if (key === 'title') {
        const opt = $('project-select').selectedOptions[0];
        if (opt) opt.textContent = project.title || 'Untitled video';
      }
      save();
    });
  }
  $('captions').addEventListener('change', () => { project.captions = $('captions').checked; save(); });
  $('use-music').addEventListener('change', () => { project.useMusic = $('use-music').checked; save(); });
}

// ---------- scenes ----------

function sceneCard(scene, index) {
  const node = $('scene-template').content.firstElementChild.cloneNode(true);
  node.dataset.id = scene.id;
  node.querySelector('.scene-num').textContent = `Scene ${index + 1}`;

  const imageBox = node.querySelector('.scene-image');
  if (scene.image) {
    const img = document.createElement('img');
    img.src = `/projects/${project.id}/images/${scene.image}`;
    img.alt = scene.prompt || scene.text;
    imageBox.append(img);
  } else {
    imageBox.textContent = busy.get(scene.id) || 'No image yet';
  }

  const alts = choices.get(scene.id) || [];
  const choiceBox = node.querySelector('.choices');
  alts.forEach((url, i) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = `Option ${i + 1}`;
    img.title = 'Use this picture';
    if (scene.chosen === i) img.classList.add('active');
    img.addEventListener('click', () => useImage(scene, url, i));
    choiceBox.append(img);
  });

  const status = node.querySelector('.scene-status');
  if (busy.has(scene.id)) { status.textContent = busy.get(scene.id); status.classList.add('busy'); }
  else if (failures.has(scene.id)) { status.textContent = failures.get(scene.id); status.classList.add('failed'); }
  else status.textContent = `${wordCount(scene.text)} words`;

  const text = node.querySelector('.scene-text');
  text.value = scene.text;
  text.addEventListener('input', () => { scene.text = text.value; save(); });
  const prompt = node.querySelector('.scene-prompt');
  prompt.value = scene.prompt || '';
  prompt.addEventListener('input', () => { scene.prompt = prompt.value; save(); });

  node.querySelector('.act-regen').addEventListener('click', () => generate([scene]));
  const upload = node.querySelector('.upload-input');
  node.querySelector('.act-upload').addEventListener('click', () => upload.click());
  upload.addEventListener('change', async () => {
    const file = upload.files[0];
    upload.value = '';
    if (file) await useImage(scene, await readFile(file), null);
  });
  node.querySelector('.act-delete').addEventListener('click', () => {
    project.scenes = project.scenes.filter((s) => s !== scene);
    renderScenes();
    save();
  });
  return node;
}

function renderScenes() {
  $('scenes').replaceChildren(...project.scenes.map(sceneCard));
  updateCounts();
}

function updateCounts() {
  const missing = project.scenes.filter((s) => !s.image).length;
  const words = project.scenes.reduce((n, s) => n + wordCount(s.text), 0);
  $('scene-count').textContent = project.scenes.length
    ? `${project.scenes.length} scenes · ~${(words / WORDS_PER_MINUTE).toFixed(1)} min · ${missing} need images`
    : '';
  $('btn-generate').textContent = missing ? `Generate missing images (${missing})` : 'Generate missing images';
  $('btn-generate').disabled = !missing;
}

function renderScene(scene) {
  const index = project.scenes.indexOf(scene);
  const old = $('scenes').querySelector(`[data-id="${scene.id}"]`);
  if (index < 0 || !old) return;
  // Keep typing focus intact: only swap the card when nothing in it is focused.
  if (old.contains(document.activeElement)) {
    const status = old.querySelector('.scene-status');
    status.textContent = busy.get(scene.id) || failures.get(scene.id) || '';
    return;
  }
  old.replaceWith(sceneCard(scene, index));
}

async function useImage(scene, dataUrl, choiceIndex) {
  if (!dataUrl.startsWith('data:')) {
    failures.set(scene.id, 'Flow gave a link instead of the picture; open it from the Flow tab and upload it');
    renderScene(scene);
    return;
  }
  try {
    const res = await api(`/api/projects/${project.id}/images`, { method: 'POST', body: dataUrl });
    scene.image = res.image;
    scene.chosen = choiceIndex;
    failures.delete(scene.id);
    save();
  } catch (e) {
    failures.set(scene.id, e.message);
  }
  renderScene(scene);
  updateCounts();
}

async function generate(scenes) {
  if (!scenes.length) return;
  const status = await FlowPilot.status();
  if (!status.ok || !status.hasEditor) {
    toast(status.error || 'Open a Google Flow project in another tab first.', 6000);
    return;
  }
  for (const s of scenes) {
    busy.set(s.id, 'Queued in Flow…');
    failures.delete(s.id);
    renderScene(s);
  }
  try {
    await FlowPilot.generate(scenes.map(fullPrompt), {
      mode: 'image',
      speed: project.speed,
      onUpdate: (i, result) => {
        const scene = scenes[i];
        if (result.status === 'generating') {
          busy.set(scene.id, 'Generating…');
        } else if (result.status === 'failed') {
          busy.delete(scene.id);
          failures.set(scene.id, result.error || 'Failed');
        } else if (result.status === 'done') {
          busy.delete(scene.id);
          const images = result.outputs.filter((o) => o.kind === 'image').map((o) => o.url);
          choices.set(scene.id, images);
          if (images.length) useImage(scene, images[0], 0);
        }
        renderScene(scene);
      },
    });
  } catch (e) {
    for (const s of scenes) busy.delete(s.id);
    renderScenes();
    toast(e.message, 6000);
  }
}

// ---------- render ----------

function showStatus(st) {
  const running = st.state === 'running';
  $('btn-render').disabled = running;
  $('render-progress').hidden = !running;
  if (running) {
    const pct = st.total ? Math.round((st.done / st.total) * 100) : 0;
    $('render-fill').style.width = `${pct}%`;
    $('render-stage').textContent = st.total > 1 ? `${st.stage}: ${st.done} / ${st.total}` : `${st.stage}…`;
  }
  $('render-error').hidden = st.state !== 'error';
  $('render-error').textContent = st.error || '';
  $('video-wrap').hidden = !st.video;
  if (st.video && $('video').getAttribute('src') !== st.video) {
    $('video').src = st.video;
    $('video-download').href = st.video;
    $('video-download').download = `${(project.title || 'video').replace(/[^\w -]+/g, '').trim() || 'video'}.mp4`;
  }
}

async function pollStatus() {
  clearTimeout(pollTimer);
  const id = project.id;
  try {
    const st = await api(`/api/projects/${id}/status`);
    if (id !== project.id) return;
    showStatus(st);
    if (st.state === 'running') pollTimer = setTimeout(pollStatus, 1500);
    else if (st.state === 'done') loadProjectList(project.id);
  } catch (e) {
    toast(e.message);
  }
}

// ---------- buttons ----------

$('btn-split').addEventListener('click', () => {
  const scenes = splitScript(project.script || '', project.splitMode);
  if (!scenes.length) return toast('Write your script first.');
  if (project.scenes.some((s) => s.image) && !confirm('Replace the current scenes? Their pictures will be removed from this video.')) return;
  project.scenes = scenes;
  choices.clear();
  failures.clear();
  renderScenes();
  save();
  toast(`${scenes.length} scenes ready. Next: generate the images.`);
});

$('btn-generate').addEventListener('click', () => generate(project.scenes.filter((s) => !s.image && !busy.has(s.id))));
$('btn-stop').addEventListener('click', async () => {
  const res = await FlowPilot.stop();
  for (const id of busy.keys()) failures.set(id, 'Stopped');
  busy.clear();
  renderScenes();
  toast(res.ok ? 'Stopped. Prompts already sent to Flow may still finish.' : res.error);
});

$('btn-render').addEventListener('click', async () => {
  try {
    await save(true);
    await api(`/api/projects/${project.id}/render`, { method: 'POST' });
    showStatus({ state: 'running', stage: 'Starting', done: 0, total: 1 });
    pollStatus();
  } catch (e) {
    toast(e.message, 6000);
  }
});

$('btn-preview').addEventListener('click', async () => {
  $('btn-preview').disabled = true;
  try {
    const firstLine = project.scenes[0]?.text || '';
    const res = await fetch('/api/preview-voice', json('POST', { voice: project.voice, rate: project.rate, text: firstLine.slice(0, 200) }));
    if (!res.ok) throw new Error((await res.json()).error);
    const audio = new Audio(URL.createObjectURL(await res.blob()));
    await audio.play();
  } catch (e) {
    toast(`Preview failed: ${e.message}`, 6000);
  } finally {
    $('btn-preview').disabled = false;
  }
});

$('btn-music').addEventListener('click', () => $('music-file').click());
$('music-file').addEventListener('change', async () => {
  const file = $('music-file').files[0];
  $('music-file').value = '';
  if (!file) return;
  try {
    const res = await api(`/api/projects/${project.id}/music`, { method: 'POST', body: await readFile(file) });
    project.music = res.music;
    updateMusic();
  } catch (e) {
    toast(e.message);
  }
});
$('btn-music-remove').addEventListener('click', async () => {
  await api(`/api/projects/${project.id}/music`, { method: 'DELETE' });
  project.music = null;
  updateMusic();
});

$('btn-new').addEventListener('click', newProject);
$('btn-delete').addEventListener('click', async () => {
  if (!confirm(`Delete "${project.title}" with its images and video?`)) return;
  try {
    clearTimeout(saveTimer);
    await api(`/api/projects/${project.id}`, { method: 'DELETE' });
    project = null;
    const list = await loadProjectList();
    if (list.length) await openProject(list[0].id);
    else await newProject();
  } catch (e) {
    toast(e.message);
  }
});
$('project-select').addEventListener('change', () => openProject($('project-select').value));

// ---------- Flow connection ----------

async function refreshFlow() {
  const st = await FlowPilot.status();
  const pill = $('flow-status');
  if (!st.ok) { pill.textContent = 'Flow not connected'; pill.className = 'pill off'; pill.title = st.error || ''; }
  else if (!st.hasEditor) { pill.textContent = 'Open a Flow project'; pill.className = 'pill off'; pill.title = ''; }
  else { pill.textContent = st.running ? 'Flow working' : 'Flow connected'; pill.className = 'pill on'; pill.title = ''; }
}

// ---------- start ----------

(async function init() {
  const voices = await api('/api/voices');
  $('voice').replaceChildren(...voices.map((v) => {
    const o = document.createElement('option');
    o.value = v.id;
    o.textContent = v.label;
    return o;
  }));
  bindForm();
  const list = await loadProjectList();
  let last = null;
  try { last = localStorage.getItem('studio:last'); } catch (_) {}
  if (list.some((p) => p.id === last)) await openProject(last);
  else if (list.length) await openProject(list[0].id);
  else await newProject();
  refreshFlow();
  setInterval(refreshFlow, 4000);
  window.addEventListener('beforeunload', () => { if (saveTimer) save(true); });
})().catch((e) => toast(e.message, 8000));
