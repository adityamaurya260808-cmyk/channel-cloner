// sets/corridor.js: the hospital corridor of the Final Part: long cool corridor, the green door, the vending machine
// with one blue can stuck halfway down, and the bench where Sol sits.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { GYd } from '../lib.js';

// world x of the key props (layer depth 1)
export const CR = () => ({ door: E.W / 2 + V(420, 260), bench: E.W / 2 + V(120, 60), vend: E.W / 2 - V(420, 260) });

export function greenDoor(g, x, GY, s = 1, o = {}) {
  g.save(); g.translate(x, GY); g.scale(s, s);
  rr(g, -130, -520, 260, 520, 6); g.fillStyle = '#1c2a24'; g.fill();
  rr(g, -116, -506, 232, 506, 4); g.fillStyle = o.color || '#3a8a5a'; g.fill();
  g.fillStyle = shade(o.color || '#3a8a5a', 0.15); g.fillRect(-116, -506, 232, 8);
  rr(g, -70, -440, 140, 120, 6); g.fillStyle = alpha('#d8f0e0', 0.55); g.fill(); g.strokeStyle = '#1c2a24'; g.lineWidth = 6; g.stroke();
  circle(g, 84, -250, 12, '#c8c2b0');
  if (o.glow) glow(g, 0, -380, 260, '#d8f0e0', 0.25 * o.glow);
  text(g, 'ICU', 0, -480, { size: 26, color: '#e8f4ec', font: FONTS.ui, weight: 900, spacing: 4 });
  g.restore();
}
// fall: 0 = stuck halfway, 1 = dropped in the tray
export function vending(g, x, GY, s = 1, o = {}) {
  const fall = o.fall || 0;
  g.save(); g.translate(x, GY); g.scale(s, s);
  rr(g, -150, -560, 300, 560, 14); g.fillStyle = '#b8303a'; g.fill(); g.fillStyle = shade('#b8303a', 0.2); g.fillRect(-150, -560, 300, 10);
  rr(g, -126, -520, 190, 380, 8); g.fillStyle = '#16202c'; g.fill(); glow(g, -30, -330, 220, '#cfe8ff', 0.15);
  const cols = ['#e0a23a', '#5fbf6a', '#c05ad0', '#e04a3a'];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { if (r === 2 && c === 1) continue; const cx = -100 + c * 46, cy = -490 + r * 92; rr(g, cx - 14, cy, 28, 52, 6); g.fillStyle = cols[(r + c) % 4]; g.fill(); seg(g, [[cx - 20, cy + 60], [cx + 20, cy + 60]], 3, '#8a8a98'); }
  // the stuck blue can (tilted, caught on the spiral)
  const bx = -54, by = -490 + 2 * 92 + 40 + fall * 300, rot = 0.5 - fall * 0.5 + (o.wobble || 0);
  if (fall < 1) { g.save(); g.translate(bx, by); g.rotate(rot); rr(g, -16, -28, 32, 56, 7); g.fillStyle = '#3a7ae0'; g.fill(); g.fillStyle = '#cfe0ff'; g.fillRect(-16, -6, 32, 6); g.restore(); if (o.highlight) glow(g, bx, by, 90, '#5fa0ff', 0.6 * o.highlight); }
  rr(g, -126, -110, 190, 70, 8); g.fillStyle = '#0c0e14'; g.fill();
  if (fall >= 1) { g.save(); g.translate(-30, -70); g.rotate(1.57); rr(g, -16, -28, 32, 56, 7); g.fillStyle = '#3a7ae0'; g.fill(); g.restore(); }
  rr(g, 80, -500, 52, 140, 6); g.fillStyle = '#2a2232'; g.fill(); for (let i = 0; i < 9; i++) circle(g, 96 + (i % 3) * 12, -480 + Math.floor(i / 3) * 18, 4, '#c8c2d0');
  g.restore();
  return { canX: x + bx * s, canY: GY + by * s };
}
export function corridorBench(g, x, GY, s = 1) { g.save(); g.translate(x, GY); g.scale(s, s); rr(g, -170, -96, 340, 22, 6); g.fillStyle = '#5a6a7a'; g.fill(); for (const dx of [-140, 140]) seg(g, [[dx, -74], [dx, 0]], 10, '#2a3038'); rr(g, -170, -170, 340, 18, 6); g.fillStyle = '#4a5a6a'; g.fill(); g.restore(); }

// the corridor: vanishing back wall with doors and ceiling lights, tiled floor
export function corridor(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = GYd(), CX = E.W / 2, k = CR();
  layer(g, cam, 0.35, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, ['#9ab0b8', '#c8d4d0']); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H);
    g.fillStyle = '#7a9a90'; g.fillRect(-E.W * 2, GY - V(300, 360), E.W * 5, V(300, 360)); g.fillStyle = shade('#7a9a90', 0.2); g.fillRect(-E.W * 2, GY - V(306, 366), E.W * 5, 8);
    for (let i = -4; i < 9; i++) { const x = -E.W + i * 640; rr(g, x, GY - V(560, 760), 200, V(560, 760), 4); g.fillStyle = shade('#7a9a90', -0.3); g.fill(); g.fillStyle = alpha('#e8f4ec', 0.35); g.fillRect(x + 50, GY - V(500, 700), 100, 80); }
    for (let i = -4; i < 10; i++) { const x = -E.W + i * 420 + 100; rr(g, x, -E.H * 0.1 + 40, 220, 26, 6); g.fillStyle = o.flicker ? alpha('#f4fbff', 0.5 + 0.5 * Math.abs(Math.sin(t * 13 + i))) : '#f4fbff'; g.fill(); glow(g, x + 110, 60, 260, '#e8f6ff', 0.2); }
  });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, ['#c8ccd0', '#6a7280']); g.fillRect(-E.W, GY - 4, E.W * 3, E.H * 2);
    g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 160) { g.beginPath(); g.moveTo(x, GY); g.lineTo(CX + (x - CX) * 2.4, GY + 600); g.stroke(); }
    FX.pool(g, CX, GY + 50, 900, 80, '#e8f6ff', 0.18);
  });
  layer(g, cam, 1, (g) => {
    if (o.door !== false) greenDoor(g, k.door, GY, 1, { glow: o.doorGlow });
    if (o.vend !== false) vending(g, k.vend, GY, 1, { fall: o.canFall, wobble: o.wobble, highlight: o.canGlow });
    if (o.bench !== false) corridorBench(g, k.bench, GY, 1);
  });
  return { GY, CX, M, k };
}
