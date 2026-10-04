#!/usr/bin/env python3
"""Build scenes/svg/NNN.svg for every scene. Then render with scripts/render.mjs."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from doodle import Canvas  # noqa: E402
from registry import SCENES, ENV  # noqa: E402
import scene_defs_1, scene_defs_1b, scene_defs_2, scene_defs_3, scene_defs_4  # noqa: E402,F401

out = os.path.join(os.path.dirname(__file__), "..", "scenes", "svg")
os.makedirs(out, exist_ok=True)
only = {int(a) for a in sys.argv[1:]}
for n in sorted(SCENES):
    if only and n not in only:
        continue
    fn, night = SCENES[n]
    c = Canvas(night=night, env=ENV.get(n, 'white'))
    fn(c)
    with open(os.path.join(out, f"{n:03d}.svg"), "w") as f:
        f.write(c.svg())
print("wrote", len(only) or len(SCENES), "svgs; defined:", len(SCENES))
