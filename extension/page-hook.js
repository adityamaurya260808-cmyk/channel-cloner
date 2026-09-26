// Runs in the page's own JS world. Watches Flow's generation API responses
// and forwards them to content.js, which cannot see the page's fetch calls.
(() => {
  'use strict';
  const origFetch = window.fetch;

  function classify(url) {
    if (url.includes('batchGenerateImages')) return 'image';
    if (url.includes('batchCheckAsyncVideoGenerationStatus')) return 'video-status';
    if (url.includes('batchAsyncGenerateVideo') && !url.includes('Upsample')) return 'video-start';
    return null;
  }

  async function readBody(input, init) {
    try {
      if (typeof init?.body === 'string') return init.body;
      if (input instanceof Request) return await input.clone().text();
    } catch (_) {}
    return '';
  }

  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : input?.url || String(input || '');
    const kind = classify(url);
    if (!kind) return origFetch.apply(this, arguments);

    const body = await readBody(input, init);
    const res = await origFetch.apply(this, arguments);
    res.clone().json()
      .then((data) => window.postMessage({ source: 'flowpilot', kind, body, status: res.status, data }, '*'))
      .catch(() => {});
    return res;
  };
})();
