// shots/01_open.js: cold open. The wasp in the garden (s001-s006), the kitchen: glass, blink, toast, name (s007-s018).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, radGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, fadeOut, label,
  wasp, sandwich, glass, toaster } from '../lib.js';
import { garden, picnicTable } from '../sets/outdoor.js';
import { kitchen, table } from '../sets/indoor.js';
import { THEO, SAM, MOM } from '../cast.js';

// ---------- garden ----------
const benchSit = (g, x, GY, s, c) => FX.stool(g, x - 6 * s, GY, s, c);
function gardenTable(g, t, cam, o = {}) {
  const { GY, M } = garden(g, t, cam);
  const tx = E.W / 2 + V(60, 40), s = o.s ?? 1.5, tx0 = tx - V(330, 250);
  layer(g, cam, 1, (g) => {
    benchSit(g, tx0, GY, s, '#24181a');
    const tb = picnicTable(g, tx, GY);
    sandwich(g, tx - 60, tb.top, 1.1);
    drawFigure(g, { x: tx0, y: GY, s, facing: 1, outfit: THEO, pose: o.pose || breathe(POSES.sit, t), expr: o.expr || 'neutral', look: o.look, rim: rimOf(M, [0.6, -0.8]), shadow: false, blink: blinkAt(t, 3.4) });
    o.extra?.(g, GY, tb);
  });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.35 });
  return { GY, M, tx, tx0, s };
}
const waspPath = (t) => [E.W + 80 - t * V(420, 300), E.H * V(0.44, 0.5) + Math.sin(t * 2.2) * 40 + Math.sin(t * 7) * 8];

registerShot('s001', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1, z1: 1.07, x0: 20, x1: -30 });
  const w = waspPath(t + 0.6);
  gardenTable(g, t, cam, { expr: t > 1.4 ? 'neutral' : 'smile', look: [clamp((w[0] - E.W * 0.4) / 400, -1, 1), -0.3],
    extra: (g) => wasp(g, w[0], w[1], 1.3, t, { facing: -1 }) });
} });

registerShot('s002', { draw(g, t, info) {
  const fx = lerp(E.W * 0.95, E.W * 0.62, ease.inOut(t / info.dur));
  faceShot(g, t, info, { M: mood('golden'), bg: (g2, tt, cam) => garden(g2, tt, cam), bgCam: { z: 1.6, x: -120 + 10 * t, y: -140 }, outfit: THEO, expr: 'neutral', look: [clamp((fx - E.W / 2) / 500, -1, 1), -0.3], side: 1, dx: -V(120, 0),
    front: (g) => blurLayer(g, 5, (g2) => wasp(g2, fx, E.H * 0.34 + Math.sin(t * 3) * 14, 3.2, t, { facing: -1 })) });
} });

registerShot('s003', { draw(g, t, info) {
  const M = mood('golden'), cam = { z: 1 + 0.03 * t, r: -0.02 + 0.01 * t };
  blurLayer(g, 16, (g2) => garden(g2, 0, { z: 1.8, x: 200, y: -200 })); veil(g, '#120a10', 0.3);
  layer(g, cam, 1, (g) => {
    FX.drops(g, t, { count: 40, color: '#ffe2bd', rMax: 6, drift: 2 });
    wasp(g, E.W / 2 + 40 - t * 20, E.H * 0.48 + Math.sin(t * 0.8) * 6, V(7, 6), t, { facing: -1, slow: true });
    FX.rings(g, E.W / 2, E.H * 0.48, t, { count: 2, r0: 260, r1: 620, speed: 0.3, color: '#ffe9c9', a: 0.25 });
  });
  slowTint(g, 0.3); slowBadge(g, t);
} });

registerShot('s004', { draw(g, t, info) {
  const M = mood('golden'), cam = push(t, info, { z0: 1.0, z1: 1.08 });
  layer(g, cam, 0.5, (g) => { backdrop(g, [shade(M.key, -0.35), shade(M.key, -0.6), shade(M.dark, -0.1)]); glow(g, E.W * 0.5, E.H * 0.2, 900, M.practical, 0.25); });
  layer(g, cam, 0.8, (g) => { for (let i = 0; i < 26; i++) { const x = (i * 173) % E.W, y = E.H - ((t * (12 + (i % 5) * 4) + i * 97) % (E.H + 100)); ring(g, x, y, 4 + (i % 4) * 3, 2, alpha(M.practical, 0.4)); circle(g, x - 2, y - 2, 1.6, alpha('#ffffff', 0.6)); } });
  layer(g, cam, 1, (g) => feather(g, E.W * 0.5 + Math.sin(t * 0.9) * 60, lerp(E.H * 0.28, E.H * 0.52, t / info.dur), V(2.2, 2), -0.4 + Math.sin(t * 0.8) * 0.25, mix('#fff3e0', M.practical, 0.2)));
  FX.lensStreak(g, E.W / 2, E.H * 0.2, E.W, M.practical, 0.15);
} });
import { feather } from '../lib.js';

registerShot('s005', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.03 * t, x: -10 * t };
  blurLayer(g, 16, (g2) => garden(g2, 0, { z: 1.8, x: -260, y: -200 })); veil(g, '#120a10', 0.3);
  const cx = E.W * 0.52, cy = E.H * 0.5, s = V(9, 7.5);
  layer(g, cam, 1, (g) => wasp(g, cx, cy, s, t, { facing: 1, slow: true }));
  slowTint(g, 0.22);
  const ts = [0.35, 0.75, 1.15, 1.55];
  for (let i = 0; i < 4; i++) { const sx = cx + (-32 + i * 8.5 + 2 - 16 + 16) * s * 0.98 - 12 * s, sy = cy - 22 * s; label(g, t, String(i + 1), sx + i * 2, sy - 30, ts[i], { size: V(64, 70) }); if (t > ts[i]) seg(g, [[sx + i * 2, sy - 8], [sx + i * 2, sy + 10]], 3, alpha(S().ui.gold, 0.7)); }
  slowBadge(g, t, '100x', 0.1);
} });

registerShot('s006', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.32, z1: 1.38, x0: -220, x1: -240, y0: -90, y1: -90 });
  const lean = ease.inOut(prog(t, 0.05, 0.5));
  const sideLean = { ...POSES.sitBack, head: [-22, -170], sh: [-14, -142] };
  const w = [lerp(E.W * 0.85, E.W * 0.05, ease.inOut(prog(t, 0.1, info.dur))), E.H * V(0.46, 0.5) + Math.sin(t * 6) * 10];
  gardenTable(g, t, cam, { pose: breathe(posesAt(t, [[0, POSES.sit], [0.08, sideLean]]), t), expr: lean > 0.5 ? 'smirk' : 'neutral', look: [1, -0.2],
    extra: (g) => wasp(g, w[0], w[1] - 30, 1.3, t, { facing: -1 }) });
} });

// ---------- kitchen ----------
const K = () => ({ momX: E.W / 2 - V(430, 300), theoX: E.W / 2 + V(170, 120), samX: E.W / 2 + V(560, 330), tableX: E.W / 2 + V(370, 230) });
function kitchenWide(g, t, cam, o = {}) {
  const { GY, M } = kitchen(g, t, cam, o.setOpts);
  const k = K(), s = o.s ?? 1.25;
  layer(g, cam, 1, (g) => {
    for (const [x, f] of [[k.theoX, 1], [k.samX, -1]]) { g.save(); g.translate(x, 0); g.scale(f, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore(); }
    const tb = table(g, k.tableX, GY, 360);
    drawFigure(g, { x: k.momX, y: GY, s, facing: 1, outfit: MOM, pose: o.momPose || breathe(POSES.holdFront, t), expr: o.momExpr || 'smile', rim: rimOf(M, [-0.6, -0.8]), blink: blinkAt(t, 3.7) });
    drawFigure(g, { x: k.theoX, y: GY, s, facing: -1, outfit: THEO, pose: o.theoPose || breathe(POSES.sit, t, 1, 2), expr: o.theoExpr || 'neutral', look: o.theoLook, rim: rimOf(M, [-0.6, -0.8]), shadow: false, blink: blinkAt(t, 3.3) });
    drawFigure(g, { x: k.samX, y: GY, s, facing: -1, outfit: SAM, pose: breathe(POSES.sit, t, 1, 4), expr: o.samExpr || 'happy', blink: o.samBlink ?? blinkAt(t, 2.9), rim: rimOf(M, [-0.6, -0.8]), shadow: false });
    o.extra?.(g, GY, tb, s);
  });
  FX.dust(g, t, { count: 45, color: '#ffe2bd', a: 0.3 });
  return { GY, M };
}
registerShot('s007', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06, x0: -40, x1: 10 });
  const slip = prog(t, 0.85, info.dur), k = K();
  kitchenWide(g, t, cam, { momExpr: slip > 0 ? 'surprised' : 'smile', theoExpr: t > 1.1 ? 'neutral' : 'smile', theoLook: [-1, -0.2],
    momPose: posesAt(t, [[0, POSES.holdFront], [0.9, POSES.reach]]),
    extra: (g, GY, tb, s) => { const hx = k.momX + 40 * s, hy = GY - 150 * s; glass(g, hx + 10 + slip * 20, hy + 10 + 60 * slip * slip, 0.9, 0.4 * slip); } });
} });

function hand(g, x, y, s, sleeve, rot = 0, grip = 0) {
  const ink = S().ink; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  seg(g, [[0, 0], [-500, 240]], 64, ink); seg(g, [[-130, 60], [-600, 290]], 92, sleeve);
  for (let i = 0; i < 4; i++) seg(g, [[0, -10 + i * 14], [40 + 10 * (1 - grip), -20 + i * 18 - grip * 10]], 15, ink);
  seg(g, [[-6, -14], [24, -40]], 16, ink); g.restore();
}
registerShot('s008', { draw(g, t, info) {
  const M = mood('interiorWarm');
  insertBg(g, t, (g2, tt) => kitchen(g2, tt, { z: 1.7, x: -380, y: -260 }), null, 0.35);
  const tip = ease.in(prog(t, 0, info.dur)) * 0.55, cam = { z: 1.0 + 0.04 * t };
  layer(g, cam, 1, (g) => {
    const hs = V(1.6, 1.3), gx = E.W * 0.43 + 70 * hs + tip * 80, gy = E.H * 0.6 - 20 * hs + tip * tip * 60;
    hand(g, E.W * 0.43, E.H * 0.6, hs, MOM.color, -0.15, 1 - tip * 1.4);
    glass(g, gx, gy, V(3.2, 2.8), tip);
    UI.callout(g, t, { at: [gx + 40, gy - 210], to: [gx + 260, gy - 340], str: 'TIP', start: 0.3 });
  });
  slowTint(g, 0.12);
} });

registerShot('s009', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.04 * t, r: 0.02 - 0.01 * t };
  blurLayer(g, 14, (g2) => kitchen(g2, 0, { z: 1.8, x: -320, y: -100 })); veil(g, '#120a10', 0.38);
  layer(g, cam, 1, (g) => {
    const x = E.W / 2, y = E.H * 0.42 + t * 14;
    FX.drops(g, t, { count: 36, area: [x - 420, y - 300, 840, 520], color: '#cfe0ff', rMax: 16, drift: 3, seed: 5 });
    glass(g, x, y, V(4.2, 3.6), 0.9 + t * 0.05, 0.3);
    seg(g, [[x - 200, y + 260], [x + 200, y + 260]], 2, alpha('#ffffff', 0.15));
    FX.rings(g, x, y - 60, t, { count: 3, r0: 140, r1: 520, speed: 0.35, color: '#e8f0ff', a: 0.3 });
  });
  slowTint(g, 0.38); slowBadge(g, t);
} });

function dustpanIcon(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 5; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-50, -30); g.lineTo(40, -30); g.lineTo(54, 30); g.lineTo(-64, 30); g.closePath(); g.stroke(); seg(g, [[-50, -2], [-130, -60]], 6, c); g.restore(); }
registerShot('s010', { draw(g, t, info) {
  const ui = S().ui;
  const f = faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam), bgCam: { z: 1.6, x: 240, y: -160 }, outfit: THEO, expr: 'thinking', side: -1, dx: -V(260, 0) });
  const k = popIn(t, 0.45, 0.4); if (k <= 0) return;
  const bx = E.W * V(0.72, 0.5), by = E.H * V(0.36, 0.2);
  for (let i = 0; i < 3; i++) circle(g, f.cx + f.r * 0.85 + i * 46, f.cy - f.r * 0.9 - i * 34, (8 + i * 6) * k, alpha(ui.cream, 0.85));
  g.save(); g.translate(bx, by); g.scale(k, k);
  rr(g, -230, -150, 460, 300, 40); g.fillStyle = ui.bpBg; g.fill(); g.strokeStyle = alpha(ui.blueprint, 0.7); g.lineWidth = 3; g.stroke();
  rr(g, -150, -100, 300, 200, 8); g.strokeStyle = ui.blueprint; g.lineWidth = 4; g.stroke(); seg(g, [[0, -100], [0, 100]], 3, ui.blueprint); circle(g, -16, 0, 6, ui.blueprint); circle(g, 16, 0, 6, ui.blueprint);
  dustpanIcon(g, 70, 40, 0.8, ui.gold); glow(g, 70, 40, 90, ui.gold, 0.35);
  text(g, 'DUSTPAN', 0, 125, { size: 26, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
} });

registerShot('s011', { draw(g, t, info) {
  const M = mood('interiorWarm'), GY = E.H * 0.82, cam = push(t, info, { z0: 1.0, z1: 1.05, x0: 20, x1: -20 });
  layer(g, cam, 0.4, (g) => { blurLayer(g, 14, (g2) => kitchen(g2, t, { z: 2.2, x: -100, y: 360 })); veil(g, '#120a10', 0.25); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H + 200, [shade(M.floor, 0.12), shade(M.dark, -0.1)]); g.fillRect(-E.W, GY, E.W * 3, E.H); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; for (let x = -E.W; x < E.W * 2; x += 220) { g.beginPath(); g.moveTo(x, GY); g.lineTo(E.W / 2 + (x - E.W / 2) * 2.2, E.H + 200); g.stroke(); } FX.pool(g, E.W * 0.5, GY + 40, 600, 70, M.key, 0.22); });
  layer(g, cam, 1, (g) => {
    const y = lerp(GY - 230, GY - 205, t / info.dur), x = E.W * 0.46;
    FX.drops(g, t, { count: 14, area: [x - 200, y - 220, 400, 200], color: '#cfe0ff', rMax: 10, drift: 2, seed: 9 });
    glass(g, x, y, V(2.6, 2.2), 1.9 + 0.05 * t, 0.2);
    const dx = lerp(E.W * 1.15, E.W * 0.64, ease.out(prog(t, 0.2, 1.4)));
    // dustpan already in Theo's hand, waiting under the glass
    g.save(); g.translate(dx, GY - 8); poly(g, [[-150, 0], [110, 0], [90, -70], [-130, -70]], '#3a7ae0'); poly(g, [[-150, 0], [110, 0], [110, 6], [-150, 6]], '#2a5ab0'); seg(g, [[110, -40], [300, -150]], 16, '#3a7ae0'); seg(g, [[300, -150], [560, -260]], 64, S().ink); seg(g, [[430, -200], [800, -360]], 92, THEO.color); g.restore();
    UI.dimension(g, t, { x1: x + 160, y1: y + 10, x2: x + 160, y2: GY - 10, str: '10 cm', start: 1.0 });
  });
  slowTint(g, 0.18);
} });

// eyelid overlay on a bigFace (front view): lid 0 = open, 1 = closed
function lids(g, cx, cy, r, lid) { const ey = cy - r * 0.16; for (const ex of [cx - r * 0.34, cx + r * 0.34]) { g.save(); g.beginPath(); g.arc(ex, ey, r * 0.22, 0, Math.PI * 2); g.clip(); g.fillStyle = S().ink; g.fillRect(ex - r * 0.3, ey - r * 0.25, r * 0.6, r * 0.04 + lid * r * 0.4); g.restore(); if (lid > 0.05) seg(g, [[ex - r * 0.17, ey - r * 0.21 + lid * r * 0.4], [ex + r * 0.17, ey - r * 0.21 + lid * r * 0.4]], r * 0.03, alpha(S().feature, 0.5)); } }
// eyelid overlay on a side-view figure head
function lidsSide(g, o, lid) { const [hx, hy, r] = headPos(o), f = o.facing ?? 1, fx = hx + f * r * 0.34, ey = hy - r * 0.16; for (const dx of [-0.26, 0.32]) { const ex = fx + f * dx * r; g.save(); g.beginPath(); g.arc(ex, ey, r * 0.2, 0, Math.PI * 2); g.clip(); g.fillStyle = S().ink; g.fillRect(ex - r * 0.3, ey - r * 0.25, r * 0.6, lid * r * 0.36); g.restore(); } }

registerShot('s012', { draw(g, t, info) {
  const M = mood('interiorWarm'), cam = push(t, info, { z0: 1.7, z1: 1.78, x0: V(500, 300), x1: V(480, 290), y0: -80, y1: -90 });
  const lid = ease.inOut(prog(t, 0.5, info.dur)) * 0.35;
  kitchenWide(g, t, cam, { samBlink: false, samExpr: 'neutral', theoExpr: 'neutral', theoLook: [1, 0],
    extra: (g, GY, tb, s) => { const k = K(); lidsSide(g, { x: k.samX, y: GY, s, facing: -1, outfit: SAM, pose: breathe(POSES.sit, t, 1, 4) }, lid); } });
} });

registerShot('s013', { draw(g, t, info) {
  const ui = S().ui, lid = lerp(0.35, 0.55, t / info.dur);
  const f = faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam), bgCam: { z: 1.6, x: 380, y: -160 }, outfit: SAM, expr: 'neutral', side: 1, noBlink: true, dx: V(300, 0) });
  lids(g, f.cx, f.cy, f.r, lid);
  const a = popIn(t, 0.4), x = V(140, 90);
  UI.readout(g, { label: 'A BLINK', value: '0.1 s', x, y: E.H * V(0.36, 0.2), color: ui.blueprint, a: clamp(a) });
  const secs = 10 * ease.inOut(prog(t, wt(info, 'ten', 1.2) - 0.3, info.dur));
  UI.readout(g, { label: 'TO YOU', value: secs.toFixed(1) + ' s', x, y: E.H * V(0.52, 0.3), a: clamp(popIn(t, wt(info, 'ten', 1.2) - 0.4)) });
} });

registerShot('s014', { draw(g, t, info) {
  const M = mood('interiorWarm'), cam = push(t, info, { z0: 2.15, z1: 2.25, x0: V(456, 300), x1: V(470, 310), y0: 170, y1: 175 }), k = K();
  const { GY } = kitchen(g, t, cam);
  const s = 1.25;
  layer(g, cam, 1, (g) => {
    g.save(); g.translate(k.samX, 0); g.scale(-1, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore();
    table(g, k.tableX, GY, 360);
    const so = { x: k.samX, y: GY, s, facing: -1, outfit: SAM, pose: breathe(POSES.talk, t, 1, 4), expr: 'confused', talk: talk(info), rim: rimOf(M, [-0.6, -0.8]), shadow: false, blink: false };
    so.pose = { ...so.pose, hip: [0, -72], kF: [44, -74], fF: [46, 0], kB: [40, -72], fB: [38, 0], head: [4, -180], sh: [1, -146], eF: [22, -112], hF: [42, -124] };
    drawFigure(g, so); lidsSide(g, so, 0.45);
    const [hx, hy] = headPos(so); if (talk(info) > 0) FX.rings(g, hx, hy, t, { count: 2, r0: 30, r1: 70, color: '#fff3e0', a: 0.35 });
  });
  blurLayer(g, 12, (g2) => drawFigure(g2, { x: E.W * 0.2, y: E.H * 1.25, s: 4.2, facing: 1, outfit: THEO, pose: POSES.sit, expr: 'neutral', rim: rimOf(M, [0.6, -0.8], 6) }));
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });

registerShot('s015', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam), bgCam: { z: 1.6, x: -200, y: -160 }, outfit: THEO, expr: 'neutral', face: { mouth: 'smallFlat', brows: null }, talk: () => talk(info), side: -1, dx: -V(160, 0), look: [0.6, 0] });
} });

registerShot('s016', { draw(g, t, info) {
  const M = mood('interiorWarm'), cam = push(t, info, { z0: 1.0, z1: 1.08 });
  insertBg(g, t, (g2, tt) => kitchen(g2, tt, { z: 2.0, x: -700, y: -150 }), null, 0.3);
  layer(g, cam, 1, (g) => {
    const y = E.H * 0.78; g.fillStyle = shade(M.wall, -0.15); g.fillRect(-E.W, y, E.W * 3, E.H); g.fillStyle = alpha(M.key, 0.3); g.fillRect(-E.W, y, E.W * 3, 3);
    toaster(g, E.W / 2, y, V(3.2, 2.6), 0.6 + 0.2 * Math.sin(t * 6));
    for (let i = 0; i < 5; i++) { const ph = (t * 0.4 + i / 5) % 1; seg(g, [[E.W / 2 - 60 + i * 30 + Math.sin(t * 2 + i) * 8, y - 330 - ph * 160], [E.W / 2 - 60 + i * 30 + Math.sin(t * 2 + i + 1) * 8, y - 360 - ph * 160]], 3, alpha('#ffffff', 0.18 * (1 - ph))); }
  });
  const ui = S().ui, k = clamp(popIn(t, wt(info, 'still', 1.6) - 0.2)), pct = 1 + Math.floor(prog(t, 1.5, info.dur) * 2);
  if (k > 0) { const x = E.W / 2 - 300, y = V(170, 280); text(g, 'TOAST', x, y - 40, { size: 30, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3, alpha: k }); rr(g, x, y, 600, 26, 13); g.fillStyle = alpha(ui.gold, 0.15 * k); g.fill(); rr(g, x, y, 12 + 6 * pct, 26, 13); g.fillStyle = alpha(ui.gold, k); g.fill(); text(g, pct + '%', x + 620, y + 14, { size: 34, color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', alpha: k }); }
} });

registerShot('s017', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.4, z1: 1.48, x0: -330, x1: -350, y0: -60, y1: -70 }), k = K();
  const { GY, M, counterTop } = kitchen(g, t, cam, { clockSpeed: 900, clockT: 7 * 3600 });
  const s = 1.3, chin = { ...POSES.think, head: [14, -196], eF: [30, -150], hF: [24, -186], eB: [24, -146], hB: [42, -158] };
  layer(g, cam, 1, (g) => {
    toaster(g, k.momX + 150, counterTop, 1.1, 0.5 + 0.2 * Math.sin(t * 5));
    drawFigure(g, { x: k.momX - 10, y: GY, s, facing: 1, outfit: THEO, pose: breathe(chin, t, 0.5), expr: 'sleepy', rim: rimOf(M, [-0.6, -0.8]) });
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
} });

registerShot('s018', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.6, z1: 1.7, x0: 80, x1: 60, y0: -110, y1: -130 }), k = K();
  const { GY, M } = kitchen(g, t, cam);
  const x = E.W / 2 + 60, s = 1.3;
  layer(g, cam, 1, (g) => drawFigure(g, { x, y: GY, s, facing: -1, outfit: THEO, pose: breathe(posesAt(t, [[0, POSES.relaxed], [0.3, POSES.wave], [1.4, POSES.relaxed]]), t), expr: 'smile', rim: rimOf(M, [-0.6, -0.8]), blink: blinkAt(t, 3.1) }));
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  label(g, t, 'THEO', E.W * V(0.68, 0.5), E.H * V(0.32, 0.25), wt(info, 'theo', 0.5) - 0.1, { size: V(86, 90), font: FONTS.title });
  label(g, t, 'AGE 14', E.W * V(0.68, 0.5), E.H * V(0.45, 0.33), wt(info, 'fourteen', 1.9) - 0.1, { size: V(54, 58), color: S().ui.cream });
} });
