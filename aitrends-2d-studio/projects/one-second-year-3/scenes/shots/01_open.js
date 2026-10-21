// shots/01_open.js: cold open (s001-s015), recap (s016-s024), title (s025), Sol (s026-s037), plus (s038-s044),
// minus (s045-s054), the catch and Nova's sky (s055-s063).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, faceShot, slowTint, popIn, label, stamp } from '../lib.js';
import { bedroom } from '../sets/indoor.js';
import { road } from '../sets/outdoor.js';
import { voidSpace, bigClock } from '../sets/extra.js';
import { LEO, NOVA, GRANDPA } from '../cast.js';
import { frozenKitchen, yearBadge, HELD } from '../p1kit.js';
import { ST, streetScene, skyScene, chapter, chessBoard, piece, bookIcon, bigNum } from '../k2.js';
import { VIO, VIOL, threeVoid, solFig, face, solClose, clampClock, ward, heartbeat, bigCount, frameProp, whisper, voiceRings, thoughtLink } from '../k3.js';

const vignette = (g, k) => { const r0 = E.W * lerp(0.6, 0.18, k), r1 = E.W * lerp(0.95, 0.45, k), gr = g.createRadialGradient(E.W / 2, E.H / 2, r0, E.W / 2, E.H / 2, r1); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.96)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); };
const sepia = (g, a = 0.4) => { g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = alpha('#c89a60', a); g.fillRect(0, 0, E.W, E.H); g.restore(); };
const violet = (g, a = 0.3) => { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha(VIO, a * 2); g.fillRect(0, 0, E.W, E.H); g.restore(); };

// ---------- cold open ----------
registerShot('s001', { draw(g, t, info) {
  threeVoid(g, t, push(t, info, { z0: 0.9, z1: 0.96, y0: 20, y1: 30 }), { leo: { expr: 'worried' }, nova: { a: 0.45, expr: 'sleepy' }, sol: { glints: 0.5 }, s: 0.9 });
  for (const [i, x] of [[0, E.W / 2 - V(420, 260)], [1, E.W / 2], [2, E.W / 2 + V(420, 260)]]) label(g, t, String(i + 1), x, E.H * 0.24, 0.2 + i * 0.2, { size: V(44, 44), color: [LEO.color, VIOL, '#5fe0d0'][i] });
} });
registerShot('s002', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }); voidSpace(g, t, cam, { color: VIO });
  layer(g, cam, 1, (g) => bigClock(g, E.W / 2, E.H * 0.5, V(300, 260), 12.0, { face: '#e8e2da' }));
  label(g, t, '0.0 s', E.W / 2, E.H * 0.8, 0.3, { size: V(56, 56), font: FONTS.title });
} });
registerShot('s003', { draw(g, t, info) {
  threeVoid(g, t, push(t, info, { z0: 1.0, z1: 1.1, y0: 40, y1: 60 }), { leo: { expr: 'scared', look: [-1, 0] }, nova: { a: 0.4 }, sol: { glints: 0.6 }, s: 0.9 });
  vignette(g, ease.inOut(prog(t, 0, info.dur)));
} });
registerShot('s004', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.25, z1: 1.0, y0: 60, y1: 0, ease: ease.out }), r = voidSpace(g, t, cam, { color: VIO });
  layer(g, cam, 0.95, (g) => { g.save(); g.translate(E.W / 2, r.GY + 40); g.scale(1, 0.32); bigClock(g, 0, 0, V(820, 600), 12.0, { face: '#e8e2da' }); g.restore(); });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: r.GY + 30, s: 0.9, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'sad', look: [0, -1], rim: { color: VIOL, dir: [0, -1] }, blink: false }));
  yearBadge(g, t, 'TRAPPED', 0.4);
} });
registerShot('s005', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 900 * ease.out(prog(t, 0.0, 1.2)), { sub: 'YEARS INSIDE ONE SECOND', subAt: 0.4 }); } });
registerShot('s006', { draw(g, t, info) {
  const p = ease.inOut(prog(t, 0, info.dur));
  threeVoid(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: V(420, 260), x1: V(420, 260), y0: 160, y1: 160 }), { leo: false, sol: false, nova: { a: lerp(0.9, 0.25, p), expr: 'sleepy' }, color: '#8a9ad8' });
  voiceRings(g, t, E.W / 2, E.H * 0.38, { color: '#5fe0d0', a: 0.3 * (1 - p), r0: 30, r1: 200 });
} });
registerShot('s007', { draw(g, t, info) {
  const p = ease.inOut(prog(t, 0, info.dur));
  threeVoid(g, t, push(t, info, { z0: lerp(0.9, 1.4, 0), z1: 1.5, y0: 40, y1: 150 }), { leo: false, nova: false, sol: { glints: p, s: 1.1 } });
  voiceRings(g, t, E.W / 2, E.H * 0.42, { color: VIOL, a: 0.25 + 0.3 * p, r0: 60, r1: 700 });
} });
registerShot('s008', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 }), { color: VIO }); voiceRings(g, t, E.W / 2, E.H / 2, { color: VIOL, r0: 200, r1: 900, a: 0.2 }); whisper(g, t, 'Stay.', { at: 0, size: V(150, 120), color: VIOL }); } });
registerShot('s009', { draw(g, t, info) { solClose(g, t, info, { glints: ease.out(prog(t, 0.1, 0.5)), talk: 1 }); whisper(g, t, 'Both of you.', { at: 0.05, y: E.H * 0.18, size: V(56, 48), color: VIOL }); } });
registerShot('s010', { draw(g, t, info) {
  threeVoid(g, t, push(t, info, { z0: 1.0, z1: 1.08, y0: 40, y1: 50 }), { leo: false, nova: false, sol: { glints: 1 } });
  g.save(); g.globalAlpha *= 0.6; FX.fog(g, E.H * 0.55, E.H * 0.45, '#2a2040', 0.6); g.restore();
  whisper(g, t, 'Nothing out there is worth breathing for.', { at: 0.2, y: E.H * 0.18, size: V(48, 42), color: VIOL });
} });
registerShot('s011', { draw(g, t, info) {
  const f = face(g, t, info, LEO, { expr: 'worried', face: HELD, noBlink: true, zoom: 0.08, color: VIO, tilt: Math.sin(t * 30) * 0.01 * clamp(t) });
  for (const s of [-1, 1]) { g.strokeStyle = S().ink; g.lineWidth = f.r * 0.05; g.beginPath(); g.arc(f.cx + s * f.r * 0.9, f.cy + f.r * 0.3, f.r * 0.13, 0, 7); g.stroke(); }
} });
function lockIcon(g, x, y, s, c) { rr(g, x - s * 0.6, y - s * 0.1, s * 1.2, s, s * 0.15); g.fillStyle = c; g.fill(); g.strokeStyle = c; g.lineWidth = s * 0.16; g.beginPath(); g.arc(x, y - s * 0.1, s * 0.4, Math.PI, 0); g.stroke(); circle(g, x, y + s * 0.35, s * 0.12, '#0a0710'); }
registerShot('s012', { draw(g, t, info) {
  face(g, t, info, LEO, { expr: 'scared', face: HELD, noBlink: true, color: VIO });
  const k = popIn(t, 0.05); if (k > 0) { g.save(); g.translate(E.W * 0.72, E.H * 0.42); g.scale(k, k); glow(g, 0, 0, 200, VIOL, 0.4); lockIcon(g, 0, 0, 110, VIOL); g.restore(); }
} });
registerShot('s013', { draw(g, t, info) { clampClock(g, t, info, prog(t, 0.2, 1.6)); label(g, t, 'HELD SHUT', E.W / 2, E.H * 0.8, wt(info, 'shut', 1.8) - 0.1, { size: V(56, 52), color: VIOL, font: FONTS.title }); } });
registerShot('s014', { draw(g, t, info) { solClose(g, t, info, { z0: 2.2, z1: 2.3, glints: 0, veil: 0.6 }); } });
registerShot('s015', { draw(g, t, info) { solClose(g, t, info, { z0: 2.6, z1: 2.9, glints: ease.out(prog(t, 0.1, 0.5)) }); label(g, t, 'VERY OLD', E.W * 0.8, E.H * 0.26, 0.3, { size: V(60, 56), color: VIOL }); } });

// ---------- recap ----------
function room(g, t, cam, o = {}) {
  const r = bedroom(g, t, cam, { mood: o.mood || 'interiorWarm', doorGlow: 0.3 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: o.x ?? E.W / 2 + V(250, 160), y: r.GY - (o.dy ?? 30), s: 1.25, facing: o.facing ?? -1, outfit: LEO, pose: o.pose || breathe(POSES.sit, t), expr: o.expr || 'neutral', face: o.face, look: o.look, rim: rimOf(r.M, [-0.6, -0.8]), shadow: false, blink: o.blink ?? blinkAt(t, 3.2) }));
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  return r;
}
registerShot('s016', { draw(g, t, info) { room(g, t, push(t, info, { z0: 1.05, z1: 1.12, x0: 120, x1: 160, y0: 40, y1: 50 }), { expr: 'neutral' }); label(g, t, 'TEN DAYS EARLIER', E.W / 2, V(150, 240), 0.3, { size: V(48, 50), color: S().ui.cream }); } });
registerShot('s017', { draw(g, t, info) { room(g, t, push(t, info, { z0: 1.6, z1: 1.68, x0: 260, x1: 270, y0: 160, y1: 165 }), { expr: 'smile' }); label(g, t, 'LEO', E.W * 0.26, E.H * 0.56, 0.15, { size: V(90, 90), font: FONTS.title }); } });
registerShot('s018', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W * 0.28, y = E.H * 0.5, fill = ease.inOut(prog(t, 0.1, 1.0));
  for (const s of [-1, 1]) { g.save(); g.translate(x + s * 70, y); g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, 60, 120, s * 0.15, 0, 7); g.stroke(); g.save(); g.beginPath(); g.ellipse(0, 0, 60, 120, s * 0.15, 0, 7); g.clip(); g.fillStyle = alpha(ui.gold, 0.5); g.fillRect(-80, 130 - 260 * fill, 160, 260); g.restore(); g.restore(); }
  seg(g, [[x, y - 180], [x, y - 90]], 6, c);
  label(g, t, '1 SECOND', E.W * 0.68, E.H * 0.38, wt(info, 'second', 1.2) - 0.1, { size: V(80, 70), color: ui.cream, font: FONTS.title });
  label(g, t, '= 1 YEAR', E.W * 0.68, E.H * 0.56, wt(info, 'year', 2.6) - 0.1, { size: V(100, 84), font: FONTS.title });
} });
registerShot('s019', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.38, y0: 120, y1: 125 }), r = voidSpace(g, t, cam);
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2, y: r.GY, s: 1.1, outfit: LEO, pose: POSES.stand, expr: 'neutral', face: HELD, rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false });
    for (let i = 0; i < 6; i++) { const a = i * (Math.PI / 3) + t * 0.5, x = E.W / 2 + Math.cos(a) * 260, y = r.GY - 290 + Math.sin(a) * 156; UI.bubble(g, x, y, { w: 110, h: 64, color: alpha('#f4efe6', 0.9) }); } });
  label(g, t, 'MIND: FREE', E.W * 0.8, E.H * 0.24, 0.3, { size: V(50, 48) });
} });
registerShot('s020', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => voidSpace(g2, 0, { z: 1.4 })); veil(g, '#05060c', 0.25);
  const ink = S().ink, x = E.W * 0.45, y = E.H * 0.6, cam = push(t, info, { z0: 1.0, z1: 1.05 });
  layer(g, cam, 1, (g) => { seg(g, [[x, y], [x - 600, y + 400]], 90, ink); seg(g, [[x - 200, y + 140], [x - 700, y + 480]], 120, LEO.color); circle(g, x + 20, y - 10, 70, ink); seg(g, [[x + 40, y - 40], [x + 180, y - 160]], 26, ink); for (let i = 0; i < 3; i++) seg(g, [[x + 50, y - 10 + i * 24], [x + 100, y + 10 + i * 24]], 24, ink);
    const k = popIn(t, 0.35); g.save(); g.translate(x + 300, y - 260); g.scale(k, k); lockIcon(g, 0, 0, 80, S().ui.accent); g.restore(); });
  slowTint(g, 0.3); label(g, t, 'BODY: LOCKED', E.W * 0.75, E.H * 0.24, 0.5, { size: V(50, 48), color: S().ui.accent });
} });
registerShot('s021', { draw(g, t, info) { frozenKitchen(g, t, push(t, info, { z0: 1.12, z1: 1.18 })); sepia(g, 0.4); label(g, t, 'PART ONE', E.W * 0.15, V(130, 200), 0.2, { size: V(40, 40), color: S().ui.cream }); label(g, t, 'GRANDPA: SAVED', E.W / 2, E.H * 0.86, 0.6, { size: V(52, 52) }); } });
registerShot('s022', { draw(g, t, info) {
  const k = ST(), NV = k.nova + 120, p = ease.out(prog(t, 0.2, 1.0));
  streetScene(g, t, push(t, info, { z0: 1.2, z1: 1.24, x0: NV - E.W / 2 - 100, x1: NV - E.W / 2 - 100, y0: 130, y1: 130 }), { busX: NV + 900 - t * 900, busBlur: 1, nova: { x: NV - p * 90, lean: p, expr: 'scared', look: [1, 0] }, leo: { x: NV - 200 - p * 60, pose: { ...POSES.ready, eF: [-20, -150], hF: [-40, -140] }, expr: 'determined', look: [1, 0], hood: true } });
  sepia(g, 0.4); label(g, t, 'PART TWO', E.W * 0.15, V(130, 200), 0.2, { size: V(40, 40), color: S().ui.cream }); label(g, t, 'NOVA: SAVED', E.W / 2, E.H * 0.86, 1.6, { size: V(52, 52), color: '#5fe0d0' });
} });
registerShot('s023', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, z1: 1.3, y0: 100, y1: 106 }), r = voidSpace(g, t, cam, { color: VIO });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 200, y: r.GY, s: 1.05, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'surprised', look: [1, 0], rim: { color: VIOL, dir: [0, -1] }, blink: false }));
  voiceRings(g, t, E.W * 0.85, E.H * 0.35, { color: VIO, r0: 20, r1: 700, a: 0.45 });
  label(g, t, 'PART TWO ENDING', E.W * 0.15, V(130, 200), 0.2, { size: V(36, 36), color: S().ui.cream });
} });
registerShot('s024', { draw(g, t, info) {
  threeVoid(g, t, push(t, info, { z0: 1.5, z1: 1.6, y0: 160, y1: 170 }), { leo: false, nova: false, sol: { glints: 1 } });
  label(g, t, 'SOL', E.W * 0.72, E.H * 0.42, wt(info, 'sol', 1.1) - 0.1, { size: V(130, 110), font: FONTS.title, color: VIOL });
} });
registerShot('s025', { draw(g, t, info) {
  const M = mood('dusk'), cam = { z: 1.06 - 0.06 * ease.inOut(t / info.dur), y: -20 * t };
  layer(g, cam, 0.2, (g) => { backdrop(g, ['#0c0818', '#2a1838', '#5a3050']); FX.stars(g, t, { count: 120, area: [0, 0, E.W, E.H * 0.6] }); });
  layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -200, y: E.H * V(0.76, 0.66), w: E.W + 400, maxH: V(300, 500), color: shade(M.wall, -0.45), windowColor: alpha(M.practical, 0.7), seed: 21 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = shade(M.dark, -0.3); g.fillRect(-E.W, E.H * V(0.76, 0.66), E.W * 3, E.H); });
  FX.drops(g, t, { count: 30, rMax: 6, drift: 1.5, color: VIOL });
  UI.titleCard(g, t, { lines: ['WHAT IF ONE SECOND', 'FELT LIKE A YEAR?'], sub: 'THE FINAL PART', dur: info.dur, y: E.H * V(0.4, 0.38) });
} });

// ---------- Sol ----------
const BOW = { ...POSES.relaxed, head: [16, -196], sh: [8, -168] };
registerShot('s026', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.6, z1: 1.64, y0: 180, y1: 182 }), { leo: false, nova: false, sol: { glints: 0.4, pose: posesAt(t, [[0, POSES.relaxed], [0.4, BOW], [1.1, POSES.relaxed]], 0.4) } }); label(g, t, 'POLITE', E.W * 0.75, E.H * 0.3, 0.3, { size: V(56, 52), color: VIOL }); } });
registerShot('s027', { draw(g, t, info) { solClose(g, t, info, { glints: 0.3 }); label(g, t, 'CALM', E.W * 0.78, E.H * 0.3, 0.05, { size: V(60, 56), color: VIOL }); } });
registerShot('s028', { draw(g, t, info) {
  threeVoid(g, t, push(t, info, { z0: 1.4, z1: 1.45, y0: 140, y1: 142 }), { leo: false, nova: false, sol: { glints: 0.5 } });
  FX.dust(g, t * 0.2, { count: 120, color: '#d8c8a8', a: 0.5, speed: 1 });
  label(g, t, 'ANCIENT', E.W * 0.75, E.H * 0.3, 0.05, { size: V(64, 60), color: '#d8c8a8', font: FONTS.title });
} });
registerShot('s029', { draw(g, t, info) {
  threeVoid(g, t, push(t, info, { z0: 1.2, z1: 1.25, y0: 100, y1: 102 }), { nova: false, leo: { x: E.W / 2 - V(380, 240), expr: 'thinking', pose: { ...POSES.think } }, sol: { x: E.W / 2 + V(300, 200), glints: 0.4 }, vlink: 0.7 });
  whisper(g, t, 'How long have you been in here?', { at: 0.1, y: E.H * 0.18, size: V(50, 44), color: S().ui.cream });
} });
registerShot('s030', { draw(g, t, info) { solClose(g, t, info, { glints: 0.5, talk: 1 }); whisper(g, t, 'About three thousand years.', { at: 0.1, y: E.H * 0.18, size: V(52, 46), color: VIOL }); } });
registerShot('s031', { draw(g, t, info) { face(g, t, info, LEO, { expr: 'shocked', noBlink: true, zoom: 0.1, talk: () => talk(info), color: VIO }); } });
registerShot('s032', { draw(g, t, info) {
  UI.blueprint(g);
  [['NOVA', 200, '#5fe0d0'], ['SOL', 3000, VIOL]].forEach(([n, v, c], i) => { const y = E.H * (0.42 + i * 0.2), x = E.W * 0.22, full = E.W * 0.6, at = i ? wt(info, 'forever', 2.0) - 0.4 : 0.2, k = ease.out(prog(t, at, at + 1.0)), w = full * (v / 3000) * k;
    text(g, n, x - 30, y, { size: V(46, 44), color: c, font: FONTS.ui, weight: 900, align: 'right' }); rr(g, x, y - 36, Math.max(6, w), 72, 36); g.fillStyle = alpha(c, 0.85); g.fill(); if (k > 0) text(g, Math.round(v * k).toLocaleString('en-US'), x + Math.max(6, w) + 30, y, { size: V(52, 50), color: c, font: FONTS.title, weight: 700, align: 'left' }); });
  label(g, t, '“FOREVER”', E.W * 0.3, E.H * 0.26, wt(info, 'forever', 2.0), { size: V(52, 50), color: S().ui.cream });
} });
registerShot('s033', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, tT = wt(info, 'thousand', 2.6) - 0.2;
  text(g, '1 SECOND', E.W * 0.3, E.H * 0.5, { size: V(90, 70), color: ui.cream, font: FONTS.title, weight: 700 });
  text(g, '=', E.W * 0.5, E.H * 0.5, { size: V(90, 70), color: UI.bpStroke(), font: FONTS.title, weight: 700 });
  const k = popIn(t, tT); if (k > 0) { g.save(); g.translate(E.W * 0.73, E.H * 0.5); g.scale(k, k); text(g, '1,000 YEARS', 0, 0, { size: V(90, 66), color: VIOL, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(VIOL, 0.6) }); g.restore(); }
  label(g, t, 'FOR SOL', E.W / 2, E.H * 0.26, 0.2, { size: V(48, 46), color: VIOL });
} });
registerShot('s034', { draw(g, t, info) {
  ward(g, t, push(t, info, { z0: 1.0, z1: 1.08, x0: 0, x1: 60, y0: 30, y1: 50 }), { gp: false, leo: false, nova: false });
  label(g, t, 'OUT THERE', E.W / 2, V(150, 240), 0.3, { size: V(48, 48), color: S().ui.cream });
  label(g, t, 'A VERY STILL OLD MAN', E.W / 2, E.H * 0.86, wt(info, 'still', 2.0) - 0.1, { size: V(46, 44), color: S().ui.cream });
} });
registerShot('s035', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui; heartbeat(g, E.W * 0.22, E.H * 0.48, 3.0, t, 0.8);
  const tB = wt(info, 'billion', 2.6) - 0.6, n = 2.5e9 * ease.inOut(prog(t, 0.6, tB + 0.8));
  bigCount(g, t, n, { x: E.W * 0.62, y: E.H * 0.46, size: V(110, 80) });
  label(g, t, 'HEARTBEATS IN A LIFE', E.W * 0.62, E.H * 0.66, 0.4, { size: V(46, 44), color: ui.cream });
} });
registerShot('s036', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  text(g, '3,000 YEARS LIVED', E.W / 2, E.H * 0.36, { size: V(70, 56), color: VIOL, font: FONTS.title, weight: 700, alpha: clamp(popIn(t, 0.1)) });
  label(g, t, 'HEARTBEATS HEARD…', E.W / 2, E.H * 0.6, 1.2, { size: V(56, 52), color: ui.cream });
} });
registerShot('s037', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  for (let i = 0; i < 3; i++) { const at = 0.1 + i * 0.45, k = popIn(t, at); if (k <= 0) continue; const x = E.W * (0.3 + i * 0.2); g.save(); g.translate(x, E.H * 0.45); g.scale(k, k); heartbeat(g, 0, 0, 1.8, 0, 9, ui.accent); g.restore(); }
  label(g, t, 'JUST 3', E.W / 2, E.H * 0.74, 0.9, { size: V(80, 70), font: FONTS.title });
} });

// ---------- PLUS ----------
const GLYPHS = ['A', 'あ', 'Ж', 'ع', 'Ω', '字', 'ॐ', 'ß', '한', 'λ', 'Ñ', 'ש'];
function glyphOrbit(g, t, cx, cy, R, n, a = 1) { for (let i = 0; i < n; i++) { const an = i * (Math.PI * 2 / n) + t * 0.4, x = cx + Math.cos(an) * R, y = cy + Math.sin(an) * R * 0.45; text(g, GLYPHS[i % GLYPHS.length], x, y, { size: 52, color: alpha(S().ui.gold, a * (0.6 + 0.4 * Math.sin(an))), font: FONTS.serif, weight: 700, glow: 14, glowColor: alpha(S().ui.gold, 0.5) }); } }
registerShot('s038', { draw(g, t, info) {
  const r = threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, y0: 120, y1: 124 }), { leo: false, nova: false, sol: { glints: 0.8 }, extra: (g, r) => glyphOrbit(g, t, E.W / 2, r.GY - 230, 300, 8, ease.out(prog(t, 0.6, 1.6))) });
  chapter(g, t, 'PLUS', '#7ae07a');
} });
registerShot('s039', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.5, z1: 1.6, y0: 160, y1: 166 }), { leo: false, nova: false, sol: { glints: 0.8 }, extra: (g, r) => glyphOrbit(g, t, E.W / 2, r.GY - 230, 330, 12, 1) }); label(g, t, 'EVERY LANGUAGE', E.W / 2, E.H * 0.2, 0.2, { size: V(56, 52) }); } });
registerShot('s040', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), eqs = ['e^{iπ} + 1 = 0', 'a² + b² = c²', '∫ x dx = x²/2', 'E = mc²', 'φ = (1+√5)/2', 'Σ 1/n² = π²/6', 'F = ma', 'x = (−b ± √Δ)/2a'];
  eqs.forEach((s2, i) => { const k = popIn(t, 0.05 + i * 0.13); if (k <= 0) return; text(g, s2, E.W * (0.22 + (i % 2) * 0.5), E.H * (0.24 + Math.floor(i / 2) * 0.17), { size: V(48, 40), color: i % 3 ? c : S().ui.gold, font: FONTS.serif, weight: 700, alpha: clamp(k) }); });
} });
registerShot('s041', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.4, z1: 1.45, y0: 140, y1: 142 }), { leo: false, nova: false, sol: { glints: 0.6 }, extra: (g, r) => { for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3 + t * 0.6; bookIcon(g, E.W / 2 + Math.cos(an) * 300, r.GY - 240 + Math.sin(an) * 120, 0.6, ['#e8d8b0', '#c8a8e0', '#a8d0e8'][i % 3]); } } }); label(g, t, 'EVERY STORY', E.W / 2, E.H * 0.2, 0.1, { size: V(56, 52) }); } });
registerShot('s042', { draw(g, t, info) {
  threeVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 92 }), { leo: false, nova: { x: E.W / 2 + V(380, 240), expr: 'thinking', pose: { ...POSES.think }, a: 0.85 }, sol: { x: E.W / 2 - V(380, 240), facing: 1, glints: 0.6 },
    extra: (g, r) => { const cy = r.GY - 230; chessBoard(g, E.W / 2, cy, 360, t, { color: VIOL }); piece(g, E.W / 2 - 60, cy + 10, 0.7, VIOL, true); piece(g, E.W / 2 + 70, cy - 30, 0.7, '#5fe0d0', true); } });
} });
registerShot('s043', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 }), { color: VIO }); const cy = E.H * 0.62; chessBoard(g, E.W / 2, cy, 520, t, { color: VIOL }); piece(g, E.W / 2 - 40, cy + 20, 1.2, VIOL, true); piece(g, E.W / 2 + 120, cy - 30, 1.2, '#5fe0d0', true);
  for (let i = 0; i < 4; i++) label(g, t, String(i + 1), E.W * (0.3 + i * 0.13), E.H * 0.2, 0.05 + i * 0.15, { size: V(56, 52), color: VIOL, font: FONTS.title });
  stamp(g, t, 'CHECKMATE', E.W / 2, E.H * 0.38, 0.8, V(100, 84), VIOL, -0.08);
} });
registerShot('s044', { draw(g, t, info) { face(g, t, info, NOVA, { expr: 'angry', face: { mouth: 'frown' }, look: [0.3, 0.3], color: '#8a9ad8' }); label(g, t, 'SILENT FOR A WEEK', E.W * 0.28, E.H * 0.26, 0.4, { size: V(48, 46), color: S().ui.cream }); } });

// ---------- MINUS ----------
registerShot('s045', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 92 }), { nova: false, leo: { x: E.W / 2 - V(380, 240), expr: 'worried' }, sol: { x: E.W / 2 + V(300, 200), glints: 0.8 } }); chapter(g, t, 'MINUS', '#ff6a5a'); } });
registerShot('s046', { draw(g, t, info) { solClose(g, t, info, { glints: 0.7, talk: 1 }); whisper(g, t, 'Your power wasn’t growing, Leo.', { at: 0.1, y: E.H * 0.18, size: V(52, 46), color: VIOL }); } });
registerShot('s047', { draw(g, t, info) {
  const p = ease.inOut(prog(t, 0.1, info.dur));
  threeVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 92 }), { nova: false, leo: { x: lerp(E.W / 2 - V(480, 300), E.W / 2 - V(260, 160), p), expr: 'scared', pose: { ...POSES.fall, head: [-10, -200] } }, sol: { x: E.W / 2 + V(300, 200), glints: 1 },
    extra: (g, r, P) => { for (let i = 0; i < 5; i++) thoughtLink(g, t + i, [P.L.x + 10, r.GY - 60 - i * 40], [P.Z.x - 30, r.GY - 120 - i * 25], { k: 0.4, color: VIOL }); } });
  whisper(g, t, 'I was pulling you in.', { at: 0.1, y: E.H * 0.18, size: V(52, 46), color: VIOL });
} });
registerShot('s048', { draw(g, t, info) {
  const slam = 0.2, r = room(g, t > slam + 0.15 ? 0 : t, push(t, info, { z0: 1.15, z1: 1.18, x0: -160, x1: -160, y0: 60, y1: 60 }), { x: E.W / 2 - V(300, 120), dy: 0, pose: t > slam ? POSES.handsOnHead : POSES.relaxed, facing: -1, expr: t > slam ? 'shocked' : 'neutral', look: [-1, 0], blink: false });
  violet(g, 0.35); if (t > slam && t < slam + 0.1) veil(g, '#ffffff', 0.5);
  label(g, t, 'SLAM!', E.W * 0.22, E.H * 0.3, slam, { size: V(90, 80), color: VIOL, font: FONTS.title });
} });
registerShot('s049', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.34, x0: -100, x1: -100, y0: 140, y1: 140 }), r = road(g, t > 0.4 ? 0 : t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(220, 120), y: r.GY, s: 1.2, facing: 1, outfit: LEO, pose: walkPose(0.7 * Math.PI * 2), expr: 'shocked', look: [1, -0.2], rim: rimOf(r.M, [0.6, -0.8]), blink: false }));
  layer(g, cam, 0.85, (g) => { const cx = E.W / 2 + V(300, 200); FX.lensStreak(g, cx, r.laneY + 20, 300, '#ffe6b0', 0.5, 6); glow(g, cx, r.laneY + 20, 120, '#ffe6b0', 0.7); });
  violet(g, 0.35); label(g, t, 'HONK!', E.W * 0.72, E.H * 0.3, 0.0, { size: V(80, 76), color: VIOL, font: FONTS.title });
} });
registerShot('s050', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.06 }), { color: VIO });
  for (let i = 0; i < 9; i++) { const ph = (t * 0.7 + i / 9) % 1, x = lerp(-200, E.W + 200, ph), y = E.H * (0.25 + (i % 4) * 0.15) + Math.sin(ph * 6 + i) * 30, rot = ph * 4 + i; g.save(); g.translate(x, y); g.rotate(rot * 0.3); rr(g, -60, -70, 120, 140, 10); g.fillStyle = alpha('#efe6d2', 0.85); g.fill(); rr(g, -60, -70, 120, 30, 10); g.fillStyle = '#c0443a'; g.fill(); text(g, String(1 + ((i * 37) % 365)), 0, 20, { size: 48, color: '#2a2230', font: FONTS.title, weight: 700 }); g.restore(); }
  label(g, t, 'WITHOUT ASKING', E.W / 2, E.H * 0.86, 0.6, { size: V(52, 50), color: VIOL });
} });
registerShot('s051', { draw(g, t, info) { solClose(g, t, info, { z0: 2.6, z1: 2.8, glints: 1, talk: 1 }); whisper(g, t, 'That was me.', { at: 0.05, y: E.H * 0.18, size: V(60, 52), color: VIOL }); } });
registerShot('s052', { draw(g, t, info) { face(g, t, info, LEO, { expr: 'angry', look: [1, 0], talk: () => talk(info), color: VIO }); whisper(g, t, 'Why?', { at: 0.0, x: E.W * 0.72, y: E.H * 0.3, size: V(80, 70), color: S().ui.cream }); } });
registerShot('s053', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 0.75, z1: 0.72, y0: -60, y1: -60 }), { leo: false, nova: false, sol: { glints: 0.3, s: 0.9 } }); label(g, t, '3,000 YEARS', E.W / 2, E.H * 0.22, 0.4, { size: V(60, 56), color: VIOL }); } });
registerShot('s054', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); threeVoid(g, t, { z: lerp(0.72, 0.5, p), x: 0, y: -80 }, { leo: false, nova: false, sol: { glints: 0.2, pose: POSES.sad } }); label(g, t, 'ALONE', E.W / 2, E.H * 0.22, wt(info, 'alone', 1.6) - 0.1, { size: V(70, 64), color: VIOL, font: FONTS.title }); } });

// ---------- the catch ----------
function blurredPicture(g, x, y, w, h, a) { frameProp(g, x, y, w, h, (g, fx, fy, fw, fh) => { g.fillStyle = linGrad(g, 0, fy, 0, fy + fh, ['#9ab0b8', '#5a6a7a']); g.fillRect(fx, fy, fw, fh); g.filter = 'blur(10px)'; g.fillStyle = '#3a8a5a'; g.fillRect(fx + fw * 0.6, fy + fh * 0.2, fw * 0.25, fh * 0.8); g.fillStyle = '#b8303a'; g.fillRect(fx + fw * 0.1, fy + fh * 0.15, fw * 0.2, fh * 0.85); g.filter = 'none'; }, a); }
function skyPicture(g, x, y, w, h, a, t) { frameProp(g, x, y, w, h, (g, fx, fy, fw, fh) => { g.fillStyle = linGrad(g, 0, fy, 0, fy + fh, ['#0a1030', '#3a2a60', '#d88a6a']); g.fillRect(fx, fy, fw, fh); for (let i = 0; i < 30; i++) circle(g, fx + ((i * 73) % fw), fy + ((i * 41) % (fh * 0.7)), 2, '#ffffff'); }, a); }
registerShot('s055', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.0, z1: 1.04 }), { leo: false, nova: false, sol: { glints: 0.4 } }); UI.bigLine(g, t, { str: 'THE CATCH', dur: info.dur + 0.4, size: V(120, 96), color: S().ui.accent }); } });
registerShot('s056', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: -120, x1: -120, y0: 120, y1: 122 }), { leo: false, nova: false, sol: { x: E.W / 2 - V(300, 180), facing: 1, glints: 0.5 }, extra: (g, r) => blurredPicture(g, E.W / 2 + V(240, 160), r.GY - 300, 360, 240, ease.out(prog(t, 0.2, 0.8))) }); label(g, t, 'ONE FROZEN PICTURE', E.W / 2, E.H * 0.2, 0.8, { size: V(52, 50), color: S().ui.cream }); } });
registerShot('s057', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 }), { color: VIO }); for (let i = 0; i < 5; i++) { const k = popIn(t, i * 0.15); if (k > 0) blurredPicture(g, E.W * (0.14 + i * 0.18), E.H * 0.5 + (i % 2) * 40, 260 * k, 175 * k, 0.9); } label(g, t, 'ALWAYS THE SAME', E.W / 2, E.H * 0.82, 0.3, { size: V(52, 50), color: VIOL }); } });
registerShot('s058', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.6, z1: 1.64, y0: 180, y1: 182 }), { leo: false, nova: false, sol: { facing: t > 0.5 ? 1 : -1, glints: t > 0.5 ? 0 : 0.6 } }); whisper(g, t, '…', { at: 0.6, y: E.H * 0.2, size: V(90, 80), color: VIOL }); } });
registerShot('s059', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: 120, x1: 120, y0: 120, y1: 122 }), { leo: false, sol: false, nova: { x: E.W / 2 + V(300, 180), expr: 'smile', look: [-1, -0.2] }, color: '#8a9ad8', extra: (g, r) => skyPicture(g, E.W / 2 - V(240, 160), r.GY - 300, 360, 240, ease.out(prog(t, 0.2, 0.8)), t) }); } });
registerShot('s060', { draw(g, t, info) { skyScene(g, t, push(t, info, { z0: 1.0, z1: 1.04, y0: -260, y1: -300 }), { bench: false }); } });
registerShot('s061', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), ex = E.W * 0.2, ey = E.H * 0.55;
  g.strokeStyle = c; g.lineWidth = 6; g.beginPath(); g.moveTo(ex - 110, ey); g.quadraticCurveTo(ex, ey - 90, ex + 110, ey); g.quadraticCurveTo(ex, ey + 90, ex - 110, ey); g.stroke(); circle(g, ex, ey, 34, c); circle(g, ex, ey, 14, ui.bpBg);
  for (let i = 0; i < 40; i++) { const at = 0.3 + i * 0.05, x = E.W * (0.4 + ((i * 0.137) % 0.55)), y = E.H * (0.15 + ((i * 0.291) % 0.65)); if (t > at) FX.sparkle(g, x, y, 10 + (i % 3) * 5, '#ffffff', 0.9); }
  label(g, t, 'A FEW THOUSAND', E.W * 0.2, E.H * 0.26, wt(info, 'few', 2.4) - 0.1, { size: V(46, 44) });
  label(g, t, 'VISIBLE', E.W * 0.2, E.H * 0.33, wt(info, 'few', 2.4) + 0.2, { size: V(40, 38), color: ui.cream });
} });
registerShot('s062', { draw(g, t, info) {
  skyScene(g, t, push(t, info, { z0: 1.0, z1: 1.04, y0: -200, y1: -220 }), { bench: true }); veil(g, '#03040c', 0.35);
  bigCount(g, t, 4112 * ease.out(prog(t, 0.1, 2.4)), { y: E.H * 0.42, sub: 'STARS COUNTED', subAt: 0.4 });
} });
registerShot('s063', { draw(g, t, info) { skyScene(g, t, push(t, info, { z0: 0.95, z1: 1.0, y0: -260, y1: -300 }), { bench: true, extra: () => { for (let i = 0; i < 40; i++) FX.sparkle(g, (i * 211) % E.W, (i * 97) % (E.H * 0.6), 8 + (i % 4) * 4, S().ui.gold, 0.5 + 0.5 * Math.sin(t * 4 + i)); } }); label(g, t, 'ALMOST ALL OF THEM', E.W / 2, E.H * 0.2, 0.3, { size: V(52, 50), color: S().ui.cream }); } });
