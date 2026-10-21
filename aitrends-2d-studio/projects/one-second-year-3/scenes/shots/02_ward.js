// shots/02_ward.js: frightening (s064-s071), the price (s072-s088), the hospital (s089-s113), the long freeze (s114-s140).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, faceShot, slowTint, popIn, label, stamp } from '../lib.js';
import { bedroom, hallway } from '../sets/indoor.js';
import { voidSpace, bigClock } from '../sets/extra.js';
import { vending, greenDoor, corridor } from '../sets/corridor.js';
import { LEO, NOVA, GRANDPA, JAKE, MOM, SOL } from '../cast.js';
import { kitchenScene, dance } from '../p1kit.js';
import { chapter, bigNum, balance } from '../k2.js';
import { VIO, VIOL, threeVoid, solFig, face, solClose, clampClock, ward, wardBg, wface, solReal, CP, bigCount, whisper, voiceRings, thoughtLink } from '../k3.js';

const GOLD = () => S().ui.gold;
// ---------- frightening ----------
registerShot('s064', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.0, z1: 1.1, y0: 40, y1: 60 }), { nova: false, sol: false, leo: { x: E.W / 2, expr: 'scared', look: [0, 0] } }); } });
registerShot('s065', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, x0 = E.W * 0.1, w = E.W * 0.8, y = E.H * 0.52;
  rr(g, x0, y - 30, w, 60, 30); g.strokeStyle = c; g.lineWidth = 4; g.stroke(); text(g, 'ONE DAY', E.W / 2, y - 80, { size: V(42, 40), color: c, font: FONTS.ui, weight: 900, spacing: 6 });
  for (let i = 0; i < 10; i++) { const k = popIn(t, 0.3 + i * 0.15); if (k <= 0) continue; const x = x0 + w * (0.05 + i * 0.1); g.save(); g.translate(x, y); g.scale(k, k); circle(g, 0, 0, 20, VIOL); glow(g, 0, 0, 50, VIOL, 0.5); g.restore(); }
  label(g, t, 'FREEZES', E.W / 2, y + 110, 1.2, { size: V(48, 46), color: VIOL });
} });
registerShot('s066', { draw(g, t, info) {
  UI.blueprint(g); const cx = E.W / 2, cy = E.H * 0.5, R = V(260, 220); bigClock(g, cx, cy, R, (t * 6) % 60, { face: '#e8e2da' });
  for (let i = 0; i < 10; i++) { const k = popIn(t, 0.05 + i * 0.1); if (k <= 0) continue; const a = -Math.PI / 2 + i * Math.PI * 2 / 10; circle(g, cx + Math.cos(a) * R * 1.2, cy + Math.sin(a) * R * 1.2, 16 * k, VIOL); }
  label(g, t, '10× A DAY', E.W * 0.82, E.H * 0.24, 0.2, { size: V(56, 52), color: VIOL, font: FONTS.title });
} });
registerShot('s067', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 10 * ease.out(prog(t, 0, 0.8)), { sub: 'YEARS EVERY DAY', subAt: 0.3, color: VIOL }); } });
function hall(g, t, cam, o = {}) {
  const r = hallway(g, t, cam, {});
  const rim = rimOf(r.M, [-0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    if (o.leo !== false) drawFigure(g, { x: o.leoX ?? E.W / 2 - V(120, 60), y: r.GY, s: 1.2, facing: o.leoFacing ?? 1, outfit: LEO, pose: o.leoPose || POSES.stand, expr: o.leoExpr || 'neutral', face: o.leoFace, look: o.leoLook || [1, 0], rim, blink: o.leoFrozen ? false : blinkAt(t, 3), talk: o.leoTalk || 0 });
    if (o.jake !== false) drawFigure(g, { x: o.jakeX ?? E.W / 2 + V(150, 100), y: r.GY, s: 1.2, facing: -1, outfit: JAKE, pose: o.jakePose || POSES.relaxed, expr: o.jakeExpr || 'confused', look: [-1, 0], rim, blink: blinkAt(t, 2.8), talk: o.jakeTalk || 0 });
    o.extra?.(g, r);
  });
  return r;
}
const WAVE_A = { ...POSES.wave, eF: [34, -170], hF: [60, -196] }, WAVE_B = { ...POSES.wave, eF: [34, -170], hF: [40, -206] };
registerShot('s068', { draw(g, t, info) { hall(g, t, push(t, info, { z0: 1.5, z1: 1.55, y0: 160, y1: 162 }), { leoExpr: 'neutral', leoFace: { eyes: 'dot', mouth: 'smallFlat' }, leoFrozen: true, leoLook: [0, 0], jakePose: posesAt(t * 3 % 2, [[0, WAVE_A], [1, WAVE_B]], 0.5) }); slowTint(g, 0.15); } });
registerShot('s069', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorCool'), bg: (g2, tt, cam) => hall(g2, tt, cam), bgCam: { z: 1.6, x: 250, y: 120 }, outfit: JAKE, expr: 'confused', side: -1, dx: V(160, 0), look: [-1, 0], talk: () => talk(info) }); } });
registerShot('s070', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorCool'), bg: (g2, tt, cam) => hall(g2, tt, cam), bgCam: { z: 1.6, x: 250, y: 120 }, outfit: JAKE, expr: 'worried', side: -1, dx: V(160, 0), look: [-1, 0], talk: () => talk(info) }); } });
registerShot('s071', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorCool'), bg: (g2, tt, cam) => hall(g2, tt, cam), bgCam: { z: 1.6, x: -250, y: 120 }, outfit: LEO, expr: 'neutral', face: { eyes: 'dot', mouth: 'smallFlat' }, side: 1, dx: -V(160, 0), look: [0.2, -0.2], talk: () => talk(info) * 0.6 }); whisper(g, t, 'Somewhere very quiet.', { at: 0.2, x: E.W * 0.7, y: E.H * 0.3, size: V(50, 44), color: S().ui.cream }); } });

// ---------- the price ----------
registerShot('s072', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); threeVoid(g, t, push(t, info, { z0: 1.1, z1: 1.15, y0: 80, y1: 82 }), { nova: false, sol: false, leo: { x: E.W / 2, expr: 'sad' } }); veil(g, '#020205', 0.45 * p); } });
registerShot('s073', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.04 })); UI.bigLine(g, t, { str: 'THE PRICE', dur: info.dur + 0.4, size: V(130, 100), color: S().ui.accent }); } });
function room(g, t, cam, o = {}) {
  const r = bedroom(g, t, cam, { mood: o.mood || 'interiorWarm', doorGlow: 0.3 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 + V(250, 160), y: r.GY - 30, s: 1.25, facing: -1, outfit: LEO, pose: breathe(POSES.sit, t), expr: o.expr || 'neutral', rim: rimOf(r.M, [-0.6, -0.8]), shadow: false, blink: blinkAt(t, 3.2) }));
  return r;
}
registerShot('s074', { draw(g, t, info) { room(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: 260, x1: 270, y0: 160, y1: 165 })); label(g, t, 'AGE 15', E.W * 0.26, E.H * 0.6, 0.15, { size: V(80, 80), font: FONTS.title, color: S().ui.cream }); } });
registerShot('s075', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), v = Math.round(lerp(15, 104, ease.inOut(prog(t, 0.6, 2.8))));
  text(g, 'BODY', E.W * 0.28, E.H * 0.3, { size: V(44, 44), color: c, font: FONTS.ui, weight: 900, spacing: 6 }); text(g, '15', E.W * 0.28, E.H * 0.52, { size: V(200, 160), color: ui.cream, font: FONTS.title, weight: 700 });
  text(g, 'MIND', E.W * 0.72, E.H * 0.3, { size: V(44, 44), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6 }); text(g, v + (v >= 100 ? '+' : ''), E.W * 0.72, E.H * 0.52, { size: V(200, 160), color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.6) });
  text(g, 'YEARS LIVED', E.W / 2, E.H * 0.78, { size: V(44, 44), color: c, font: FONTS.ui, weight: 900, spacing: 8 }); seg(g, [[E.W / 2, E.H * 0.22], [E.W / 2, E.H * 0.64]], 3, alpha(c, 0.4));
} });
registerShot('s076', { draw(g, t, info) { hall(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: -150, x1: -150, y0: 160, y1: 162 }), { jake: false, leoX: E.W / 2 - 150, leoFacing: -1, leoExpr: 'confused', leoPose: { ...POSES.think }, leoLook: [-1, -0.2] }); label(g, t, '?', E.W * 0.36, E.H * 0.3, 0.6, { size: V(110, 100), color: S().ui.cream, font: FONTS.title }); } });
registerShot('s077', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => hallway(g2, t, { z: 1.6, x: -200, y: 100 })); veil(g, '#0a0710', 0.35); const cx = E.W / 2, cy = E.H * 0.5, R = V(220, 200), sp = Math.sin(t * 5) * 0.6;
  rr(g, cx - R * 1.6, cy - R * 1.5, R * 3.2, R * 3, 20); g.fillStyle = '#2a3a5a'; g.fill(); circle(g, cx, cy, R, '#c8c2d0'); circle(g, cx, cy, R * 0.82, '#1a1820');
  for (let i = 0; i < 40; i++) { const a = sp + i * Math.PI * 2 / 40; seg(g, [[cx + Math.cos(a) * R * 0.7, cy + Math.sin(a) * R * 0.7], [cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8]], i % 5 ? 2 : 5, '#c8c2d0'); }
  poly(g, [[cx, cy - R * 1.1], [cx - 16, cy - R * 0.92], [cx + 16, cy - R * 0.92]], S().ui.accent);
  ['?', '?', '?'].forEach((q, i) => label(g, t, q, E.W * (0.72 + i * 0.07), E.H * 0.3, 0.2 + i * 0.2, { size: V(80, 70), color: S().ui.accent, font: FONTS.title }));
} });
registerShot('s078', { draw(g, t, info) {
  UI.blueprint(g); const x = E.W / 2, y = E.H * 0.5, w = V(520, 460), h = V(440, 420), ui = S().ui;
  rr(g, x - w / 2, y - h / 2, w, h, 16); g.fillStyle = '#efe6d2'; g.fill(); rr(g, x - w / 2, y - h / 2, w, 80, 16); g.fillStyle = '#c0443a'; g.fill(); text(g, 'MOM’S BIRTHDAY', x, y - h / 2 + 42, { size: 34, color: '#fff', font: FONTS.ui, weight: 900, spacing: 3 });
  for (let i = 0; i < 28; i++) { const cx = x - w / 2 + 50 + (i % 7) * ((w - 100) / 6), cy = y - h / 2 + 130 + Math.floor(i / 7) * 70; text(g, String(i + 1), cx, cy, { size: 30, color: '#2a2230', font: FONTS.ui, weight: 700, alpha: i === 17 ? 0 : 0.85 }); }
  const k = popIn(t, 0.4); if (k > 0) { const cx = x - w / 2 + 50 + (17 % 7) * ((w - 100) / 6), cy = y - h / 2 + 130 + 2 * 70; text(g, '?', cx, cy, { size: 54 * k, color: ui.accent, font: FONTS.title, weight: 700 }); ring(g, cx, cy, 34 * k, 4, ui.accent); }
} });
registerShot('s079', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), tC = wt(info, 'century', 2.4) - 0.3;
  const items = ['LOCKER CODE', 'MOM’S BIRTHDAY', 'FRIENDS’ NAMES', 'HOMEWORK', 'FAVOURITE SONG'];
  items.forEach((s2, i) => { const y = E.H * (0.22 + i * 0.12), fade = clamp(1 - prog(t, 0.6 + i * 0.4, 1.6 + i * 0.4) * 0.8); rr(g, E.W * 0.08, y - 26, E.W * 0.34, 52, 12); g.strokeStyle = alpha(c, fade); g.lineWidth = 3; g.stroke(); text(g, s2, E.W * 0.25, y, { size: V(30, 28), color: alpha(ui.cream, fade), font: FONTS.ui, weight: 900 }); });
  text(g, 'REAL LIFE', E.W * 0.25, E.H * 0.12, { size: V(36, 34), color: c, font: FONTS.ui, weight: 900, spacing: 4 });
  const n = Math.floor(80 * ease.out(prog(t, tC, tC + 1.8))); for (let i = 0; i < n; i++) { const x = E.W * (0.52 + (i % 10) * 0.042), y = E.H * (0.82 - Math.floor(i / 10) * 0.075); rr(g, x, y, 60, 46, 6); g.fillStyle = alpha(VIOL, 0.6); g.fill(); }
  label(g, t, 'A CENTURY OF THINKING', E.W * 0.73, E.H * 0.14, tC, { size: V(40, 38), color: VIOL });
} });
const kitchenMom = (g, t, cam, o = {}) => kitchenScene(g, t, cam, { gp: false, table: false, leo: false, notes: false,
  extra: (g, r, s) => { const rim = rimOf(r.M, [-0.6, -0.8]); drawFigure(g, { x: E.W / 2 - V(160, 100), y: r.GY, s, facing: 1, outfit: MOM, pose: o.momPose || POSES.crossArms, expr: o.momExpr || 'worried', look: [1, 0], rim, blink: blinkAt(t, 3.3), talk: o.momTalk || 0 }); drawFigure(g, { x: E.W / 2 + V(250, 150), y: r.GY, s, facing: -1, outfit: LEO, pose: o.leoPose || POSES.relaxed, expr: o.leoExpr || 'neutral', face: o.leoFace, look: [-1, 0], rim, blink: blinkAt(t, 3) }); } });
const mbg = (g2, tt, cam) => kitchenMom(g2, tt, cam);
registerShot('s080', { draw(g, t, info) { kitchenMom(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: 40, x1: 50, y0: 120, y1: 124 }), { leoFace: { eyes: 'dot', mouth: 'smallFlat' } }); } });
registerShot('s081', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: mbg, bgCam: { z: 1.6, x: -250, y: -150 }, outfit: MOM, expr: 'worried', side: 1, dx: -V(160, 0), look: [1, 0], talk: () => talk(info) }); } });
registerShot('s082', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: mbg, bgCam: { z: 1.6, x: -250, y: -150 }, outfit: MOM, expr: 'worried', side: 1, dx: -V(160, 0), look: [1, 0], talk: () => talk(info) }); } });
const leoK = (g, t, info, o) => faceShot(g, t, info, { M: mood('interiorWarm'), bg: mbg, bgCam: { z: 1.6, x: 250, y: -150 }, outfit: LEO, side: -1, dx: V(160, 0), look: [-1, 0], ...o });
registerShot('s083', { draw(g, t, info) { leoK(g, t, info, { expr: 'smile' }); } });
registerShot('s084', { draw(g, t, info) { leoK(g, t, info, { expr: 'smile', talk: () => talk(info) }); whisper(g, t, 'Yeah. I’m fine.', { at: 0.1, x: E.W * 0.3, y: E.H * 0.3, size: V(50, 44), color: S().ui.cream }); } });
registerShot('s085', { draw(g, t, info) { leoK(g, t, info, { expr: 'scared', look: [0, 0.3], zoom: 0.1 }); } });
registerShot('s086', { draw(g, t, info) {
  const p = ease.inOut(prog(t, 0.2, info.dur)), cam = push(t, info, { z0: 1.2, z1: 1.26, y0: 100, y1: 104 }), r = voidSpace(g, t, cam, { color: VIO });
  layer(g, cam, 1, (g) => { g.save(); g.translate(E.W / 2 + 30, r.GY); g.transform(1, 0, -1.2, 0.35 + p * 0.25, 0, 0); drawFigure(g, { x: 0, y: 0, s: 1.15, facing: 1, outfit: p > 0.5 ? STRANGER_SHADOW : { top: 'none', head: 'curly' }, pose: POSES.stand, expr: 'neutral', rim: false, ink: alpha(VIO, 0.6), blink: false, shadow: false }); g.restore();
    drawFigure(g, { x: E.W / 2, y: r.GY, s: 1.15, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'scared', look: [-1, 0.3], rim: { color: VIOL, dir: [0, -1] }, blink: false }); });
} });
const STRANGER_SHADOW = { top: 'trench', color: '#2c2833', head: 'fedora', headColor: '#1c1a22' };
registerShot('s087', { draw(g, t, info) { const k = ease.out(prog(t, 0, 0.8)); threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, y0: 120, y1: 122 }), { nova: false, leo: { x: E.W / 2 - 60, expr: 'scared', a: 1 - 0.5 * k }, sol: { x: E.W / 2 + 60, a: k * 0.8, glints: k } }); label(g, t, 'SOMEONE LIKE SOL', E.W / 2, E.H * 0.2, 0.2, { size: V(52, 50), color: VIOL }); } });
registerShot('s088', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, y0: 120, y1: 122 }), { nova: false, sol: false, leo: { x: E.W / 2, expr: 'sad', a: lerp(1, 0.15, p) } }); whisper(g, t, 'Who was I?', { at: 0.4, y: E.H * 0.2, size: V(56, 48), color: S().ui.cream }); } });

// ---------- the hospital ----------
const K = () => CP();
registerShot('s089', { draw(g, t, info) { ward(g, t, push(t, info, { z0: 1.0, z1: 1.05, y0: 30, y1: 40 }), { gp: false, leo: false, nova: false }); label(g, t, 'WHERE IT ALL STARTED', E.W / 2, V(150, 240), 0.3, { size: V(46, 46), color: S().ui.cream }); } });
registerShot('s090', { draw(g, t, info) {
  const k = K(), p = ease.out(prog(t, 0, info.dur));
  ward(g, t, push(t, info, { z0: 1.05, z1: 1.08, y0: 40, y1: 44 }), { gp: { x: lerp(E.W + 200, k.gp, p), pose: p < 1 ? walkPose(t * 1.2 * Math.PI * 2) : undefined, facing: -1 }, leo: { x: lerp(E.W + 380, k.leo, p), pose: p < 1 ? walkPose(t * 1.3 * Math.PI * 2 + 1) : undefined }, nova: { x: lerp(E.W + 560, k.leo + V(160, 100), p), facing: -1, pose: p < 1 ? walkPose(t * 1.3 * Math.PI * 2 + 2) : undefined } });
  label(g, t, 'CHECKUP', E.W / 2, V(150, 240), 0.2, { size: V(46, 46), color: S().ui.cream });
} });
registerShot('s091', { draw(g, t, info) { ward(g, t, push(t, info, { z0: 0.95, z1: 1.0, y0: 0, y1: 10 }), { leo: { x: K().leo + 60 }, nova: { x: K().leo + V(220, 140), facing: -1 } }); label(g, t, 'THE HOSPITAL', E.W / 2, V(150, 240), 0.1, { size: V(48, 48), color: S().ui.cream }); } });
registerShot('s092', { draw(g, t, info) { ward(g, t, push(t, info, { z0: 1.0, z1: 1.2, y0: 20, y1: 60 }), { gp: false, leo: false, nova: false, sol: false }); label(g, t, 'SAME CORRIDOR', E.W / 2, V(150, 240), 0.3, { size: V(46, 46), color: S().ui.cream }); } });
registerShot('s093', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 2.0, z1: 2.08, x0: k.door - E.W / 2, x1: k.door - E.W / 2, y0: 180, y1: 184 }), { gp: false, leo: false, nova: false, sol: false }); } });
registerShot('s094', { draw(g, t, info) { const k = K(), tC = wt(info, 'blue', 1.8) - 0.1; ward(g, t, push(t, info, { z0: 2.0, z1: 2.15, x0: k.vend - E.W / 2, x1: k.vend - E.W / 2 + 20, y0: 160, y1: 170 }), { gp: false, leo: false, nova: false, sol: false, canGlow: clamp((t - tC) / 0.4) }); label(g, t, 'STUCK', E.W * 0.75, E.H * 0.4, tC + 0.6, { size: V(70, 64), color: '#5fa0ff', font: FONTS.title }); } });
const gpFace = (g, t, info, o = {}) => wface(g, t, info, GRANDPA, { left: true, expr: 'smile', look: [1, 0], talk: () => talk(info), bgCam: { z: 1.6, x: -350, y: 100 }, ...o });
registerShot('s095', { draw(g, t, info) { gpFace(g, t, info); } });
registerShot('s096', { draw(g, t, info) { gpFace(g, t, info, { expr: 'happy' }); } });
const TAP = [[0, POSES.relaxed], [0.3, { ...POSES.point, eF: [-30, -150], hF: [-62, -150] }], [0.55, POSES.relaxed]];
registerShot('s097', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 1.6, z1: 1.64, x0: k.vend - E.W / 2 + 120, x1: k.vend - E.W / 2 + 120, y0: 170, y1: 172 }), { sol: false, nova: false, leo: false, gp: { x: k.vend + V(200, 140), pose: posesAt(t, TAP, 0.2) }, wobble: t > 0.45 ? Math.sin((t - 0.45) * 30) * 0.12 * Math.max(0, 1 - (t - 0.45) * 2) : 0 }); label(g, t, 'TAP', E.W * 0.38, E.H * 0.3, 0.45, { size: V(60, 56), color: S().ui.cream, font: FONTS.title }); } });
registerShot('s098', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 2.4, z1: 2.45, x0: k.vend - E.W / 2 - 50, x1: k.vend - E.W / 2 - 50, y0: 100, y1: 100 }), { gp: false, leo: false, nova: false, sol: false, wobble: Math.sin(t * 25) * 0.1 * Math.max(0, 1 - t * 1.5), canGlow: 0.6 }); } });
registerShot('s099', { draw(g, t, info) { gpFace(g, t, info, { expr: 'smirk' }); } });
registerShot('s100', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 1.6, z1: 1.64, x0: (k.gp + k.leo) / 2 - E.W / 2, x1: (k.gp + k.leo) / 2 - E.W / 2, y0: 170, y1: 172 }), { sol: false, nova: false, gp: { pose: { ...POSES.point, eF: [24, -150], hF: [48, -160] }, facing: 1, expr: 'happy', look: [1, 0] }, leo: { expr: 'smile', look: [-1, 0] } }); } });
registerShot('s101', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 1.3, z1: 1.45, x0: k.sol - E.W / 2 + 60, x1: k.sol - E.W / 2 + 80, y0: 120, y1: 140 }), { gp: false, leo: false, nova: false }); label(g, t, 'PERFECTLY STILL', E.W / 2, E.H * 0.2, wt(info, 'still', 3.6) - 0.1, { size: V(48, 46), color: S().ui.cream }); } });
registerShot('s102', { draw(g, t, info) { solReal(g, t, info, { zoom: 0.04 }); } });
registerShot('s103', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => ward(g2, 0, { z: 1.6, x: 200, y: 100 }, { gp: false, leo: false, nova: false })); veil(g, '#0a0710', 0.3);
  const ink = S().ink, cx = E.W / 2, cy = E.H * 0.62, rimC = alpha('#e8f6ff', 0.7);
  layer(g, push(t, info, { z0: 1.0, z1: 1.04 }), 1, (g) => { g.fillStyle = SOL.color; g.beginPath(); g.ellipse(cx, cy + 260, 560, 260, 0, Math.PI, 0); g.fill(); g.strokeStyle = rimC; g.lineWidth = 4; g.beginPath(); g.ellipse(cx, cy + 260, 560, 260, 0, Math.PI, 0); g.stroke();
    for (const d of [-1, 1]) { seg(g, [[cx + d * 470, cy + 120], [cx + d * 120, cy + 30]], 70, shade(SOL.color, 0.15)); }
    for (const d of [-1, 1]) { g.fillStyle = ink; g.beginPath(); g.ellipse(cx + d * 30, cy + 10, 110, 48, d * 0.25, 0, 7); g.fill(); g.strokeStyle = rimC; g.lineWidth = 3; g.beginPath(); g.ellipse(cx + d * 30, cy + 10, 110, 48, d * 0.25, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    for (let i = 0; i < 4; i++) seg(g, [[cx - 60 + i * 34, cy - 24], [cx - 50 + i * 34, cy + 30]], 6, alpha('#e8f6ff', 0.35)); });
  label(g, t, 'HANDS FOLDED', E.W / 2, E.H * 0.2, 0.3, { size: V(48, 46), color: S().ui.cream });
} });
registerShot('s104', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 1.6, z1: 1.64, x0: (k.gp + k.leo) / 2 - E.W / 2, x1: (k.gp + k.leo) / 2 - E.W / 2, y0: 170, y1: 172 }), { sol: false, nova: false, gp: { pose: { ...POSES.reach, eF: [40, -170], hF: [80, -178] }, facing: 1, expr: 'smile', look: [1, 0] }, leo: { expr: 'sad', look: [-1, 0] } }); } });
registerShot('s105', { draw(g, t, info) { gpFace(g, t, info, { expr: 'worried' }); } });
registerShot('s106', { draw(g, t, info) { gpFace(g, t, info, { expr: 'smile', zoom: 0.08 }); } });
registerShot('s107', { draw(g, t, info) { gpFace(g, t, info, { expr: 'smile', dx: -V(260, 0) }); whisper(g, t, 'A second is plenty…', { at: 0.1, x: E.W * 0.7, y: E.H * 0.3, size: V(60, 50) }); } });
registerShot('s108', { draw(g, t, info) { gpFace(g, t, info, { expr: 'happy', dx: -V(260, 0), zoom: 0.08 }); whisper(g, t, 'A second is plenty…', { at: -1, x: E.W * 0.7, y: E.H * 0.3, size: V(60, 50) }); whisper(g, t, '…if you use it.', { at: 0.05, x: E.W * 0.7, y: E.H * 0.42, size: V(70, 60) }); } });
registerShot('s109', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 1.6, z1: 1.64, x0: k.nova - E.W / 2 + 60, x1: k.nova - E.W / 2 + 60, y0: 170, y1: 172 }), { gp: false, sol: false, leo: false, nova: { expr: 'smile', look: [1, 0], facing: 1 } }); label(g, t, 'NOVA', E.W * 0.22, E.H * 0.3, 0.2, { size: V(70, 64), color: '#5fe0d0', font: FONTS.title }); } });
registerShot('s110', { draw(g, t, info) { const k = K(), dx = lerp(E.W + 300, k.sol + V(520, 360), ease.out(prog(t, 0, info.dur))); ward(g, t, push(t, info, { z0: 1.0, z1: 1.05, x0: 60, x1: 80, y0: 30, y1: 34 }), { doc: dx, gp: { look: [1, 0] }, leo: { look: [1, 0], facing: 1 }, nova: { look: [1, 0] } }); label(g, t, 'DOCTOR', E.W * 0.82, E.H * 0.24, 0.6, { size: V(46, 44), color: S().ui.cream }); } });
registerShot('s111', { draw(g, t, info) { wface(g, t, info, LEO, { expr: 'surprised', look: [1, 0], zoom: 0.1, bgCam: { z: 1.6, x: -100, y: 100 } }); } });
registerShot('s112', { draw(g, t, info) { wface(g, t, info, LEO, { expr: 'shocked', face: t > 0.5 ? { mouth: 'smallFlat' } : { mouth: 'o' }, noBlink: true, zoom: 0.12, bgCam: { z: 1.6, x: -100, y: 100 } }); if (t > 0.7) slowTint(g, 0.3 * clamp((t - 0.7) / 0.5)); } });
registerShot('s113', { draw(g, t, info) { wface(g, t, info, NOVA, { left: false, expr: 'shocked', face: t > 0.5 ? { mouth: 'smallFlat' } : { mouth: 'o' }, noBlink: true, zoom: 0.12, bgCam: { z: 1.6, x: -400, y: 100 }, look: [1, 0] }); slowTint(g, 0.3 * clamp(t / 0.8)); } });

// ---------- the long freeze ----------
const DOC_FROZEN = () => K().sol + V(520, 360);
const frozenWard = (g, t, cam, o = {}) => ward(g, t, cam, { frozen: true, doc: { x: DOC_FROZEN() }, gp: { look: [1, 0] }, leo: { look: [1, 0], facing: 1, expr: 'shocked' }, nova: { look: [1, 0], expr: 'shocked' }, ...o });
registerShot('s114', { draw(g, t, info) { frozenWard(g, t, push(t, info, { z0: 1.05, z1: 1.09, x0: 60, x1: 60, y0: 34, y1: 34, r: 0.01 })); UI.badge(g, { str: 'THE YEAR BEGINS', a: ease.out(prog(t, 0.1, 0.6)) }); } });
function yearsVoid(g, t, info, from, to, big) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.06 }), { color: VIO }); bigCount(g, t, lerp(from, to, ease.out(prog(t, 0, Math.min(1.0, info.dur)))), { sub: 'YEARS', subAt: 0.1, color: big ? VIOL : S().ui.gold, size: big ? V(260, 190) : undefined }); }
registerShot('s115', { draw(g, t, info) { yearsVoid(g, t, info, 1, 60); } });
registerShot('s116', { draw(g, t, info) { yearsVoid(g, t, info, 60, 100); } });
registerShot('s117', { draw(g, t, info) { yearsVoid(g, t, info, 100, 500); } });
registerShot('s118', { draw(g, t, info) { yearsVoid(g, t, info, 500, 900, true); } });
registerShot('s119', { draw(g, t, info) { clampClock(g, t, info, prog(t, 0.2, 1.6)); label(g, t, 'SOL’S GRIP', E.W / 2, E.H * 0.8, 0.4, { size: V(56, 52), color: VIOL, font: FONTS.title }); } });
registerShot('s120', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 }), { color: VIO }); voiceRings(g, t, E.W / 2, E.H / 2, { color: VIOL, r0: 200, r1: 900, a: 0.2 }); whisper(g, t, 'Stay.', { at: 0, size: V(150, 120), color: VIOL }); } });
registerShot('s121', { draw(g, t, info) {
  const k = K(), cam = push(t, info, { z0: 1.35, z1: 1.38, x0: (k.sol + DOC_FROZEN()) / 2 - E.W / 2, x1: (k.sol + DOC_FROZEN()) / 2 - E.W / 2, y0: 120, y1: 120 });
  frozenWard(g, t, cam, { gp: false, leo: false, nova: false, extra: (g, r) => { for (let i = 0; i < 5; i++) { const kk = popIn(t, 0.3 + i * 0.3); if (kk <= 0) continue; const x = lerp(DOC_FROZEN() - 60, k.sol + 140, (i + 0.5) / 5), y = r.GY + 26 + (i % 2) * 16; g.save(); g.translate(x, y); g.scale(kk, kk); g.fillStyle = alpha(S().ui.gold, 0.85); g.beginPath(); g.ellipse(0, 0, 26, 10, 0, 0, 7); g.fill(); text(g, String(i + 1), 0, -30, { size: 28, color: S().ui.gold, font: FONTS.ui, weight: 900 }); g.restore(); } } });
  label(g, t, '5 STEPS', E.W * 0.25, E.H * 0.3, 1.8, { size: V(64, 60), font: FONTS.title });
} });
registerShot('s122', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui;
  for (let i = 0; i < 5; i++) { const x = E.W * (0.16 + i * 0.12), k = popIn(t, 0.2 + i * 0.2); if (k > 0) UI.lineFigure(g, { x, y: E.H * 0.62, s: 0.8, pose: walkPose(i * 1.3), color: alpha(c, 0.9) }); }
  label(g, t, '≈ 3 SECONDS', E.W * 0.82, E.H * 0.45, wt(info, 'three', 2.4) - 0.1, { size: V(70, 60), font: FONTS.title });
  label(g, t, 'NORMAL WALK', E.W * 0.82, E.H * 0.56, 0.4, { size: V(36, 34), color: ui.cream });
} });
registerShot('s123', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; text(g, '3 s', E.W * 0.3, E.H * 0.5, { size: V(110, 80), color: ui.cream, font: FONTS.title, weight: 700 }); text(g, '×', E.W * 0.47, E.H * 0.5, { size: V(90, 70), color: UI.bpStroke(), font: FONTS.title, weight: 700 }); label(g, t, '1,000 YEARS', E.W * 0.7, E.H * 0.5, 0.2, { size: V(90, 66), color: VIOL, font: FONTS.title }); } });
registerShot('s124', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 3000 * ease.out(prog(t, 0, 1.0)), { color: VIOL, sub: 'YEARS FOR SOL', subAt: 0.3 }); } });
registerShot('s125', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); threeVoid(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: V(420, 260), x1: V(420, 260), y0: 160, y1: 160 }), { leo: false, sol: false, nova: { a: lerp(0.5, 0.18, p), expr: 'sleepy' }, color: '#8a9ad8' }); } });
registerShot('s126', { draw(g, t, info) { backdrop(g, ['#020205', '#05060c']); whisper(g, t, 'Leo…', { at: 0, size: V(110, 90), color: alpha('#5fe0d0', 0.6) }); } });
registerShot('s127', { draw(g, t, info) {
  const f = face(g, t, info, NOVA, { expr: 'sad', look: [0, 0.3], color: '#8a9ad8', dx: 0, veil: 0.5 });
  g.save(); g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 60; i++) { const a = i * 2.4, d = f.r * (0.9 + 0.5 * ((i * 37) % 10) / 10) * (0.6 + 0.4 * clamp(t / info.dur)); circle(g, f.cx + Math.cos(a) * d, f.cy + Math.sin(a) * d, f.r * 0.12, 'rgba(0,0,0,.6)'); } g.restore();
  whisper(g, t, 'I can’t feel the edges anymore.', { at: 0.1, y: E.H * 0.18, size: V(48, 42), color: '#5fe0d0' });
} });
registerShot('s128', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); threeVoid(g, t, push(t, info, { z0: 1.1, z1: 1.3, y0: 80, y1: 110 }), { nova: { a: 0.25 }, leo: { expr: 'scared' }, sol: { x: lerp(E.W / 2 + 200, E.W / 2, p), glints: 1, pose: walkPose(t * 0.8) } }); } });
registerShot('s129', { draw(g, t, info) { solClose(g, t, info, { glints: 0.8, talk: 1 }); whisper(g, t, 'You can still leave, Leo.', { at: 0.1, y: E.H * 0.18, size: V(52, 46), color: VIOL }); } });
registerShot('s130', { draw(g, t, info) { solClose(g, t, info, { z0: 2.6, z1: 2.7, glints: 0.8, talk: 1 }); whisper(g, t, 'You’re strong enough.', { at: 0.1, y: E.H * 0.18, size: V(52, 46), color: VIOL }); } });
registerShot('s131', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 1.05 }), { color: VIO }); whisper(g, t, 'Breathe out.', { at: 0, size: V(120, 100), color: VIOL }); } });
function doorway(g, x, y, k) { const w = 240 * k, h = 460; g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y - h / 2, 420 * k, '#fff3dc', 0.6); rr(g, x - w / 2, y - h, w, h, 10); g.fillStyle = alpha('#fff6e8', 0.85); g.fill(); g.restore(); }
registerShot('s132', { draw(g, t, info) { const r = threeVoid(g, t, push(t, info, { z0: 1.2, z1: 1.25, y0: 100, y1: 102 }), { nova: false, sol: false, leo: { x: E.W / 2 - V(300, 200), look: [1, 0], expr: 'awe' }, extra: (g, r) => doorway(g, E.W / 2 + V(250, 160), r.GY, ease.out(prog(t, 0, 0.6))) }); whisper(g, t, 'Go home.', { at: 0.05, y: E.H * 0.18, size: V(56, 48), color: VIOL }); } });
registerShot('s133', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.2, z1: 1.25, x0: 120, x1: 120, y0: 100, y1: 102 }), { leo: false, nova: { a: 0.35, expr: 'sleepy' }, sol: { x: E.W / 2, glints: 1 }, vlinkN: 1, extra: (g, r, P) => { for (let i = 0; i < 4; i++) thoughtLink(g, t + i * 0.7, [P.Z.x + 20, r.GY - 120 - i * 30], [P.N.x - 10, r.GY - 40 - i * 45], { k: 0.6, color: VIOL }); } }); whisper(g, t, 'But she stays with me.', { at: 0.1, y: E.H * 0.18, size: V(52, 46), color: VIOL }); } });
registerShot('s134', { draw(g, t, info) { face(g, t, info, LEO, { expr: 'worried', look: [1, 0.2], color: VIO, zoom: 0.08 }); } });
registerShot('s135', { draw(g, t, info) { const r = threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: 100, x1: 110, y0: 120, y1: 122 }), { nova: false, sol: false, leo: { x: E.W / 2 + V(80, 40), look: [1, 0], expr: 'awe', pose: { ...POSES.reach } }, extra: (g, r) => doorway(g, E.W / 2 + V(350, 220), r.GY, 1) }); label(g, t, 'FREE', E.W * 0.8, E.H * 0.24, wt(info, 'free', 1.6) - 0.1, { size: V(70, 64), color: '#fff3dc', font: FONTS.title }); } });
function memory(g, draw) { draw(); g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = alpha('#c89a60', 0.25); g.fillRect(0, 0, E.W, E.H); g.restore(); const gr = g.createRadialGradient(E.W / 2, E.H / 2, E.W * 0.25, E.W / 2, E.H / 2, E.W * 0.6); gr.addColorStop(0, 'rgba(255,240,220,0)'); gr.addColorStop(1, 'rgba(255,240,220,.6)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); }
registerShot('s136', { draw(g, t, info) { memory(g, () => faceShot(g, t, info, { M: mood('interiorWarm'), bg: mbg, bgCam: { z: 1.6, x: -250, y: -150 }, outfit: MOM, expr: 'smile', side: 1, dx: 0, look: [0, 0] })); } });
registerShot('s137', { draw(g, t, info) { memory(g, () => kitchenScene(g, t, push(t, info, { z0: 1.55, z1: 1.6, x0: -V(260, 200) - 60, x1: -V(260, 200) - 40, y0: 170, y1: 175 }), { leo: false, table: false })); } });
registerShot('s138', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, z1: 1.04 }); voidSpace(g, t, cam); layer(g, cam, 1, (g) => bigClock(g, E.W / 2, E.H * 0.5, V(280, 240), 12 + Math.floor(t * 2), { face: '#f4efe6' })); label(g, t, 'REAL SECONDS', E.W / 2, E.H * 0.8, 0.2, { size: V(52, 50), color: S().ui.cream }); } });
registerShot('s139', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: V(420, 260) - 100, x1: V(420, 260) - 100, y0: 120, y1: 122 }), { leo: false, sol: false, nova: { a: lerp(0.35, 0.05, p), expr: 'sleepy' }, color: '#8a9ad8' }); } });
registerShot('s140', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.3, z1: 1.32, x0: V(420, 260) - 100, x1: V(420, 260) - 100, y0: 120, y1: 120 }), { color: '#8a9ad8' }); label(g, t, 'FOREVER', E.W / 2, E.H * 0.3, 0.1, { size: V(80, 70), color: '#8a9ad8', font: FONTS.title }); } });
