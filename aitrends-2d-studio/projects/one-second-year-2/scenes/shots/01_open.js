// shots/01_open.js: the bus freeze cold open (s001-s015), recap of the power (s016-s035), title (s036).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, faceShot, slowTint, popIn, label, stamp } from '../lib.js';
import { bedroom, kitchen } from '../sets/indoor.js';
import { voidSpace, bigClock, glassesProp } from '../sets/extra.js';
import { road } from '../sets/outdoor.js';
import { bus, rainDrops } from '../sets/street2.js';
import { LEO, GRANDPA } from '../cast.js';
import { kitchenScene, frozenKitchen, dance, yearBadge, HELD } from '../p1kit.js';
import { ST, NS, streetScene, frozenStreet, streetBg, leoFace, novaFace, mindVoid, whisper, voiceRings, plate } from '../k2.js';

// ---------- cold open ----------
registerShot('s001', { draw(g, t, info) {
  const k = ST(); streetScene(g, t, push(t, info, { z0: 1.0, z1: 1.06, x0: -60, x1: 0, y0: 40, y1: 50 }), { leo: false, nova: { x: k.nova, look: [1, 0] }, busX: null,
    behind: (g, r) => { for (let i = 0; i < 3; i++) { const x = ((t * 260 + i * 900) % (E.W + 1200)) - 600; FX.lensStreak(g, x, r.laneY + 30, 220, '#ffe6b0', 0.25, 5); } } });
} });
registerShot('s002', { draw(g, t, info) {
  blurLayer(g, 10, (g2) => streetScene(g2, t, { z: 1.4, x: 300, y: 60 }, { leo: false, nova: false })); veil(g, '#05060c', 0.5);
  const x = E.W * 0.55 - t * 120, y = E.H * 0.5, k = ease.out(prog(t, 0, 0.6));
  for (const dx of [-170, 170]) { glow(g, x + dx, y, 340 * k, '#ffe6b0', 0.9); circle(g, x + dx, y, 46, '#fff8e8'); FX.lensStreak(g, x + dx, y, 1400, '#ffe6b0', 0.4 * k, 6); }
  FX.rain(g, t, { a: 0.35, count: 260 });
} });
registerShot('s003', { draw(g, t, info) {
  const k = ST(), bx = lerp(E.W + 500, k.nova + V(1200, 900), ease.out(prog(t, 0, info.dur)));
  streetScene(g, t, push(t, info, { z0: 1.05, z1: 1.1, x0: 260, x1: 300, y0: 60, y1: 60 }), { leo: false, nova: false, busX: bx });
} });
registerShot('s004', { draw(g, t, info) {
  const k = ST(), bx = lerp(k.nova + V(1300, 1000), k.nova + V(760, 560), prog(t, 0, info.dur));
  const cam = push(t, info, { z0: 1.12, z1: 1.2, x0: 120, x1: 180, y0: 120, y1: 130 });
  streetScene(g, t, cam, { leo: false, busX: bx, nova: { x: k.nova + t * 20, wheelRot: t * 3, expr: t > 2.2 ? 'shocked' : 'neutral', look: [1, 0] } });
} });
registerShot('s005', { draw(g, t, info) { leoFace(g, t, info, { expr: 'shocked', face: { mouth: 'o' }, zoom: 0.12 }); } });
registerShot('s006', { draw(g, t, info) {
  frozenStreet(g, t, push(t, info, { z0: 1.1, z1: 1.14, x0: 60, x1: 60, y0: 110, y1: 110, r: 0.01 }));
  yearBadge(g, t, 'TIME STOPS', 0.1);
} });
registerShot('s007', { draw(g, t, info) {
  blurLayer(g, 16, (g2) => frozenStreet(g2, 0, { z: 1.8, x: 200, y: 150 }, { tint: false })); veil(g, '#05060c', 0.3);
  const cam = push(t, info, { z0: 1.0, z1: 1.08, r: 0.01 });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 26; i++) { const x = (i * 337) % E.W, y = (i * 211) % E.H, r = 10 + (i % 5) * 7; g.fillStyle = alpha('#cfe0ff', 0.25); circle(g, x, y, r, alpha('#cfe0ff', 0.22)); ring(g, x, y, r, 2, alpha('#ffffff', 0.5)); circle(g, x - r * 0.35, y - r * 0.35, r * 0.25, alpha('#ffffff', 0.8)); } });
  slowTint(g, 0.3); label(g, t, 'GLASS BEADS', E.W / 2, E.H * 0.82, 1.2, { size: V(48, 50), color: S().ui.cream });
} });
registerShot('s008', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => frozenStreet(g2, 0, { z: 1.6, x: 400, y: 100 }, { tint: false })); veil(g, '#05060c', 0.3);
  const cam = push(t, info, { z0: 1.0, z1: 1.06 });
  layer(g, cam, 1, (g) => bus(g, E.W * 0.12, E.H * 0.98, 2.6, { facing: 1, lights: true, driver: true, shout: true }));
  rainDrops(g, t, { count: 50, rMax: 9 }); slowTint(g, 0.3);
  label(g, t, 'MID-SHOUT', E.W * 0.78, E.H * 0.22, 1.0, { size: V(50, 50), color: S().ui.cream });
} });
registerShot('s009', { draw(g, t, info) { leoFace(g, t, info, { expr: 'shocked', frozen: true, zoom: 0.02 }); } });
function clockVoid(g, t, info, o = {}) {
  const cam = push(t, info, { z0: o.z0 ?? 1.25, z1: o.z1 ?? 1.0, y0: 60, y1: 0, ease: ease.out });
  const { GY } = voidSpace(g, t, cam);
  layer(g, cam, 0.95, (g) => { g.save(); g.translate(E.W / 2, GY + 40); g.scale(1, 0.32); bigClock(g, 0, 0, V(820, 600), 12.0, { face: '#e8e2da' }); g.restore(); glow(g, E.W / 2, GY + 40, 900, '#cfe0ff', 0.12); });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2, y: GY + 30, s: 0.9, facing: 1, outfit: LEO, pose: POSES.stand, expr: o.expr || 'awe', look: o.look || [0, -1], rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false }); o.extra?.(g, GY); });
  return GY;
}
registerShot('s010', { draw(g, t, info) { clockVoid(g, t, info); yearBadge(g, t, '1 SECOND = 1 YEAR', 0.4); } });
registerShot('s011', { draw(g, t, info) {
  const tV = wt(info, 'voice', 1.2) - 0.1;
  clockVoid(g, t, info, { z0: 1.0, z1: 1.12, expr: t > tV ? 'surprised' : 'awe', look: [0.6, -0.4], extra: (g, GY) => { if (t > tV) { voiceRings(g, t - tV, E.W / 2 + 6, GY + 30 - 190, { r0: 30, r1: 260 }); FX.rings(g, E.W * 0.92, E.H * 0.2, t, { count: 3, r0: 30, r1: 500, speed: 0.4, color: S().ui.gold, a: 0.25 }); } } });
} });
registerShot('s012', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); voiceRings(g, t, E.W / 2, E.H / 2, { r0: 200, r1: 900, a: 0.2 });
  whisper(g, t, 'Don’t breathe out.', { at: 0.05 });
} });
registerShot('s013', { draw(g, t, info) { novaFace(g, t, info, { frozen: true, expr: 'scared', look: [1, 0.1], dx: V(140, 0), zoom: 0.02, bgCam: { z: 1.7, x: 500, y: 150 } }); voiceRings(g, t, E.W * 0.5, E.H * 0.3, { a: 0.3 }); whisper(g, t, 'Please.', { y: E.H * 0.2, size: V(64, 56), at: 0 }); } });
registerShot('s014', { draw(g, t, info) {
  const k = ST(); frozenStreet(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: k.nova - E.W / 2 + 200, x1: k.nova - E.W / 2 + 210, y0: 200, y1: 200 }), { leo: false });
  const r = { x1: k.nova + 90 * NS, x2: k.nova + V(560, 420) - 330 * 0.9 }; // front wheel → bus nose
} });
registerShot('s015', { draw(g, t, info) {
  backdrop(g, ['#020205', '#05060c']); voiceRings(g, t, E.W / 2, E.H / 2, { r0: 100, r1: 700, a: 0.15 });
  whisper(g, t, 'I don’t make it.', { at: 0.05, dur: info.dur + 0.2, color: '#e8e2da' });
} });

// ---------- recap: the power ----------
function room(g, t, cam, o = {}) {
  const r = bedroom(g, t, cam, { mood: o.mood || 'interiorWarm', doorGlow: 0.3 });
  layer(g, cam, 1, (g) => { if (o.leo !== false) drawFigure(g, { x: o.x ?? E.W / 2 + V(250, 160), y: r.GY - (o.dy ?? 30), s: 1.25, facing: o.facing ?? -1, outfit: LEO, pose: o.pose || breathe(POSES.sit, t), expr: o.expr || 'neutral', face: o.face, look: o.look, rim: rimOf(r.M, [-0.6, -0.8]), shadow: false, blink: o.blink ?? blinkAt(t, 3.2) }); o.extra?.(g, r); });
  if (o.dust !== false) FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  return r;
}
registerShot('s016', { draw(g, t, info) { room(g, t, push(t, info, { z0: 1.05, z1: 1.12, x0: 120, x1: 160, y0: 40, y1: 50 }), { expr: 'smile' }); label(g, t, 'TWO WEEKS EARLIER', E.W / 2, V(150, 240), 0.3, { size: V(48, 50), color: S().ui.cream }); } });
registerShot('s017', { draw(g, t, info) {
  room(g, t, push(t, info, { z0: 1.6, z1: 1.68, x0: 260, x1: 270, y0: 160, y1: 165 }), { expr: 'smile', pose: breathe({ ...POSES.sit, eF: [24, -150], hF: [36, -190] }, t) });
  label(g, t, 'LEO', E.W * 0.26, E.H * 0.56, 0.15, { size: V(90, 90), font: FONTS.title });
} });
registerShot('s018', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W * 0.28, y = E.H * 0.5;
  // lungs icon filling with breath
  const fill = ease.inOut(prog(t, 0.1, 1.0));
  for (const s of [-1, 1]) { g.save(); g.translate(x + s * 70, y); g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, 60, 120, s * 0.15, 0, 7); g.stroke(); g.save(); g.beginPath(); g.ellipse(0, 0, 60, 120, s * 0.15, 0, 7); g.clip(); g.fillStyle = alpha(ui.gold, 0.5); g.fillRect(-80, 130 - 260 * fill, 160, 260); g.restore(); g.restore(); }
  seg(g, [[x, y - 180], [x, y - 90]], 6, c);
  text(g, 'HOLD BREATH', x, y + 200, { size: V(40, 40), color: c, font: FONTS.ui, weight: 900, spacing: 4 });
  const tS = wt(info, 'second', 1.4) - 0.1, tY = wt(info, 'year', 2.6) - 0.1;
  label(g, t, '1 SECOND', E.W * 0.68, E.H * 0.38, tS, { size: V(80, 70), color: ui.cream, font: FONTS.title });
  label(g, t, '= 1 YEAR', E.W * 0.68, E.H * 0.56, tY, { size: V(100, 84), font: FONTS.title });
} });
function bubbleRing(g, t, cx, cy, n, R, c) { for (let i = 0; i < n; i++) { const a = i * (Math.PI * 2 / n) + t * 0.5, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.6, k = 0.7 + 0.3 * Math.sin(t * 2 + i); g.save(); g.translate(x, y); g.scale(k, k); UI.bubble(g, 0, 0, { w: 110, h: 64, color: alpha(c, 0.9) }); g.restore(); } }
registerShot('s019', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.38, y0: 120, y1: 125 }); const r = voidSpace(g, t, cam);
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2, y: r.GY, s: 1.1, outfit: LEO, pose: POSES.stand, expr: 'neutral', face: HELD, rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false }); bubbleRing(g, t, E.W / 2, r.GY - 290, 6, 260, '#f4efe6'); });
  slowTint(g, 0.25);
} });
function lockIcon(g, x, y, s, c) { rr(g, x - s * 0.6, y - s * 0.1, s * 1.2, s, s * 0.15); g.fillStyle = c; g.fill(); g.strokeStyle = c; g.lineWidth = s * 0.16; g.beginPath(); g.arc(x, y - s * 0.1, s * 0.4, Math.PI, 0); g.stroke(); circle(g, x, y + s * 0.35, s * 0.12, '#0a0710'); }
registerShot('s020', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => voidSpace(g2, 0, { z: 1.4 })); veil(g, '#05060c', 0.25);
  const ink = S().ink, x = E.W * 0.45, y = E.H * 0.6, cam = push(t, info, { z0: 1.0, z1: 1.05 });
  layer(g, cam, 1, (g) => { seg(g, [[x, y], [x - 600, y + 400]], 90, ink); seg(g, [[x - 200, y + 140], [x - 700, y + 480]], 120, LEO.color); circle(g, x + 20, y - 10, 70, ink); seg(g, [[x + 40, y - 40], [x + 180, y - 160]], 26, ink); for (let i = 0; i < 3; i++) seg(g, [[x + 50, y - 10 + i * 24], [x + 100, y + 10 + i * 24]], 24, ink);
    seg(g, [[x + 36, y - 46], [x + 172, y - 170]], 4, alpha('#cfe0ff', 0.6)); const k = popIn(t, 0.35); g.save(); g.translate(x + 300, y - 260); g.scale(k, k); lockIcon(g, 0, 0, 80, S().ui.accent); g.restore(); });
  slowTint(g, 0.3);
} });
function sepia(g, a = 0.35) { g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = alpha('#c89a60', a); g.fillRect(0, 0, E.W, E.H); g.restore(); }
registerShot('s021', { draw(g, t, info) {
  frozenKitchen(g, t, push(t, info, { z0: 1.12, z1: 1.18 }));
  sepia(g, 0.4); FX.dust(g, t, { count: 60, color: '#ffe2bd', a: 0.25 });
  label(g, t, 'PART ONE', E.W * 0.15, V(130, 200), 0.2, { size: V(40, 40), color: S().ui.cream });
  label(g, t, 'GRANDPA: SAVED', E.W / 2, E.H * 0.86, wt(info, 'save', 2.6) - 0.1, { size: V(52, 52) });
} });
registerShot('s022', { draw(g, t, info) { kitchenScene(g, t, push(t, info, { z0: 1.0, z1: 1.06, x0: -40, x1: 0 }), { leoPose: POSES.relaxed, leoExpr: 'smile', table: true }); label(g, t, 'HOME', E.W * 0.5, V(140, 220), 0.3, { size: V(50, 50), color: S().ui.cream }); } });
registerShot('s023', { draw(g, t, info) { const k = { gp: E.W / 2 - V(260, 200) }; kitchenScene(g, t, push(t, info, { z0: 1.55, z1: 1.62, x0: k.gp - E.W / 2 - 60, x1: k.gp - E.W / 2 - 40, y0: 170, y1: 175 }), { leo: false, table: false }); } });
registerShot('s024', { draw(g, t, info) {
  const k = { gp: E.W / 2 - V(260, 200) }, tS = wt(info, 'slower', 1.0);
  kitchenScene(g, t, push(t, info, { z0: 1.55, z1: 1.6, x0: k.gp - E.W / 2 - 50, x1: k.gp - E.W / 2 - 40, y0: 170, y1: 175 }), { leo: false, table: false, gpPose: dance(t * 0.55, 100), gpExpr: t > tS ? 'smile' : 'joy' });
  label(g, t, '…A LITTLE SLOWER', E.W * 0.7, E.H * 0.3, tS - 0.1, { size: V(46, 46), color: S().ui.cream });
} });
registerShot('s025', { draw(g, t, info) {
  room(g, t, push(t, info, { z0: 1.2, z1: 1.28, x0: -120, x1: -140, y0: 80, y1: 85 }), { mood: 'night', x: E.W / 2 - V(40, 0), dy: 0, pose: POSES.stand, facing: -1, expr: 'worried', look: [-1, -0.4], dust: false });
} });
registerShot('s026', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W * 0.2, y = E.H * 0.52, w = E.W * 0.6, h = 90;
  const p = ease.in(prog(t, 0.1, info.dur - 0.1)) * 1.25;
  rr(g, x, y - h / 2, w, h, 20); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
  g.save(); rr(g, x, y - h / 2, w, h, 20); g.clip(); g.fillStyle = linGrad(g, x, 0, x + w, 0, [ui.gold, ui.accent]); g.fillRect(x, y - h / 2, w * Math.min(1, p), h); g.restore();
  if (p > 1) { const k = (p - 1) / 0.25; for (let i = 0; i < 10; i++) FX.sparkle(g, x + w + 20 + Math.cos(i) * 60 * k, y + Math.sin(i * 2.1) * 80 * k, 18, ui.accent, 1 - k * 0.5); }
  text(g, 'POWER', E.W / 2, y - 120, { size: V(56, 56), color: c, font: FONTS.ui, weight: 900, spacing: 8 });
  text(g, Math.round(Math.min(p, 1.25) * 100) + '%', E.W / 2, y + 140, { size: V(70, 64), color: p > 1 ? ui.accent : ui.gold, font: FONTS.title, weight: 700 });
} });
registerShot('s027', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, tN = wt(info, 'now', 1.4) - 0.1;
  label(g, t, 'IT WAITED FOR YOU', E.W / 2, E.H * 0.38, 0.1, { size: V(64, 56), color: UI.bpStroke() });
  if (t > tN) { seg(g, [[E.W * 0.26, E.H * 0.38], [E.W * 0.74, E.H * 0.38]], 8 * clamp((t - tN) / 0.2), ui.accent); label(g, t, 'NOT ANYMORE', E.W / 2, E.H * 0.6, tN + 0.15, { size: V(90, 76), color: ui.accent, font: FONTS.title }); }
} });
registerShot('s028', { draw(g, t, info) {
  const slam = 0.25, fl = t > slam && t < slam + 0.12;
  const r = room(g, t > slam + 0.15 ? 0 : t, push(t, info, { z0: 1.15, z1: 1.18, x0: -160, x1: -160, y0: 60, y1: 60 }), { x: E.W / 2 - V(300, 120), dy: 0, pose: t > slam ? POSES.handsOnHead : POSES.relaxed, facing: -1, expr: t > slam ? 'shocked' : 'neutral', look: [-1, 0], dust: false, blink: t > slam ? false : undefined });

  if (t > slam + 0.15) slowTint(g, 0.3);
  if (fl) veil(g, '#ffffff', 0.5);
  label(g, t, 'SLAM!', E.W * 0.22, E.H * 0.3, slam, { size: V(90, 80), color: S().ui.accent, font: FONTS.title });
} });
registerShot('s029', { draw(g, t, info) {
  const r = kitchen(g, t > 0.55 ? 0 : t, push(t, info, { z0: 1.5, z1: 1.55, x0: 100, x1: 100, y0: 160, y1: 165 }), { mood: 'interiorWarm' });
  const p = clamp(t / 0.55), fy = lerp(r.GY - 330, r.GY - 120, ease.in(Math.min(p, 1)));
  layer(g, push(t, info, { z0: 1.5, z1: 1.55, x0: 100, x1: 100, y0: 160, y1: 165 }), 1, (g) => { plate(g, E.W / 2 + 120, fy, 1.6, p * 0.9); if (t > 0.55) { FX.sparkle(g, E.W / 2 + 120, fy, 24, '#ffffff', 0.6); } });
  if (t > 0.55) { slowTint(g, 0.3); FX.drops(g, t, { count: 20, rMax: 4, drift: 1, color: '#cfe0ff' }); }
} });
registerShot('s030', { draw(g, t, info) {
  const H = 0.0, fz = t > 0.35;
  const r = road(g, fz ? 0 : t, push(t, info, { z0: 1.3, z1: 1.34, x0: -100, x1: -100, y0: 140, y1: 140 }), { mood: 'dusk' });
  layer(g, push(t, info, { z0: 1.3, z1: 1.34, x0: -100, x1: -100, y0: 140, y1: 140 }), 1, (g) => {
    drawFigure(g, { x: E.W / 2 - V(220, 120), y: r.GY, s: 1.2, facing: 1, outfit: LEO, pose: fz ? { ...walkPose(0.7 * Math.PI * 2) } : walkPose(t * 1.6 * Math.PI * 2), expr: fz ? 'shocked' : 'neutral', look: [1, -0.2], rim: rimOf(r.M, [0.6, -0.8]), blink: false });
  });
  layer(g, push(t, info, { z0: 1.3, z1: 1.34, x0: -100, x1: -100, y0: 140, y1: 140 }), 0.85, (g) => { const cx = E.W / 2 + V(300, 200) - (fz ? 0.35 : t) * 600; FX.lensStreak(g, cx, r.laneY + 20, 300, '#ffe6b0', 0.5, 6); glow(g, cx, r.laneY + 20, 120, '#ffe6b0', 0.7); });
  if (t < 0.4) label(g, t, 'HONK!', E.W * 0.72, E.H * 0.3, 0.0, { size: V(80, 76), color: S().ui.accent, font: FONTS.title });
  if (fz) { slowTint(g, 0.32); rainDrops(g, t, { count: 30 }); }
} });
registerShot('s031', { draw(g, t, info) { leoFace(g, t, info, { expr: 'shocked', face: t > 0.4 ? HELD : { mouth: 'o' }, bg: (g2, tt, cam) => road(g2, tt, cam, { mood: 'dusk' }), zoom: 0.1, noBlink: true }); if (t > 0.6) slowTint(g, 0.3 * clamp((t - 0.6) / 0.4)); } });
registerShot('s032', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 2.2, z1: 1.0, ease: ease.out }));
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H / 2, count: 60, a: 0.35 * (1 - clamp(t / 0.8)), inner: 200 });
} });
registerShot('s033', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }); voidSpace(g, t, cam);
  const day = Math.max(1, Math.round(365 * ease.inOut(prog(t, 0.0, info.dur - 0.1))));
  layer(g, cam, 1, (g) => { const x = E.W / 2, y = E.H * 0.48, w = V(360, 320), h = V(420, 380);
    for (let i = 3; i >= 1; i--) { rr(g, x - w / 2 + i * 10, y - h / 2 + i * 10, w, h, 16); g.fillStyle = alpha('#efe6d2', 0.25); g.fill(); }
    rr(g, x - w / 2, y - h / 2, w, h, 16); g.fillStyle = '#efe6d2'; g.fill(); rr(g, x - w / 2, y - h / 2, w, 80, 16); g.fillStyle = '#c0443a'; g.fill();
    text(g, 'DAY', x, y - h / 2 + 42, { size: 40, color: '#fff', font: FONTS.ui, weight: 900, spacing: 6 }); text(g, String(day), x, y + 40, { size: V(170, 150), color: '#2a2230', font: FONTS.title, weight: 700 }); });
  label(g, t, '+1 YEAR', E.W / 2, E.H * 0.84, 0.3, { size: V(56, 56) });
} });
registerShot('s034', { draw(g, t, info) {
  room(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: 260, x1: 270, y0: 160, y1: 165 }), { expr: 'neutral', pose: breathe(POSES.sit, t) });
  label(g, t, 'AGE 15', E.W * 0.26, E.H * 0.6, 0.15, { size: V(80, 80), font: FONTS.title, color: S().ui.cream });
} });
registerShot('s035', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), t52 = wt(info, 'fifty-two', 1.6) - 0.6;
  const v = Math.round(lerp(15, 52, ease.inOut(prog(t, 0.6, Math.max(1.0, t52 + 0.6)))));
  text(g, 'BODY', E.W * 0.28, E.H * 0.3, { size: V(44, 44), color: c, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, '15', E.W * 0.28, E.H * 0.52, { size: V(200, 160), color: ui.cream, font: FONTS.title, weight: 700 });
  text(g, 'MIND', E.W * 0.72, E.H * 0.3, { size: V(44, 44), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, String(v), E.W * 0.72, E.H * 0.52, { size: V(200, 160), color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.6) });
  text(g, 'YEARS LIVED', E.W / 2, E.H * 0.78, { size: V(44, 44), color: c, font: FONTS.ui, weight: 900, spacing: 8 });
  seg(g, [[E.W / 2, E.H * 0.22], [E.W / 2, E.H * 0.64]], 3, alpha(c, 0.4));
} });
registerShot('s036', { draw(g, t, info) {
  const M = mood('dusk'), cam = { z: 1.06 - 0.06 * ease.inOut(t / info.dur), y: -20 * t };
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); FX.clouds(g, { y: 0, h: E.H * 0.4, count: 10, color: '#1a1424', a: 0.4, seed: 12 }); });
  layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -200, y: E.H * V(0.76, 0.66), w: E.W + 400, maxH: V(300, 500), color: shade(M.wall, -0.35), windowColor: alpha(M.practical, 0.8), seed: 21 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = shade(M.dark, -0.2); g.fillRect(-E.W, E.H * V(0.76, 0.66), E.W * 3, E.H); });
  FX.rain(g, t, { a: 0.18, count: 160 }); FX.drops(g, t, { count: 30, rMax: 6, drift: 1.5, color: '#cfe0ff' });
  UI.titleCard(g, t, { lines: ['WHAT IF ONE SECOND', 'FELT LIKE A YEAR?'], sub: 'PART 2', dur: info.dur, y: E.H * V(0.4, 0.38) });
} });
