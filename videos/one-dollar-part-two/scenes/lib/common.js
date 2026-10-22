// lib/common.js — shared helpers for the shot templates.
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, talkAmount, rr, seg, circle, ring, poly, glow, alpha, shade, mix, linGrad, text, FONTS, measure, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { CAST } from '../cast.js';
import { bedroom, kitchen, street, factory, office, houseExt, kitchenTable, desk } from '../sets/places.js';
import { jar, pizza, teacup, coin, bill, car, note, pan } from '../sets/props.js';

export const who = (n) => (typeof n === 'string' ? CAST[n] : n) || CAST.SAM;
export const PLACES = { bedroom, kitchen, street, factory, office, houseExt, lair: (g, t, cam, o) => lair(g, t, cam, o) };
export const placeMood = (name, o = {}) => mood(o.mood || { bedroom: 'night', kitchen: 'interiorWarm', street: 'dusk', factory: 'interiorCool', office: 'interiorCool', houseExt: 'night', lair: 'night' }[name] || 'dusk');

// camera from params: cam:{z:[a,b], x:[a,b], y:[a,b], r, shake}
export function camAt(t, dur, c = {}) {
  const k = ease.inOut(clamp(t / dur)), v = (p, d) => (Array.isArray(p) ? lerp(p[0], p[1], k) : p ?? d);
  const cam = { z: v(c.z, lerp(1, 1.06, k)), x: v(c.x, lerp(0, -30, k)), y: v(c.y, 0), r: c.r ? c.r * Math.sin(t * 0.7) : 0 };
  if (c.shake) { cam.x += Math.sin(t * 41) * c.shake; cam.y += Math.cos(t * 37) * c.shake; }
  return cam;
}
// value keyed by time: [[t, v], ...] or plain v
export const at = (t, v, d) => (Array.isArray(v) && Array.isArray(v[0]) ? v.reduce((cur, [tt, vv]) => (t >= tt ? vv : cur), v[0][1]) : v ?? d);

// dark lair: Mr. Black / scam call centre — monitor glow, nearly black
export function lair(g, t, cam, o = {}) {
  const M = mood('night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, GY, ['#05060c', '#0b0d18']); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    for (let i = -4; i <= 4; i++) { const mx = CX + i * 300; FX.screen(g, { x: mx - 100, y: GY - 560, w: 200, h: 120, bg: '#071418', glowC: o.screen || '#3fd0c0', a: 0.18 }, (g, x, y, w, h) => { g.strokeStyle = alpha(o.screen || '#3fd0c0', 0.8); g.lineWidth = 3; g.beginPath(); for (let k = 0; k <= 20; k++) { const xx = x + (k / 20) * w, yy = y + h * 0.7 - Math.sin(k * 0.8 + i + t) * 14 - k * 2; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }); }
    FX.fog(g, GY - 300, 300, '#1a2a40', 0.2);
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, ['#0c0e18', '#040508']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); });
  return { GY, CX, M: { ...M, rim: o.rim || '#3fd0c0' } };
}

// ---- actor staging: actors:[{who, x, y, s, facing, pose|poses, expr|exprs, talk:[a,b], prop, hold, walk:{x1, speed, run}, rot, look, dim, blink}]
export function drawActors(g, t, info, base, actors, defS) {
  const out = [];
  for (const [i, a] of (actors || []).entries()) {
    const of = who(a.who), s = a.s ?? defS ?? 1.1, fac = a.facing ?? 1;
    let x = base.CX + (a.x ?? 0), y = base.GY + (a.y ?? 0), pose;
    if (a.walk) { const d = (a.walk.x1 - (a.x ?? 0)), sp = a.walk.speed ?? (a.walk.run ? 420 : 160) * s, T = Math.abs(d) / sp, tt = Math.min(t - (a.walk.t0 || 0), T); x = base.CX + (a.x ?? 0) + Math.sign(d) * sp * clamp(tt, 0, T); pose = t - (a.walk.t0 || 0) < T && t > (a.walk.t0 || 0) ? walkPose(t * 2 * Math.PI * (a.walk.run ? 1.6 : 0.9), { run: a.walk.run }) : posesAt(Math.max(0, t - (a.walk.t0 || 0) - T), a.poses || [[0, a.pose || 'stand']]); }
    else pose = breathe(posesAt(t, a.poses || [[0, a.pose || 'stand']]), t, 1, i * 1.7);
    const talk = a.talk ? talkAmount(info.globalT, info.shot.start + a.talk[0], info.shot.start + a.talk[1]) : 0;
    const expr = at(t, a.exprs ?? a.expr, 'neutral');
    const o = { x, y, s, facing: fac, outfit: of, pose, expr, talk, look: a.look, rot: a.rot, dim: a.dim, prop: a.prop, alpha: a.alpha, blink: (t + i * 1.3) % (3.1 + i * 0.4) > (3.0 + i * 0.4), rim: { color: a.rimColor || base.M.rim, dir: a.rimDir || info.rimDir || [0, -1], w: 4 }, shadow: a.shadow };
    drawFigure(g, o);
    const hand = [x + o.pose.hF[0] * fac * s * (of.kid ? 0.72 : 1), y + o.pose.hF[1] * s * (of.kid ? 0.72 : 1)];
    if (a.hold) holdItem(g, a.hold, hand, s, t, fac);
    if (talk > 0.05 || (a.talk && a.rings)) { const [hx, hy, hr] = headPos(o); FX.rings(g, hx + fac * hr * 0.6, hy, t, { count: 2, r0: hr * 1.3, r1: hr * 3, a: 0.35, color: base.M.rim }); }
    out.push({ o, hand, head: headPos(o) });
  }
  return out;
}
export function holdItem(g, h, [x, y], s, t, fac = 1) {
  const kind = typeof h === 'string' ? h : h.kind;
  if (kind === 'jar') jar(g, x + fac * 6 * s, y + 46 * s, 0.42 * s, { coins: h.coins ?? 1, bills: h.bills ?? 1, glow: h.glow ?? 0.6, note: h.note });
  if (kind === 'pizza') { g.save(); g.translate(x, y - 10 * s); g.rotate(-0.15 * fac); pizza(g, 0, 0, 0.6 * s); g.restore(); }
  if (kind === 'tea') teacup(g, x + 4 * fac * s, y + 6 * s, 0.9 * s, 1, t);
  if (kind === 'bigphone') { rr(g, x - 6 * s, y - 34 * s, 22 * s, 38 * s, 4 * s); g.fillStyle = '#0b0a10'; g.fill(); g.fillStyle = h.glow || '#9fd8ff'; g.fillRect(x - 3 * s, y - 31 * s, 16 * s, 31 * s); glow(g, x + 5 * s, y - 15 * s, 70 * s, h.glow || '#7fb6ff', 0.5); }
  if (kind === 'pan') pan(g, x + 30 * fac * s, y + 4 * s, 1.0 * s, (t * 0.8) % 1);
  if (kind === 'coin') coin(g, x + 6 * fac * s, y - 4 * s, 9 * s);
  if (kind === 'keys') { ring(g, x + 4 * s, y + 8 * s, 6 * s, 2 * s, '#d8d0c0'); seg(g, [[x + 4 * s, y + 14 * s], [x + 6 * s, y + 30 * s]], 4 * s, '#d8d0c0'); }
}

// ---- money maths (daily $1 at 10% a year) ----
export const acct = (y, perDay = 1) => (y <= 0 ? 0 : 365 * perDay * (Math.pow(1.1, y) - 1) / 0.1);
export const putIn = (y, perDay = 1) => 365 * perDay * y;
export const money = (v) => '$' + Math.round(v).toLocaleString('en-US');
export const kmoney = (v) => (v >= 1e6 ? '$' + (v / 1e6).toFixed(1) + 'M' : v >= 1000 ? '$' + Math.round(v / 1000) + 'K' : '$' + Math.round(v));

// ---- simple blueprint icons (line art in the blueprint colour, gold accents) ----
export function icon(g, kind, x, y, s = 1, o = {}) {
  const c = o.color || S().ui.blueprint, gold = S().ui.gold, w = 5 * s;
  g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 5; g.strokeStyle = c; g.lineCap = 'round'; g.lineJoin = 'round';
  const L = (pts) => { g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.stroke(); };
  switch (kind) {
    case 'brain': g.beginPath(); g.moveTo(-10, 60); g.bezierCurveTo(-90, 70, -110, -10, -70, -40); g.bezierCurveTo(-70, -90, -10, -90, 0, -60); g.bezierCurveTo(10, -90, 70, -90, 70, -40); g.bezierCurveTo(110, -10, 90, 70, 10, 60); g.stroke(); L([[0, -60], [0, 60]]); g.beginPath(); g.arc(-40, -10, 22, 0.5, 3.6); g.stroke(); g.beginPath(); g.arc(40, 10, 22, 3.6, 6.7); g.stroke(); break;
    case 'clock': g.beginPath(); g.arc(0, 0, 70, 0, 7); g.stroke(); L([[0, 0], [0, -48]]); L([[0, 0], [36, 14]]); break;
    case 'house': L([[-70, 60], [-70, -10], [0, -70], [70, -10], [70, 60], [-70, 60]]); L([[-20, 60], [-20, 10], [20, 10], [20, 60]]); break;
    case 'bank': L([[-80, 60], [80, 60]]); L([[-70, -20], [70, -20], [0, -70], [-70, -20]]); for (const xx of [-50, -17, 17, 50]) L([[xx, -10], [xx, 50]]); break;
    case 'phone': g.beginPath(); g.roundRect ? g.roundRect(-40, -75, 80, 150, 14) : g.rect(-40, -75, 80, 150); g.stroke(); L([[-10, 60], [10, 60]]); break;
    case 'cup': L([[-40, -40], [-32, 50], [32, 50], [40, -40], [-40, -40]]); g.beginPath(); g.arc(46, 0, 18, -1.4, 1.4); g.stroke(); for (const dx of [-14, 6]) L([[dx, -60], [dx + 6, -80], [dx, -100]]); break;
    case 'car': L([[-80, 30], [-80, 0], [-40, -10], [-20, -40], [40, -40], [60, -10], [80, 0], [80, 30], [-80, 30]]); g.beginPath(); g.arc(-45, 32, 16, 0, 7); g.stroke(); g.beginPath(); g.arc(45, 32, 16, 0, 7); g.stroke(); break;
    case 'pizza': L([[-60, -50], [60, -50], [0, 70], [-60, -50]]); g.beginPath(); g.arc(-10, -20, 10, 0, 7); g.stroke(); g.beginPath(); g.arc(14, 4, 9, 0, 7); g.stroke(); break;
    case 'tv': L([[-80, -50], [80, -50], [80, 40], [-80, 40], [-80, -50]]); L([[-30, 70], [30, 70]]); L([[0, 40], [0, 70]]); break;
    case 'shirt': L([[-30, -60], [-80, -30], [-60, 0], [-40, -10], [-40, 70], [40, 70], [40, -10], [60, 0], [80, -30], [30, -60], [0, -40], [-30, -60]]); break;
    case 'coin': circle(g, 0, 0, 60, gold); ring(g, 0, 0, 44, 5, shade(gold, -0.3)); text(g, '$', 0, 2, { size: 60, color: shade(gold, -0.35), font: FONTS.ui, weight: 900 }); break;
    case 'jar': jar(g, 0, 70, 0.9, { coins: o.coins ?? 8, glow: 0.6 }); break;
    case 'person': g.beginPath(); g.arc(0, -55, 20, 0, 7); g.stroke(); L([[0, -35], [0, 20]]); L([[0, 20], [-20, 70]]); L([[0, 20], [20, 70]]); L([[0, -20], [-26, 14]]); L([[0, -20], [26, 14]]); break;
    case 'check': L([[-50, 0], [-14, 40], [56, -46]]); break;
    case 'x': L([[-44, -44], [44, 44]]); L([[44, -44], [-44, 44]]); break;
    case 'shark': g.fillStyle = c; g.beginPath(); g.moveTo(-50, 30); g.quadraticCurveTo(-10, -10, 10, -80); g.quadraticCurveTo(30, -10, 60, 30); g.closePath(); g.fill(); break;
    case 'pig': g.beginPath(); g.ellipse(0, 0, 80, 56, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(78, 0, 18, 22, 0, 0, 7); g.stroke(); circle(g, 74, -4, 4, c); circle(g, 82, 4, 4, c); L([[-40, 50], [-40, 80]]); L([[40, 50], [40, 80]]); L([[-20, -50], [-34, -76], [-8, -56]]); g.beginPath(); g.arc(-90, -10, 14, 0, 4); g.stroke(); circle(g, 40, -16, 5, c); break;
    case 'lock': g.beginPath(); g.arc(0, -30, 34, Math.PI, 0); g.stroke(); L([[-50, -30], [50, -30], [50, 60], [-50, 60], [-50, -30]]); circle(g, 0, 14, 8, c); break;
    case 'wave': for (let i = -10; i <= 10; i++) { const hh = (Math.abs(Math.sin(i * 1.7)) * 0.7 + 0.3) * 70 * (1 - Math.abs(i) / 14); L([[i * 12, -hh], [i * 12, hh]]); } break;
    case 'chat': L([[-70, -50], [70, -50], [70, 30], [-20, 30], [-50, 60], [-40, 30], [-70, 30], [-70, -50]]); break;
    case 'alarm': g.beginPath(); g.arc(0, 0, 60, 0, 7); g.stroke(); L([[0, 0], [0, -40]]); L([[0, 0], [28, 0]]); L([[-60, -60], [-40, -78]]); L([[60, -60], [40, -78]]); break;
  }
  g.restore();
}
// blueprint backdrop with a slow camera
export function bpBack(g, t, o = {}) { const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); const gr = 60, off = (t * 6) % gr; g.strokeStyle = alpha(ui.blueprint, 0.07); g.lineWidth = 1; for (let x = -gr + off; x <= E.W + gr; x += gr) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = -gr + off * 0.5; y <= E.H + gr; y += gr) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); } glow(g, E.W * 0.5, E.H * 0.45, E.W * 0.5, ui.blueprint, 0.06); FX.dust(g, t, { count: 24, color: '#9fc8ff', a: 0.25, seed: 9 }); }
export const T = (g, s, x, y, o = {}) => text(g, s, x, y, { font: FONTS.ui, weight: 900, ...o });
// pop-in scale helper
export const popIn = (t, t0, d = 0.35) => ease.outBack(prog(t, t0, t0 + d));
export function stamp(g, str, x, y, t, t0, o = {}) { const k = ease.outBack(prog(t, t0, t0 + 0.3)); if (k <= 0) return; const col = o.color || '#ff5a4a', size = o.size || 80; g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.12); const sc = 1 + (1 - k) * 1.2; g.scale(sc, sc); g.globalAlpha *= clamp(k * 2); const w = measure(g, str, size, FONTS.ui, 900) + size * 0.7; rr(g, -w / 2, -size * 0.75, w, size * 1.5, size * 0.18); g.strokeStyle = col; g.lineWidth = size * 0.1; g.stroke(); text(g, str, 0, size * 0.04, { size, color: col, font: FONTS.ui, weight: 900, spacing: size * 0.06 }); g.restore(); }
