// shots/07_final.js: sports day (s103-s111), the ball and the truck (s112-s117), the math (s118-s121), the choice (s122-s126).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, slowTint, slowBadge, popIn, label, stamp, ball, car, pistol, MARKS, SETP } from '../lib.js';
import { track, blocks } from '../sets/track.js';
import { road } from '../sets/outdoor.js';
import { buildStadium } from '../sets/track3d.js';
import { brainIcon } from './02_numbers.js';
import { THEO, SAM, MIA, MOM, COACH, RUNNER } from '../cast.js';

export const FAMILY_COLORS = ['#6a5a90', '#7a6a98', '#5a4e80', '#8a6a9a', '#9a5a6a', '#c0704a', '#4a7a8a'];
registerShot('s103', { kind: '3d',
  init(T) { const s = buildStadium(T, { mood: 'dusk', crowdColors: FAMILY_COLORS, screenColor: '#c08040' }); for (let i = 0; i < 4; i++) { const r = T.figure3D(i === 1 ? THEO : RUNNER(i + 2), { rim: s.M.rim, pose: POSES.stand }); r.position.set(-48, 0, -2.4 + i * 1.6); s.stage.add(r); } return s; },
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [-6, 16, 38], look: [-22, 4, -8] }], [info.dur, { pos: [-16, 13, 34], look: [-32, 3, -8] }]]); },
});

// ---------- the final, start line ----------
const LN = () => ({ coach: E.W * 0.14, theo: E.W * 0.38, r2: E.W * 0.56, r3: E.W * 0.72 });
function final(g, t, cam, o = {}) {
  const { GY, M } = track(g, t, cam, { view: 'stands', screenText: o.screenText ?? '100 M FINAL', screenTextColor: o.screenColor, cheer: o.cheer ?? 0.6, crowdColors: FAMILY_COLORS, startLine: LN().theo + 60, wave: o.wave });
  const l = LN(), s = o.s ?? 1.15, rim = rimOf(M, [-0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    for (const [x, n] of [[l.r2, 4], [l.r3, 6]]) { blocks(g, x, GY, s); drawFigure(g, { x, y: GY, s, facing: 1, outfit: RUNNER(n), pose: o.othersPose || breathe(POSES.relaxed, t, 1, n), expr: 'determined', rim }); }
    blocks(g, l.theo, GY, s);
    drawFigure(g, { x: l.theo, y: GY, s, facing: 1, outfit: THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'determined', look: o.theoLook, rim, blink: blinkAt(t, 3.3) });
    if (o.coach !== false) drawFigure(g, { x: l.coach, y: GY, s: s * 1.05, facing: 1, outfit: COACH, pose: o.coachPose || breathe(POSES.stand, t, 1, 5), expr: o.coachExpr || 'determined', talk: o.coachTalk || 0, rim });
    o.extra?.(g, GY, s, M, l);
  });
  FX.dust(g, t, { count: 40, a: 0.3 });
  return { GY, M };
}
const GUNUP = { ...POSES.pointUp, eF: [16, -214], hF: [20, -254] };
const coachGun = (g, GY, s, l) => { const hx = l.coach + 20 * s * 1.05, hy = GY - 254 * s * 1.05; pistol(g, hx - 8, hy + 6, 0.9, -Math.PI / 2 + 0.15); };
registerShot('s104', { draw(g, t, info) { final(g, t, push(t, info, { z0: 1.05, z1: 1.12, x0: 60, x1: 20, y0: 30, y1: 50 }), { othersPose: null }); } });

// road view: fence, gate, main road. Sam/ball/truck drawn through callbacks (depth 0.6 field, 0.4 road)
function roadView(g, t, cam, o = {}) {
  return track(g, t, cam, { view: 'road', cheer: 0, onField: o.onField, onRoad: o.onRoad, gateX: o.gateX });
}
registerShot('s105', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06, x0: -80, x1: 40 }), ui = S().ui;
  const { GY, M, fenceY, roadY, gateX } = roadView(g, t, cam, { onRoad: (g, ry) => { for (let i = 0; i < 2; i++) car(g, ((t * 500 + i * 1500) % 3200) - 600, ry + 12, 0.32, { color: ['#3a3a5a', '#2a4a5a'][i] }); } });
  layer(g, cam, 1, (g) => { blocks(g, E.W * 0.2, GY, 1); drawFigure(g, { x: E.W * 0.2, y: GY, s: 1.05, facing: 1, outfit: THEO, pose: breathe(POSES.relaxed, t), expr: 'neutral', rim: rimOf(M, [-0.7, -0.7]) }); });
  layer(g, cam, 0.6, (g) => { UI.callout(g, t, { at: [gateX, fenceY - 30], to: [gateX + 200, fenceY + 110], str: 'OPEN GATE', start: 0.6, color: ui.cream }); UI.callout(g, t, { at: [E.W * 0.32, roadY - 20], to: [E.W * 0.24, roadY - 190], str: 'MAIN ROAD', start: wt(info, 'main', 1.6) - 0.1, color: ui.accent }); });
} });
registerShot('s106', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.05, x0: -30, x1: 30 });
  blurLayer(g, 10, (g2) => track(g2, t, { z: 2.2, x: 0, y: -280 }, { view: 'stands', cheer: 1, crowdColors: FAMILY_COLORS })); veil(g, '#0a0710', 0.25);
  const M = mood('dusk'), y = E.H * 0.98, rim = rimOf(M, [-0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W * 0.32, y, s: 1.9, facing: 1, outfit: MOM, pose: breathe(POSES.cheer, t * 2, 1.4), expr: 'joy', rim });
    drawFigure(g, { x: E.W * 0.5, y: y - Math.max(0, Math.sin(t * 7)) * 30, s: 1.9, facing: 1, outfit: SAM, pose: breathe(POSES.cheer, t * 2, 1.4, 2), expr: 'joy', rim });
    drawFigure(g, { x: E.W * 0.68, y, s: 1.9, facing: -1, outfit: MIA, pose: breathe(POSES.wave, t * 2, 1.4, 3), expr: 'happy', rim });
    g.fillStyle = shade(M.dark, -0.2); g.fillRect(-E.W, y - 150, E.W * 3, 16); for (let x = -200; x < E.W + 200; x += 70) g.fillRect(x, y - 150, 8, 200);
  });
  FX.dust(g, t, { count: 40, a: 0.35 });
} });
registerShot('s107', { draw(g, t, info) { final(g, t, push(t, info, { z0: 1.5, z1: 1.56, x0: -110, x1: -100, y0: 160, y1: 165 }), { coach: false, theoPose: breathe(posesAt(t, [[0, POSES.relaxed], [0.3, POSES.crouch], [0.9, MARKS]], 0.4), t, 0.4), othersPose: MARKS }); } });
registerShot('s108', { draw(g, t, info) {
  final(g, t, push(t, info, { z0: 1.7, z1: 1.76, x0: -450, x1: -440, y0: 190, y1: 195 }), { coachPose: breathe(posesAt(t, [[0, POSES.stand], [0.2, GUNUP]]), t), coachTalk: talk(info), coachExpr: 'determined', theoPose: MARKS, othersPose: MARKS, extra: (g, GY, s, M, l) => coachGun(g, GY, s, l) });
} });
registerShot('s109', { draw(g, t, info) {
  final(g, t, push(t, info, { z0: 1.6, z1: 1.68, x0: -150, x1: -140, y0: 175, y1: 180 }), { cheer: 0, coachPose: GUNUP, theoPose: posesAt(t, [[0, MARKS], [0.15, SETP]], 0.35), othersPose: posesAt(t, [[0, MARKS], [0.2, SETP]], 0.35), extra: (g, GY, s, M, l) => coachGun(g, GY, s, l) });
} });
registerShot('s110', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => track(g2, 0, cam, { view: 'stands', cheer: 0, crowdColors: FAMILY_COLORS }), bgCam: { z: 1.5, x: 150, y: -200 }, outfit: THEO, expr: 'determined', side: -1, dx: -V(120, 0), tilt: 0.12, zoom: 0.04, noBlink: true });
  for (let i = 0; i < 2; i++) { const k = prog(t, i * 1.0, i * 1.0 + 0.6); if (k > 0 && k < 1) FX.rings(g, E.W / 2 - V(120, 0), E.H * 0.6, k * 0.8, { count: 1, r0: 360, r1: 470, color: S().ui.accent, a: 0.35 * (1 - k) }); }
} });
registerShot('s111', { draw(g, t, info) {
  const tS = wt(info, 'see', 0.9), M = mood('dusk');
  blurLayer(g, 16, (g2) => track(g2, 0, { z: 1.5, x: 0, y: -200 }, { view: 'road', cheer: 0 })); veil(g, '#0a0710', 0.4);
  const r = V(900, 800) * (1 + 0.04 * t), cx = E.W * 0.5 + r * 0.34, cy = E.H * 0.5 + r * 0.16;
  bigFace(g, cx, cy, r, { outfit: THEO, expr: t > tS ? 'shocked' : 'determined', look: [t > tS ? 1 : 0, 0], rimColor: M.rim, rimSide: -1, face: { brows: t > tS ? 'raised' : 'worried' } });
  if (t > tS) FX.rings(g, E.W * 0.5, E.H * 0.42, t - tS, { count: 2, r0: 100, r1: 300, speed: 1.6, color: '#fff3e0', a: 0.4 * (1 - prog(t, tS, tS + 1)) });
} });

// ---------- the ball, Sam, the truck ----------
function ballPath(u, gateX, fenceY, roadY) { const x = lerp(E.W * 0.08, gateX + 40, u), base = lerp(fenceY + 60, fenceY - 10, u), bounce = Math.abs(Math.sin(u * Math.PI * 4)) * (1 - u * 0.6) * 90; return [x, base - bounce]; }
registerShot('s112', { draw(g, t, info) {
  const cam = push(t, info, { z0: 2.0, z1: 2.1, x0: 420, x1: 520, y0: -10, y1: -5 }), u = prog(t, 0, info.dur * 1.15);
  roadView(g, t, cam, { onField: (g, fy) => { const gx = E.W / 2 + V(380, 160); const [x, y] = ballPath(u, gx, fy, fy - 50); ball(g, x, y, 14, t * 8); circle(g, x, fy + 66, 10 * (0.6 + 0.4 * (1 - Math.abs(Math.sin(u * Math.PI * 4)))), 'rgba(0,0,0,.25)'); } });
} });
registerShot('s113', { draw(g, t, info) {
  const cam = push(t, info, { z0: 2.0, z1: 2.08, x0: 520, x1: 600, y0: -10, y1: -5 }), u = prog(t, -info.dur * 0.4, info.dur * 1.4);
  roadView(g, t, cam, { onField: (g, fy) => { const gx = E.W / 2 + V(380, 160), M = mood('dusk'); const [bx, by] = ballPath(Math.min(1, u + 0.3), gx, fy, fy - 50); ball(g, bx, by, 14, t * 8);
    drawFigure(g, { x: lerp(E.W * 0.3, gx - 30, prog(t, 0, info.dur)), y: fy + 60, s: 0.95, facing: 1, outfit: SAM, pose: walkPose(t * 10, { run: true }), expr: 'joy', rim: rimOf(M, [-0.7, -0.7]) }); } });
} });
registerShot('s114', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => track(g2, 0, cam, { view: 'road', cheer: 0 }), bgCam: { z: 1.5, x: 300, y: -150 }, outfit: THEO, expr: 'shocked', side: -1, noBlink: true, zoom: 0.08, dx: -V(80, 0) });
  slowTint(g, 0.15);
} });
function truckRoad(g, t, cam, o = {}) {
  const r = road(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 0.85, (g) => { o.truck && car(g, o.truck[0], r.laneY + 70, o.truck[1], { truck: true, color: '#e8e2d8', glowC: '#ffe6b0' }); o.extra?.(g, r); });
  return r;
}
registerShot('s115', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06, x0: -40, x1: 20 });
  const r = truckRoad(g, t, cam, { truck: [lerp(-500, E.W * 0.3, ease.out(t / info.dur)), 1.15] });
  layer(g, cam, 0.95, (g) => drawFigure(g, { x: E.W * 0.86, y: r.GY - 10, s: 0.95, facing: 1, outfit: SAM, pose: walkPose(t * 10, { run: true }), expr: 'joy', rim: rimOf(r.M, [-0.7, -0.7]) }));
  FX.dust(g, t, { count: 30, a: 0.3 });
} });
registerShot('s116', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.04 }), ui = S().ui, tx = lerp(E.W * 0.12, E.W * 0.3, t / info.dur);
  const r = truckRoad(g, t, cam, { truck: [tx, 1.0] });
  const sx = E.W * 0.84;
  layer(g, cam, 0.95, (g) => drawFigure(g, { x: sx, y: r.GY - 10, s: 0.95, facing: -1, outfit: SAM, pose: breathe(POSES.reach, t, 1, 2), expr: 'happy', rim: rimOf(r.M, [-0.7, -0.7]) }));
  const t1 = wt(info, 'fifty', 0.1), t2 = wt(info, 'forty', 2.1), t3 = wt(info, 'under', 3.7);
  UI.readout(g, { value: '50 km/h', x: tx + 40, y: E.H * 0.18, align: 'center', a: clamp(popIn(t, t1)) });
  layer(g, cam, 0.85, (g) => UI.dimension(g, t, { x1: tx + 220, y1: r.laneY + 110, x2: sx - 40, y2: r.laneY + 110, str: '40 m', start: t2 }));
  if (t > t3) { const left = Math.max(0, 2.9 - (t - t3) * 0.35); UI.readout(g, { label: 'IMPACT IN', value: left.toFixed(1) + ' s', x: E.W * 0.62, y: E.H * 0.2, color: ui.accent, a: clamp(popIn(t, t3)) }); }
} });
registerShot('s117', { draw(g, t, info) {
  const ui = S().ui;
  (((g2) => roadView(g2, 0, { z: 1.0 + 0.02 * t }, { onField: (g, fy) => drawFigure(g, { x: E.W / 2 + V(330, 120), y: fy + 60, s: 0.75, facing: 1, outfit: SAM, pose: walkPose(2.2, { run: true }), expr: 'joy' }), onRoad: (g, ry) => car(g, E.W * 0.2, ry + 12, 0.34, { truck: true, color: '#e8e2d8' }) })))(g);
  slowTint(g, 0.3);
  const P1 = [E.W * 0.18, E.H * 0.82], P2 = [E.W / 2 + V(330, 120), E.H * 0.6], P3 = [E.W * 0.26, E.H * 0.5];
  const k = ease.inOut(prog(t, 0.2, 1.6)); g.setLineDash([12, 10]);
  seg(g, [P1, [lerp(P1[0], P2[0], k), lerp(P1[1], P2[1], k)]], 4, ui.gold); seg(g, [P3, [lerp(P3[0], P2[0], k), lerp(P3[1], P2[1], k)]], 4, ui.accent); g.setLineDash([]);
  for (const [p, c] of [[P1, ui.gold], [P2, ui.cream], [P3, ui.accent]]) ring(g, p[0], p[1], 24, 4, c);
  label(g, t, 'YOU', P1[0], P1[1] - 50, 0.2, { size: V(36, 40) }); label(g, t, 'SAM', P2[0], P2[1] - 60, 0.4, { size: V(36, 40), color: ui.cream }); label(g, t, 'TRUCK', P3[0], P3[1] - 50, 0.6, { size: V(36, 40), color: ui.accent });
  const tB = wt(info, 'blink', 1.8); if (t > tB && t < tB + 0.3) veil(g, '#000', 0.85);
  slowBadge(g, t);
} });

// ---------- the math (blueprint) ----------
registerShot('s118', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.05 });
  layer(g, cam, 1, (g) => {
    const tx = E.W * 0.12, ty = E.H * 0.62, tw = E.W * 0.7, th = E.H * 0.18; rr(g, tx, ty, tw, th, 10); g.strokeStyle = c; g.lineWidth = 3; g.stroke(); for (let i = 1; i < 4; i++) seg(g, [[tx, ty + i * th / 4], [tx + tw, ty + i * th / 4]], 1.5, alpha(c, 0.4));
    seg(g, [[tx - 100, ty - 40], [tx + tw + 300, ty - 40]], 3, c); const gx = tx + tw * 0.86; seg(g, [[tx - 100, ty - 40], [gx - 40, ty - 40]], 3, c); seg(g, [[gx + 40, ty - 40], [tx + tw + 300, ty - 40]], 3, c);
    g.fillStyle = alpha(c, 0.12); g.fillRect(tx - 200, ty - 220, tw + 500, 140); text(g, 'MAIN ROAD', tx + 40, ty - 150, { size: 30, color: alpha(c, 0.8), font: FONTS.ui, weight: 900, align: 'left', spacing: 4 });
    const you = [tx + 40, ty + th * 0.4], gate = [gx, ty - 40], sam = [gx + 10, ty - 120], truck = [gx - 40 * 13, ty - 150];
    circle(g, you[0], you[1], 14, ui.gold); text(g, 'YOU', you[0], you[1] + 44, { size: 30, color: ui.gold, font: FONTS.ui, weight: 900 });
    circle(g, sam[0], sam[1], 12, ui.cream); text(g, 'SAM', sam[0] + 50, sam[1], { size: 28, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left' });
    rr(g, truck[0] - 50, truck[1] - 22, 100, 44, 8); g.fillStyle = ui.accent; g.fill(); text(g, 'TRUCK', truck[0], truck[1] - 50, { size: 28, color: ui.accent, font: FONTS.ui, weight: 900 });
    UI.dimension(g, t, { x1: you[0] + 20, y1: you[1], x2: gate[0], y2: gate[1] + 10, str: '60 m', start: wt(info, 'sixty', 0.6) - 0.2 });
  });
} });
registerShot('s119', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => {
    const x0 = E.W * 0.12, x1 = E.W * 0.86, y = E.H * 0.62, p = ease.inOut(prog(t, 0.6, wt(info, 'seconds', 3.4)));
    seg(g, [[x0, y], [x1, y]], 3, alpha(c, 0.6)); seg(g, [[x1, y - 30], [x1, y + 30]], 4, c); text(g, '60 m', x1, y + 60, { size: 34, color: c, font: FONTS.ui, weight: 900 });
    UI.lineFigure(g, { x: lerp(x0, x1, p), y: y - 10, s: 1.0, pose: walkPose(t * 2 * Math.PI * 1.6, { run: true }), color: c });
    label(g, t, 'FASTEST MAN IN HISTORY', E.W / 2, E.H * 0.24, 0.2, { size: V(44, 44), color: ui.cream });
    UI.readout(g, { label: '60 m IN', value: (6.3 * p).toFixed(1) + ' s', x: E.W / 2, y: E.H * 0.36, align: 'center', color: c, a: clamp(popIn(t, 0.6)) });
  });
} });
registerShot('s120', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => {
    const x0 = V(420, 140), x1 = E.W - V(240, 120), sc = (x1 - x0) / 9, y1 = E.H * 0.4, y2 = E.H * 0.62;
    const bar = (y, lab, v, col, at) => { const k = ease.out(prog(t, at, at + 0.6)); text(g, lab, x0, y - 60, { size: V(38, 40), color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); rr(g, x0, y - 24, Math.max(48, v * sc * k), 48, 24); g.fillStyle = col; g.fill(); text(g, (v * k).toFixed(1) + ' s', x0 + v * sc * k + 24, y, { size: V(54, 56), color: col, font: FONTS.ui, weight: 900, align: 'left' }); };
    bar(y1, 'TRUCK REACHES THE GATE', 2.9, ui.gold, 0.1); bar(y2, 'YOU REACH THE GATE', 8, ui.accent, 0.25);
    const k = popIn(t, 0.9); if (k > 0) { seg(g, [[x0 + 2.9 * sc, y1 + 30], [x0 + 2.9 * sc, y2 + 50]], 3, alpha(ui.cream, 0.6)); label(g, t, 'TOO LATE', x0 + 5.6 * sc, y2 + 90, 0.9, { color: ui.accent, size: V(44, 44) }); }
  });
} });
registerShot('s121', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), cam = push(t, info, { z0: 1, z1: 1.04 }), tL = wt(info, 'legs', 1.5) - 0.1;
  layer(g, cam, 1, (g) => {
    const fx = E.W * 0.36, fy = E.H * 0.86, s = 2.6; UI.lineFigure(g, { x: fx, y: fy, s, pose: POSES.stand, color: t > tL ? alpha(ui.accent, 0.9) : alpha(c, 0.5) });
    const hx = fx + 4 * s, hy = fy - 208 * s; glow(g, hx, hy, 160, ui.gold, 0.45); brainIcon(g, hx, hy, 34, ui.gold, 4);
    label(g, t, 'BRAIN: FAST', E.W * 0.66, E.H * 0.34, 0.15, { size: V(60, 60) }); label(g, t, 'LEGS: NOT', E.W * 0.66, E.H * 0.52, tL, { size: V(60, 60), color: ui.accent });
  });
} });

// ---------- the choice ----------
function frozenWide(g, t, cam, o = {}) {
  const r = roadView(g, 0, cam, { onField: (g, fy) => { drawFigure(g, { x: E.W / 2 + V(330, 120), y: fy + 60, s: 0.75, facing: 1, outfit: SAM, pose: walkPose(2.2, { run: true }), expr: 'joy' }); ball(g, E.W / 2 + V(420, 200), fy - 30, 12); }, onRoad: (g, ry) => car(g, E.W * 0.2 + t * 4, ry + 12, 0.34, { truck: true, color: '#e8e2d8' }) });
  layer(g, cam, 1, (g) => { blocks(g, E.W * 0.18, r.GY, 1.05); drawFigure(g, { x: E.W * 0.18, y: r.GY, s: 1.05, facing: 1, outfit: THEO, pose: o.theoPose || SETP, expr: o.theoExpr || 'scared', look: [1, -0.5], rim: rimOf(r.M, [-0.7, -0.7]) }); o.extra?.(g, r); });
  return r;
}
registerShot('s122', { draw(g, t, info) { frozenWide(g, t, push(t, info, { z0: 1.05, z1: 1.0 })); slowTint(g, 0.35); FX.drops(g, t, { count: 30, rMax: 5, drift: 1 }); slowBadge(g, t); } });
registerShot('s123', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => track(g2, 0, { z: 1.8, x: -500, y: -300 }, { view: 'stands', cheer: 0, crowdColors: FAMILY_COLORS })); veil(g, '#0a0710', 0.4);
  const ink = S().ink, s = V(3.2, 2.8), cx = E.W * 0.52, cy = E.H * 0.5 + Math.sin(t) * 3;
  seg(g, [[cx - 60 * s, cy + 70 * s], [cx - 260 * s, cy + 300 * s]], 60 * s, COACH.color); seg(g, [[cx - 20 * s, cy + 20 * s], [cx - 120 * s, cy + 130 * s]], 46 * s, ink);
  pistol(g, cx - 10 * s - 5, cy - 5, s, -0.25, mood('dusk').rim); pistol(g, cx - 10 * s, cy, s, -0.25); circle(g, cx + 6 * s, cy + 22 * s, 9 * s, ink);
  label(g, t, "GUN HASN'T FIRED", E.W / 2, E.H * 0.16, 0.5, { color: S().ui.cream, size: V(46, 50) });
  slowTint(g, 0.35); slowBadge(g, t);
} });
registerShot('s124', { draw(g, t, info) {
  const flick = (Math.floor(t * 6) % 3) !== 0 && t > wt(info, 'out', 1.3) - 0.3;
  final(g, 0, push(t, info, { z0: 1.6, z1: 1.66, x0: -150, x1: -140, y0: 175, y1: 180 }), { cheer: 0, coachPose: GUNUP, theoPose: SETP, othersPose: SETP, theoExpr: 'scared', extra: (g, GY, s, M, l) => coachGun(g, GY, s, l) });
  slowTint(g, 0.35); if (flick) stamp(g, 1, 'DQ', E.W * 0.45, E.H * 0.4, 0, V(170, 150));
} });
registerShot('s125', { draw(g, t, info) {
  backdrop(g, ['#0c0810', '#1a1220']); const ui = S().ui, tG = wt(info, 'gone', 1.4) - 0.1;
  const poses = [MARKS, walkPose(1, { run: true }), POSES.cheer, SETP, walkPose(2.4, { run: true })];
  for (let i = 0; i < 5; i++) { const pw = E.W * 0.22, ph = E.H * 0.4, x = E.W * 0.5 + (i - 2) * (pw + 30) - t * 120, y = E.H * 0.24, fade = t > tG ? 1 - prog(t, tG + i * 0.08, tG + i * 0.08 + 0.35) : 1;
    if (fade <= 0) continue; g.save(); g.globalAlpha = fade * 0.9; rr(g, x - pw / 2, y, pw, ph, 12); g.fillStyle = '#2a1e2a'; g.fill(); g.beginPath(); g.rect(x - pw / 2, y, pw, ph); g.clip();
    g.fillStyle = linGrad(g, 0, y, 0, y + ph, mood('dusk').sky); g.fillRect(x - pw / 2, y, pw, ph * 0.7); g.fillStyle = '#7a3526'; g.fillRect(x - pw / 2, y + ph * 0.7, pw, ph * 0.3);
    drawFigure(g, { x, y: y + ph * 0.86, s: 0.8, facing: 1, outfit: THEO, pose: poses[i], expr: 'determined', rim: { color: '#ffc68a', dir: [0, -1] } }); g.restore(); }
  label(g, t, 'MONTHS OF TRAINING', E.W / 2, E.H * 0.16, 0.1, { size: V(46, 50), color: ui.cream });
  const k = ease.outBack(prog(t, tG + 0.3, tG + 0.6)); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.76); g.scale(k, k); text(g, 'GONE.', 0, 0, { size: V(110, 100), color: ui.accent, font: FONTS.title, weight: 700, spacing: 6, glow: 26, glowColor: alpha(ui.accent, 0.6) }); g.restore(); }
} });
registerShot('s126', { draw(g, t, info) {
  const ui = S().ui, tB = wt(info, 'or', 1.0) - 0.1, M = mood('dusk');
  g.save(); g.beginPath(); g.rect(0, 0, E.W / 2 - 4, E.H); g.clip(); g.translate(-E.W * 0.25, 0);
  final(g, 0, { z: 1.4, x: 300 - 10 * t, y: 150 }, { cheer: 0.3, coach: false, theoPose: SETP, othersPose: SETP });
  g.fillStyle = '#f4ece0'; g.fillRect(E.W * 0.95, E.H * 0.45, 12, E.H * 0.4); g.restore();
  g.save(); g.beginPath(); g.rect(E.W / 2 + 4, 0, E.W / 2, E.H); g.clip(); g.translate(E.W * 0.25, 0);
  const r = road(g, 0, { z: 1.6, x: 260 + 10 * t, y: 190 }, { mood: 'dusk' }); layer(g, { z: 1.6, x: 260 + 10 * t, y: 190 }, 1, (g) => drawFigure(g, { x: E.W * 0.62, y: r.GY - 10, s: 1.0, facing: 1, outfit: SAM, pose: walkPose(2.2, { run: true }), expr: 'joy', rim: rimOf(M, [-0.7, -0.7]) }));
  g.restore();
  seg(g, [[E.W / 2, 0], [E.W / 2, E.H]], 8, '#0a0710');
  label(g, t, 'THE RACE', E.W * 0.25, E.H * 0.2, 0.1, { size: V(56, 56), color: ui.cream });
  label(g, t, 'YOUR BROTHER', E.W * 0.75, E.H * 0.2, tB, { size: V(56, 56) });
  slowTint(g, 0.25);
} });
