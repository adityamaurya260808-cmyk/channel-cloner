// p1kit.js: helpers carried over from Part 1 (kitchen staging, dance, frozen kitchen, breath-held face).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, label, stamp } from './lib.js';
import { kitchen, table, bedroom } from './sets/indoor.js';
import { voidSpace, recordPlayer, glassesProp, spoonProp, bigClock, notes } from './sets/extra.js';
import { LEO, GRANDPA } from './cast.js';

// ---------- shared kitchen staging (used again in later files) ----------
export const KX = () => ({ gp: E.W / 2 - V(260, 200), leo: E.W / 2 + V(260, 180), tableX: E.W / 2 + V(430, 300), rp: E.W / 2 - V(620, 380) });
const DANCE = [POSES.cheer, { ...POSES.point, eF: [34, -186], hF: [62, -214] }, POSES.shrug, { ...POSES.wave, kF: [16, -50], fF: [24, -6] }];
export function dance(t, bpm = 100) { const beat = 60 / bpm, i = Math.floor(t / beat), k = (t % beat) / beat; const a = DANCE[i % 4], b = DANCE[(i + 1) % 4]; const p = posesAt(k, [[0, a], [0.55, b]], 0.4); const bob = Math.abs(Math.sin(t * Math.PI / beat)) * 6; const q = { ...p }; for (const kk of ['head', 'sh', 'hip', 'eF', 'hF', 'eB', 'hB']) q[kk] = [p[kk][0], p[kk][1] + bob]; return q; }
export const GP_FALL = { ...POSES.fall, head: [-30, -186], sh: [-24, -156], eF: [20, -196], hF: [40, -226] };
export function kitchenScene(g, t, cam, o = {}) {
  const r = kitchen(g, o.frozen ? 0 : t, cam, { mood: 'interiorWarm', clockT: 15 * 3600 + 20 * 60, clockSpeed: o.frozen ? 0 : 1 });
  const { GY, M, counterTop } = r, k = KX(), s = o.s ?? 1.25, rim = rimOf(M, [-0.6, -0.8]);
  layer(g, cam, 1, (g) => {
    recordPlayer(g, k.rp, counterTop, 0.9, o.frozen ? 0 : t, !o.frozen, M);
    if (!o.frozen && o.notes !== false) notes(g, t, k.rp - 20, counterTop - 70, { count: 4, spread: 200, a: 0.8 });
    if (o.table !== false) { g.save(); g.translate(k.leo, 0); g.scale(-1, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore(); table(g, k.tableX, GY, 300); }
    if (o.gp !== false) drawFigure(g, { x: o.gpX ?? k.gp, y: GY + (o.gpDy || 0), s, facing: o.gpFacing ?? 1, outfit: GRANDPA, pose: o.gpPose || dance(t), rot: o.gpRot || 0, expr: o.gpExpr || 'joy', rim, blink: o.frozen ? false : blinkAt(t, 3.6), shadow: !o.gpRot });
    if (o.leo !== false) drawFigure(g, { x: o.leoX ?? k.leo, y: GY, s, facing: o.leoFacing ?? -1, outfit: LEO, pose: o.leoPose || breathe(POSES.sit, t, 1, 2), expr: o.leoExpr || 'smile', look: o.leoLook, rim, shadow: o.leoPose ? true : false, blink: o.frozen ? false : blinkAt(t, 3.2) });
    o.extra?.(g, r, s);
  });
  if (!o.frozen) FX.dust(g, t, { count: 45, color: '#ffe2bd', a: 0.3 }); else FX.drops(g, t, { count: 40, rMax: 5, drift: 1.5, color: '#cfe0ff' });
  return r;
}
// the frozen kitchen: Grandpa mid-fall, glasses and spoon hanging, blue tint
export function frozenKitchen(g, t, cam, o = {}) {
  const k = KX();
  const r = kitchenScene(g, t, cam, { frozen: true, gpPose: GP_FALL, gpRot: -0.35, gpExpr: 'surprised', leoPose: o.leoPose || { ...POSES.reach, eF: [30, -150], hF: [56, -150] }, leoExpr: o.leoExpr || 'shocked', leoLook: [-1, 0.2], table: o.table,
    extra: (g, r, s) => { glassesProp(g, k.gp - 40, r.GY - 300 * s, 0.7, 0.4); spoonProp(g, k.gp + 120, r.GY - 60, 0.8, 0.6); o.extra?.(g, r, s); } });
  if (o.tint !== false) slowTint(g, o.tintA ?? 0.32);
  return r;
}
export const yearBadge = (g, t, str = '1 SECOND = 1 YEAR', at = 0.3) => slowBadge(g, t, str, at);
// breath-held face override: tight mouth + puffed cheeks drawn on top
export const HELD = { mouth: 'smallFlat', brows: 'raised' };
export function cheeks(g, cx, cy, r, a = 1) { for (const s of [-1, 1]) { g.strokeStyle = alpha(S().ink, 1); g.lineWidth = r * 0.06; g.beginPath(); g.arc(cx + s * r * 0.92, cy + r * 0.3, r * 0.16 * a, s > 0 ? -1.2 : Math.PI - 1.2 + 2.4 - 2.4, s > 0 ? 1.2 : Math.PI + 1.2); g.stroke(); } }

export const chapter = (g, t, str, color, at = 0.2) => { const k = popIn(t, at); if (k <= 0) return; g.save(); g.translate(V(170, 140), V(120, 170)); g.scale(k, k); rr(g, -110, -40, 220, 80, 40); g.fillStyle = alpha(color, 0.18); g.fill(); g.strokeStyle = color; g.lineWidth = 4; g.stroke(); text(g, str, 0, 2, { size: 46, color, font: FONTS.title, weight: 700, spacing: 4, glow: 16, glowColor: alpha(color, 0.6) }); g.restore(); };
export function soft(g) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,200,140,.4)'; g.fillRect(0, 0, E.W, E.H); g.restore(); g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.rect(0, 0, E.W, E.H); g.ellipse(E.W / 2, E.H / 2, E.W * 0.62, E.H * 0.7, 0, 0, Math.PI * 2, true); g.fill('evenodd'); g.restore(); }
export function eyeView(g, t, drawPic, o = {}) {
  backdrop(g, ['#05070f', '#0b1222']); const cx = E.W / 2, cy = E.H / 2, w = V(1500, 900) * (o.s ?? 1), h = V(640, 560) * (o.s ?? 1);
  const path = () => { g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, cy - h, cx + w / 2, cy); g.quadraticCurveTo(cx, cy + h, cx - w / 2, cy); g.closePath(); };
  g.save(); path(); g.clip(); drawPic(g); slowTint(g, 0.25); g.restore(); g.strokeStyle = alpha('#cfe0ff', 0.5); g.lineWidth = 4; path(); g.stroke();
}
// thought link between two minds: a shimmering gold wave between two points
export function thoughtLink(g, t, a, b, o = {}) { const ui = S().ui, c = o.color || ui.gold, k = o.k ?? 1; g.save(); g.globalCompositeOperation = 'lighter'; for (let j = 0; j < 3; j++) { g.strokeStyle = alpha(c, (0.5 - j * 0.12) * k); g.lineWidth = 3 - j * 0.6; g.beginPath(); for (let i = 0; i <= 80; i++) { const u = i / 80, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) + Math.sin(u * 14 + t * 4 + j) * 14 * Math.sin(u * Math.PI); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } const p = (t * 0.4) % 1; glow(g, lerp(a[0], b[0], p), lerp(a[1], b[1], p), 40, c, 0.8 * k); g.restore(); }
