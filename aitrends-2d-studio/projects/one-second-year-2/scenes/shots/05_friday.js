// shots/05_friday.js: Friday in the rain (s125-s139), the math (s140-s150), the temptation (s151-s161), the beat and the countdown (s162-s177).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, faceShot, slowTint, popIn, label, stamp } from '../lib.js';
import { voidSpace, bigClock, heartIcon } from '../sets/extra.js';
import { LEO, NOVA, GRANDPA } from '../cast.js';
import { kitchenScene, dance, yearBadge } from '../p1kit.js';
import { rainDrops } from '../sets/street2.js';
import { ST, NS, streetScene, frozenStreet, leoFace, novaFace, mindVoid, voidFace, whisper, voiceRings, thoughtLink, bigNum, trafficLight, balance, VX } from '../k2.js';

// ---------- Friday ----------
registerShot('s125', { draw(g, t, info) {
  streetScene(g, t, push(t, info, { z0: 1.0, z1: 1.05, y0: 40, y1: 50 }), { leo: false, nova: false, busX: null });
  label(g, t, 'FRIDAY EVENING', E.W / 2, V(150, 240), 0.2, { size: V(50, 50), color: S().ui.cream });
} });
registerShot('s126', { draw(g, t, info) {
  blurLayer(g, 12, (g2) => streetScene(g2, t, { z: 1.6, x: 0, y: 200 }, { leo: false, nova: false })); veil(g, '#05060c', 0.35);
  const y = E.H * 0.72; g.fillStyle = alpha('#9fb8ff', 0.18); g.beginPath(); g.ellipse(E.W / 2, y, E.W * 0.4, 70, 0, 0, 7); g.fill();
  for (let i = 0; i < 7; i++) { const ph = (t * 1.3 + i * 0.37) % 1, x = E.W * (0.2 + (i * 0.113) % 0.6); g.strokeStyle = alpha('#cfe0ff', 0.6 * (1 - ph)); g.lineWidth = 3; g.beginPath(); g.ellipse(x, y + (i % 3) * 14 - 20, 20 + ph * 120, 6 + ph * 22, 0, 0, 7); g.stroke(); }
  FX.rain(g, t, { a: 0.35, count: 260 });
} });
registerShot('s127', { draw(g, t, info) {
  const k = ST(), x = k.leo - 260 + t * 160;
  streetScene(g, t, push(t, info, { z0: 1.35, z1: 1.38, x0: x - E.W / 2 + 100, x1: x - E.W / 2 + 120, y0: 150, y1: 152 }), { nova: false, busX: null, leo: { x, pose: walkPose(t * 1.5 * Math.PI * 2), expr: 'neutral', hood: true } });
} });
registerShot('s128', { draw(g, t, info) {
  const k = ST(); streetScene(g, t, push(t, info, { z0: 1.1, z1: 1.14, x0: 60, x1: 70, y0: 100, y1: 102 }), { busX: null, leo: { x: k.leo - 120 + t * 40, pose: walkPose(t * 1.2 * Math.PI * 2), hood: true, look: [1, 0] }, nova: { x: k.nova, expr: 'smile', look: [-1, 0] },
    extra: (g, r) => trafficLight(g, k.nova + V(330, 260), r.GY - 30, 0.9, 'red') });
  label(g, t, 'NOVA', ST().nova, E.H * 0.3, wt(info, 'nova', 1.0), { size: V(48, 48), color: '#5fe0d0' });
} });
registerShot('s129', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => streetScene(g2, t, { z: 1.4, x: 300, y: 100 }, { leo: false, busX: null })); veil(g, '#05060c', 0.3);
  const tC = 0.55; layer(g, push(t, info, { z0: 1.0, z1: 1.05 }), 1, (g) => trafficLight(g, E.W / 2, E.H * 1.02, 2.2, t < tC ? 'red' : 'green'));
  FX.rain(g, t, { a: 0.25, count: 180 });
} });
registerShot('s130', { draw(g, t, info) {
  const k = ST(), x = k.nova + ease.in(prog(t, 0.1, info.dur)) * 120;
  streetScene(g, t, push(t, info, { z0: 1.45, z1: 1.5, x0: k.nova - E.W / 2 + 60, x1: k.nova - E.W / 2 + 100, y0: 170, y1: 172 }), { leo: false, busX: null, nova: { x, wheelRot: t * 6, expr: 'smile', look: [1, 0] },
    extra: (g, r) => trafficLight(g, k.nova + V(330, 260), r.GY - 30, 0.9, 'green') });
} });
registerShot('s131', { draw(g, t, info) {
  const k = ST(), bx = lerp(k.nova + V(1500, 1100), k.nova + V(620, 460), ease.out(prog(t, 0, info.dur))), nx = k.nova + 120 + t * 30;
  streetScene(g, t, push(t, info, { z0: 1.08, z1: 1.14, x0: 160, x1: 200, y0: 100, y1: 104 }), { busX: bx, leo: { x: k.leo, pose: POSES.relaxed, hood: true, expr: t > 1.4 ? 'shocked' : 'neutral', look: [1, 0] }, nova: { x: nx, wheelRot: t * 6, expr: t > 1.6 ? 'shocked' : 'smile', look: [1, 0] } });
} });
registerShot('s132', { draw(g, t, info) { leoFace(g, t, info, { expr: 'shocked', face: t > 0.5 ? { mouth: 'smallFlat' } : { mouth: 'o' }, zoom: 0.12, noBlink: true }); if (t > 0.7) slowTint(g, 0.3 * clamp((t - 0.7) / 0.5)); } });
registerShot('s133', { draw(g, t, info) { frozenStreet(g, t, push(t, info, { z0: 1.1, z1: 1.14, x0: 60, x1: 60, y0: 110, y1: 110, r: 0.01 }), { nova: { x: ST().nova + 120, expr: 'scared', look: [1, 0] }, leo: { pose: { ...POSES.reach, eF: [30, -150], hF: [56, -150] }, expr: 'shocked', look: [1, 0], hood: true } }); yearBadge(g, t, 'THE YEAR BEGINS', 0.1); } });
registerShot('s134', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); voiceRings(g, t, E.W / 2, E.H / 2, { r0: 60, r1: 800, a: 0.35 }); } });
registerShot('s135', { draw(g, t, info) {
  const k = ST(), cam = push(t, info, { z0: 1.45, z1: 1.5, x0: k.nova - E.W / 2 - 80, x1: k.nova - E.W / 2 - 60, y0: 170, y1: 170 });
  const r = frozenStreet(g, t, cam, { nova: { x: k.nova + 120, expr: 'scared', look: [1, 0] }, leo: { pose: { ...POSES.reach }, expr: 'shocked', look: [1, 0], hood: true } });
  layer(g, cam, 1, (g) => { const a = [k.nova + 120 + 20, r.GY - 6 - 214 * NS], b = [k.leo + 10, r.GY - 214 * NS]; thoughtLink(g, t, a, b, { k: ease.out(prog(t, 0, 0.6)) }); });
} });
registerShot('s136', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); voiceRings(g, t, E.W / 2, E.H / 2, { r0: 200, r1: 900, a: 0.2 }); whisper(g, t, 'Don’t breathe out.', { at: 0.05 }); } });
registerShot('s137', { draw(g, t, info) { novaFace(g, t, info, { frozen: true, expr: 'scared', look: [1, 0.1], dx: V(140, 0), zoom: 0.02, bgCam: { z: 1.7, x: 500, y: 150 } }); whisper(g, t, 'Please.', { y: E.H * 0.2, size: V(64, 56), at: 0 }); } });
registerShot('s138', { draw(g, t, info) { const k = ST(); frozenStreet(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: k.nova - E.W / 2 + 200, x1: k.nova - E.W / 2 + 210, y0: 200, y1: 200 }), { leo: false, nova: { x: k.nova + 120, expr: 'scared', look: [1, 0] } }); } });
registerShot('s139', { draw(g, t, info) { backdrop(g, ['#020205', '#05060c']); voiceRings(g, t, E.W / 2, E.H / 2, { r0: 100, r1: 700, a: 0.15 }); whisper(g, t, 'I don’t make it.', { at: 0.05, dur: info.dur + 0.2, color: '#e8e2da' }); } });

// ---------- the math ----------
registerShot('s140', { draw(g, t, info) {
  frozenStreet(g, t, push(t, info, { z0: 1.05, z1: 1.1, x0: 60, x1: 80, y0: 90, y1: 92 }), { nova: { x: ST().nova + 120, expr: 'scared', look: [1, 0] }, leo: { pose: { ...POSES.reach }, expr: 'shocked', look: [1, 0], hood: true } });
  const a = ease.out(prog(t, 0.2, 1.0)) * 0.6; g.save(); g.globalAlpha *= a; g.strokeStyle = alpha(UI.bpStroke(), 0.35); g.lineWidth = 1.5; for (let x = 0; x <= E.W; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y <= E.H; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); } g.restore();
  label(g, t, 'STUDY IT', E.W * 0.2, E.H * 0.24, 0.5, { size: V(52, 50), color: S().ui.cream });
} });
// top-down plan: road strip, bike, bus. busX in px from the left; returns key points
function plan(g, t, o = {}) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, y0 = E.H * 0.36, y1 = E.H * 0.66, bikeX = E.W * 0.22;
  g.strokeStyle = c; g.lineWidth = 4; seg(g, [[0, y0], [E.W, y0]], 4, c); seg(g, [[0, y1], [E.W, y1]], 4, c); g.setLineDash([30, 24]); seg(g, [[0, (y0 + y1) / 2], [E.W, (y0 + y1) / 2]], 3, alpha(c, 0.5)); g.setLineDash([]);
  text(g, 'CURB', 120, y1 + 40, { size: 26, color: alpha(c, 0.7), font: FONTS.ui, weight: 900, spacing: 3 });
  // bike (top-down): two wheels + frame, front wheel over the curb
  const by = y1 - 10; seg(g, [[bikeX - 70, by + 40], [bikeX + 60, by - 10]], 6, '#5fe0d0'); circle(g, bikeX + 60, by - 10, 12, '#5fe0d0'); circle(g, bikeX - 70, by + 40, 12, '#5fe0d0'); circle(g, bikeX - 10, by + 14, 16, NOVA.color);
  const bx = o.busX ?? E.W * 0.62, bw = E.W * 0.28, bh = (y1 - y0) * 0.36, byy = (y0 + y1) / 2 + 10;
  rr(g, bx, byy - bh / 2, bw, bh, 14); g.fillStyle = alpha('#d8a43a', 0.85); g.fill(); g.strokeStyle = '#ffe6b0'; g.lineWidth = 3; g.stroke(); text(g, 'BUS', bx + bw / 2, byy, { size: 36, color: '#2a2230', font: FONTS.ui, weight: 900 });
  for (const dy of [-bh * 0.3, bh * 0.3]) FX.lightCone(g, bx, byy + dy, { angle: Math.PI, spread: 0.25, len: 300, color: '#ffe6b0', a: 0.1 });
  return { bikeX, by, bx, byy, y0, y1, ui, c };
}
registerShot('s141', { draw(g, t, info) {
  const p = plan(g, t, { busX: E.W * 0.56 });
  UI.dimension(g, t, { x1: p.bikeX + 70, y1: p.y0 - 60, x2: p.bx, y2: p.y0 - 60, str: '≈ 10 m', start: wt(info, 'ten', 1.4) - 0.3 });
} });
registerShot('s142', { draw(g, t, info) {
  const tU = wt(info, 'under', 2.4) - 0.2, mv = ease.in(prog(t, tU, tU + 1.0)), p = plan(g, t, { busX: lerp(E.W * 0.56, E.W * 0.26, mv) });
  label(g, t, '50 km/h', E.W * 0.78, E.H * 0.2, 0.2, { size: V(70, 64), font: FONTS.title });
  label(g, t, '≈ 14 m every second', E.W * 0.78, E.H * 0.28, 1.0, { size: V(34, 34), color: p.ui.cream });
  label(g, t, 'UNDER 1 SECOND', E.W / 2, E.H * 0.84, tU, { size: V(64, 60), color: p.ui.accent, font: FONTS.title });
} });
registerShot('s143', { draw(g, t, info) {
  const p = plan(g, t, { busX: E.W * 0.56 }), ui = p.ui, k = ease.out(prog(t, 0.3, 1.6)), sx = E.W * 0.56, ex = lerp(sx, E.W * -0.1, k);
  g.fillStyle = alpha(ui.accent, 0.2); g.fillRect(ex, p.byy - 60, sx - ex, 120); g.setLineDash([14, 10]); seg(g, [[sx, p.byy + 70], [ex, p.byy + 70]], 4, ui.accent); g.setLineDash([]);
  label(g, t, 'STOPPING: 20+ m', E.W * 0.3, E.H * 0.22, 0.6, { size: V(60, 56), color: ui.accent, font: FONTS.title });
} });
registerShot('s144', { draw(g, t, info) { plan(g, t, { busX: E.W * 0.56 }); veil(g, '#05060c', 0.3); stamp(g, t, 'BRAKES WON’T DO IT', E.W / 2, E.H * 0.5, 0.15, V(80, 66)); } });
registerShot('s145', { draw(g, t, info) {
  const k = ST(), cam = push(t, info, { z0: 1.3, z1: 1.34, x0: (k.leo + k.nova) / 2 - E.W / 2, x1: (k.leo + k.nova) / 2 - E.W / 2, y0: 150, y1: 150 });
  const r = frozenStreet(g, t, cam, { nova: { x: k.nova + 120, expr: 'scared', look: [1, 0] }, leo: { pose: { ...POSES.reach }, expr: 'shocked', look: [1, 0], hood: true },
    under: (g, r) => { for (let i = 0; i < 3; i++) { const kk = popIn(t, 0.2 + i * 0.3); if (kk <= 0) continue; const x = lerp(k.leo + 80, k.nova + 40, (i + 0.5) / 3), y = r.GY + 24 + (i % 2) * 18; g.save(); g.translate(x, y); g.scale(kk, kk); g.fillStyle = alpha(S().ui.gold, 0.85); g.beginPath(); g.ellipse(0, 0, 30, 12, 0, 0, 7); g.fill(); text(g, String(i + 1), 0, -34, { size: 30, color: S().ui.gold, font: FONTS.ui, weight: 900 }); g.restore(); } } });
  label(g, t, '3 STEPS', E.W / 2, E.H * 0.22, 1.0, { size: V(64, 60), font: FONTS.title });
} });
// action timeline: segments [label, seconds, colour]; bus arrival marker
const BUS_T = 0.72;
function timeline(g, t, info, segs, o = {}) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x0 = E.W * 0.12, w = E.W * 0.76, sc = w / 1.0, y = E.H * 0.5;
  for (let i = 0; i <= 10; i++) { const x = x0 + i * w / 10; seg(g, [[x, y + 70], [x, y + 84]], 2, alpha(c, 0.6)); if (i % 2 === 0) text(g, (i / 10).toFixed(1) + ' s', x, y + 112, { size: 24, color: alpha(c, 0.8), font: FONTS.ui, weight: 900 }); }
  seg(g, [[x0, y + 70], [x0 + w, y + 70]], 3, c);
  let acc = 0; segs.forEach(([lab, d, col, at], i) => { const k = ease.out(prog(t, at ?? 0, (at ?? 0) + 0.5)); if (k <= 0) { acc += 0; return; } const xa = x0 + acc * sc, ww = d * sc * k; rr(g, xa, y - 40, Math.max(2, ww - 4), 80, 12); g.fillStyle = alpha(col, 0.85); g.fill(); if (k > 0.6) text(g, lab, xa + ww / 2, y, { size: V(30, 28), color: '#0a0710', font: FONTS.ui, weight: 900 }); acc += d * k; });
  if (o.bus) { const bx = x0 + BUS_T * sc, kk = ease.out(prog(t, o.bus, o.bus + 0.4)); g.save(); g.globalAlpha *= kk; seg(g, [[bx, y - 120], [bx, y + 70]], 6, ui.accent); text(g, 'BUS ARRIVES', bx, y - 150, { size: V(32, 30), color: ui.accent, font: FONTS.ui, weight: 900 }); g.restore(); }
  text(g, 'LEO', x0 - 30, y, { size: V(36, 34), color: LEO.color, font: FONTS.ui, weight: 900, align: 'right' });
  return acc;
}
const REACT = ['REACT', 0.25, '#ffb08a'], STEPS = ['3 STEPS', 0.38, '#ffd28a'], GRAB = ['GRAB', 0.1, '#7ae07a'];
registerShot('s146', { draw(g, t, info) { timeline(g, t, info, [[...REACT.slice(0, 3), 0.4]]); label(g, t, '¼ SECOND JUST TO START', E.W / 2, E.H * 0.22, wt(info, 'quarter', 1.6) - 0.1, { size: V(52, 50) }); } });
registerShot('s147', { draw(g, t, info) { timeline(g, t, info, [[...REACT.slice(0, 3), -1], [...STEPS.slice(0, 3), 0.1]]); } });
registerShot('s148', { draw(g, t, info) { timeline(g, t, info, [[...REACT.slice(0, 3), -1], [...STEPS.slice(0, 3), -1], [...GRAB.slice(0, 3), 0.1]]); } });
registerShot('s149', { draw(g, t, info) { timeline(g, t, info, [[...REACT.slice(0, 3), -1], [...STEPS.slice(0, 3), -1], [...GRAB.slice(0, 3), -1]], { bus: 0.1 }); label(g, t, 'TOO CLOSE TO CALL', E.W / 2, E.H * 0.22, 0.4, { size: V(56, 52), color: S().ui.accent, font: FONTS.title }); } });
registerShot('s150', { draw(g, t, info) { leoFace(g, t, info, { frozen: true, expr: 'worried', look: [1, 0.1], zoom: 0.03 }); } });

// ---------- the temptation ----------
registerShot('s151', { draw(g, t, info) { mindVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 92 }), { link: 0.35 + 0.1 * Math.sin(t * 3), leoExpr: 'worried', novaExpr: 'sad', novaLook: [-1, 0.2], color: '#8a9ad8' }); } });
registerShot('s152', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'smile', face: { brows: 'worried' }, look: [-0.8, 0.2], talk: () => talk(info) * 0.6, color: '#8a9ad8' }); } });
registerShot('s153', { draw(g, t, info) {
  const k = ST(); frozenStreet(g, t, push(t, info, { z0: 1.6, z1: 1.62, x0: k.nova - E.W / 2 + 240, x1: k.nova - E.W / 2 + 240, y0: 200, y1: 200 }), { leo: false, nova: { x: k.nova + 120, expr: 'scared', look: [1, 0] } });
  label(g, t, 'NOTHING HITS', E.W / 2, E.H * 0.22, 0.4, { size: V(60, 56), color: S().ui.cream });
} });
registerShot('s154', { draw(g, t, info) {
  const k = ease.out(prog(t, 0.2, 1.4)), v = VX();
  mindVoid(g, t, push(t, info, { z0: 1.2, z1: 1.3, y0: 100, y1: 110 }), { link: 1.2, leoX: lerp(v.leo, E.W / 2 - 160, k), novaX: lerp(v.nova, E.W / 2 + 160, k), leoExpr: 'smile', novaExpr: 'happy', color: '#ffd28a' });
  glow(g, E.W / 2, E.H * 0.5, 500, S().ui.gold, 0.12 * k);
} });
registerShot('s155', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, n = Math.round(1000 * ease.out(prog(t, 0.0, 1.2)));
  text(g, n.toLocaleString('en-US'), E.W / 2, E.H * 0.46, { size: V(240, 180), color: ui.gold, font: FONTS.title, weight: 700, glow: 40, glowColor: alpha(ui.gold, 0.6) });
  label(g, t, 'YEARS · TOGETHER', E.W / 2, E.H * 0.68, 0.3, { size: V(54, 50), color: ui.cream });
} });
registerShot('s156', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }); voidSpace(g, t, cam);
  layer(g, cam, 1, (g) => bigClock(g, E.W / 2, E.H * 0.5, V(300, 260), 12.0, { face: '#e8e2da' }));
  label(g, t, '0.0 s', E.W / 2, E.H * 0.86, 0.3, { size: V(56, 56), font: FONTS.title });
} });
registerShot('s157', { draw(g, t, info) { voidFace(g, t, info, LEO, { expr: 'sad', look: [0.6, 0.3], tilt: -0.04 }); } });
registerShot('s158', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, z1: 1.26, y0: 100, y1: 104 }), r = voidSpace(g, t, cam, { color: '#8a8698' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 5; i++) { const x = E.W * (0.18 + i * 0.16), a = 0.5 * (1 - ease.inOut(prog(t, 0.2 + i * 0.12, 0.8 + i * 0.12))); drawFigure(g, { x, y: r.GY, s: 0.8, facing: 1, outfit: LEO, pose: i % 2 ? POSES.sad : POSES.stand, expr: 'sad', rim: { color: '#8a8698', dir: [0, -1] }, blink: false, alpha: a, ink: '#3a3848' }); } });
  label(g, t, 'NO MORE EMPTY YEARS', E.W / 2, E.H * 0.22, 0.4, { size: V(56, 52), color: S().ui.cream });
} });
registerShot('s159', { draw(g, t, info) { UI.blueprint(g); balance(g, t, E.W / 2, E.H * 0.34, 1.1, Math.sin(t * 3) * 0.15, 'STAY FOREVER', 'STEP OUT NOW'); label(g, t, 'ONE SECOND IS WORTH…?', E.W / 2, E.H * 0.14, 0.2, { size: V(48, 46), color: S().ui.cream }); } });
registerShot('s160', { draw(g, t, info) { UI.blueprint(g); balance(g, t, E.W / 2, E.H * 0.34, 1.1, -ease.inOut(prog(t, 0.1, 1.0)) * 0.8, 'STAY FOREVER', 'STEP OUT NOW'); } });
registerShot('s161', { draw(g, t, info) { UI.blueprint(g); balance(g, t, E.W / 2, E.H * 0.34, 1.1, lerp(-0.8, 0.8, ease.inOut(prog(t, 0.1, 1.2))), 'STAY FOREVER', 'STEP OUT NOW'); } });

// ---------- Grandpa's beat ----------
function sepia(g, a = 0.35) { g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = alpha('#c89a60', a); g.fillRect(0, 0, E.W, E.H); g.restore(); }
registerShot('s162', { draw(g, t, info) {
  const k = { gp: E.W / 2 - V(260, 200) };
  kitchenScene(g, t, push(t, info, { z0: 1.5, z1: 1.58, x0: k.gp - E.W / 2 - 40, x1: k.gp - E.W / 2 - 20, y0: 170, y1: 175 }), { leo: false, table: false });
  sepia(g, 0.35); g.save(); g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.rect(0, 0, E.W, E.H); g.ellipse(E.W / 2, E.H / 2, E.W * 0.5, E.H * 0.6, 0, 0, 7, true); g.fill('evenodd'); g.restore();
} });
function pulse(g, t, info) { const ui = S().ui, k = 1 - clamp(t / 0.45); voidSpace(g, t, { z: 1 + 0.03 * k, x: 0, y: 0 }); heartIcon(g, E.W / 2, E.H * 0.5, 3.6 * (1 + 0.2 * k), ui.accent); FX.rings(g, E.W / 2, E.H * 0.5, t, { count: 2, r0: 160, r1: 800, speed: 1.6, color: ui.accent, a: 0.3 * k + 0.08 }); }
registerShot('s163', { draw(g, t, info) { pulse(g, t, info); } });
registerShot('s164', { draw(g, t, info) { pulse(g, t, info); } });
registerShot('s165', { draw(g, t, info) { pulse(g, t, info); } });
const gpMem = (g, t, info, o) => { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchenScene(g2, tt, cam, { leo: false, table: false }), bgCam: { z: 1.6, x: -300, y: -150 }, outfit: GRANDPA, expr: 'happy', side: 1, dx: -V(260, 0), look: [1, 0], talk: () => talk(info), ...o }); sepia(g, 0.3); };
registerShot('s166', { draw(g, t, info) { gpMem(g, t, info, {}); whisper(g, t, 'A second is plenty…', { at: 0.1, x: E.W * 0.7, y: E.H * 0.3, size: V(60, 50) }); } });
registerShot('s167', { draw(g, t, info) { gpMem(g, t, info, { zoom: 0.08 }); whisper(g, t, 'A second is plenty…', { at: -1, x: E.W * 0.7, y: E.H * 0.3, size: V(60, 50) }); whisper(g, t, '…if you use it.', { at: 0.05, x: E.W * 0.7, y: E.H * 0.42, size: V(70, 60) }); } });
registerShot('s168', { draw(g, t, info) { voidFace(g, t, info, LEO, { expr: 'determined', look: [1, 0], talk: () => talk(info), zoom: 0.08 }); } });
registerShot('s169', { draw(g, t, info) { mindVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 92 }), { link: 0.6 + 0.8 * ease.out(prog(t, 0.1, 1.0)), leoExpr: 'determined', novaExpr: 'surprised' }); } });
registerShot('s170', { draw(g, t, info) { voidFace(g, t, info, LEO, { expr: 'determined', look: [1, 0], talk: () => talk(info), zoom: 0.06 }); whisper(g, t, 'Let’s use the second.', { at: 0.2, y: E.H * 0.2, size: V(56, 48) }); } });
registerShot('s171', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); whisper(g, t, 'Ready?', { at: 0.0, size: V(130, 110) }); } });
registerShot('s172', { draw(g, t, info) { backdrop(g, ['#020205', '#04050a']); const v = VX(), hy = E.H * 0.5; thoughtLink(g, t, [v.leo, hy], [v.nova, hy], { k: 0.15 + 0.15 * Math.abs(Math.sin(t * 9)) }); } });
registerShot('s173', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'neutral', face: { brows: 'worried' }, look: [-0.6, 0.2], color: '#8a9ad8' }); } });
registerShot('s174', { draw(g, t, info) { backdrop(g, ['#020205', '#05060c']); const v = VX(), hy = E.H * 0.5; thoughtLink(g, t, [v.leo, hy], [v.nova, hy], { k: 0.6 }); whisper(g, t, '(a whisper)', { at: 0.1, y: E.H * 0.7, size: V(40, 36), color: alpha('#e8e2da', 0.7) }); } });
const cd = (g, t, info, n) => { const v = VX(); voidSpace(g, t, { z: 1.05, x: 0, y: 0 }); thoughtLink(g, t, [v.leo - 200, E.H * 0.5], [v.nova + 200, E.H * 0.5], { k: 0.5 + (3 - n) * 0.3 }); bigNum(g, t, n, { dur: info.dur }); };
registerShot('s175', { draw(g, t, info) { cd(g, t, info, 3); } });
registerShot('s176', { draw(g, t, info) { cd(g, t, info, 2); } });
registerShot('s177', { draw(g, t, info) { cd(g, t, info, 1); } });
