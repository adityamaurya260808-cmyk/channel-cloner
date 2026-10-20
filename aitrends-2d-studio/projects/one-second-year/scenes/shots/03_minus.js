// shots/03_minus.js: one frozen picture (s056-s060), one heartbeat (s061-s064), the storm (s065-s067), the cost (s068-s084).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix, rng,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, label, stamp } from '../lib.js';
import { bedroom, hallway, classroom } from '../sets/indoor.js';
import { park, street } from '../sets/outdoor.js';
import { voidSpace, storm, bolt, heartIcon, bigClock, frame } from '../sets/extra.js';
import { HELD, yearBadge } from './01_open.js';
import { chapter } from './02_plus.js';
import { LEO, JAKE } from '../cast.js';

// eye-shaped window onto a frozen picture
function eyeView(g, t, drawPic, o = {}) {
  backdrop(g, ['#05070f', '#0b1222']);
  const cx = E.W / 2, cy = E.H / 2, w = V(1500, 900) * (o.s ?? 1), h = V(640, 560) * (o.s ?? 1);
  g.save(); g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, cy - h, cx + w / 2, cy); g.quadraticCurveTo(cx, cy + h, cx - w / 2, cy); g.closePath(); g.clip();
  drawPic(g); slowTint(g, 0.25); g.restore();
  g.strokeStyle = alpha('#cfe0ff', 0.5); g.lineWidth = 4; g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, cy - h, cx + w / 2, cy); g.quadraticCurveTo(cx, cy + h, cx - w / 2, cy); g.stroke();
}
const sunsetPic = (g) => park(g, 0, { z: 1.1, x: 0, y: 0 }, { mood: 'dusk' });
registerShot('s056', { draw(g, t, info) { eyeView(g, t, (g) => bedroom(g, 0, { z: 1.2, x: 0, y: 0 }, { mood: 'interiorWarm' }), { s: 0.85 + 0.03 * t }); chapter(g, t, 'MINUS', S().ui.accent); label(g, t, 'EYES CAN’T MOVE', E.W / 2, E.H * 0.86, 0.6, { size: V(44, 46), color: S().ui.accent }); } });
registerShot('s057', { draw(g, t, info) { eyeView(g, t, (g) => bedroom(g, 0, { z: 1.25 + 0.01 * t, x: 0, y: 0 }, { mood: 'interiorWarm' }), { s: 1 }); const day = Math.max(1, Math.round(365 * prog(t, 0.3, info.dur))); yearBadge(g, t, 'DAY ' + day, 0.1); } });
registerShot('s058', { draw(g, t, info) { eyeView(g, t, (g) => sunsetPic(g), { s: 1.05 }); yearBadge(g, t, 'DAY 211', 0); } });
const SNEEZE = { eyes: 'closed', mouth: 'oBig', brows: 'worried' };
function sneeze(g, t, info, badge) {
  const f = faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => classroom(g2, 0, cam), bgCam: { z: 1.5, x: -200, y: -150 }, outfit: JAKE, expr: 'neutral', face: SNEEZE, side: 1, noBlink: true, zoom: 0.01 });
  const r = rng(7); for (let i = 0; i < 40; i++) { const a = -0.6 + r() * 1.2, d = f.r * (0.5 + r() * 1.1); circle(g, f.cx + Math.cos(a + Math.PI / 2) * d * 0.5 + (r() - 0.5) * f.r, f.cy + f.r * 0.5 + Math.sin(a) * d * 0.3 + r() * 120, 3 + r() * 7, alpha('#cfe8ff', 0.7)); }
  slowTint(g, 0.25); if (badge) yearBadge(g, t, badge, 0);
}
registerShot('s059', { draw(g, t, info) { sneeze(g, t, info, null); label(g, t, 'MID-SNEEZE', E.W * 0.8, E.H * 0.22, wt(info, 'mid', 1.4) - 0.1, { size: V(48, 48), color: S().ui.cream }); } });
registerShot('s060', { draw(g, t, info) { sneeze(g, t, info, 'DAY ' + Math.max(1, Math.round(365 * ease.in(prog(t, 0.1, info.dur - 0.3))))); } });

// ---------- one heartbeat ----------
function ecgLine(g, x0, x1, y, h, beats, c, w = 4) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); for (let x = x0; x <= x1; x += 2) { let v = 0; for (const b of beats) { const d = x - b; v += d > -12 && d < 0 ? d / 12 * 0.2 : d >= 0 && d < 10 ? -1 + d / 10 * 1.4 : d >= 10 && d < 22 ? 0.4 - (d - 10) / 12 * 0.4 : 0; } x === x0 ? g.moveTo(x, y + v * h) : g.lineTo(x, y + v * h); } g.stroke(); }
registerShot('s061', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x0 = E.W * 0.1, x1 = E.W * 0.9, y = E.H * 0.52, sp = (x1 - x0) / 8;
  const shift = (t * sp) % sp, beats = []; for (let i = -1; i < 10; i++) beats.push(x0 + i * sp - shift + sp);
  g.save(); g.beginPath(); g.rect(x0, 0, x1 - x0, E.H); g.clip(); ecgLine(g, x0, x1, y, 120, beats, ui.accent); g.restore();
  heartIcon(g, E.W / 2, E.H * 0.24, 1.4 + 0.15 * Math.max(0, Math.sin(t * Math.PI * 2)), ui.accent);
  label(g, t, '~1 BEAT / SECOND', E.W / 2, E.H * 0.82, wt(info, 'once', 1.2) - 0.1, { size: V(52, 52) });
} });
registerShot('s062', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x0 = E.W * 0.08, x1 = E.W * 0.92, y = E.H * 0.52, bx = lerp(x0, x1, 0.5);
  ecgLine(g, x0, x1, y, 140, [bx], ui.accent, 5); text(g, 'JAN', x0, y + 90, { size: 28, color: c, font: FONTS.ui, weight: 900 }); text(g, 'DEC', x1, y + 90, { size: 28, color: c, font: FONTS.ui, weight: 900 });
  for (let m = 0; m <= 12; m++) seg(g, [[lerp(x0, x1, m / 12), y + 50], [lerp(x0, x1, m / 12), y + 64]], 2, alpha(c, 0.6));
  label(g, t, 'ONE YEAR', E.W / 2, E.H * 0.22, 0.2, { size: V(48, 48), color: ui.cream }); label(g, t, 'ONE HEARTBEAT', E.W / 2, E.H * 0.82, wt(info, 'heartbeat', 1.8) - 0.1, { size: V(56, 56), color: ui.accent });
} });
registerShot('s063', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1, z1: 1.05 })); const k = Math.exp(-((t - 0.3) ** 2) * 20); glow(g, E.W / 2, E.H * 0.48, 300 + 200 * k, S().ui.accent, 0.3 + 0.4 * k); heartIcon(g, E.W / 2, E.H * 0.48, 2.6 * (1 + 0.15 * k), S().ui.accent); } });
registerShot('s064', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.25, z1: 1.3, y0: 120, y1: 125 }), M = mood('interiorCool');
  const { GY } = hallway(g, 0, cam, { flicker: 0.25 }); veil(g, '#05060c', 0.45);
  layer(g, cam, 1, (g) => { const dw = 220, dh = 440, dx = E.W / 2 - dw / 2, open = 0.6 * (1 - ease.inOut(prog(t, 0, info.dur * 1.6))); g.fillStyle = '#ffe2b0'; g.fillRect(dx, GY - dh, dw * open, dh); glow(g, dx + dw * open / 2, GY - dh / 2, 300, '#ffd28a', 0.35 * open); g.fillStyle = shade(M.wall, -0.5); g.fillRect(dx + dw * open, GY - dh, dw * (1 - open), dh); g.strokeStyle = shade(M.wall, -0.7); g.lineWidth = 8; g.strokeRect(dx, GY - dh, dw, dh); FX.pool(g, dx + dw * open / 2, GY + 20, 260 * open + 20, 40, '#ffd28a', 0.3 * open); });
  slowTint(g, 0.2);
} });

// ---------- the storm ----------
function stormSky(g, t, cam, flash = 0) {
  const r = storm(g, t, cam);
  if (flash > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#dfe8ff', 0.5 * flash); g.fillRect(0, 0, E.W, E.H); g.restore(); }
  return r;
}
registerShot('s065', { draw(g, t, info) {
  const fl = Math.max(0, 1 - Math.abs(t - 1.6) * 5); const r = stormSky(g, t, push(t, info, { z0: 1.0, z1: 1.06 }), fl);
  if (fl > 0.1) bolt(g, E.W * 0.62, -20, E.W * 0.58, E.H * 0.45, 1, { seed: 3, w: 5 });
  layer(g, push(t, info, { z0: 1.0, z1: 1.06 }), 1, (g) => drawFigure(g, { x: E.W * 0.3, y: r.GY, s: 1.15, facing: 1, outfit: LEO, pose: breathe(POSES.relaxed, t), expr: 'awe', look: [0.6, -1], rim: { color: '#cfd9ff', dir: [0.6, -0.8] } }));
} });
registerShot('s066', { draw(g, t, info) {
  const tF = 0.5, fl = t > tF && t < tF + 0.5 ? 1 - (t - tF) / 0.5 : 0;
  stormSky(g, t, push(t, info, { z0: 1.0, z1: 1.04 }), fl); if (fl > 0) bolt(g, E.W * 0.45, -20, E.W * 0.52, E.H * 0.5, 1, { seed: 8, w: 7 });
  label(g, t, 'UNDER 1 SECOND', E.W / 2, E.H * 0.82, wt(info, 'less', 1.6) - 0.1, { size: V(56, 56), color: S().ui.cream });
} });
registerShot('s067', { draw(g, t, info) {
  const r = stormSky(g, 0, { z: 1.05 + 0.02 * t }); const k = clamp(0.08 + 0.92 * (t / info.dur));
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#dfe8ff', 0.12); g.fillRect(0, 0, E.W, E.H); g.restore();
  bolt(g, E.W * 0.5, -20, E.W * 0.6, E.H * 0.62, k, { seed: 12, w: 8, branches: 6 });
  FX.drops(g, t, { count: 60, rMax: 4, drift: 0.5, color: '#cfe0ff' }); slowTint(g, 0.3);
  label(g, t, 'FOR MONTHS', E.W * 0.24, E.H * 0.24, wt(info, 'months', 3.0) - 0.1, { size: V(64, 60), font: FONTS.title }); yearBadge(g, t, 'DAY ' + Math.round(20 + 140 * k), 0);
} });

// ---------- the cost ----------
registerShot('s068', { draw(g, t, info) { faceShot(g, t, info, { M: mood('void'), bg: (g2, tt, cam) => voidSpace(g2, tt, cam), bgCam: { z: 1.2 }, outfit: LEO, expr: 'sad', rimColor: '#8fb8e8', side: -1, zoom: 0.03 }); } });
registerShot('s069', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1, z1: 1.04 })); const ui = S().ui, n = 1 + Math.floor(clamp((t - 0.3) / (info.dur - 0.6)) * 6);
  for (let i = 0; i < n; i++) { const k = popIn(t, 0.3 + i * (info.dur - 0.6) / 6); const y = E.H * 0.8 - i * 82; g.save(); g.translate(E.W / 2, y); g.scale(k, k); rr(g, -180, -34, 360, 68, 12); g.fillStyle = alpha(ui.blueprint, 0.25); g.fill(); g.strokeStyle = ui.blueprint; g.lineWidth = 3; g.stroke(); text(g, '+1 YEAR', 0, 2, { size: 36, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }
} });
function aloneShot(g, t, info, o = {}) {
  const cam = push(t, info, { z0: o.z0 ?? 1.0, z1: o.z1 ?? 0.94, y0: o.y ?? 0, y1: o.y ?? 0 }); const r = voidSpace(g, t, cam);
  layer(g, cam, 1, (g) => { drawFigure(g, { x: o.x ?? E.W / 2, y: r.GY, s: o.s ?? 0.75, facing: o.facing ?? 1, outfit: LEO, pose: o.pose || breathe(POSES.sad, t, 0.3), expr: o.expr || 'sad', rim: { color: '#8fb8e8', dir: [0, -1] }, blink: false }); o.extra?.(g, r); });
  return r;
}
registerShot('s070', { draw(g, t, info) { aloneShot(g, t, info, { s: 0.6 }); label(g, t, 'ALONE', E.W / 2, E.H * 0.24, 0.1, { size: V(70, 66), color: S().ui.cream, font: FONTS.title }); } });
registerShot('s071', { draw(g, t, info) {
  aloneShot(g, t, info, { s: 0.9, z0: 1.2, z1: 1.18, y: 60 });
  for (let i = 0; i < 4; i++) { const k = 1 - prog(t, 0.1 + i * 0.12, 0.7 + i * 0.12); if (k <= 0) continue; UI.bubble(g, E.W * (0.25 + i * 0.17), E.H * (0.28 + (i % 2) * 0.08), { w: 160 * (0.5 + 0.5 * k), h: 90 * (0.5 + 0.5 * k), color: alpha('#f4efe6', k) }); }
  label(g, t, 'NO VOICES', E.W / 2, E.H * 0.84, 0.2, { size: V(52, 52), color: S().ui.accent });
} });
registerShot('s072', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1, z1: 1.05 })); const ink = S().ink, x = lerp(E.W * 0.62, E.W * 0.5, ease.out(prog(t, 0, 1))), y = E.H * 0.5;
  seg(g, [[x, y], [E.W + 300, y + 260]], 80, ink); seg(g, [[x + 180, y + 110], [E.W + 300, y + 260]], 110, LEO.color); circle(g, x, y, 60, ink); for (let i = 0; i < 4; i++) seg(g, [[x - 10, y - 20 + i * 18], [x - 110, y - 50 + i * 26]], 20, ink); seg(g, [[x - 4, y - 24], [x - 44, y - 92]], 4, alpha('#8fb8e8', 0.6));
  label(g, t, 'NO TOUCH', E.W * 0.26, E.H * 0.84, 0.2, { size: V(52, 52), color: S().ui.accent });
} });
registerShot('s073', { draw(g, t, info) {
  aloneShot(g, t, info, { s: 1.0, x: E.W * 0.35, z0: 1.15, z1: 1.2, y: 80, pose: breathe(POSES.stand, t * 0.3, 0.3), expr: 'neutral', extra: (g, r) => { const fw = 480, fh = 300, fx = E.W * 0.55, fy = r.GY - 520 + Math.sin(t * 0.6) * 8; frame(g, fx, fy, fw, fh, (g, x, y, w, h) => { g.save(); g.translate(x, y); g.scale(w / E.W, h / E.H); park(g, 0, { z: 1.1 }, { mood: 'dusk' }); g.restore(); }); glow(g, fx + fw / 2, fy + fh / 2, 400, '#ffd59a', 0.15); } });
  slowTint(g, 0.2);
} });
function bedroomLeo(g, t, cam, o = {}) {
  const r = bedroom(g, t, cam, { mood: o.mood || 'night', doorGlow: 0.4 });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2 + V(250, 160), y: r.GY - 30, s: 1.25, facing: -1, outfit: LEO, pose: o.pose || breathe(POSES.sit, t), expr: o.expr || 'sad', rim: rimOf(r.M, [-0.6, -0.8]), shadow: false, blink: blinkAt(t, 3.6) }); o.extra?.(g, r); });
  return r;
}
registerShot('s074', { draw(g, t, info) { bedroomLeo(g, t, push(t, info, { z0: 1.5, z1: 1.56, x0: 240, x1: 250, y0: 140, y1: 145 }), { mood: 'interiorWarm', expr: 'neutral' }); label(g, t, 'AGE 15', E.W * 0.28, E.H * 0.5, 0.1, { size: V(80, 80), font: FONTS.title }); } });
registerShot('s075', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, n = Math.round(40 * ease.out(prog(t, 0.2, info.dur - 0.3)));
  for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), j = i % 5, gx = E.W * 0.14 + (grp % 4) * E.W * 0.19, gy = E.H * 0.3 + Math.floor(grp / 4) * E.H * 0.3; if (j < 4) seg(g, [[gx + j * 26, gy], [gx + j * 26, gy + 110]], 8, ui.gold); else seg(g, [[gx - 14, gy + 90], [gx + 104, gy + 20]], 8, ui.gold); }
  label(g, t, n + ' TIMES', E.W / 2, E.H * 0.9, 0.3, { size: V(52, 52), color: ui.cream });
} });
function oldShadow(g, x, y, s, a) { g.save(); g.globalAlpha *= a; drawFigure(g, { x, y, s, facing: -1, outfit: { top: 'none', head: 'none' }, pose: { ...POSES.sad, head: [22, -176], sh: [12, -150], hF: [40, -60], eF: [30, -110] }, expr: 'neutral', rim: false, shadow: false, ink: '#0a0810', inkFar: '#0a0810' }); seg(g, [[x - 40 * s, y - 60 * s], [x - 46 * s, y]], 6 * s, '#0a0810'); g.restore(); }
registerShot('s076', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0.3, 1.6));
  bedroomLeo(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: 160, x1: 170, y0: 100, y1: 105 }), { expr: 'sad', extra: (g, r) => { oldShadow(g, E.W / 2 + V(60, 0), r.GY - 80, 1.9, 0.75 * k); } });
  label(g, t, '40 YEARS NOBODY SAW', E.W / 2, V(230, 300), wt(info, 'forty', 1.6) - 0.1, { size: V(52, 52), color: S().ui.cream });
} });
registerShot('s077', { draw(g, t, info) { voidSpace(g, t, { z: 1 }); UI.bigLine(g, t + 0.2, { str: 'THE PRICE?', dur: info.dur + 0.6, size: V(130, 110), color: S().ui.accent }); } });
registerShot('s078', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W / 2, y = E.H * 0.48, k = ease.out(prog(t, 0.3, 1.2));
  rr(g, x - 260 * k, y - 200 * k, 520 * k, 400 * k, 10); g.strokeStyle = ui.accent; g.lineWidth = 6; g.stroke(); for (let i = 0; i < 6; i++) seg(g, [[x - 260 * k + i * 104 * k, y - 200 * k], [x - 260 * k + i * 104 * k, y + 200 * k]], 3, alpha(ui.accent, 0.5));
  g.strokeStyle = c; g.lineWidth = 6; for (const dx of [-0.32, 0.32]) { g.beginPath(); g.ellipse(x + dx * 110, y, 110 * 0.42, 110 * 0.6, 0, 0, 7); g.stroke(); }
  label(g, t, 'LONG ISOLATION', E.W / 2, E.H * 0.86, 0.5, { size: V(52, 52), color: ui.accent });
} });
registerShot('s079', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  [['ANXIETY', 'anxiety'], ['CONFUSION', 'confusion'], ['SEEING THINGS', 'seeing']].forEach(([s, w], i) => { const at = wt(info, w, 1.5 + i * 1.5) - 0.1; label(g, t, s, E.W / 2, E.H * (0.3 + i * 0.2), at, { size: V(72, 66), color: i === 2 ? ui.accent : ui.cream, font: FONTS.title }); });
  text(g, 'REPORTED BY PEOPLE KEPT ALONE', E.W / 2, E.H * 0.12, { size: V(30, 30), color: alpha(UI.bpStroke(), 0.9), font: FONTS.ui, weight: 900, spacing: 4, alpha: clamp(prog(t, 0, 0.4)) });
} });
registerShot('s080', { draw(g, t, info) {
  bedroomLeo(g, t, push(t, info, { z0: 1.3, z1: 1.38, x0: 160, x1: 170, y0: 100, y1: 105 }), { expr: 'scared', extra: (g, r) => { for (let i = 0; i < 4; i++) { const x = E.W * (0.2 + i * 0.18) + Math.sin(t * 0.7 + i) * 30, y = r.GY - 420 + Math.sin(t + i * 2) * 20, a = 0.25 + 0.15 * Math.sin(t * 2 + i); g.fillStyle = alpha('#05040a', a + 0.3); g.beginPath(); g.ellipse(x, y, 60, 120, Math.sin(i) * 0.3, 0, 7); g.fill(); circle(g, x - 14, y - 40, 5, alpha('#cfe0ff', a)); circle(g, x + 14, y - 40, 5, alpha('#cfe0ff', a)); } } });
} });
function hall(g, t, cam, o = {}) {
  const r = hallway(g, t, cam, { warm: true, mood: 'interiorWarm', lockerColor: '#5a4a6a' }), rim = rimOf(r.M, [0, -1]);
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W * 0.42, y: r.GY, s: 1.3, facing: 1, outfit: LEO, pose: breathe(POSES.sad, t, 0.6), expr: 'sleepy', rim }); drawFigure(g, { x: E.W * 0.6, y: r.GY, s: 1.3, facing: -1, outfit: JAKE, pose: o.jakePose || breathe(POSES.relaxed, t, 1, 3), expr: o.jakeExpr || 'confused', talk: o.jakeTalk || 0, rim, blink: blinkAt(t, 2.9) }); });
  FX.dust(g, t, { count: 35, color: '#ffe2bd', a: 0.3 });
}
registerShot('s081', { draw(g, t, info) { hall(g, t, push(t, info, { z0: 1.35, z1: 1.4, y0: 140, y1: 145 }), { jakePose: breathe(POSES.think, t, 1, 3) }); } });
registerShot('s082', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => hallway(g2, tt, cam, { warm: true, mood: 'interiorWarm', lockerColor: '#5a4a6a' }), bgCam: { z: 1.5, x: 100, y: -150 }, outfit: JAKE, expr: 'worried', talk: () => talk(info), side: 1, dx: V(200, 0), seed: 1 }); } });
registerShot('s083', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1, z1: 1.05 })); const s = lerp(0.3, 1.4, ease.inOut(t / info.dur)), ui = S().ui;
  g.save(); g.translate(E.W / 2, E.H * 0.5); g.scale(s, s); text(g, '?', 0, 0, { size: 460, color: ui.accent, font: FONTS.title, weight: 700, glow: 40, glowColor: alpha(ui.accent, 0.6) }); g.restore();
} });
registerShot('s084', { draw(g, t, info) {
  const f = faceShot(g, t, info, { M: mood('void'), bg: (g2, tt, cam) => voidSpace(g2, 0, cam), bgCam: { z: 1.2 }, outfit: LEO, expr: 'scared', face: HELD, rimColor: '#8fb8e8', side: -1, dx: -V(260, 0), noBlink: true, zoom: 0.1 });
  bigClock(g, E.W * V(0.76, 0.5), E.H * V(0.42, 0.2), V(170, 140), 12);
  slowTint(g, 0.35); label(g, t, 'BREATHE OUT?', E.W * V(0.76, 0.5), E.H * V(0.8, 0.86), wt(info, 'breathe', 2.6) - 0.1, { size: V(60, 56), color: S().ui.accent, font: FONTS.title });
} });
