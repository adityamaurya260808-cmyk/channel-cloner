// shots/06_sam.js: Sam (s088-s093), the whistle game flashback (s094-s099), the supermarket (s100-s102).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, slowTint, popIn, label, noteRings } from '../lib.js';
import { gate, street, garden, park } from '../sets/outdoor.js';
import { market } from '../sets/indoor.js';
import { THEO, SAM, EXTRA, EXTRA2, EXTRA3 } from '../cast.js';

export const ROBOT = walkPose(1.25);          // Sam's freeze: mid-step, one foot up
const kidR = (M) => rimOf(M, [0.7, -0.7]);

// ---------- school gate ----------
function gateScene(g, t, cam, o = {}) {
  const { GY, M } = gate(g, t, cam), rim = rimOf(M, [0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    if (o.theo !== false) drawFigure(g, { x: o.theoX ?? E.W * 0.36, y: GY, s: 1.3, facing: 1, outfit: THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'smile', rim, blink: blinkAt(t, 3.3) });
    drawFigure(g, { x: o.samX ?? E.W * 0.56, y: o.samY ?? GY, s: 1.3, facing: o.samFacing ?? -1, outfit: SAM, pose: o.samPose || breathe(POSES.relaxed, t, 1, 2), expr: o.samExpr || 'happy', rim, blink: blinkAt(t, 2.7), shadow: o.samY == null });
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
  return { GY, M };
}
registerShot('s088', { draw(g, t, info) {
  const hop = Math.max(0, Math.sin(t * 7)) * 30 * (1 - prog(t, 0.6, 1.2));
  gateScene(g, t, push(t, info, { z0: 1.2, z1: 1.26, x0: 40, x1: 60, y0: 120, y1: 125 }), { theo: false, samX: E.W * 0.52, samY: GY0() - hop, samPose: breathe(POSES.wave, t * 2, 2), samExpr: 'joy' });
} });
const GY0 = () => E.H * V(0.8, 0.68);
registerShot('s089', { draw(g, t, info) {
  gateScene(g, t, push(t, info, { z0: 1.9, z1: 1.96, x0: 100, x1: 110, y0: 260, y1: 262 }), { theo: false, samX: E.W * 0.55, samPose: breathe(POSES.relaxed, t, 1, 2), samExpr: 'happy' });
  label(g, t, 'SAM', E.W * 0.32, E.H * 0.3, 0.1, { size: V(80, 84), font: FONTS.title, color: SAM.headColor });
  label(g, t, 'AGE 7', E.W * 0.32, E.H * 0.43, wt(info, 'seven', 0.4) - 0.1, { size: V(52, 56), color: S().ui.cream });
} });
registerShot('s090', { draw(g, t, info) {
  const hug = { ...POSES.reach, eF: [26, -150], hF: [44, -132], eB: [20, -152], hB: [40, -128] };
  gateScene(g, t, push(t, info, { z0: 1.55, z1: 1.62, x0: -30, x1: -20, y0: 180, y1: 185 }), { theoX: E.W * 0.46, theoExpr: 'smile', theoPose: breathe({ ...POSES.relaxed, eF: [14, -136], hF: [30, -116] }, t), samX: lerp(E.W * 0.62, E.W * 0.53, ease.out(prog(t, 0, 0.6))), samPose: breathe(posesAt(t, [[0, POSES.relaxed], [0.4, hug]]), t, 1, 2), samExpr: 'joy' });
  label(g, t, 'NOT WEIRD', E.W * 0.7, E.H * 0.24, wt(info, 'weird', 2.2) - 0.1, { size: V(46, 50), color: S().ui.good });
} });
registerShot('s091', { draw(g, t, info) {
  const swing = Math.sin(t * 3) * 14, sit = { ...POSES.sit, kF: [44, -74], fF: [46 + swing, -4], kB: [40, -72], fB: [38 - swing, -2] };
  const { GY } = gate(g, t, push(t, info, { z0: 1.0, z1: 1.06, x0: 20, x1: -10 }));
  layer(g, push(t, info, { z0: 1.0, z1: 1.06, x0: 20, x1: -10 }), 1, (g) => drawFigure(g, { x: E.W / 2 + V(330, 320), y: GY - V(170, 220) + 74 * 1.2 * 0.72 - 4, s: 1.2, facing: -1, outfit: SAM, pose: breathe(sit, t, 1, 2), expr: 'happy', look: [-1, 0], rim: rimOf(mood('golden'), [0.7, -0.7]), shadow: false }));
  FX.clock(g, E.W * 0.86, E.H * 0.2, 46, 15 * 3600 + 20 * 60 + t * 300, { face: '#efe8e0' });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });
registerShot('s092', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, z1: 1.24, x0: -60 + 0, x1: 80, y0: 110, y1: 110 }), ui = S().ui;
  const { GY, M } = street(g, t, cam);
  const x = lerp(E.W * 0.32, E.W * 0.52, t / info.dur), rim = rimOf(M, [0.4, -0.9]);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: x + V(150, 120), y: GY, s: 1.3, facing: 1, outfit: THEO, pose: posesAt(t % 1.2, [[0, walkPose(t * 4.4)]]), expr: 'happy', talk: 0.3 + 0.4 * Math.abs(Math.sin(t * 8)), rim });
    drawFigure(g, { x, y: GY, s: 1.3, facing: 1, outfit: SAM, pose: walkPose(t * 5.4 + 1), expr: 'joy', look: [0.6, -0.8], rim });
  });
  const words = ['DRAGONS', 'SPACE', 'TIME'];
  words.forEach((w, i) => { const at = 0.2 + i * 0.8, k = popIn(t, at), bx = E.W * (0.4 + i * 0.16), by = E.H * (0.2 + (i % 2) * 0.08); if (k <= 0) return; g.save(); g.translate(bx, by); g.scale(k, k); rr(g, -110, -40, 220, 80, 40); g.fillStyle = alpha(ui.cream, 0.92); g.fill(); text(g, w, 0, 2, { size: 30, color: S().ink, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); });
  FX.dust(g, t, { count: 40, color: '#ffd9b0', a: 0.35 });
} });
registerShot('s093', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => street(g2, tt, cam), bgCam: { z: 1.5, x: 120, y: -200 }, outfit: SAM, expr: 'happy', look: [0, -0.6], side: 1, dx: V(160, 0), tilt: -0.08, seed: 1 });
  label(g, t, '"HURRY UP"', E.W * V(0.22, 0.5), E.H * 0.3, wt(info, 'hurry', 1.5) - 0.1, { size: V(52, 56), color: S().ui.cream });
  const k = ease.out(prog(t, wt(info, 'hurry', 1.5) + 0.25, wt(info, 'hurry', 1.5) + 0.5)); if (k > 0) seg(g, [[E.W * V(0.22, 0.5) - 170, E.H * 0.3], [E.W * V(0.22, 0.5) - 170 + 340 * k, E.H * 0.3]], 7, S().ui.accent);
} });

// ---------- flashback: the whistle game ----------
function flashback(g) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,200,140,.45)'; g.fillRect(0, 0, E.W, E.H); g.restore(); g.save(); g.fillStyle = 'rgba(255,240,220,.08)'; g.fillRect(0, 0, E.W, E.H); g.restore(); g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.rect(0, 0, E.W, E.H); g.ellipse(E.W / 2, E.H / 2, E.W * 0.62, E.H * 0.7, 0, 0, Math.PI * 2, true); g.fill('evenodd'); g.restore(); }
const YOUNG_THEO = THEO, LITTLE_SAM = { ...SAM };
function yard(g, t, cam, o = {}) {
  const { GY, M } = garden(g, t, cam), rim = rimOf(M, [0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    if (o.theo !== false) drawFigure(g, { x: o.theoX ?? E.W * 0.36, y: GY, s: 1.05, facing: 1, outfit: YOUNG_THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'smile', talk: o.theoTalk || 0, rim, blink: blinkAt(t, 3.3) });
    drawFigure(g, { x: o.samX ?? E.W * 0.58, y: GY, s: 1.0, facing: o.samFacing ?? -1, outfit: LITTLE_SAM, pose: o.samPose || breathe(POSES.relaxed, t, 1, 2), expr: o.samExpr || 'happy', rim, blink: o.samBlink ?? blinkAt(t, 2.7) });
    o.extra?.(g, GY);
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
  return { GY, M };
}
registerShot('s094', { draw(g, t, info) { yard(g, t, push(t, info, { z0: 1.15, z1: 1.22, y0: 90, y1: 95 }), { theoPose: breathe(posesAt(t, [[0, POSES.relaxed], [0.6, POSES.explain]]), t), theoTalk: 0.3 + 0.3 * Math.sin(t * 7), samExpr: 'happy' }); flashback(g); label(g, t, 'YEARS AGO', E.W / 2, V(140, 240), 0.2, { size: V(44, 48), color: S().ui.cream }); } });
registerShot('s095', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('golden'), bg: (g2, tt, cam) => garden(g2, tt, cam), bgCam: { z: 1.5, x: -100, y: -160 }, outfit: THEO, expr: 'neutral', face: { mouth: 'o', eyes: 'happy' }, side: -1, dx: -V(260, 0), noBlink: true,
    front: (g, tt, cx, cy, r) => noteRings(g, cx + r * 0.2, cy + r * 0.42, t, { speed: 1.2, scale: 1.2 }) });
  flashback(g);
} });
registerShot('s096', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  const tH = wt(info, 'high', 1.3) - 0.1, tL = wt(info, 'low', 2.3) - 0.1;
  layer(g, cam, 1, (g) => {
    const x0 = E.W * V(0.18, 0.1), x1 = E.W * V(0.82, 0.9), y0 = E.H * 0.34; for (let i = 0; i < 5; i++) seg(g, [[x0, y0 + i * 34], [x1, y0 + i * 34]], 2, alpha(c, 0.6));
    const note = (x, y, k, lab) => { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); g.fillStyle = ui.gold; g.beginPath(); g.ellipse(0, 0, 30, 22, -0.4, 0, 7); g.fill(); seg(g, [[26, -6], [26, -140]], 6, ui.gold); glow(g, 0, 0, 90, ui.gold, 0.4); g.restore(); text(g, lab, x, E.H * 0.7, { size: V(48, 52), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: clamp(k) }); };
    note(E.W * 0.38, y0 + 10, popIn(t, tH), 'HIGH'); note(E.W * 0.62, y0 + 120, popIn(t, tL), 'LOW');
    g.strokeStyle = alpha(ui.gold, 0.7); g.lineWidth = 3; g.beginPath(); for (let x = x0; x < x1; x += 4) { const u = (x - x0) / (x1 - x0), f = u < 0.5 ? 0.09 : 0.045, on = (u < 0.5 ? t > tH : t > tL) ? 1 : 0.1; g.lineTo(x, E.H * 0.84 + Math.sin(x * f + t * 8) * 30 * on); } g.stroke();
    text(g, 'TWO NOTES', E.W / 2, V(140, 220), { size: V(44, 48), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: clamp(prog(t, 0, 0.3)) });
  });
} });
registerShot('s097', { draw(g, t, info) {
  const tF = wt(info, 'freeze', 0.6) - 0.05, frozen = t > tF;
  yard(g, frozen ? tF : t, push(t, info, { z0: 1.25, z1: 1.3, y0: 120, y1: 120 }), { theo: false, samX: E.W * 0.3 + Math.min(t, tF) * 300, samFacing: 1, samPose: frozen ? ROBOT : walkPose(t * 9, { run: true }), samExpr: 'neutral', samBlink: false });
  flashback(g); if (frozen) slowTint(g, 0.25);
  const k = ease.outBack(prog(t, tF, tF + 0.3)); if (k > 0) { g.save(); g.translate(E.W * 0.66, E.H * 0.36); g.scale(k, k); text(g, 'FREEZE!', 0, 0, { size: V(150, 120), color: '#cfe0ff', font: FONTS.title, weight: 700, spacing: 6, glow: 30, glowColor: 'rgba(120,160,255,.8)' }); g.restore(); }
} });
registerShot('s098', { draw(g, t, info) {
  const tW = wt(info, 'whistle', 0.5);
  yard(g, t, push(t, info, { z0: 1.2, z1: 1.26, x0: 0, x1: 20, y0: 110, y1: 115 }), { theoX: E.W * 0.3, theoPose: breathe(posesAt(t, [[0, POSES.relaxed], [tW + 0.6, POSES.cheer]]), t), theoExpr: exprAt(t, [[0, 'smile'], [tW + 0.6, 'joy']]),
    samX: E.W * 0.55 + Math.min(t, tW + 0.2) * 260, samFacing: 1, samPose: t > tW + 0.2 ? ROBOT : walkPose(t * 9, { run: true }), samExpr: 'neutral', samBlink: false,
    extra: (g, GY) => { if (t > tW && t < tW + 1.2) noteRings(g, E.W * 0.3 + 30, GY - 180, t - tW, { scale: 0.6 }); } });
  flashback(g);
  label(g, t, 'ROBOT MODE', E.W * 0.72, E.H * 0.24, wt(info, 'robot', 2.8) - 0.1, { size: V(46, 50), color: '#cfe0ff' });
} });
registerShot('s099', { draw(g, t, info) {
  backdrop(g, ['#120c14', '#1a1220']); const scenes = [(g2, tt, cam) => garden(g2, 0, cam), (g2, tt, cam) => street(g2, 0, cam), (g2, tt, cam) => park(g2, 0, cam)];
  for (let i = 0; i < 3; i++) { const k = ease.out(prog(t, 0.1 + i * 0.3, 0.4 + i * 0.3)); if (k <= 0) continue; const pw = E.W * 0.3, ph = E.H * 0.62, px = E.W * 0.035 + i * (pw + E.W * 0.0175), py = E.H * 0.19 + (1 - k) * 40;
    g.save(); g.globalAlpha = k; rr(g, px - 8, py - 8, pw + 16, ph + 16, 14); g.fillStyle = '#efe6d2'; g.fill(); g.beginPath(); g.rect(px, py, pw, ph); g.clip();
    g.translate(px, py); g.scale(pw / E.W, ph / E.H); g.translate(E.W / 2, E.H / 2); g.scale(1.6, 1.6); g.translate(-E.W / 2, -E.H / 2 - 120);
    const { GY, M } = scenes[i](g, 0, { z: 1, x: (i - 1) * 200 }); drawFigure(g, { x: E.W / 2, y: E.H * V(0.8, 0.68), s: 1.3, facing: i % 2 ? -1 : 1, outfit: SAM, pose: ROBOT, expr: 'neutral', rim: rimOf(M || mood('golden'), [0.6, -0.8]) });
    g.restore(); }
  flashback(g);
} });

// ---------- supermarket ----------
function aisle(g, t, cam, o = {}) {
  const { GY, M } = market(g, t, cam), rim = rimOf(M, [0, -1]);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W * 0.22, y: GY, s: 1.2, facing: 1, outfit: EXTRA2, pose: breathe(POSES.holdFront, t, 1, 4), expr: 'surprised', look: [1, 0], rim });
    drawFigure(g, { x: E.W * 0.8, y: GY, s: 1.2, facing: -1, outfit: EXTRA3, pose: breathe(POSES.crossArms, t, 1, 5), expr: 'confused', rim });
    if (o.theo !== false) drawFigure(g, { x: o.theoX ?? E.W * 0.36, y: GY, s: 1.3, facing: 1, outfit: THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'nervous', talk: o.theoTalk || 0, rim });
    drawFigure(g, { x: E.W * 0.58, y: GY, s: 1.3, facing: 1, outfit: SAM, pose: ROBOT, expr: o.samExpr || 'neutral', talk: o.samTalk || 0, rim, blink: false });
  });
  return { GY, M };
}
registerShot('s100', { draw(g, t, info) { aisle(g, t, push(t, info, { z0: 1.05, z1: 1.12, x0: -30, x1: 20, y0: 50, y1: 60 }), { theo: false }); } });
registerShot('s101', { draw(g, t, info) { aisle(g, t, push(t, info, { z0: 1.45, z1: 1.5, x0: -60, x1: -50, y0: 160, y1: 165 }), { theoPose: breathe(posesAt(t, [[0, POSES.point], [1.2, POSES.handsOnHead]]), t), theoExpr: 'nervous', theoTalk: talk(info) }); } });
registerShot('s102', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('interiorCool'), bg: (g2, tt, cam) => market(g2, tt, cam), bgCam: { z: 1.4, x: 100, y: -200 }, outfit: SAM, expr: 'neutral', face: { mouth: 'flat', brows: null }, talk: () => talk(info), side: 1, dx: V(200, 0), noBlink: true });
} });
