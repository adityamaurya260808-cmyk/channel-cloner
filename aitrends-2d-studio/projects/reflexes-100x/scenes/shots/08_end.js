// shots/08_end.js: the false start and the whistle (s127-s139), the save (s140-s146), aftermath and hug (s147-s154),
// the letter (s155-s158), is it real (s159-s167), ending (s168-s169).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix, rng,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, slowTint, slowBadge, popIn, label, stamp, ball, car, pistol, letter, noteRings, MARKS, SETP, HUGK } from '../lib.js';
import { track, blocks } from '../sets/track.js';
import { road } from '../sets/outdoor.js';
import { kitchen, bedroom } from '../sets/indoor.js';
import { buildStadium } from '../sets/track3d.js';
import { brainIcon, reactionAxis, bar } from './02_numbers.js';
import { FAMILY_COLORS } from './07_final.js';
import { ROBOT } from './06_sam.js';
import { THEO, SAM, MIA, MOM, COACH, RUNNER, CAST } from '../cast.js';

// ---------- start line, the false start ----------
const LN = () => ({ coach: E.W * 0.14, theo: E.W * 0.38, r2: E.W * 0.56, r3: E.W * 0.72 });
const GUNUP = { ...POSES.pointUp, eF: [16, -214], hF: [20, -254] };
function line(g, t, cam, o = {}) {
  const { GY, M } = track(g, t, cam, { view: o.view || 'stands', screenText: o.screenText ?? '100 M FINAL', screenTextColor: o.screenColor, cheer: o.cheer ?? 0.2, crowdColors: FAMILY_COLORS, startLine: LN().theo + 60, wave: o.wave });
  const l = LN(), s = 1.15, rim = rimOf(M, [-0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    for (const [x, n] of [[l.r2, 4], [l.r3, 6]]) { blocks(g, x, GY, s); drawFigure(g, { x, y: GY, s, facing: 1, outfit: RUNNER(n), pose: o.othersPose || SETP, expr: o.othersExpr || 'determined', rim }); }
    blocks(g, l.theo, GY, s);
    if (o.theo !== false) drawFigure(g, { x: o.theoX ?? l.theo, y: GY, s, facing: o.theoFacing ?? 1, outfit: THEO, pose: o.theoPose || SETP, expr: o.theoExpr || 'determined', talk: o.theoTalk || 0, rim, blink: blinkAt(t, 3.3) });
    if (o.coach !== false) { drawFigure(g, { x: o.coachX ?? l.coach, y: GY, s: s * 1.05, facing: o.coachFacing ?? 1, outfit: COACH, pose: o.coachPose || GUNUP, expr: o.coachExpr || 'determined', talk: o.coachTalk || 0, rim });
      if (o.gun !== false) { const hx = l.coach + 20 * s * 1.05, hy = GY - 254 * s * 1.05; pistol(g, hx - 8, hy + 6, 0.9, -Math.PI / 2 + 0.15); } }
    o.extra?.(g, GY, s, M, l);
  });
  FX.dust(g, t, { count: 40, a: 0.3 });
  return { GY, M };
}
registerShot('s127', { draw(g, t, info) { line(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: -150, x1: -140, y0: 130, y1: 135 }), { theoPose: breathe(posesAt(t, [[0, SETP], [0.1, POSES.stand]], 0.4), t), theoExpr: 'determined' }); } });
registerShot('s128', { draw(g, t, info) { line(g, t, push(t, info, { z0: 1.8, z1: 1.86, x0: -490, x1: -480, y0: 140, y1: 145 }), { coachExpr: 'shocked', theoPose: POSES.stand }); } });
registerShot('s129', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.6, z1: 1.7, x0: 0, x1: 30, y0: -260, y1: -270 });
  const { GY } = track(g, t, cam, { view: 'stands', cheer: 0, crowdColors: FAMILY_COLORS.map((c) => shade(c, -0.25)), screenText: '100 M FINAL' });
  label(g, t, 'OHHH...', E.W / 2, E.H * 0.24, 0.2, { size: V(70, 70), color: S().ui.cream, font: FONTS.title });
} });
registerShot('s130', { draw(g, t, info) {
  const cam = push(t, info, { z0: 2.4, z1: 2.5, x0: V(150, -200) + 200, x1: V(150, -200) + 210, y0: -560, y1: -565 });
  const blink = Math.floor(t * 4) % 2 === 0;
  track(g, t, cam, { view: 'stands', cheer: 0, crowdColors: FAMILY_COLORS, screenText: 'FALSE START', screenColor: blink ? '#3a0c10' : '#1a0a10', screenTextColor: '#ff5a5a' });
} });
registerShot('s131', { draw(g, t, info) { line(g, t, push(t, info, { z0: 1.12, z1: 1.16, x0: -80, x1: -70, y0: 80, y1: 85 }), { theoPose: breathe(POSES.stand, t), theoExpr: 'determined', coachPose: GUNUP, coachExpr: 'confused', othersExpr: 'confused' }); } });
registerShot('s132', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => {
    const you = [E.W * 0.18, E.H * 0.72], gate = [E.W * 0.78, E.H * 0.34], k = ease.inOut(prog(t, 0, 0.6));
    g.setLineDash([14, 12]); seg(g, [you, [lerp(you[0], gate[0], k), lerp(you[1], gate[1], k)]], 5, alpha(c, 0.8)); g.setLineDash([]);
    circle(g, you[0], you[1], 16, ui.gold); circle(g, gate[0], gate[1], 14, ui.cream); text(g, 'GATE', gate[0], gate[1] - 44, { size: 32, color: ui.cream, font: FONTS.ui, weight: 900 }); text(g, 'YOU', you[0], you[1] + 48, { size: 32, color: ui.gold, font: FONTS.ui, weight: 900 });
    const kx = ease.out(prog(t, 0.55, 0.8)), mx = (you[0] + gate[0]) / 2, my = (you[1] + gate[1]) / 2;
    if (kx > 0) { seg(g, [[mx - 90 * kx, my - 90 * kx], [mx + 90 * kx, my + 90 * kx]], 18, ui.accent); seg(g, [[mx + 90 * kx, my - 90 * kx], [mx - 90 * kx, my + 90 * kx]], 18, ui.accent); }
    label(g, t, '8 s = TOO SLOW', E.W / 2, E.H * 0.86, 0.8, { color: ui.accent, size: V(46, 46) });
  });
} });
registerShot('s133', { draw(g, t, info) {
  const tW = wt(info, 'whistle', 0.5);
  faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => track(g2, tt, cam, { view: 'road', cheer: 0 }), bgCam: { z: 1.5, x: 200, y: -150 }, outfit: THEO, expr: exprAt(t, [[0, 'determined'], [tW, 'neutral']]), face: t > tW ? { mouth: 'o', brows: null } : null, side: -1, dx: -V(160, 0), noBlink: true,
    front: (g, tt, cx, cy, r) => { if (t > tW) noteRings(g, cx + r * 0.1, cy + r * 0.42, t - tW, { speed: 1.1, scale: 1.4 }); } });
} });
function roadWide(g, t, cam, o = {}) {
  return track(g, t, cam, { view: 'road', cheer: 0, onField: (g, fy) => { if (o.sam !== false) drawFigure(g, { x: o.samX ?? E.W / 2 + V(330, 120), y: fy + 60, s: 0.8, facing: 1, outfit: SAM, pose: o.samPose || walkPose(2.2, { run: true }), expr: o.samExpr || 'joy', blink: false }); ball(g, E.W / 2 + V(440, 220), fy - 6, 12); }, onRoad: (g, ry) => car(g, o.truckX ?? E.W * 0.2, ry + 12, 0.34, { truck: true, color: '#e8e2d8' }) });
}
registerShot('s134', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, z1: 1.1, x0: -40, x1: 0 });
  const r = roadWide(g, t, cam, { truckX: E.W * 0.15 + t * 40, samPose: walkPose(2.2 + t * 6, { run: true }), samX: E.W / 2 + V(250, 100) + t * 25 });
  layer(g, cam, 1, (g) => { blocks(g, E.W * 0.18, r.GY, 1.05); drawFigure(g, { x: E.W * 0.18, y: r.GY, s: 1.05, facing: 1, outfit: THEO, pose: breathe(POSES.stand, t), expr: 'determined', rim: rimOf(r.M, [-0.7, -0.7]) }); noteRings(g, E.W * 0.18 + 20, r.GY - 210, t, { speed: 0.6, scale: 2.2 }); });
  label(g, t, 'HIGH', E.W * 0.36, E.H * 0.3, wt(info, 'high', 0.9) - 0.1, { size: V(48, 48) }); label(g, t, 'LOW', E.W * 0.5, E.H * 0.38, wt(info, 'low', 1.9) - 0.1, { size: V(48, 48) });
} });
registerShot('s135', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => {
    const x0 = E.W * 0.14, x1 = E.W * 0.84, y = E.H * 0.6; UI.lineFigure(g, { x: x0, y: y + 110, s: 0.9, pose: POSES.stand, color: ui.gold }); UI.lineFigure(g, { x: x1, y: y + 110, s: 0.65, pose: ROBOT, color: c });
    for (let i = 0; i < 6; i++) { const ph = ((t * 0.6 + i / 6) % 1), R = ph * (x1 - x0); g.strokeStyle = alpha(ui.gold, 0.8 * (1 - ph)); g.lineWidth = 4; g.beginPath(); g.arc(x0 + 30, y - 100, R, -0.5, 0.5); g.stroke(); }
    UI.dimension(g, t, { x1: x0 + 40, y1: y + 150, x2: x1 - 20, y2: y + 150, str: '60 m', start: 0.2 });
    label(g, t, 'SOUND: 340 m/s', E.W / 2, E.H * 0.22, wt(info, 'three', 1.2) - 0.1, { size: V(72, 66), font: FONTS.title });
  });
} });
registerShot('s136', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => {
    const x0 = E.W * 0.14, x1 = E.W * 0.84, y = E.H * 0.6, tF = wt(info, 'fifth', 2.0), p = ease.inOut(prog(t, 0.3, tF));
    UI.lineFigure(g, { x: x0, y: y + 110, s: 0.9, pose: POSES.stand, color: ui.gold }); UI.lineFigure(g, { x: x1, y: y + 110, s: 0.65, pose: ROBOT, color: p >= 1 ? ui.gold : c });
    g.strokeStyle = ui.gold; g.lineWidth = 6; g.beginPath(); g.arc(x0 + 30, y - 100, p * (x1 - x0), -0.5, 0.5); g.stroke();
    if (p >= 1) { glow(g, x1, y - 40, 200, ui.gold, 0.5); FX.rings(g, x1, y - 40, t - tF, { count: 2, r0: 40, r1: 200, speed: 1.4, color: ui.gold, a: 0.5 }); }
    UI.readout(g, { label: 'SOUND REACHES SAM IN', value: (0.18 * p).toFixed(2) + ' s', x: E.W / 2, y: E.H * 0.24, align: 'center', a: clamp(popIn(t, 0.2)) });
  });
} });
registerShot('s137', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.02 * t };
  const r = roadWide(g, 0, cam);
  layer(g, cam, 1, (g) => { blocks(g, E.W * 0.18, r.GY, 1.05); drawFigure(g, { x: E.W * 0.18, y: r.GY, s: 1.05, facing: 1, outfit: THEO, pose: POSES.stand, expr: 'determined', face: { mouth: 'o' }, rim: rimOf(r.M, [-0.7, -0.7]) }); });
  const ui = S().ui, R = lerp(200, E.W * 0.95, t / info.dur); for (const [k, w] of [[0, 6], [80, 3]]) { g.strokeStyle = alpha(ui.gold, 0.8); g.lineWidth = w; g.beginPath(); g.arc(E.W * 0.18, r.GY - 210, Math.max(10, R - k), -0.9, 0.5); g.stroke(); }
  slowTint(g, 0.3); FX.drops(g, t, { count: 40, rMax: 5, drift: 1 }); slowBadge(g, t);
} });
registerShot('s138', { draw(g, t, info) {
  const tH = 0.5, M = mood('dusk');
  faceShot(g, t, info, { M, bg: (g2, tt, cam) => track(g2, 0, cam, { view: 'road', cheer: 0 }), bgCam: { z: 1.6, x: 500, y: -250 }, outfit: SAM, expr: t > tH ? 'surprised' : 'joy', side: -1, dx: V(160, 0), noBlink: true, zoom: 0.03,
    behind: (g) => { const R = lerp(0, E.W * 0.8, prog(t, 0, tH + 0.2)); g.strokeStyle = alpha(S().ui.gold, 0.9); g.lineWidth = 10; g.beginPath(); g.arc(-E.W * 0.2, E.H * 0.6, R, -0.6, 0.6); g.stroke(); } });
  if (t > tH) FX.rings(g, E.W / 2 + V(160, 0), E.H * 0.6, t - tH, { count: 2, r0: 340, r1: 520, speed: 1.2, color: S().ui.gold, a: 0.4 });
  slowTint(g, 0.25);
} });
// far curb across the road; Sam on it (depth 0.75); the truck uses the near lane (0.85)
function curbScene(g, t, cam, o = {}) {
  const r = road(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 0.75, (g) => { if (o.sam !== false) drawFigure(g, { x: o.samX ?? E.W * 0.6, y: r.roadTop - 6, s: 1.0, facing: o.samFacing ?? 1, outfit: SAM, pose: o.samPose || ROBOT, expr: o.samExpr || 'neutral', blink: false, rim: rimOf(r.M, [-0.7, -0.7]) }); o.far?.(g, r); });
  layer(g, cam, 0.85, (g) => o.near?.(g, r));
  return r;
}
registerShot('s139', { draw(g, t, info) {
  const tF = wt(info, 'freezes', 0.9) - 0.05, frozen = t > tF;
  curbScene(g, t, push(t, info, { z0: 1.9, z1: 1.96, x0: 220, x1: 240, y0: 110, y1: 112 }), { samX: E.W * 0.45 + Math.min(t, tF) * 140, samPose: frozen ? ROBOT : walkPose(t * 9, { run: true }), samExpr: frozen ? 'neutral' : 'joy' });
  if (frozen) { slowTint(g, 0.25); label(g, t, 'FREEZE', E.W * 0.7, E.H * 0.24, tF, { size: V(80, 70), color: '#cfe0ff', font: FONTS.title }); }
} });
registerShot('s140', { draw(g, t, info) {
  const M = mood('dusk'), cam = push(t, info, { z0: 1.0, z1: 1.06 }), cy = E.H * 0.62;
  layer(g, cam, 0.5, (g) => { backdrop(g, [shade(M.road, -0.3), shade(M.road, 0.05)]); glow(g, -100, E.H * 0.4, 900 * (0.4 + 0.6 * t / info.dur), '#ffe6b0', 0.5 * (0.3 + 0.7 * t / info.dur)); for (let x = -200; x < E.W + 200; x += 260) { g.fillStyle = alpha('#f2e6c8', 0.4); g.fillRect(x, E.H * 0.38, 130, 10); } });
  layer(g, cam, 1, (g) => {
    poly(g, [[-100, cy], [E.W + 100, cy], [E.W + 100, E.H + 100], [-100, E.H + 100]], shade(M.floor, 0.0)); g.fillStyle = shade(M.floor, 0.25); g.fillRect(-100, cy - 6, E.W + 200, 30); g.fillStyle = alpha('#ffffff', 0.15); g.fillRect(-100, cy - 6, E.W + 200, 3);
    const ink = S().ink, fx = E.W * 0.55, hover = cy - 120 + Math.sin(t * 0.8) * 2;
    seg(g, [[fx - 130, cy - 600], [fx - 40, cy - 330], [fx + 10, hover]], 60, ink); seg(g, [[fx + 10, hover], [fx + 150, hover - 10]], 46, ink); circle(g, fx + 10, hover, 30, ink);
    seg(g, [[fx - 120, cy - 600], [fx - 40, cy - 330], [fx + 10, hover]], 6, alpha('#ffc68a', 0.6));
    seg(g, [[fx - 380, cy - 600], [fx - 300, cy - 300], [fx - 320, cy + 10]], 60, ink); seg(g, [[fx - 320, cy + 10], [fx - 180, cy + 10]], 46, ink);
    UI.dimension(g, t, { x1: fx + 200, y1: hover, x2: fx + 200, y2: cy - 6, str: 'THE CURB', start: wt(info, 'right', 1.5) - 0.2 });
  });
  slowTint(g, 0.3); label(g, t, 'ONE FOOT IN THE AIR', E.W / 2, E.H * 0.16, 0.2, { size: V(44, 48), color: S().ui.cream });
} });
registerShot('s141', { draw(g, t, info) {
  const k = prog(t, 0.05, 0.8), [sx, sy] = shake(t, 14 * (1 - prog(t, 0.2, 1.5)), 30);
  const cam = { z: 1.4, x: 140 + sx, y: -40 + sy };
  curbScene(g, t, cam, { near: (g, r) => car(g, lerp(-900, E.W + 900, ease.inOut(k)), r.laneY + 140, 1.6, { truck: true, color: '#e8e2d8', blur: 1 }) });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H / 2, count: 50, a: 0.25 * (1 - prog(t, 0.8, 1.4)) });
} });
registerShot('s142', { draw(g, t, info) {
  const M = mood('dusk'), cam = push(t, info, { z0: 1.0, z1: 1.08 }), gy = E.H * 0.82;
  blurLayer(g, 14, (g2) => road(g2, t, { z: 2.0, x: 400 * t, y: 100 }, { mood: 'dusk' })); veil(g, '#0a0710', 0.3);
  layer(g, cam, 1, (g) => {
    g.fillStyle = shade(M.road, -0.1); g.fillRect(-E.W, gy, E.W * 3, E.H);
    const wx = E.W * 0.62, R = V(260, 220), rot = t * 8; circle(g, wx, gy - R, R, '#0c0b10'); circle(g, wx, gy - R, R * 0.45, '#55505f'); for (let i = 0; i < 5; i++) { const a = rot + i * 1.256; seg(g, [[wx, gy - R], [wx + Math.cos(a) * R * 0.42, gy - R + Math.sin(a) * R * 0.42]], 10, '#2a2834'); }
    rr(g, wx - R * 1.6, gy - R * 2.4, R * 3.2, R * 0.6, 10); g.fillStyle = '#d8d2c8'; g.fill();
    const bx = lerp(E.W * 0.2, wx - R * 0.55, ease.in(prog(t, 0, info.dur))), squash = prog(t, info.dur - 0.5, info.dur);
    g.save(); g.translate(bx, gy - 40 * (1 - squash * 0.5)); g.scale(1 + squash * 0.4, 1 - squash * 0.5); ball(g, 0, 0, 40, -t * 6); g.restore();
  });
} });
registerShot('s143', { draw(g, t, info) {
  const M = mood('dusk'), gy = E.H * 0.82, [sx, sy] = shake(t, 12, 30);
  blurLayer(g, 14, (g2) => road(g2, t, { z: 2.0, x: 600 + 400 * t + sx, y: 100 + sy }, { mood: 'dusk' })); veil(g, '#0a0710', 0.3);
  const cx = E.W * 0.45, cy = gy - 40, r = rng(9);
  for (let i = 0; i < 14; i++) { const a = r() * Math.PI - Math.PI, d = 40 + t * (300 + r() * 500); poly(g, [[cx + Math.cos(a) * d, cy + Math.sin(a) * d], [cx + Math.cos(a + 0.2) * (d + 30), cy + Math.sin(a + 0.2) * (d + 30)], [cx + Math.cos(a - 0.15) * (d + 24), cy + Math.sin(a - 0.15) * (d + 24)]], alpha('#e0402f', 1 - prog(t, 0.3, 0.9))); }
  FX.rings(g, cx, cy, t, { count: 3, r0: 40, r1: 600, speed: 1.6, color: '#fff3e0', a: 0.7 * (1 - prog(t, 0, 0.9)) });
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#fff3e0', 0.6 * (1 - prog(t, 0, 0.3))); g.fillRect(0, 0, E.W, E.H); g.restore();
  label(g, t, 'POP!', cx, E.H * 0.34, 0.0, { size: V(140, 120), color: '#fff3e0', font: FONTS.title });
} });
registerShot('s144', { draw(g, t, info) {
  curbScene(g, t * 0.3, push(t, info, { z0: 1.2, z1: 1.18, x0: 140, x1: 140, y0: -30, y1: -30 }), { samX: E.W * 0.6 });
  FX.dust(g, t, { count: 60, a: 0.35, speed: 4 });
} });
registerShot('s145', { draw(g, t, info) {
  const tW = wt(info, 'waves', 2.1);
  curbScene(g, t, push(t, info, { z0: 2.2, z1: 2.28, x0: 256, x1: 262, y0: 128, y1: 130 }), { samX: E.W * 0.6, samFacing: t > 0.5 ? -1 : 1, samPose: breathe(posesAt(t, [[0, ROBOT], [0.5, POSES.relaxed], [tW - 0.2, POSES.wave]]), t * 2), samExpr: t > 0.6 ? 'happy' : 'neutral' });
  FX.dust(g, t, { count: 40, a: 0.3 });
} });
registerShot('s146', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.4, x0: -100, x1: -120, y0: -220, y1: -200 });
  track(g, t, cam, { view: 'stands', cheer: 1.2, wave: 1, crowdColors: FAMILY_COLORS });
  FX.dust(g, t, { count: 40, a: 0.3 });
} });

// ---------- aftermath ----------
function after(g, t, cam, o = {}) {
  const { GY, M } = track(g, t, cam, { view: 'stands', cheer: 0.8, crowdColors: FAMILY_COLORS, mood: 'golden' });
  const rim = rimOf(M, [-0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    if (o.theo !== false) drawFigure(g, { x: o.theoX ?? E.W * 0.42, y: GY, s: 1.3, facing: 1, outfit: THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'smile', talk: o.theoTalk || 0, rim, blink: blinkAt(t, 3.3) });
    if (o.coach !== false) drawFigure(g, { x: o.coachX ?? E.W * 0.6, y: GY, s: 1.36, facing: -1, outfit: COACH, pose: o.coachPose || breathe(POSES.relaxed, t, 1, 5), expr: o.coachExpr || 'smile', talk: o.coachTalk || 0, rim, blink: blinkAt(t, 3.7, 1) });
    o.extra?.(g, GY, M, rim);
  });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.35 });
  return { GY, M };
}
registerShot('s147', { draw(g, t, info) { after(g, t, push(t, info, { z0: 1.2, z1: 1.26, x0: 20, x1: 40, y0: 120, y1: 125 }), { coachX: lerp(E.W * 0.95, E.W * 0.62, t / info.dur), coachPose: walkPose(t * 4.6) }); } });
registerShot('s148', { draw(g, t, info) { faceShot(g, t, info, { M: mood('golden'), bg: (g2, tt, cam) => track(g2, tt, cam, { view: 'stands', cheer: 0.5, crowdColors: FAMILY_COLORS, mood: 'golden' }), bgCam: { z: 1.5, x: -150, y: -200 }, outfit: COACH, expr: 'smile', talk: () => talk(info), side: 1, dx: V(200, 0), seed: 2 }); } });
registerShot('s149', { draw(g, t, info) {
  const shoulder = { ...POSES.reach, eF: [30, -180], hF: [58, -176] }, tF = wt(info, 'fast', 1.2);
  after(g, t, push(t, info, { z0: 1.6, z1: 1.68, x0: 60, x1: 70, y0: 180, y1: 185 }), { theoX: E.W * 0.46, coachX: E.W * 0.58, theoTalk: talk(info, 'i', 'know'), theoExpr: 'smile', coachPose: breathe(shoulder, t), coachTalk: talk(info, 'fast', 'does') });
  const ui = S().ui; label(g, t, "FAST DOESN'T MATTER.", E.W / 2, E.H * 0.16, tF - 0.1, { size: V(44, 44), color: ui.cream, font: FONTS.title });
  label(g, t, 'ON TIME DOES.', E.W / 2, E.H * 0.25, wt(info, 'on', 2.8, tF) - 0.1, { size: V(60, 56), font: FONTS.title });
} });
registerShot('s150', { draw(g, t, info) { faceShot(g, t, info, { M: mood('golden'), bg: (g2, tt, cam) => track(g2, tt, cam, { view: 'stands', cheer: 0.6, crowdColors: FAMILY_COLORS, mood: 'golden' }), bgCam: { z: 2.2, x: 0, y: -300 }, outfit: MIA, expr: 'cry', face: { mouth: 'smile' }, side: 1, dx: V(200, 0), seed: 1 }); } });
registerShot('s151', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.25, z1: 1.3, x0: -80, x1: 80, y0: 130, y1: 130 });
  after(g, t, cam, { theo: false, coach: false, extra: (g, GY, M, rim) => drawFigure(g, { x: lerp(E.W * 0.1, E.W * 0.85, t / info.dur), y: GY, s: 1.3, facing: 1, outfit: MOM, pose: walkPose(t * 2 * Math.PI * 1.5, { run: true }), expr: 'cry', rim }) });
} });
registerShot('s152', { draw(g, t, info) {
  const tJ = 0.4, tH = 0.95, kj = prog(t, tJ, tH);
  after(g, t, push(t, info, { z0: 1.55, z1: 1.62, x0: 20, x1: 30, y0: 180, y1: 185 }), { coach: false, theoX: E.W * 0.44, theoPose: breathe(posesAt(t, [[0, POSES.relaxed], [0.2, POSES.kneel], [tH - 0.1, HUGK]]), t), theoExpr: t > tH ? 'happy' : 'smile',
    extra: (g, GY, M, rim) => { const x = t < tJ ? lerp(E.W * 0.85, E.W * 0.66, t / tJ) : lerp(E.W * 0.66, E.W * 0.5, ease.out(kj)), y = GY - (t < tJ ? 0 : Math.sin(Math.min(1, kj) * Math.PI) * 160 + (t > tH ? 70 : kj * 70));
      drawFigure(g, { x, y, s: 1.3, facing: -1, outfit: SAM, pose: t < tJ ? walkPose(t * 10, { run: true }) : t < tH ? POSES.jump : { ...POSES.cheer, eF: [26, -170], hF: [10, -150], eB: [20, -170], hB: [4, -146] }, expr: 'joy', rim, shadow: t < tJ }); } });
  if (t > tH) FX.rings(g, E.W * 0.5, E.H * 0.5, t - tH, { count: 2, r0: 60, r1: 260, speed: 1.2, color: '#fff3e0', a: 0.4 * (1 - prog(t, tH, tH + 1)) });
} });
function hug(g, t, cam) {
  const { GY, M } = track(g, t, cam, { view: 'stands', cheer: 0.3, crowdColors: FAMILY_COLORS, mood: 'golden' }), rim = rimOf(M, [-0.7, -0.7], 5);
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W * 0.47, y: GY, s: 1.3, facing: 1, outfit: THEO, pose: breathe(HUGK, t, 0.6), expr: 'happy', rim, blink: blinkAt(t, 3.3) }); drawFigure(g, { x: E.W * 0.5, y: GY - 70, s: 1.3, facing: -1, outfit: SAM, pose: breathe({ ...POSES.cheer, eF: [26, -170], hF: [10, -150], eB: [20, -170], hB: [4, -146], kF: [10, -60], fF: [-6, -20], kB: [-10, -60], fB: [-20, -22] }, t, 0.6, 2), expr: 'joy', rim, shadow: false }); });
  return { GY, M };
}
registerShot('s153', { draw(g, t, info) {
  hug(g, t, push(t, info, { z0: 1.5, z1: 1.75, x0: -10, x1: -20, y0: 150, y1: 190 }));
  FX.dust(g, t, { count: 90, color: '#ffe2bd', a: 0.5, speed: 3 }); FX.godRays(g, E.W * 0.1, E.H * 0.1, { count: 9, angle: Math.PI * 0.25, spread: 0.8, len: 1800, a: 0.07, t }); FX.lensStreak(g, E.W / 2, E.H * 0.3, E.W, '#ffe0b0', 0.2);
} });
registerShot('s154', { kind: '3d',
  init(T) { const s = buildStadium(T, { mood: 'golden', crowdColors: FAMILY_COLORS }); const th = T.figure3D(THEO, { rim: s.M.rim, pose: HUGK }); th.position.set(0, 0, 0); s.stage.add(th);
    const sam = T.figure3D(SAM, { rim: s.M.rim, pose: { ...POSES.cheer, eF: [26, -170], hF: [10, -150], eB: [20, -170], hB: [4, -146] } }); sam.position.set(0.5, 0.5, 0); sam.rotation.y = Math.PI; s.stage.add(sam);
    for (const [of, x, z] of [[MOM, 3, -2], [MIA, 3.6, -1], [COACH, -2.4, 1.6]]) { const f = T.figure3D(of, { rim: s.M.rim, pose: POSES.relaxed }); f.position.set(x, 0, z); f.rotation.y = Math.atan2(-z, -x) + Math.PI / 2; s.stage.add(f); } return s; },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0.2, 0.9, 0], radius: [5.2, 7], height: [1.6, 2.6], from: -0.5, to: 0.6, dur: info.dur }); },
  overlay(g, t) { FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.4 }); },
});

// ---------- the letter ----------
registerShot('s155', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, z1: 1.22, x0: 260, x1: 300, y0: 80, y1: 90 });
  const { GY, M, doorX } = bedroom(g, t, cam, { doorGlow: 0.9 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 + V(250, 160), y: GY - 30, s: 1.25, facing: 1, outfit: THEO, pose: breathe(POSES.sit, t), expr: exprAt(t, [[0, 'sleepy'], [1.4, 'surprised']]), look: [1, 0.6], rim: rimOf(M, [-0.6, -0.8]), shadow: false });
    const k = ease.out(prog(t, 0.8, 2.0)); g.save(); g.translate(doorX + 95 - k * 260, GY - 4); g.scale(1, 0.25); letter(g, 0, 0, 0.6); g.restore();
  });
} });
registerShot('s156', { draw(g, t, info) {
  const M = mood('night'); blurLayer(g, 14, (g2) => bedroom(g2, t, { z: 1.6, x: 200, y: -100 })); veil(g, '#05060c', 0.4);
  const cam = push(t, info, { z0: 1.0, z1: 1.06, r: 0.01 });
  layer(g, cam, 1, (g) => { const ink = S().ink; for (const s of [-1, 1]) { seg(g, [[E.W / 2 + s * 330, E.H * 0.72], [E.W / 2 + s * 700, E.H * 1.2]], 70, ink); seg(g, [[E.W / 2 + s * 420, E.H * 0.85], [E.W / 2 + s * 800, E.H * 1.3]], 96, THEO.color); }
    letter(g, E.W / 2, E.H * 0.5, V(3.4, 3)); glow(g, E.W * 0.3, E.H * 0.2, 600, '#c9d4ff', 0.12);
    for (const s of [-1, 1]) { rr(g, E.W / 2 + s * 330 - 34, E.H * 0.5 + 120, 68, 150, 34); g.fillStyle = S().ink; g.fill(); } });
  label(g, t, 'NO NAME', E.W / 2, E.H * 0.16, wt(info, 'name', 0.4) - 0.1, { size: V(52, 56), color: S().ui.cream });
  label(g, t, 'JUST ONE LINE', E.W / 2, E.H * 0.86, wt(info, 'one', 1.4) - 0.1, { size: V(40, 44), color: alpha(S().ui.cream, 0.8) });
} });
function paper(g, t, info, lines) {
  blurLayer(g, 16, (g2) => bedroom(g2, t, { z: 1.8, x: -300, y: -200 })); veil(g, '#05060c', 0.5);
  const cam = push(t, info, { z0: 1.0, z1: 1.05 }), pw = V(1300, 900), ph = V(560, 900);
  layer(g, cam, 1, (g) => { rr(g, E.W / 2 - pw / 2, E.H / 2 - ph / 2, pw, ph, 8); g.fillStyle = '#efe6d2'; g.fill(); glow(g, E.W / 2, E.H / 2, pw * 0.7, '#c9d4ff', 0.1);
    lines.forEach(([str, at, y], i) => { const n = Math.floor(str.length * clamp((t - at) / (str.length * 0.045))); if (n <= 0) return; text(g, str.slice(0, n), E.W / 2, E.H / 2 + y, { size: V(54, 46), color: '#2a2230', font: FONTS.serif, weight: 900, italic: true }); }); });
}
registerShot('s157', { draw(g, t, info) { paper(g, t, info, [['We saw what you did on that road.', 0.1, -30]]); } });
registerShot('s158', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('night'), bg: (g2, tt, cam) => bedroom(g2, tt, cam), bgCam: { z: 1.4, x: 100, y: -150 }, outfit: THEO, expr: 'awe', rimColor: '#c9d4ff', side: -1, dx: -V(380, 0), look: [0.6, 0.3], noBlink: true, zoom: 0.06,
    front: (g) => { const k = popIn(t, 0.1, 0.4); if (k <= 0) return; g.save(); g.translate(E.W * V(0.72, 0.5), E.H * V(0.42, 0.22)); g.rotate(-0.04); g.scale(k, k); rr(g, -330, -90, 660, 180, 8); g.fillStyle = '#efe6d2'; g.fill(); text(g, 'We would like to test you.', 0, 4, { size: V(46, 42), color: '#2a2230', font: FONTS.serif, weight: 900, italic: true }); g.restore(); } });
} });

// ---------- is any of this real ----------
registerShot('s159', { draw(g, t, info) { UI.blueprint(g); UI.bigLine(g, t, { str: 'IS ANY OF THIS REAL?', dur: info.dur + 0.4, size: V(100, 84) }); } });
registerShot('s160', { draw(g, t, info) { UI.blueprint(g); stamp(g, t, 'PARTLY.', E.W / 2, E.H / 2, 0.05, V(130, 110), S().ui.gold, -0.05); } });
const realTag = (g, t, at) => { const k = popIn(t, at); if (k <= 0) return; g.save(); g.translate(E.W - V(260, 200), V(130, 200)); g.scale(k, k); rr(g, -110, -36, 220, 72, 36); g.fillStyle = alpha(S().ui.good, 0.2); g.fill(); g.strokeStyle = S().ui.good; g.lineWidth = 4; g.stroke(); text(g, 'REAL', 0, 2, { size: 40, color: S().ui.good, font: FONTS.title, weight: 700, spacing: 4 }); g.restore(); };
registerShot('s161', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), x0 = V(560, 140), x1 = E.W - V(220, 120), y = E.H * 0.48;
  reactionAxis(g, x0, x1, y + 140); UI.lineFigure(g, { x: V(330, 0), y: y + 110, s: 1.0, pose: POSES.stand, color: alpha(c, 0.9) });
  const p = ease.inOut(prog(t, 0.4, wt(info, 'quarter', 2.8) + 0.3)); bar(g, x0, x1, y, 'HUMAN VISUAL REACTION', '~0.25 s', (0.25 / 0.3) * p, c, 1, clamp(p * 4));
  realTag(g, t, wt(info, 'quarter', 2.8) + 0.2);
} });
registerShot('s162', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x0 = V(380, 140), x1 = E.W - V(200, 100), y = E.H * 0.6, sc = (x1 - x0) / 0.3;
  reactionAxis(g, x0, x1, y + 60); pistol(g, x0 - 60, y - 40, 1.2, 0, c);
  const k = ease.out(prog(t, wt(info, 'tenth', 2.4) - 0.3, wt(info, 'tenth', 2.4) + 0.3)); g.fillStyle = alpha(ui.accent, 0.2 * k); g.fillRect(x0, y - 220, 0.1 * sc * k, 280); rr(g, x0 + 0.1 * sc - 8, y - 220 * k, 16, 280 * k, 6); g.fillStyle = ui.accent; g.fill();
  label(g, t, 'UNDER 0.10 s = FALSE START', E.W / 2, E.H * 0.2, wt(info, 'false', 3.6) - 0.1, { color: ui.accent, size: V(50, 46) });
  realTag(g, t, wt(info, 'false', 3.6) + 0.3);
} });
function eye(g, x, y, r, c, a = 1) { g.strokeStyle = alpha(c, a); g.lineWidth = 5; g.beginPath(); g.ellipse(x, y, r, r * 0.55, 0, 0, 7); g.stroke(); circle(g, x, y, r * 0.28, alpha(c, a)); }
function flyEye(g, x, y, r, c, a = 1) { for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { const px = x + i * r * 0.26 + (j % 2) * r * 0.13, py = y + j * r * 0.22; if (Math.hypot(px - x, py - y) < r) { g.strokeStyle = alpha(c, a); g.lineWidth = 2; g.beginPath(); for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3; g.lineTo(px + Math.cos(an) * r * 0.12, py + Math.sin(an) * r * 0.12); } g.closePath(); g.stroke(); } } }
registerShot('s163', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => { const items = [['HUMAN', 0.2], ['CAT', 0.5], ['HOUSEFLY', 0.8]];
    items.forEach(([n, fx], i) => { const k = popIn(t, 0.2 + i * 0.4), x = E.W * fx, y = E.H * 0.48; if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); if (i < 2) eye(g, 0, 0, 110, i === 1 ? ui.cream : c); else { glow(g, 0, 0, 220, ui.gold, 0.35); flyEye(g, 0, 0, 120, ui.gold); } g.restore(); text(g, n, x, y + 190, { size: V(40, 40), color: i === 2 ? ui.gold : c, font: FONTS.ui, weight: 900, spacing: 3, alpha: clamp(k) }); });
    label(g, t, 'SEE FASTER THAN US', E.W * 0.65, E.H * 0.18, wt(info, 'faster', 1.8) - 0.1, { size: V(46, 46) }); });
} });
registerShot('s164', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui;
  const panel = (x, lab, strobe, col) => { rr(g, x - E.W * 0.21, E.H * 0.22, E.W * 0.42, E.H * 0.56, 20); g.strokeStyle = alpha(col, 0.6); g.lineWidth = 3; g.stroke(); const on = strobe ? (Math.floor(t * 2.5) % 2 === 0 ? 1 : 0.15) : 1;
    seg(g, [[x, E.H * 0.22], [x, E.H * 0.34]], 4, col); rr(g, x - 70, E.H * 0.34, 140, 40, 12); g.fillStyle = col; g.fill(); glow(g, x, E.H * 0.42, 260, ui.gold, 0.5 * on); circle(g, x, E.H * 0.4, 26, alpha('#fff8e0', on));
    text(g, lab, x, E.H * 0.72, { size: V(38, 38), color: col, font: FONTS.ui, weight: 900, spacing: 3 }); };
  panel(E.W * 0.27, 'YOU: SMOOTH LIGHT', false, c); panel(E.W * 0.73, 'FLY: FLICKER', true, ui.gold);
  flyEye(g, E.W * 0.73, E.H * 0.6, 40, ui.gold, 0.8); eye(g, E.W * 0.27, E.H * 0.6, 50, c, 0.8);
} });
registerShot('s165', { draw(g, t, info) {
  const M = mood('interiorWarm'), cam = push(t, info, { z0: 1.0, z1: 1.04 });
  blurLayer(g, 12, (g2) => kitchen(g2, t, { z: 1.8, x: -600, y: -120 })); veil(g, '#120a10', 0.3);
  layer(g, cam, 1, (g) => {
    const y = E.H * 0.78; g.fillStyle = shade(M.wall, -0.15); g.fillRect(-E.W, y, E.W * 3, E.H); g.fillStyle = alpha(M.key, 0.3); g.fillRect(-E.W, y, E.W * 3, 3);
    const tS = 1.5, down = ease.in(prog(t, tS - 0.25, tS)), up = ease.out(prog(t, tS + 0.3, tS + 1.0)), hy = lerp(E.H * 0.1, y - 30, down) - up * 300;
    const ink = S().ink; seg(g, [[E.W * 0.5, hy], [E.W * 0.62, hy - 500]], 80, ink); circle(g, E.W * 0.5, hy, 70, ink); for (let i = 0; i < 4; i++) seg(g, [[E.W * 0.5 - 40 + i * 26, hy], [E.W * 0.5 - 60 + i * 30, hy + 60]], 22, ink);
    const dodge = ease.out(prog(t, tS - 0.12, tS + 0.2)), fx = E.W * 0.5 + dodge * 300 + Math.sin(t * 9) * 8, fy = y - 40 - dodge * 120 + Math.sin(t * 13) * 6;
    circle(g, fx, fy, 14, '#16121a'); g.fillStyle = 'rgba(225,238,255,.55)'; const wf = Math.abs(Math.sin(t * 90)); g.beginPath(); g.ellipse(fx - 4, fy - 14, 6, 14 * wf + 2, -0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse(fx + 6, fy - 14, 6, 14 * wf + 2, 0.4, 0, 7); g.fill();
    if (t > tS && t < tS + 0.4) FX.rings(g, E.W * 0.5, y - 20, t - tS, { count: 2, r0: 40, r1: 200, speed: 2, color: '#fff3e0', a: 0.5 });
  });
  label(g, t, 'MISSED!', E.W * 0.74, E.H * 0.26, 1.7, { size: V(64, 60), color: S().ui.accent, font: FONTS.title });
} });
registerShot('s166', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, x = E.W / 2, y = E.H * 0.46;
  glow(g, x, y, 260, ui.gold, 0.4); brainIcon(g, x, y, 120, ui.gold, 8);
  label(g, t, '100x ?', x, E.H * 0.8, wt(info, 'hundred', 1.2) - 0.1, { size: V(90, 84), font: FONTS.title });
} });
registerShot('s167', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, x0 = E.W * 0.14, x1 = E.W * 0.86, y = E.H * 0.5;
  brainIcon(g, x0, y, 60, ui.gold, 5); seg(g, [[x0 + 80, y], [x1 - 40, y]], 4, alpha(c, 0.6)); UI.lineFigure(g, { x: x1, y: y + 120, s: 0.7, pose: POSES.reach, color: c });
  const px = lerp(x0 + 80, x1 - 40, (t * 0.12) % 1); glow(g, px, y, 70, ui.gold, 0.9); circle(g, px, y, 10, '#fff8e0');
  label(g, t, 'NERVES: ~100 m/s', E.W / 2, E.H * 0.28, 0.2, { size: V(56, 56), color: c }); label(g, t, 'TOO SLOW TO KEEP UP', E.W / 2, E.H * 0.74, wt(info, 'slow', 1.0) - 0.1, { size: V(48, 48), color: ui.accent });
} });

// ---------- ending ----------
registerShot('s168', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.68, x0: 60, x1: 90, y0: 140, y1: 160 });
  const { GY, M } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(40, 120), y: GY, s: 1.3, facing: 1, outfit: THEO, pose: breathe({ ...POSES.holdFront, head: [8, -210] }, t), expr: 'thinking', look: [0.6, -0.6], rim: { color: '#c9d4ff', dir: [0.3, -1], w: 5 }, prop: { type: 'paper' } }));
  FX.dust(g, t, { count: 40, color: '#c9d4ff', a: 0.3 });
} });
registerShot('s169', { draw(g, t, info) {
  const M = mood('dusk');
  UI.endScreen(g, t, { question: 'Could reflexes ever be instant?', cast: CAST, moodColors: [shade(M.dark, -0.3), M.dark, shade(M.wall, -0.2)], rim: M.rim });
  label(g, t, 'WHICH SUPERPOWER NEXT?', E.W / 2, V(420, 700), wt(info, 'superpower', 4.0) - 0.4, { size: V(40, 44), color: S().ui.gold });
  FX.dust(g, t, { count: 40, a: 0.3 });
} });
