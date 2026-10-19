// lib.js: shared helpers for this video (camera moves, word timing, face close-ups, recurring props).
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, wordTime, talkAmount, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, radGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, bigFace, breathe, POSES, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

export const GYd = () => E.H * V(0.8, 0.68);
const nrm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9']/g, '').replace(/^'+|'+$/g, '');

// camera move over the whole shot: push(t, info, {z0, z1, x0, x1, y0, y1, r})
export function push(t, info, o = {}) {
  const k = (o.ease || ease.inOut)(t / info.dur);
  return { z: lerp(o.z0 ?? 1, o.z1 ?? 1.07, k), x: lerp(o.x0 ?? 0, o.x1 ?? 0, k), y: lerp(o.y0 ?? 0, o.y1 ?? 0, k), r: o.r ?? 0 };
}
// local time (s into the shot) when a word is spoken; fallback d if not found
export function wt(info, word, d = 0.3, after = null) {
  const g = wordTime(word, after != null ? info.shot.start + after : info.shot.start - 0.3);
  return g == null ? d : g - info.shot.start;
}
// local end time of the word (first match at/after the given local time)
export function wtEnd(info, word, after = 0, d = null) {
  const m = nrm(word), t0 = info.shot.start + after - 0.3;
  const w = E.words.find((w) => w.start >= t0 && nrm(w.word).startsWith(m));
  return w ? w.end - info.shot.start : d ?? info.dur;
}
// mouth movement for a quoted line inside this shot: talk(info, 'theo', 'me')  (no args = whole shot)
export function talk(info, first, last) {
  const a = first ? wt(info, first, 0) : 0, b = last ? wtEnd(info, last, a) : info.dur;
  return talkAmount(info.globalT, info.shot.start + a - 0.05, info.shot.start + b + 0.05);
}
// expression keyframes: exprAt(t, [[0, 'neutral'], [1.2, 'shocked']])
export function exprAt(t, keys) { let e = keys[0][1]; for (const [k, v] of keys) if (t >= k) e = v; return e; }
export const blinkAt = (t, period = 3.3, off = 0) => ((t + off) % period) > period - 0.12;
export const rimOf = (M, dir = [0, -1], w) => ({ color: M.rim, dir, ...(w ? { w } : {}) });

// giant close-up over a blurred, darkened set
export function faceShot(g, t, info, o) {
  const M = o.M || mood(o.mood || 'dusk');
  blurLayer(g, o.blur ?? 14, (g2) => o.bg(g2, t, o.bgCam || { z: 1.5, x: (o.bgx ?? 0) + 20 * t, y: -120 }));
  veil(g, o.veilColor || '#0a0710', o.veil ?? 0.35);
  o.behind?.(g, t);
  const r = V(300, 330) * (o.scale ?? 1) * (1 + (o.zoom ?? 0.05) * ease.inOut(t / info.dur));
  const cx = E.W / 2 + (o.dx ?? 0) + (o.drift ?? 0) * t, cy = E.H * V(0.6, 0.55) + (o.dy ?? 0);
  bigFace(g, cx, cy, r, { outfit: o.outfit, expr: typeof o.expr === 'function' ? o.expr(t) : o.expr, talk: o.talk ? o.talk(t) : 0,
    blink: o.noBlink ? false : blinkAt(t, o.blinkP ?? 3.1, o.seed ?? 0), look: typeof o.look === 'function' ? o.look(t) : o.look,
    rimColor: o.rimColor || M.rim, rimSide: o.side ?? -1, tilt: o.tilt, face: o.face });
  if (o.talk && o.talk(t) > 0) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.55, color: '#fff3e0', a: 0.28 });
  o.front?.(g, t, cx, cy, r);
  return { cx, cy, r };
}
// blurred set background for inserts
export function insertBg(g, t, drawSet, cam, a = 0.4, blur = 16) { blurLayer(g, blur, (g2) => drawSet(g2, t, cam)); veil(g, '#0a0710', a); }
// time-slow look: cool soft-light tint + badge
export function slowTint(g, a = 0.35, color = 'rgba(80,120,255,1)') { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha(color, a); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore(); }
export function slowBadge(g, t, str = '100x', at = 0.3) { UI.badge(g, { str, a: ease.out(prog(t, at, at + 0.5)) }); }
// pop-in scale helper for graphics
export const popIn = (t, a, d = 0.35) => ease.outBack(prog(t, a, a + d));
export const fadeOut = (t, dur, d = 0.3) => clamp((dur - t) / d);

// figure with mood rim
export function fig(g, M, o) { drawFigure(g, { rim: rimOf(M, o.rimDir || [0, -1]), ...o }); }

// ---------- props ----------
export function wasp(g, x, y, s = 1, t = 0, o = {}) {
  const wf = o.slow ? 0.6 + 0.4 * Math.sin(t * 2) : Math.abs(Math.sin(t * 90));
  g.save(); g.translate(x, y); g.scale(s * (o.facing ?? 1), s); g.rotate(o.rot || 0);
  g.fillStyle = 'rgba(225,238,255,.5)';
  g.beginPath(); g.ellipse(-4, -14, 7, 16 * wf + 2, -0.5, 0, 7); g.fill(); g.beginPath(); g.ellipse(6, -14, 7, 16 * wf + 2, 0.4, 0, 7); g.fill();
  // abdomen with stripes
  g.save(); g.beginPath(); g.ellipse(-16, 4, 18, 11, 0.25, 0, 7); g.clip();
  g.fillStyle = '#f2b81a'; g.fillRect(-40, -20, 50, 40); g.fillStyle = '#16121a'; for (let i = 0; i < 4; i++) g.fillRect(-32 + i * 8.5, -20, 4, 40); g.restore();
  circle(g, 4, 0, 8, '#16121a'); circle(g, 14, -2, 7, '#f2b81a'); circle(g, 17, -4, 3, '#16121a');
  seg(g, [[-30, 8], [-38, 12]], 2, '#16121a'); seg(g, [[16, -8], [22, -18]], 1.5, '#16121a'); seg(g, [[18, -8], [27, -14]], 1.5, '#16121a');
  for (const dx of [-2, 4, 9]) seg(g, [[dx, 6], [dx - 3, 16]], 1.6, '#16121a');
  g.restore();
}
export function sandwich(g, x, y, s = 1, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  poly(g, [[-40, 0], [40, 0], [0, -46]], '#e9c88e'); seg(g, [[-38, -4], [38, -4]], 6, '#7fb35a'); seg(g, [[-36, -9], [36, -9]], 5, '#d8584a');
  poly(g, [[-40, -12], [40, -12], [0, -56]], '#f0d6a2'); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(-40, -2, 80, 3); g.restore();
}
export function glass(g, x, y, s = 1, rot = 0, fill = 0.6) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  poly(g, [[-22, -70], [22, -70], [17, 0], [-17, 0]], 'rgba(200,225,255,.22)');
  g.save(); g.beginPath(); g.moveTo(-22, -70); g.lineTo(22, -70); g.lineTo(17, 0); g.lineTo(-17, 0); g.closePath(); g.clip();
  g.fillStyle = 'rgba(140,190,255,.38)'; g.fillRect(-30, -70 * fill, 60, 80); g.restore();
  seg(g, [[-22, -70], [-17, 0], [17, 0], [22, -70]], 3, 'rgba(235,245,255,.85)'); seg(g, [[-12, -60], [-9, -10]], 4, 'rgba(255,255,255,.55)');
  g.restore();
}
export function ball(g, x, y, r, rot = 0, color = '#e0402f') {
  circle(g, x, y, r, color); g.save(); g.translate(x, y); g.rotate(rot);
  g.strokeStyle = shade(color, -0.35); g.lineWidth = r * 0.12; g.beginPath(); g.arc(0, 0, r * 0.98, -0.6, 0.6); g.stroke(); g.beginPath(); g.arc(0, 0, r * 0.98, Math.PI - 0.6, Math.PI + 0.6); g.stroke(); g.restore();
  circle(g, x - r * 0.35, y - r * 0.38, r * 0.22, alpha('#ffffff', 0.55));
  g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.arc(x + r * 0.1, y + r * 0.12, r, 0, Math.PI * 2); g.arc(x, y, r, 0, Math.PI * 2, true); g.fill();
}
export function toaster(g, x, y, s = 1, coils = 0.6) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -70, -90, 140, 90, 22); g.fillStyle = '#b8b4c4'; g.fill(); rr(g, -70, -90, 140, 16, 10); g.fillStyle = '#d8d4e2'; g.fill();
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-70, -12, 140, 12);
  for (const dx of [-30, 18]) { rr(g, dx - 4, -96, 22, 10, 4); g.fillStyle = '#222'; g.fill(); glow(g, dx + 7, -96, 40, '#ff6a2a', coils); poly(g, [[dx - 2, -96], [dx + 16, -96], [dx + 18, -120], [dx - 4, -120]], '#e3b77a'); }
  rr(g, 60, -60, 18, 10, 4); g.fillStyle = '#2a2633'; g.fill(); g.restore();
}
export function car(g, x, y, s = 1, o = {}) {
  const { color = '#2c2a3a', facing = 1, lights = true, truck = false, glowC = '#ffe6b0', tail = '#ff4a3a', blur = 0 } = o;
  g.save(); g.translate(x, y); g.scale(s * facing, s);
  if (truck) {
    rr(g, -260, -250, 330, 220, 10); g.fillStyle = color; g.fill(); g.fillStyle = shade(color, 0.18); g.fillRect(-250, -240, 310, 10);
    rr(g, 70, -190, 130, 160, 16); g.fillStyle = shade(color, -0.15); g.fill(); poly(g, [[130, -180], [190, -180], [196, -110], [130, -110]], '#6f8fb0');
    for (const wx of [-190, -40, 140]) { circle(g, wx, -26, 38, '#0c0b10'); circle(g, wx, -26, 16, '#55505f'); }
    if (lights) { glow(g, 200, -60, 180, glowC, 0.7); circle(g, 196, -60, 10, '#fff6e0'); FX.lightCone(g, 200, -60, { angle: 0.08, spread: 0.35, len: 900, color: glowC, a: 0.16 }); glow(g, -262, -60, 60, tail, 0.6); }
  } else {
    poly(g, [[-150, -40], [-140, -86], [-70, -96], [-30, -140], [70, -140], [110, -92], [150, -82], [155, -40]], color);
    poly(g, [[-22, -132], [62, -132], [94, -94], [-58, -94]], '#7fa0c8'); seg(g, [[22, -132], [22, -94]], 6, color);
    g.fillStyle = shade(color, -0.3); g.fillRect(-150, -46, 305, 10);
    for (const wx of [-90, 95]) { circle(g, wx, -30, 30, '#0c0b10'); circle(g, wx, -30, 12, '#55505f'); }
    if (lights) { glow(g, 150, -66, 120, glowC, 0.7); circle(g, 148, -66, 7, '#fff6e0'); FX.lightCone(g, 150, -66, { angle: 0.05, spread: 0.3, len: 700, color: glowC, a: 0.14 }); glow(g, -150, -66, 50, tail, 0.6); }
  }
  g.restore();
  if (blur > 0) FX.speedLines(g, 0, { cx: x, cy: y - 80 * s, count: 30, a: 0.2 * blur, inner: 160 });
}
export function pistol(g, x, y, s = 1, rot = 0, ink = '#141018') {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -10, -14, 70, 22, 6); g.fillStyle = ink; g.fill(); rr(g, -10, 0, 22, 44, 6); g.fill(); seg(g, [[12, 14], [24, 20]], 4, ink); g.restore();
}
export function feather(g, x, y, s = 1, rot = 0, c = '#fff3e0') {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = alpha(c, 0.92); g.beginPath(); g.moveTo(0, -120); g.quadraticCurveTo(48, -40, 6, 80); g.quadraticCurveTo(-40, -30, 0, -120); g.fill();
  seg(g, [[0, -115], [4, 110]], 3, shade(c, -0.25)); for (let i = 0; i < 9; i++) seg(g, [[2, -90 + i * 18], [i % 2 ? 26 : -22, -80 + i * 18]], 1.2, alpha(shade(c, -0.2), 0.6));
  g.restore();
}
export function letter(g, x, y, s = 1, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -110, -70, 220, 140, 6); g.fillStyle = o.color || '#efe6d2'; g.fill();
  if (o.open) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(-110, -70, 220, 140); }
  else { seg(g, [[-110, -70], [0, 10], [110, -70]], 3, 'rgba(120,100,80,.45)'); circle(g, 0, 10, 14, '#a8302a'); }
  g.restore();
}
export function phone(g, x, y, s = 1, glowC = '#9fd8ff') { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -24, -44, 48, 88, 8); g.fillStyle = '#0c0b10'; g.fill(); g.fillStyle = glowC; g.fillRect(-19, -36, 38, 70); g.restore(); glow(g, x, y, 120 * s, glowC, 0.4); }
// two-note whistle motif: gold rings, high then low
export function noteRings(g, x, y, t, o = {}) {
  const { a = 1, speed = 1, scale = 1, color = S().ui.gold } = o;
  for (let k = 0; k < 2; k++) { const ph = ((t * speed + k * 0.5) % 1); const r = (40 + ph * 520) * scale; ring(g, x, y - (k ? -10 : 30) * scale, r, (k ? 3 : 5) * scale, alpha(color, a * (1 - ph) * 0.9)); }
}
// red "DQ" / stamp
export function stamp(g, t, str, x, y, at = 0, size = 150, color = '#ff5a4a', rot = -0.12) {
  const k = prog(t, at, at + 0.18); if (k <= 0) return; const s = lerp(2.2, 1, ease.out(k));
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha *= clamp(k * 2);
  const w = Math.max(size * 1.6, str.length * size * 0.62); rr(g, -w / 2, -size * 0.62, w, size * 1.24, 18); g.strokeStyle = color; g.lineWidth = 10; g.stroke();
  text(g, str, 0, 4, { size, color, font: FONTS.title, weight: 700, spacing: 6, glow: 20, glowColor: alpha(color, 0.6) }); g.restore();
}
export function label(g, t, str, x, y, at = 0, o = {}) {
  const k = popIn(t, at); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k);
  text(g, str, 0, 0, { size: o.size || V(56, 64), color: o.color || S().ui.gold, font: o.font || FONTS.ui, weight: 900, spacing: o.spacing ?? 2, glow: 16, glowColor: alpha(o.color || S().ui.gold, 0.55), align: o.align || 'center' });
  g.restore();
}
export { FX, UI, POSES, posesAt, breathe, drawFigure, bigFace };

// ---------- sprint poses (face +x) ----------
export const MARKS = { head: [58, -100], sh: [36, -96], hip: [-34, -60], eF: [42, -50], hF: [44, 0], eB: [38, -50], hB: [40, 0], kF: [2, -20], fF: [-40, -2], kB: [-20, -14], fB: [-70, -2] };
export const SETP = { head: [62, -118], sh: [40, -112], hip: [-24, -106], eF: [44, -58], hF: [46, 0], eB: [40, -58], hB: [42, 0], kF: [12, -60], fF: [-40, -2], kB: [-42, -50], fB: [-74, -2] };
export const HUGK = { head: [14, -150], sh: [8, -120], hip: [0, -58], eF: [44, -118], hF: [56, -142], eB: [38, -120], hB: [50, -146], kF: [36, -44], fF: [40, 0], kB: [-8, -4], fB: [-50, 0] };
// starting-pistol smoke puff (k = 0..1 age)
export function smoke(g, x, y, k, s = 1) { if (k <= 0) return; for (let i = 0; i < 7; i++) { const a = i * 0.9, d = (20 + k * 70) * s; circle(g, x + Math.cos(a) * d * 0.6 + k * 30 * s, y - k * 60 * s + Math.sin(a) * d * 0.4, (18 + k * 40) * s * (0.7 + (i % 3) * 0.15), alpha('#d8d2dc', 0.5 * (1 - k))); } }
