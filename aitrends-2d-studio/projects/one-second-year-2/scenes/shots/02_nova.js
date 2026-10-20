// shots/02_nova.js: a voice in the frozen year (s037-s052), PLUS (s053-s062), MINUS (s063-s068).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, slowTint, popIn, label, stamp } from '../lib.js';
import { bedroom, market } from '../sets/indoor.js';
import { voidSpace } from '../sets/extra.js';
import { LEO, NOVA } from '../cast.js';
import { mindVoid, voidFace, whisper, voiceRings, thoughtLink, chapter, bookIcon, noteIcon, chessBoard, piece, catScene, VX } from '../k2.js';

const GOLD = () => S().ui.gold;
// ---------- the voice ----------
registerShot('s037', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.12, y0: 40, y1: 60 });
  const r = mindVoid(g, t, cam, { leoX: E.W / 2, nova: false, leoExpr: 'neutral', leoLook: [0, 0] });
  const tN = wt(info, 'new', 3.4) - 0.2; if (t > tN) FX.rings(g, E.W * 0.88, E.H * 0.3, t - tN, { count: 2, r0: 10, r1: 220, speed: 0.8, color: GOLD(), a: 0.5 });
  glow(g, E.W * 0.88, E.H * 0.3, 60, GOLD(), 0.3 + 0.3 * Math.sin(t * 6));
  slowTint(g, 0.2);
} });
registerShot('s038', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.36, y0: 120, y1: 125 });
  const r = mindVoid(g, t, cam, { leoX: E.W / 2 - 200, nova: false, leoExpr: 'surprised', leoLook: [1, -0.2] });
  voiceRings(g, t, E.W / 2 + 500, E.H * 0.35, { r0: 20, r1: 600, a: 0.45 });
} });
registerShot('s039', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); voiceRings(g, t, E.W / 2, E.H / 2, { r0: 100, r1: 700, a: 0.2 });
  whisper(g, t, 'Hello?', { at: 0.0, size: V(120, 100) });
} });
registerShot('s040', { draw(g, t, info) { voidFace(g, t, info, LEO, { expr: 'awe', noBlink: true, look: [0.6, -0.3], zoom: 0.1 }); whisper(g, t, 'Is someone… actually there?', { at: 0.2, y: E.H * 0.2, size: V(56, 48) }); } });
registerShot('s041', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.55, x0: 100, x1: 100, y0: 160, y1: 160 }), r = market(g, 0, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 + 100, y: r.GY, s: 1.2, facing: 1, outfit: LEO, pose: { ...POSES.holdFront }, expr: 'worried', look: [1, 0], rim: rimOf(r.M, [-0.6, -0.8]), blink: false }));
  const k = clamp(t / 0.8); for (const s of [-1, 1]) { const x = E.W / 2 + 108 + s * 60, y = E.H * 0.3; seg(g, [[x, y], [x + s * 30 * k, y - 10]], 4, alpha('#cfe0ff', 0.5)); }
  slowTint(g, 0.32); FX.drops(g, t, { count: 30, rMax: 5, drift: 1, color: '#cfe0ff' });
} });
registerShot('s042', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.55, x0: -150, x1: -150, y0: 160, y1: 160 }), r = bedroom(g, 0, cam, { mood: 'interiorCool' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 150, y: r.GY, s: 1.2, facing: -1, outfit: NOVA, pose: { ...POSES.think }, expr: 'surprised', look: [-1, 0], rim: rimOf(r.M, [0.6, -0.8]), blink: false }));
  slowTint(g, 0.32); FX.drops(g, t, { count: 30, rMax: 5, drift: 1, color: '#cfe0ff' });
  label(g, t, 'THREE STREETS AWAY', E.W * 0.7, E.H * 0.22, 0.3, { size: V(40, 40), color: S().ui.cream });
} });
registerShot('s043', { draw(g, t, info) {
  const tT = wt(info, 'think', 1.4) - 0.2, k = ease.out(prog(t, tT, tT + 0.8));
  mindVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 95 }), { link: k, leoExpr: 'awe', novaExpr: 'surprised' });
} });
registerShot('s044', { draw(g, t, info) {
  const v = VX(); mindVoid(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: v.nova - E.W / 2, x1: v.nova - E.W / 2 - 20, y0: 180, y1: 182 }), { link: 0.6, novaExpr: 'smile', novaPose: { ...POSES.wave } });
  label(g, t, 'NOVA', E.W * 0.72, E.H * 0.42, wt(info, 'nova', 0.8) - 0.1, { size: V(110, 100), font: FONTS.title, color: '#5fe0d0' });
} });
registerShot('s045', { draw(g, t, info) {
  const v = VX(); mindVoid(g, t, push(t, info, { z0: 1.6, z1: 1.64, x0: v.nova - E.W / 2 - 20, x1: v.nova - E.W / 2 - 30, y0: 180, y1: 182 }), { link: 0.6, novaExpr: 'smile' });
  label(g, t, 'NOVA', E.W * 0.72, E.H * 0.42, -1, { size: V(110, 100), font: FONTS.title, color: '#5fe0d0' });
  label(g, t, 'AGE 16', E.W * 0.72, E.H * 0.56, 0.1, { size: V(60, 56), color: S().ui.cream });
} });
function house(g, x, y, s, c, lit) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 5; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-60, -80); g.lineTo(0, -130); g.lineTo(60, -80); g.lineTo(60, 0); g.closePath(); g.stroke(); if (lit) glow(g, 0, -60, 120, lit, 0.5); rr(g, -18, -50, 36, 50, 4); g.stroke(); g.restore(); }
registerShot('s046', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, x0 = E.W * 0.22, x1 = E.W * 0.78, y = E.H * 0.6;
  for (let i = 0; i < 3; i++) { const x = lerp(x0 + 160, x1 - 160, (i + 0.5) / 3); g.fillStyle = alpha(c, 0.18); g.fillRect(x - 40, E.H * 0.2, 80, E.H * 0.6); seg(g, [[x, E.H * 0.2], [x, E.H * 0.8]], 2, alpha(c, 0.4)); const k = popIn(t, 0.3 + i * 0.25); if (k > 0) text(g, String(i + 1), x, E.H * 0.18, { size: 46 * k, color: ui.gold, font: FONTS.title, weight: 700 }); }
  house(g, x0, y, 1.3, LEO.color, LEO.color); house(g, x1, y, 1.3, '#5fe0d0', '#5fe0d0');
  text(g, 'LEO', x0, y + 60, { size: 40, color: c, font: FONTS.ui, weight: 900, spacing: 3 }); text(g, 'NOVA', x1, y + 60, { size: 40, color: c, font: FONTS.ui, weight: 900, spacing: 3 });
  const p = ease.inOut(prog(t, 0.2, info.dur)); g.setLineDash([12, 12]); g.strokeStyle = ui.gold; g.lineWidth = 4; g.beginPath(); g.moveTo(x0 + 80, y - 80); g.lineTo(lerp(x0 + 80, x1 - 80, p), y - 80); g.stroke(); g.setLineDash([]);
} });
registerShot('s047', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'smile', look: [-0.6, 0] }); } });
registerShot('s048', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  text(g, 'SAME POWER', E.W / 2, E.H * 0.3, { size: V(48, 48), color: UI.bpStroke(), font: FONTS.ui, weight: 900, spacing: 6 });
  stamp(g, t, '6 YEARS', E.W / 2, E.H * 0.56, wt(info, 'years', 0.6) - 0.15, V(130, 110), ui.gold, -0.06);
} });
registerShot('s049', { draw(g, t, info) {
  const v = VX(); mindVoid(g, t, push(t, info, { z0: 1.6, z1: 1.64, x0: v.leo - E.W / 2 + 140, x1: v.leo - E.W / 2 + 150, y0: 180, y1: 182 }), { link: 0.8, leoExpr: 'thinking', leoPose: { ...POSES.think } });
  whisper(g, t, 'How many years have you lived in here?', { at: 0.1, y: E.H * 0.18, size: V(48, 40), color: S().ui.cream });
} });
registerShot('s050', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'smirk', look: [-0.8, 0], talk: () => 0.4 + 0.3 * Math.sin(t * 18) }); } });
registerShot('s051', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, n = Math.round(200 * ease.out(prog(t, 0.0, 0.9)));
  text(g, 'YEARS LIVED INSIDE', E.W / 2, E.H * 0.26, { size: V(44, 44), color: UI.bpStroke(), font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, String(n), E.W / 2, E.H * 0.54, { size: V(260, 200), color: ui.gold, font: FONTS.title, weight: 700, glow: 40, glowColor: alpha(ui.gold, 0.6) });
  const t2 = wt(info, 'two', 1.2, info.shot.start + 0.6); if (t > t2) FX.rings(g, E.W / 2, E.H * 0.54, t - t2, { count: 2, r0: 200, r1: 500, speed: 1, color: ui.gold, a: 0.4 });
} });
registerShot('s052', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  [['LEO', 52, LEO.color], ['NOVA', 200, '#5fe0d0']].forEach(([n, v, c], i) => { const y = E.H * (0.46 + i * 0.18), x = E.W * 0.24, w = E.W * 0.56 * (v / 200) * ease.out(prog(t, 0.1 + i * 0.25, 0.9 + i * 0.25)); text(g, n, x - 30, y, { size: V(44, 44), color: c, font: FONTS.ui, weight: 900, align: 'right' }); rr(g, x, y - 34, Math.max(4, w), 68, 34); g.fillStyle = alpha(c, 0.85); g.fill(); text(g, String(Math.round(v * clamp(w / (E.W * 0.56 * v / 200)))), x + w + 30, y, { size: V(52, 50), color: c, font: FONTS.title, weight: 700, align: 'left' }); });
  label(g, t, '“A LOT”', E.W * 0.3, E.H * 0.3, 0.6, { size: V(56, 52), color: ui.cream });
} });

// ---------- PLUS ----------
registerShot('s053', { draw(g, t, info) {
  const k = 0.6 + 0.4 * ease.out(prog(t, 0.6, 2.0));
  mindVoid(g, t, push(t, info, { z0: 1.12, z1: 1.2, y0: 80, y1: 90 }), { link: k * 1.3, leoExpr: 'happy', novaExpr: 'happy', color: '#ffd28a' });
  chapter(g, t, 'PLUS', '#7ae07a');
  label(g, t, 'NOT SILENT', E.W / 2, E.H * 0.2, wt(info, 'silent', 3.0) - 0.1, { size: V(60, 56) });
} });
function topic(g, t, at, x, y, fn) { const k = popIn(t, at); if (k <= 0) return; g.save(); g.translate(x, y + Math.sin(t * 2 + x) * 8); g.scale(k, k); fn(g); g.restore(); }
registerShot('s054', { draw(g, t, info) {
  const r = mindVoid(g, t, push(t, info, { z0: 1.12, z1: 1.16, y0: 80, y1: 82 }), { link: 1, leoExpr: 'smile', novaExpr: 'happy', leoTalk: 1 });
  const ui = S().ui; for (let i = 0; i < 5; i++) { const p = ((t * 0.5 + i / 5) % 1), x = lerp(VX().leo + 60, VX().nova - 60, i % 2 ? p : 1 - p), y = E.H * 0.42 - Math.sin(p * Math.PI) * 120 - i * 18; UI.bubble(g, x, y, { w: 90, h: 54, color: alpha(i % 2 ? '#5fe0d0' : '#ffb08a', 0.9) }); }
} });
registerShot('s055', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); glow(g, E.W / 2, E.H / 2, 400, GOLD(), 0.2);
  topic(g, t, 0.0, E.W / 2, E.H * 0.48, (g) => noteIcon(g, 0, 0, 2.2, GOLD()));
  label(g, t, 'MUSIC', E.W / 2, E.H * 0.8, 0.1, { size: V(60, 56), color: S().ui.cream });
} });
registerShot('s056', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); glow(g, E.W / 2, E.H / 2, 400, '#5fe0d0', 0.2);
  topic(g, t, 0.0, E.W / 2, E.H * 0.48, (g) => bookIcon(g, 0, 0, 2.2));
  label(g, t, 'BOOKS', E.W / 2, E.H * 0.8, 0.1, { size: V(60, 56), color: S().ui.cream });
} });
registerShot('s057', { draw(g, t, info) {
  UI.blueprint(g); const tK = wt(info, 'knock', 0.8) - 0.1, k = ease.inOut(prog(t, 0.2, tK + 0.2)), fall = ease.in(prog(t, tK + 0.2, tK + 0.8));
  catScene(g, t, E.W * 0.52, E.H * 0.6, 1.3, k, fall);
  label(g, t, 'WHY?', E.W * 0.8, E.H * 0.24, tK + 0.6, { size: V(80, 70), font: FONTS.title });
} });
registerShot('s058', { draw(g, t, info) {
  const r = mindVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 92 }), { link: 0.6, leoExpr: 'thinking', novaExpr: 'smirk', leoPose: { ...POSES.think }, novaPose: { ...POSES.crossArms },
    extra: (g, r) => { const cy = r.GY - 230, ui = S().ui, k = ease.out(prog(t, 0.2, 0.9)); g.save(); g.globalAlpha *= k; chessBoard(g, E.W / 2, cy, 360, t); const mv = ease.inOut(prog(t, 1.2, 1.8)); piece(g, E.W / 2 - 60 + mv * 50, cy + 10 - mv * 20, 0.7, alpha('#ffb08a', 0.95), true); piece(g, E.W / 2 + 70, cy - 30, 0.7, alpha('#5fe0d0', 0.95)); piece(g, E.W / 2 + 10, cy + 40, 0.6, alpha('#5fe0d0', 0.95)); g.restore(); } });
  label(g, t, 'NO BOARD', E.W / 2, E.H * 0.18, wt(info, 'board', 1.0) - 0.1, { size: V(52, 50), color: S().ui.cream });
} });
registerShot('s059', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 })); const cy = E.H * 0.6;
  chessBoard(g, E.W / 2, cy, 520, t); piece(g, E.W / 2 - 40, cy + 20, 1.2, '#ffb08a', true); piece(g, E.W / 2 + 120, cy - 30, 1.2, '#5fe0d0'); piece(g, E.W / 2 + 40, cy + 60, 1.0, '#5fe0d0');
  stamp(g, t, 'CHECKMATE', E.W / 2, E.H * 0.3, 0.15, V(110, 90), '#5fe0d0', -0.08);
} });
registerShot('s060', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, n = Math.round(1 + 9998 * Math.pow(ease.in(prog(t, 0.0, info.dur)), 2));
  text(g, 'NOVA WINS', E.W / 2, E.H * 0.3, { size: V(50, 50), color: '#5fe0d0', font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, n.toLocaleString('en-US'), E.W / 2, E.H * 0.54, { size: V(200, 150), color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.5) });
  text(g, 'LEO WINS', E.W / 2, E.H * 0.74, { size: V(36, 36), color: UI.bpStroke(), font: FONTS.ui, weight: 900, spacing: 4 }); text(g, '0', E.W / 2, E.H * 0.84, { size: V(60, 56), color: ui.accent, font: FONTS.title, weight: 700 });
} });
registerShot('s061', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'smirk', look: [-0.8, 0.1], talk: () => talk(info) }); } });
registerShot('s062', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  text(g, '100', E.W / 2, E.H * 0.46, { size: V(240, 180), color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.6), alpha: clamp(popIn(t, 0.1)) });
  label(g, t, 'YEARS OF PRACTICE', E.W / 2, E.H * 0.7, 0.35, { size: V(56, 52), color: ui.cream });
} });

// ---------- MINUS ----------
registerShot('s063', { draw(g, t, info) {
  mindVoid(g, t, push(t, info, { z0: 1.12, z1: 1.18, y0: 80, y1: 86 }), { link: 0.45, leoExpr: 'neutral', novaExpr: 'sad', novaLook: [-1, 0.3], color: '#8a9ad8' });
  chapter(g, t, 'MINUS', '#ff6a5a');
} });
registerShot('s064', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), y = E.H * 0.5, x = E.W * 0.15, p = ease.inOut(prog(t, 0.1, info.dur));
  text(g, 'ONE FROZEN SECOND', E.W / 2, E.H * 0.3, { size: V(46, 44), color: c, font: FONTS.ui, weight: 900, spacing: 6 });
  const w = lerp(E.W * 0.25, E.W * 0.7, p); rr(g, x, y - 30, w, 60, 30); g.fillStyle = alpha(ui.gold, 0.6); g.fill(); seg(g, [[x + w + 20, y], [x + w + 70, y]], 6, ui.gold); poly(g, [[x + w + 90, y], [x + w + 66, y - 18], [x + w + 66, y + 18]], ui.gold);
  label(g, t, 'GETS LONGER', E.W / 2, E.H * 0.7, 0.4, { size: V(56, 52), color: ui.accent });
} });
function eqCard(g, t, info, right, color, sAt) {
  UI.blueprint(g); const ui = S().ui;
  text(g, '1 SECOND', E.W * 0.32, E.H * 0.5, { size: V(90, 70), color: ui.cream, font: FONTS.title, weight: 700 });
  text(g, '=', E.W * 0.52, E.H * 0.5, { size: V(90, 70), color: UI.bpStroke(), font: FONTS.title, weight: 700 });
  if (sAt == null) text(g, right, E.W * 0.72, E.H * 0.5, { size: V(90, 70), color, font: FONTS.title, weight: 700, glow: 24, glowColor: alpha(color, 0.5) });
}
registerShot('s065', { draw(g, t, info) { eqCard(g, t, info, '1 YEAR', S().ui.gold); label(g, t, 'BEFORE', E.W / 2, E.H * 0.24, 0.2, { size: V(44, 44), color: UI.bpStroke() }); } });
registerShot('s066', { draw(g, t, info) {
  const tT = wt(info, 'two', 1.6) - 0.1; eqCard(g, t, info, t < tT ? '1 YEAR' : '', S().ui.gold);
  if (t >= tT) { const k = popIn(t, tT); g.save(); g.translate(E.W * 0.72, E.H * 0.5); g.scale(k, k); text(g, '2 YEARS', 0, 0, { size: V(90, 70), color: S().ui.accent, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(S().ui.accent, 0.6) }); g.restore(); }
  label(g, t, 'NOW', E.W / 2, E.H * 0.24, 0.2, { size: V(44, 44), color: S().ui.accent });
} });
registerShot('s067', { draw(g, t, info) { voidFace(g, t, info, LEO, { expr: 'shocked', noBlink: true, zoom: 0.1, talk: () => talk(info) }); } });
registerShot('s068', { draw(g, t, info) { voidFace(g, t, info, NOVA, { expr: 'sad', look: [-0.6, 0.3], talk: () => talk(info), tilt: Math.sin(t * 4) * 0.03 }); } });
