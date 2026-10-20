// shots/05_cpr.js: breathe out and CPR (s124-s144), the hospital (s145-s152), the stranger (s153-s155),
// is it real (s156-s164), ending (s165-s166).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix, rng,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, label, stamp } from '../lib.js';
import { kitchen, bedroom } from '../sets/indoor.js';
import { voidSpace, recordPlayer, spoonProp, glassesProp, hospital, hospitalBed, ecg, heartIcon, notes, frame } from '../sets/extra.js';
import { KX, kitchenScene, frozenKitchen, HELD } from './01_open.js';
import { LEO, GRANDPA, MOM, MEDIC, STRANGER, CAST } from '../cast.js';

// ---------- CPR staging: Grandpa on the floor (head left), Leo kneeling at his side ----------
const CPR_UP = { ...POSES.kneel, head: [40, -148], sh: [30, -122], eF: [44, -78], hF: [56, -30], eB: [40, -80], hB: [52, -32] };
const CPR_DN = { ...POSES.kneel, head: [44, -136], sh: [34, -110], eF: [48, -68], hF: [56, -24], eB: [44, -70], hB: [52, -26] };
const beats = (t, bpm = 110) => { const p = (t * bpm / 60) % 1; return p < 0.4 ? ease.inOut(p / 0.4) : 1 - ease.inOut((p - 0.4) / 0.6); };
function floorScene(g, t, cam, o = {}) {
  const r = kitchen(g, t, cam, { mood: 'interiorWarm', clockT: 15 * 3600 + 21 * 60, clockSpeed: o.clockSpeed ?? 1 });
  const { GY, M, counterTop } = r, s = 1.25, k = KX(), gx = E.W / 2 - V(40, 20), chestX = gx - 74 * s, rim = rimOf(M, [-0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    recordPlayer(g, k.rp, counterTop, 0.9, t, true, M); if (o.notes !== false) notes(g, t, k.rp - 20, counterTop - 70, { count: 4, spread: 200, a: 0.8 });
    drawFigure(g, { x: gx, y: GY + 86 * s, s, facing: 1, outfit: GRANDPA, pose: POSES.lie, rot: -Math.PI / 2, expr: 'sleepy', rim, shadow: false, blink: false });
    glassesProp(g, gx - 280, GY - 8, 0.45, 0.1);
    if (o.leo !== false) { const c = o.comp ?? 0, pose = o.leoPose || { ...CPR_UP }; const P = o.leoPose ? pose : Object.fromEntries(Object.keys(CPR_UP).map((kk) => [kk, [lerp(CPR_UP[kk][0], CPR_DN[kk][0], c), lerp(CPR_UP[kk][1], CPR_DN[kk][1], c)]]));
      drawFigure(g, { x: o.leoX ?? chestX + 56 * s, y: GY, s, facing: -1, outfit: LEO, pose: P, expr: o.leoExpr || 'determined', face: o.leoFace, talk: o.leoTalk || 0, rim, blink: blinkAt(t, 3.2) }); }
    o.extra?.(g, GY, s, chestX);
  });
  if (o.sirens) { const ph = Math.sin(t * Math.PI * 3); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.38, E.H * 0.25, 700, ph > 0 ? '#3a6aff' : '#ff3a3a', 0.25 + 0.15 * Math.abs(ph)); g.restore(); }
  FX.dust(g, t, { count: 35, color: '#ffe2bd', a: 0.28 });
  return { ...r, chestX };
}
const cprCam = (t, info, o = {}) => push(t, info, { z0: o.z0 ?? 1.55, z1: o.z1 ?? 1.6, x0: o.x ?? -60, x1: (o.x ?? -60) + 10, y0: o.y ?? 180, y1: (o.y ?? 180) + 4 });
registerShot('s124', { draw(g, t, info) {
  const k = ease.out(prog(t, 0.05, 0.6));
  if (t < 0.3) frozenKitchen(g, t, push(t, info, { z0: 1.12, z1: 1.14 }));
  else { const kx = KX(); kitchenScene(g, t, push(t, info, { z0: 1.12, z1: 1.16 }), { gpPose: POSES.lie, gpRot: -Math.PI / 2, gpDy: 86 * 1.25, gpExpr: 'sleepy', leoPose: walkPose(t * 9, { run: true }), leoX: lerp(kx.leo, kx.gp + 220, ease.out(prog(t, 0.3, 1.1))), leoExpr: 'shocked', leoFacing: -1, notes: true, extra: (g, r, s) => spoonProp(g, kx.gp + 140, r.GY - 8, 0.8, 0) }); }
  if (t < 0.4) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffffff', 0.5 * (1 - prog(t, 0.2, 0.4))); g.fillRect(0, 0, E.W, E.H); g.restore(); }
} });
registerShot('s125', { draw(g, t, info) {
  const M = mood('interiorWarm'), GY = E.H * 0.8, cam = push(t, info, { z0: 1.0, z1: 1.04 }), [sx, sy] = shake(t, 10 * (1 - prog(t, 0.2, 0.8)), 30);
  layer(g, cam, 0.4, (g) => { blurLayer(g, 14, (g2) => kitchen(g2, t, { z: 2.0, x: -300, y: 360 }, { mood: 'interiorWarm' })); veil(g, '#0a0710', 0.25); });
  layer(g, { ...cam, x: sx, y: sy }, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H + 200, [shade(M.floor, 0.12), shade(M.dark, -0.1)]); g.fillRect(-E.W, GY, E.W * 3, E.H); });
  const b = Math.abs(Math.sin(t * 9)) * 40 * Math.exp(-t * 3); layer(g, { ...cam, x: sx, y: sy }, 1, (g) => { spoonProp(g, E.W * 0.5, GY - 20 - b, V(3.4, 3), 0.05 * Math.sin(t * 20) * Math.exp(-t * 2)); if (t > 0.15 && t < 0.8) FX.rings(g, E.W * 0.5, GY - 20, t - 0.15, { count: 3, r0: 40, r1: 400, speed: 1.6, color: '#fff3e0', a: 0.5 }); });
  label(g, t, 'CLANG', E.W * 0.74, E.H * 0.3, 0.15, { size: V(64, 60), color: S().ui.cream, font: FONTS.title });
} });
registerShot('s126', { draw(g, t, info) { floorScene(g, t, cprCam(t, info, { z0: 1.6, z1: 1.66, x: 60, y: 170 }), { leoPose: { ...POSES.kneel, head: [-14, -168], sh: [-4, -134], eF: [-34, -150], hF: [-60, -176] }, leoExpr: 'scared', leoTalk: talk(info) }); label(g, t, '"MOM! CALL AN AMBULANCE!"', E.W / 2, V(150, 260), 0.1, { size: V(44, 44), color: S().ui.cream }); } });
registerShot('s127', { draw(g, t, info) { floorScene(g, t, cprCam(t, info), { leoPose: posesAt(t, [[0, POSES.stand], [0.15, POSES.kneel]], 0.3), leoExpr: 'determined' }); } });
registerShot('s128', { draw(g, t, info) {
  const M = mood('interiorWarm'), cam = push(t, info, { z0: 1.0, z1: 1.06 }), ink = S().ink, x = E.W / 2, y = E.H * 0.56;
  backdrop(g, [shade(GRANDPA.color, -0.25), shade(GRANDPA.color, -0.45)]); g.fillStyle = shade(GRANDPA.color, -0.1); for (let i = 0; i < 8; i++) g.fillRect(E.W * 0.1 + i * 220, 0, 6, E.H);
  layer(g, cam, 1, (g) => { const k = ease.out(prog(t, 0.1, 0.8)), yy = lerp(-200, y, k); seg(g, [[x, yy], [x + 120, yy - 600]], 80, ink); seg(g, [[x + 140, yy - 500], [x + 260, yy - 1200]], 110, LEO.color); rr(g, x - 120, yy - 50, 240, 110, 50); g.fillStyle = ink; g.fill(); rr(g, x - 100, yy - 80, 200, 90, 40); g.fill(); seg(g, [[x - 110, yy - 46], [x + 100, yy - 46]], 4, alpha('#ffc68a', 0.5));
    const kc = popIn(t, 0.9); if (kc > 0) { g.setLineDash([10, 8]); ring(g, x, y, 170 * kc, 4, S().ui.gold); g.setLineDash([]); } });
  label(g, t, 'CENTRE OF THE CHEST', E.W / 2, E.H * 0.86, 0.9, { size: V(50, 50) });
} });
registerShot('s129', { draw(g, t, info) { floorScene(g, t, cprCam(t, info), { comp: t > 0.2 ? beats(t - 0.2) : 0 }); label(g, t, 'PUSH HARD', E.W * 0.74, E.H * 0.26, 0.2, { size: V(60, 56), font: FONTS.title }); } });
registerShot('s130', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), x = E.W * 0.45, y = E.H * 0.5, d = 120 * ease.inOut(Math.abs(Math.sin(t * 1.8)));
  seg(g, [[E.W * 0.15, y + d * 0.5], [x - 160, y + d * 0.2], [x, y + d], [x + 160, y + d * 0.2], [E.W * 0.75, y + d * 0.5]], 5, c);
  rr(g, x - 70, y - 140 + d, 140, 120, 30); g.strokeStyle = ui.gold; g.lineWidth = 5; g.stroke(); seg(g, [[x, y - 140 + d], [x, y - 360]], 5, ui.gold);
  UI.dimension(g, t, { x1: x + 260, y1: y, x2: x + 260, y2: y + 120, str: '5 cm', start: wt(info, 'five', 0.3) - 0.1 }); seg(g, [[x + 160, y], [x + 300, y]], 2, alpha(c, 0.5)); seg(g, [[x + 160, y + 120], [x + 300, y + 120]], 2, alpha(c, 0.5));
} });
registerShot('s131', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui; const k = Math.max(0, Math.sin(t * Math.PI * 110 / 60)); heartIcon(g, E.W / 2, E.H * 0.36, 1.8 * (1 + 0.15 * k), ui.accent);
  label(g, t, '100–120', E.W / 2, E.H * 0.64, wt(info, 'hundred', 0.4) - 0.1, { size: V(130, 110), font: FONTS.title }); label(g, t, 'PUSHES PER MINUTE', E.W / 2, E.H * 0.8, wt(info, 'minute', 2.3) - 0.2, { size: V(46, 46), color: ui.cream });
} });
registerShot('s132', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam, { mood: 'interiorWarm' }), bgCam: { z: 1.6, x: 0, y: 200 }, outfit: LEO, expr: 'thinking', side: -1, zoom: 0.05 }); } });
registerShot('s133', { draw(g, t, info) { const M = mood('interiorWarm'); insertBg(g, t, (g2, tt) => kitchen(g2, tt, { z: 1.6, x: -500, y: -100 }, { mood: 'interiorWarm' }), null, 0.35); layer(g, push(t, info, { z0: 1.0, z1: 1.08 }), 1, (g) => { recordPlayer(g, E.W / 2, E.H * 0.8, V(3, 2.5), t, true, M); notes(g, t, E.W / 2, E.H * 0.5, { count: 6, spread: 600 }); }); label(g, t, 'HIS SONG', E.W * 0.78, E.H * 0.24, 0.3, { size: V(56, 56) }); } });
function booms(info) { const a = wt(info, 'boom', 0.05), b = wt(info, 'boom', 0.8, a + 0.1), c = wt(info, 'boom', 1.5, b + 0.1); return [a, b, c]; }
registerShot('s134', { draw(g, t, info) {
  const bs = booms(info), ui = S().ui; let comp = 0; for (const b of bs) if (t >= b) comp = Math.max(comp, 1 - clamp((t - b) / 0.45));
  const r = floorScene(g, t, cprCam(t, info, { z0: 1.7, z1: 1.74 }), { comp });
  bs.forEach((b, i) => { if (t > b) { FX.rings(g, E.W * 0.45, E.H * 0.6, (t - b) * 0.9, { count: 1, r0: 40, r1: 420, color: ui.gold, a: 0.8 * (1 - prog(t, b, b + 1)) }); label(g, t, 'BOOM', E.W * (0.25 + i * 0.25), E.H * 0.22, b - 0.02, { size: V(64, 60), font: FONTS.title }); } });
} });
registerShot('s135', { draw(g, t, info) { floorScene(g, t, push(t, info, { z0: 1.2, z1: 1.26, x0: -200, x1: -180, y0: 100, y1: 102 }), { comp: beats(t) }); } });
registerShot('s136', { draw(g, t, info) { const ui = S().ui, bpm = 110; floorScene(g, t, cprCam(t, info), { comp: beats(t, bpm) }); const ph = (t * bpm / 60) % 1; FX.rings(g, E.W * 0.45, E.H * 0.6, ph * 0.9, { count: 1, r0: 40, r1: 380, color: ui.gold, a: 0.7 * (1 - ph) }); notes(g, t, E.W * 0.7, E.H * 0.4, { count: 5, spread: 400 }); } });
registerShot('s137', { draw(g, t, info) { const c = beats(t); faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam, { mood: 'interiorWarm' }), bgCam: { z: 1.6, x: 0, y: 200 }, outfit: LEO, expr: 'determined', face: { mouth: 'flat', sweat: true }, side: -1, dy: c * 18, noBlink: true, zoom: 0.03 }); label(g, t, 'ARMS BURN', E.W * 0.78, E.H * 0.24, 0.2, { size: V(52, 52), color: S().ui.accent }); } });
registerShot('s138', { draw(g, t, info) { floorScene(g, t, push(t, info, { z0: 1.25, z1: 1.3, x0: -120, x1: -110, y0: 110, y1: 112 }), { comp: beats(t), clockSpeed: 240 }); } });
registerShot('s139', { draw(g, t, info) { floorScene(g, t, push(t, info, { z0: 1.15, z1: 1.2, x0: -120, x1: -110, y0: 90, y1: 92 }), { comp: beats(t), sirens: true, leoFace: { sweat: true } }); label(g, t, '9 MINUTES LATER', E.W / 2, V(150, 240), 0.1, { size: V(48, 48), color: S().ui.cream }); } });
function defib(g, x, y, s = 1) { rr(g, x - 80 * s, y - 60 * s, 160 * s, 60 * s, 10 * s); g.fillStyle = '#e8e2d8'; g.fill(); rr(g, x - 60 * s, y - 50 * s, 60 * s, 30 * s, 4 * s); g.fillStyle = '#1a2a24'; g.fill(); ecg(g, x - 58 * s, y - 34 * s, 56 * s, 10 * s, 0, '#5fd39a'); circle(g, x + 40 * s, y - 34 * s, 12 * s, '#e04a3a'); }
registerShot('s140', { draw(g, t, info) {
  floorScene(g, t, push(t, info, { z0: 1.3, z1: 1.36, x0: -80, x1: -70, y0: 130, y1: 132 }), { leoX: E.W * 0.78, leoPose: breathe(POSES.sad, t), leoExpr: 'worried', sirens: true, extra: (g, GY, s, cx) => {
    drawFigure(g, { x: cx + 70 * s, y: GY, s, facing: -1, outfit: MEDIC, pose: { ...CPR_UP, eF: [44, -90], hF: [60, -60] }, expr: 'determined', rim: rimOf(mood('interiorWarm'), [-0.6, -0.8]) });
    drawFigure(g, { x: cx - 260, y: GY, s, facing: 1, outfit: MEDIC, pose: POSES.kneel, expr: 'determined', rim: rimOf(mood('interiorWarm'), [-0.6, -0.8]) }); defib(g, cx - 150, GY, 1.2); seg(g, [[cx - 150, GY - 70], [cx - 40, GY - 30]], 3, '#2a2a34'); } });
} });
function monitor(g, t, info, beatAt) {
  insertBg(g, t, (g2, tt) => kitchen(g2, tt, { z: 1.6, x: 0, y: 200 }, { mood: 'interiorWarm' }), null, 0.5);
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }); layer(g, cam, 1, (g) => { const w = V(1100, 860), h = w * 0.5, x = (E.W - w) / 2, y = (E.H - h) / 2; rr(g, x - 24, y - 24, w + 48, h + 48, 20); g.fillStyle = '#e8e2d8'; g.fill(); g.fillStyle = '#081410'; g.fillRect(x, y, w, h);
    const on = beatAt != null && t > beatAt; g.strokeStyle = '#5fd39a'; g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= 200; i++) { const u = i / 200, px = x + 20 + u * (w - 40); let v = 0; if (on) { const ph = ((u * 3 - (t - beatAt) * 1.4) % 1 + 1) % 1; v = ph < 0.04 ? -ph * 6 : ph < 0.08 ? (ph - 0.04) * 30 - 0.24 : ph < 0.12 ? 1 - (ph - 0.08) * 30 : 0; } i ? g.lineTo(px, y + h * 0.6 - v * h * 0.4) : g.moveTo(px, y + h * 0.6); } g.stroke();
    glow(g, x + w / 2, y + h / 2, w * 0.6, '#5fd39a', on ? 0.25 : 0.06); if (on) { heartIcon(g, x + w - 90, y + 70, 0.8 * (1 + 0.2 * Math.max(0, Math.sin((t - beatAt) * 6))), '#5fd39a'); text(g, 'BPM 62', x + w - 200, y + 70, { size: 34, color: '#5fd39a', font: FONTS.ui, weight: 900 }); } });
}
registerShot('s141', { draw(g, t, info) { monitor(g, t, info, wt(info, 'beep', 0.9) - 0.05); } });
registerShot('s142', { draw(g, t, info) { monitor(g, t, info, -1); label(g, t, 'A HEARTBEAT', E.W / 2, E.H * 0.88, 0.1, { size: V(52, 52), color: '#5fd39a' }); } });
registerShot('s143', { draw(g, t, info) { faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => kitchen(g2, tt, cam, { mood: 'interiorWarm' }), bgCam: { z: 1.6, x: -200, y: -150 }, outfit: MEDIC, expr: 'surprised', talk: () => talk(info), side: 1, dx: V(200, 0), seed: 3 }); } });
registerShot('s144', { draw(g, t, info) {
  const k = KX(); kitchenScene(g, t, push(t, info, { z0: 1.55, z1: 1.6, x0: 200, x1: 210, y0: 170, y1: 172 }), { gp: false, table: false, leoX: E.W / 2 + V(180, 120), leoPose: breathe(POSES.sad, t), leoExpr: 'smile', leoTalk: talk(info) });
  notes(g, t, E.W * 0.3, E.H * 0.5, { count: 5, spread: 400, a: 0.7 });
} });

// ---------- the hospital ----------
function ward(g, t, cam, o = {}) {
  const { GY, M } = hospital(g, t, cam), warm = mood('interiorWarm'), rim = rimOf(warm, [-0.6, -0.8]), bx = E.W / 2 - V(80, 40);
  layer(g, cam, 1, (g) => { const bed = hospitalBed(g, bx, GY);
    drawFigure(g, { x: bx - 60, y: bed.top + 72 * 1.2, s: 1.2, facing: 1, outfit: GRANDPA, pose: o.gpPose || breathe(POSES.sitBack, t, 0.5), expr: o.gpExpr || 'smile', talk: o.gpTalk || 0, face: o.gpFace, rim, shadow: false, blink: blinkAt(t, 3.6) });
    const cx = bx + V(420, 300); g.save(); g.translate(cx, 0); g.scale(-1, 1); FX.chair(g, -18 * 1.25, GY, 1.25, '#3a3448'); g.restore();
    drawFigure(g, { x: cx, y: GY, s: 1.25, facing: -1, outfit: LEO, pose: o.leoPose || breathe(POSES.sit, t, 1, 2), expr: o.leoExpr || 'smile', talk: o.leoTalk || 0, rim, shadow: false, blink: blinkAt(t, 3.2) });
    o.extra?.(g, GY);
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  return { GY, M };
}
registerShot('s145', { draw(g, t, info) { ward(g, t, push(t, info, { z0: 1.0, z1: 1.07, x0: -30, x1: 10, y0: 40, y1: 50 })); label(g, t, 'THE NEXT DAY', E.W / 2, V(150, 240), 0.2, { size: V(46, 46), color: S().ui.cream }); } });
const gpBedFace = (info, o) => ({ M: mood('interiorWarm'), bg: (g2, tt, cam) => hospital(g2, tt, cam), bgCam: { z: 1.5, x: -300, y: -150 }, outfit: GRANDPA, side: -1, dx: -V(160, 0), seed: 2, ...o });
registerShot('s146', { draw(g, t, info) { faceShot(g, t, info, gpBedFace(info, { expr: 'smile', talk: () => talk(info) })); } });
const wardCam = (t, info, x) => push(t, info, { z0: 1.5, z1: 1.55, x0: x, x1: x + 10, y0: 160, y1: 162 });
registerShot('s147', { draw(g, t, info) { ward(g, t, wardCam(t, info, 200), { leoTalk: talk(info), leoExpr: 'smile' }); } });
registerShot('s148', { draw(g, t, info) { ward(g, t, wardCam(t, info, -80), { gpTalk: talk(info), gpExpr: 'smile' }); } });
registerShot('s149', { draw(g, t, info) {
  const M = mood('interiorWarm'); insertBg(g, t, (g2, tt) => hospital(g2, tt, { z: 1.8, x: -200, y: 100 }), null, 0.35);
  const sq = 1 - 0.06 * Math.max(0, Math.sin((t - 0.6) * 6)) * prog(t, 0.5, 0.7), ink = S().ink, cam = push(t, info, { z0: 1.0, z1: 1.05 });
  layer(g, cam, 1, (g) => { seg(g, [[E.W * 0.36, E.H * 0.56], [-200, E.H * 0.9]], 80, ink); seg(g, [[E.W * 0.2, E.H * 0.66], [-300, E.H * 1.0]], 110, GRANDPA.color); circle(g, E.W * 0.4, E.H * 0.54, 60, ink);
    seg(g, [[E.W * 0.5, E.H * 0.5], [E.W + 200, E.H * 0.85]], 80, ink); seg(g, [[E.W * 0.66, E.H * 0.6], [E.W + 300, E.H * 0.95]], 110, LEO.color); g.save(); g.translate(E.W * 0.45, E.H * 0.53); g.scale(sq, sq); rr(g, -80, -50, 160, 100, 50); g.fillStyle = ink; g.fill(); seg(g, [[-70, -44], [70, -44]], 4, alpha('#ffc68a', 0.6)); g.restore(); glow(g, E.W * 0.45, E.H * 0.53, 260, '#ffd59a', 0.2); });
} });
registerShot('s150', { draw(g, t, info) { ward(g, t, wardCam(t, info, 200), { leoTalk: talk(info), leoExpr: 'happy' }); } });
registerShot('s151', { draw(g, t, info) {
  const tW = 0.2, wink = t > tW && t < tW + 0.5;
  faceShot(g, t, info, gpBedFace(info, { expr: 'smile', talk: () => talk(info, 'told', 'you'), noBlink: true, front: (g, tt, cx, cy, r) => { if (!wink) return; const ex = cx + r * 0.34, ey = cy - r * 0.16; circle(g, ex, ey, r * 0.3, S().ink); seg(g, [[ex - r * 0.16, ey + r * 0.02], [ex + r * 0.16, ey - r * 0.04]], r * 0.08, S().feature); } }));
} });
registerShot('s152', { draw(g, t, info) {
  ward(g, t, push(t, info, { z0: 1.3, z1: 1.5, x0: 40, x1: 60, y0: 120, y1: 150 }), { gpExpr: 'happy', leoExpr: 'happy', leoPose: breathe({ ...POSES.sit, eF: [-20, -120], hF: [-50, -128] }, t) });
  FX.godRays(g, E.W * 0.12, E.H * 0.1, { count: 9, angle: Math.PI * 0.25, spread: 0.8, len: 1800, a: 0.07, color: '#ffd59a', t }); FX.dust(g, t, { count: 60, color: '#ffe2bd', a: 0.45, speed: 3 });
  const ui = S().ui; label(g, t, 'A SECOND IS PLENTY.', E.W / 2, E.H * 0.24, 0.2, { size: V(56, 52), font: FONTS.title }); label(g, t, 'NOT ALONE', E.W / 2, E.H * 0.82, wt(info, 'alone', 4.4) - 0.1, { size: V(52, 50), color: ui.cream, font: FONTS.title });
} });

// ---------- the stranger ----------
registerShot('s153', { draw(g, t, info) {
  const tB = wt(info, 'breath', 1.4), k = ease.inOut(prog(t, tB, tB + 0.6));
  const r = bedroom(g, k > 0.5 ? tB : t, push(t, info, { z0: 1.3, z1: 1.36, x0: 160, x1: 170, y0: 100, y1: 105 }), { mood: 'night', doorGlow: 0.2 });
  layer(g, push(t, info, { z0: 1.3, z1: 1.36, x0: 160, x1: 170, y0: 100, y1: 105 }), 1, (g) => drawFigure(g, { x: E.W / 2 + V(330, 220), y: r.GY - 96 + 86 * 1.15, s: 1.15, facing: -1, outfit: LEO, pose: POSES.lie, rot: Math.PI / 2, expr: 'sleepy', face: k > 0.3 ? { ...HELD, eyes: 'dot' } : null, rim: rimOf(r.M, [-0.6, -0.8]), shadow: false, blink: false }));
  slowTint(g, 0.35 * k); if (k > 0.5) FX.drops(g, t, { count: 30, rMax: 4, drift: 1 });
} });
function eyePic(g, t, draw) { backdrop(g, ['#05070f', '#0b1222']); const cx = E.W / 2, cy = E.H / 2, w = V(1500, 900), h = V(640, 560); g.save(); g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, cy - h, cx + w / 2, cy); g.quadraticCurveTo(cx, cy + h, cx - w / 2, cy); g.closePath(); g.clip(); draw(g); slowTint(g, 0.3); g.restore(); g.strokeStyle = alpha('#cfe0ff', 0.5); g.lineWidth = 4; g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, cy - h, cx + w / 2, cy); g.quadraticCurveTo(cx, cy + h, cx - w / 2, cy); g.stroke(); }
registerShot('s154', { draw(g, t, info) {
  const tM = wt(info, 'moves', 2.6) - 0.1;
  eyePic(g, t, (g) => { const r = bedroom(g, 0, { z: 1.2 }, { mood: 'night', doorGlow: 0.2 }); const mx = t > tM ? lerp(0, 120, ease.inOut(prog(t, tM, info.dur))) : 0; layer(g, { z: 1.2 }, 1, (g) => drawFigure(g, { x: r.doorX + 95 + mx, y: r.GY, s: 1.2, facing: -1, outfit: STRANGER, pose: POSES.stand, expr: 'neutral', rim: { color: '#8fb8e8', dir: [-0.6, -0.8] }, alpha: 0.35 + 0.5 * prog(t, tM - 0.4, tM + 0.4) })); });
  label(g, t, 'SOMETHING MOVES', E.W / 2, E.H * 0.84, tM, { size: V(48, 48), color: S().ui.accent });
} });
registerShot('s155', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.45, y0: 150, y1: 170 }), r = voidSpace(g, t * 0.3, cam), turn = t > 0.6;
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2, y: r.GY, s: 1.4, facing: turn ? -1 : 1, outfit: STRANGER, pose: POSES.stand, expr: 'neutral', rim: { color: '#8fb8e8', dir: [0, -1] }, blink: false }); if (turn) { const [hx, hy] = headPos({ x: E.W / 2, y: r.GY, s: 1.4, facing: -1, pose: POSES.stand }); FX.sparkle(g, hx - 10, hy - 8, 26 * prog(t, 0.6, 0.9), '#9fe8ff', 0.9); } });
  slowTint(g, 0.3);
} });

// ---------- is any of this real ----------
const realTag = (g, t, at) => { const k = popIn(t, at); if (k <= 0) return; g.save(); g.translate(E.W - V(260, 200), V(130, 200)); g.scale(k, k); rr(g, -110, -36, 220, 72, 36); g.fillStyle = alpha(S().ui.good, 0.2); g.fill(); g.strokeStyle = S().ui.good; g.lineWidth = 4; g.stroke(); text(g, 'REAL', 0, 2, { size: 40, color: S().ui.good, font: FONTS.title, weight: 700, spacing: 4 }); g.restore(); };
registerShot('s156', { draw(g, t, info) { UI.blueprint(g); UI.bigLine(g, t, { str: 'IS ANY OF THIS REAL?', dur: info.dur + 0.4, size: V(100, 84) }); } });
registerShot('s157', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui; UI.lineFigure(g, { x: E.W * 0.32, y: E.H * 0.8, s: 1.5, pose: POSES.handsOnHead, color: c });
  FX.clock(g, E.W * 0.66, E.H * 0.42, V(150, 130), 3 * 3600 + t * 0.3, { face: '#e8eef8' }); label(g, t, 'TIME SLOWS DOWN?', E.W * 0.66, E.H * 0.78, wt(info, 'slowed', 1.4) - 0.1, { size: V(52, 50), color: ui.cream });
} });
registerShot('s158', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui;
  label(g, t, '2007', E.W / 2, E.H * 0.34, 0.1, { size: V(130, 110), font: FONTS.title }); label(g, t, 'NEUROSCIENTIST', E.W / 2, E.H * 0.56, wt(info, 'neuroscientist', 1.4) - 0.1, { size: V(36, 36), color: UI.bpStroke() });
  label(g, t, 'DAVID EAGLEMAN', E.W / 2, E.H * 0.66, wt(info, 'david', 2.2) - 0.1, { size: V(64, 60), color: ui.cream, font: FONTS.title });
} });
function wrist(g, x, y, s, digits, c) { rr(g, x - 60 * s, y - 40 * s, 120 * s, 80 * s, 14 * s); g.fillStyle = '#0a1420'; g.fill(); g.strokeStyle = c; g.lineWidth = 3; g.stroke(); text(g, digits, x, y + 2, { size: 44 * s, color: c, font: FONTS.ui, weight: 900 }); }
registerShot('s159', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, tx = E.W * 0.34, top = E.H * 0.12, bot = E.H * 0.82, f = ease.in(prog(t, 1.0, 3.6));
  seg(g, [[tx - 80, top], [tx - 80, bot], [tx + 20, bot]], 4, alpha(c, 0.5)); for (let y = top; y < bot; y += 50) seg(g, [[tx - 80, y], [tx - 40, y]], 2, alpha(c, 0.4)); seg(g, [[tx - 120, top], [tx + 60, top]], 5, c);
  g.strokeStyle = c; g.lineWidth = 3; g.beginPath(); g.moveTo(tx + 60, bot - 30); g.quadraticCurveTo(tx + 220, bot + 30 * (f >= 1 ? 1.6 : 1), tx + 380, bot - 30); g.stroke(); text(g, 'NET', tx + 220, bot + 50, { size: 26, color: c, font: FONTS.ui, weight: 900 });
  const fy = lerp(top + 30, bot - 40, f); UI.lineFigure(g, { x: tx + 220, y: fy + 120, s: 0.6, pose: POSES.fall, color: ui.gold });
  wrist(g, tx + 420, fy - 40, 0.8, String(Math.floor(t * 47) % 10) + String(Math.floor(t * 31) % 10), ui.gold);
  UI.dimension(g, t, { x1: E.W * 0.72, y1: top, x2: E.W * 0.72, y2: bot, str: '30 m', start: wt(info, 'thirty', 1.0) - 0.1 });
  label(g, t, 'NUMBERS FLASH TOO FAST', E.W * 0.72, E.H * 0.9, wt(info, 'flash', 4.0) - 0.1, { size: V(32, 32), color: ui.cream });
} });
registerShot('s160', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui, d = String(Math.floor(t * 61) % 10) + String(Math.floor(t * 37 + 3) % 10); g.save(); g.translate(E.W / 2, E.H * 0.48); wrist(g, 0, 0, 3.4, d, ui.gold); g.restore(); label(g, t, 'IF TIME SLOWED: READABLE?', E.W / 2, E.H * 0.84, 0.3, { size: V(46, 46), color: ui.cream }); } });
registerShot('s161', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui, k = popIn(t, 0.05, 0.25); g.save(); g.translate(E.W / 2, E.H * 0.48); g.scale(k, k); seg(g, [[-160, -160], [160, 160]], 28, ui.accent); seg(g, [[160, -160], [-160, 160]], 28, ui.accent); g.restore(); label(g, t, 'THEY COULDN’T', E.W / 2, E.H * 0.86, 0.1, { size: V(52, 52), color: ui.accent }); } });
registerShot('s162', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), tF = wt(info, 'frightening', 2.0) - 0.1;
  const row = (y, n, col, lab) => { for (let i = 0; i < n; i++) { const w = (E.W * 0.7) / n; rr(g, E.W * 0.15 + i * w + 2, y - 40, w - 4, 80, 6); g.fillStyle = alpha(col, 0.25 + 0.1 * (i % 2)); g.fill(); } text(g, lab, E.W * 0.15, y - 70, { size: V(32, 32), color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); };
  row(E.H * 0.36, 6, c, 'NORMAL MOMENT: FEW MEMORIES'); const n = Math.round(6 + 34 * ease.out(prog(t, 0.6, 2.4))); row(E.H * 0.62, n, ui.gold, 'SCARY MOMENT: RECORDED IN DETAIL');
  label(g, t, 'FEELS LONGER AFTERWARD', E.W / 2, E.H * 0.86, tF + 1.5, { size: V(52, 52), color: ui.cream });
} });
registerShot('s163', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; heartIcon(g, E.W / 2, E.H * 0.46, 2.4, ui.accent); label(g, t, 'CPR', E.W / 2, E.H * 0.46, 0.2, { size: V(80, 76), color: '#ffffff', font: FONTS.title }); realTag(g, t, wt(info, 'real', 1.6) - 0.1); } });
registerShot('s164', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke();
  const steps = [['NOT BREATHING NORMALLY?', 'breathing'], ['CALL EMERGENCY SERVICES', 'call'], ['PUSH HARD AND FAST', 'push'], ['CENTRE OF THE CHEST', 'center']];
  steps.forEach(([s, w], i) => { const at = wt(info, w, 0.5 + i * 1.5) - 0.1, k = popIn(t, at); if (k <= 0) return; const y = E.H * (0.24 + i * 0.17); g.save(); g.translate(E.W * 0.2, y); g.scale(k, k); circle(g, 0, 0, 38, i === 0 ? ui.accent : ui.gold); text(g, String(i + 1), 0, 2, { size: 40, color: ui.bpBg, font: FONTS.title, weight: 700 }); g.restore(); text(g, s, E.W * 0.2 + 80, y, { size: V(50, 42), color: i === 0 ? ui.cream : c, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(k) }); });
} });

// ---------- ending ----------
registerShot('s165', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, z1: 1.66, x0: 60, x1: 90, y0: 140, y1: 160 }); const r = bedroom(g, t, cam, { mood: 'night' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(40, 120), y: r.GY, s: 1.3, facing: 1, outfit: LEO, pose: breathe({ ...POSES.relaxed, head: [8, -210] }, t), expr: 'thinking', look: [0.6, -0.6], rim: { color: '#c9d4ff', dir: [0.3, -1], w: 5 } }));
  FX.dust(g, t, { count: 40, color: '#c9d4ff', a: 0.3 });
} });
registerShot('s166', { draw(g, t, info) {
  const M = mood('dusk');
  UI.endScreen(g, t, { question: 'Could a brain ever stretch a second?', cast: CAST, moodColors: [shade(M.dark, -0.3), M.dark, shade(M.wall, -0.2)], rim: M.rim });
  label(g, t, 'SUBSCRIBE FOR PART TWO', E.W / 2, V(420, 700), wt(info, 'part', 7.0) - 0.6, { size: V(40, 44), color: S().ui.gold });
  FX.dust(g, t, { count: 40, a: 0.3 });
} });
