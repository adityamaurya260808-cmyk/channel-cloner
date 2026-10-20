// shots/04_dinner.js: Sunday dinner with Nova (s100-s113), the countdowns (s114-s124).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, faceShot, slowTint, popIn, label } from '../lib.js';
import { kitchen, classroom, desk } from '../sets/indoor.js';
import { recordPlayer, heartIcon, notes } from '../sets/extra.js';
import { LEO, NOVA, GRANDPA } from '../cast.js';
import { kitchenScene, KX, dance } from '../p1kit.js';
import { pool } from '../sets/street2.js';
import { bigNum, soupBowl, whisper } from '../k2.js';

const M = () => mood('interiorWarm');
// kitchen with Nova: Grandpa left, Leo and Nova on the right (no table)
const NX = () => E.W / 2 + V(560, 300), LX = () => E.W / 2 + V(250, 150);
function dinner(g, t, cam, o = {}) {
  return kitchenScene(g, t, cam, { table: false, leo: false, gpPose: o.gpPose, gpExpr: o.gpExpr, gpFacing: o.gpFacing, notes: o.notes,
    extra: (g, r, s) => {
      const rim = rimOf(r.M, [-0.6, -0.8]);
      drawFigure(g, { x: o.leoX ?? LX(), y: r.GY, s, facing: -1, outfit: LEO, pose: o.leoPose || breathe(POSES.relaxed, t), expr: o.leoExpr || 'smile', look: o.leoLook, rim, blink: blinkAt(t, 3.2), talk: o.leoTalk || 0 });
      drawFigure(g, { x: o.novaX ?? NX(), y: r.GY, s, facing: -1, outfit: NOVA, pose: o.novaPose || breathe(POSES.relaxed, t, 1, 1.3), expr: o.novaExpr || 'neutral', look: o.novaLook, rim, blink: blinkAt(t, 3.7, 1), talk: o.novaTalk || 0 });
      o.extra?.(g, r, s);
    } });
}
const dinnerBg = (o = {}) => (g2, tt, cam) => dinner(g2, tt, cam, o);
const kface = (g, t, info, outfit, o) => faceShot(g, t, info, { M: M(), bg: dinnerBg(), bgCam: o.bgCam || { z: 1.6, x: outfit === GRANDPA ? -300 : 300, y: -150 }, outfit, side: outfit === GRANDPA ? 1 : -1, dx: o.dx ?? (outfit === GRANDPA ? -V(140, 0) : V(140, 0)), ...o });

registerShot('s100', { draw(g, t, info) {
  const p = ease.out(prog(t, 0, 1.4));
  dinner(g, t, push(t, info, { z0: 1.0, z1: 1.06, x0: 40, x1: 60 }), { gpPose: t < 1.2 ? { ...POSES.wave } : undefined, gpExpr: 'joy', gpFacing: 1, leoX: lerp(E.W + 200, LX(), p), novaX: lerp(E.W + 380, NX(), p), leoExpr: 'smile', novaExpr: 'smile', notes: false });
  label(g, t, 'SUNDAY DINNER', E.W / 2, V(140, 220), 0.3, { size: V(48, 48), color: S().ui.cream });
} });
registerShot('s101', { draw(g, t, info) {
  const m = M(), cam = push(t, info, { z0: 1.0, z1: 1.06 }), drop = ease.inOut(prog(t, 0.2, 0.8));
  blurLayer(g, 14, (g2) => kitchen(g2, t, { z: 1.6, x: -400, y: -100 }, { mood: 'interiorWarm' })); veil(g, '#0a0710', 0.35);
  layer(g, cam, 1, (g) => { recordPlayer(g, E.W * 0.5, E.H * 0.8, V(3.4, 2.6), t > 0.8 ? t : 0, t > 0.8, m); const ax = E.W * 0.5 + 300, ay = E.H * 0.8 - 300; seg(g, [[ax, ay], [lerp(ax - 40, ax - 260, drop), lerp(ay + 40, ay + 120, drop)]], 12, '#c8c2d0'); if (t > 0.8) notes(g, t, E.W * 0.5, E.H * 0.55, { count: 5, spread: 500 }); });
} });
function boom(g, t, info, n) {
  const ui = S().ui, k = 1 - clamp(t / 0.5), cam = { z: 1.0 + 0.05 * k, x: 0, y: 0 };
  if (n === 1) { blurLayer(g, 12, (g2) => kitchen(g2, t, { z: 1.6, x: -400, y: -100 }, { mood: 'interiorWarm' })); veil(g, '#0a0710', 0.35); layer(g, cam, 1, (g) => recordPlayer(g, E.W * 0.5, E.H * 0.8, V(3.4, 2.6), t, true, M())); }
  else if (n === 2) dinner(g, t, { z: 1.0 + 0.04 * k, x: 0, y: 0 }, { gpExpr: 'joy', leoExpr: 'happy', novaExpr: 'surprised', novaLook: [-1, 0] });
  else { blurLayer(g, 12, (g2) => dinner(g2, t, { z: 1.5, x: -300, y: -100 })); veil(g, '#0a0710', 0.45); heartIcon(g, E.W / 2, E.H * 0.5, 4.6 * (1 + 0.15 * k), ui.accent); }
  FX.rings(g, E.W / 2, E.H * 0.55, t, { count: 2, r0: 200, r1: 900, speed: 1.6, color: '#ffd28a', a: 0.35 * k + 0.1 });
  const s = 1 + 0.4 * k; g.save(); g.translate(E.W / 2, E.H * 0.22); g.scale(s, s); text(g, 'BOOM', 0, 0, { size: V(110, 96), color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.6) }); g.restore();
}
registerShot('s102', { draw(g, t, info) { boom(g, t, info, 1); } });
registerShot('s103', { draw(g, t, info) { boom(g, t, info, 2); } });
registerShot('s104', { draw(g, t, info) { boom(g, t, info, 3); } });
registerShot('s105', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, beat = 0.6, k = 1 - ((t % beat) / beat);
  heartIcon(g, E.W * 0.3, E.H * 0.5, 3.4 * (1 + 0.12 * Math.pow(k, 3)), ui.accent);
  text(g, '100', E.W * 0.66, E.H * 0.46, { size: V(200, 150), color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.6), alpha: clamp(popIn(t, 0.1)) });
  label(g, t, 'BEATS PER MINUTE', E.W * 0.66, E.H * 0.66, 0.4, { size: V(44, 44), color: ui.cream });
  label(g, t, 'CPR RHYTHM', E.W * 0.66, E.H * 0.78, 0.9, { size: V(36, 36), color: UI.bpStroke() });
} });
registerShot('s106', { draw(g, t, info) { kface(g, t, info, NOVA, { expr: 'smirk', face: { brows: 'raised' }, look: [-0.8, 0] }); } });
registerShot('s107', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.55, x0: NX() - E.W / 2 - 120, x1: NX() - E.W / 2 - 130, y0: 160, y1: 162 });
  dinner(g, t, cam, { novaPose: { ...POSES.shrug }, novaExpr: 'smirk', novaTalk: talk(info), gpExpr: 'joy' });
} });
registerShot('s108', { draw(g, t, info) { kface(g, t, info, GRANDPA, { expr: 'happy', look: [1, 0], talk: () => talk(info) }); } });
registerShot('s109', { draw(g, t, info) {
  const k = KX(), p = ease.inOut(prog(t, 0, 1.0));
  dinner(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: 160, x1: 170, y0: 130, y1: 132 }), { gpPose: { ...POSES.explain }, gpExpr: 'smile', gpFacing: 1, notes: false, leoExpr: 'smile', novaExpr: 'neutral', novaLook: [-1, 0] });
} });
registerShot('s110', { draw(g, t, info) {
  kface(g, t, info, GRANDPA, { expr: 'smile', look: [1, 0], talk: () => talk(info), dx: -V(260, 0) });
  whisper(g, t, 'A second is plenty…', { at: 0.1, x: E.W * 0.7, y: E.H * 0.3, size: V(60, 50) });
} });
registerShot('s111', { draw(g, t, info) {
  kface(g, t, info, GRANDPA, { expr: 'happy', look: [1, 0], talk: () => talk(info), dx: -V(260, 0), zoom: 0.08 });
  whisper(g, t, 'A second is plenty…', { at: -1, y: E.H * 0.3, size: V(60, 50) }); whisper(g, t, '…if you use it.', { at: 0.05, y: E.H * 0.42, size: V(70, 60) });
} });
registerShot('s112', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.56, x0: (LX() + NX()) / 2 - E.W / 2, x1: (LX() + NX()) / 2 - E.W / 2, y0: 160, y1: 162 });
  dinner(g, t, cam, { leoX: LX() - 60, leoExpr: 'thinking', leoLook: [1, 0], leoPose: { ...POSES.think }, novaExpr: 'neutral' });
} });
registerShot('s113', { draw(g, t, info) {
  const tC = wt(info, 'counts', 1.8) - 0.2;
  kface(g, t, info, NOVA, { expr: t > tC ? 'neutral' : 'worried', face: t > tC ? { eyes: 'happy', mouth: 'smallFlat' } : null, look: [0, 0], dx: V(60, 0) });
} });
// countdown over a blurred backdrop
function count(g, t, info, n, bg, o = {}) {
  blurLayer(g, 16, bg); veil(g, '#0a0710', 0.5);
  bigNum(g, t, n, { dur: info.dur, color: o.color });
}
const novaShut = (g, t, info, n) => { faceShot(g, t, info, { M: M(), bg: dinnerBg(), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: NOVA, expr: 'neutral', face: { eyes: 'happy', mouth: 'smallFlat', brows: 'worried' }, side: -1, dx: V(330, 0), look: [0, 0], zoom: 0.03, noBlink: true }); bigNum(g, t, n, { x: E.W * 0.3, r: V(170, 150), dur: info.dur }); };
registerShot('s114', { draw(g, t, info) { novaShut(g, t, info, 3); } });
registerShot('s115', { draw(g, t, info) { novaShut(g, t, info, 2); } });
registerShot('s116', { draw(g, t, info) { novaShut(g, t, info, 1); } });
registerShot('s117', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.55, x0: -200, x1: -190, y0: 160, y1: 162 }), r = classroom(g, t, cam);
  layer(g, cam, 1, (g) => { const x = E.W / 2 - 200; drawFigure(g, { x: x + 90, y: r.GY, s: 1.2, facing: -1, outfit: NOVA, pose: { ...POSES.sit, eF: [24, -140], hF: [50, -128] }, expr: 'worried', face: { eyes: 'happy' }, rim: rimOf(r.M, [-0.6, -0.8]), blink: false }); desk(g, x - 60, r.GY); rr(g, x - 130, r.GY - 152, 110, 20, 3); g.fillStyle = '#f4efe6'; g.fill(); text(g, 'TEST', x - 75, r.GY - 142, { size: 14, color: '#c0443a', font: FONTS.ui, weight: 900 }); });
  label(g, t, '3 · 2 · 1', E.W * 0.7, E.H * 0.24, 0.2, { size: V(64, 60), font: FONTS.title });
} });
registerShot('s118', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.36, y0: 100, y1: 105 }), r = pool(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 60, y: r.GY, s: 1.2, facing: 1, outfit: { ...NOVA, top: 'tshirt' }, pose: { ...POSES.ready }, expr: 'worried', face: { eyes: 'happy' }, rim: { color: '#ffffff', dir: [0.4, -1] }, blink: false }));
  label(g, t, 'COLD!', E.W * 0.72, E.H * 0.3, wt(info, 'cold', 0.4), { size: V(70, 64), color: '#7fd0ff', font: FONTS.title });
  label(g, t, '3 · 2 · 1', E.W * 0.28, E.H * 0.24, 0.2, { size: V(64, 60), font: FONTS.title });
} });
registerShot('s119', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.6, z1: 1.64, x0: NX() - E.W / 2 - 160, x1: NX() - E.W / 2 - 170, y0: 170, y1: 172 });
  dinner(g, t, cam, { novaPose: { ...POSES.holdFront }, novaExpr: 'worried', extra: (g, r, s) => { const x = NX() - 70, y = r.GY - 150; seg(g, [[x, y], [x - 50, y - 10]], 6, '#c8c2d0'); g.fillStyle = '#7ab83a'; g.beginPath(); g.ellipse(x - 60, y - 12, 14, 7, 0, 0, 7); g.fill(); } });
  label(g, t, 'SOUP', E.W * 0.3, E.H * 0.26, wt(info, 'soup', 1.4) - 0.1, { size: V(60, 56), color: '#9fd86a' });
} });
const soupShut = (g, t, info, n) => { faceShot(g, t, info, { M: M(), bg: dinnerBg(), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: NOVA, expr: 'neutral', face: { eyes: 'happy', mouth: 'wavy', brows: 'worried' }, side: -1, dx: V(330, 0), look: [0, 0], zoom: 0.03, noBlink: true, tilt: -0.05 }); bigNum(g, t, n, { x: E.W * 0.3, r: V(170, 150), dur: info.dur, color: '#9fd86a' }); };
registerShot('s120', { draw(g, t, info) { soupShut(g, t, info, 3); } });
registerShot('s121', { draw(g, t, info) { soupShut(g, t, info, 2); } });
registerShot('s122', { draw(g, t, info) { soupShut(g, t, info, 1); } });
registerShot('s123', { draw(g, t, info) { faceShot(g, t, info, { M: M(), bg: dinnerBg(), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: LEO, expr: 'neutral', face: { eyes: 'dot', mouth: 'flat', brows: null }, side: -1, dx: -V(140, 0), look: [1, 0], talk: () => talk(info) }); } });
registerShot('s124', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => dinner(g2, t, { z: 1.6, x: -200, y: -100 })); veil(g, '#0a0710', 0.35);
  layer(g, push(t, info, { z0: 1.0, z1: 1.06 }), 1, (g) => soupBowl(g, E.W / 2, E.H * 0.82, V(2.6, 2.2), t));
  label(g, t, 'VERY SUSPICIOUS', E.W / 2, E.H * 0.24, wt(info, 'suspicious', 0.6) - 0.1, { size: V(66, 60), color: '#9fd86a', font: FONTS.title });
} });
