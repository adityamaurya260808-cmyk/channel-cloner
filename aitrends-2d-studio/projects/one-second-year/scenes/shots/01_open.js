// shots/01_open.js: the kitchen freezes (s001-s013), the power and its rules (s014-s027), title (s028).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, label, stamp } from '../lib.js';
import { kitchen, table, bedroom } from '../sets/indoor.js';
import { voidSpace, recordPlayer, glassesProp, spoonProp, bigClock, notes } from '../sets/extra.js';
import { LEO, GRANDPA } from '../cast.js';

// ---------- shared kitchen staging (used again in later files) ----------
export const KX = () => ({ gp: E.W / 2 - V(260, 200), leo: E.W / 2 + V(260, 180), tableX: E.W / 2 + V(430, 300), rp: E.W / 2 - V(620, 380) });
const DANCE = [POSES.cheer, { ...POSES.point, eF: [34, -186], hF: [62, -214] }, POSES.shrug, { ...POSES.wave, kF: [16, -50], fF: [24, -6] }];
export function dance(t, bpm = 100) { const beat = 60 / bpm, i = Math.floor(t / beat), k = (t % beat) / beat; const a = DANCE[i % 4], b = DANCE[(i + 1) % 4]; const p = posesAt(k, [[0, a], [0.55, b]], 0.4); const bob = Math.abs(Math.sin(t * Math.PI / beat)) * 6; const q = { ...p }; for (const kk of ['head', 'sh', 'hip', 'eF', 'hF', 'eB', 'hB']) q[kk] = [p[kk][0], p[kk][1] + bob]; return q; }
export const GP_FALL = { ...POSES.fall, head: [-30, -186], sh: [-24, -156], eF: [20, -196], hF: [40, -226] };
export function kitchenScene(g, t, cam, o = {}) {
  const r = kitchen(g, o.frozen ? 0 : t, cam, { mood: 'interiorWarm', clockT: 15 * 3600 + 20 * 60, clockSpeed: o.frozen ? 0 : 1 });
  const { GY, M, counterTop } = r, k = KX(), s = o.s ?? 1.25, rim = rimOf(M, [-0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    recordPlayer(g, k.rp, counterTop, 0.9, o.frozen ? 0 : t, !o.frozen, M);
    if (!o.frozen && o.notes !== false) notes(g, t, k.rp - 20, counterTop - 70, { count: 4, spread: 200, a: 0.8 });
    if (o.table !== false) { g.save(); g.translate(k.leo, 0); g.scale(-1, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore(); table(g, k.tableX, GY, 300); }
    if (o.gp !== false) drawFigure(g, { x: o.gpX ?? k.gp, y: GY + (o.gpDy || 0), s, facing: o.gpFacing ?? 1, outfit: GRANDPA, pose: o.gpPose || dance(t), rot: o.gpRot || 0, expr: o.gpExpr || 'joy', rim, blink: o.frozen ? false : blinkAt(t, 3.6), shadow: !o.gpRot });
    if (o.leo !== false) drawFigure(g, { x: o.leoX ?? k.leo, y: GY, s, facing: o.leoFacing ?? -1, outfit: LEO, pose: o.leoPose || breathe(POSES.sit, t, 1, 2), expr: o.leoExpr || 'smile', look: o.leoLook, rim, shadow: o.leoPose ? true : false, blink: o.frozen ? false : blinkAt(t, 3.2) });
    o.extra?.(g, r, s);
  });
  if (!o.frozen) FX.dust(g, t, { count: 45, color: '#ffe2bd', a: 0.3 }); else FX.drops(g, t, { count: 40, rMax: 5, drift: 1.5, color: '#cfe0ff' });
  return r;
}
// the frozen kitchen: Grandpa mid-fall, glasses and spoon hanging, blue tint
export function frozenKitchen(g, t, cam, o = {}) {
  const k = KX();
  const r = kitchenScene(g, t, cam, { frozen: true, gpPose: GP_FALL, gpRot: -0.35, gpExpr: 'surprised', leoPose: o.leoPose || { ...POSES.reach, eF: [30, -150], hF: [56, -150] }, leoExpr: o.leoExpr || 'shocked', leoLook: [-1, 0.2], table: o.table,
    extra: (g, r, s) => { glassesProp(g, k.gp - 40, r.GY - 300 * s, 0.7, 0.4); spoonProp(g, k.gp + 120, r.GY - 60, 0.8, 0.6); o.extra?.(g, r, s); } });
  if (o.tint !== false) slowTint(g, o.tintA ?? 0.32);
  return r;
}
export const yearBadge = (g, t, str = '1 SECOND = 1 YEAR', at = 0.3) => slowBadge(g, t, str, at);
// breath-held face override: tight mouth + puffed cheeks drawn on top
export const HELD = { mouth: 'smallFlat', brows: 'raised' };
export function cheeks(g, cx, cy, r, a = 1) { for (const s of [-1, 1]) { g.strokeStyle = alpha(S().ink, 1); g.lineWidth = r * 0.06; g.beginPath(); g.arc(cx + s * r * 0.92, cy + r * 0.3, r * 0.16 * a, s > 0 ? -1.2 : Math.PI - 1.2 + 2.4 - 2.4, s > 0 ? 1.2 : Math.PI + 1.2); g.stroke(); } }

// ---------- cold open ----------
registerShot('s001', { draw(g, t, info) { kitchenScene(g, t, push(t, info, { z0: 1.0, z1: 1.07, x0: -40, x1: 0 })); } });
registerShot('s002', { draw(g, t, info) {
  const k = KX(); kitchenScene(g, t, push(t, info, { z0: 1.55, z1: 1.62, x0: k.gp - E.W / 2 - 60, x1: k.gp - E.W / 2 - 40, y0: 170, y1: 175 }), { leo: false, table: false });
} });
registerShot('s003', { draw(g, t, info) {
  const M = mood('interiorWarm'), cam = push(t, info, { z0: 1.0, z1: 1.06 }), slip = ease.in(prog(t, 0.3, 1.4));
  insertBg(g, t, (g2, tt) => kitchen(g2, tt, { z: 1.8, x: -500, y: -100 }, { mood: 'interiorWarm' }), null, 0.35);
  layer(g, cam, 1, (g) => {
    const cy = E.H * 0.56, edge = E.W * 0.6; rr(g, -100, cy, edge + 100, 50, 6); g.fillStyle = shade(M.wall, -0.1); g.fill(); g.fillStyle = shade(M.wall, -0.45); g.fillRect(-100, cy + 50, edge + 100, E.H);
    g.fillStyle = alpha(M.key, 0.35); g.fillRect(-100, cy, edge + 100, 4);
    const hx = lerp(E.W * 0.46, E.W * 0.66, slip), hy = cy - 10 + Math.max(0, hx - edge) * 1.6, ink = S().ink;
    seg(g, [[hx, hy], [E.W + 300, hy + 260]], 70, ink); seg(g, [[hx + 160, hy + 80], [E.W + 300, hy + 260]], 96, GRANDPA.color);
    for (let i = 0; i < 4; i++) seg(g, [[hx, hy], [hx - 70 + slip * 40, hy - 10 + i * 16 + slip * 30]], 16, ink); circle(g, hx, hy + 6, 34, ink);
    if (slip > 0 && slip < 0.6) FX.speedLines(g, t, { cx: hx, cy: hy, count: 20, a: 0.15 });
  });
} });
registerShot('s004', { draw(g, t, info) {
  const k = KX(), fold = ease.inOut(prog(t, 0.1, 1.2));
  kitchenScene(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: -60, x1: -50, y0: 120, y1: 125 }), { gpPose: posesAt(t, [[0, POSES.relaxed], [0.15, POSES.crouch]], 0.6), gpRot: -0.15 * fold, gpExpr: 'scared', leoExpr: t > 0.5 ? 'shocked' : 'smile', leoLook: [-1, 0], notes: t < 0.4 });
} });
registerShot('s005', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam, { mood: 'interiorWarm' }), bgCam: { z: 1.6, x: -300, y: -150 }, outfit: LEO, expr: 'shocked', side: 1, dx: V(160, 0), look: [-0.8, 0.2], zoom: 0.1, noBlink: true });
} });
registerShot('s006', { draw(g, t, info) { frozenKitchen(g, t, push(t, info, { z0: 1.12, z1: 1.16, r: 0.012 })); yearBadge(g, t, 'TIME STOPS', 0.1); } });
registerShot('s007', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => frozenKitchen(g2, 0, { z: 1.8, x: -300, y: -150 }, { tint: false })); veil(g, '#0a0710', 0.3);
  const cam = push(t, info, { z0: 1.0, z1: 1.06, r: 0.02 }); layer(g, cam, 1, (g) => { FX.drops(g, t, { count: 30, rMax: 8, drift: 2 }); glassesProp(g, E.W / 2, E.H * 0.46, V(4.2, 3.6), 0.25 + Math.sin(t * 0.4) * 0.02); FX.rings(g, E.W / 2, E.H * 0.46, t, { count: 2, r0: 260, r1: 600, speed: 0.3, color: '#e8f0ff', a: 0.25 }); });
  slowTint(g, 0.32); yearBadge(g, t, '0.0 s', 0.2);
} });
registerShot('s008', { draw(g, t, info) {
  const M = mood('interiorWarm'), GY = E.H * 0.8, cam = push(t, info, { z0: 1.0, z1: 1.06, x0: 20, x1: -20 });
  layer(g, cam, 0.4, (g) => { blurLayer(g, 14, (g2) => frozenKitchen(g2, 0, { z: 2.0, x: -300, y: 360 }, { tint: false })); veil(g, '#0a0710', 0.25); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H + 200, [shade(M.floor, 0.12), shade(M.dark, -0.1)]); g.fillRect(-E.W, GY, E.W * 3, E.H); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; for (let x = -E.W; x < E.W * 2; x += 220) { g.beginPath(); g.moveTo(x, GY); g.lineTo(E.W / 2 + (x - E.W / 2) * 2.2, E.H + 200); g.stroke(); } });
  layer(g, cam, 1, (g) => { spoonProp(g, E.W * 0.5, GY - 160, V(3.4, 3), 0.35); seg(g, [[E.W * 0.5, GY - 120], [E.W * 0.5, GY - 6]], 2, alpha('#ffffff', 0.25)); UI.dimension(g, t, { x1: E.W * 0.68, y1: GY - 160, x2: E.W * 0.68, y2: GY - 6, str: 'FLOATING', start: 0.4 }); });
  slowTint(g, 0.3);
} });
registerShot('s009', { draw(g, t, info) {
  const M = mood('interiorWarm'), cam = push(t, info, { z0: 1.0, z1: 1.05 }), ui = S().ui;
  insertBg(g, t, (g2) => frozenKitchen(g2, 0, { z: 1.6, x: 500, y: -100 }, { tint: false }), null, 0.4);
  layer(g, cam, 1, (g) => { recordPlayer(g, E.W * 0.5, E.H * 0.82, V(3.2, 2.6), 0, false, M);
    const y = E.H * 0.3, k = ease.inOut(prog(t, 0, info.dur)); g.strokeStyle = ui.gold; g.lineWidth = 6; g.beginPath(); for (let x = E.W * 0.1; x < E.W * (0.1 + 0.8 * k); x += 4) g.lineTo(x, y + Math.sin(x * 0.05) * 30); g.stroke(); glow(g, E.W * (0.1 + 0.8 * k), y, 80, ui.gold, 0.7); });
  label(g, t, 'ONE LONG NOTE', E.W / 2, E.H * 0.16, 0.6, { size: V(44, 48), color: S().ui.cream });
  slowTint(g, 0.3);
} });
registerShot('s010', { draw(g, t, info) { frozenKitchen(g, t, push(t, info, { z0: 1.12, z1: 1.0, ease: ease.out })); } });
registerShot('s011', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => frozenKitchen(g2, 0, cam, { tint: false }), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: LEO, expr: 'shocked', side: 1, look: [-0.8, 0.2], noBlink: true, zoom: 0.03 });
  slowTint(g, 0.32);
} });
registerShot('s012', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.0, y0: 60, y1: 0, ease: ease.out });
  const { GY } = voidSpace(g, t, cam);
  layer(g, cam, 0.95, (g) => { g.save(); g.translate(E.W / 2, GY + 40); g.scale(1, 0.32); bigClock(g, 0, 0, V(820, 600), 12.0, { face: '#e8e2da' }); g.restore(); glow(g, E.W / 2, GY + 40, 900, '#cfe0ff', 0.12); });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: GY + 30, s: 0.9, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'awe', look: [0, -1], rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false }));
  label(g, t, 'A SINGLE SECOND', E.W / 2, E.H * 0.18, 0.5, { size: V(52, 56), color: S().ui.cream });
} });
registerShot('s013', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }), ui = S().ui;
  voidSpace(g, t, cam);
  const day = Math.max(1, Math.round(365 * ease.in(prog(t, 0.2, info.dur - 0.2))));
  layer(g, cam, 1, (g) => { const x = E.W / 2, y = E.H * 0.48, w = V(360, 320), h = V(420, 380);
    for (let i = 3; i >= 1; i--) { rr(g, x - w / 2 + i * 10, y - h / 2 + i * 10, w, h, 16); g.fillStyle = alpha('#efe6d2', 0.25); g.fill(); }
    rr(g, x - w / 2, y - h / 2, w, h, 16); g.fillStyle = '#efe6d2'; g.fill(); rr(g, x - w / 2, y - h / 2, w, 80, 16); g.fillStyle = '#c0443a'; g.fill();
    text(g, 'DAY', x, y - h / 2 + 42, { size: 40, color: '#fff', font: FONTS.ui, weight: 900, spacing: 6 }); text(g, String(day), x, y + 40, { size: V(170, 150), color: '#2a2230', font: FONTS.title, weight: 700 }); });
  label(g, t, '1 SECOND = 1 YEAR', E.W / 2, E.H * 0.8, 0.3, { size: V(56, 56) });
} });

// ---------- the power ----------
function room(g, t, cam, o = {}) {
  const r = bedroom(g, t, cam, { mood: o.mood || 'interiorWarm', doorGlow: 0.3 });
  layer(g, cam, 1, (g) => { if (o.leo !== false) drawFigure(g, { x: o.x ?? E.W / 2 + V(250, 160), y: r.GY - 30, s: 1.25, facing: o.facing ?? -1, outfit: LEO, pose: o.pose || breathe(POSES.sit, t), expr: o.expr || 'neutral', face: o.face, talk: o.talk || 0, rim: rimOf(r.M, [-0.6, -0.8]), shadow: false, blink: o.blink ?? blinkAt(t, 3.2) }); o.extra?.(g, r); });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  return r;
}
registerShot('s014', { draw(g, t, info) { room(g, t, push(t, info, { z0: 1.05, z1: 1.12, x0: 120, x1: 160, y0: 40, y1: 50 }), { expr: 'sleepy' }); label(g, t, 'THREE WEEKS EARLIER', E.W / 2, V(150, 240), 0.3, { size: V(48, 50), color: S().ui.cream }); } });
registerShot('s015', { draw(g, t, info) {
  room(g, t, push(t, info, { z0: 1.6, z1: 1.68, x0: 260, x1: 270, y0: 160, y1: 165 }), { expr: 'smile', pose: breathe({ ...POSES.sit, eF: [24, -150], hF: [36, -190] }, t) });
  label(g, t, 'LEO', E.W * 0.26, E.H * 0.56, wt(info, 'leo', 0.4) - 0.1, { size: V(90, 90), font: FONTS.title });
  label(g, t, 'AGE 15', E.W * 0.26, E.H * 0.68, wt(info, 'fifteen', 1.5) - 0.1, { size: V(54, 56), color: S().ui.cream });
} });
registerShot('s016', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, n = Math.round(31500000 * ease.inOut(prog(t, 0.3, wt(info, 'million', 2.4) + 0.4)));
  text(g, 'ONE YEAR', E.W / 2, E.H * 0.3, { size: V(48, 50), color: UI.bpStroke(), font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, n.toLocaleString('en-US'), E.W / 2, E.H * 0.5, { size: V(150, 110), color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.6) });
  text(g, 'SECONDS', E.W / 2, E.H * 0.68, { size: V(52, 52), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8 });
} });
registerShot('s017', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui;
  for (let i = 0; i < 5; i++) { const x = E.W * (0.16 + i * 0.17), y = E.H * 0.62; UI.lineFigure(g, { x, y, s: 0.9, pose: POSES.stand, color: alpha(c, 0.85) }); const k = clamp((t - i * 0.25) % 1); ring(g, x + 10, y - 270, 30, 3, alpha(c, 0.4)); g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.arc(x + 10, y - 270, 30, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); g.stroke(); text(g, '1 s', x + 10, y - 270, { size: 22, color: c, font: FONTS.ui, weight: 900 }); }
  label(g, t, 'JUST A SECOND', E.W / 2, E.H * 0.84, wt(info, 'just', 2.4) - 0.1, { size: V(56, 56), color: ui.cream });
} });
registerShot('s018', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => bedroom(g2, tt, cam, { mood: 'interiorWarm' }), bgCam: { z: 1.6, x: 200, y: -150 }, outfit: LEO, expr: 'smirk', side: -1, dx: -V(120, 0) }); } });
registerShot('s019', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0.2, 1.2));
  const f = faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => bedroom(g2, k > 0.5 ? 0 : tt, cam, { mood: 'interiorWarm' }), bgCam: { z: 1.5, x: 200, y: -150 }, outfit: LEO, expr: 'neutral', face: k > 0.3 ? HELD : null, side: -1, dx: -V(220, 0), noBlink: true, zoom: 0.05,
    });
  slowTint(g, 0.32 * k); if (k > 0.5) FX.drops(g, t, { count: 30, rMax: 5, drift: 1 });
  label(g, t, '1 SECOND', E.W * V(0.72, 0.5), E.H * V(0.36, 0.18), wt(info, 'second', 1.2), { size: V(64, 60), color: S().ui.cream, font: FONTS.title });
  label(g, t, '= 1 YEAR', E.W * V(0.72, 0.5), E.H * V(0.5, 0.26), wt(info, 'year', 2.6) - 0.1, { size: V(80, 74), font: FONTS.title });
} });
function think(g, x, y, s, c) { g.strokeStyle = c; g.lineWidth = 5; for (const dx of [-0.32, 0.32]) { g.beginPath(); g.ellipse(x + dx * s, y, s * 0.42, s * 0.6, 0, 0, 7); g.stroke(); } }
function photo(g, x, y, s, c) { rr(g, x - s * 0.7, y - s * 0.55, s * 1.4, s * 1.1, 8); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); poly(g, [[x - s * 0.5, y + s * 0.35], [x - s * 0.1, y - s * 0.1], [x + s * 0.2, y + s * 0.2], [x + s * 0.5, y + s * 0.35]], alpha(c, 0.6)); circle(g, x + s * 0.3, y - s * 0.25, s * 0.12, c); }
function checklist(g, x, y, s, c) { rr(g, x - s * 0.6, y - s * 0.75, s * 1.2, s * 1.5, 8); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); for (let i = 0; i < 3; i++) { seg(g, [[x - s * 0.4, y - s * 0.35 + i * s * 0.35], [x - s * 0.3, y - s * 0.25 + i * s * 0.35], [x - s * 0.15, y - s * 0.45 + i * s * 0.35]], 4, c); seg(g, [[x, y - s * 0.35 + i * s * 0.35], [x + s * 0.4, y - s * 0.35 + i * s * 0.35]], 4, c); } }
registerShot('s020', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  [['THINK', 'think', think], ['REMEMBER', 'remember', photo], ['PLAN', 'plan', checklist]].forEach(([lab, w, fn], i) => { const at = wt(info, w, 0.2 + i * 1.2) - 0.1, k = popIn(t, at); if (k <= 0) return; const x = E.W * (0.22 + i * 0.28), y = E.H * 0.46;
    g.save(); g.translate(x, y); g.scale(k, k); glow(g, 0, 0, 180, ui.gold, 0.3); fn(g, 0, 0, 90, ui.gold); g.restore(); text(g, lab, x, y + 170, { size: V(46, 46), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: clamp(k) }); });
  text(g, 'A YEAR TO...', E.W / 2, E.H * 0.16, { size: V(44, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: clamp(prog(t, 0, 0.3)) });
} });
registerShot('s021', { draw(g, t, info) { voidSpace(g, t, push(t, info, { z0: 1, z1: 1.04 })); UI.bigLine(g, t, { str: 'BUT THERE’S A RULE.', dur: info.dur + 0.4, size: V(110, 90), color: S().ui.accent }); } });
function lockIcon(g, x, y, s, c) { rr(g, x - s * 0.6, y - s * 0.1, s * 1.2, s, s * 0.15); g.fillStyle = c; g.fill(); g.strokeStyle = c; g.lineWidth = s * 0.16; g.beginPath(); g.arc(x, y - s * 0.1, s * 0.4, Math.PI, 0); g.stroke(); circle(g, x, y + s * 0.35, s * 0.12, S().ui.bpBg); }
function mindBody(g, t, info, mode) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, fx = E.W * 0.36, fy = E.H * 0.88, s = 2.6, hx = fx + 4 * s, hy = fy - 208 * s;
  UI.lineFigure(g, { x: fx, y: fy, s, pose: POSES.stand, color: mode === 'body' ? alpha('#8a8698', 0.9) : alpha(c, 0.5) });
  glow(g, hx, hy, 170, ui.gold, mode === 'mind' ? 0.5 : 0.25); think(g, hx, hy, 34, ui.gold);
  if (mode === 'mind') { for (let i = 0; i < 10; i++) { const a = i * 0.63 + t * 0.8, d = 70 + ((t * 120 + i * 37) % 140); FX.sparkle(g, hx + Math.cos(a) * d, hy + Math.sin(a) * d, 12, ui.gold, 0.6); } label(g, t, 'MIND: FREE', E.W * 0.68, E.H * 0.42, 0.2, { size: V(64, 60), font: FONTS.title }); }
  if (mode === 'body') { const k = popIn(t, 0.4); g.save(); g.translate(fx + 20, fy - 130 * s); g.scale(k, k); lockIcon(g, 0, 0, 70, ui.accent); g.restore(); label(g, t, 'BODY: LOCKED', E.W * 0.68, E.H * 0.42, 0.3, { size: V(64, 60), color: ui.accent, font: FONTS.title }); }
}
registerShot('s022', { draw(g, t, info) { mindBody(g, t, info, 'mind'); } });
registerShot('s023', { draw(g, t, info) { mindBody(g, t, info, 'body'); } });
registerShot('s024', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => bedroom(g2, 0, { z: 1.6, x: 300, y: -100 }, { mood: 'interiorWarm' })); veil(g, '#0a0710', 0.35);
  const ink = S().ink, x = E.W * 0.45, y = E.H * 0.6, cam = push(t, info, { z0: 1.0, z1: 1.05 });
  layer(g, cam, 1, (g) => { seg(g, [[x, y], [x - 600, y + 400]], 90, ink); seg(g, [[x - 200, y + 140], [x - 700, y + 480]], 120, LEO.color); circle(g, x + 20, y - 10, 70, ink); seg(g, [[x + 40, y - 40], [x + 180, y - 160]], 26, ink); for (let i = 0; i < 3; i++) seg(g, [[x + 50, y - 10 + i * 24], [x + 100, y + 10 + i * 24]], 24, ink);
    seg(g, [[x + 36, y - 46], [x + 172, y - 170]], 4, alpha('#ffc68a', 0.6)); const k = popIn(t, 0.25); g.save(); g.translate(x + 300, y - 260); g.scale(k, k); lockIcon(g, 0, 0, 80, S().ui.accent); g.restore(); });
  slowTint(g, 0.3);
} });
registerShot('s025', { draw(g, t, info) {
  const f = faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => bedroom(g2, 0, cam, { mood: 'interiorWarm' }), bgCam: { z: 1.5, x: 200, y: -150 }, outfit: LEO, expr: 'neutral', face: HELD, side: -1, noBlink: true, zoom: 0.03 });
  const ui = S().ui, k = popIn(t, 0.2); for (const s of [-1, 1]) { const ex = f.cx + s * f.r * 0.34, ey = f.cy - f.r * 0.16; ring(g, ex, ey, f.r * 0.32 * k, 4, ui.accent); seg(g, [[ex - f.r * 0.42 * k, ey], [ex - f.r * 0.24 * k, ey]], 4, ui.accent); seg(g, [[ex + f.r * 0.24 * k, ey], [ex + f.r * 0.42 * k, ey]], 4, ui.accent); }
  slowTint(g, 0.3); label(g, t, 'EYES: LOCKED', E.W * 0.82, E.H * 0.2, 0.5, { size: V(44, 44), color: ui.accent });
} });
registerShot('s026', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), tC = wt(info, "can't", 2.0) - 0.1;
  seg(g, [[E.W / 2, E.H * 0.18], [E.W / 2, E.H * 0.82]], 3, alpha(c, 0.4));
  think(g, E.W * 0.25, E.H * 0.42, 90, ui.gold); glow(g, E.W * 0.25, E.H * 0.42, 200, ui.gold, 0.3); label(g, t, 'THINK ANYTHING', E.W * 0.25, E.H * 0.7, 0.2, { size: V(46, 44) });
  const k = popIn(t, tC); if (k > 0) { UI.lineFigure(g, { x: E.W * 0.75, y: E.H * 0.6, s: 1, pose: POSES.stand, color: alpha('#8a8698', 0.9) }); g.save(); g.translate(E.W * 0.75, E.H * 0.42); g.scale(k, k); seg(g, [[-110, -110], [110, 110]], 18, ui.accent); seg(g, [[110, -110], [-110, 110]], 18, ui.accent); g.restore(); label(g, t, 'DO NOTHING', E.W * 0.75, E.H * 0.7, tC, { size: V(46, 44), color: ui.accent }); }
} });
registerShot('s027', { draw(g, t, info) {
  const tB = wt(info, 'breathe', 1.0), k = 1 - ease.out(prog(t, tB, tB + 0.6));
  const r = room(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: 260, x1: 270, y0: 160, y1: 165 }), { face: k > 0.3 ? HELD : { mouth: 'o' }, expr: 'neutral', blink: k > 0.3 ? false : undefined });
  if (t > tB) { const p = prog(t, tB, tB + 1.2), [hx, hy] = headPos({ x: E.W / 2 + V(250, 160), y: r.GY - 30, s: 1.25, facing: -1, pose: POSES.sit }); for (let i = 0; i < 6; i++) circle(g, hx - 40 - p * 160 - i * 18, hy + 10 + Math.sin(i) * 10, (10 + i * 4) * p, alpha('#ffffff', 0.25 * (1 - p))); }
  slowTint(g, 0.32 * k);
} });
registerShot('s028', { draw(g, t, info) {
  const M = mood('dusk'), cam = { z: 1.06 - 0.06 * ease.inOut(t / info.dur), y: -20 * t };
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); FX.sun(g, E.W / 2, E.H * V(0.64, 0.56), V(90, 110), '#fff3dc', M.key, 5); FX.godRays(g, E.W / 2, E.H * V(0.64, 0.56), { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.6, len: 1800, a: 0.06, t: 0 }); });
  layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -200, y: E.H * V(0.76, 0.66), w: E.W + 400, maxH: V(300, 500), color: shade(M.wall, -0.35), windowColor: alpha(M.practical, 0.8), seed: 21 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = shade(M.dark, -0.2); g.fillRect(-E.W, E.H * V(0.76, 0.66), E.W * 3, E.H); });
  FX.drops(g, t, { count: 40, rMax: 6, drift: 1.5, color: '#ffd9b0' });
  UI.titleCard(g, t, { lines: ['WHAT IF ONE SECOND', 'FELT LIKE A YEAR?'], dur: info.dur, y: E.H * V(0.4, 0.38) });
} });
