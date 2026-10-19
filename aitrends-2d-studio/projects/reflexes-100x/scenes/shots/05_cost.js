// shots/05_cost.js: the road at night (s070-s075), the price (s076-s082), people as statues (s083-s087).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, slowTint, slowBadge, popIn, label, car, phone } from '../lib.js';
import { road } from '../sets/outdoor.js';
import { hallway, classroom, desk } from '../sets/indoor.js';
import { THEO, MIA, EXTRA, EXTRA2, EXTRA3 } from '../cast.js';

// ---------- the road at night ----------
const CARC = ['#3a3a5a', '#5a2a34', '#2a4a5a', '#4a4a4a'];
function traffic(g, t, laneY, o = {}) { for (let i = 0; i < 4; i++) { const sp = V(900, 700), span = E.W + 900, x = ((t * sp + i * span / 4 + (o.off || 0)) % span) - 450; car(g, x, laneY + 46 + (i % 2) * 24, 0.85, { color: CARC[i], facing: 1 }); } }
registerShot('s070', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.07, x0: -40, x1: 30 });
  const { GY, M, laneY } = road(g, t, cam, { night: true, rain: true });
  layer(g, cam, 0.8, (g) => traffic(g, t, laneY));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.32, y: GY, s: 1.2, facing: 1, outfit: THEO, pose: breathe(POSES.relaxed, t), expr: 'awe', look: [1, 0], rim: rimOf(M, [0.6, -0.8]) }));
} });
registerShot('s071', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, z1: 1.1, x0: 0, x1: 20 }), ui = S().ui;
  const { GY, M, laneY } = road(g, t, cam, { night: true });
  const tF = wt(info, 'fifty', 0.3), tM = wt(info, 'fourteen', 2.6), x = lerp(-300, E.W + 300, t / info.dur), cy = laneY + 60;
  layer(g, cam, 0.85, (g) => { car(g, x, cy, 1.0, { color: '#5a2a34' }); UI.readout(g, { value: '50 km/h', x: x - 60, y: cy - 220, align: 'center', a: clamp(popIn(t, tF)) }); });
  layer(g, cam, 1, (g) => { const m = V(120, 70), x0 = E.W * 0.5 - 7 * m; if (t > tM - 0.2) for (let i = 0; i <= 14; i++) { const k = clamp(prog(t, tM + i * 0.05, tM + i * 0.05 + 0.2)); seg(g, [[x0 + i * m, GY - 6], [x0 + i * m, GY - (i % 5 ? 20 : 40)]], 3, alpha(ui.gold, k)); }
    UI.dimension(g, t, { x1: E.W * 0.5 - 7 * m, y1: GY + 50, x2: E.W * 0.5 + 7 * m, y2: GY + 50, str: '14 m every second', start: tM }); });
} });
registerShot('s072', { draw(g, t, info) {
  const cam = { z: 1.08 + 0.02 * t, x: 0 }, ui = S().ui;
  const { GY, M, laneY } = road(g, 0, cam, { night: true });
  const m = V(120, 70), x0 = E.W * 0.5 - 7 * m;
  layer(g, cam, 0.85, (g) => { FX.drops(g, t, { count: 50, color: '#cfe0ff', rMax: 5, drift: 1 }); car(g, x0 + prog(t, 0, info.dur) * 14 * m, laneY + 60, 1.0, { color: '#5a2a34' }); });
  layer(g, cam, 1, (g) => { for (let i = 0; i <= 14; i++) { const on = t > 0.15 + i * 0.12; seg(g, [[x0 + i * m, GY - 6], [x0 + i * m, GY - (i % 5 ? 24 : 48)]], 4, on ? ui.gold : alpha(ui.cream, 0.25)); if (on && i > 0) text(g, String(i), x0 + i * m, GY + 34, { size: 28, color: ui.gold, font: FONTS.ui, weight: 900 }); } });
  slowTint(g, 0.35); slowBadge(g, t);
} });
registerShot('s073', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06, x0: 10, x1: -10 });
  layer(g, cam, 0.4, (g) => { blurLayer(g, 14, (g2) => road(g2, t, { z: 1.6, x: 200 * t, y: -200 }, { night: true })); veil(g, '#05060c', 0.3); });
  layer(g, cam, 1, (g) => {
    const wx = E.W * 0.18, wy = E.H * 0.18, ww = E.W * 0.64, wh = E.H * 0.56;
    g.fillStyle = '#0c0b14'; g.fillRect(-E.W, -E.H, E.W * 3, wy + E.H); g.fillRect(-E.W, wy + wh, E.W * 3, E.H); g.fillRect(-E.W, wy, wx + E.W, wh); g.fillRect(wx + ww, wy, E.W, wh);
    rr(g, wx, wy, ww, wh, 40); g.strokeStyle = '#1a1826'; g.lineWidth = 20; g.stroke();
    const hx = E.W * 0.44, hy = E.H * 0.5, r = V(120, 110), down = ease.inOut(prog(t, 0.2, 0.8));
    circle(g, hx - 6, hy - 6, r + 8, alpha('#9fd8ff', 0.7)); circle(g, hx, hy + down * 20, r, S().ink);
    g.fillStyle = S().ink; g.beginPath(); g.ellipse(hx - 20, hy + r * 2.2, r * 1.6, r * 1.3, 0, Math.PI, Math.PI * 2); g.fill();
    phone(g, hx + r * 1.3, hy + r * 0.9, 1.6); glow(g, hx + r * 0.6, hy + r * 0.3, 260, '#9fd8ff', 0.3);
    seg(g, [[hx + r * 0.3, hy - r * 0.1 + down * 20], [hx + r * 0.6, hy + r * 0.15 + down * 20]], 8, alpha('#9fd8ff', 0.8));
    FX.rain(g, t, { area: [wx, wy, ww, wh], a: 0.2, count: 80, speed: 600 });
  });
  label(g, t, 'EYES OFF THE ROAD', E.W / 2, E.H * 0.87, 0.9, { color: S().ui.accent, size: V(44, 48) });
} });
registerShot('s074', { draw(g, t, info) {
  const M = mood('night'), ui = S().ui, cam = push(t, info, { z0: 1.0, z1: 1.08, r: 0.02 });
  layer(g, cam, 0.9, (g) => {
    backdrop(g, [shade(M.dark, -0.2), M.dark]); const rx = E.W * 0.32, rw = E.W * 0.36;
    g.fillStyle = shade(M.road, 0.05); g.fillRect(rx, -E.H, rw, E.H * 3); g.fillStyle = shade(M.floor, 0.15); g.fillRect(rx - 60, -E.H, 60, E.H * 3); g.fillRect(rx + rw, -E.H, 60, E.H * 3);
    for (let y = -E.H + ((t * 200) % 160); y < E.H * 2; y += 160) { g.fillStyle = alpha('#f2e6c8', 0.5); g.fillRect(rx + rw / 2 - 5, y, 10, 80); }
    const cyY = lerp(E.H * 0.9, E.H * 0.1, t / info.dur), carY = lerp(E.H * 1.3, E.H * 0.05, t / info.dur), cx = rx + rw * 0.34, bx = rx + rw * 0.12;
    g.setLineDash([12, 12]); seg(g, [[cx, E.H * 1.3], [cx, -100]], 3, alpha(ui.accent, 0.5)); seg(g, [[bx, E.H * 1.3], [bx, -100]], 3, alpha(ui.blueprint, 0.5)); g.setLineDash([]);
    rr(g, cx - 60, carY - 110, 120, 220, 24); g.fillStyle = '#5a2a34'; g.fill(); rr(g, cx - 46, carY - 70, 92, 60, 10); g.fillStyle = '#7fa0c8'; g.fill(); glow(g, cx, carY - 120, 120, '#ffe6b0', 0.5);
    seg(g, [[bx, cyY - 40], [bx, cyY + 40]], 10, '#1a1826'); circle(g, bx, cyY, 16, S().ink); ring(g, bx, cyY - 40, 12, 4, '#3a3a4a'); ring(g, bx, cyY + 40, 12, 4, '#3a3a4a');
    const close = 1 - clamp(Math.abs(carY - 110 - cyY) / 300); if (close > 0) { glow(g, (cx + bx) / 2, cyY, 220, ui.accent, 0.5 * close); UI.dimension(g, 1, { x1: bx + 18, y1: cyY, x2: cx - 60, y2: cyY, str: '0.4 m', start: 0 }); }
  });
  label(g, t, 'NEAR MISS', E.W * 0.82, E.H * 0.2, wt(info, 'near', 0.3), { color: ui.accent, size: V(50, 50) });
} });
registerShot('s075', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('night'), bg: (g2, tt, cam) => road(g2, tt, cam, { night: true }), bgCam: { z: 1.4, x: 100, y: -100 }, outfit: THEO, expr: 'sad', side: 1, zoom: 0.03, front: (g) => FX.rain(g, t, { a: 0.25, count: 180 }) });
} });

// ---------- the price ----------
registerShot('s076', { draw(g, t, info) {
  const M = mood('night'); layer(g, push(t, info, { z0: 1, z1: 1.04 }), 0.5, (g) => { backdrop(g, [shade(M.dark, -0.4), shade(M.wall, -0.4)]); FX.fog(g, E.H * 0.4, 400, M.fog, 0.2); });
  FX.rain(g, t, { a: 0.12, count: 120 }); UI.bigLine(g, t, { str: 'THE PRICE?', dur: info.dur + 0.4, size: V(120, 100), color: S().ui.accent });
} });
registerShot('s077', { draw(g, t, info) {
  const M = mood('void'), ui = S().ui, cam = push(t, info, { z0: 1.0, z1: 1.06 });
  layer(g, cam, 0.5, (g) => { backdrop(g, M.sky); glow(g, E.W / 2, E.H / 2, 700, ui.gold, 0.08); });
  layer(g, cam, 1, (g) => { const cx = E.W * V(0.3, 0.5), cy = E.H * V(0.5, 0.36), R = V(260, 240);
    circle(g, cx, cy, R, '#efe8e0'); ring(g, cx, cy, R, 14, '#1a1622'); for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30; seg(g, [[cx + Math.cos(a) * R * (i % 5 ? 0.9 : 0.82), cy + Math.sin(a) * R * (i % 5 ? 0.9 : 0.82)], [cx + Math.cos(a) * R * 0.95, cy + Math.sin(a) * R * 0.95]], i % 5 ? 3 : 7, '#1a1622'); }
    const a = -Math.PI / 2 + (t / info.dur) * (Math.PI * 2 / 60) * 0.6; seg(g, [[cx, cy], [cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85]], 5, '#e04a3a'); circle(g, cx, cy, 12, '#1a1622'); });
  const tx = E.W * V(0.68, 0.5), ty = E.H * V(0.36, 0.72);
  label(g, t, '1 SECOND', tx, ty, 0.3, { color: ui.cream, size: V(64, 60), font: FONTS.title });
  label(g, t, 'FEELS LIKE', tx, ty + V(90, 80), wt(info, 'feels', 0.6), { color: alpha(ui.cream, 0.7), size: V(36, 34) });
  label(g, t, '1 MIN 40 S', tx, ty + V(190, 170), wt(info, 'minute', 1.4) - 0.1, { size: V(96, 84), font: FONTS.title });
} });
registerShot('s078', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, z1: 1.28, x0: 40, x1: 60, y0: 110, y1: 120 });
  const { GY, M } = classroom(g, t, cam, { clockSpeed: 60 });
  const ui = S().ui;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W * 0.28, y: GY, s: 1.3, facing: 1, outfit: { top: 'suit', color: '#3a3448', head: 'none', face: 'glasses' }, pose: breathe(posesAt(t, [[0, POSES.explain], [1.5, POSES.point], [3, POSES.explain]]), t), expr: 'smile', talk: 0.5 + 0.5 * Math.sin(t * 9), rim: rimOf(M, [0.6, -0.8]) });
    const dx = E.W * 0.68; desk(g, dx + 60, GY); g.save(); g.translate(dx, 0); FX.chair(g, -18 * 1.3, GY, 1.3, '#24181e'); g.restore();
    drawFigure(g, { x: dx, y: GY, s: 1.3, facing: 1, outfit: THEO, pose: breathe({ ...POSES.sit, head: [36, -150], sh: [16, -136], eF: [40, -126], hF: [56, -132], eB: [36, -128], hB: [52, -134] }, t, 0.6), expr: 'sleepy', rim: rimOf(M, [0.6, -0.8]), shadow: false });
  });
  UI.readout(g, { label: '10-MIN LESSON', value: '= 16+ HOURS', x: E.W * 0.5, y: V(140, 240), align: 'center', a: clamp(popIn(t, wt(info, 'sixteen', 2.4) - 0.2)) });
  if (t < wt(info, 'sixteen', 2.4) - 0.2) UI.readout(g, { label: 'LESSON', value: '10 MIN', x: E.W * 0.5, y: V(140, 240), align: 'center', a: clamp(popIn(t, 0.3)) });
} });

// ---------- hallway: good morning ----------
function hallTwo(g, t, cam, o = {}) {
  const { GY, M } = hallway(g, t, cam, { warm: true, mood: 'interiorWarm', lockerColor: '#5a4a6a' });
  const s = 1.3, rim = rimOf(M, [0, -1]);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W * 0.4, y: GY, s, facing: 1, outfit: THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'neutral', rim, blink: blinkAt(t, 3.3) });
    drawFigure(g, { x: E.W * 0.6, y: GY, s, facing: -1, outfit: MIA, pose: o.miaPose || breathe(POSES.wave, t, 1, 3), expr: o.miaExpr || 'happy', talk: o.miaTalk || 0, rim, blink: blinkAt(t, 2.9, 1) });
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  return { GY, M };
}
registerShot('s079', { draw(g, t, info) { hallTwo(g, t, push(t, info, { z0: 1.35, z1: 1.42, y0: 140, y1: 150 }), { miaTalk: talk(info, 'good', 'morning'), miaPose: breathe(posesAt(t, [[0, POSES.relaxed], [0.2, POSES.wave]]), t, 1, 3) }); } });
registerShot('s080', { draw(g, t, info) {
  const ui = S().ui;
  hallTwo(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: -120, x1: -130, y0: 190, y1: 195 }), { miaTalk: 0.4 + 0.4 * Math.sin(t * 4), miaPose: breathe(POSES.talk, t, 1, 3), theoExpr: 'thinking', theoPose: breathe(POSES.think, t) });
  const k = popIn(t, 0.1); if (k <= 0) return; const bx = E.W * 0.2, by = E.H * 0.24;
  g.save(); g.translate(bx, by); g.scale(k, k); rr(g, -230, -110, 460, 220, 50); g.fillStyle = alpha(ui.cream, 0.95); g.fill();
  const lines = [[0.2, 0], [0.9, 1], [2.0, 2]], tR = wt(info, 'rewrite', 0.9), tW = wt(info, 'twice', 1.9);
  lines.forEach(([at, i]) => { const w = 320 * ease.out(prog(t, at, at + 0.5)); seg(g, [[-170, -50 + i * 50], [-170 + w, -50 + i * 50]], 10, alpha(S().ink, 0.7)); });
  for (const [ct, i] of [[tR + 0.2, 0], [tW + 0.1, 1]]) { const w = 340 * ease.out(prog(t, ct, ct + 0.25)); if (w > 0) seg(g, [[-180, -50 + i * 50 - 4], [-180 + w, -50 + i * 50 + 4]], 6, '#e04a3a'); }
  g.restore(); for (let i = 0; i < 3; i++) circle(g, bx + 140 + i * 40, by + 140 + i * 30, (14 - i * 4) * k, alpha(ui.cream, 0.95));
} });
registerShot('s081', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => hallTwo(g2, tt, cam, { miaTalk: 0.3 + 0.3 * Math.sin(tt * 1.5), miaPose: POSES.talk }), bgCam: { z: 1.8, x: 200, y: 160 }, blur: 8, outfit: THEO, expr: exprAt(t, [[0, 'neutral'], [1.0, 'sleepy']]), side: -1, dx: -V(300, 0), zoom: 0.03 });
} });
registerShot('s082', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => {
    const cell = V(46, 40), lx = E.W * V(0.22, 0.5), ly = E.H * V(0.5, 0.25);
    rr(g, lx - cell / 2, ly - cell / 2, cell, cell, 6); g.fillStyle = c; g.fill();
    text(g, '1 DAY', lx, ly + 70, { size: V(40, 40), color: c, font: FONTS.ui, weight: 900 }); text(g, 'YOU LIVE', lx, ly + 116, { size: V(26, 26), color: alpha(c, 0.7), font: FONTS.ui, weight: 900, spacing: 3 });
    const gx = E.W * V(0.48, 0.25), gy = E.H * V(0.2, 0.42), n = Math.floor(100 * ease.inOut(prog(t, 0.4, info.dur - 0.6)));
    for (let i = 0; i < 100; i++) { const x = gx + (i % 10) * (cell + 8), y = gy + Math.floor(i / 10) * (cell + 8); rr(g, x, y, cell, cell, 6); g.fillStyle = i < n ? ui.gold : alpha(ui.gold, 0.1); g.fill(); }
    text(g, n + ' DAYS', gx + 5 * (cell + 8), gy + 10 * (cell + 8) + 40, { size: V(48, 48), color: ui.gold, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(ui.gold, 0.6) });
    text(g, 'YOUR MIND LIVES', gx + 5 * (cell + 8), gy - 40, { size: V(28, 28), color: alpha(ui.gold, 0.8), font: FONTS.ui, weight: 900, spacing: 3 });
  });
} });

// ---------- statues ----------
const STAT = [[0.12, EXTRA, 0.3], [0.27, EXTRA2, 2.1], [0.47, EXTRA3, 4.0], [0.66, MIA, 1.2], [0.86, EXTRA, 5.2]];
function statues(g, t, cam, o = {}) {
  const { GY, M } = hallway(g, o.warm ? 0 : t, cam, { warm: o.warm, mood: o.warm ? 'interiorWarm' : 'interiorCool', lockerColor: o.warm ? '#5a4a6a' : '#3a5a8a' });
  layer(g, cam, 1, (g) => {
    for (const [fx, of, ph] of STAT) drawFigure(g, { x: E.W * fx, y: GY, s: 1.2, facing: fx < 0.5 ? 1 : -1, outfit: { ...of, headColor: of === MIA ? mix(MIA.headColor, '#8a8698', 0.7) : of.headColor }, pose: walkPose(ph), expr: 'neutral', ink: '#5e5a6e', rim: { color: o.warm ? '#ffd9a0' : '#c9d4ff', dir: [0, -1] } });
    if (o.theo !== false) drawFigure(g, { x: o.theoX ?? E.W * 0.38 + t * 50, y: GY, s: 1.2, facing: 1, outfit: THEO, pose: o.theoPose || walkPose(t * 5.2), expr: o.theoExpr || 'neutral', rim: rimOf(M, [0, -1]) });
    o.extra?.(g, GY);
  });
  return { GY, M };
}
registerShot('s083', { draw(g, t, info) { statues(g, t, push(t, info, { z0: 1.05, z1: 1.1, y0: 60, y1: 70 }), { theoExpr: 'confused' }); FX.drops(g, t, { count: 40, rMax: 5, drift: 1 }); slowTint(g, 0.3); slowBadge(g, t); } });
registerShot('s084', { draw(g, t, info) { statues(g, t, push(t, info, { z0: 1.25, z1: 1.3, x0: 40, x1: 60, y0: 130, y1: 130 }), { warm: true, theoX: E.W * 0.4, theoPose: breathe(POSES.relaxed, t), theoExpr: 'awe' }); FX.dust(g, t, { count: 80, color: '#ffe2bd', a: 0.5, speed: 2 }); FX.godRays(g, E.W * 0.8, -40, { count: 7, angle: Math.PI * 0.62, spread: 0.6, len: 1400, a: 0.08, t }); } });
registerShot('s085', { draw(g, t, info) { statues(g, t, push(t, info, { z0: 1.3, z1: 0.98, y0: 120, y1: 30, ease: ease.out }), { theoX: E.W * 0.4, theoPose: breathe(POSES.sad, t), theoExpr: 'sad' }); FX.dust(g, t, { count: 40, a: 0.3 }); } });
registerShot('s086', { draw(g, t, info) {
  statues(g, t, push(t, info, { z0: 1.4, z1: 1.46, x0: -90, x1: -100, y0: 150, y1: 155 }), { theoX: E.W * 0.38, theoPose: breathe(POSES.sit, t), theoExpr: 'sad', extra: (g, GY) => { rr(g, E.W * 0.3, GY - 78, E.W * 0.22, 14, 5); g.fillStyle = '#2a2638'; g.fill(); seg(g, [[E.W * 0.32, GY - 70], [E.W * 0.32, GY]], 8, '#2a2638'); seg(g, [[E.W * 0.5, GY - 70], [E.W * 0.5, GY]], 8, '#2a2638'); } });
  FX.dust(g, t, { count: 30, a: 0.25 });
} });
registerShot('s087', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.12, z1: 1.02, y0: 70, y1: 40 });
  const { GY, M } = hallway(g, t, cam, { warm: true, mood: 'interiorWarm', lockerColor: '#5a4a6a', flicker: 0.6 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: lerp(E.W * 0.45, E.W * 0.7, t / info.dur), y: GY, s: lerp(1.1, 0.95, t / info.dur), facing: 1, outfit: THEO, pose: walkPose(t * 4.6), expr: 'sad', rim: rimOf(M, [1, -0.3]) }));
  glow(g, E.W * 0.95, E.H * 0.5, 700, '#ffcf8f', 0.25); FX.godRays(g, E.W * 1.05, E.H * 0.45, { count: 8, angle: Math.PI, spread: 0.6, len: 1500, a: 0.06, t });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
} });
