// shots/02_numbers.js: the reaction numbers, ruler drop, brain vs body (s019-s027), the track jog (s028-s030), title (s031).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, exprAt, blinkAt, rimOf, faceShot, slowTint, slowBadge, popIn, label } from '../lib.js';
import { track } from '../sets/track.js';
import { THEO } from '../cast.js';

// ---------- shared blueprint pieces ----------
export function reactionAxis(g, x0, x1, y, max = 0.3, a = 1) {
  const c = UI.bpStroke(), sc = (x1 - x0) / max;
  seg(g, [[x0, y], [x1, y]], 2, alpha(c, 0.6 * a));
  for (let k = 0; k <= Math.round(max / 0.05); k++) { const x = x0 + k * 0.05 * sc; seg(g, [[x, y - 10], [x, y + 10]], 2, alpha(c, 0.6 * a)); text(g, (k * 0.05).toFixed(2) + ' s', x, y + 40, { size: V(26, 28), color: alpha(c, 0.8 * a), font: FONTS.ui, weight: 800 }); }
  return sc;
}
export function bar(g, x0, x1, y, label, value, frac, color, a = 1, valA = 1) {
  text(g, label, x0, y - 62, { size: V(40, 44), color, font: FONTS.ui, weight: 900, align: 'left', spacing: 2, alpha: a });
  rr(g, x0, y - 26, x1 - x0, 52, 26); g.fillStyle = alpha(color, 0.1 * a); g.fill();
  const w = Math.max(52, (x1 - x0) * frac); rr(g, x0, y - 26, w, 52, 26); g.fillStyle = alpha(color, a); g.fill(); glow(g, x0 + w, y, 60, color, 0.5 * a);
  text(g, value, x0 + w + 28, y + 2, { size: V(58, 60), color, font: FONTS.ui, weight: 900, align: 'left', glow: 14, glowColor: alpha(color, 0.6), alpha: a * valA });
}
function board(g, t, info, showYou, tYou) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke();
  const x0 = V(560, 140), x1 = E.W - V(220, 120), y0 = E.H * V(0.38, 0.4), y1 = E.H * V(0.64, 0.6);
  reactionAxis(g, x0, x1, y1 + V(110, 140));
  UI.lineFigure(g, { x: V(330, 0), y: y0 + 110, s: 1.0, pose: POSES.stand, color: alpha(c, 0.9) });
  const pN = showYou ? 1 : ease.inOut(prog(t, 0.5, wt(info, 'quarter', 3) + 0.4));
  bar(g, x0, x1, y0, 'NORMAL HUMAN', '0.25 s', (0.25 / 0.3) * pN, c, 1, clamp(pN * 4));
  if (showYou) { const k = ease.out(prog(t, tYou, tYou + 0.3)); UI.lineFigure(g, { x: V(330, 0), y: y1 + 110, s: 1.0, pose: POSES.ready, color: alpha(ui.gold, 0.9 * k) }); bar(g, x0, x1, y1, 'YOU', '0.0025 s', 0.0025 / 0.3, ui.gold, k, clamp(prog(t, info.valT ?? tYou, (info.valT ?? tYou) + 0.2))); }
}
registerShot('s019', { draw(g, t, info) { board(g, t, info, false); } });
registerShot('s020', { draw(g, t, info) { const tY = wt(info, 'you', 0.1) - 0.05; info.valT = wt(info, 'two', 1.2); board(g, t, info, true, tY); } });

registerShot('s021', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  g.save(); g.globalAlpha = 0.25; board(g, t, { ...info, valT: 0 }, true, -1); g.restore();
  veil(g, ui.bpBg, 0.5);
  const k = ease.outBack(prog(t, 0.05, 0.4)), s = lerp(1.8, 1, ease.out(prog(t, 0.05, 0.3))) * (1 + 0.03 * t);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(s, s); text(g, '100x', 0, 0, { size: V(300, 260), color: ui.gold, font: FONTS.title, weight: 700, glow: 50, glowColor: alpha(ui.gold, 0.7), alpha: clamp(k) }); g.restore();
  text(g, 'FASTER', E.W / 2, E.H / 2 + V(190, 180), { size: V(64, 60), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 12, alpha: clamp(prog(t, 0.6, 0.9)) });
  for (let i = 0; i < 12; i++) FX.sparkle(g, E.W / 2 + Math.cos(i * 0.52 + t) * V(520, 380), E.H / 2 + Math.sin(i * 0.52 + t) * 200, 16, ui.gold, 0.5 * clamp(prog(t, 0.2, 0.5)) * (0.5 + 0.5 * Math.sin(t * 4 + i)));
} });

// ruler between line-art fingers
function ruler(g, x, y, h, c, gold) { rr(g, x - 34, y, 68, h, 6); g.fillStyle = alpha(c, 0.12); g.fill(); g.strokeStyle = c; g.lineWidth = 3; g.stroke(); for (let i = 0; i <= 30; i++) { const yy = y + 20 + i * ((h - 40) / 30); seg(g, [[x - 34, yy], [x - 34 + (i % 5 ? 14 : 26), yy]], 2, c); if (i % 10 === 0) text(g, String(i), x + 10, yy, { size: 22, color: c, font: FONTS.ui, weight: 800 }); } }
function fingers(g, x, y, open, c) { for (const s of [-1, 1]) { const fx = x + s * (54 + open * 50); seg(g, [[fx + s * 160, y + 60], [fx + s * 40, y + 10], [fx, y - 10]], 18, alpha(c, 0.25)); seg(g, [[fx + s * 160, y + 60], [fx + s * 40, y + 10], [fx, y - 10]], 4, c); } }
registerShot('s022', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.05 });
  const tDrop = wt(info, 'falls', 2.2) - 0.3, tGrab = wt(info, 'grab', 4.8);
  const fall = 360 * ease.in(prog(t, tDrop, tGrab)), x = E.W * V(0.42, 0.5), y0 = E.H * 0.18, fy = E.H * 0.62;
  layer(g, cam, 1, (g) => {
    ruler(g, x, y0 + fall, V(560, 700), c, ui.gold);
    fingers(g, x, fy, t < tGrab ? 1 : 1 - ease.out(prog(t, tGrab, tGrab + 0.15)), c);
    text(g, 'MOST PEOPLE', x, V(110, 160), { size: V(40, 44), color: c, font: FONTS.ui, weight: 900, spacing: 3 });
    if (t > tDrop) UI.dimension(g, t, { x1: x + 140, y1: y0, x2: x + 140, y2: y0 + Math.max(4, fall), str: Math.round(fall / 12) + ' cm', start: tDrop });
    if (t > tGrab) FX.rings(g, x, fy, t - tGrab, { count: 2, r0: 40, r1: 200, speed: 1.4, color: c, a: 0.5 * clamp(1 - (t - tGrab)) });
  });
} });

registerShot('s023', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.05 });
  const tDrop = wt(info, 'drop', 0.2) + 0.5, tGrab = tDrop + 0.08, x = E.W * V(0.36, 0.5), y0 = E.H * 0.18, fy = E.H * 0.62;
  layer(g, cam, 1, (g) => {
    ruler(g, x, y0 + (t > tDrop ? 0.4 : 0), V(560, 700), ui.gold, ui.gold);
    fingers(g, x, fy, t < tGrab ? 1 : 0, ui.gold);
    text(g, 'YOU', x, V(110, 160), { size: V(44, 48), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4 });
    const k = popIn(t, wt(info, 'brain', 1.5) - 0.3, 0.5); if (k > 0) {
      const mx = E.W * V(0.68, 0.5), my = E.H * V(0.42, 0.7), R = V(220, 200) * k;
      seg(g, [[x + 40, y0 + 120], [mx - R * 0.7, my - R * 0.4]], 2, alpha(ui.gold, 0.5)); ring(g, mx, my, R, 8, ui.gold); seg(g, [[mx + R * 0.7, my + R * 0.7], [mx + R * 1.2, my + R * 1.2]], 14, ui.gold);
      g.save(); g.beginPath(); g.arc(mx, my, R - 4, 0, 7); g.clip(); g.fillStyle = alpha(ui.bpBg, 0.9); g.fill();
      seg(g, [[mx - R, my - 10], [mx + R, my - 10]], 3, alpha(c, 0.7)); seg(g, [[mx - R, my + 4], [mx + R, my + 4]], 3, ui.gold); g.restore();
      UI.dimension(g, t, { x1: mx + R * 0.35, y1: my - 10, x2: mx + R * 0.35, y2: my + 4, str: '0.03 mm', start: wt(info, 'three', 2.5) - 0.2 });
    }
  });
} });

registerShot('s024', { draw(g, t, info) {
  const M = mood('dusk'), cam = push(t, info, { z0: 1.0, z1: 1.04 });
  layer(g, cam, 0.5, (g) => { backdrop(g, [shade(M.dark, -0.4), shade(M.wall, -0.4)]); FX.fog(g, E.H * 0.4, 400, M.fog, 0.18); });
  FX.dust(g, t, { count: 40, a: 0.3 });
  UI.bigLine(g, t, { str: 'THE CATCH?', dur: info.dur + 0.4, size: V(120, 100) });
} });

function brainIcon(g, x, y, r, c, w = 5) { g.strokeStyle = c; g.lineWidth = w; for (const dx of [-0.32, 0.32]) { g.beginPath(); g.ellipse(x + dx * r, y, r * 0.42, r * 0.6, 0, 0, 7); g.stroke(); } seg(g, [[x - r * 0.5, y - r * 0.1], [x - r * 0.2, y + r * 0.15]], w * 0.8, c); seg(g, [[x + r * 0.5, y - r * 0.1], [x + r * 0.2, y + r * 0.15]], w * 0.8, c); }
export { brainIcon };
function bodyBoard(g, t, info, mode) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  const fx = E.W * V(0.36, 0.5), fy = E.H * V(0.86, 0.62), s = V(2.6, 2.4);
  const hx = fx + 4 * s, hy = fy - 208 * s;
  layer(g, cam, 1, (g) => {
    const bodyC = mode === 'body' ? ui.accent : c;
    UI.lineFigure(g, { x: fx, y: fy, s, pose: POSES.stand, color: alpha(bodyC, mode === 'brain' ? 0.5 : 0.95) });
    const kB = mode === 'brain' ? ease.out(prog(t, 0.2, 0.7)) : 1;
    glow(g, hx, hy, 160 * kB, ui.gold, 0.45 * kB); brainIcon(g, hx, hy, 34, mode === 'body' ? alpha(ui.gold, 0.6) : ui.gold, 4);
    if (mode === 'brain') { label(g, t, 'BRAIN', E.W * V(0.66, 0.5), E.H * V(0.32, 0.18), 0.4, { color: ui.cream, size: V(48, 52) }); label(g, t, '100x', E.W * V(0.66, 0.5), E.H * V(0.46, 0.26), wt(info, 'hundred', 0.8) - 0.1, { size: V(120, 110), font: FONTS.title }); }
    if (mode === 'body') { label(g, t, 'BRAIN 100x', E.W * V(0.66, 0.5), E.H * V(0.3, 0.16), -1, { size: V(48, 52) }); label(g, t, 'BODY', E.W * V(0.66, 0.5), E.H * V(0.5, 0.24), 0.2, { color: ui.cream, size: V(48, 52) }); label(g, t, '1x', E.W * V(0.66, 0.5), E.H * V(0.62, 0.31), 0.5, { size: V(110, 100), color: ui.accent, font: FONTS.title }); }
    if (mode === 'nerve') {
      const p = POSES.stand, P = (pt) => [fx + pt[0] * s, fy + pt[1] * s];
      const path = [[hx, hy + 20], P(p.sh), P(p.eF), P(p.hF)], lens = []; let L = 0; for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); lens.push(d); L += d; }
      g.setLineDash([10, 10]); seg(g, path, 4, alpha(ui.gold, 0.5)); g.setLineDash([]);
      const u = ((t * 0.32) % 1) * L; let acc = 0; for (let i = 1; i < path.length; i++) { if (u <= acc + lens[i - 1]) { const k = (u - acc) / lens[i - 1]; const px = lerp(path[i - 1][0], path[i][0], k), py = lerp(path[i - 1][1], path[i][1], k); glow(g, px, py, 60, ui.gold, 0.9); circle(g, px, py, 9, '#fff8e0'); break; } acc += lens[i - 1]; }
      label(g, t, 'NERVE SIGNAL', E.W * V(0.66, 0.5), E.H * V(0.34, 0.16), 0.3, { color: ui.cream, size: V(46, 50) });
      label(g, t, '~100 m/s', E.W * V(0.66, 0.5), E.H * V(0.48, 0.24), wt(info, 'hundred', 2) - 0.1, { size: V(96, 90), font: FONTS.title });
      label(g, t, 'UNCHANGED', E.W * V(0.66, 0.5), E.H * V(0.6, 0.31), wt(info, 'second', 3.5), { size: V(40, 44), color: ui.accent });
    }
  });
}
registerShot('s025', { draw(g, t, info) { bodyBoard(g, t, info, 'brain'); } });
registerShot('s026', { draw(g, t, info) { bodyBoard(g, t, info, 'body'); } });
registerShot('s027', { draw(g, t, info) { bodyBoard(g, t, info, 'nerve'); } });

// ---------- track: ordinary legs ----------
registerShot('s028', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, z1: 1.2, x0: -200, x1: 200, y0: 80, y1: 80 });
  const { GY, M } = track(g, t, cam, { view: 'stands' });
  const x = lerp(E.W * 0.05, E.W * 0.95, t / info.dur), ph = t * 2 * Math.PI * 1.45;
  layer(g, cam, 1, (g) => drawFigure(g, { x, y: GY, s: 1.25, facing: 1, outfit: THEO, pose: walkPose(ph, { run: true }), expr: 'neutral', rim: rimOf(M, [-0.7, -0.7]) }));
  label(g, t, 'NORMAL SPEED', E.W / 2, V(150, 260), 0.6, { color: S().ui.cream, size: V(40, 44) });
  FX.dust(g, t, { count: 40, a: 0.3 });
} });
registerShot('s029', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => track(g2, tt, cam, { view: 'stands' }), bgCam: { z: 1.4, x: -100 + 30 * t, y: -200 }, outfit: THEO, expr: 'awe', side: -1,
    look: (tt) => [Math.sin(tt * 3) * 0.8, -0.2], front: (g) => { for (let i = 0; i < 8; i++) { const a = i * 0.8 + t * 0.4; seg(g, [[E.W / 2 + Math.cos(a) * 520, E.H * 0.55 + Math.sin(a) * 320], [E.W / 2 + Math.cos(a) * 620, E.H * 0.55 + Math.sin(a) * 380]], 2, alpha('#ffffff', 0.25)); } } });
} });
registerShot('s030', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.55, x0: 0, x1: 20, y0: 170, y1: 170 });
  const { GY, M } = track(g, t * 0.2, cam, { view: 'stands' });
  const x = E.W * 0.42 + t * 12, ph = t * 2 * Math.PI * 0.25 + 1;
  layer(g, cam, 1, (g) => {
    for (let i = 4; i >= 1; i--) drawFigure(g, { x: x + i * V(120, 80) + Math.sin(t * 2 + i) * 6, y: GY, s: 1.2, facing: 1, outfit: THEO, pose: walkPose(ph + i * 0.9, { run: true }), expr: 'determined', alpha: 0.12 + 0.05 * (4 - i), rim: false, shadow: false, ink: S().ui.gold });
    drawFigure(g, { x, y: GY, s: 1.2, facing: 1, outfit: THEO, pose: walkPose(ph, { run: true }), expr: 'determined', rim: rimOf(M, [-0.7, -0.7]) });
  });
  label(g, t, 'MIND', x + V(560, 300), V(300, 420), 0.4, { size: V(44, 48) }); label(g, t, 'BODY', x - 10, V(300, 420), 0.7, { size: V(44, 48), color: S().ui.accent });
  slowTint(g, 0.25); FX.drops(g, t, { count: 30, rMax: 6, drift: 2 });
} });

// ---------- title card ----------
registerShot('s031', { draw(g, t, info) {
  const M = mood('dusk'), cam = { z: 1.06 - 0.06 * ease.inOut(t / info.dur), y: -20 * t };
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); FX.sun(g, E.W / 2, E.H * V(0.64, 0.56), V(90, 110), '#fff3dc', M.key, 5); FX.godRays(g, E.W / 2, E.H * V(0.64, 0.56), { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.6, len: 1800, a: 0.06, t }); });
  layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -200, y: E.H * V(0.76, 0.66), w: E.W + 400, maxH: V(300, 500), color: shade(M.wall, -0.35), windowColor: alpha(M.practical, 0.8), seed: 21 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = shade(M.dark, -0.2); g.fillRect(-E.W, E.H * V(0.76, 0.66), E.W * 3, E.H); FX.skyline(g, { x: -200, y: E.H * V(0.82, 0.72), w: E.W + 400, minH: 60, maxH: V(160, 260), color: shade(M.dark, -0.35), windowColor: alpha(M.practical, 0.9), lit: 0.25, seed: 5 }); });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.4 });
  UI.titleCard(g, t, { lines: ['WHAT IF YOUR REFLEXES', 'WERE 100X FASTER?'], dur: info.dur, y: E.H * V(0.4, 0.38) });
} });
