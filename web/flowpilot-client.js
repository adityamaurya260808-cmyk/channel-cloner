// Generate images and videos in Google Flow from your own website, through
// the FlowPilot extension. Needs, in the same browser:
//   1. the FlowPilot extension (../extension), version 0.2.0 or later,
//   2. a Google Flow project open in a tab, set to the model and aspect ratio you want,
//   3. this page served from a URL that extension/manifest.json lists for bridge.js
//      (http://localhost and http://127.0.0.1 on any port by default).
//
//   const status = await FlowPilot.status();     // { ok, hasEditor, running } or { ok: false, error }
//   const results = await FlowPilot.generate(['a red fox in snow'], {
//     mode: 'image',                              // 'image' or 'video'; match what Flow is set to
//     speed: 'balanced',                          // 'fast' | 'balanced' | 'slow'
//     onUpdate: (index, result) => {},            // called on every status change
//   });
//   // results[i] = { prompt, status: 'done' | 'failed', outputs: [{ kind, url }], error }
//   // Image urls are data: URLs; video urls point at Flow's storage.
window.FlowPilot = (() => {
  'use strict';
  const FROM_PAGE = 'flowpilot-web';
  const FROM_EXT = 'flowpilot-ext';
  const pending = new Map();
  const jobs = new Map();
  let seq = 0;

  window.addEventListener('message', (e) => {
    if (e.source !== window || e.data?.source !== FROM_EXT) return;
    const data = e.data;
    if (data.type === 'response') {
      pending.get(data.requestId)?.(data.result);
    } else if (data.type === 'event') {
      jobs.get(data.jobId)?.(data);
    }
  });

  function request(type, payload = {}, timeoutMs = 5000) {
    return new Promise((resolve) => {
      const requestId = ++seq;
      const timer = setTimeout(() => {
        pending.delete(requestId);
        resolve({ ok: false, error: 'FlowPilot extension not found on this page. Install it and reload this page.' });
      }, timeoutMs);
      pending.set(requestId, (result) => {
        clearTimeout(timer);
        pending.delete(requestId);
        resolve(result || { ok: false, error: 'No response from FlowPilot' });
      });
      window.postMessage({ source: FROM_PAGE, requestId, type, ...payload }, window.location.origin);
    });
  }

  function generate(prompts, { mode = 'image', speed = 'balanced', onUpdate } = {}) {
    const jobId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const results = prompts.map((prompt) => ({ prompt, status: 'pending', outputs: [], error: null }));
    const finished = (r) => r.status === 'done' || r.status === 'failed';

    return new Promise((resolve, reject) => {
      // The listener stays registered after resolving: a video prompt can
      // deliver more clips later, and onUpdate still hears about them.
      jobs.set(jobId, (event) => {
        const r = results[event.index];
        if (!r) return;
        if (event.outputs) r.outputs.push(...event.outputs);
        r.status = event.status;
        r.error = event.error || null;
        onUpdate?.(event.index, r, results);
        if (results.every(finished)) resolve(results);
      });

      request('generate', { jobId, prompts, mode, speed }).then((res) => {
        if (res.ok) return;
        jobs.delete(jobId);
        reject(new Error(res.error || 'Could not start'));
      });
    });
  }

  return {
    status: () => request('ping'),
    generate,
    stop: () => request('stop'),
  };
})();
