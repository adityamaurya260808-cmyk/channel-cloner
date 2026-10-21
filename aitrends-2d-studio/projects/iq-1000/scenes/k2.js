// k2.js: Part 2 staging kit: the rainy street with Nova + bus, the two-minds void, faces, countdown numbers, icons.
import { E, V, S, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, faceShot, slowTint, popIn, label, blinkAt, rimOf } from './lib.js';
import { rainStreet, rainDrops, bus, bike, RIDE } from './sets/street2.js';
import { voidSpace } from './sets/extra.js';
import { LEO, NOVA, STRANGER } from './cast.js';

export const NS = 1.15;                                 // figure scale on the street
export const ST = () => ({ nova: E.W / 2 + V(160, 120), leo: E.W / 2 - V(330, 220), bus0: E.W + 900 });
const RAINRIM = { color: '#9fc4ff', dir: [0.6, -0.8] };

// Nova riding: bike + rider + backpack. lean > 0 leans her back (braking). hair: 0..1 lift.
export function rider(g, x, y, o = {}) {
  const s = o.s ?? NS, f = o.facing ?? 1, lean = o.lean || 0;
  bike(g, x, y, s, { facing: f, wheelRot: o.wheelRot || 0 });
  const p = { ...RIDE };
  if (lean) for (const k of ['head', 'sh', 'eF', 'eB']) p[k] = [p[k][0] - lean * 34, p[k][1] + lean * 6];
  if (lean) { p.hF = [p.hF[0] - lean * 6, p.hF[1]]; p.hB = [p.hB[0] - lean * 6, p.hB[1]]; }
  drawFigure(g, { x, y, s, facing: f, outfit: NOVA, pose: o.pose || p, expr: o.expr || 'neutral', look: o.look, rim: o.rim || RAINRIM, blink: o.blink ?? false, shadow: false });
  // backpack on her back
  const bx = x + f * (p.sh[0] - 26 - lean * 4) * s, by = y + (p.sh[1] + 26) * s;
  g.save(); g.translate(bx, by); g.rotate(-0.25 * f - lean * 0.2 * f); rr(g, -22 * s, -30 * s, 40 * s, 58 * s, 10 * s); g.fillStyle = '#e0a23a'; g.fill(); g.fillStyle = shade('#e0a23a', -0.3); g.fillRect(-22 * s, 6 * s, 40 * s, 8 * s); g.restore();
  if (o.hair) { g.strokeStyle = S().ink; g.lineWidth = 12 * s; g.lineCap = 'round'; const hx = x + f * p.head[0] * s, hy = y + p.head[1] * s; g.beginPath(); g.moveTo(hx - f * 20 * s, hy - 10 * s); g.quadraticCurveTo(hx - f * 60 * s, hy - 40 * s * o.hair, hx - f * 90 * s, hy - 60 * s * o.hair); g.stroke(); }
  return { bx, by, head: [x + f * p.head[0] * s, y + p.head[1] * s] };
}

// the street: o.frozen, o.busX (null = no bus), o.nova {x, lean, ...} or false, o.leo {x, pose, expr, facing} or false
export function streetScene(g, t, cam, o = {}) {
  const k = ST(), fr = !!o.frozen;
  const r = rainStreet(g, fr ? 0 : t, cam, { frozen: fr, rain: o.rain, onRoad: (g, r) => {
    o.behind?.(g, r);
    if (o.busX != null) bus(g, o.busX, r.laneY + V(70, 60), o.busS ?? 0.9, { facing: -1, blur: o.busBlur || 0, shout: o.shout, driver: true });
  } });
  const out = { ...r, k };
  layer(g, cam, 1, (g) => {
    FX.pool(g, k.nova - 300, r.GY + 60, 500, 40, '#ffe6b0', 0.12);
    o.under?.(g, r);
    if (o.leo !== false) { const L = o.leo || {}; drawFigure(g, { x: L.x ?? k.leo, y: r.GY + (L.dy || 0), s: NS, facing: L.facing ?? 1, outfit: { ...LEO, head: L.hood ? 'hood' : 'curly' }, pose: L.pose || POSES.relaxed, expr: L.expr || 'neutral', look: L.look, rim: RAINRIM, blink: fr ? false : blinkAt(t, 3.2), talk: L.talk || 0 }); }
    if (o.nova !== false) { const N = o.nova || {}; out.nova = rider(g, N.x ?? k.nova, r.GY - 6, { ...N, s: NS }); }
    o.extra?.(g, r, out);
  });
  if (fr) { rainDrops(g, t, { count: 90 }); if (o.tint !== false) slowTint(g, o.tintA ?? 0.34); }
  return out;
}
// frozen moment of the near miss: bus a few metres from her wheel
export const frozenStreet = (g, t, cam, o = {}) => streetScene(g, t, cam, { frozen: true, busX: ST().nova + V(560, 420), shout: true, leo: { pose: { ...POSES.reach, eF: [30, -150], hF: [56, -150] }, expr: 'shocked', look: [1, 0] }, nova: { expr: 'scared', look: [1, 0] }, ...o });

// blurred street behind faces
export const streetBg = (frozen) => (g2, tt, cam) => (frozen ? frozenStreet(g2, 0, cam, { tint: false }) : streetScene(g2, tt, cam, { busX: null }));

export function leoFace(g, t, info, o = {}) {
  const r = faceShot(g, t, info, { M: mood('dusk'), bg: o.bg || streetBg(o.frozen), bgCam: o.bgCam || { z: 1.6, x: -200, y: 120 }, outfit: LEO, expr: o.expr || 'neutral', side: 1, dx: o.dx ?? V(-160, 0), look: o.look ?? [1, 0], noBlink: o.frozen || o.noBlink, zoom: o.zoom ?? 0.05, talk: o.talk, rimColor: o.rimColor || '#9fc4ff', face: o.face, front: o.front });
  if (o.frozen && o.tint !== false) { rainDrops(g, t, { count: 40, rMax: 9 }); slowTint(g, 0.32); }
  return r;
}
export function novaFace(g, t, info, o = {}) {
  const r = faceShot(g, t, info, { M: mood('dusk'), bg: o.bg || streetBg(o.frozen), bgCam: o.bgCam || { z: 1.6, x: 260, y: 120 }, outfit: NOVA, expr: o.expr || 'neutral', side: -1, dx: o.dx ?? V(160, 0), look: o.look ?? [-1, 0], noBlink: o.frozen || o.noBlink, zoom: o.zoom ?? 0.05, talk: o.talk, rimColor: o.rimColor || '#9fc4ff', face: o.face, front: o.front, tilt: o.tilt });
  if (o.frozen && o.tint !== false) { rainDrops(g, t, { count: 40, rMax: 9 }); slowTint(g, 0.32); }
  return r;
}

// ---------- the void of the frozen year: one or two minds ----------
export const VX = () => ({ leo: E.W / 2 - V(360, 220), nova: E.W / 2 + V(360, 220) });
export function mindVoid(g, t, cam, o = {}) {
  const r = voidSpace(g, t, cam, { color: o.color });
  const v = VX(), s = o.s ?? 1.05, hy = r.GY - 214 * s;
  const lx = o.leoX ?? v.leo, nx = o.novaX ?? v.nova;
  layer(g, cam, 1, (g) => {
    if (o.link) thoughtLink(g, t, [lx + 30, hy], [nx - 30, hy], { k: o.link });
    if (o.leo !== false) drawFigure(g, { x: lx, y: r.GY, s, facing: 1, outfit: LEO, pose: o.leoPose || POSES.stand, expr: o.leoExpr || 'awe', look: o.leoLook || [1, 0], rim: { color: '#cfe0ff', dir: [0.5, -1] }, blink: false, alpha: o.leoA });
    if (o.nova !== false) drawFigure(g, { x: nx, y: r.GY, s, facing: -1, outfit: NOVA, pose: o.novaPose || POSES.stand, expr: o.novaExpr || 'smile', look: o.novaLook || [-1, 0], rim: { color: '#cfe0ff', dir: [-0.5, -1] }, blink: false, alpha: o.novaA });
    o.extra?.(g, r, { lx, nx, hy, s });
  });
  return { ...r, lx, nx, hy };
}
export function thoughtLink(g, t, a, b, o = {}) { const c = o.color || S().ui.gold, k = o.k ?? 1; g.save(); g.globalCompositeOperation = 'lighter'; for (let j = 0; j < 3; j++) { g.strokeStyle = alpha(c, (0.55 - j * 0.14) * k); g.lineWidth = (4 - j) * 1.2; g.beginPath(); for (let i = 0; i <= 90; i++) { const u = i / 90, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) + Math.sin(u * 14 + t * 4 + j * 1.3) * 16 * Math.sin(u * Math.PI); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } for (let q = 0; q < 2; q++) { const p = (t * 0.45 + q * 0.5) % 1; glow(g, lerp(a[0], b[0], p), lerp(a[1], b[1], p), 46, c, 0.8 * k); } glow(g, a[0], a[1], 70, c, 0.4 * k); glow(g, b[0], b[1], 70, c, 0.4 * k); g.restore(); }
// gold ripple rings arriving at a point (a voice)
export const voiceRings = (g, t, x, y, o = {}) => FX.rings(g, x, y, t, { count: o.count ?? 3, r0: o.r0 ?? 40, r1: o.r1 ?? 340, speed: o.speed ?? 0.6, color: o.color || S().ui.gold, a: o.a ?? 0.5 });

// whispered line of dialogue in the void
export function whisper(g, t, str, o = {}) {
  const a = clamp(prog(t, o.at ?? 0.1, (o.at ?? 0.1) + 0.5)) * (o.dur ? clamp((o.dur - t) / 0.4) : 1); if (a <= 0) return;
  const size = o.size || V(88, 72), y = o.y ?? E.H / 2, c = o.color || S().ui.gold;
  g.save(); g.globalAlpha *= a; g.translate(o.x ?? E.W / 2, y); const sc = 1 + 0.03 * t; g.scale(sc, sc);
  text(g, str, 0, 0, { size, color: c, font: FONTS.serif, weight: 900, italic: true, spacing: 3, glow: 30, glowColor: alpha(c, 0.7) });
  g.restore();
}
// countdown numeral: big gold digit with a ring sweep
export function bigNum(g, t, n, o = {}) {
  const k = popIn(t, o.at ?? 0.0, 0.3), x = o.x ?? E.W / 2, y = o.y ?? E.H / 2, R = o.r ?? V(220, 200), c = o.color || S().ui.gold; if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k);
  g.globalAlpha *= 0.4; ring(g, 0, 0, R, 6, c); g.globalAlpha /= 0.4;
  const sw = clamp(t / (o.dur || 0.8)); g.strokeStyle = c; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, R, -Math.PI / 2, -Math.PI / 2 + sw * Math.PI * 2); g.stroke();
  text(g, String(n), 0, R * 0.08, { size: R * 1.25, color: c, font: FONTS.title, weight: 700, glow: 40, glowColor: alpha(c, 0.8) });
  g.restore();
}
// chapter banner (PLUS / MINUS / THE PRICE) top-left
export const chapter = (g, t, str, color, at = 0.15) => { const k = popIn(t, at); if (k <= 0) return; const w = Math.max(240, str.length * 34 + 80); g.save(); g.translate(V(110, 90) + w / 2, E.H * V(0.2, 0.16)); g.scale(k, k); rr(g, -w / 2, -42, w, 84, 42); g.fillStyle = alpha(color, 0.18); g.fill(); g.strokeStyle = color; g.lineWidth = 4; g.stroke(); text(g, str, 0, 2, { size: 48, color, font: FONTS.title, weight: 700, spacing: 4, glow: 16, glowColor: alpha(color, 0.6) }); g.restore(); };

// ---------- small icons / props ----------
export function bookIcon(g, x, y, s, c = '#e8d8b0') { g.save(); g.translate(x, y); g.scale(s, s); poly(g, [[-90, -50], [0, -30], [0, 60], [-90, 40]], c); poly(g, [[90, -50], [0, -30], [0, 60], [90, 40]], shade(c, -0.12)); for (let i = 0; i < 4; i++) { seg(g, [[-70, -24 + i * 16], [-14, -12 + i * 16]], 3, alpha('#5a4a3a', 0.5)); seg(g, [[70, -24 + i * 16], [14, -12 + i * 16]], 3, alpha('#5a4a3a', 0.5)); } seg(g, [[0, -30], [0, 60]], 4, '#5a4a3a'); g.restore(); }
export function noteIcon(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.beginPath(); g.ellipse(-30, 40, 26, 18, -0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse(50, 24, 26, 18, -0.4, 0, 7); g.fill(); seg(g, [[-6, 38], [-6, -60], [74, -76], [74, 22]], 10, c); seg(g, [[-6, -60], [74, -76]], 22, c); g.restore(); }
export function trafficLight(g, x, y, s, on = 'red') { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[0, 0], [0, -300]], 14, '#1a1820'); rr(g, -40, -470, 80, 190, 16); g.fillStyle = '#14121a'; g.fill(); const L = [['red', '#ff3a2a', -425], ['amber', '#ffb02a', -375], ['green', '#3ae07a', -325]]; for (const [n, c, ly] of L) { circle(g, 0, ly, 20, n === on ? c : shade(c, -0.75)); if (n === on) glow(g, 0, ly, 120, c, 0.8); } g.restore(); }
export function soupBowl(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#7ab83a'; g.beginPath(); g.ellipse(0, -40, 120, 26, 0, 0, 7); g.fill(); for (let i = 0; i < 5; i++) { const ph = (t * 0.8 + i * 0.37) % 1; circle(g, -70 + i * 35, -44 - ph * 20, 8 + ph * 8, alpha('#b8e86a', 1 - ph)); } g.fillStyle = '#e8e2da'; g.beginPath(); g.moveTo(-130, -40); g.quadraticCurveTo(-120, 50, 0, 54); g.quadraticCurveTo(120, 50, 130, -40); g.closePath(); g.fill(); g.fillStyle = '#c0443a'; g.fillRect(-120, -14, 240, 10); g.restore(); }
export function plate(g, x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = '#f4efe6'; g.beginPath(); g.ellipse(0, 0, 80, 22, 0, 0, 7); g.fill(); g.strokeStyle = '#4a7ac0'; g.lineWidth = 4; g.beginPath(); g.ellipse(0, 0, 60, 15, 0, 0, 7); g.stroke(); g.restore(); }
export function chessBoard(g, cx, cy, w, t, o = {}) { const n = 8, c = o.color || S().ui.gold; g.save(); g.translate(cx, cy); g.transform(1, 0, -0.5, 0.42, 0, 0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if ((i + j) % 2) { g.fillStyle = alpha(c, 0.28); g.fillRect(-w / 2 + i * w / n, -w / 2 + j * w / n, w / n, w / n); } } g.strokeStyle = alpha(c, 0.9); g.lineWidth = 3; g.strokeRect(-w / 2, -w / 2, w, w); g.restore(); glow(g, cx, cy, w * 0.6, c, 0.15); }
export function piece(g, x, y, s, c, king = false) { g.save(); g.translate(x, y); g.scale(s, s); poly(g, [[-26, 0], [26, 0], [16, -20], [-16, -20]], c); poly(g, [[-12, -20], [12, -20], [8, -70], [-8, -70]], c); circle(g, 0, -80, 18, c); if (king) { seg(g, [[0, -98], [0, -130]], 7, c); seg(g, [[-12, -116], [12, -116]], 7, c); } g.restore(); }
// blueprint cat pushing a cup off a table (k = 0..1 push progress, fall = 0..1)
export function catScene(g, t, x, y, s, k, fall) { const c = UI.bpStroke(); g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(-320, 0); g.lineTo(220, 0); g.moveTo(-280, 0); g.lineTo(-280, 260); g.moveTo(180, 0); g.lineTo(180, 260); g.stroke();
  g.beginPath(); g.ellipse(-120, -60, 90, 50, 0, 0, 7); g.stroke(); g.beginPath(); g.arc(-10, -110, 40, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-36, -140); g.lineTo(-30, -176); g.lineTo(-8, -150); g.moveTo(12, -150); g.lineTo(28, -176); g.lineTo(30, -140); g.stroke();
  g.beginPath(); g.moveTo(-200, -70); g.quadraticCurveTo(-300, -120, -250, -200); g.stroke(); const px = 30 + k * 60; g.beginPath(); g.moveTo(-40, -40); g.lineTo(px, -20 - k * 10); g.stroke(); g.beginPath(); g.moveTo(-160, -20); g.lineTo(-170, 0); g.moveTo(-80, -20); g.lineTo(-70, 0); g.stroke();
  const cx = 120 + k * 60 + fall * 80, cy = -30 + fall * fall * 280, rot = fall * 2.2; g.save(); g.translate(cx, cy); g.rotate(rot); g.beginPath(); g.moveTo(-26, -30); g.lineTo(26, -30); g.lineTo(20, 30); g.lineTo(-20, 30); g.closePath(); g.stroke(); g.beginPath(); g.arc(34, 0, 14, -1.4, 1.4); g.stroke(); g.restore();
  g.restore(); }
// two-pan balance: tilt -1 (left down) .. 1 (right down)
export function balance(g, t, cx, cy, s, tilt, L, R, o = {}) { const c = UI.bpStroke(), a = tilt * 0.28; g.save(); g.translate(cx, cy); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 6; g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 300); g.moveTo(-120, 300); g.lineTo(120, 300); g.stroke(); g.save(); g.rotate(a); g.beginPath(); g.moveTo(-380, 0); g.lineTo(380, 0); g.stroke(); g.restore();
  for (const [sd, str, col] of [[-1, L, o.lc || S().ui.blueprint], [1, R, o.rc || S().ui.gold]]) { const px = sd * 380 * Math.cos(a), py = sd * 380 * Math.sin(a); g.beginPath(); g.moveTo(px, py); g.lineTo(px - 90, py + 150); g.moveTo(px, py); g.lineTo(px + 90, py + 150); g.stroke(); g.beginPath(); g.moveTo(px - 120, py + 150); g.quadraticCurveTo(px, py + 210, px + 120, py + 150); g.closePath(); g.stroke(); text(g, str, px, py + 260, { size: 40, color: col, font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: alpha(col, 0.5) }); }
  circle(g, 0, 0, 14, c); g.restore(); }
// the older voice: a silhouette in trench and fedora, two gold glints in the glasses
export function stranger(g, t, x, y, s, o = {}) { drawFigure(g, { x, y, s, facing: o.facing ?? -1, outfit: STRANGER, pose: o.pose || POSES.relaxed, expr: 'neutral', rim: { color: o.rim || '#9a7aff', dir: [0, -1] }, blink: false, alpha: o.a ?? 1 }); if (o.glints) { const hx = x + (o.facing ?? -1) * 8 * s, hy = y - 208 * s; for (const d of [-1, 1]) glow(g, hx + d * 9 * s, hy, 26 * s, S().ui.gold, 0.9 * o.glints); } }
export { thoughtLink as link };

// ---------- park bench + night sky ----------
export function bench(g, x, y, s = 1, c = '#3a2a22') { g.save(); g.translate(x, y); g.scale(s, s); for (const dx of [-150, 150]) { seg(g, [[dx, 0], [dx, -60]], 10, '#1a1820'); } rr(g, -190, -72, 380, 16, 4); g.fillStyle = c; g.fill(); for (let i = 0; i < 3; i++) { rr(g, -190, -150 + i * 24, 380, 14, 4); g.fillStyle = shade(c, -0.1 * i); g.fill(); } seg(g, [[-170, -72], [-170, -150]], 8, '#1a1820'); seg(g, [[170, -72], [170, -150]], 8, '#1a1820'); g.restore(); }
export const SIT = { ...POSES.sit };
export function benchPair(g, t, GY, x, M, o = {}) {
  const s = o.s ?? 1.2; bench(g, x, GY, s);
  const rim = o.rim || rimOf(M, [-0.6, -0.8]);
  drawFigure(g, { x: x - 90 * s, y: GY - 6, s, facing: 1, outfit: LEO, pose: o.leoPose || breathe(POSES.sit, t), expr: o.leoExpr || 'smile', look: o.leoLook, rim, shadow: false, blink: blinkAt(t, 3.4), talk: o.leoTalk || 0, ink: o.ink });
  drawFigure(g, { x: x + 90 * s, y: GY - 6, s, facing: -1, outfit: NOVA, pose: o.novaPose || breathe(POSES.sit, t, 1, 1.3), expr: o.novaExpr || 'smile', look: o.novaLook, rim, shadow: false, blink: blinkAt(t, 3.9, 1), talk: o.novaTalk || 0, ink: o.ink });
}
export function skyScene(g, t, cam, o = {}) {
  const GY = E.H * V(0.8, 0.68), CX = E.W / 2;
  layer(g, cam, 0.05, (g) => { backdrop(g, ['#03040c', '#0a1030', '#1c2350']); FX.stars(g, t, { count: 260, area: [-E.W, -E.H, E.W * 3, E.H * 1.6] }); glow(g, CX + 400, GY - 700, 900, '#8fa8ff', 0.08); FX.moon(g, CX - 600, GY - 640, 46); });
  layer(g, cam, 0.4, (g) => { FX.hills(g, { y: GY - 90, amp: 60, color: '#0a0c1c', seed: 7 }); for (let i = 0; i < 8; i++) FX.tree(g, -600 + i * 420, GY - 80, 1.2 + (i % 2) * 0.4, '#070812'); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#06070f'; g.fillRect(-E.W, GY, E.W * 3, E.H * 2); });
  layer(g, cam, 1, (g) => { if (o.bench !== false) benchPair(g, t, GY, CX + (o.dx || 0), { rim: '#9fb8ff' }, { rim: { color: '#9fb8ff', dir: [0, -1] }, leoPose: { ...POSES.sitBack }, novaPose: { ...POSES.sitBack }, leoExpr: 'awe', novaExpr: 'smile', leoLook: [0.3, -1], novaLook: [-0.3, -1], ...o.pair }); o.extra?.(g, GY); });
  return { GY, CX };
}
export const voidBg = (color) => (g2, tt, cam) => voidSpace(g2, tt, cam, { color });
export function voidFace(g, t, info, outfit, o = {}) {
  const leo = outfit === LEO;
  return faceShot(g, t, info, { M: mood('dusk'), bg: o.bg || voidBg(o.color), bgCam: { z: 1.3, x: leo ? -200 : 200, y: 0 }, outfit, expr: o.expr || 'neutral', side: leo ? 1 : -1, dx: o.dx ?? (leo ? -V(180, 0) : V(180, 0)), look: o.look ?? (leo ? [1, 0] : [-1, 0]), noBlink: o.noBlink, zoom: o.zoom ?? 0.05, talk: o.talk, rimColor: o.rimColor || '#cfe0ff', face: o.face, front: o.front, tilt: o.tilt });
}
