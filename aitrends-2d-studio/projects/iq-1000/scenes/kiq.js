// kiq.js: sets + staging kit for "What If You Had 1,000 IQ?": generic set+figures staging, faces, the flood center,
// the river with the levee and the museum, the cloud-watching grass, the brain glow, small icons.
import { E, V, S, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, faceShot, slowTint, popIn, label, blinkAt, rimOf, GYd } from './lib.js';
import { kitchen, bedroom, classroom, hallway, table } from './sets/indoor.js';
import { park, road } from './sets/outdoor.js';
import { hospital, hospitalBed } from './sets/extra.js';
import { KAI, MIA, BEN, DRLEE, KMOM, DAD, UNCLE, CHIEF } from './cast.js';

// ---------- generic staging: a set + a list of figures ----------
// figs: [{x (offset from centre), y (offset from ground), of (outfit), pose, expr, face, f (facing), look, talk, s, rot, a}]
export function stage(g, t, cam, setFn, figs = [], o = {}) {
  const r = setFn(g, t, cam);
  const rim = o.rim || rimOf(r.M || mood('dusk'), [-0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    o.under?.(g, r);
    for (const F of figs) if (F) drawFigure(g, { x: E.W / 2 + (F.x || 0), y: r.GY + (F.y || 0), s: F.s ?? 1.2, facing: F.f ?? 1, outfit: F.of, pose: F.pose || breathe(POSES.relaxed, t + (F.x || 0) * 0.01), expr: F.expr || 'neutral', face: F.face, look: F.look, rim, blink: F.blink ?? blinkAt(t, 3.2, (F.x || 0) * 0.001), talk: F.talk || 0, rot: F.rot, alpha: F.a, shadow: F.shadow, ink: F.ink });
    o.extra?.(g, r);
  });
  return r;
}
// generic face shot over any set
export function fface(g, t, info, outfit, setFn, o = {}) {
  const left = o.left ?? true;
  return faceShot(g, t, info, { M: o.M || mood(o.mood || 'interiorWarm'), bg: setFn, bgCam: o.bgCam || { z: 1.6, x: left ? -250 : 250, y: -100 }, outfit, expr: o.expr || 'neutral', side: left ? 1 : -1, dx: o.dx ?? (left ? -V(160, 0) : V(160, 0)), look: o.look ?? (left ? [1, 0] : [-1, 0]), noBlink: o.noBlink, zoom: o.zoom ?? 0.05, talk: o.talk, rimColor: o.rimColor, face: o.face, front: o.front, tilt: o.tilt, veil: o.veil });
}
export const KIT = (g, t, cam) => kitchen(g, t, cam, { mood: 'interiorWarm' });
export const BED = (m) => (g, t, cam) => bedroom(g, t, cam, { mood: m || 'interiorWarm', doorGlow: 0.3 });
export const CLASS = (g, t, cam) => classroom(g, t, cam);
export const HALL = (g, t, cam) => hallway(g, t, cam);
export const PARK = (g, t, cam) => park(g, t, cam, { mood: 'golden' });
export const ROAD = (g, t, cam) => road(g, t, cam, { mood: 'golden' });
export const HOSP = (g, t, cam) => hospital(g, t, cam);

// the brain glow around a head (screen coords)
export function brainGlow(g, t, x, y, r, o = {}) { const c = o.color || '#7fd0ff', k = o.k ?? 1; g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y, r * 2.2, c, 0.35 * k); for (let i = 0; i < 3; i++) { g.strokeStyle = alpha(c, (0.5 - i * 0.14) * k); g.lineWidth = 3; g.beginPath(); g.arc(x, y, r * (1.15 + i * 0.18 + 0.05 * Math.sin(t * 4 + i)), 0, 7); g.stroke(); } for (let i = 0; i < 10; i++) { const a = i * 0.63 + t * 1.5, d = r * (1.3 + 0.4 * ((t * 0.8 + i * 0.13) % 1)); FX.sparkle(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 8, c, 0.7 * k); } g.restore(); }
// head position of a standing figure staged with stage()
export const headAt = (x, GY, s = 1.2, pose) => [E.W / 2 + x + ((pose || POSES.stand).head[0]) * s, GY + (pose || POSES.stand).head[1] * s];

// ---------- the flood center ----------
export function floodCenter(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = GYd(), CX = E.W / 2, scr = o.screen || '#3a8ae0', alarm = o.alarm ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
  layer(g, cam, 0.4, (g) => {
    backdrop(g, ['#0a1020', '#121a2e']); g.fillStyle = '#0e1626'; g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    for (let i = -3; i < 10; i++) for (let j = 0; j < 3; j++) { const x = -E.W * 0.6 + i * 330, y = GY - V(700, 1000) + j * 170; rr(g, x, y, 300, 150, 8); g.fillStyle = '#05070c'; g.fill(); rr(g, x + 8, y + 8, 284, 134, 4); g.fillStyle = alpha(scr, 0.35 + 0.15 * Math.sin(i + j + t * 0.5)); g.fill();
      g.strokeStyle = alpha('#cfe8ff', 0.6); g.lineWidth = 2; g.beginPath(); for (let k = 0; k <= 30; k++) { const u = k / 30; g.lineTo(x + 20 + u * 260, y + 110 - (Math.sin(u * 6 + i * 1.7 + j + t * 0.6) * 0.5 + 0.5) * 70 * (o.rising ? (0.5 + u * 0.8) : 0.6)); } g.stroke(); }
    if (o.big) { const x = CX - V(420, 300), y = GY - V(640, 900); rr(g, x, y, V(840, 600), V(360, 420), 10); g.fillStyle = '#05070c'; g.fill(); rr(g, x + 10, y + 10, V(820, 580), V(340, 400), 6); g.fillStyle = alpha(o.bigColor || scr, 0.6); g.fill(); o.big(g, x + 10, y + 10, V(820, 580), V(340, 400)); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#2a3446', '#0a0e16']); g.fillRect(-E.W, GY - 4, E.W * 3, E.H * 2); FX.pool(g, CX, GY + 40, 900, 80, scr, 0.2);
    for (const dx of [-V(640, 380), V(640, 380)]) { rr(g, CX + dx - 200, GY - 110, 400, 20, 4); g.fillStyle = '#3a4456'; g.fill(); seg(g, [[CX + dx - 180, GY - 90], [CX + dx - 180, GY]], 8, '#1a202c'); seg(g, [[CX + dx + 180, GY - 90], [CX + dx + 180, GY]], 8, '#1a202c'); rr(g, CX + dx - 90, GY - 200, 180, 100, 6); g.fillStyle = '#05070c'; g.fill(); rr(g, CX + dx - 84, GY - 194, 168, 88, 4); g.fillStyle = alpha(scr, 0.5); g.fill(); }
    if (o.nameplate) { rr(g, CX + V(560, 330), GY - 140, 160, 34, 6); g.fillStyle = '#e8e2da'; g.fill(); text(g, 'KAI', CX + V(640, 410), GY - 122, { size: 24, color: '#2a2230', font: FONTS.ui, weight: 900 }); }
  });
  if (alarm) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha('#ff2a2a', 0.5 * alarm); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore(); }
  return { GY, CX, M };
}
export const FC = (o) => (g, t, cam) => floodCenter(g, t, cam, o || {});

// ---------- the river, the levee wall, the riverside museum ----------
export function museum(g, x, y, s = 1, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const c = '#cfc6b4', d = shade(c, -0.35);
  poly(g, [[-320, -420], [0, -560], [320, -420]], c); g.fillStyle = d; g.fillRect(-320, -420, 640, 24); for (let i = 0; i < 6; i++) { rr(g, -280 + i * 108, -396, 40, 330, 6); g.fillStyle = c; g.fill(); }
  g.fillStyle = shade(c, -0.15); g.fillRect(-340, -66, 680, 66); g.fillStyle = d; g.fillRect(-300, -380, 600, 300); for (let i = 0; i < 6; i++) { rr(g, -250 + i * 100, -340, 50, 70, 4); g.fillStyle = o.lit ? alpha('#ffd28a', 0.8) : '#2a2632'; g.fill(); rr(g, -250 + i * 100, -200, 50, 70, 4); g.fillStyle = o.lit ? alpha('#ffd28a', 0.6) : '#2a2632'; g.fill(); }
  text(g, 'MUSEUM', 0, -440, { size: 34, color: '#2a2230', font: FONTS.ui, weight: 900, spacing: 6 }); g.restore(); }
// level: 0..1 water height up the levee; breach: 0..1 water bursting through section 9
export function riverScene(g, t, cam, o = {}) {
  const GY = GYd(), CX = E.W / 2, storm = o.storm ?? 1, lv = o.level ?? 0.5, wallTop = GY - V(230, 300), wall0 = GY - 20;
  layer(g, cam, 0.1, (g) => { backdrop(g, storm ? ['#141a26', '#2a3342', '#3a4352'] : ['#7fb0e0', '#c8e0f0']); if (storm) FX.clouds(g, { y: 0, h: E.H * 0.45, count: 14, color: '#0a0e16', a: 0.6, seed: 31 }); if (o.lightning && Math.sin(t * 3.1) > 0.97) veil(g, '#ffffff', 0.3); });
  layer(g, cam, 0.3, (g) => { FX.skyline(g, { x: -E.W, y: wallTop + 40, w: E.W * 3, minH: 40, maxH: V(160, 300), color: '#1a2030', windowColor: alpha('#ffd28a', 0.5), lit: 0.2, seed: 8 });
    if (o.towers) for (const x of [-300, 900, 2100]) { seg(g, [[x, wallTop], [x + 60, wallTop - 360], [x + 120, wallTop]], 6, '#0a0e16'); seg(g, [[x + 30, wallTop - 180], [x + 90, wallTop - 180]], 5, '#0a0e16'); circle(g, x + 60, wallTop - 370, 8, o.towersDead ? '#2a2a2a' : '#ff4a3a'); } });
  // river behind the wall
  layer(g, cam, 0.55, (g) => { const wy = lerp(wallTop - 20, wallTop - 150, lv); g.fillStyle = linGrad(g, 0, wy, 0, GY, ['#4a6a8a', '#2a3a52']); g.fillRect(-E.W, wy, E.W * 3, GY - wy); for (let i = 0; i < 18; i++) { const x = ((i * 260 + t * 160 * (o.flow ?? 1)) % (E.W * 3)) - E.W; seg(g, [[x, wy + 10 + (i % 3) * 12], [x + 80, wy + 10 + (i % 3) * 12]], 3, alpha('#cfe0ff', 0.4)); } });
  // the levee wall with numbered sections
  layer(g, cam, 0.7, (g) => { g.fillStyle = '#5a5a62'; g.fillRect(-E.W, wallTop, E.W * 3, wall0 - wallTop); for (let i = -6; i < 14; i++) { const x = CX + i * 240; seg(g, [[x, wallTop], [x, wall0]], 3, '#3a3a42'); if (o.sections) text(g, String(i + 4), x + 120, wallTop + 40, { size: 28, color: i + 4 === 9 ? '#ff6a5a' : '#c8c8d0', font: FONTS.ui, weight: 900 }); }
    if (o.crack) { const x = CX + 5 * 240 + 120 - (o.crackDx || 0); g.strokeStyle = '#1a1a20'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, wallTop); g.lineTo(x + 18, wallTop + 50); g.lineTo(x - 10, wallTop + 110); g.lineTo(x + 14, wall0); g.stroke(); }
    if (o.breach) { const x = CX + 5 * 240 + 120 - (o.crackDx || 0), b = o.breach; g.fillStyle = '#4a6a8a'; poly(g, [[x - 120 * b, wallTop], [x + 120 * b, wallTop], [x + 260 * b, GY + 300 * b], [x - 260 * b, GY + 300 * b]], '#5a7a9a'); for (let i = 0; i < 20; i++) circle(g, x + (Math.sin(i * 7) * 200) * b, wallTop + ((t * 300 + i * 40) % 400) * b, 10 + (i % 4) * 6, alpha('#e8f4ff', 0.6)); } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, ['#2a3a2a', '#141a14']); g.fillRect(-E.W, GY - 10, E.W * 3, E.H * 2); if (o.museum !== false) museum(g, CX + (o.museumX ?? V(520, 300)), GY, o.museumS ?? 0.9, { lit: true }); });
  if (storm) FX.rain(g, t, { a: 0.3 * storm, count: 240 });
  return { GY, CX, M: mood('night'), wallTop };
}
export const RIVER = (o) => (g, t, cam) => riverScene(g, t, cam, o || {});

// ---------- the grass + cloud sky (lying side by side) ----------
export function dragonCloud(g, x, y, s, a = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= a; g.fillStyle = '#f4f6fa'; for (const [cx, cy, r] of [[0, 0, 60], [70, -20, 70], [150, -10, 60], [220, 10, 50], [280, -30, 40], [-60, 20, 40], [-110, 0, 35], [330, -60, 30]]) { g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); } poly(g, [[60, -70], [90, -150], [120, -70]], '#f4f6fa'); poly(g, [[150, -60], [190, -130], [210, -60]], '#f4f6fa'); poly(g, [[-140, 10], [-210, -40], [-170, 30]], '#f4f6fa'); circle(g, 340, -70, 6, '#3a4a5a'); g.restore(); }
export function grass(g, t, cam, o = {}) {
  const GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, ['#5aa0e0', '#9ccaf0', '#e8f4ff']); FX.clouds(g, { y: E.H * 0.05, h: E.H * 0.35, count: 8, color: '#ffffff', a: 0.7, seed: 4 }); if (o.dragon !== false) dragonCloud(g, CX - 100 + t * 6, E.H * 0.24, o.dragonS ?? 1.1, o.dragonA ?? 1); o.sky?.(g); });
  layer(g, cam, 0.5, (g) => FX.hills(g, { y: GY - 60, amp: 40, color: '#5a9a4a', seed: 3 }));
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, ['#6ab05a', '#3a7a3a']); g.fillRect(-E.W, GY - 20, E.W * 3, E.H * 2); for (let i = 0; i < 80; i++) { const x = -200 + (i * 53) % (E.W + 400); seg(g, [[x, GY - 10 + (i % 5) * 20], [x + 4, GY - 26 + (i % 5) * 20]], 3, '#4a8a3a'); } });
  return { GY, CX, M: mood('golden') };
}
// figures lying on the grass (seen from the side, heads toward the centre)
export const LIE_UP = { ...POSES.lie };
export function lyingPair(g, t, r, o = {}) {
  const rim = { color: '#fff3dc', dir: [0, -1] };
  drawFigure(g, { x: r.CX - 150, y: r.GY + 110, s: 1.2, facing: 1, outfit: KAI, pose: POSES.stand, rot: Math.PI / 2, expr: o.kaiExpr || 'smile', look: [1, 0], rim, blink: blinkAt(t, 3.6), talk: o.kaiTalk || 0, shadow: false });
  drawFigure(g, { x: r.CX + 110, y: r.GY + 80, s: 1.2, facing: 1, outfit: MIA, pose: o.miaPose || POSES.stand, rot: -Math.PI / 2, expr: o.miaExpr || 'happy', look: [-1, 0], rim, blink: blinkAt(t, 3.1, 1), talk: o.miaTalk || 0, shadow: false });
}

// ---------- icons ----------
export function cube(g, x, y, s, solved, t = 0) { const C = ['#ffffff', '#f2c21a', '#e04a3a', '#f08a3a', '#3a7ae0', '#5fbf6a']; g.save(); g.translate(x, y); g.scale(s, s);
  const face = (pts, base) => { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const p = (u, v) => [pts[0][0] + (pts[1][0] - pts[0][0]) * u + (pts[3][0] - pts[0][0]) * v, pts[0][1] + (pts[1][1] - pts[0][1]) * u + (pts[3][1] - pts[0][1]) * v]; const a = p(i / 3, j / 3), b = p((i + 1) / 3, j / 3), c = p((i + 1) / 3, (j + 1) / 3), d = p(i / 3, (j + 1) / 3); poly(g, [a, b, c, d], solved ? C[base] : C[(base + i * 2 + j * 3 + Math.floor(t)) % 6]); g.strokeStyle = '#111'; g.lineWidth = 4; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c); g.lineTo(...d); g.closePath(); g.stroke(); } };
  face([[-80, -40], [0, -80], [80, -40], [0, 0]], 0); face([[-80, -40], [0, 0], [0, 90], [-80, 50]], 2); face([[0, 0], [80, -40], [80, 50], [0, 90]], 4); g.restore(); }
export function drawing(g, x, y, w, h, head, t = 0) { rr(g, x - w / 2, y - h / 2, w, h, 6); g.fillStyle = '#fbf8f0'; g.fill(); g.strokeStyle = '#d8cfc0'; g.lineWidth = 3; g.stroke(); const cx = x, cy = y + h * 0.1, ink = '#3a7ae0';
  g.strokeStyle = ink; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx, cy - h * 0.2); g.lineTo(cx, cy + h * 0.15); g.moveTo(cx - w * 0.12, cy - h * 0.1); g.lineTo(cx + w * 0.12, cy - h * 0.1); g.moveTo(cx, cy + h * 0.15); g.lineTo(cx - w * 0.08, cy + h * 0.32); g.moveTo(cx, cy + h * 0.15); g.lineTo(cx + w * 0.08, cy + h * 0.32); g.stroke();
  const hr = h * head; g.beginPath(); g.arc(cx, cy - h * 0.2 - hr, hr, 0, 7); g.stroke(); circle(g, cx - hr * 0.35, cy - h * 0.2 - hr * 1.1, Math.max(2, hr * 0.12), ink); circle(g, cx + hr * 0.35, cy - h * 0.2 - hr * 1.1, Math.max(2, hr * 0.12), ink);
  g.strokeStyle = '#e04a3a'; g.beginPath(); g.arc(cx, cy - h * 0.2 - hr * 0.8, hr * 0.4, 0.3, Math.PI - 0.3); g.stroke(); text(g, 'KAI', x + w * 0.3, y - h * 0.38, { size: h * 0.08, color: '#e04a3a', font: FONTS.ui, weight: 900 }); }
export function phoneProp(g, x, y, s, str, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -90, -170, 180, 340, 22); g.fillStyle = '#14121a'; g.fill(); rr(g, -78, -150, 156, 290, 12); g.fillStyle = o.bg || '#2a3a5a'; g.fill(); if (o.buzz) for (const d of [-1, 1]) { seg(g, [[d * 110, -60], [d * 130, -80]], 5, '#cfe0ff'); seg(g, [[d * 110, 0], [d * 136, 0]], 5, '#cfe0ff'); } (str || []).forEach((s2, i) => text(g, s2, 0, -90 + i * 46, { size: 26, color: i ? '#cfe0ff' : '#ffffff', font: FONTS.ui, weight: 900 })); g.restore(); }
export function sandwich(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); poly(g, [[-60, 20], [60, 20], [0, -50]], '#e8c890'); g.fillStyle = '#7ab83a'; g.fillRect(-56, 8, 112, 8); g.fillStyle = '#e04a3a'; g.fillRect(-52, 14, 104, 6); poly(g, [[-60, 30], [60, 30], [0, -40]], alpha('#d8b070', 0.0)); g.restore(); }
export { KAI, MIA, BEN, DRLEE, KMOM, DAD, UNCLE, CHIEF };
