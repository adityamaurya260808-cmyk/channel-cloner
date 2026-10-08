# Channel Studio

A local app that turns your own script into a faceless video, like Channel Farm but on your computer:

1. **Script**: you write it. Each paragraph (or every ~2 sentences, in Auto mode) becomes a scene.
2. **Images**: each scene's picture is made in Google Flow through the FlowPilot extension,
   using your own Flow account. Pick between the pictures Flow returns, regenerate, or upload your own.
3. **Voiceover**: free Microsoft Edge voices (no key needed).
4. **Video**: FFmpeg adds a slow zoom on every picture, burns in captions, mixes optional
   background music and renders an MP4 (16:9 1080p or 1440p, or 9:16 Shorts).

Everything runs on your machine. Projects are saved in `studio/projects/`.

## Setup (once)

1. Install **Python 3.9+** and **FFmpeg** (`ffmpeg -version` must work in a terminal).
   - Windows: `winget install ffmpeg` · macOS: `brew install ffmpeg` · Ubuntu: `sudo apt install ffmpeg`
2. In this folder: `pip install -r requirements.txt`
3. Install the FlowPilot extension from [`../extension`](../extension) (version 0.2.0 or later).

## Use

1. Start the studio: `python3 server.py` (on Windows: `python server.py`), then open http://localhost:8770.
2. Open a Google Flow project in another tab of the same browser. Set it to **image** mode, your model,
   and the aspect ratio that matches your video format (16:9, or 9:16 for Shorts).
   The studio's top-right badge should say **Flow connected**.
3. Write the script, press **Make scenes**, check the scenes, then **Generate missing images**.
4. Press **Render video** and download the MP4 when it's done.

### Writing the script

- A blank line separates paragraphs.
- To choose the picture for a paragraph yourself, add a line starting with `IMAGE:`; that paragraph
  becomes one scene and the line is not read aloud:

  ```
  Then, one stormy night, a light appeared on the horizon.
  IMAGE: a tiny glowing ship far away on a stormy sea at night
  ```
- Without an `IMAGE:` line, the narration itself is the image prompt. Edit any scene's
  **Image prompt** before generating for better pictures.
- **Visual style** and **Recurring character** are added to every image prompt, which keeps
  the look and the main character consistent across scenes.

## Good to know

- Rendering takes roughly as long as the video itself on a typical laptop (a 10-minute video ≈ 10 minutes).
- Voiceovers are cached, so re-rendering after changing only pictures is faster.
- Edge voices use Microsoft's free online read-aloud service. It is unofficial and could stop
  working; the **Silent** voice lets you check timing without it.
- Captions are timed by splitting each scene's narration evenly, not by exact word timing.
- The server only accepts connections from this computer.
