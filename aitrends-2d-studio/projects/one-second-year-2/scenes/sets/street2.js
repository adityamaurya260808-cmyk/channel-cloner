// sets/street2.js: Part 2 props and the rainy dusk street: a city bus, a bicycle, Nova's riding pose, a pool, a starry sky.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { GYd } from '../lib.js';
import { road } from './outdoor.js';

// rainy street at dusk (sidewalk in front, road behind). o.frozen freezes the rain into hanging drops.
export function rainStreet(g, t, cam, o = {}) {
  const r = road(g, o.frozen ? 0 : t, cam, { mood: o.mood || 'dusk', rain: false });
  layer(g, cam, 0.85, (g) => o.onRoad?.(g, r));
  if (!o.frozen && o.rain !== false) FX.rain(g, t, { a: 0.26, count: 220 });
  return r;
}
export function rainDrops(g, t, o = {}) { FX.drops(g, t, { count: o.count ?? 70, rMin: 2, rMax: o.rMax ?? 7, color: '#cfe0ff', drift: o.drift ?? 0.6, seed: o.seed ?? 4 }); }

// city bus, side view, facing +x (front on the right). y = road surface under the wheels.
export function bus(g, x, y, s = 1, o = {}) {
  const { facing = 1, color = '#d8a43a', lights = true, blur = 0, driver = true } = o;
  g.save(); g.translate(x, y); g.scale(s * facing, s);
  rr(g, -360, -300, 720, 270, 26); g.fillStyle = color; g.fill(); g.fillStyle = shade(color, -0.25); g.fillRect(-360, -110, 720, 40); g.fillStyle = shade(color, 0.2); g.fillRect(-350, -296, 700, 8);
  for (let i = 0; i < 6; i++) { rr(g, -330 + i * 100, -270, 84, 90, 8); g.fillStyle = '#5a7090'; g.fill(); g.fillStyle = 'rgba(255,240,200,.25)'; g.fillRect(-330 + i * 100, -270, 84, 12); }
  rr(g, 280, -270, 70, 150, 10); g.fillStyle = '#7fa0c8'; g.fill();
  if (driver) { circle(g, 312, -210, 22, '#0c0b10'); seg(g, [[312, -188], [306, -150]], 18, '#0c0b10'); if (o.shout) { g.fillStyle = '#f4efe6'; g.beginPath(); g.ellipse(326, -204, 6, 9, 0, 0, 7); g.fill(); } }
  for (const wx of [-240, 220]) { circle(g, wx, -30, 46, '#0c0b10'); circle(g, wx, -30, 20, '#55505f'); }
  if (lights) { glow(g, 362, -70, 220, '#ffe6b0', 0.75); circle(g, 356, -70, 12, '#fff6e0'); FX.lightCone(g, 362, -70, { angle: 0.05, spread: 0.32, len: 1100, color: '#ffe6b0', a: 0.16 }); glow(g, -362, -70, 60, '#ff4a3a', 0.6); }
  text(g, '42', -300, -150, { size: 40, color: '#2a2230', font: FONTS.ui, weight: 900 });
  g.restore();
  if (blur > 0) FX.speedLines(g, 0, { cx: x, cy: y - 150 * s, count: 40, a: 0.22 * blur, inner: 260 });
}
// bicycle at x (between the wheels), y ground; returns seat/handle points in world units
export function bike(g, x, y, s = 1, o = {}) {
  const c = o.color || '#c8c2d0', ink = o.ink || '#141018', R = 40 * s, rot = o.wheelRot || 0;
  g.save(); g.translate(x, y); g.scale((o.facing ?? 1), 1);
  for (const wx of [-70 * s, 70 * s]) { ring(g, wx, -R, R, 5 * s, ink); for (let i = 0; i < 6; i++) { const a = rot + i * Math.PI / 3; seg(g, [[wx, -R], [wx + Math.cos(a) * R, -R + Math.sin(a) * R]], 1.2 * s, alpha(c, 0.6)); } circle(g, wx, -R, 5 * s, c); }
  seg(g, [[-70 * s, -R], [-10 * s, -R], [40 * s, -95 * s], [-30 * s, -95 * s], [-70 * s, -R]], 6 * s, c); seg(g, [[-10 * s, -R], [-30 * s, -95 * s], [-34 * s, -110 * s]], 6 * s, c);
  seg(g, [[70 * s, -R], [50 * s, -120 * s], [62 * s, -126 * s]], 6 * s, c); rr(g, -50 * s, -118 * s, 34 * s, 9 * s, 4 * s); g.fillStyle = ink; g.fill();
  g.restore();
}
export const RIDE = { head: [10, -214], sh: [6, -182], hip: [-30, -124], eF: [26, -160], hF: [52, -140], eB: [22, -158], hB: [48, -138], kF: [14, -90], fF: [-6, -52], kB: [2, -88], fB: [-20, -56] };
// open-air pool edge for the countdown montage
export function pool(g, t, cam) {
  const M = mood('day'), GY = GYd();
  layer(g, cam, 0.3, (g) => { backdrop(g, M.sky); FX.clouds(g, { y: E.H * 0.15, h: 120, color: '#ffffff', a: 0.25, seed: 5 }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = shade('#d8d2c8', -0.1); g.fillRect(-E.W, GY - 40, E.W * 3, 40); g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#3aa0c8', '#1a5a80']); g.fillRect(-E.W, GY, E.W * 3, E.H); for (let i = 0; i < 12; i++) { seg(g, [[-200 + i * 220 + Math.sin(t + i) * 20, GY + 40 + (i % 3) * 50], [-120 + i * 220 + Math.sin(t + i) * 20, GY + 40 + (i % 3) * 50]], 4, alpha('#cfeaff', 0.5)); } });
  return { GY: GY - 40, M };
}
