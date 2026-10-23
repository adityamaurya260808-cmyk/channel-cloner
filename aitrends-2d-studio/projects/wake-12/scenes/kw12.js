// kw12.js: kit for "What If You Woke Up at 12 With All Your Memories?": the principal's office, the kid bedroom with
// glow stars, memory frames in the void, the voicemail list, the notebook note, and shared staging helpers.
import { E, V, S, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, faceShot, slowTint, popIn, label, blinkAt, rimOf, GYd } from './lib.js';
import { bedroom, kitchen, classroom, hallway } from './sets/indoor.js';
import { hospital, voidSpace, bigClock } from './sets/extra.js';
import { stage, fface, headAt, phoneProp } from './kiq.js';
import { ELI, ELI32, OMAR, EMOM, EDAD, REYES, HART, OMOM } from './cast.js';

export const ui = () => S().ui;
export const GOLD = () => S().ui.gold;
// ---------- sets ----------
export const KROOM = (m) => (g, t, cam) => { const r = bedroom(g, t, cam, { mood: m || 'interiorWarm', doorGlow: 0.3 }); layer(g, cam, 0.45, (g) => { for (let i = 0; i < 18; i++) { const x = E.W * (0.05 + (i * 0.173) % 0.9), y = E.H * (0.04 + (i * 0.11) % 0.22); starShape(g, x, y, 10 + (i % 3) * 4, alpha('#c8ff9a', m === 'night' ? 0.9 : 0.35)); } }); return r; };
export function starShape(g, x, y, r, c) { g.fillStyle = c; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); }
export const KIT = (m) => (g, t, cam) => kitchen(g, t, cam, { mood: m || 'interiorWarm' });
export const CLASS = (g, t, cam) => classroom(g, t, cam);
export const HALL = (g, t, cam) => hallway(g, t, cam);
export const LAUNDRY = (g, t, cam) => { const r = hospital(g, t, cam); layer(g, cam, 0.9, (g) => { for (let i = 0; i < 3; i++) { const x = E.W * (0.2 + i * 0.2); rr(g, x - 90, r.GY - 220, 180, 220, 10); g.fillStyle = '#d8dce8'; g.fill(); circle(g, x, r.GY - 110, 60, '#3a4a5a'); ring(g, x, r.GY - 110, 60, 8, '#9aa8b8'); for (let k = 0; k < 4; k++) { const a = t * 6 + k * 1.6; circle(g, x + Math.cos(a) * 30, r.GY - 110 + Math.sin(a) * 30, 10, alpha('#e8eef8', 0.7)); } } }); return r; };
// the principal's office: wood panels, a window, a wall clock, a big desk, two chairs by the window
export function office(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, ['#4a3a2e', '#6a5444']); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    for (let i = -6; i < 16; i++) seg(g, [[-E.W + i * 220, -E.H], [-E.W + i * 220, GY]], 3, alpha('#2a1e18', 0.5));
    FX.windowFrame(g, { x: CX - V(820, 480), y: GY - V(700, 1000), w: V(420, 360), h: V(380, 420), cols: 2, rows: 2, frame: '#2a1e18', bar: 10, blinds: 8 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#8aa0b8', '#c8d0d8']); g.fillRect(x, y, w, h); FX.rain(g, t, { a: 0.3, count: 30, area: [x, y, w, h] }); });
    rr(g, CX + V(300, 180), GY - V(720, 1000), 160, 120, 4); g.fillStyle = '#e8e0cc'; g.fill(); g.strokeStyle = '#8a6a3a'; g.lineWidth = 6; g.stroke(); text(g, '🎓', CX + V(380, 260), GY - V(660, 940), { size: 40, color: '#5a4a3a', font: FONTS.ui, weight: 700 });
    bigClock(g, CX + V(40, 30), GY - V(640, 920), V(70, 70), o.clockT ?? (t % 60), { face: '#efe6d2' });
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#5a4232', '#2a1e18']); g.fillRect(-E.W, GY - 4, E.W * 3, E.H * 2); FX.pool(g, CX, GY + 40, 800, 80, '#ffd8a0', 0.16); });
  return { GY, CX, M };
}
export const OFFICE = (o) => (g, t, cam) => office(g, t, cam, o || {});
export function bigDesk(g, x, GY, w = 620) { rr(g, x - w / 2, GY - 150, w, 24, 6); g.fillStyle = '#5a3a26'; g.fill(); g.fillStyle = '#3a2618'; g.fillRect(x - w / 2 + 20, GY - 126, w - 40, 126); rr(g, x + w * 0.25, GY - 180, 40, 30, 6); g.fillStyle = '#e8e2da'; g.fill(); }

// ---------- memory frames ----------
// a photo-like frame with a tiny scene; fade 0..1 drains it to grey and dust
export function memFrame(g, x, y, w, h, draw, o = {}) {
  const f = o.fade || 0, a = o.a ?? 1; g.save(); g.globalAlpha *= a * (1 - f * 0.8); g.translate(x, y); g.rotate(o.rot || 0);
  rr(g, -w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 8); g.fillStyle = '#efe6d2'; g.fill();
  g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip(); g.fillStyle = o.bg || '#3a4a6a'; g.fillRect(-w / 2, -h / 2, w, h); draw?.(g, w, h); g.restore();
  if (f > 0) { g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = alpha('#808080', f); g.fillRect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20); g.restore(); }
  if (o.label) text(g, o.label, 0, h / 2 + 44, { size: Math.max(24, w * 0.07), color: '#e8e2da', font: FONTS.ui, weight: 900 });
  if (o.crack) { g.strokeStyle = '#1a1a20'; g.lineWidth = 3; g.beginPath(); g.moveTo(-w * 0.3, -h / 2); g.lineTo(-w * 0.05, -h * 0.05); g.lineTo(-w * 0.2, h * 0.2); g.lineTo(w * 0.1, h / 2); g.stroke(); }
  g.restore();
  if (f > 0.2) for (let i = 0; i < 14; i++) { const ph = (f + i * 0.07) % 1; circle(g, x + (i - 7) * w * 0.06, y - h / 2 - ph * 120, 3, alpha('#efe6d2', 0.6 * (1 - ph))); }
}
// a few stock memory pictures
export const PIC = {
  car: (g, w, h) => { g.fillStyle = '#8ab0d8'; g.fillRect(-w / 2, -h / 2, w, h); rr(g, -w * 0.3, -h * 0.05, w * 0.6, h * 0.22, 10); g.fillStyle = '#e04a3a'; g.fill(); circle(g, -w * 0.18, h * 0.18, h * 0.08, '#1a1a20'); circle(g, w * 0.18, h * 0.18, h * 0.08, '#1a1a20'); },
  office: (g, w, h) => { g.fillStyle = '#9aa0a8'; g.fillRect(-w / 2, -h / 2, w, h); for (let i = 0; i < 3; i++) { rr(g, -w * 0.4 + i * w * 0.28, -h * 0.1, w * 0.22, h * 0.3, 4); g.fillStyle = '#5a6068'; g.fill(); } },
  street: (g, w, h) => { g.fillStyle = '#c8a07a'; g.fillRect(-w / 2, -h / 2, w, h); g.fillStyle = '#4a4a52'; g.fillRect(-w / 2, h * 0.15, w, h * 0.35); for (let i = 0; i < 4; i++) { g.fillStyle = '#7a5a4a'; g.fillRect(-w / 2 + i * w * 0.26, -h * 0.4, w * 0.2, h * 0.5); } },
  apartment: (g, w, h) => { g.fillStyle = '#5a6070'; g.fillRect(-w / 2, -h / 2, w, h); rr(g, -w * 0.15, -h * 0.35, w * 0.3, h * 0.35, 4); g.fillStyle = '#8ab0d8'; g.fill(); rr(g, -w * 0.35, h * 0.1, w * 0.4, h * 0.15, 6); g.fillStyle = '#3a3a48'; g.fill(); },
  face: (g, w, h) => { g.fillStyle = '#d8c0a0'; g.fillRect(-w / 2, -h / 2, w, h); circle(g, 0, -h * 0.05, h * 0.25, '#1a1a20'); g.fillStyle = '#4a7a5a'; g.fillRect(-w * 0.3, h * 0.2, w * 0.6, h * 0.3); },
  test: (g, w, h) => { g.fillStyle = '#f4efe6'; g.fillRect(-w / 2, -h / 2, w, h); for (let i = 0; i < 5; i++) seg(g, [[-w * 0.35, -h * 0.3 + i * h * 0.14], [w * 0.2, -h * 0.3 + i * h * 0.14]], 3, '#8a8a9a'); text(g, 'A+', w * 0.32, -h * 0.25, { size: h * 0.25, color: '#e04a3a', font: FONTS.title, weight: 700 }); },
  mistake: (g, w, h) => { g.fillStyle = '#3a2a3a'; g.fillRect(-w / 2, -h / 2, w, h); seg(g, [[-w * 0.2, -h * 0.25], [w * 0.2, h * 0.25]], 10, '#e04a3a'); seg(g, [[w * 0.2, -h * 0.25], [-w * 0.2, h * 0.25]], 10, '#e04a3a'); },
  people: (g, w, h) => { g.fillStyle = '#e0c8a0'; g.fillRect(-w / 2, -h / 2, w, h); for (const d of [-1, 1]) { circle(g, d * w * 0.15, -h * 0.1, h * 0.12, '#1a1a20'); g.fillStyle = d > 0 ? '#8a5ad6' : '#5a8ab0'; g.fillRect(d * w * 0.15 - w * 0.08, h * 0.02, w * 0.16, h * 0.3); } },
  food: (g, w, h) => { g.fillStyle = '#f0d0a0'; g.fillRect(-w / 2, -h / 2, w, h); g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(0, h * 0.1, w * 0.35, h * 0.18, 0, 0, 7); g.fill(); g.fillStyle = '#e07a2a'; g.beginPath(); g.ellipse(0, h * 0.05, w * 0.2, h * 0.1, 0, 0, 7); g.fill(); },
  name: (g, w, h) => { g.fillStyle = '#e8e2da'; g.fillRect(-w / 2, -h / 2, w, h); rr(g, -w * 0.35, -h * 0.2, w * 0.7, h * 0.4, 8); g.fillStyle = '#e04a3a'; g.fill(); text(g, 'HELLO', 0, -h * 0.08, { size: h * 0.12, color: '#fff', font: FONTS.ui, weight: 900 }); text(g, '????', 0, h * 0.1, { size: h * 0.14, color: '#fff', font: FONTS.ui, weight: 900 }); },
};
// ring of memory frames around a point
export function frameRing(g, t, cx, cy, n, R, o = {}) { const keys = o.keys || Object.keys(PIC); for (let i = 0; i < n; i++) { const a = i * (Math.PI * 2 / n) + t * (o.spin ?? 0.25), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.55; memFrame(g, x, y, o.w || 150, o.h || 105, PIC[keys[i % keys.length]], { fade: o.fade ? o.fade(i) : 0, rot: Math.sin(a) * 0.1, a: o.a ?? 1 }); } }

// ---------- people staging ----------
// Eli in the void (kid), optional adult shadow
export function voidEli(g, t, info, o = {}) {
  const cam = push(t, info, { z0: o.z0 ?? 1.3, z1: o.z1 ?? 1.36, y0: o.y0 ?? 130, y1: o.y1 ?? 134 }), r = voidSpace(g, t, cam, { color: o.color });
  layer(g, cam, 1, (g) => {
    if (o.adult) drawFigure(g, { x: E.W / 2 + (o.adultDx || 0), y: r.GY, s: 1.2, outfit: ELI32, pose: o.adultPose || POSES.stand, expr: o.adultExpr || 'neutral', look: [0, 0], rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false, alpha: o.adult, ink: o.adultInk });
    if (o.kid !== false) drawFigure(g, { x: E.W / 2 + (o.dx || 0), y: r.GY, s: 1.2, outfit: ELI, pose: o.pose || POSES.stand, expr: o.expr || 'neutral', face: o.face, look: o.look || [0, 0], rim: { color: '#ffd8a0', dir: [0, -1] }, blink: false, alpha: o.a });
    o.extra?.(g, r);
  });
  return r;
}
export function note(g, x, y, w, h, lines, k = 1, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.03); rr(g, -w / 2, -h / 2, w, h, 6); g.fillStyle = '#fbf8f0'; g.fill(); for (let i = 0; i < 9; i++) seg(g, [[-w / 2 + 20, -h / 2 + 60 + i * (h - 80) / 9], [w / 2 - 20, -h / 2 + 60 + i * (h - 80) / 9]], 2, alpha('#7fa0d8', 0.4)); seg(g, [[-w / 2 + 60, -h / 2], [-w / 2 + 60, h / 2]], 2, alpha('#e04a3a', 0.5)); const n = Math.floor(lines.length * k + 0.999); lines.slice(0, n).forEach((s2, i) => text(g, s2, -w / 2 + 80, -h / 2 + 90 + i * (h - 120) / Math.max(4, lines.length), { size: Math.min(46, h * 0.11), color: '#1a2a6a', font: FONTS.serif, weight: 700, italic: true, align: 'left', alpha: o.faded ? 0.45 : 1 })); g.restore(); }
export function voicemails(g, t, n, o = {}) { const x = E.W / 2, w = V(820, 700), y0 = E.H * 0.2; text(g, 'VOICEMAIL', x, y0 - 40, { size: V(40, 38), color: ui().cream, font: FONTS.ui, weight: 900, spacing: 6 }); for (let i = 0; i < n; i++) { const k = popIn(t, (o.at ?? 0) + i * (o.step ?? 0.12)); if (k <= 0) continue; const y = y0 + 30 + i * 74; g.save(); g.globalAlpha *= Math.min(1, k); rr(g, x - w / 2, y, w, 62, 12); g.fillStyle = alpha('#1a2236', 0.95); g.fill(); circle(g, x - w / 2 + 40, y + 31, 18, '#5a8ab0'); text(g, 'DAD', x - w / 2 + 80, y + 22, { size: 26, color: '#ffffff', font: FONTS.ui, weight: 900, align: 'left' }); text(g, '“No reason.”', x - w / 2 + 80, y + 46, { size: 22, color: alpha('#cfe0ff', 0.8), font: FONTS.serif, weight: 700, italic: true, align: 'left' }); text(g, 'Sun', x + w / 2 - 40, y + 31, { size: 22, color: alpha('#cfe0ff', 0.6), font: FONTS.ui, weight: 900 }); circle(g, x + w / 2 - 90, y + 31, 7, o.unread === false ? alpha('#5a5a6a', 0.6) : '#3a8aff'); g.restore(); } }
export function taps(g, t, x, y, s, n = 2, o = {}) { const ink = S().ink; for (let i = 0; i < n; i++) { const at = (o.at ?? 0.1) + i * 0.35, k = clamp((t - at) / 0.12), up = t > at && t < at + 0.25 ? 1 - k : 1; g.save(); g.translate(x, y - 40 * s * up); g.scale(s, s); rr(g, -30, -20, 60, 40, 18); g.fillStyle = ink; g.fill(); rr(g, 10, -70, 22, 60, 11); g.fillStyle = ink; g.fill(); g.restore(); if (t > at && t < at + 0.4) FX.rings(g, x + 20 * s, y, t - at, { count: 1, r0: 10, r1: 90 * s, speed: 2, color: '#ffffff', a: 0.5 }); } }
export function thumbsUp(g, x, y, s, c) { const ink = S().ink; g.save(); g.translate(x, y); g.scale(s, s); rr(g, -40, -30, 80, 70, 20); g.fillStyle = ink; g.fill(); rr(g, -18, -110, 34, 90, 17); g.fillStyle = ink; g.fill(); seg(g, [[-40, 40], [-40, 120]], 50, c || '#2fb56a'); g.restore(); }
export { stage, fface, headAt, phoneProp, ELI, ELI32, OMAR, EMOM, EDAD, REYES, HART, OMOM };
