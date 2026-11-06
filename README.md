# channel-cloner

- [`extension/`](extension/): **FlowPilot**, a Chrome extension for batch prompts and auto-download on Google Flow.
  See [extension/README.md](extension/README.md) for install and usage.
- [`.claude/skills/cartoon-3d-short/`](.claude/skills/cartoon-3d-short/): **Cartoon 3D short** Claude Code skill
  (from [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts), MIT).
  Makes 55-70 s vertical animated story shorts with three.js inside Remotion.
  Claude Code loads it automatically in this repo. Say: *"Use the cartoon short skill and make a short about …"*.
  Needs Node, Remotion with `@remotion/three`, Python 3 and ffmpeg. See its [README](.claude/skills/cartoon-3d-short/README.md).
