// shots/06_rescue.js: the rescue (s178-s195), Sunday dance (s196-s202), the older voice (s203-s210), CTA + end (s211-s212).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, faceShot, slowTint, popIn, label } from '../lib.js';
import { bedroom } from '../sets/indoor.js';
import { voidSpace, bigClock, recordPlayer, notes } from '../sets/extra.js';
import { LEO, NOVA, GRANDPA, DRIVER, CAST2 } from '../cast.js';
import { kitchenScene, KX, dance } from '../p1kit.js';
import { bus, bike, rainDrops } from '../sets/street2.js';
import { ST, NS, streetScene, frozenStreet, leoFace, novaFace, rider, whisper, voiceRings, stranger, voidFace } from '../k2.js';

const NV = () => ST().nova + 120;                              // Nova's frozen spot (wheel at the curb)
const PULL = [[0, { ...POSES.reach, eF: [34, -150], hF: [62, -150] }], [0.3, { ...POSES.ready, eF: [-20, -150], hF: [-40, -140], head: [-18, -196], sh: [-14, -164] }]];
// ---------- the rescue ----------
registerShot('s178', { draw(g, t, info) {
  const k = clamp(t / 0.6), cam = push(t, info, { z0: 1.14, z1: 1.1, x0: 60, x1: 60, y0: 110, y1: 110 });
  streetScene(g, t, cam, { busX: ST().nova + V(560, 420) - t * 60, shout: true, nova: { x: NV(), expr: 'scared', look: [1, 0] }, leo: { pose: { ...POSES.reach, eF: [30, -150], hF: [56, -150] }, expr: 'determined', look: [1, 0], hood: true } });
  slowTint(g, 0.34 * (1 - k));
  for (const [x, y] of [[ST().leo + 30, E.H * 0.42], [NV() + 30, E.H * 0.42]]) { const p = clamp(t / 1.0); for (let i = 0; i < 5; i++) circle(g, x + 30 + p * 120 + i * 16, y + Math.sin(i) * 8, (8 + i * 3) * p, alpha('#ffffff', 0.3 * (1 - p))); }
} });
registerShot('s179', { draw(g, t, info) {
  const half = (cx, outfit, side, face) => { g.save(); g.beginPath(); g.rect(cx - E.W / 4, 0, E.W / 2, E.H); g.clip(); blurLayer(g, 12, (g2) => streetScene(g2, t, { z: 1.5, x: side * 200, y: 120 }, { leo: false, nova: false, busX: null })); veil(g, '#05060c', 0.35);
    const r = V(220, 200), cy = E.H * 0.58; UI; g.restore(); return { cx, cy, r }; };
  half(E.W * 0.25, LEO, -1); half(E.W * 0.75, NOVA, 1);
  for (const [cx, of, sd] of [[E.W * 0.25, LEO, 1], [E.W * 0.75, NOVA, -1]]) { g.save(); g.beginPath(); g.rect(cx - E.W / 4, 0, E.W / 2, E.H); g.clip(); const r = V(220, 200), cy = E.H * 0.6; import_bigFace(g, cx, cy, r, of, sd, t); const p = clamp(t / 1.0); for (let i = 0; i < 6; i++) circle(g, cx + sd * (r * 0.6 + p * 160 + i * 18), cy + r * 0.3 + Math.sin(i) * 10, (10 + i * 4) * p, alpha('#ffffff', 0.3 * (1 - p))); g.restore(); }
  seg(g, [[E.W / 2, 0], [E.W / 2, E.H]], 6, '#05060c'); FX.rain(g, t, { a: 0.25, count: 180 });
} });
import { bigFace } from '/engine/rig2d.js';
function import_bigFace(g, cx, cy, r, outfit, side, t) { bigFace(g, cx, cy, r, { outfit, expr: 'neutral', face: { mouth: 'o' }, rimColor: '#9fc4ff', rimSide: side, look: [side * 0.6, 0], blink: false }); }
registerShot('s180', { draw(g, t, info) { streetScene(g, t, push(t, info, { z0: 1.0, z1: 1.04, y0: 50, y1: 55 }), { busX: ST().nova + V(500, 380) - t * 120, nova: { x: NV(), expr: 'scared', look: [1, 0] }, leo: { pose: walkPose(0.3, { run: true }), expr: 'determined', look: [1, 0], hood: true } }); } });
registerShot('s181', { draw(g, t, info) {
  blurLayer(g, 10, (g2) => streetScene(g2, t, { z: 1.6, x: 400, y: 100 }, { leo: false, nova: false })); veil(g, '#05060c', 0.25);
  const sh = Math.sin(t * 50) * 6; layer(g, { z: 1.0, x: sh, y: sh * 0.5 }, 1, (g) => bus(g, E.W * 0.12 - t * 80, E.H * 0.98, 2.6, { facing: 1, lights: true, driver: true, shout: true }));
  FX.rings(g, E.W * 0.82, E.H * 0.55, t, { count: 3, r0: 80, r1: 600, speed: 1.4, color: '#ffe6b0', a: 0.3 });
  label(g, t, 'HOOONK!', E.W * 0.72, E.H * 0.22, 0.0, { size: V(90, 80), color: S().ui.accent, font: FONTS.title });
  FX.rain(g, t, { a: 0.3, count: 200 });
} });
registerShot('s182', { draw(g, t, info) {
  const k = ST(), p = ease.inOut(prog(t, 0.0, 1.4)), x = lerp(k.leo, NV() - 150, p);
  const cam = push(t, info, { z0: 1.3, z1: 1.3, x0: k.leo - E.W / 2 + 200, x1: NV() - E.W / 2 - 200, y0: 150, y1: 150 });
  streetScene(g, t, cam, { busX: k.nova + V(460, 340) - t * 140, nova: { x: NV(), expr: 'scared', look: [1, 0] }, leo: { x, pose: walkPose(t * 2.2 * Math.PI * 2, { run: true }), expr: 'determined', look: [1, 0], hood: true },
    under: (g, r) => { for (let i = 0; i < 3; i++) { const at = 0.2 + i * 0.4; if (t < at) continue; const fx = lerp(k.leo, NV() - 150, (i + 1) / 3.2); g.fillStyle = alpha('#cfe0ff', 0.35 * (1 - clamp((t - at) / 0.8))); g.beginPath(); g.ellipse(fx, r.GY + 10, 50, 10, 0, 0, 7); g.fill(); } } });
  for (let i = 0; i < 3; i++) label(g, t, String(i + 1), E.W * (0.3 + i * 0.2), E.H * 0.22, 0.2 + i * 0.4, { size: V(70, 64), font: FONTS.title });
} });
registerShot('s183', { draw(g, t, info) {
  blurLayer(g, 12, (g2) => streetScene(g2, t, { z: 1.7, x: 300, y: 150 }, { leo: false, nova: false, busX: ST().nova + 300 })); veil(g, '#05060c', 0.3);
  const ink = S().ink, grab = ease.out(prog(t, 0.2, 0.55)), cam = push(t, info, { z0: 1.0, z1: 1.04 });
  layer(g, cam, 1, (g) => { const px = E.W * 0.6, py = E.H * 0.5; g.save(); g.translate(px, py); g.rotate(-0.2); rr(g, -150, -200, 280, 380, 50); g.fillStyle = '#e0a23a'; g.fill(); g.fillStyle = shade('#e0a23a', -0.3); g.fillRect(-150, 40, 280, 50); seg(g, [[-130, -180], [-180, 160]], 34, '#b07a22'); g.restore();
    const hx = lerp(-100, px - 200, grab), hy = py - 40; seg(g, [[-200, hy + 300], [hx - 120, hy + 40]], 120, LEO.color); seg(g, [[hx - 140, hy + 40], [hx, hy]], 70, ink); circle(g, hx + 10, hy, 60, ink); for (let i = 0; i < 4; i++) seg(g, [[hx + 20, hy - 30 + i * 22], [hx + 80 - grab * 40, hy - 20 + i * 22]], 22, ink); });
  FX.rain(g, t, { a: 0.3, count: 200 });
} });
registerShot('s184', { draw(g, t, info) {
  const k = ST(), p = ease.out(prog(t, 0.0, 0.6)), cam = push(t, info, { z0: 1.5, z1: 1.55, x0: NV() - E.W / 2 - 180, x1: NV() - E.W / 2 - 220, y0: 170, y1: 172 });
  streetScene(g, t, cam, { busX: NV() + V(240, 180) - t * 300, busBlur: 0.6, nova: { x: NV() - p * 60, lean: p, expr: 'scared', look: [1, 0] }, leo: { x: NV() - 190 - p * 50, pose: posesAt(t, PULL, 0.3), expr: 'determined', look: [1, 0], hood: true } });
} });
registerShot('s185', { draw(g, t, info) {
  const p = ease.out(prog(t, 0.0, 0.8)), cam = push(t, info, { z0: 1.6, z1: 1.64, x0: NV() - E.W / 2 - 40, x1: NV() - E.W / 2 - 60, y0: 180, y1: 182 });
  streetScene(g, t, cam, { busX: NV() + 100 - t * 500, busBlur: 0.8, nova: { x: NV() - 60 - p * 30, lean: 1, expr: 'scared', look: [1, 0] }, leo: { x: NV() - 240 - p * 20, pose: posesAt(1, PULL, 0.3), expr: 'determined', look: [1, 0], hood: true } });
} });
registerShot('s186', { draw(g, t, info) {
  const sh = Math.sin(t * 60) * 5, cam = push(t, info, { z0: 1.2, z1: 1.22, x0: NV() - E.W / 2 - 100 + sh, x1: NV() - E.W / 2 - 100 + sh, y0: 130, y1: 130 });
  streetScene(g, t, cam, { busX: NV() + 900 - t * 1800, busBlur: 1, nova: { x: NV() - 90, lean: 1, expr: 'scared', look: [1, 0], hair: 0.8 }, leo: { x: NV() - 260, pose: posesAt(1, PULL, 0.3), expr: 'shocked', look: [1, 0], hood: true } });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.45, count: 50, a: 0.25, inner: 300 });
} });
registerShot('s187', { draw(g, t, info) { novaFace(g, t, info, { expr: 'shocked', look: [1, 0], dx: V(140, 0), noBlink: true, zoom: 0.03, bg: (g2, tt, cam) => streetScene(g2, tt, cam, { leo: false, nova: false, busX: ST().nova + 400 - tt * 1600, busBlur: 1 }), bgCam: { z: 1.6, x: 300, y: 120 },
  front: (g, t2, cx, cy, r) => { const k = 0.6 + 0.4 * Math.sin(t * 20); g.strokeStyle = S().ink; g.lineWidth = r * 0.3; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - r * 0.7, cy - r * 0.6); g.quadraticCurveTo(cx - r * 1.4, cy - r * (1.0 + 0.2 * k), cx - r * 1.9, cy - r * (1.2 + 0.3 * k)); g.stroke(); } });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.5, count: 30, a: 0.15, inner: 500 }); FX.rain(g, t, { a: 0.25, count: 160 });
} });
registerShot('s188', { draw(g, t, info) {
  blurLayer(g, 12, (g2) => streetScene(g2, t, { z: 1.7, x: 300, y: 150 }, { leo: false, nova: false, busX: null })); veil(g, '#05060c', 0.25);
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }), GY = E.H * 0.8;
  layer(g, cam, 1, (g) => { g.fillStyle = '#3a3448'; g.fillRect(-100, GY - 40, E.W + 200, 40); g.fillStyle = '#2a2632'; g.fillRect(-100, GY, E.W + 200, 400); g.fillStyle = shade('#3a3448', 0.25); g.fillRect(-100, GY - 44, E.W + 200, 6);
    bike(g, E.W * 0.4, GY - 40, 3.2, { facing: 1, wheelRot: 0.3 }); });
  FX.rain(g, t, { a: 0.3, count: 200 });
  label(g, t, 'RIGHT ON THE CURB', E.W / 2, E.H * 0.2, wt(info, 'curb', 1.8) - 0.1, { size: V(56, 52), color: S().ui.cream });
} });
const after = (g, t, cam, o = {}) => streetScene(g, t, cam, { busX: NV() - V(700, 520), shout: o.shout, nova: { x: NV() - 90, lean: o.lean ?? 0.3, expr: o.novaExpr || 'shocked', look: o.novaLook || [1, 0] }, leo: { x: NV() - 280, pose: o.leoPose || POSES.relaxed, expr: o.leoExpr || 'shocked', look: o.leoLook || [1, 0], hood: true }, extra: o.extra });
registerShot('s189', { draw(g, t, info) {
  after(g, t, push(t, info, { z0: 1.15, z1: 1.2, x0: -60, x1: -80, y0: 110, y1: 112 }), { shout: true });
} });
registerShot('s190', { draw(g, t, info) {
  blurLayer(g, 12, (g2) => after(g2, t, { z: 1.5, x: -300, y: 120 })); veil(g, '#05060c', 0.3);
  layer(g, push(t, info, { z0: 1.0, z1: 1.05 }), 1, (g) => { bus(g, E.W * 0.95, E.H * 1.05, 2.8, { facing: 1, lights: true, driver: true, shout: talk(info) > 0.2 }); });
  whisper(g, t, 'Are you two okay?', { at: 0.1, y: E.H * 0.18, size: V(56, 48), color: S().ui.cream });
  FX.rain(g, t, { a: 0.3, count: 200 });
} });
function soaked(g, t, info, o = {}) {
  const cam = push(t, info, { z0: 1.5, z1: 1.55, x0: NV() - E.W / 2 - 180, x1: NV() - E.W / 2 - 185, y0: 170, y1: 172 }), sh = o.shake ? Math.sin(t * 40) * 3 : 0;
  after(g, t, { ...cam, x: cam.x + sh }, { lean: 0, novaExpr: o.novaExpr || 'surprised', leoExpr: o.leoExpr || 'surprised', novaLook: [-1, 0], leoLook: [1, 0], leoPose: o.leoPose,
    extra: (g, r) => { for (let i = 0; i < 14; i++) { const ph = (t * 1.5 + i * 0.29) % 1, x = (i % 2 ? NV() - 90 : NV() - 280) + ((i * 37) % 60) - 30; circle(g, x, r.GY - 200 * NS + ph * 200 * NS, 4, alpha('#cfe0ff', 0.7 * (1 - ph))); } } });
}
registerShot('s191', { draw(g, t, info) { soaked(g, t, info); label(g, t, 'SOAKED', E.W * 0.75, E.H * 0.24, 0.2, { size: V(60, 56), color: '#9fc4ff' }); } });
registerShot('s192', { draw(g, t, info) { const tL = wt(info, 'laughing', 1.2) - 0.1; soaked(g, t, info, { shake: t < tL, novaExpr: t > tL ? 'joy' : 'scared', leoExpr: t > tL ? 'happy' : 'scared', leoPose: t > tL ? { ...POSES.cheer } : POSES.relaxed }); } });
registerShot('s193', { draw(g, t, info) { novaFace(g, t, info, { expr: 'surprised', look: [-1, 0], dx: V(160, 0), bg: (g2, tt, cam) => after(g2, tt, cam), bgCam: { z: 1.6, x: 300, y: 120 } }); FX.rain(g, t, { a: 0.2, count: 140 }); } });
registerShot('s194', { draw(g, t, info) { novaFace(g, t, info, { expr: 'smile', look: [-1, 0], dx: V(160, 0), talk: () => talk(info), bg: (g2, tt, cam) => after(g2, tt, cam), bgCam: { z: 1.6, x: 300, y: 120 } }); FX.rain(g, t, { a: 0.2, count: 140 }); } });
registerShot('s195', { draw(g, t, info) {
  after(g, t, push(t, info, { z0: 1.3, z1: 1.2, x0: NV() - E.W / 2 - 180, x1: NV() - E.W / 2 - 180, y0: 150, y1: 140 }), { lean: 0, novaExpr: 'joy', leoExpr: 'joy', novaLook: [-1, 0], leoLook: [1, 0], leoPose: breathe(POSES.cheer, t, 1, 2) });
  label(g, t, '…AND THE SHORTEST', E.W / 2, E.H * 0.2, 0.3, { size: V(52, 50), color: S().ui.cream });
} });

// ---------- Sunday again ----------
const NX = () => E.W / 2 + V(560, 300), LX = () => E.W / 2 + V(250, 150);
function party(g, t, cam, o = {}) {
  return kitchenScene(g, t, cam, { table: false, leo: false, gpExpr: 'joy',
    extra: (g, r, s) => { const rim = rimOf(r.M, [-0.6, -0.8]);
      drawFigure(g, { x: LX(), y: r.GY, s, facing: -1, outfit: LEO, pose: o.leoDance ? dance(t + 0.3) : breathe(POSES.relaxed, t), expr: o.leoDance ? 'joy' : 'smile', rim, blink: blinkAt(t, 3.2) });
      drawFigure(g, { x: NX(), y: r.GY, s, facing: -1, outfit: NOVA, pose: o.novaDance ? dance(t + 0.15) : (o.novaPose || breathe(POSES.relaxed, t, 1, 1.3)), expr: o.novaExpr || (o.novaDance ? 'joy' : 'smile'), rim, blink: blinkAt(t, 3.7, 1) }); } });
}
registerShot('s196', { draw(g, t, info) { party(g, t, push(t, info, { z0: 1.0, z1: 1.06, x0: 40, x1: 60 })); label(g, t, 'SUNDAY', E.W / 2, V(140, 220), 0.3, { size: V(50, 50), color: S().ui.cream }); } });
registerShot('s197', { draw(g, t, info) {
  blurLayer(g, 14, (g2) => party(g2, t, { z: 1.6, x: -400, y: -100 })); veil(g, '#0a0710', 0.35);
  layer(g, push(t, info, { z0: 1.0, z1: 1.06 }), 1, (g) => { recordPlayer(g, E.W * 0.5, E.H * 0.8, V(3.4, 2.6), t, true, mood('interiorWarm')); notes(g, t, E.W * 0.5, E.H * 0.55, { count: 6, spread: 600 }); });
} });
registerShot('s198', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => party(g2, tt, cam), bgCam: { z: 1.6, x: 300, y: -150 }, outfit: NOVA, expr: 'smile', side: -1, dx: V(160, 0), look: [-0.6, 0] });
  const k = popIn(t, wt(info, 'count', 1.6)); if (k > 0) { g.save(); g.translate(E.W * 0.28, E.H * 0.4); g.scale(k, k); text(g, '3 · 2 · 1', 0, 0, { size: V(70, 64), color: alpha(S().ui.gold, 0.6), font: FONTS.title, weight: 700 }); seg(g, [[-180, 0], [180, 0]], 10, S().ui.accent); g.restore(); }
} });
registerShot('s199', { draw(g, t, info) {
  party(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: NX() - E.W / 2 - 120, x1: NX() - E.W / 2 - 130, y0: 160, y1: 162 }), { novaPose: posesAt(t, [[0, POSES.relaxed], [0.5, { ...POSES.shrug }]], 0.4), novaExpr: 'smile' });
} });
registerShot('s200', { draw(g, t, info) { party(g, t, push(t, info, { z0: 1.12, z1: 1.18, x0: 40, x1: 60, y0: 60, y1: 64 }), { novaDance: true, leoDance: true }); } });
registerShot('s201', { draw(g, t, info) { party(g, t, push(t, info, { z0: 1.0, z1: 1.1, x0: 40, x1: 60, y0: 0, y1: 40 }), { novaDance: true, leoDance: true }); label(g, t, '200 YEARS', E.W / 2, V(150, 230), wt(info, 'hundred', 1.6) - 0.1, { size: V(56, 54) }); } });
registerShot('s202', { draw(g, t, info) {
  party(g, t, push(t, info, { z0: 1.5, z1: 1.56, x0: (LX() + NX()) / 2 - E.W / 2, x1: (LX() + NX()) / 2 - E.W / 2, y0: 160, y1: 162 }), { novaDance: true, leoDance: true });
  label(g, t, 'NOT ALONE', E.W / 2, E.H * 0.8, wt(info, 'alone', 1.2) - 0.1, { size: V(64, 60), font: FONTS.title });
} });

// ---------- the older voice ----------
registerShot('s203', { draw(g, t, info) {
  const fz = wt(info, 'takes', 1.4), f = t > fz;
  const r = bedroom(g, f ? 0 : t, push(t, info, { z0: 1.3, z1: 1.36, x0: 120, x1: 130, y0: 100, y1: 104 }), { mood: 'night' });
  layer(g, push(t, info, { z0: 1.3, z1: 1.36, x0: 120, x1: 130, y0: 100, y1: 104 }), 1, (g) => drawFigure(g, { x: E.W / 2 + V(250, 160), y: r.GY - 30, s: 1.25, facing: -1, outfit: LEO, pose: POSES.sit, expr: f ? 'surprised' : 'sleepy', rim: rimOf(r.M, [-0.6, -0.8]), shadow: false, blink: f ? false : blinkAt(t, 2.4) }));
  if (f) { slowTint(g, 0.34 * clamp((t - fz) / 0.3)); FX.drops(g, t, { count: 30, rMax: 5, drift: 1, color: '#cfe0ff' }); }
} });
const DARK = '#7a5ad8';
registerShot('s204', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, z1: 1.3, y0: 100, y1: 106 }), r = voidSpace(g, t, cam, { color: DARK });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 200, y: r.GY, s: 1.05, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'surprised', look: [1, 0], rim: { color: '#b8a8ff', dir: [0, -1] }, blink: false }));
  voiceRings(g, t, E.W * 0.85, E.H * 0.35, { color: DARK, r0: 20, r1: 700, a: 0.45 });
} });
registerShot('s205', { draw(g, t, info) { voidFace(g, t, info, LEO, { expr: 'scared', look: [1, 0], noBlink: true, color: DARK, zoom: 0.1, rimColor: '#b8a8ff' }); whisper(g, t, 'Not Nova’s.', { at: 0.1, y: E.H * 0.2, size: V(52, 46), color: '#b8a8ff' }); } });
function strangerVoid(g, t, info, o) {
  const cam = push(t, info, { z0: o.z0, z1: o.z1, y0: o.y0 ?? 100, y1: o.y1 ?? 100 }), r = voidSpace(g, t, cam, { color: DARK });
  layer(g, cam, 1, (g) => { stranger(g, t, o.x ?? E.W / 2, r.GY, o.s ?? 1.1, { glints: o.glints, a: o.a }); });
  if (o.frost) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const x = (i * 211) % E.W, y = (i * 97 + t * 30) % E.H; FX.sparkle(g, x, y, 6 + (i % 4) * 3, '#cfe0ff', 0.4); } g.restore(); }
  veil(g, '#020205', o.veil ?? 0.15);
}
registerShot('s206', { draw(g, t, info) { strangerVoid(g, t, info, { z0: 0.8, z1: 0.85, y0: -40, y1: -40, s: 0.8, a: 0.7 }); label(g, t, 'OLDER', E.W * 0.78, E.H * 0.26, 0.05, { size: V(60, 56), color: '#b8a8ff' }); } });
registerShot('s207', { draw(g, t, info) { strangerVoid(g, t, info, { z0: 1.2, z1: 1.3, y0: 100, y1: 110, frost: true }); label(g, t, 'COLDER', E.W * 0.78, E.H * 0.26, 0.05, { size: V(60, 56), color: '#cfe0ff' }); } });
registerShot('s208', { draw(g, t, info) { strangerVoid(g, t, info, { z0: 2.5, z1: 2.6, y0: 74, y1: 74, glints: 0.6, veil: 0.3 }); } });
registerShot('s209', { draw(g, t, info) { strangerVoid(g, t, info, { z0: 1.7, z1: 1.8, y0: 230, y1: 240, glints: ease.out(prog(t, 0.3, 0.8)) }); whisper(g, t, 'There are two of you now.', { at: 0.1, y: E.H * 0.18, size: V(52, 46), color: '#b8a8ff' }); } });
registerShot('s210', { draw(g, t, info) {
  strangerVoid(g, t, info, { z0: 1.0, z1: 1.1, y0: 40, y1: 60, glints: 1 });
  g.save(); g.globalAlpha *= 0.5; FX.fog(g, E.H * 0.6, E.H * 0.4, '#2a2040', 0.5); g.restore();
  whisper(g, t, 'I’ve been waiting a very long time.', { at: 0.2, y: E.H * 0.18, size: V(50, 44), color: '#b8a8ff' });
} });

// ---------- CTA + end ----------
registerShot('s211', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, z1: 1.0, y0: 60, y1: 0, ease: ease.out }), r = voidSpace(g, t, cam);
  layer(g, cam, 0.95, (g) => { g.save(); g.translate(E.W / 2, r.GY + 40); g.scale(1, 0.32); bigClock(g, 0, 0, V(820, 600), 12.0, { face: '#e8e2da' }); g.restore(); });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2 - 90, y: r.GY + 30, s: 0.9, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'awe', look: [0.3, -1], rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false }); drawFigure(g, { x: E.W / 2 + 90, y: r.GY + 30, s: 0.9, facing: -1, outfit: NOVA, pose: POSES.stand, expr: 'smile', look: [-0.3, -1], rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false }); });
  UI.bigLine(g, t, { str: 'A YEAR INSIDE ONE SECOND?', dur: info.dur + 0.4, y: E.H * 0.24, size: V(70, 60) });
} });
registerShot('s212', { draw(g, t, info) {
  const M = mood('dusk');
  UI.endScreen(g, t, { question: 'Who would you share your year with?', cast: CAST2, moodColors: [shade(M.dark, -0.3), M.dark, shade(M.wall, -0.2)], rim: M.rim });
  label(g, t, 'SUBSCRIBE FOR PART THREE', E.W / 2, V(420, 700), wt(info, 'part', 7.6) - 0.6, { size: V(40, 44), color: S().ui.gold });
  FX.dust(g, t, { count: 40, a: 0.3 });
} });
