// k3.js: Final Part staging kit: Sol in the void, the hospital corridor with the cast, faces, small diagrams.
import { E, V, S, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, faceShot, slowTint, popIn, label, blinkAt, rimOf } from './lib.js';
import { voidSpace, bigClock } from './sets/extra.js';
import { corridor, CR, vending, greenDoor } from './sets/corridor.js';
import { LEO, NOVA, GRANDPA, SOL, DOCTOR, STRANGER } from './cast.js';
import { thoughtLink, whisper, voiceRings } from './k2.js';

export const VIO = '#7a5ad8', VIOL = '#b8a8ff';
// Sol in the void: the trench-coat silhouette (fedora) with gold glints in his glasses
export const SOLV = { ...STRANGER };
export function solFig(g, x, y, s, o = {}) {
  drawFigure(g, { x, y, s, facing: o.facing ?? -1, outfit: SOLV, pose: o.pose || POSES.relaxed, expr: o.expr || 'neutral', rim: { color: o.rim || '#9a7aff', dir: [0, -1] }, blink: false, alpha: o.a ?? 1 });
  if (o.glints) { const hx = x + (o.facing ?? -1) * 8 * s, hy = y - 208 * s; for (const d of [-1, 1]) glow(g, hx + d * 9 * s, hy, 26 * s, S().ui.gold, 0.9 * o.glints); }
}
// three minds in the void. o.leo / o.nova / o.sol: false or {x, a, expr, pose}
export function threeVoid(g, t, cam, o = {}) {
  const r = voidSpace(g, t, cam, { color: o.color || VIO });
  const s = o.s ?? 1.0, CX = E.W / 2;
  const L = o.leo === false ? null : { x: CX - V(420, 260), ...(o.leo || {}) };
  const N = o.nova === false ? null : { x: CX + V(420, 260), ...(o.nova || {}) };
  const Z = o.sol === false ? null : { x: CX, ...(o.sol || {}) };
  layer(g, cam, 1, (g) => {
    const hy = r.GY - 214 * s;
    if (o.link && L && N) thoughtLink(g, t, [L.x + 30, hy], [N.x - 30, hy], { k: o.link, color: o.linkColor });
    if (o.vlink && L && Z) thoughtLink(g, t, [L.x + 30, hy], [Z.x - 20, hy], { k: o.vlink, color: VIOL });
    if (o.vlinkN && N && Z) thoughtLink(g, t, [Z.x + 20, hy], [N.x - 30, hy], { k: o.vlinkN, color: VIOL });
    if (Z) solFig(g, Z.x, r.GY, (Z.s ?? 1.1) * s, { glints: Z.glints, a: Z.a, facing: Z.facing ?? -1, pose: Z.pose });
    if (L) drawFigure(g, { x: L.x, y: r.GY, s, facing: 1, outfit: LEO, pose: L.pose || POSES.stand, expr: L.expr || 'neutral', face: L.face, look: L.look || [1, 0], rim: { color: '#cfe0ff', dir: [0.5, -1] }, blink: false, alpha: L.a });
    if (N) drawFigure(g, { x: N.x, y: r.GY, s, facing: -1, outfit: NOVA, pose: N.pose || POSES.stand, expr: N.expr || 'sad', look: N.look || [-1, 0], rim: { color: '#cfe0ff', dir: [-0.5, -1] }, blink: false, alpha: N.a });
    o.extra?.(g, r, { L, N, Z, hy });
  });
  return r;
}
export const vBg = (color) => (g2, tt, cam) => voidSpace(g2, tt, cam, { color: color || VIO });
// big faces in the void
export function face(g, t, info, outfit, o = {}) {
  const left = o.side === 'left' || (o.side == null && outfit === LEO);
  return faceShot(g, t, info, { M: mood('night'), bg: o.bg || vBg(o.color), bgCam: o.bgCam || { z: 1.3, x: left ? -200 : 200, y: 0 }, outfit, expr: o.expr || 'neutral', side: left ? 1 : -1, dx: o.dx ?? (left ? -V(180, 0) : V(180, 0)), look: o.look ?? (left ? [1, 0] : [-1, 0]), noBlink: o.noBlink, zoom: o.zoom ?? 0.05, talk: o.talk, rimColor: o.rimColor || '#cfe0ff', face: o.face, front: o.front, tilt: o.tilt, veil: o.veil });
}
// Sol face in the void: fedora silhouette close-up (dark, glints)
export function solClose(g, t, info, o = {}) {
  const cam = push(t, info, { z0: o.z0 ?? 2.5, z1: o.z1 ?? 2.6, y0: 74, y1: 74 }), r = voidSpace(g, t, cam, { color: VIO });
  layer(g, cam, 1, (g) => solFig(g, E.W / 2, r.GY, 1.1, { glints: o.glints ?? 0.6, pose: o.pose }));
  if (o.talk) FX.rings(g, E.W / 2, E.H * 0.45, t, { count: 2, r0: 140, r1: 420, speed: 0.6, color: VIOL, a: 0.2 * o.talk });
  veil(g, '#020205', o.veil ?? 0.25);
}
// violet ring clamping around the frozen clock
export function clampClock(g, t, info, k = 1) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06 }); voidSpace(g, t, cam, { color: VIO });
  layer(g, cam, 1, (g) => { bigClock(g, E.W / 2, E.H * 0.5, V(280, 240), 12.0, { face: '#e8e2da' });
    const R = V(280, 240) * lerp(1.8, 1.08, ease.out(k)); for (let i = 0; i < 3; i++) { g.strokeStyle = alpha(VIOL, 0.7 - i * 0.2); g.lineWidth = 16 - i * 4; g.beginPath(); g.arc(E.W / 2, E.H * 0.5, R + i * 18, 0, 7); g.stroke(); }
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + t * 0.2; glow(g, E.W / 2 + Math.cos(a) * R, E.H * 0.5 + Math.sin(a) * R, 50, VIOL, 0.5); } });
}

// ---------- the corridor with people ----------
// positions: grandpa, leo, nova near the vending machine side; Sol on the bench; doctor walks from the right
export const CP = () => { const k = CR(); return { ...k, gp: k.vend + V(250, 170), leo: k.vend + V(420, 280), nova: k.vend + V(-260, -170), sol: k.bench, doc0: E.W + 400 }; };
const SOL_SIT = { ...POSES.sit, eF: [16, -128], hF: [30, -112], eB: [10, -128], hB: [26, -110] };
export function ward(g, t, cam, o = {}) {
  const fr = !!o.frozen, k = CP();
  const r = corridor(fr ? g : g, fr ? 0 : t, cam, { canFall: o.canFall, wobble: o.wobble, canGlow: o.canGlow, doorGlow: o.doorGlow, flicker: o.flicker });
  const rim = { color: '#e8f6ff', dir: [0, -1] };
  layer(g, cam, 1, (g) => {
    if (o.sol !== false) { const S0 = o.sol || {}; drawFigure(g, { x: k.sol, y: r.GY - 22, s: 1.15, facing: -1, outfit: SOL, pose: S0.pose || SOL_SIT, expr: S0.expr || 'neutral', face: S0.face || { eyes: 'happy', mouth: 'flat', brows: null }, rim, blink: false, shadow: false, alpha: S0.a }); }
    if (o.gp !== false) { const G0 = o.gp || {}; drawFigure(g, { x: G0.x ?? k.gp, y: r.GY, s: 1.15, facing: G0.facing ?? -1, outfit: GRANDPA, pose: G0.pose || breathe(POSES.relaxed, t), expr: G0.expr || 'smile', look: G0.look, rim, blink: fr ? false : blinkAt(t, 3.4), talk: G0.talk || 0 }); }
    if (o.leo !== false) { const L0 = o.leo || {}; drawFigure(g, { x: L0.x ?? k.leo, y: r.GY, s: 1.15, facing: L0.facing ?? -1, outfit: LEO, pose: L0.pose || breathe(POSES.relaxed, t, 1, 2), expr: L0.expr || 'neutral', face: L0.face, look: L0.look, rim, blink: fr ? false : blinkAt(t, 3.1), talk: L0.talk || 0 }); }
    if (o.nova !== false) { const N0 = o.nova || {}; drawFigure(g, { x: N0.x ?? k.nova, y: r.GY, s: 1.15, facing: N0.facing ?? 1, outfit: NOVA, pose: N0.pose || breathe(POSES.relaxed, t, 1, 1.3), expr: N0.expr || 'neutral', face: N0.face, look: N0.look, rim, blink: fr ? false : blinkAt(t, 3.7, 1), talk: N0.talk || 0 }); }
    if (o.doc != null) { const D0 = typeof o.doc === 'number' ? { x: o.doc } : o.doc; drawFigure(g, { x: D0.x, y: r.GY, s: 1.15, facing: -1, outfit: DOCTOR, pose: D0.pose || (fr ? walkPose(0.6) : walkPose(t * 1.4 * Math.PI * 2)), expr: D0.expr || 'neutral', rim, blink: fr ? false : blinkAt(t, 3), talk: D0.talk || 0 }); }
    o.extra?.(g, r, k);
  });
  if (fr) { FX.drops(g, t, { count: 40, rMax: 5, drift: 1, color: '#cfe0ff' }); if (o.tint !== false) slowTint(g, o.tintA ?? 0.34); }
  return { ...r, k };
}
export const wardBg = (o = {}) => (g2, tt, cam) => ward(g2, tt, cam, o);
export function wface(g, t, info, outfit, o = {}) {
  const left = o.left ?? (outfit === LEO);
  const r = faceShot(g, t, info, { M: mood('interiorCool'), bg: o.bg || wardBg(o.frozen ? { frozen: true, tint: false } : {}), bgCam: o.bgCam || { z: 1.6, x: left ? -300 : 300, y: 100 }, outfit, expr: o.expr || 'neutral', side: left ? 1 : -1, dx: o.dx ?? (left ? -V(160, 0) : V(160, 0)), look: o.look ?? (left ? [1, 0] : [-1, 0]), noBlink: o.noBlink || o.frozen, zoom: o.zoom ?? 0.05, talk: o.talk, rimColor: o.rimColor || '#e8f6ff', face: o.face, front: o.front, tilt: o.tilt });
  if (o.frozen && o.tint !== false) { FX.drops(g, t, { count: 30, rMax: 7, drift: 1, color: '#cfe0ff' }); slowTint(g, 0.32); }
  return r;
}
// old Sol's face in the real world (no hat, glasses)
export const solReal = (g, t, info, o = {}) => wface(g, t, info, SOL, { left: false, expr: 'neutral', face: { eyes: 'happy', mouth: 'flat', brows: null, ...(o.face || {}) }, noBlink: true, ...o });

// small diagram helpers
export function heartbeat(g, x, y, s, t, beat = 0.9, c) { const k = 1 - ((t % beat) / beat); const sc = s * (1 + 0.12 * Math.pow(k, 3)); g.save(); g.translate(x, y); g.scale(sc, sc); g.fillStyle = c || S().ui.accent; g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-60, -10, -40, -60, 0, -30); g.bezierCurveTo(40, -60, 60, -10, 0, 30); g.fill(); g.restore(); }
export function bigCount(g, t, n, o = {}) { const ui = S().ui; text(g, typeof n === 'number' ? Math.round(n).toLocaleString('en-US') : n, o.x ?? E.W / 2, o.y ?? E.H * 0.48, { size: o.size || V(220, 160), color: o.color || ui.gold, font: FONTS.title, weight: 700, glow: 36, glowColor: alpha(o.color || ui.gold, 0.6) }); if (o.sub) label(g, t, o.sub, o.x ?? E.W / 2, (o.y ?? E.H * 0.48) + V(170, 140), o.subAt ?? 0.2, { size: V(50, 46), color: o.subColor || ui.cream }); }
export function frameProp(g, x, y, w, h, draw, a = 1) { g.save(); g.globalAlpha *= a; rr(g, x - w / 2 - 14, y - h / 2 - 14, w + 28, h + 28, 8); g.fillStyle = '#d8cfc0'; g.fill(); g.save(); g.beginPath(); g.rect(x - w / 2, y - h / 2, w, h); g.clip(); draw(g, x - w / 2, y - h / 2, w, h); g.restore(); g.restore(); }
export { whisper, voiceRings, thoughtLink };
