// shots/02_plus.js: the maths test (s029-s038), chess club (s039-s045), the penalty (s046-s055).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix, rng,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, label, stamp, ball } from '../lib.js';
import { classroom, desk } from '../sets/indoor.js';
import { pitch, goal } from '../sets/extra.js';
import { HELD, yearBadge } from './01_open.js';
import { LEO, JAKE, TEACHER, CHAMP, STRIKER, EXTRA, EXTRA2 } from '../cast.js';

const chapter = (g, t, str, color, at = 0.2) => { const k = popIn(t, at); if (k <= 0) return; g.save(); g.translate(V(170, 140), V(120, 170)); g.scale(k, k); rr(g, -110, -40, 220, 80, 40); g.fillStyle = alpha(color, 0.18); g.fill(); g.strokeStyle = color; g.lineWidth = 4; g.stroke(); text(g, str, 0, 2, { size: 46, color, font: FONTS.title, weight: 700, spacing: 4, glow: 16, glowColor: alpha(color, 0.6) }); g.restore(); };
export { chapter };
const WRITE = { ...POSES.sit, head: [14, -176], eF: [34, -110], hF: [58, -116], eB: [26, -112], hB: [50, -118] };

// ---------- maths test ----------
const CL = () => ({ teacher: E.W * 0.2, d1: E.W * 0.4, leo: E.W * 0.6, d3: E.W * 0.8 });
function exam(g, t, cam, o = {}) {
  const frozen = !!o.frozen, tt = frozen ? 0 : t;
  const { GY, M } = classroom(g, tt, cam, { clockT: 10 * 3600 + 15 * 60, clockSpeed: frozen ? 0 : 1 });
  const c = CL(), s = 1.2, rim = rimOf(M, [0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: c.teacher, y: GY, s: s * 1.05, facing: 1, outfit: TEACHER, pose: o.teacherPose || breathe(POSES.crossArms, tt, 1, 3), expr: o.teacherExpr || 'neutral', talk: o.teacherTalk || 0, rim, blink: frozen ? false : blinkAt(tt, 3.6) });
    for (const [x, of, sd] of [[c.d1, EXTRA, 1], [c.leo, LEO, 2], [c.d3, EXTRA2, 3]]) {
      desk(g, x + 70 * s, GY); g.save(); g.translate(x, 0); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore();
      const isLeo = of === LEO; drawFigure(g, { x, y: GY, s, facing: 1, outfit: of, pose: isLeo && o.leoPose ? o.leoPose : breathe(WRITE, tt, 0.5, sd), expr: isLeo ? (o.leoExpr || 'thinking') : 'nervous', face: isLeo ? o.leoFace : null, talk: isLeo ? o.leoTalk || 0 : 0, rim, shadow: false, blink: frozen ? false : blinkAt(tt, 3 + sd * 0.2) });
      g.fillStyle = '#efe6d2'; g.fillRect(x + 50 * s, GY - 132 * s, 60, 6);
    }
    o.extra?.(g, GY, s);
  });
  if (frozen) { slowTint(g, 0.3); FX.drops(g, t, { count: 30, rMax: 4, drift: 1 }); } else FX.dust(g, t, { count: 35, color: '#ffe2bd', a: 0.28 });
  return { GY, M };
}
registerShot('s029', { draw(g, t, info) { exam(g, t, push(t, info, { z0: 1.0, z1: 1.07, x0: -30, x1: 20, y0: 40, y1: 50 })); label(g, t, 'MATHS TEST', E.W / 2, V(140, 240), 0.5, { size: V(46, 48), color: S().ui.cream }); } });
function paper(g, t, lines, o = {}) {
  const w = V(1100, 860), h = V(640, 1000), x = (E.W - w) / 2, y = (E.H - h) / 2 + 20;
  rr(g, x, y, w, h, 10); g.fillStyle = '#f2ead8'; g.fill(); for (let i = 1; i < 12; i++) { g.fillStyle = 'rgba(80,120,200,.18)'; g.fillRect(x + 30, y + i * h / 12, w - 60, 2); }
  lines.forEach(([str, yy, c, size, at], i) => { if (t < (at ?? 0)) return; text(g, str, x + 80, y + yy, { size: size || 44, color: c || '#2a2230', font: FONTS.ui, weight: 900, align: 'left', alpha: clamp((t - (at ?? 0)) * 4) }); });
  return { x, y, w, h };
}
registerShot('s030', { draw(g, t, info) {
  insertBg(g, t, (g2, tt) => classroom(g2, tt, { z: 1.8, x: 200, y: -100 }), null, 0.4);
  layer(g, push(t, info, { z0: 1.0, z1: 1.08 }), 1, (g) => paper(g, t, [['QUESTION 7', 90, '#c0443a', 54], ['Solve for x:', 190], ['3x² + 7x - 20 = 0', 290, '#2a2230', 64]]));
} });
registerShot('s031', { draw(g, t, info) {
  const tH = 0.3, tY = wt(info, 'year', 2.0) - 0.1, k = ease.inOut(prog(t, tH, tH + 0.6));
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => classroom(g2, k > 0.5 ? 0 : tt, cam), bgCam: { z: 1.5, x: 200, y: -150 }, outfit: LEO, expr: 'neutral', face: k > 0.3 ? HELD : null, side: -1, dx: -V(200, 0), noBlink: k > 0.3, zoom: 0.05 });
  slowTint(g, 0.32 * k); if (t > tY) yearBadge(g, t - tY, 'DAY 1', 0);
} });
function bubble(g, t, draw, o = {}) {
  const ui = S().ui, k = popIn(t, o.at ?? 0.05); if (k <= 0) return; const bx = o.x ?? E.W * 0.33, by = o.y ?? E.H * 0.3, w = o.w ?? V(700, 640), h = o.h ?? V(380, 400);
  g.save(); g.translate(bx, by); g.scale(k, k); rr(g, -w / 2, -h / 2, w, h, 60); g.fillStyle = alpha(ui.cream, 0.95); g.fill(); draw(g, -w / 2, -h / 2, w, h); g.restore();
  for (let i = 0; i < 3; i++) circle(g, bx + w * 0.25 + i * 40, by + h * 0.5 + 30 + i * 30, (16 - i * 4) * k, alpha(ui.cream, 0.95));
}
const examCam = (t, info) => push(t, info, { z0: 1.35, z1: 1.4, x0: 120, x1: 130, y0: 120, y1: 125 });
const tick = (g, x, y, s, c) => seg(g, [[x - s * 0.5, y], [x - s * 0.15, y + s * 0.4], [x + s * 0.6, y - s * 0.5]], s * 0.18, c);
registerShot('s032', { draw(g, t, info) {
  exam(g, t, examCam(t, info), { frozen: true, leoFace: HELD, leoExpr: 'neutral' });
  bubble(g, t, (g, x, y, w, h) => { text(g, '(3x - 5)(x + 4) = 0', x + w / 2, y + h * 0.4, { size: 44, color: '#2a2230', font: FONTS.ui, weight: 900 }); text(g, 'x = 5/3', x + w / 2, y + h * 0.66, { size: 52, color: '#2f8a5a', font: FONTS.title, weight: 700, alpha: clamp((t - 0.4) * 4) }); if (t > 0.6) tick(g, x + w * 0.82, y + h * 0.64, 50, '#2f8a5a'); });
  yearBadge(g, t, 'DAY 3', 0);
} });
registerShot('s033', { draw(g, t, info) {
  exam(g, t, examCam(t, info), { frozen: true, leoFace: HELD, leoExpr: 'neutral' });
  bubble(g, t, (g, x, y, w, h) => { ['FACTORING', 'FORMULA', 'GRAPH', 'COMPLETE SQUARE'].forEach((m, i) => { const at = i * 0.4; if (t < at) return; text(g, m, x + 60, y + 70 + i * 74, { size: 36, color: '#2a2230', font: FONTS.ui, weight: 900, align: 'left' }); tick(g, x + w - 80, y + 70 + i * 74, 34, '#2f8a5a'); }); });
  yearBadge(g, t, 'DAY 40', 0);
} });
registerShot('s034', { draw(g, t, info) {
  exam(g, t, examCam(t, info), { frozen: true, leoFace: { mouth: 'flat', eyes: 'dot', brows: null }, leoExpr: 'sleepy' });
  bubble(g, t, (g, x, y, w, h) => { const n = 6, cs = (h - 80) / n, gx = x + w / 2 - cs * n / 2, gy = y + 40; const k = Math.floor(clamp(t / (info.dur * 0.8)) * 36);
    for (let i = 0; i < 36; i++) { const cx = gx + (i % n) * cs, cy = gy + Math.floor(i / n) * cs; if (i > k) continue; g.fillStyle = (i + Math.floor(i / n)) % 2 ? '#d64a33' : '#3a6ea5'; g.globalAlpha = 0.85; g.fillRect(cx + 2, cy + 2, cs - 4, cs - 4); g.globalAlpha = 1; }
    for (let i = 0; i < 5; i++) if (k > 10 + i * 5) circle(g, gx + (i * 2 % n + 0.5) * cs, gy + ((i * 3) % n + 0.5) * cs, cs * 0.3, '#f2c21a'); text(g, 'LEO’S GAME', x + w / 2, y + h - 18, { size: 26, color: '#2a2230', font: FONTS.ui, weight: 900, alpha: clamp(t - 1) }); }, { w: V(560, 520), h: V(460, 460) });
  yearBadge(g, t, 'DAY 300', 0);
} });
registerShot('s035', { draw(g, t, info) { const k = 1 - ease.out(prog(t, 0, 0.6)); exam(g, t, examCam(t, info), { leoFace: { mouth: 'o' }, leoExpr: 'neutral' }); slowTint(g, 0.3 * k); } });
registerShot('s036', { draw(g, t, info) {
  insertBg(g, t, (g2, tt) => classroom(g2, tt, { z: 1.6, x: -300, y: -100 }), null, 0.35);
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }); layer(g, cam, 1, (g) => FX.clock(g, E.W / 2, E.H * 0.5, V(300, 260), 10 * 3600 + 15 * 60 + 1 + t * 0.2, { face: '#efe8e0' }));
  label(g, t, '+1 SECOND', E.W * 0.78, E.H * 0.24, 0.5, { size: V(52, 52), color: S().ui.cream });
} });
registerShot('s037', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => classroom(g2, tt, cam), bgCam: { z: 1.5, x: -400, y: -150 }, outfit: TEACHER, expr: 'shocked', talk: () => talk(info), side: 1, dx: V(200, 0), seed: 2 }); } });
registerShot('s038', { draw(g, t, info) { exam(g, t, push(t, info, { z0: 1.7, z1: 1.76, x0: 210, x1: 220, y0: 190, y1: 195 }), { leoExpr: 'smirk', leoTalk: talk(info), leoPose: breathe({ ...POSES.sitBack, eF: [24, -150], hF: [16, -184] }, t) }); } });

// ---------- chess club ----------
const CH = () => ({ leo: E.W * 0.38, champ: E.W * 0.62, table: E.W * 0.5, jake: E.W * 0.22 });
function chessTable(g, x, GY) { const top = GY - 120; rr(g, x - 150, top - 12, 300, 14, 4); g.fillStyle = '#2a1c1e'; g.fill(); seg(g, [[x, top], [x, GY]], 12, '#2a1c1e'); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#e8dcc0' : '#4a3426'; g.fillRect(x - 80 + i * 20, top - 20, 20, 8); } for (const [dx, c] of [[-60, '#f2efe8'], [-30, '#f2efe8'], [20, '#1a1622'], [50, '#1a1622']]) { rr(g, x + dx - 6, top - 44, 12, 24, 4); g.fillStyle = c; g.fill(); circle(g, x + dx, top - 48, 7, c); } return { top: top - 12 }; }
function club(g, t, cam, o = {}) {
  const frozen = !!o.frozen, tt = frozen ? 0 : t;
  const { GY, M } = classroom(g, tt, cam, { mood: 'interiorWarm', clockT: 16 * 3600 });
  const c = CH(), s = 1.25, rim = rimOf(M, [0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    for (const [x, f] of [[c.leo, 1], [c.champ, -1]]) { g.save(); g.translate(x, 0); g.scale(f, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore(); }
    chessTable(g, c.table, GY);
    drawFigure(g, { x: c.leo, y: GY, s, facing: 1, outfit: LEO, pose: o.leoPose || breathe({ ...POSES.sit, eF: [28, -120], hF: [56, -126] }, tt, 0.6), expr: o.leoExpr || 'determined', face: o.leoFace, talk: o.leoTalk || 0, rim, shadow: false, blink: frozen ? false : blinkAt(tt, 3.2) });
    drawFigure(g, { x: c.champ, y: GY, s, facing: -1, outfit: CHAMP, pose: o.champPose || breathe(POSES.think, tt, 0.6, 2), expr: o.champExpr || 'thinking', rim, shadow: false, blink: frozen ? false : blinkAt(tt, 3.6) });
    if (o.jake !== false) drawFigure(g, { x: o.jakeX ?? c.jake, y: GY, s, facing: 1, outfit: JAKE, pose: o.jakePose || breathe(POSES.crossArms, tt, 1, 4), expr: o.jakeExpr || 'neutral', talk: o.jakeTalk || 0, look: o.jakeLook, rim, blink: frozen ? false : blinkAt(tt, 2.9) });
  });
  FX.dust(g, t, { count: 35, color: '#ffe2bd', a: 0.28 });
  return { GY, M };
}
registerShot('s039', { draw(g, t, info) { club(g, t, push(t, info, { z0: 1.05, z1: 1.12, x0: -20, x1: 20, y0: 60, y1: 70 })); chapter(g, t, 'PLUS', S().ui.good); label(g, t, 'CHESS CLUB', E.W / 2, V(140, 240), 0.5, { size: V(46, 48), color: S().ui.cream }); } });
function board(g, t, o = {}) {
  const ui = S().ui, n = 8, cs = V(90, 100), bx = E.W / 2 - cs * 4, by = E.H / 2 - cs * 4;
  for (let i = 0; i < 64; i++) { g.fillStyle = (i + Math.floor(i / 8)) % 2 ? '#4a3426' : '#e8dcc0'; g.fillRect(bx + (i % 8) * cs, by + Math.floor(i / 8) * cs, cs, cs); }
  const pc = (cx, cy, white, big) => { circle(g, bx + (cx + 0.5) * cs, by + (cy + 0.5) * cs, cs * (big ? 0.36 : 0.28), white ? '#f4f0ea' : '#1a1622'); ring(g, bx + (cx + 0.5) * cs, by + (cy + 0.5) * cs, cs * (big ? 0.36 : 0.28), 3, white ? '#8a8270' : '#5a5466'); };
  [[4, 0, 0, 1], [3, 1, 0], [5, 2, 0], [2, 3, 0], [4, 7, 1, 1], [6, 6, 1], [1, 6, 1], [5, 5, 1]].forEach(([x, y, w, b]) => pc(x, y, w, b));
  if (o.glow) { const gx = bx + 5.5 * cs, gy = by + 5.5 * cs; glow(g, gx, gy, cs * 1.6, ui.gold, 0.6); ring(g, gx, gy, cs * 0.45, 5, ui.gold); g.setLineDash([10, 8]); seg(g, [[gx, gy], [bx + 4.5 * cs, by + 1.5 * cs]], 4, alpha(ui.gold, 0.7)); g.setLineDash([]); }
  if (o.mate) { const k = popIn(t, o.mate); if (k > 0) { glow(g, bx + 4.5 * cs, by + 0.5 * cs, cs * 1.8, ui.accent, 0.6 * k); stamp(g, t, 'CHECKMATE', E.W / 2, E.H / 2, o.mate, V(90, 80), ui.gold, -0.06); } }
  return { bx, by, cs };
}
registerShot('s040', { draw(g, t, info) { backdrop(g, ['#1a1214', '#2a1c1e']); layer(g, push(t, info, { z0: 1.0, z1: 1.08, r: 0.03 }), 1, (g) => board(g, t, { glow: true })); slowTint(g, 0.25); label(g, t, '1 YEAR PER MOVE', E.W / 2, E.H * 0.08 + V(40, 120), wt(info, 'year', 1.2) - 0.1, { size: V(50, 52) }); } });
registerShot('s041', { draw(g, t, info) {
  club(g, t, push(t, info, { z0: 1.5, z1: 1.56, x0: 0, x1: 10, y0: 150, y1: 155 }), { jake: false, champPose: breathe(posesAt(t, [[0, POSES.think], [0.6, { ...POSES.sit, eF: [28, -160], hF: [20, -196] }]]), t), champExpr: t > 0.6 ? 'shocked' : 'thinking', leoExpr: 'smirk' });
  label(g, t, 'CHECKMATE IN 11 MOVES', E.W / 2, V(150, 260), wt(info, 'eleven', 1.6) - 0.1, { size: V(52, 52) });
} });
registerShot('s042', { draw(g, t, info) { club(g, t, push(t, info, { z0: 1.45, z1: 1.5, x0: -220, x1: -210, y0: 150, y1: 155 }), { jakeExpr: 'shocked', jakeLook: [1, 0.3], jakePose: breathe(POSES.handsOnHead, t, 1, 4), leoExpr: 'smile' }); } });
registerShot('s043', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => classroom(g2, tt, cam), bgCam: { z: 1.5, x: -200, y: -150 }, outfit: JAKE, expr: 'surprised', talk: () => talk(info), side: 1, dx: V(200, 0), seed: 1 }); } });
registerShot('s044', { draw(g, t, info) { club(g, t, push(t, info, { z0: 1.7, z1: 1.75, x0: -100, x1: -95, y0: 180, y1: 182 }), { jake: false, leoTalk: talk(info), leoExpr: 'smile', leoPose: breathe({ ...POSES.sit, eF: [26, -156], hF: [40, -176], eB: [-22, -156], hB: [-36, -176] }, t) }); } });
registerShot('s045', { draw(g, t, info) { club(g, t, push(t, info, { z0: 1.45, z1: 1.5, x0: -180, x1: -170, y0: 150, y1: 152 }), { jakeX: lerp(E.W * 0.26, E.W * 0.2, ease.out(prog(t, 0, 0.8))), jakeExpr: 'nervous', jakeTalk: talk(info), jakePose: breathe(POSES.shrug, t, 1, 4), leoExpr: 'smile' }); } });

// ---------- the penalty ----------
const PN = () => ({ spot: E.W * 0.26, goalX: E.W * 0.66, keeper: E.W * 0.66 + 270 });
const KEEPER = { ...LEO, gloves: '#f2f2f2' };
function penalty(g, t, cam, o = {}) {
  const frozen = !!o.frozen, tt = frozen ? 0 : t, p = PN();
  const r = pitch(g, tt, cam, { goalX: p.goalX });
  const { GY, M } = r, rim = rimOf(M, [-0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: o.strikerX ?? p.spot - 90, y: GY, s: 1.15, facing: 1, outfit: STRIKER, pose: o.strikerPose || breathe(POSES.ready, tt, 1, 3), expr: 'determined', rim, blink: frozen ? false : blinkAt(tt, 3.4) });
    drawFigure(g, { x: o.keeperX ?? p.keeper, y: GY - (o.keeperLift || 0), s: 1.15, facing: -1, outfit: KEEPER, pose: o.keeperPose || breathe(POSES.ready, tt, 1, 2), rot: o.keeperRot || 0, expr: o.keeperExpr || 'determined', face: o.keeperFace, rim, shadow: !o.keeperRot, blink: frozen ? false : blinkAt(tt, 3.1) });
    if (o.ball) ball(g, o.ball[0], o.ball[1], o.ball[2] || 16, o.ball[3] || 0, '#f2efe8');
    o.extra?.(g, GY);
  });
  if (frozen) { slowTint(g, 0.3); FX.drops(g, t, { count: 30, rMax: 4, drift: 1 }); } else FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  return r;
}
registerShot('s046', { draw(g, t, info) { const p = PN(); penalty(g, t, push(t, info, { z0: 1.0, z1: 1.06, x0: -40, x1: 0 }), { ball: [p.spot, E.H * 0.8 - 16, 16] }); } });
registerShot('s047', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, x0 = E.W * 0.16, x1 = E.W * 0.8, y = E.H * 0.62, p = ease.in(prog(t, wt(info, 'reaches', 1.0) - 0.2, wt(info, 'half', 2.4) + 0.4));
  seg(g, [[x1, y], [x1, y - 220], [x1 + 90, y - 190], [x1 + 90, y + 20]], 5, c); circle(g, x0, y, 8, c); text(g, 'PENALTY SPOT', x0, y + 50, { size: 26, color: c, font: FONTS.ui, weight: 900 });
  UI.dimension(g, t, { x1: x0, y1: y + 100, x2: x1, y2: y + 100, str: '11 m', start: 0.3 });
  const bx = lerp(x0, x1 + 40, p), by = y - 10 - Math.sin(p * Math.PI) * 60 - p * 160; circle(g, bx, by, 16, ui.gold); glow(g, bx, by, 50, ui.gold, 0.6);
  UI.readout(g, { label: 'BALL TAKES', value: (0.5 * p).toFixed(2) + ' s', x: E.W / 2, y: E.H * 0.2, align: 'center', a: clamp(popIn(t, 0.2)) });
} });
const KICK = { ...POSES.kick };
registerShot('s048', { draw(g, t, info) {
  const p = PN(), tK = 0.15, frozen = t > tK + 0.15, tB = wt(info, 'boot', 1.8);
  const r = penalty(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: -320, x1: -310, y0: 160, y1: 165 }), { frozen, strikerX: p.spot - 60, strikerPose: posesAt(Math.min(t, tK + 0.15), [[0, POSES.ready], [tK - 0.1, KICK]], 0.1), ball: [p.spot + (frozen ? 30 : 0), E.H * 0.8 - 22 - (frozen ? 10 : 0), 16] });
  if (frozen) { FX.rings(g, E.W * 0.5, E.H * 0.56, t, { count: 2, r0: 60, r1: 260, speed: 0.4, color: '#e8f0ff', a: 0.35 }); yearBadge(g, t - tK, 'DAY 1', 0.1); }
} });
registerShot('s049', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => pitch(g2, 0, { z: 1.8, x: -300, y: -100 })); veil(g, '#0a0710', 0.3);
  const ui = S().ui, x = E.W / 2, y = E.H * 0.5, R = V(220, 200); ball(g, x, y, R, 0.4 + t * 0.05, '#f2efe8');
  for (let i = 0; i < 3; i++) { g.strokeStyle = alpha(ui.gold, 0.8); g.lineWidth = 6; g.beginPath(); g.arc(x, y, R * (1.25 + i * 0.12), -0.9 + i * 0.3 + t * 0.3, 0.2 + i * 0.3 + t * 0.3); g.stroke(); }
  poly(g, [[x + R * 1.3, y - R * 0.2], [x + R * 1.45, y - R * 0.45], [x + R * 1.12, y - R * 0.38]], ui.gold);
  label(g, t, 'SPIN', x + R * 1.7, y - R * 0.9, 0.2, { size: V(64, 60) }); slowTint(g, 0.3); yearBadge(g, t, 'DAY 120', 0);
} });
registerShot('s050', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), gx = E.W * 0.3, gy = E.H * 0.24, gw = E.W * 0.4, gh = E.H * 0.42;
  seg(g, [[gx, gy + gh], [gx, gy], [gx + gw, gy], [gx + gw, gy + gh]], 8, c); for (let i = 1; i < 6; i++) seg(g, [[gx + i * gw / 6, gy], [gx + i * gw / 6, gy + gh]], 1, alpha(c, 0.25)); for (let j = 1; j < 4; j++) seg(g, [[gx, gy + j * gh / 4], [gx + gw, gy + j * gh / 4]], 1, alpha(c, 0.25));
  const tA = 0.1, tC = wt(info, 'corner', 1.0) - 0.2, sx = E.W / 2, sy = E.H * 0.9, cx = gx + 40, cy = gy + 40;
  const k = ease.out(prog(t, tA, tA + 0.6)); g.setLineDash([12, 10]); seg(g, [[sx, sy], [lerp(sx, cx, k), lerp(sy, cy, k)]], 4, alpha(c, 0.8)); g.setLineDash([]);
  label(g, t, 'ANGLE', E.W * 0.22, E.H * 0.7, tA, { size: V(46, 46), color: c });
  const kc = popIn(t, tC); if (kc > 0) { glow(g, cx, cy, 160 * kc, ui.gold, 0.6); ring(g, cx, cy, 50 * kc, 6, ui.gold); label(g, t, 'TOP CORNER', cx + 280, cy + 20, tC, { size: V(52, 52) }); }
  circle(g, sx, sy, 16, ui.gold);
} });
registerShot('s051', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('golden'), bg: (g2, tt, cam) => pitch(g2, 0, cam), bgCam: { z: 1.5, x: 300, y: -150 }, outfit: KEEPER, expr: 'neutral', face: HELD, side: -1, noBlink: true, zoom: 0.03 });
  slowTint(g, 0.3); yearBadge(g, t, 'DAY 300', 0); label(g, t, 'BODY: SAME SPEED', E.W * 0.78, E.H * 0.24, 0.6, { size: V(40, 40), color: S().ui.accent });
} });
registerShot('s052', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x0 = V(460, 140), x1 = E.W - V(240, 120);
  const bar = (y, lab, col, at) => { const k = ease.out(prog(t, at, at + 0.8)); text(g, lab, x0, y - 56, { size: V(38, 40), color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); rr(g, x0, y - 24, Math.max(48, (x1 - x0) * 0.7 * k), 48, 24); g.fillStyle = col; g.fill(); };
  bar(E.H * 0.4, 'ANY KEEPER’S DIVE', c, 0.2); bar(E.H * 0.62, 'LEO’S DIVE', ui.gold, 0.4);
  label(g, t, 'SAME SPEED', E.W / 2, E.H * 0.82, 1.2, { size: V(56, 56), color: ui.cream });
} });
registerShot('s053', { draw(g, t, info) {
  const p = PN(), tD = wt(info, 'dive', 0.4) - 0.1, d = ease.out(prog(t, tD, tD + 0.7)), tF = wt(info, 'first', 2.0);
  const DIVE = { ...POSES.dive }; const bu = ease.in(prog(t, 0, tF + 0.2));
  penalty(g, t, push(t, info, { z0: 1.35, z1: 1.4, x0: 280, x1: 290, y0: 110, y1: 115 }), { keeperPose: d > 0 ? DIVE : POSES.ready, keeperRot: -1.3 * d, keeperX: p.keeper - 90 * d, keeperLift: 50 * d, keeperExpr: 'determined',
    ball: [lerp(p.spot + 30, p.goalX + 70, bu), lerp(E.H * 0.8 - 22, E.H * 0.8 - 230, bu), 16, t * 10] });
  label(g, t, 'RIGHT WAY, FIRST TIME', E.W / 2, V(150, 260), tF - 0.1, { size: V(46, 48) });
} });
registerShot('s054', { draw(g, t, info) {
  blurLayer(g, 12, (g2) => pitch(g2, 0, { z: 2.2, x: 400, y: -300 })); veil(g, '#0a0710', 0.3);
  const ink = S().ink, x = E.W * 0.55, y = E.H * 0.42, cam = push(t, info, { z0: 1.0, z1: 1.05 }); const tap = t > 0.25;
  layer(g, cam, 1, (g) => { seg(g, [[x + 60, y + 60], [E.W + 200, y + 500]], 90, LEO.color); circle(g, x + 40, y + 40, 80, '#f2f2f2'); for (let i = 0; i < 4; i++) seg(g, [[x + 20, y + 20], [x - 60 + i * 10, y - 40 - i * 18]], 30, '#f2f2f2');
    ball(g, tap ? x - 150 - t * 120 : x - 120, tap ? y - 120 - t * 140 : y - 90, V(110, 100), t * 3, '#f2efe8'); if (tap) FX.rings(g, x - 100, y - 70, t - 0.25, { count: 2, r0: 40, r1: 260, speed: 1.4, color: '#fff3e0', a: 0.5 }); });
  slowTint(g, 0.2); label(g, t, 'FINGERTIPS', E.W * 0.26, E.H * 0.8, 0.2, { size: V(56, 56) });
} });
registerShot('s055', { draw(g, t, info) {
  const p = PN();
  penalty(g, t, push(t, info, { z0: 1.1, z1: 1.15, x0: 140, x1: 150, y0: 60, y1: 60 }), { keeperPose: POSES.lie, keeperRot: -Math.PI / 2, keeperX: p.keeper - 120, keeperExpr: 'joy', ball: [p.goalX - 140 - t * 300, E.H * 0.8 - 280 + t * 100, 16, t * 12], strikerPose: breathe(POSES.handsOnHead, t),
    extra: (g, GY) => drawFigure(g, { x: E.W * 0.14, y: GY - Math.max(0, Math.sin(t * 8)) * 40, s: 1.15, facing: 1, outfit: JAKE, pose: POSES.cheer, expr: 'joy', rim: rimOf(mood('golden'), [-0.7, -0.7]) }) });
  stamp(g, t, 'SAVED!', E.W * 0.5, E.H * 0.3, 0.05, V(110, 100), S().ui.good, -0.08);
} });
