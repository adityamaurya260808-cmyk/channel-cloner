// shots/03_price.js: the park bench and Jake (s069-s073), the sky (s074-s080), the price (s081-s099).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, faceShot, slowTint, popIn, label, stamp } from '../lib.js';
import { bedroom } from '../sets/indoor.js';
import { park } from '../sets/outdoor.js';
import { voidSpace } from '../sets/extra.js';
import { LEO, NOVA, JAKE } from '../cast.js';
import { HELD } from '../p1kit.js';
import { streetScene, mindVoid, voidFace, whisper, voiceRings, chapter, benchPair, skyScene, NS } from '../k2.js';

// ---------- park bench ----------
const BX = () => E.W / 2 - V(60, 0);
function parkScene(g, t, cam, o = {}) {
  const r = park(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { benchPair(g, t, r.GY, BX(), r.M, o); o.extra?.(g, r); });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
  return r;
}
const parkBg = (o = {}) => (g2, tt, cam) => parkScene(g2, tt, cam, o);
registerShot('s069', { draw(g, t, info) {
  parkScene(g, t, push(t, info, { z0: 1.0, z1: 1.1, y0: 40, y1: 70 }), { leoExpr: 'smile', novaExpr: 'smile', leoLook: [1, 0], novaLook: [-1, 0] });
  label(g, t, 'THE REAL WORLD', E.W / 2, V(140, 220), 0.3, { size: V(46, 46), color: S().ui.cream });
} });
registerShot('s070', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, z1: 1.18, y0: 90, y1: 95 }), jx = lerp(E.W + 200, BX() + V(520, 380), ease.out(prog(t, 0, 1.3))), stop = t > 1.3;
  parkScene(g, t, cam, { leoExpr: 'smile', novaExpr: 'smile', extra: (g, r) => drawFigure(g, { x: jx, y: r.GY + 30, s: 1.2, facing: -1, outfit: JAKE, pose: stop ? POSES.relaxed : walkPose(t * 1.7 * Math.PI * 2), expr: stop ? 'surprised' : 'neutral', look: [-1, 0], rim: rimOf(r.M, [-0.6, -0.8]), blink: blinkAt(t, 3) }) });
  label(g, t, 'JAKE', E.W * 0.82, E.H * 0.24, 0.3, { size: V(60, 56), color: S().ui.cream });
} });
registerShot('s071', { draw(g, t, info) {
  const r = park(g, t, push(t, info, { z0: 1.6, z1: 1.65, x0: 380, x1: 390, y0: 180, y1: 182 }), { mood: 'golden' });
  layer(g, push(t, info, { z0: 1.6, z1: 1.65, x0: 380, x1: 390, y0: 180, y1: 182 }), 1, (g) => drawFigure(g, { x: E.W / 2 + 380, y: r.GY + 30, s: 1.2, facing: -1, outfit: JAKE, pose: t > 0.9 ? { ...POSES.point } : POSES.shrug, expr: 'surprised', look: [-1, 0.1], talk: talk(info), rim: rimOf(r.M, [-0.6, -0.8]), blink: blinkAt(t, 3) }));
} });
registerShot('s072', { draw(g, t, info) { faceShot(g, t, info, { M: mood('golden'), bg: parkBg(), bgCam: { z: 1.6, x: -250, y: 120 }, outfit: LEO, expr: 'smile', side: 1, dx: -V(160, 0), look: [1, 0], talk: () => talk(info) }); } });
registerShot('s073', { draw(g, t, info) {
  const tO = wt(info, 'old', 1.4) - 0.1;
  faceShot(g, t, info, { M: mood('golden'), bg: parkBg(), bgCam: { z: 1.6, x: 250, y: 120 }, outfit: NOVA, expr: t > tO ? 'smirk' : 'smile', side: -1, dx: V(160, 0), look: [-1, 0] });
  label(g, t, '200 YEARS', E.W * 0.24, E.H * 0.3, tO, { size: V(70, 64), font: FONTS.title });
} });

// ---------- the sky ----------
registerShot('s074', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); skyScene(g, t, { z: 1.1, x: 0, y: lerp(60, -420, p) }); } });
registerShot('s075', { draw(g, t, info) { skyScene(g, t, push(t, info, { z0: 0.95, z1: 1.0, y0: -260, y1: -300 })); } });
registerShot('s076', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('night'), bg: (g2, tt, cam) => skyScene(g2, tt, cam, { bench: false }), bgCam: { z: 1.2, x: 0, y: -300 }, outfit: NOVA, expr: 'awe', side: -1, dx: V(260, 0), dy: 60, look: [0, -1], rimColor: '#9fb8ff', zoom: 0.04, tilt: -0.12,
    behind: (g) => { for (let i = 0; i < 9; i++) { const x = E.W * (0.08 + (i * 0.137) % 0.5), y = E.H * (0.12 + ((i * 0.29) % 0.45)), at = 1.2 + i * 0.35; if (t > at) { FX.sparkle(g, x, y, 22, '#ffffff', 0.9); ring(g, x, y, 26, 2, alpha(S().ui.gold, 0.8 * clamp((t - at) / 0.3))); } } } });
  const n = Math.round(lerp(3980, 4060, ease.inOut(prog(t, 1.0, info.dur))));
  UI.badge(g, { str: '★ ' + n.toLocaleString('en-US'), a: ease.out(prog(t, 1.0, 1.5)) });
} });
registerShot('s077', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), sx = E.W * 0.12, sy = E.H * 0.3, ex = E.W * 0.86, ey = E.H * 0.66, p = ease.inOut(prog(t, 0.4, 3.2));
  FX.sparkle(g, sx, sy, 60, '#ffffff', 1); glow(g, sx, sy, 160, '#cfe0ff', 0.5); text(g, 'STAR', sx, sy + 110, { size: 36, color: c, font: FONTS.ui, weight: 900, spacing: 4 });
  circle(g, ex, ey, 70, '#3a7ae0'); ring(g, ex, ey, 70, 4, c); text(g, 'EARTH', ex, ey + 120, { size: 36, color: c, font: FONTS.ui, weight: 900, spacing: 4 });
  g.setLineDash([16, 14]); seg(g, [[sx + 60, sy + 20], [lerp(sx + 60, ex - 80, p), lerp(sy + 20, ey - 30, p)]], 4, ui.gold); g.setLineDash([]); glow(g, lerp(sx + 60, ex - 80, p), lerp(sy + 20, ey - 30, p), 60, ui.gold, 0.9);
  label(g, t, 'HUNDREDS OF YEARS', E.W * 0.5, E.H * 0.38, wt(info, 'hundreds', 2.4) - 0.1, { size: V(60, 54) });
  label(g, t, 'TO REACH YOUR EYES', E.W * 0.5, E.H * 0.5, wt(info, 'hundreds', 2.4) + 0.3, { size: V(40, 38), color: ui.cream });
} });
registerShot('s078', { draw(g, t, info) {
  skyScene(g, t, push(t, info, { z0: 1.2, z1: 1.25, y0: -40, y1: -50 }), { pair: { ink: '#06070f' } });
  whisper(g, t, 'We’re both looking at the past.', { at: 0.1, y: E.H * 0.2, size: V(52, 44), color: '#cfe0ff' });
} });
registerShot('s079', { draw(g, t, info) { faceShot(g, t, info, { M: mood('night'), bg: (g2, tt, cam) => skyScene(g2, tt, cam), bgCam: { z: 1.4, x: -200, y: -100 }, outfit: LEO, expr: 'awe', side: 1, dx: -V(200, 0), look: [0.6, -0.6], rimColor: '#9fb8ff', talk: () => talk(info) }); } });
registerShot('s080', { draw(g, t, info) {
  skyScene(g, t, push(t, info, { z0: 1.0, z1: 1.04, y0: -200, y1: -220 }), { bench: true });
  veil(g, '#03040c', 0.35); const ui = S().ui, n = Math.round(4112 * ease.out(prog(t, 0.1, 2.2)));
  text(g, n.toLocaleString('en-US'), E.W / 2, E.H * 0.42, { size: V(220, 160), color: ui.gold, font: FONTS.title, weight: 700, glow: 40, glowColor: alpha(ui.gold, 0.6) });
  label(g, t, 'STARS COUNTED', E.W / 2, E.H * 0.62, 0.4, { size: V(52, 50), color: ui.cream });
} });

// ---------- the price ----------
registerShot('s081', { draw(g, t, info) {
  mindVoid(g, t, push(t, info, { z0: 1.12, z1: 1.16, y0: 80, y1: 82 }), { leo: false, novaX: E.W / 2, novaExpr: 'sleepy', novaPose: { ...POSES.sad }, color: '#8a9ad8' });
  UI.bigLine(g, t, { str: 'THE PRICE', dur: info.dur + 0.4, size: V(130, 100), color: S().ui.accent });
} });
registerShot('s082', { draw(g, t, info) { faceShot(g, t, info, { M: mood('golden'), bg: parkBg({ novaExpr: 'sleepy' }), bgCam: { z: 1.6, x: 250, y: 120 }, outfit: NOVA, expr: 'sleepy', side: -1, dx: V(160, 0), look: [-0.5, 0.4], tilt: 0.06, blinkP: 1.6 }); } });
registerShot('s083', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.7, z1: 1.74, x0: 100, x1: 105, y0: 190, y1: 192 });
  parkScene(g, t, cam, { novaPose: { ...POSES.sitBack, head: [-14, -150], sh: [-10, -122] }, novaExpr: 'sleepy', leoExpr: 'worried', leoLook: [1, 0] });
} });
function crowdRush(g, t, cam, speed, o = {}) {
  const r = streetScene(g, t, cam, { leo: false, nova: false, busX: null, rain: false, extra: (g, r) => {
    for (let i = 0; i < 9; i++) { const dir = i % 2 ? 1 : -1, x = ((t * speed * dir * 400 + i * 380) % (E.W + 600) + E.W + 600) % (E.W + 600) - 300; drawFigure(g, { x, y: r.GY + 10 + (i % 3) * 18, s: 1.1, facing: dir, outfit: { top: 'none', head: i % 3 ? 'none' : 'cap' }, pose: walkPose(t * 2.4 * Math.PI * 2 + i), expr: 'neutral', rim: { color: '#9fc4ff', dir: [0.6, -0.8] }, blink: false, alpha: 0.95 }); }
    drawFigure(g, { x: E.W / 2, y: r.GY + 40, s: 1.25, facing: 1, outfit: NOVA, pose: { ...POSES.handsOnHead }, expr: o.expr || 'scared', look: [0, 0], rim: { color: '#9fc4ff', dir: [0.6, -0.8] }, blink: false });
    FX.lensStreak(g, (t * 2200) % (E.W + 800) - 400, r.laneY + 20, 500, '#ffe6b0', 0.4, 8);
  } });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.5, count: 30, a: 0.18, inner: 380 });
  return r;
}
registerShot('s084', { draw(g, t, info) { crowdRush(g, t, push(t, info, { z0: 1.15, z1: 1.25, y0: 110, y1: 120 }), 1.4); label(g, t, 'TOO FAST', E.W * 0.78, E.H * 0.24, wt(info, 'fast', 3.0) - 0.1, { size: V(64, 60), color: S().ui.accent, font: FONTS.title }); } });
registerShot('s085', { draw(g, t, info) {
  const s = Math.sin(t * 60) * 8 * (1 - clamp(t / 0.6)); crowdRush(g, t, { z: 1.3, x: s, y: 130 + s }, 1.8);
  FX.rings(g, E.W / 2, E.H * 0.45, t, { count: 4, r0: 120, r1: 900, speed: 1.4, color: '#ff8a6a', a: 0.4 });
  label(g, t, 'TOO LOUD', E.W / 2, E.H * 0.2, 0.0, { size: V(90, 80), color: S().ui.accent, font: FONTS.title });
} });
registerShot('s086', { draw(g, t, info) { faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => crowdRush(g2, tt, cam, 1.6), bgCam: { z: 1.4, x: 0, y: 100 }, outfit: NOVA, expr: 'scared', side: -1, dx: V(80, 0), look: [0.2, 0.1], noBlink: true, zoom: 0.12, drift: Math.sin(t * 40) * 2 }); label(g, t, 'TOO SCARY', E.W * 0.22, E.H * 0.24, 0.1, { size: V(64, 60), color: S().ui.accent, font: FONTS.title }); } });
function novaDrift(g, t, info, o = {}) {
  const cam = push(t, info, { z0: o.z0 ?? 1.2, z1: o.z1 ?? 1.25, y0: o.y0 ?? 100, y1: o.y1 ?? 105 });
  const r = mindVoid(g, t, cam, { leo: false, novaX: E.W / 2, novaExpr: o.expr || 'sleepy', novaPose: o.pose || breathe(POSES.stand, t, 1, 1.2), novaLook: [0, 0.2], color: o.color || '#8a9ad8', s: o.s });
  return r;
}
function yearsBadge(g, t, from, to, a, b) { const ui = S().ui, n = Math.round(lerp(from, to, ease.in(prog(t, a, b)))); UI.badge(g, { str: n + ' YEARS', a: 1, color: ui.gold }); }
registerShot('s087', { draw(g, t, info) { novaDrift(g, t, info, { expr: 'sleepy' }); yearsBadge(g, t, 200, 230, 0.2, info.dur); slowTint(g, 0.25); } });
registerShot('s088', { draw(g, t, info) { novaDrift(g, t, info, { expr: 'sleepy', z0: 1.25, z1: 1.3 }); yearsBadge(g, t, 230, 300, 0.0, info.dur); slowTint(g, 0.25); } });
registerShot('s089', { draw(g, t, info) { novaDrift(g, t, info, { z0: 1.0, z1: 1.04, y0: 40, y1: 40, expr: 'neutral' }); } });
registerShot('s090', { draw(g, t, info) { novaDrift(g, t, info, { z0: 1.5, z1: 1.55, y0: 160, y1: 160, expr: 'smile' }); label(g, t, 'QUIET', E.W * 0.75, E.H * 0.3, wt(info, 'quiet', 0.8) - 0.1, { size: V(64, 60), color: S().ui.cream }); } });
registerShot('s091', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'happy', look: [0, 0], dx: 0, color: '#8a9ad8' }); label(g, t, 'SAFE', E.W * 0.82, E.H * 0.3, 0.05, { size: V(70, 64), color: S().ui.cream }); } });
registerShot('s092', { draw(g, t, info) { novaDrift(g, t, info, { z0: 1.4, z1: 0.75, y0: 120, y1: -40, expr: 'neutral', s: 0.9 }); label(g, t, 'EMPTY', E.W / 2, E.H * 0.2, 0.3, { size: V(70, 64), color: '#8a9ad8' }); } });
registerShot('s093', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke();
  const cw = V(1300, 940), ch = V(560, 760), cx = (E.W - cw) / 2, cy = (E.H - ch) / 2, a = ease.out(prog(t, 0, 0.4));
  g.save(); g.globalAlpha *= a; rr(g, cx, cy, cw, ch, 28); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 2.5; g.stroke();
  text(g, 'AFTER LONG ISOLATION', cx + 70, cy + 90, { size: V(46, 46), color: ui.text, font: FONTS.ui, weight: 900, align: 'left' });
  text(g, 'EXPEDITIONS · SPACE MISSIONS · HOSPITAL STAYS', cx + 72, cy + 136, { size: V(22, 24), color: ui.sub, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  const items = [['NOISE', 'feels too loud', 'noise'], ['CROWDS', 'feel overwhelming', 'crowds'], ['PACE', 'everything feels rushed', 'adjust']];
  items.forEach(([h, s2, w], i) => { const at = wt(info, w, 1.5 + i * 1.2) - 0.1, k = popIn(t, at); if (k <= 0) return; const y = cy + 230 + i * 100; g.save(); g.translate(cx + 110, y); g.scale(k, k); circle(g, 0, 0, 22, ui.accent); g.restore(); text(g, h, cx + 160, y + 4, { size: V(40, 40), color: ui.text, font: FONTS.ui, weight: 900, align: 'left' }); text(g, s2, cx + 420, y + 4, { size: V(34, 34), color: ui.sub, font: FONTS.ui, weight: 700, align: 'left' }); });
  g.restore();
  label(g, t, 'IT TAKES TIME TO ADJUST', E.W / 2, cy + ch + 70, 4.6, { size: V(40, 40), color: ui.gold });
} });
registerShot('s094', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'sad', look: [-0.3, 0.4], talk: () => talk(info), color: '#8a9ad8', tilt: 0.05 }); } });
registerShot('s095', { draw(g, t, info) {
  backdrop(g, ['#020205', '#05060c']); voiceRings(g, t, E.W / 2, E.H / 2, { r0: 100, r1: 600, a: 0.12, color: '#8a9ad8' });
  whisper(g, t, 'stay.', { at: 0.0, size: V(150, 120), color: '#8a9ad8' });
} });
registerShot('s096', { draw(g, t, info) { faceShot(g, t, info, { M: mood('night'), bg: (g2, tt, cam) => bedroom(g2, tt, cam, { mood: 'night' }), bgCam: { z: 1.5, x: 200, y: -150 }, outfit: LEO, expr: 'worried', side: -1, dx: -V(120, 0), look: [-0.4, 0.3] }); } });
function lockIcon(g, x, y, s, c) { rr(g, x - s * 0.6, y - s * 0.1, s * 1.2, s, s * 0.15); g.fillStyle = c; g.fill(); g.strokeStyle = c; g.lineWidth = s * 0.16; g.beginPath(); g.arc(x, y - s * 0.1, s * 0.4, Math.PI, 0); g.stroke(); circle(g, x, y + s * 0.35, s * 0.12, S().ui.bpBg); }
registerShot('s097', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W * 0.32, y = E.H * 0.5;
  for (const s of [-1, 1]) { g.save(); g.translate(x + s * 70, y); g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, 60, 120, s * 0.15, 0, 7); g.stroke(); g.fillStyle = alpha(ui.gold, 0.5); g.beginPath(); g.ellipse(0, 0, 60, 120, s * 0.15, 0, 7); g.fill(); g.restore(); }
  seg(g, [[x, y - 180], [x, y - 90]], 6, c);
  const tC = wt(info, "can't", 2.0) - 0.1, k = popIn(t, tC); if (k > 0) { g.save(); g.translate(x, y - 10); g.scale(k, k); lockIcon(g, 0, 0, 90, ui.accent); g.restore(); }
  label(g, t, 'WHAT IF', E.W * 0.7, E.H * 0.38, 0.2, { size: V(56, 52), color: ui.cream });
  label(g, t, 'YOU CAN’T', E.W * 0.7, E.H * 0.5, tC, { size: V(70, 62), color: ui.accent, font: FONTS.title });
  label(g, t, 'BREATHE OUT?', E.W * 0.7, E.H * 0.62, tC + 0.3, { size: V(70, 62), color: ui.accent, font: FONTS.title });
} });
registerShot('s098', { draw(g, t, info) {
  const p = ease.inOut(prog(t, 0, info.dur));
  const r = mindVoid(g, t, { z: lerp(1.1, 0.85, p), x: 0, y: lerp(80, -20, p) }, { leo: false, novaX: E.W / 2 + p * 120, novaExpr: 'sleepy', novaPose: breathe(POSES.stand, t, 1, 1.2), novaA: 1 - p * 0.4, color: '#8a9ad8' });
  veil(g, '#020205', 0.25 * p);
} });
registerShot('s099', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'smile', face: { eyes: 'happy' }, look: [0, 0], dx: 0, color: '#6a5ab8', zoom: 0.1, veil: 0.5 }); slowTint(g, 0.3, 'rgba(120,80,255,1)'); } });
