// shots/00_dispatch.js — every shot in story/shots.json names a template in params.tpl; register them all.
import { E, registerShot } from '/engine/core.js';
import { TPL } from '../lib/tpl_scene.js';
import '../lib/tpl_info.js';
import { TPL3 } from '../lib/tpl_3d.js';

for (const s of E.shots) {
  const name = s.params?.tpl;
  if (!name) continue;
  if (TPL3[name]) registerShot(s.id, TPL3[name]);
  else if (TPL[name]) registerShot(s.id, { draw: TPL[name] });
  else console.log('UNKNOWN TEMPLATE', s.id, name);
}
