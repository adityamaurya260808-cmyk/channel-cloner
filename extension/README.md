# FlowPilot

A Chrome extension that sends a list of prompts to [Google Flow](https://labs.google/fx/tools/flow)
one after another and auto-downloads the images and videos it generates.

No login, no server, no paid plan: everything runs in your browser, on your own Flow account.

## Install (Chrome / Edge)

1. Download this repo (Code → Download ZIP) and unzip it.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the `extension` folder.
4. Open a project in Google Flow, then click the FlowPilot icon in the toolbar to open the side panel.
   If Flow was already open before you installed, reload that tab once.

## Use

1. In Flow itself, pick the mode (image/video), model and aspect ratio you want.
2. In FlowPilot, choose the same **Mode** and a **Speed**:
   - **Fast**: up to 4 prompts generating at once
   - **Balanced**: up to 2 at once, 10 seconds apart
   - **Slow**: one at a time (most reliable)
3. Paste prompts, one per line (or **Import .txt**), and press **Start**.
4. Files are saved to `Downloads/<folder>/001.jpg`, `002.jpg`, … (videos as `.mp4`).

The **Queue** tab shows each prompt's status. **Retry failed** re-queues failed prompts. **Logs** shows what happened.

## Use from your own website

Your site can send prompts to FlowPilot and get the results back, using your
own Flow account in the same browser. Nothing goes through a server.

1. Reload FlowPilot in `chrome://extensions` after updating (version 0.2.0+).
2. Keep a Flow project open in a tab, set to the mode, model and aspect ratio you want.
3. Serve your site from `http://localhost` or `http://127.0.0.1` (any port) and load
   [`web/flowpilot-client.js`](../web/flowpilot-client.js) on it. To try the demo:
   `cd web && python3 -m http.server 8765`, then open http://localhost:8765.

```js
const results = await FlowPilot.generate(['a red fox in snow'], { mode: 'image', speed: 'balanced' });
// results[0].outputs[0].url is a data: URL you can show or upload
```

To use another address (for example a site you host), add it to the `bridge.js`
entry's `matches` in `manifest.json` and reload the extension. Any page on those
addresses can queue prompts on your Flow account, so list only sites you control.

Prompts from a website are not saved to Downloads; the site receives the files instead.
Images arrive as `data:` URLs; videos keep their Flow URL.

## How it works

- `content.js` types each prompt into Flow's prompt box and clicks Flow's own create button,
  just as you would by hand. It does not call Google's APIs itself.
- `page-hook.js` reads Flow's responses to spot finished images and videos.
- `background.js` saves them with `chrome.downloads`.
- `bridge.js` runs on your website and relays its requests to the Flow tab and the results back.

## Limitations

- It relies on how the Flow page looks today. If Google changes the page, prompts may stop sending
  or results may stop being detected. Check the Logs tab and open an issue.
- Everything counts against your own Flow credits and limits. Sending too much too fast can trigger
  Google's "unusual activity" error, so prefer Balanced or Slow for big batches.
