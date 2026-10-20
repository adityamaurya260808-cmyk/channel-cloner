// shots/04_song.js: Grandpa's song (s085-s096), Sunday: the fall and the frozen year (s097-s117), the decision (s118-s123).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix, rng,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, label, stamp } from '../lib.js';
import { kitchen, table, classroom } from '../sets/indoor.js';
import { voidSpace, recordPlayer, glassesProp, spoonProp, bigClock, heartIcon, notes } from '../sets/extra.js';
import { KX, dance, GP_FALL, kitchenScene, frozenKitchen, yearBadge, HELD } from './01_open.js';
import { LEO, GRANDPA, TEACHER, EXTRA, EXTRA2 } from '../cast.js';

// ---------- evening at the kitchen table ----------
const TB = () => ({ leo: E.W * 0.38, gp: E.W * 0.62, table: E.W * 0.5 });
function talkTable(g, t, cam, o = {}) {
  const { GY, M, counterTop } = kitchen(g, t, cam, { mood: 'interiorWarm', clockT: 20 * 3600 });
  const k = TB(), s = 1.3, rim = rimOf(M, [-0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    recordPlayer(g, KX().rp, counterTop, 0.9, t, !!o.spin, M); if (o.spin) notes(g, t, KX().rp - 20, counterTop - 70, { count: 4, spread: 200, a: 0.8 });
    for (const [x, f] of [[k.leo, 1], [k.gp, -1]]) { g.save(); g.translate(x, 0); g.scale(f, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore(); }
    table(g, k.table, GY, 300);
    drawFigure(g, { x: k.leo, y: GY, s, facing: 1, outfit: LEO, pose: o.leoPose || breathe(POSES.sit, t), expr: o.leoExpr || 'sad', talk: o.leoTalk || 0, rim, shadow: false, blink: blinkAt(t, 3.2) });
    drawFigure(g, { x: k.gp, y: GY, s, facing: -1, outfit: GRANDPA, pose: o.gpPose || breathe(POSES.sit, t, 1, 3), expr: o.gpExpr || 'smile', talk: o.gpTalk || 0, rim, shadow: false, blink: blinkAt(t, 3.7, 1), prop: o.gpProp });
    o.extra?.(g, GY, s);
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  return { GY, M };
}
const gpFace = (o) => ({ M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam, { mood: 'interiorWarm', clockT: 20 * 3600 }), bgCam: { z: 1.5, x: 300, y: -150 }, outfit: GRANDPA, side: 1, dx: V(180, 0), seed: 2, ...o });
registerShot('s085', { draw(g, t, info) { talkTable(g, t, push(t, info, { z0: 1.15, z1: 1.22, y0: 110, y1: 120 }), { leoTalk: 0.3 + 0.3 * Math.sin(t * 8), gpExpr: 'neutral' }); } });
registerShot('s086', { draw(g, t, info) { faceShot(g, t, info, gpFace({ expr: 'smile' })); label(g, t, 'GRANDPA', E.W * 0.26, E.H * 0.78, 0.1, { size: V(70, 70), font: FONTS.title, color: GRANDPA.color }); } });
registerShot('s087', { draw(g, t, info) { const nod = Math.sin(t * 5) * 6 * prog(t, 1.0, 1.3) * (1 - prog(t, 2.2, 2.5)); talkTable(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: 120, x1: 130, y0: 160, y1: 165 }), { gpExpr: 'neutral', gpPose: breathe({ ...POSES.sit, head: [4, -180 + nod] }, t, 1, 3) }); } });
registerShot('s088', { draw(g, t, info) { faceShot(g, t, info, gpFace({ expr: 'smile', talk: () => talk(info) })); } });
function vinyl(g, x, y, r, rot = 0) { circle(g, x, y, r, '#0c0b10'); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; for (const k of [0.45, 0.6, 0.75, 0.9]) { g.beginPath(); g.arc(x, y, r * k, rot, rot + 2); g.stroke(); } circle(g, x, y, r * 0.3, '#d64a5a'); circle(g, x, y, r * 0.04, '#0c0b10'); }
registerShot('s089', { draw(g, t, info) {
  talkTable(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: 160, x1: 170, y0: 180, y1: 185 }), { gpTalk: talk(info), gpExpr: 'smile', gpPose: breathe({ ...POSES.sit, eF: [26, -156], hF: [44, -190] }, t, 1, 3),
    extra: (g, GY, s) => { const hx = TB().gp - 44 * s, hy = GY - 190 * s; vinyl(g, hx - 10, hy - 40, 60, t); glow(g, hx - 10, hy - 40, 140, S().ui.gold, 0.3); } });
  label(g, t, 'HIS SONG', E.W * 0.3, E.H * 0.26, wt(info, 'his', 1.0) - 0.1, { size: V(56, 56) });
} });
registerShot('s090', { draw(g, t, info) { const k = KX(); kitchenScene(g, t, push(t, info, { z0: 1.4, z1: 1.46, x0: k.gp - E.W / 2 - 120, x1: k.gp - E.W / 2 - 110, y0: 150, y1: 155 }), { leo: false, table: false }); label(g, t, 'EVERY SUNDAY', E.W * 0.7, E.H * 0.24, wt(info, 'sunday', 2.6) - 0.1, { size: V(48, 48), color: S().ui.cream }); } });
registerShot('s091', { draw(g, t, info) { const k = KX(); kitchenScene(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: -60, x1: -50, y0: 130, y1: 135 }), { table: false, leoX: k.gp + V(240, 200), leoFacing: -1, leoPose: dance(t + 0.3), leoExpr: 'happy' }); } });
registerShot('s092', { draw(g, t, info) {
  const k = KX(), ui = S().ui; kitchenScene(g, t, push(t, info, { z0: 1.3, z1: 1.34, x0: -60, x1: -55, y0: 130, y1: 132 }), { table: false, leoX: k.gp + V(240, 200), leoFacing: -1, leoPose: dance(t + 0.3), leoExpr: 'joy' });
  const bs = [wt(info, 'boom', 0.05), 0, 0]; bs[1] = wt(info, 'boom', 0.4, bs[0] + 0.1); bs[2] = wt(info, 'boom', 0.8, bs[1] + 0.1);
  bs.forEach((b, i) => { if (t > b) { FX.rings(g, E.W * (0.3 + i * 0.2), E.H * 0.3, (t - b) * 0.8, { count: 1, r0: 30, r1: 260, color: ui.gold, a: 0.8 * (1 - prog(t, b, b + 1)) }); label(g, t, 'BOOM', E.W * (0.3 + i * 0.2), E.H * 0.3, b - 0.02, { size: V(60, 56) }); } });
} });
registerShot('s093', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W / 2, y = E.H * 0.78, a = Math.sin(t * Math.PI * 100 / 60) * 0.5;
  poly(g, [[x - 160, y], [x + 160, y], [x + 70, y - 420], [x - 70, y - 420]], alpha(c, 0.15)); g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 160, y); g.lineTo(x + 160, y); g.lineTo(x + 70, y - 420); g.lineTo(x - 70, y - 420); g.closePath(); g.stroke();
  const tx = x + Math.sin(a) * 380, ty = y - 60 - Math.cos(a) * 380; seg(g, [[x, y - 60], [tx, ty]], 6, ui.gold); rr(g, x + Math.sin(a) * 260 - 26, y - 60 - Math.cos(a) * 260 - 18, 52, 36, 6); g.fillStyle = ui.gold; g.fill();
  label(g, t, '100 BEATS / MIN', E.W * 0.78, E.H * 0.4, wt(info, 'hundred', 0.4) - 0.1, { size: V(56, 50) });
} });
registerShot('s094', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, z1: 1.16, y0: 60, y1: 70 }), r = voidSpace(g, t, cam), ui = S().ui;
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W * 0.42, y: r.GY, s: 1.1, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'happy', face: { eyes: 'closed', mouth: 'smallSmile' }, rim: { color: ui.gold, dir: [0.6, -0.8] }, blink: false }); notes(g, t, E.W * 0.5, r.GY - 260, { count: 8, spread: 700, a: 0.9 }); });
  glow(g, E.W * 0.5, E.H * 0.45, 600, ui.gold, 0.12); label(g, t, 'THE SILENCE ISN’T SILENT', E.W / 2, E.H * 0.2, wt(info, 'silence', 2.8) - 0.1, { size: V(46, 46), color: ui.cream });
} });
registerShot('s095', { draw(g, t, info) {
  talkTable(g, t, push(t, info, { z0: 1.45, z1: 1.5, x0: 20, x1: 30, y0: 150, y1: 152 }), { leoExpr: 'worried', gpExpr: 'smile', gpPose: breathe({ ...POSES.reach, hip: [0, -72], kF: [44, -74], fF: [46, 0], kB: [40, -72], fB: [38, 0], head: [8, -180], sh: [4, -146], eF: [44, -150], hF: [86, -160] }, t, 1, 3), gpTalk: t > 1.6 ? 0.4 + 0.3 * Math.sin(t * 9) : 0 });
} });
registerShot('s096', { draw(g, t, info) {
  blurLayer(g, 12, (g2) => kitchen(g2, t, { z: 1.2 + 0.02 * t, x: -100, y: -80 }, { mood: 'interiorWarm', clockT: 20 * 3600 })); veil(g, '#0a0710', 0.5);
  const tI = wt(info, 'if', 1.6) - 0.1, ui = S().ui;
  text(g, 'A SECOND IS PLENTY, LEO...', E.W / 2, E.H * 0.42, { size: V(80, 64), color: ui.cream, font: FONTS.title, weight: 700, spacing: 3, glow: 24, glowColor: 'rgba(255,170,90,.5)', alpha: clamp(prog(t, 0.05, 0.4)) });
  const k = ease.outBack(prog(t, tI, tI + 0.4)); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.58); g.scale(k, k); text(g, 'IF YOU USE IT.', 0, 0, { size: V(100, 84), color: ui.gold, font: FONTS.title, weight: 700, spacing: 4, glow: 34, glowColor: alpha(ui.gold, 0.7) }); g.restore(); }
  notes(g, t, E.W / 2, E.H * 0.9, { count: 6, spread: 900, a: 0.5 });
} });

// ---------- Sunday: the fall ----------
registerShot('s097', { draw(g, t, info) {
  const k = KX(), tK = wt(info, 'kitchen', 0.6) - 0.1, tS = wt(info, 'song', 1.4) - 0.1;
  if (t < tK) { kitchenScene(g, t, push(t, info, { z0: 1.0, z1: 1.03 })); label(g, t, 'SUNDAY', E.W / 2, V(150, 240), 0.05, { size: V(64, 60), font: FONTS.title }); }
  else if (t < tS) { const M = mood('interiorWarm'); insertBg(g, t, (g2, tt) => kitchen(g2, tt, { z: 1.6, x: -500, y: -100 }, { mood: 'interiorWarm' }), null, 0.35); recordPlayer(g, E.W / 2, E.H * 0.8, V(3, 2.5), t, true, M); notes(g, t, E.W / 2, E.H * 0.5, { count: 6, spread: 600 }); }
  else kitchenScene(g, t, push(t, info, { z0: 1.5, z1: 1.52, x0: k.gp - E.W / 2 - 60, x1: k.gp - E.W / 2 - 50, y0: 170, y1: 172 }), { leo: false, table: false });
} });
registerShot('s098', { draw(g, t, info) {
  const fall = ease.in(prog(t, 0.1, 0.9));
  kitchenScene(g, t, push(t, info, { z0: 1.2, z1: 1.25, x0: -40, x1: -30, y0: 100, y1: 102 }), { gpPose: posesAt(t, [[0, dance(0.2)], [0.1, GP_FALL]], 0.5), gpRot: -0.35 * fall, gpExpr: 'scared', leoExpr: t > 0.4 ? 'shocked' : 'smile', leoLook: [-1, 0], notes: t < 0.3 });
} });
registerShot('s099', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0.1, 0.7));
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => frozenKitchen(g2, 0, cam, { tint: false }), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: LEO, expr: 'shocked', face: k > 0.4 ? HELD : null, side: 1, noBlink: true, zoom: 0.08 });
  slowTint(g, 0.32 * k);
} });
registerShot('s100', { draw(g, t, info) { frozenKitchen(g, t, push(t, info, { z0: 1.12, z1: 1.16, r: 0.01 })); yearBadge(g, t, 'DAY 1', 0.1); } });
registerShot('s101', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W * 0.38, y = E.H * 0.82, k = ease.in(prog(t, 0.3, 2.4));
  seg(g, [[E.W * 0.2, y], [E.W * 0.8, y]], 3, c); UI.lineFigure(g, { x, y, s: 1.4, pose: GP_FALL, color: alpha(c, 0.35) });
  g.save(); g.translate(x, y); g.rotate(-1.4 * k); g.translate(-x, -y); UI.lineFigure(g, { x, y, s: 1.4, pose: GP_FALL, color: ui.gold }); g.restore();
  UI.readout(g, { label: 'TO THE FLOOR', value: (0.5 * k).toFixed(2) + ' s', x: E.W * 0.7, y: E.H * 0.3, align: 'center', a: clamp(popIn(t, 0.2)) });
} });
registerShot('s102', { draw(g, t, info) {
  const k = KX(), ui = S().ui;
  frozenKitchen(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: k.gp - E.W / 2 - 40, x1: k.gp - E.W / 2 - 30, y0: 160, y1: 162 }), { extra: (g, r, s) => { for (let i = 0; i <= 20; i++) { const y = r.GY - i * 12 * s; seg(g, [[k.gp + 140, y], [k.gp + 140 + (i % 5 ? 14 : 30), y]], 2, alpha(ui.gold, 0.8)); } text(g, 'cm', k.gp + 200, r.GY - 120, { size: 28, color: ui.gold, font: FONTS.ui, weight: 900 }); } });
  yearBadge(g, t, 'DAY 40', 0);
} });
registerShot('s103', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => frozenKitchen(g2, 0, cam, { tint: false }), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: LEO, expr: 'scared', face: HELD, side: 1, noBlink: true, zoom: 0.02 }); slowTint(g, 0.32); yearBadge(g, t, 'DAY 41', 0); } });
registerShot('s104', { draw(g, t, info) {
  voidSpace(g, t, push(t, info, { z0: 1, z1: 1.04 })); const ui = S().ui, tN = wt(info, 'not', 0.6) - 0.1;
  label(g, t, 'NOTHING.', E.W / 2, E.H * 0.42, 0.05, { size: V(110, 96), color: ui.cream, font: FONTS.title }); label(g, t, 'NOT YET.', E.W / 2, E.H * 0.6, tN, { size: V(90, 80), font: FONTS.title });
} });
function aidClass(g, t, cam, o = {}) {
  const { GY, M } = classroom(g, t, cam, { clockT: 14 * 3600 }), rim = rimOf(M, [0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    const dx = E.W * 0.5; drawFigure(g, { x: dx, y: GY + 60, s: 1.1, facing: 1, outfit: { top: 'tshirt', color: '#8a8698', head: 'none' }, pose: POSES.lie, rot: -Math.PI / 2, expr: 'neutral', rim: false, shadow: false, ink: '#cfc8d8', inkFar: '#a8a0b4' });
    const comp = Math.abs(Math.sin(t * Math.PI * 1.8)); drawFigure(g, { x: dx + 110, y: GY, s: 1.25, facing: -1, outfit: TEACHER, pose: { ...POSES.kneel, head: [36, -150 + comp * 8], sh: [26, -124 + comp * 8], eF: [46, -86 + comp * 6], hF: [60, -46 + comp * 8], eB: [42, -88 + comp * 6], hB: [56, -48 + comp * 8] }, expr: 'determined', rim });
    for (const [x, of, sd] of [[E.W * 0.2, LEO, 1], [E.W * 0.82, EXTRA2, 2], [E.W * 0.92, EXTRA, 3]]) drawFigure(g, { x, y: GY, s: 1.2, facing: x < dx ? 1 : -1, outfit: of, pose: breathe(POSES.relaxed, t, 1, sd), expr: of === LEO ? 'thinking' : 'neutral', rim });
    o.extra?.(g, GY);
  });
  return { GY, M };
}
function soft(g) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,200,140,.4)'; g.fillRect(0, 0, E.W, E.H); g.restore(); g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.rect(0, 0, E.W, E.H); g.ellipse(E.W / 2, E.H / 2, E.W * 0.62, E.H * 0.7, 0, 0, Math.PI * 2, true); g.fill('evenodd'); g.restore(); }
registerShot('s105', { draw(g, t, info) { aidClass(g, t, push(t, info, { z0: 1.1, z1: 1.16, y0: 80, y1: 85 })); soft(g); label(g, t, 'FIRST-AID CLASS', E.W / 2, V(150, 240), 0.3, { size: V(48, 48), color: S().ui.cream }); } });
registerShot('s106', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), tS = wt(info, 'stops', 0.8), tB = wt(info, 'brain', 1.8) - 0.1, tM = wt(info, 'minutes', 4.0) - 0.1;
  const beat = t < tS ? Math.max(0, Math.sin(t * Math.PI * 2)) : 0; heartIcon(g, E.W * 0.26, E.H * 0.46, 2.2 * (1 + 0.12 * beat), t < tS ? ui.accent : alpha('#8a8698', 0.9)); if (t > tS) label(g, t, 'HEART STOPS', E.W * 0.26, E.H * 0.72, tS, { size: V(44, 44), color: ui.accent });
  const kb = popIn(t, tB); if (kb > 0) { g.strokeStyle = c; g.lineWidth = 6; for (const dx of [-0.32, 0.32]) { g.beginPath(); g.ellipse(E.W * 0.68 + dx * 120, E.H * 0.42, 120 * 0.42 * kb, 120 * 0.6 * kb, 0, 0, 7); g.stroke(); } label(g, t, 'BRAIN NEEDS OXYGEN', E.W * 0.68, E.H * 0.72, tB, { size: V(40, 40), color: c }); }
  UI.readout(g, { label: 'DAMAGE CAN START AFTER', value: 'A FEW MINUTES', x: E.W / 2, y: E.H * 0.88, align: 'center', color: ui.accent, a: clamp(popIn(t, tM)) });
} });
registerShot('s107', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1, z1: 1.04 })); const s = Math.floor(t * 2) * 0.5; bigClock(g, E.W / 2, E.H * 0.48, V(300, 260), 5 + s * 1, { hand: '#e04a3a' }); label(g, t, 'EVERY REAL SECOND COUNTS', E.W / 2, E.H * 0.86, 0.2, { size: V(46, 44), color: S().ui.accent }); } });
registerShot('s108', { draw(g, t, info) { frozenKitchen(g, t, push(t, info, { z0: 1.05, z1: 1.1 })); yearBadge(g, t, 'DAY ' + Math.round(60 + t * 30), 0); } });
registerShot('s109', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), steps = ['CHECK & CALL FOR HELP', 'HANDS ON CENTRE OF CHEST', 'PUSH HARD, PUSH FAST'];
  steps.forEach((s, i) => { const k = popIn(t, 0.2 + i * 0.45); if (k <= 0) return; const y = E.H * (0.3 + i * 0.2); g.save(); g.translate(E.W * 0.22, y); g.scale(k, k); circle(g, 0, 0, 40, ui.gold); text(g, String(i + 1), 0, 2, { size: 44, color: ui.bpBg, font: FONTS.title, weight: 700 }); g.restore(); text(g, s, E.W * 0.22 + 80, y, { size: V(48, 42), color: c, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(k) }); });
} });
registerShot('s110', { draw(g, t, info) { aidClass(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: 60, x1: 70, y0: 130, y1: 135 })); soft(g); const n = Math.round(1000 * ease.in(prog(t, 0.3, info.dur - 0.3))); UI.badge(g, { str: 'x' + n, a: 1, size: V(60, 60) }); } });
registerShot('s111', { draw(g, t, info) { frozenKitchen(g, t, push(t, info, { z0: 1.0, z1: 1.04, x0: 20, x1: -20 }), { tintA: 0.28 }); FX.dust(g, t * 0.2, { count: 50, color: '#cfe0ff', a: 0.35, speed: 2 }); yearBadge(g, t, 'DAY 200', 0); } });
registerShot('s112', { draw(g, t, info) { const k = KX(); frozenKitchen(g, t, push(t, info, { z0: 1.7, z1: 1.74, x0: k.gp - E.W / 2 - 20, x1: k.gp - E.W / 2 - 10, y0: 200, y1: 202 })); label(g, t, 'SORT OF', E.W * 0.72, E.H * 0.26, wt(info, 'sort', 1.6) - 0.1, { size: V(52, 52), color: S().ui.cream }); } });
registerShot('s113', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1.0, z1: 0.94 })); label(g, t, 'NOTHING ENDS', E.W / 2, E.H * 0.46, 0.05, { size: V(80, 72), color: S().ui.cream, font: FONTS.title }); } });
registerShot('s114', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 0.92 }), r = voidSpace(g, t, cam), ui = S().ui;
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: r.GY, s: 0.9, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'neutral', face: HELD, rim: { color: '#8fb8e8', dir: [0, -1] }, blink: false }));
  [['A YEAR', 'year'], ['TEN YEARS', 'ten'], ['FOREVER', 'forever']].forEach(([s, w], i) => label(g, t, s, E.W * (0.22 + i * 0.28), E.H * 0.26, wt(info, w, 0.8 + i * 0.8, i ? undefined : 0.5) - 0.1, { size: V(56 + i * 10, 56), color: i === 2 ? ui.accent : ui.cream, font: FONTS.title }));
} });
registerShot('s115', { draw(g, t, info) { const k = KX(); frozenKitchen(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: k.gp - E.W / 2 - 20, x1: k.gp - E.W / 2 - 10, y0: 190, y1: 192 }), { tintA: 0.15 }); glow(g, E.W / 2, E.H * 0.4, 600, '#ffd59a', 0.12); } });
registerShot('s116', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1, z1: 1.05 })); const tC = wt(info, 'clock', 1.2) - 0.1, secs = t > tC ? (t - tC) : 0; bigClock(g, E.W / 2, E.H * 0.48, V(300, 260), 3 + Math.floor(secs * 2) * 0.5 * 6 / 6, { hand: '#e04a3a' }); label(g, t, 'OUT THERE...', E.W / 2, E.H * 0.12 + V(60, 120), 0.1, { size: V(46, 46), color: S().ui.cream }); if (t > tC) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha('#ff4a3a', 0.3 * Math.abs(Math.sin((t - tC) * Math.PI * 2))); g.fillRect(0, 0, E.W, E.H); g.restore(); } } });
registerShot('s117', { draw(g, t, info) {
  const ui = S().ui, tO = wt(info, 'or', 1.7) - 0.1;
  g.save(); g.beginPath(); g.rect(0, 0, E.W / 2 - 4, E.H); g.clip(); g.translate(-E.W * 0.25, 0); frozenKitchen(g, t, { z: 1.2, x: -120, y: 80 }); g.restore();
  g.save(); g.beginPath(); g.rect(E.W / 2 + 4, 0, E.W / 2, E.H); g.clip(); voidSpace(g, t, { z: 1 }); bigClock(g, E.W * 0.75, E.H * 0.5, V(220, 180), 10 + Math.floor(t * 2) * 0.5, { hand: '#e04a3a' }); g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha('#ff4a3a', 0.35); g.fillRect(E.W / 2, 0, E.W / 2, E.H); g.restore(); g.restore();
  seg(g, [[E.W / 2, 0], [E.W / 2, E.H]], 8, '#05060c');
  label(g, t, 'STAY', E.W * 0.25, E.H * 0.2, 0.1, { size: V(64, 60), color: '#cfe0ff', font: FONTS.title }); label(g, t, 'FIGHT FOR HIM', E.W * 0.75, E.H * 0.2, tO, { size: V(56, 54), color: ui.accent, font: FONTS.title });
} });

// ---------- the decision ----------
registerShot('s118', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => frozenKitchen(g2, 0, cam, { tint: false }), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: LEO, expr: 'surprised', face: HELD, side: 1, noBlink: true, zoom: 0.03, front: (g, tt, cx, cy, r) => FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.8, color: S().ui.gold, a: 0.5 }) }); slowTint(g, 0.3); } });
registerShot('s119', { draw(g, t, info) {
  const M = mood('interiorWarm'), ui = S().ui; insertBg(g, t, (g2) => frozenKitchen(g2, 0, { z: 1.6, x: 500, y: -100 }, { tint: false }), null, 0.4);
  recordPlayer(g, E.W * 0.5, E.H * 0.82, V(3.2, 2.6), 0, false, M); const y = E.H * 0.3; g.strokeStyle = ui.gold; g.lineWidth = 8; g.beginPath(); for (let x = E.W * 0.05; x < E.W * 0.95; x += 4) g.lineTo(x, y + Math.sin(x * 0.05 + t * 2) * 30); g.stroke(); glow(g, E.W / 2, y, 600, ui.gold, 0.2 + 0.1 * Math.sin(t * 3));
  slowTint(g, 0.2);
} });
function ghostDance(g, t, cam) { const k = KX(); frozenKitchen(g, 0, cam, { tintA: 0.3 }); layer(g, cam, 1, (g) => { g.save(); g.globalAlpha = 0.55; drawFigure(g, { x: k.gp + 120, y: E.H * V(0.8, 0.68), s: 1.25, facing: 1, outfit: { ...GRANDPA, color: S().ui.gold }, pose: dance(t), expr: 'joy', ink: '#ffd47e', inkFar: '#c8a050', rim: { color: '#fff3d6', dir: [0, -1] } }); g.restore(); notes(g, t, k.gp + 120, E.H * 0.3, { count: 6, spread: 500 }); }); }
registerShot('s120', { draw(g, t, info) { const k = KX(); ghostDance(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: k.gp - E.W / 2 + 40, x1: k.gp - E.W / 2 + 50, y0: 130, y1: 132 })); } });
registerShot('s121', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => frozenKitchen(g2, 0, cam, { tint: false }), bgCam: { z: 1.5, x: -300, y: -150 }, outfit: GRANDPA, expr: 'smile', talk: () => 0.3 + 0.4 * Math.abs(Math.sin(t * 7)) * (t < info.dur - 0.3 ? 1 : 0), side: 1, dx: V(160, 0), rimColor: S().ui.gold, seed: 2 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,200,120,.4)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  label(g, t, '...IF YOU USE IT.', E.W * 0.24, E.H * 0.8, wt(info, 'if', 1.4) - 0.1, { size: V(52, 50), font: FONTS.title });
} });
registerShot('s122', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => frozenKitchen(g2, 0, cam, { tint: false }), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: LEO, expr: 'determined', face: { mouth: 'smallFlat' }, side: 1, noBlink: true, zoom: 0.08 }); slowTint(g, 0.3); yearBadge(g, t, 'DAY 365', 0); } });
registerShot('s123', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1, z1: 1.06 })); UI.bigLine(g, t, { str: 'NOW USE THE SECOND.', dur: info.dur + 0.4, size: V(110, 90) }); } });
