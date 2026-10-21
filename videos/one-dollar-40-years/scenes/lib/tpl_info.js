// lib/tpl_info.js — numbers, charts and blueprint explainers.
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, rr, seg, circle, ring, poly, glow, alpha, shade, mix, linGrad, text, FONTS, measure, rng, noise } from '/engine/core.js';
import { drawFigure, POSES, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { jar, coin, bill, car, pizza, note } from '../sets/props.js';
import { PLACES, placeMood, at, T, popIn, icon, stamp, bpBack, money, kmoney, who } from './common.js';
import { TPL } from './tpl_scene.js';

const C = () => { const u = S().ui; return { gold: u.gold, cream: u.cream, accent: u.accent, blue: u.blueprint, good: u.good, text: u.text, sub: u.sub }; };
const col = (c) => C()[c] || c || C().gold;
const fadeOut = (t, info, d = 0.3) => clamp((info.dur - t) / d);
function back(g, t, info) {
  if (!info.bg || info.bg === 'bp') { bpBack(g, t); return; }
  const set = PLACES[info.bg]; blurLayer(g, 16, (g) => set(g, t, { z: 1.4, x: -80 + t * 10, y: -60 }, info.bgOpts || {})); veil(g, '#06040a', 0.6);
}
const acctR = (y, rate = 0.1, perDay = 1) => (y <= 0 ? 0 : 365 * perDay * (Math.pow(1 + rate, y) - 1) / rate);

// ---------- big counter ----------
TPL.bigNum = (g, t, info) => {
  back(g, t, info);
  const c = C(), k = popIn(t, info.t0 ?? 0.1, 0.4), p = ease.inOut(prog(t, info.start ?? 0.2, (info.start ?? 0.2) + (info.cdur ?? 1.2)));
  const v = info.from != null ? lerp(info.from, info.to, p) : info.to;
  const str = info.str || ((info.prefix ?? '$') + (info.decimals ? v.toFixed(info.decimals) : Math.round(v).toLocaleString('en-US')) + (info.suffix || ''));
  const cy = E.H * (info.y ?? 0.5), cl = col(info.color), size = info.size || 170, a = fadeOut(t, info);
  if (info.icon) icon(g, info.icon, E.W / 2, cy - size * 1.6, info.iconS ?? 1.1, { coins: 12 });
  if (info.label) T(g, info.label, E.W / 2, cy - size * 0.72, { size: 40, color: alpha(c.cream, 0.85), spacing: 8, alpha: clamp(k) * a });
  g.save(); g.translate(E.W / 2, cy); g.scale(k * (1 + 0.02 * t), k * (1 + 0.02 * t));
  const sz = Math.min(size, (E.W * 0.86) / Math.max(1, measure(g, str, size, FONTS.ui, 900) / size));
  T(g, str, 0, 0, { size: sz, color: cl, glow: 40, glowColor: alpha(cl, 0.6), alpha: a });
  if (info.strikeAt != null) { const s2 = ease.out(prog(t, info.strikeAt, info.strikeAt + 0.35)); const w = measure(g, str, sz, FONTS.ui, 900); seg(g, [[-w / 2 - 10, 0], [-w / 2 - 10 + (w + 20) * s2, 0]], 12, c.accent); }
  g.restore();
  if (info.sub) { const k2 = popIn(t, info.subAt ?? 0.9); if (k2 > 0) T(g, info.sub, E.W / 2, cy + size * 0.78, { size: info.subSize || 54, color: col(info.subColor || 'cream'), alpha: clamp(k2) * a, glow: 14, glowColor: alpha(col(info.subColor || 'gold'), 0.4) }); }
  if (info.chip) { const k3 = popIn(t, info.chipAt ?? 0.8); if (k3 > 0) { g.save(); g.translate(E.W / 2, cy + size * 0.8); g.scale(k3, k3); const w = measure(g, info.chip, 50, FONTS.ui, 900) + 60; rr(g, -w / 2, -38, w, 76, 38); g.fillStyle = alpha(col(info.chipColor || 'good'), 0.2); g.fill(); T(g, info.chip, 0, 2, { size: 50, color: col(info.chipColor || 'good') }); g.restore(); } }
  if (info.sparkle) for (let i = 0; i < 8; i++) { const ph = (t * 0.7 + i / 8) % 1; FX.sparkle(g, E.W / 2 + Math.cos(i * 2.4) * 520, cy + Math.sin(i * 1.7) * 140, 30 * Math.sin(ph * Math.PI), '#fff3d0'); }
  if (info.badge) UI.badge(g, { str: info.badge.str || info.badge, a: clamp(t / 0.3) * a });
  if (info.particlesIn) for (let i = 0; i < 30; i++) { const r = rng(i + 3), ph = (t * 0.5 + r()) % 1, ang = r() * 6.28, d = lerp(900, 60, ease.in(ph)); g.save(); g.globalAlpha = 0.6 * Math.sin(ph * Math.PI); g.fillStyle = '#efe6d6'; g.translate(E.W / 2 + Math.cos(ang) * d, cy + Math.sin(ang) * d * 0.6); g.rotate(ang); g.fillRect(-12, -14, 24, 28); g.fillStyle = '#c0453a'; g.fillRect(-12, -14, 24, 7); g.restore(); }
};

// ---------- growth chart ----------
// lines:[{rate, perDay, color, label, dash}] | default; years [a,b] animate over [start, start+cdur]; maxX; yMax (or [[t,v]]); contrib:true; markers:[{y,label,t0,color,line}]; highlight:{a,b,t0,label}; bracket:[{a,b,label,t0,color}]; stopAt:{y,t0}
TPL.chart = (g, t, info) => {
  back(g, t, info);
  const c = C(), a = fadeOut(t, info);
  const x0 = V(220, 120), x1 = E.W - V(200, 100), y0 = E.H - V(170, 420), y1 = V(200, 420);
  const maxX = info.maxX ?? 40, p = ease.inOut(prog(t, info.start ?? 0.2, (info.start ?? 0.2) + (info.cdur ?? 1.6)));
  const yr = lerp(info.years?.[0] ?? 0, info.years?.[1] ?? maxX, p);
  const lines = info.lines || [{ rate: 0.1, perDay: info.perDay ?? 1, color: c.gold }];
  const yMax = Array.isArray(info.yMax) ? key(t, info.yMax) : info.yMax ?? acctR(maxX, lines[0].rate, lines[0].perDay) * 1.08;
  const X = (y) => lerp(x0, x1, y / maxX), Y = (v) => lerp(y0, y1, v / yMax);
  g.save(); g.globalAlpha *= a;
  // axes
  seg(g, [[x0, y1 - 30], [x0, y0], [x1 + 30, y0]], 3, alpha(c.blue, 0.6));
  for (let y = 0; y <= maxX; y += maxX > 20 ? 10 : maxX > 10 ? 5 : 1) { seg(g, [[X(y), y0], [X(y), y0 + 12]], 3, alpha(c.blue, 0.6)); T(g, String(y), X(y), y0 + 40, { size: 26, color: alpha(c.cream, 0.6) }); }
  T(g, 'YEARS', x1 + 20, y0 + 40, { size: 22, color: alpha(c.blue, 0.8), align: 'right', spacing: 3 });
  for (let i = 1; i <= 4; i++) { const v = (yMax / 4) * i; seg(g, [[x0, Y(v)], [x1, Y(v)]], 1.5, alpha(c.blue, 0.1)); T(g, kmoney(v), x0 - 18, Y(v), { size: 24, color: alpha(c.cream, 0.5), align: 'right' }); }
  if (info.title) T(g, info.title, x0, y1 - 70, { size: 40, color: c.cream, align: 'left', spacing: 3 });
  // highlight region
  if (info.highlight) { const h = info.highlight, k = ease.out(prog(t, h.t0 ?? 0.5, (h.t0 ?? 0.5) + 0.6)); if (k > 0) { g.save(); g.beginPath(); g.moveTo(X(h.a), y0); for (let y = h.a; y <= h.b + 0.001; y += 0.25) g.lineTo(X(y), Y(acctR(Math.min(y, yr), lines[0].rate, lines[0].perDay))); g.lineTo(X(h.b), y0); g.closePath(); g.fillStyle = alpha(col(h.color || 'gold'), 0.22 * k); g.fill(); g.restore(); if (h.label) T(g, h.label, X((h.a + h.b) / 2), Y(acctR(h.b, lines[0].rate, lines[0].perDay)) - 60, { size: 40, color: col(h.color || 'gold'), alpha: k, glow: 16, glowColor: alpha(c.gold, 0.5) }); } }
  // contributions line
  if (info.contrib) { g.setLineDash([14, 12]); g.beginPath(); for (let y = 0; y <= yr + 0.001; y += maxX / 120) { const v = 365 * (info.perDay ?? 1) * y; y ? g.lineTo(X(y), Y(v)) : g.moveTo(X(y), Y(v)); } g.strokeStyle = alpha(c.cream, 0.7); g.lineWidth = 4; g.stroke(); g.setLineDash([]); if (yr > maxX * 0.3) T(g, info.contribLabel || 'PUT IN', X(yr) + 16, Y(365 * (info.perDay ?? 1) * yr) + 4, { size: 26, color: alpha(c.cream, 0.75), align: 'left' }); }
  // main lines
  for (const L of lines) {
    const stop = info.stopAt && t > info.stopAt.t0 ? info.stopAt.y : null, colr = col(L.color);
    g.beginPath(); let last = null;
    for (let y = 0; y <= yr + 0.001; y += maxX / 160) { const v = acctR(stop != null ? Math.min(y, stop) : y, L.rate, L.perDay); const pt = [X(y), Y(v)]; y ? g.lineTo(...pt) : g.moveTo(...pt); last = pt; }
    g.strokeStyle = colr; g.lineWidth = 7; g.lineJoin = 'round'; g.lineCap = 'round'; if (L.dash) g.setLineDash([16, 12]); g.stroke(); g.setLineDash([]);
    if (stop != null) { g.setLineDash([10, 14]); g.beginPath(); for (let y = stop; y <= yr + 0.001; y += maxX / 160) { const pt = [X(y), Y(acctR(y, L.rate, L.perDay))]; y === stop ? g.moveTo(...pt) : g.lineTo(...pt); } g.strokeStyle = alpha(colr, 0.25); g.lineWidth = 4; g.stroke(); g.setLineDash([]); if (info.stopAt.label) T(g, info.stopAt.label, X(stop) + 30, Y(acctR(stop, L.rate, L.perDay)) - 50, { size: 44, color: '#b8b6c4', align: 'left', alpha: clamp((t - info.stopAt.t0) / 0.3), spacing: 3 }); }
    if (last) { glow(g, last[0], last[1], 60, colr, 0.9); circle(g, last[0], last[1], 9, '#fff'); }
    if (L.label && last) T(g, L.label, last[0] + 18, last[1] - 30 + (L.dy || 0), { size: 30, color: colr, align: 'left' });
    if (info.valueTag !== false && last && !L.label) T(g, kmoney(acctR(yr, L.rate, L.perDay)), last[0] - 20, last[1] - 46, { size: 40, color: colr, align: 'right', glow: 14, glowColor: alpha(colr, 0.5) });
  }
  // markers
  for (const m of info.markers || []) { const k = popIn(t, m.t0 ?? 0.5); if (k <= 0) continue; const L = lines[m.line ?? 0], v = m.v ?? acctR(m.y, L.rate, L.perDay), px = X(m.y), py = Y(v); seg(g, [[px, py], [px, y0]], 2, alpha(col(m.color || 'cream'), 0.4)); circle(g, px, py, 11 * k, col(m.color || 'gold')); g.save(); g.translate(px + (m.dx ?? 0), py - 54 + (m.dy ?? 0)); g.scale(k, k); T(g, m.label ?? kmoney(v), 0, 0, { size: m.size || 44, color: col(m.color || 'gold'), glow: 14, glowColor: alpha(col(m.color || 'gold'), 0.5) }); g.restore(); }
  for (const b of info.bracket || []) { const k = ease.out(prog(t, b.t0 ?? 0.5, (b.t0 ?? 0.5) + 0.5)); if (k <= 0) continue; const by = y0 + 80; seg(g, [[X(b.a) + 6, by], [X(b.a) + 6, by + 16], [lerp(X(b.a) + 6, X(b.b) - 6, k), by + 16]], 4, col(b.color || 'cream')); if (k > 0.98) seg(g, [[X(b.b) - 6, by + 16], [X(b.b) - 6, by]], 4, col(b.color || 'cream')); T(g, b.label, (X(b.a) + X(b.b)) / 2, by + 52, { size: 36, color: col(b.color || 'cream'), alpha: clamp((k - 0.5) * 2) }); }
  if (info.tangents) for (const y of info.tangents) { if (y > yr) continue; const L = lines[0], v = acctR(y, L.rate, L.perDay), dv = (acctR(y + 0.5, L.rate, L.perDay) - acctR(y - 0.5, L.rate, L.perDay)); const px = X(y), py = Y(v), dx = X(y + 2) - X(y), dy = Y(v + dv * 2) - py; seg(g, [[px - dx, py - dy], [px + dx, py + dy]], 4, alpha(c.accent, 0.8)); }
  g.restore();
  if (info.badge) UI.badge(g, { str: info.badge, a: a * clamp(t / 0.3) });
  if (info.bigText) { const b = info.bigText, k = popIn(t, b.t0 ?? 0.6); if (k > 0) { g.save(); g.translate(E.W * (b.x ?? 0.4), E.H * (b.y ?? 0.32)); g.scale(k, k); T(g, b.str, 0, 0, { size: b.size || 80, color: col(b.color || 'gold'), glow: 30, glowColor: alpha(col(b.color || 'gold'), 0.6), font: FONTS.title, weight: 700, spacing: 4, alpha: a }); g.restore(); } }
};

// ---------- market crash / recovery ----------
const mkt = (u) => { const base = 1 + u * 0.5; const crash = u < 0.42 ? 0 : u < 0.55 ? -0.48 * ease.inOut((u - 0.42) / 0.13) : -0.48 + 0.55 * ease.inOut(clamp((u - 0.55) / 0.4)); return base + crash + noise(u * 40, 3) * 0.04; };
TPL.crash = (g, t, info) => {
  back(g, t, info);
  const c = C(), a = fadeOut(t, info), x0 = V(200, 100), x1 = E.W - V(200, 100), y0 = E.H - V(190, 420), y1 = V(200, 420);
  const p = lerp(info.show[0], info.show[1], ease.inOut(prog(t, info.start ?? 0.1, (info.start ?? 0.1) + (info.cdur ?? 1.4))));
  const X = (u) => lerp(x0, x1, u), Y = (v) => lerp(y0, y1, (v - 0.6) / 1.1);
  let sx = 0, sy = 0; if (info.shake && p > 0.42 && p < 0.56) { sx = Math.sin(t * 50) * 8; sy = Math.cos(t * 45) * 6; }
  g.save(); g.translate(sx, sy); g.globalAlpha *= a;
  seg(g, [[x0, y1], [x0, y0], [x1, y0]], 3, alpha(c.blue, 0.5));
  T(g, info.title || 'STOCK MARKET', x0, y1 - 50, { size: 34, color: alpha(c.cream, 0.8), align: 'left', spacing: 3 });
  let prev = null;
  for (let u = 0; u <= p; u += 0.004) { const pt = [X(u), Y(mkt(u))]; if (prev) { const down = pt[1] > prev[1] + 0.5 && u > 0.4 && u < 0.56; const after = info.ghostAfter != null && u > info.ghostAfter; seg(g, [prev, pt], 7, after ? alpha(c.cream, 0.25) : down ? c.accent : u > 0.55 ? c.good : c.gold); } prev = pt; }
  if (prev) { glow(g, prev[0], prev[1], 60, p > 0.42 && p < 0.55 ? c.accent : c.gold, 0.9); circle(g, prev[0], prev[1], 9, '#fff'); }
  if (info.pct && p > 0.5) { const k = popIn(t, info.pctAt ?? 0.9); g.save(); g.translate(X(0.5), Y(mkt(0.55)) + 90); g.scale(k, k); T(g, info.pct, 0, 0, { size: 80, color: c.accent, glow: 24, glowColor: alpha(c.accent, 0.6) }); g.restore(); }
  if (info.buys) for (let i = 0; i < 5; i++) { const u = 0.47 + i * 0.03; if (u > p) continue; const k = popIn(t, (info.start ?? 0.1) + ((u - info.show[0]) / (info.show[1] - info.show[0])) * (info.cdur ?? 1.4)); coin(g, X(u), Y(mkt(u)) + 60, 18 * k); }
  if (info.sold) { const k = popIn(t, info.sold.t0 ?? 0.6), u = info.sold.u ?? 0.55; if (k > 0) { circle(g, X(u), Y(mkt(u)), 14 * k, c.accent); g.save(); g.translate(X(u), Y(mkt(u)) + 80); g.scale(k, k); rr(g, -150, -34, 300, 68, 12); g.fillStyle = alpha(c.accent, 0.2); g.fill(); T(g, info.sold.label || 'MAX SOLD', 0, 2, { size: 38, color: c.accent, spacing: 2 }); g.restore(); } }
  if (info.missed && p > 0.6) { const k = clamp((t - (info.missedAt ?? 0.4)) / 0.5); T(g, 'MISSED', X(0.82), Y(mkt(0.95)) - 70, { size: 56, color: alpha(c.cream, 0.7), alpha: k, spacing: 4 }); }
  g.restore();
  if (info.badge) UI.badge(g, { str: info.badge, color: c.accent });
  if (info.bigText) { const b = info.bigText, k = popIn(t, b.t0 ?? 0.5); if (k > 0) { g.save(); g.translate(E.W * (b.x ?? 0.7), E.H * (b.y ?? 0.3)); g.scale(k, k); T(g, b.str, 0, 0, { size: b.size || 70, color: col(b.color || 'good'), glow: 24, glowColor: alpha(col(b.color || 'good'), 0.6), alpha: a }); g.restore(); } }
};

// ---------- comparison bars ----------
TPL.compare = (g, t, info) => {
  back(g, t, info);
  const c = C(), a = fadeOut(t, info), rows = info.rows, max = info.max ?? Math.max(...rows.map((r) => r.v));
  const x = V(330, 140), w = E.W - x - V(330, 140), y0 = E.H * 0.5 - ((rows.length - 1) * 170) / 2;
  if (info.title) T(g, info.title, E.W / 2, y0 - 150, { size: 44, color: c.cream, spacing: 4, alpha: a });
  rows.forEach((r, i) => {
    const k = ease.out(prog(t, r.t0 ?? 0.2 + i * 0.4, (r.t0 ?? 0.2 + i * 0.4) + (r.dur ?? 1.1))), yy = y0 + i * 170, cl = col(r.color || 'gold');
    if (k <= 0 && !r.always) return;
    if (r.who) drawFigure(g, { x: x - 110, y: yy + 70, s: 0.55, facing: 1, outfit: who(r.who), pose: POSES.stand, expr: r.expr || 'neutral', rim: { color: c.cream, dir: [0, -1], w: 3 }, alpha: clamp(k * 3) * a });
    T(g, r.label, x, yy - 52, { size: 32, color: alpha(c.cream, 0.85), align: 'left', spacing: 3, alpha: clamp(k * 3) * a });
    rr(g, x, yy - 24, w, 48, 24); g.fillStyle = alpha(cl, 0.1 * a); g.fill();
    if (r.dashed) { g.setLineDash([14, 10]); rr(g, x, yy - 24, Math.max(48, w * (r.v / max) * k), 48, 24); g.strokeStyle = alpha(cl, 0.8 * a); g.lineWidth = 4; g.stroke(); g.setLineDash([]); }
    else { rr(g, x, yy - 24, Math.max(48, w * (r.v / max) * k), 48, 24); g.fillStyle = alpha(cl, a); g.fill(); glow(g, x + w * (r.v / max) * k, yy, 80, cl, 0.5 * a); }
    if (r.split) { const sk = ease.out(prog(t, r.split.t0, r.split.t0 + 0.8)); if (sk > 0) { rr(g, x, yy - 24, Math.max(48, w * (r.split.v / max)), 48, 24); g.fillStyle = alpha(c.cream, 0.9 * a * sk); g.fill(); T(g, r.split.label, x + w * (r.split.v / max) / 2, yy + 56, { size: 28, color: alpha(c.cream, 0.85), alpha: sk * a }); T(g, r.split.rest, x + w * (r.split.v / max) + (w * (r.v / max) - w * (r.split.v / max)) / 2, yy + 56, { size: 28, color: c.gold, alpha: sk * a }); } }
    T(g, r.valStr || money(r.v * k), x + Math.max(48, w * (r.v / max) * k) + 20, yy + 2, { size: 46, color: cl, align: 'left', glow: 14, glowColor: alpha(cl, 0.5), alpha: clamp(k * 3) * a });
    if (r.check) { const kk = popIn(t, r.check); if (kk > 0) { g.save(); g.translate(x + w * (r.v / max) + 300, yy); g.scale(kk * 0.6, kk * 0.6); icon(g, 'check', 0, 0, 1, { color: c.good }); g.restore(); } }
  });
  if (info.diff) { const d = info.diff, k = popIn(t, d.t0 ?? 1.5); if (k > 0) { const xa = x + w * (d.a / max), xb = x + w * (d.b / max), yy = y0 + (rows.length - 1) * 170 + 120; seg(g, [[xa, yy - 20], [xa, yy], [xb, yy], [xb, yy - 20]], 4, c.accent); g.save(); g.translate((xa + xb) / 2, yy + 56); g.scale(k, k); T(g, d.label, 0, 0, { size: 60, color: c.accent, glow: 22, glowColor: alpha(c.accent, 0.6) }); g.restore(); } }
  if (info.badge) UI.badge(g, { str: info.badge, a });
};

// ---------- generic blueprint card ----------
// items: [{t0, kind:'text'|'icon'|'stamp'|'arrow'|'coins'|'line'|'jar'|'bill'|'figure', x, y (0..1), ...}]
TPL.card = (g, t, info) => {
  back(g, t, info);
  const c = C(), a = fadeOut(t, info), z = 1 + (info.push ?? 0.04) * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); g.globalAlpha *= a;
  for (const it of info.items || []) {
    const t0 = it.t0 ?? 0.2, k = it.noPop ? clamp((t - t0) / 0.3) : popIn(t, t0), x = E.W * (it.x ?? 0.5), y = E.H * (it.y ?? 0.5);
    if (k <= 0) continue; if (it.t1 != null && t > it.t1) continue;
    const wob = it.ghost ? Math.sin(t * 3 + x) * 8 : 0;
    g.save(); g.translate(x + wob, y); g.scale(k, k); if (it.ghost) g.globalAlpha *= 0.35 + 0.1 * Math.sin(t * 4); if (it.a != null) g.globalAlpha *= it.a;
    switch (it.kind || 'text') {
      case 'text': T(g, it.str, 0, 0, { size: it.size || 60, color: col(it.color || 'cream'), font: it.font === 'title' ? FONTS.title : it.font === 'serif' ? FONTS.serif : FONTS.ui, weight: it.font === 'title' ? 700 : 900, italic: it.font === 'serif', glow: it.glow ?? 16, glowColor: alpha(col(it.color || 'gold'), 0.45), spacing: it.spacing ?? 2, align: it.align || 'center' }); break;
      case 'icon': icon(g, it.name, 0, 0, it.s ?? 1, { color: it.color ? col(it.color) : undefined, coins: it.coins }); break;
      case 'stamp': g.restore(); stamp(g, it.str, x, y, t, t0, { size: it.size || 80, color: col(it.color || 'accent'), rot: it.rot }); g.save(); break;
      case 'arrow': { g.restore(); g.save(); const [ax, ay] = [E.W * it.from[0], E.H * it.from[1]], [bx, by] = [E.W * it.to[0], E.H * it.to[1]], kk = ease.out(prog(t, t0, t0 + 0.5)); const ex = lerp(ax, bx, kk), ey = lerp(ay, by, kk), cl = col(it.color || 'blue'); seg(g, [[ax, ay], [ex, ey]], 6, cl); const ang = Math.atan2(by - ay, bx - ax); if (kk > 0.95) poly(g, [[bx, by], [bx - Math.cos(ang - 0.4) * 26, by - Math.sin(ang - 0.4) * 26], [bx - Math.cos(ang + 0.4) * 26, by - Math.sin(ang + 0.4) * 26]], cl); break; }
      case 'coins': for (let i = 0; i < (it.n || 5); i++) { const kk = popIn(t, t0 + i * (it.stagger ?? 0.08)); if (kk > 0) coin(g, (i - ((it.n || 5) - 1) / 2) * (it.gap || 70), 0, (it.r || 28) * kk, { grey: it.grey }); } break;
      case 'stack': { const n = it.n || 5; for (let i = 0; i < n; i++) { const kk = popIn(t, t0 + i * (it.stagger ?? 0.05)); if (kk > 0) coin(g, 0, -i * (it.r || 30) * 0.42, (it.r || 30) * kk, { edge: true, grey: it.grey }); } if (it.label) T(g, it.label, 0, (it.r || 30) * 1.4, { size: 34, color: col(it.lc || 'gold') }); break; }
      case 'line': g.restore(); g.save(); seg(g, [[E.W * it.from[0], E.H * it.from[1]], [lerp(E.W * it.from[0], E.W * it.to[0], ease.out(prog(t, t0, t0 + 0.5))), lerp(E.H * it.from[1], E.H * it.to[1], ease.out(prog(t, t0, t0 + 0.5)))]], it.w || 8, col(it.color || 'accent')); break;
      case 'jar': jar(g, 0, 0, it.s ?? 1, { coins: it.coins ?? 10, bills: it.bills ?? 0, glow: it.glow ?? 0.7, grey: it.grey, label: it.label, sprout: it.sprout }); break;
      case 'bill': bill(g, 0, 0, it.w || 200, { value: it.value || '1', rot: it.rot || 0 }); break;
      case 'figure': UI.lineFigure(g, { x: 0, y: 0, s: it.s ?? 1, pose: POSES[it.pose || 'stand'], color: col(it.color || 'blue'), facing: it.facing ?? 1 }); break;
      case 'car': car(g, 0, 0, it.s ?? 0.6, it.color || '#f2c21a', {}); break;
      case 'pizza': pizza(g, 0, 0, it.s ?? 1.4); break;
      case 'clock': FX.clock(g, 0, 0, it.r || 120, t * (it.speed ?? 60), { face: shade('#f2efe8', -0.1) }); break;
      case 'tag': { const w = measure(g, it.str, it.size || 50, FONTS.ui, 900) + 70, h = (it.size || 50) * 1.6; g.rotate(it.rot ?? -0.08); poly(g, [[-w / 2 - 30, 0], [-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], col(it.color || 'cream')); circle(g, -w / 2 - 6, 0, 8, '#0b1324'); T(g, it.str, 10, 2, { size: it.size || 50, color: '#1a1622', glow: 0 }); break; }
    }
    g.restore();
  }
  g.restore();
  if (info.badge) UI.badge(g, { str: info.badge, a });
};

// ---------- two timelines: Sam vs Max ----------
TPL.lanes = (g, t, info) => {
  back(g, t, info);
  const c = C(), a = fadeOut(t, info), x0 = V(360, 140), x1 = E.W - V(220, 100), X = (age) => lerp(x0, x1, (age - 25) / 40);
  const rows = [{ who: 'SAM', start: 25, y: E.H * 0.38, color: '#d64a33', label: 'SAM' }, { who: 'MAX', start: 35, y: E.H * 0.66, color: '#f2c21a', label: 'MAX' }];
  for (let age = 25; age <= 65; age += 10) { seg(g, [[X(age), E.H * 0.25], [X(age), E.H * 0.8]], 1.5, alpha(c.blue, 0.15)); T(g, 'AGE ' + age, X(age), E.H * 0.86, { size: 26, color: alpha(c.cream, 0.6) }); }
  rows.forEach((r, i) => {
    const k = ease.inOut(prog(t, 0.3 + i * 0.3, 1.8 + i * 0.3));
    drawFigure(g, { x: x0 - 170, y: r.y + 60, s: 0.5, facing: 1, outfit: who(r.who), pose: POSES.stand, expr: 'neutral', rim: { color: c.cream, dir: [0, -1], w: 3 } });
    T(g, r.label, x0 - 100, r.y - 70, { size: 30, color: r.color, align: 'left' });
    rr(g, X(25), r.y - 14, X(65) - X(25), 28, 14); g.fillStyle = alpha(c.blue, 0.08); g.fill();
    const end = lerp(X(r.start), X(65), k); rr(g, X(r.start), r.y - 14, Math.max(28, end - X(r.start)), 28, 14); g.fillStyle = r.color; g.fill();
    jar(g, X(r.start), r.y - 22, 0.35, { coins: 1, glow: 0.6 });
  });
  if (info.gap) { const k = ease.out(prog(t, info.gap, info.gap + 0.6)); if (k > 0) { UI.dimension(g, t, { x1: X(25), y1: E.H * 0.53, x2: X(35), y2: E.H * 0.53, str: '', color: c.accent, start: info.gap }); T(g, '10 YEARS LATE', X(30) + 0, E.H * 0.53 + 50, { size: 40, color: c.accent, alpha: k }); } }
  if (info.same) info.same.forEach((s, i) => { const k = popIn(t, s.t0); if (k > 0) { g.save(); g.translate(E.W * (0.4 + i * 0.25), E.H * 0.14); g.scale(k, k); T(g, s.str, 0, 0, { size: 50, color: c.gold, glow: 16, glowColor: alpha(c.gold, 0.5) }); g.restore(); } });
};

// ---------- coin stacks / jars rows ----------
TPL.stacks = (g, t, info) => {
  back(g, t, info);
  const c = C(), a = fadeOut(t, info), base = E.H * 0.72;
  g.save(); g.globalAlpha *= a;
  if (info.mode === 'double') {
    const vals = info.vals || [1, 2, 4, 8], n = vals.length, gap = E.W / (n + 1);
    vals.forEach((v, i) => { const t0 = (info.times || [])[i] ?? 0.3 + i * 0.6, k = ease.out(prog(t, t0, t0 + 0.5)); if (k <= 0) return; const x = gap * (i + 1); const coins = Math.round(v * 3 * k); for (let j = 0; j < coins; j++) coin(g, x, base - j * 20, 72, { edge: true }); T(g, '$' + v, x, base + 100, { size: 54, color: c.gold, alpha: clamp(k * 2) }); if (i > 0) { T(g, '×2', gap * (i + 0.5), base - 220, { size: 44, color: c.accent, alpha: clamp(k * 2) }); T(g, info.stepLabel || '~7 YRS', gap * (i + 0.5), base - 160, { size: 26, color: alpha(c.cream, 0.7), alpha: clamp(k * 2) }); } });
  }
  if (info.mode === 'shrink') {
    const k = ease.inOut(prog(t, info.shrinkAt ?? 0.8, (info.shrinkAt ?? 0.8) + 1.4)), h0 = info.h0 ?? 36, h1 = info.h1 ?? 11, n = Math.round(lerp(h0, h1, k));
    for (let j = 0; j < h0; j++) coin(g, E.W / 2, base - j * 13, 64, { edge: true, a: j < n ? 1 : 0.12 });
    T(g, info.label0 || '$160,000', E.W / 2 + 240, base - h0 * 13, { size: 50, color: alpha(c.cream, 1 - k * 0.6), align: 'left' });
    if (k > 0.05) { seg(g, [[E.W / 2 + 230, base - h0 * 13], [E.W / 2 + 230 + 260 * k, base - h0 * 13]], 6, c.accent); T(g, info.label1 || "$50,000 IN TODAY'S MONEY", E.W / 2 - 110, base - n * 13 - 10, { size: 46, color: c.gold, align: 'right', alpha: k, glow: 14, glowColor: alpha(c.gold, 0.5) }); }
  }
  if (info.mode === 'tenJars') {
    for (let i = 0; i < 10; i++) { const k = popIn(t, 0.2 + i * 0.12); if (k <= 0) continue; const x = E.W * 0.1 + i * E.W * 0.0889; g.save(); g.translate(x, base - 200); g.scale(k, k); jar(g, 0, 0, 0.55, { coins: 15, glow: 0.5 }); g.restore(); T(g, 'YR ' + (i + 1), x, base - 150, { size: 22, color: alpha(c.cream, 0.6) }); }
    const k = ease.out(prog(t, info.braceAt ?? 1.6, (info.braceAt ?? 1.6) + 0.5)); if (k > 0) { seg(g, [[E.W * 0.08, base - 110], [E.W * 0.08, base - 90], [lerp(E.W * 0.08, E.W * 0.92, k), base - 90]], 5, c.gold); if (k > 0.95) seg(g, [[E.W * 0.92, base - 90], [E.W * 0.92, base - 110]], 5, c.gold); T(g, info.label || '= ONE GOOD YEAR', E.W / 2, base - 20, { size: 60, color: c.gold, alpha: clamp(k * 2 - 1), glow: 20, glowColor: alpha(c.gold, 0.5) }); }
  }
  if (info.mode === 'ghost') {
    const k = ease.out(prog(t, info.ghostAt ?? 0.8, (info.ghostAt ?? 0.8) + 1.0)), crumble = info.crumbleAt != null ? clamp((t - info.crumbleAt) / 1.0) : 0;
    for (let j = 0; j < 15; j++) coin(g, E.W * 0.32, base - j * 13, 64, { edge: true });
    T(g, '$15,000', E.W * 0.32, base + 80, { size: 54, color: c.accent });
    const r = rng(5); for (let j = 0; j < 30; j++) { const dx = crumble * (r() - 0.5) * 500, dy = crumble * (200 + r() * 400) * crumble; if (j < 30 * k) { g.save(); g.globalAlpha = 0.45 * (1 - crumble); coin(g, E.W * 0.68 + dx, base - j * 13 + dy, 64, { edge: true }); g.restore(); } }
    if (k > 0) { g.setLineDash([12, 10]); rr(g, E.W * 0.68 - 80, base - 30 * 13 - 50, 160, 30 * 13 + 80, 20); g.strokeStyle = alpha(c.gold, 0.5 * k * (1 - crumble)); g.lineWidth = 4; g.stroke(); g.setLineDash([]); T(g, '$30,000', E.W * 0.68, base + 80, { size: 54, color: alpha(c.gold, 1 - crumble * 0.7), alpha: k }); T(g, 'IN 7 YEARS', E.W * 0.68, base + 140, { size: 30, color: alpha(c.cream, 0.7), alpha: k }); }
    UI.dimension(g, t, { x1: E.W * 0.4, y1: base - 260, x2: E.W * 0.6, y2: base - 260, str: '', color: c.blue, start: (info.ghostAt ?? 0.8) - 0.2 });
    if (info.crumbleAt != null && crumble > 0) T(g, info.goneLabel || 'GONE FOR GOOD', E.W * 0.68, E.H * 0.2, { size: 60, color: c.accent, alpha: clamp(crumble * 2), glow: 20, glowColor: alpha(c.accent, 0.5) });
  }
  if (info.mode === 'buyMore') {
    for (const [i, pr] of [[0, 'HIGH'], [1, 'LOW']]) { const x = E.W * (0.3 + i * 0.4), k = popIn(t, 0.2 + i * (info.second ?? 1.0)); if (k <= 0) continue; g.save(); g.translate(x, base - 120); g.scale(k, k); T(g, pr + ' PRICES', 0, -300, { size: 40, color: i ? c.good : c.accent, spacing: 3 }); bill(g, -150, -120, 150, { rot: -0.1 }); T(g, '=', -40, -120, { size: 70, color: c.cream }); const n = i ? 2 : 1; for (let j = 0; j < n; j++) { rr(g, 20 + j * 110, -180, 96, 96, 14); g.fillStyle = c.gold; g.fill(); T(g, 'SHARE', 68 + j * 110, -132, { size: 20, color: '#2a1e10' }); } T(g, i ? '2 SHARES' : '1 SHARE', 60, 20, { size: 44, color: c.gold }); g.restore(); }
  }
  g.restore();
  if (info.badge) UI.badge(g, { str: info.badge, a });
};

// ---------- brain (rewards now vs later / urgency / tug of war) ----------
TPL.brain = (g, t, info) => {
  back(g, t, info);
  const c = C(), a = fadeOut(t, info), bx = E.W / 2, by = E.H * 0.47, pul = 1 + 0.03 * Math.sin(t * 4);
  g.save(); g.globalAlpha *= a;
  const think = info.mode === 'urgent' ? 1 - clamp((t - 0.6) / 1.5) * 0.7 : 1;
  g.save(); g.translate(bx, by); g.scale(1.6 * pul, 1.6 * pul); icon(g, 'brain', 0, 0, 1, { color: alpha(c.blue, think) }); g.restore();
  glow(g, bx, by, 300, c.blue, 0.12 * think);
  if (info.mode === 'now') {
    const k1 = popIn(t, 0.3), k2 = popIn(t, info.laterAt ?? 1.2);
    if (k1 > 0) { g.save(); g.translate(E.W * 0.2, by); g.scale(k1 * 1.1, k1 * 1.1); glow(g, 0, 0, 200, c.gold, 0.4); icon(g, info.nowIcon || 'pizza', 0, 0, 1.2, { color: c.gold }); T(g, 'NOW', 0, 150, { size: 60, color: c.gold, glow: 20, glowColor: alpha(c.gold, 0.6) }); g.restore(); const kk = ease.out(prog(t, 0.5, 1.0)); for (let i = 0; i < 3; i++) seg(g, [[bx - 190, by - 30 + i * 30], [lerp(bx - 190, E.W * 0.28, kk), by - 30 + i * 30]], 5, alpha(c.gold, 0.6)); }
    if (k2 > 0) { g.save(); g.translate(E.W * 0.8, by + 20); g.scale(k2 * 0.7, k2 * 0.7); g.globalAlpha *= 0.4; jar(g, 0, 90, 1, { coins: 20, glow: 0.2 }); T(g, info.laterLabel || '4 DECADES', 0, 170, { size: 54, color: c.cream }); g.restore(); }
  }
  if (info.mode === 'fight') { const sw = Math.sin(t * 3) * 30; seg(g, [[E.W * 0.12 + sw, by + 230], [E.W * 0.88 + sw, by + 230]], 8, c.cream); UI.lineFigure(g, { x: E.W * 0.12 + sw, y: by + 340, s: 0.9, pose: POSES.reach, color: c.gold, facing: -1 }); UI.lineFigure(g, { x: E.W * 0.88 + sw, y: by + 340, s: 0.9, pose: POSES.reach, color: c.blue, facing: 1 }); T(g, 'NOW', E.W * 0.12, by - 260, { size: 54, color: c.gold }); T(g, 'LATER', E.W * 0.88, by - 260, { size: 54, color: c.blue }); }
  if (info.mode === 'grab') { const k = ease.inOut(prog(t, 0.4, 1.4)); UI.lineFigure(g, { x: E.W * 0.28, y: by + 300, s: 1.3, pose: POSES.reach, color: c.blue }); const rx = lerp(E.W * 0.72, E.W * 0.42, k); glow(g, rx, by + 40, 160, c.gold, 0.5); icon(g, 'coin', rx, by + 40, 0.9); T(g, 'REWARD NOW', rx, by - 80, { size: 46, color: c.gold, alpha: clamp(t / 0.4) }); }
  if (info.mode === 'urgent') { for (let i = 0; i < 6; i++) { const ang = (i / 6) * 6.28 + t * 0.4, kk = popIn(t, 0.1 + i * 0.12), fl = 0.6 + 0.4 * Math.sin(t * 12 + i); if (kk <= 0) continue; g.save(); g.translate(bx + Math.cos(ang) * 420, by + Math.sin(ang) * 260); g.scale(kk * 0.8, kk * 0.8); icon(g, i % 2 ? 'alarm' : 'clock', 0, 0, 1, { color: alpha(c.accent, fl) }); g.restore(); } T(g, 'URGENT!', bx, E.H * 0.13, { size: 70, color: c.accent, glow: 24, glowColor: alpha(c.accent, 0.7), alpha: 0.6 + 0.4 * Math.sin(t * 10) }); T(g, 'THINK', bx, by + 10, { size: 50, color: alpha(c.cream, think), spacing: 6 }); }
  g.restore();
};

// ---------- most people quit ----------
TPL.quitters = (g, t, info) => {
  back(g, t, info); const c = C(), a = fadeOut(t, info), y = E.H * 0.72;
  seg(g, [[E.W * 0.06, y], [E.W * 0.94, y]], 4, alpha(c.blue, 0.5)); T(g, 'YEAR 3', E.W * 0.5, y + 50, { size: 34, color: c.accent }); seg(g, [[E.W * 0.5, y - 300], [E.W * 0.5, y + 10]], 3, alpha(c.accent, 0.5));
  for (let i = 0; i < 9; i++) { const keep = i === 2 || i === 6, x0 = E.W * 0.04 + i * 72, walk = t * 150; let x = x0 + walk, fac = 1, al = 1; if (!keep && x > E.W * 0.46 - i * 8) { const back = x - (E.W * 0.46 - i * 8); x = E.W * 0.46 - i * 8 - back * 0.8; fac = -1; al = clamp(1 - back / 300); } UI.lineFigure(g, { x, y: y - 6, s: 1.3, pose: walkPose(t * 6 + i), color: keep ? c.gold : alpha(c.blue, al * a), facing: fac }); }
  T(g, info.label || 'MOST PEOPLE QUIT HERE', E.W / 2, E.H * 0.2, { size: 60, color: c.cream, alpha: popIn(t, 0.5) * a });
};

// ---------- stock tiles / index fund ----------
TPL.grid = (g, t, info) => {
  back(g, t, info); const c = C(), a = fadeOut(t, info), r = rng(4), cols = 25, rows = 12, tw = 58, th = 38, gx = E.W / 2 - (cols * (tw + 8)) / 2, gy = E.H * 0.2;
  const L = 'ABCDEFGHJKLMNPRSTUVWXYZ', fund = info.mode === 'fund' ? ease.inOut(prog(t, 0.3, 1.5)) : 0;
  for (let i = 0; i < cols * rows; i++) { const cx = i % cols, cy = Math.floor(i / cols); const name = L[Math.floor(r() * 23)] + L[Math.floor(r() * 23)] + L[Math.floor(r() * 23)], up = Math.sin(t * 3 + i * 1.7) > 0, d = r();
    let x = gx + cx * (tw + 8), y = gy + cy * (th + 8); if (fund > 0) { const k = clamp(fund * 1.6 - d * 0.6); x = lerp(x, E.W / 2 - tw / 2, ease.in(k)); y = lerp(y, E.H * 0.7, ease.in(k)); if (k >= 1) continue; }
    rr(g, x, y, tw, th, 6); g.fillStyle = alpha(up ? c.good : c.accent, 0.18 * a); g.fill(); T(g, name, x + tw / 2, y + th / 2, { size: 15, color: alpha(up ? c.good : c.accent, 0.8 * a), glow: 0 }); }
  if (info.mode === 'pick') { const mx = E.W * (0.3 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.4))), my = E.H * 0.45 + Math.sin(t * 2.1) * 120; ring(g, mx, my, 90, 10, c.cream); seg(g, [[mx + 64, my + 64], [mx + 150, my + 150]], 18, c.cream); const k = popIn(t, info.xAt ?? 1.0); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.5); g.scale(k * 2.4, k * 2.4); icon(g, 'x', 0, 0, 1, { color: c.accent }); g.restore(); } T(g, 'PICK STOCKS?', E.W / 2, E.H * 0.1, { size: 54, color: c.cream, alpha: a }); }
  if (info.mode === 'fund') { const k = popIn(t, 0.2); g.save(); g.translate(E.W / 2, E.H * 0.82); g.scale(k, k); jar(g, 0, 60, 1.2, { coins: Math.round(fund * 30), glow: 1, label: 'INDEX FUND' }); g.restore(); T(g, info.label || 'ONE FUND · ALL OF THEM', E.W / 2, E.H * 0.1, { size: 54, color: c.gold, alpha: popIn(t, 1.0) * a, glow: 18, glowColor: alpha(c.gold, 0.5) }); }
};

// ---------- 500 slices ----------
TPL.pie = (g, t, info) => {
  back(g, t, info); const c = C(), a = fadeOut(t, info), cx = E.W * 0.42, cy = E.H * 0.52, R = 340, rot = t * 0.15, k = ease.out(prog(t, 0.6, 1.4));
  for (let i = 0; i < 500; i++) { const a0 = rot + (i / 500) * Math.PI * 2, a1 = rot + ((i + 1) / 500) * Math.PI * 2; if (i === 0) continue; g.fillStyle = alpha(i % 2 ? c.blue : shade(c.blue, -0.3), 0.55 * a); g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0, a1); g.closePath(); g.fill(); }
  const a0 = rot, a1 = rot + (1 / 500) * Math.PI * 2 * 6, out = 180 * k; g.save(); g.translate(Math.cos(a0) * out, Math.sin(a0) * out); g.fillStyle = c.gold; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0 - 0.02, a1); g.closePath(); g.fill(); glow(g, cx + Math.cos(a0) * R * 0.7, cy + Math.sin(a0) * R * 0.7, 120, c.gold, 0.6 * k); g.restore();
  T(g, info.label || '500 COMPANIES', E.W * 0.78, E.H * 0.42, { size: 56, color: c.cream, alpha: popIn(t, 0.3) * a }); T(g, info.sub || 'ALL AT ONCE', E.W * 0.78, E.H * 0.55, { size: 64, color: c.gold, alpha: popIn(t, info.subAt ?? 0.8) * a, glow: 20, glowColor: alpha(c.gold, 0.5) });
};

// ---------- sharks circling ----------
TPL.sharks = (g, t, info) => {
  const c = C(), a = fadeOut(t, info);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#060a14', '#0b1630', '#081022']); g.fillRect(0, 0, E.W, E.H);
  const wy = E.H * 0.55; FX.moon(g, E.W * 0.75, E.H * 0.18, 34);
  g.fillStyle = linGrad(g, 0, wy, 0, E.H, ['#0f2240', '#050a16']); g.fillRect(0, wy, E.W, E.H - wy);
  for (let i = 0; i < 8; i++) { g.strokeStyle = alpha('#6a8ac0', 0.12); g.lineWidth = 2; g.beginPath(); for (let x = 0; x <= E.W; x += 20) { const y = wy + 30 + i * 50 + Math.sin(x * 0.01 + t * 1.5 + i) * 6; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  // red chart line sinking behind
  g.strokeStyle = alpha(c.accent, 0.5); g.lineWidth = 6; g.beginPath(); for (let u = 0; u <= 1; u += 0.01) { const x = u * E.W, y = E.H * 0.2 + u * u * E.H * 0.4 + noise(u * 20, 2) * 20; u ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  // raft with jar
  const rx = E.W / 2, ry = wy + 40 + Math.sin(t * 1.5) * 6; rr(g, rx - 130, ry - 10, 260, 26, 8); g.fillStyle = '#3a2a22'; g.fill(); jar(g, rx, ry - 10, 0.9, { coins: 20, glow: 0.9 });
  for (let i = 0; i < 3; i++) { const ang = t * 0.6 + (i * Math.PI * 2) / 3, sx = rx + Math.cos(ang) * 520, sy = wy + 70 + Math.sin(ang) * 90, s = 0.9 + 0.3 * Math.sin(ang); g.save(); g.translate(sx, sy); g.scale(s * (Math.sin(ang) > 0 ? -1 : 1), s); icon(g, 'shark', 0, 0, 1.3, { color: '#1a1f2e' }); g.restore(); seg(g, [[sx - 70 * s, sy + 30 * s], [sx + 70 * s, sy + 30 * s]], 3, alpha('#9ab0e0', 0.3)); }
  if (info.label) T(g, info.label, E.W / 2, E.H * 0.16, { size: 64, color: c.accent, alpha: popIn(t, info.labelAt ?? 0.8) * a, glow: 20, glowColor: alpha(c.accent, 0.5) });
  FX.rain(g, t, { count: 80, a: 0.15 });
};

// ---------- giant clock ----------
TPL.clockBig = (g, t, info) => {
  const c = C(), a = fadeOut(t, info); g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0e1a', '#141a30']); g.fillRect(0, 0, E.W, E.H);
  const z = 1 + 0.08 * t; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); glow(g, 0, 0, 520, '#cfe0ff', 0.12); FX.clock(g, 0, 0, 380, 10 * 3600 + t * (info.speed ?? 1), { face: '#e9e6ee' }); g.restore();
  if (info.label) T(g, info.label, E.W / 2, E.H * 0.9, { size: 64, color: c.cream, alpha: popIn(t, info.labelAt ?? 0.4) * a, spacing: 6 });
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.3 });
};

// ---------- calendar flip + coin into jar ----------
TPL.calendarFlip = (g, t, info) => {
  back(g, t, info); const c = C(), day = 1 + Math.floor(t * (info.rate ?? 6));
  g.save(); g.translate(E.W * 0.36, E.H * 0.48); g.fillStyle = '#efe6d6'; rr(g, -200, -230, 400, 460, 18); g.fill(); g.fillStyle = '#c0453a'; rr(g, -200, -230, 400, 110, 18); g.fill(); g.fillRect(-200, -150, 400, 30);
  T(g, 'DAY', 0, -172, { size: 46, color: '#fff', spacing: 6 }); T(g, String(day), 0, 60, { size: 170, color: '#2a2230', glow: 0 });
  const ph = (t * (info.rate ?? 6)) % 1; g.save(); g.globalAlpha = 1 - ph; g.translate(0, -120); g.rotate(-ph * 1.2); g.fillStyle = '#e4dccb'; g.fillRect(-200, 0, 400, 340); g.restore(); g.restore();
  const jx = E.W * 0.72, jy = E.H * 0.8; jar(g, jx, jy, 1.6, { coins: Math.min(60, day), glow: 0.8 });
  const cp = (t * (info.rate ?? 6)) % 1; coin(g, jx, lerp(E.H * 0.05, jy - 130, ease.in(cp)), 20, { edge: cp > 0.7 });
  T(g, '+$1', jx + 150, E.H * 0.3, { size: 54, color: c.gold, alpha: 0.5 + 0.5 * Math.sin(t * 6), glow: 14, glowColor: alpha(c.gold, 0.5) });
};
