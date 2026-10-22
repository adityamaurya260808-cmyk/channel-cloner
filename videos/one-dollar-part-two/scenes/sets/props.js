// sets/props.js — reusable story props: the glass jar, the note, coins, bills, the phone + app UI, car, pizza.
import { E, S, V, clamp, lerp, ease, prog, rr, seg, circle, ring, poly, glow, alpha, shade, mix, linGrad, radGrad, text, FONTS, rng } from '/engine/core.js';

export const GOLD = '#e8b84a', GOLD_D = '#a8782a', BILL = '#7fb069', BILL_D = '#4f7a45', PAPER = '#f2e6c8', GLASS = '#cfe6ff';

// ---------- coins & bills ----------
export function coin(g, x, y, r, o = {}) {
  const c = o.grey ? '#8d8a96' : GOLD, d = o.grey ? '#5d5a66' : GOLD_D;
  g.save(); if (o.a != null) g.globalAlpha *= o.a;
  if (o.edge) { g.fillStyle = d; g.beginPath(); g.ellipse(x, y + r * 0.12, r, r * 0.34, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = c; g.beginPath(); g.ellipse(x, y, r, r * 0.34, 0, 0, Math.PI * 2); g.fill(); g.restore(); return; }
  circle(g, x, y, r, d); circle(g, x - r * 0.05, y - r * 0.05, r * 0.9, c); ring(g, x - r * 0.05, y - r * 0.05, r * 0.68, r * 0.07, alpha(d, 0.8));
  text(g, '$', x - r * 0.05, y - r * 0.02, { size: r * 0.95, color: d, font: FONTS.ui, weight: 900 });
  if (!o.grey) { g.save(); g.globalCompositeOperation = 'lighter'; circle(g, x - r * 0.38, y - r * 0.38, r * 0.16, 'rgba(255,250,220,.55)'); g.restore(); }
  g.restore();
}
export function bill(g, x, y, w, o = {}) {
  const h = w * 0.45, val = o.value ?? '1', c = o.grey ? '#8a8a90' : BILL, d = o.grey ? '#5a5a62' : BILL_D;
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); if (o.a != null) g.globalAlpha *= o.a;
  rr(g, -w / 2, -h / 2, w, h, w * 0.04); g.fillStyle = c; g.fill();
  g.strokeStyle = d; g.lineWidth = w * 0.025; rr(g, -w / 2 + w * 0.05, -h / 2 + w * 0.05, w - w * 0.1, h - w * 0.1, w * 0.03); g.stroke();
  g.fillStyle = alpha(d, 0.55); g.beginPath(); g.ellipse(0, 0, w * 0.13, h * 0.32, 0, 0, Math.PI * 2); g.fill();
  text(g, val, -w * 0.36, -h * 0.22, { size: h * 0.32, color: d, font: FONTS.ui, weight: 900 });
  text(g, val, w * 0.36, h * 0.22, { size: h * 0.32, color: d, font: FONTS.ui, weight: 900 });
  text(g, '$', 0, 0, { size: h * 0.42, color: alpha('#eaf5dc', 0.85), font: FONTS.ui, weight: 900 });
  g.restore();
}

// ---------- the glass jar ----------
// jar(g, x, yBottom, s, { coins, bills, note:'front'|'none', glow, label, grey, sprout, lidOff, dust })
export function jar(g, x, y, s = 1, o = {}) {
  const W = 120 * s, H = 150 * s, top = y - H;
  g.save();
  if (o.glow) glow(g, x, y - H * 0.45, W * 1.6, o.glowColor || '#ffcf7a', 0.35 * o.glow);
  // back glass
  rr(g, x - W / 2, top, W, H, 24 * s); g.fillStyle = alpha('#0a0f1a', 0.18); g.fill();
  rr(g, x - W / 2, top, W, H, 24 * s); g.fillStyle = alpha(GLASS, 0.07); g.fill();
  // contents
  g.save(); rr(g, x - W / 2 + 4 * s, top + 4 * s, W - 8 * s, H - 8 * s, 20 * s); g.clip();
  const r = rng(o.seed || 7), nC = o.coins ?? 0;
  for (let i = 0; i < nC; i++) { const row = Math.floor(i / 5), col = i % 5; const cx = x - W * 0.36 + col * W * 0.18 + (row % 2) * W * 0.08 + (r() - 0.5) * 6 * s, cy = y - 12 * s - row * 9 * s; coin(g, cx, cy, 13 * s, { edge: true, grey: o.grey }); }
  const nB = o.bills ?? 0; for (let i = 0; i < nB; i++) bill(g, x + (r() - 0.5) * W * 0.3, y - 30 * s - Math.floor(nC / 5) * 9 * s - i * 14 * s, W * 0.62, { rot: (r() - 0.5) * 0.9, grey: o.grey, value: o.billValue || '1' });
  if (o.sprout) { const sp = o.sprout, base = y - 14 * s - Math.floor(nC / 5) * 9 * s; seg(g, [[x, base], [x + 4 * s, base - 60 * s * sp], [x - 2 * s, base - 110 * s * sp]], 5 * s, o.grey ? '#6a6a70' : '#5fbf6a'); for (const [k, d] of [[0.45, 1], [0.75, -1], [0.95, 1]]) if (sp > k) { g.fillStyle = o.grey ? '#77757e' : '#79d685'; g.beginPath(); g.ellipse(x + d * 18 * s, base - 110 * s * k * sp - 4 * s, 18 * s * clamp((sp - k) * 4), 8 * s * clamp((sp - k) * 4), d * -0.5, 0, Math.PI * 2); g.fill(); } }
  g.restore();
  // front glass + highlights
  rr(g, x - W / 2, top, W, H, 24 * s); g.strokeStyle = alpha('#e8f4ff', 0.6); g.lineWidth = 3.2 * s; g.stroke();
  g.save(); g.globalCompositeOperation = 'lighter';
  seg(g, [[x - W * 0.34, top + H * 0.2], [x - W * 0.34, top + H * 0.78]], 7 * s, alpha('#ffffff', 0.22));
  seg(g, [[x + W * 0.36, top + H * 0.28], [x + W * 0.36, top + H * 0.45]], 4 * s, alpha('#ffffff', 0.18));
  g.restore();
  // neck + lid
  rr(g, x - W * 0.42, top - 16 * s, W * 0.84, 20 * s, 6 * s); g.strokeStyle = alpha('#e8f4ff', 0.5); g.lineWidth = 2.5 * s; g.stroke();
  if (!o.lidOff) { rr(g, x - W * 0.45, top - 34 * s, W * 0.9, 22 * s, 6 * s); g.fillStyle = '#7c7686'; g.fill(); g.fillStyle = '#a8a2b4'; g.fillRect(x - W * 0.42, top - 31 * s, W * 0.84, 4 * s); for (let i = 1; i < 8; i++) seg(g, [[x - W * 0.45 + i * W * 0.1125, top - 30 * s], [x - W * 0.45 + i * W * 0.1125, top - 16 * s]], 1.5 * s, '#5c5866'); }
  if (o.label) { g.save(); g.translate(x, top + H * 0.35); g.rotate(-0.08); rr(g, -W * 0.36, -16 * s, W * 0.72, 32 * s, 4 * s); g.fillStyle = PAPER; g.fill(); text(g, o.label, 0, 1 * s, { size: 20 * s, color: '#3a2a24', font: FONTS.title, weight: 700 }); g.restore(); }
  if (o.note && o.note !== 'none') note(g, x, top + H * 0.5, W * 0.7, H * 0.38, { rot: -0.05, lines: ['One a day.', "Don't touch."], size: 13 * s, tape: true });
  if (o.dust) { g.fillStyle = alpha('#d8cfc0', 0.12 * o.dust); g.fillRect(x - W * 0.45, top - 34 * s, W * 0.9, 5 * s); }
  g.restore();
  return { top, W, H };
}
// paper note: lines of handwriting (serif italic) or scribbles; flip 0..1 turns it over to the back
export function note(g, x, y, w, h, o = {}) {
  const { rot = 0, lines = [], size = 20, tape = false, back = null, flip = 0, a = 1 } = o;
  g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha *= a;
  const sx = Math.cos(flip * Math.PI); g.scale(Math.max(0.02, Math.abs(sx)), 1);
  const showBack = flip > 0.5;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-w / 2 + 4, -h / 2 + 5, w, h);
  g.fillStyle = showBack ? shade(PAPER, -0.06) : PAPER; g.fillRect(-w / 2, -h / 2, w, h);
  g.strokeStyle = alpha('#b8a888', 0.5); g.lineWidth = Math.max(1, h * 0.012); for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(-w * 0.44, -h / 2 + (h * i) / 5 + h * 0.06); g.lineTo(w * 0.44, -h / 2 + (h * i) / 5 + h * 0.06); g.stroke(); }
  if (!showBack) lines.forEach((ln, i) => text(g, ln, 0, -((lines.length - 1) * size * 0.65) + i * size * 1.3, { size, color: '#3a2a3a', font: FONTS.serif, weight: 900, italic: true }));
  else if (back) back.forEach((ln, i) => text(g, ln, 0, -((back.length - 1) * size * 0.65) + i * size * 1.3, { size, color: '#3a2a3a', font: FONTS.serif, weight: 900, italic: true }));
  if (tape && !showBack) { g.fillStyle = 'rgba(240,235,210,.55)'; g.save(); g.rotate(-0.3); g.fillRect(-w * 0.6, -h * 0.62, w * 0.3, h * 0.2); g.restore(); g.save(); g.rotate(0.3); g.fillRect(w * 0.3, -h * 0.62, w * 0.3, h * 0.2); g.restore(); }
  g.restore();
}
// ghostly writing seen through the paper (from the front)
export function scribble(g, x, y, w, h, seed = 3, col = 'rgba(60,40,60,.18)') { const r = rng(seed); g.save(); g.strokeStyle = col; g.lineWidth = Math.max(1.5, h * 0.03); g.lineCap = 'round'; for (let l = 0; l < 3; l++) { g.beginPath(); const yy = y - h * 0.25 + l * h * 0.25; for (let i = 0; i <= 18; i++) { const xx = x - w * 0.4 + (i / 18) * w * 0.8; const v = yy + Math.sin(i * 1.7 + r() * 3) * h * 0.06; i ? g.lineTo(xx, v) : g.moveTo(xx, v); } g.stroke(); } g.restore(); }

// ---------- phone + app UI ----------
// phoneBody(g, cx, cy, w, screenFn(g, x, y, w, h)) — returns screen rect
export function phoneBody(g, cx, cy, w, drawScreen, o = {}) {
  const h = w * 2.05, x = cx - w / 2, y = cy - h / 2, b = w * 0.05;
  g.save(); if (o.rot) { g.translate(cx, cy); g.rotate(o.rot); g.translate(-cx, -cy); }
  glow(g, cx, cy, w * 1.3, o.glowColor || '#7fb6ff', 0.22 * (o.glowA ?? 1));
  rr(g, x - 3, y - 3, w + 6, h + 6, w * 0.14); g.fillStyle = o.rim || '#5a5468'; g.fill();
  rr(g, x, y, w, h, w * 0.13); g.fillStyle = '#0b0a10'; g.fill();
  const sx = x + b, sy = y + b, sw = w - 2 * b, sh = h - 2 * b;
  g.save(); rr(g, sx, sy, sw, sh, w * 0.1); g.clip(); drawScreen(g, sx, sy, sw, sh);
  if (o.cracked) { g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; const cxx = sx + sw * 0.7, cyy = sy + sh * 0.25; for (let i = 0; i < 9; i++) { const a = i * 0.7 + 0.3; g.beginPath(); g.moveTo(cxx, cyy); g.lineTo(cxx + Math.cos(a) * sw * 0.3, cyy + Math.sin(a) * sw * 0.35); g.lineTo(cxx + Math.cos(a + 0.2) * sw * 0.8, cyy + Math.sin(a + 0.2) * sw * 0.9); g.stroke(); } g.fillStyle = 'rgba(230,220,180,.35)'; g.save(); g.translate(sx + sw * 0.25, sy + sh * 0.82); g.rotate(-0.5); g.fillRect(-sw * 0.3, -14, sw * 0.6, 28); g.restore(); }
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, sx, sy, sx + sw, sy + sh, ['rgba(255,255,255,.08)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)']); g.fillRect(sx, sy, sw, sh); g.restore();
  g.restore();
  rr(g, cx - w * 0.14, sy + w * 0.03, w * 0.28, w * 0.06, w * 0.03); g.fillStyle = '#000'; g.fill();
  g.restore();
  return { sx, sy, sw, sh, h };
}
// big hand holding the phone from below-right (insert shots). thumb: [x,y] target or null
export function phoneHand(g, cx, cy, w, sleeve, rimC, thumb = null, back = false) {
  const h = w * 2.05, ink = S().ink;
  const draw = (col, sl, dx, dy) => {
    g.save(); g.translate(dx, dy);
    seg(g, [[cx + w * 0.1, cy + h * 0.55], [cx + w * 0.9, cy + h * 1.3]], w * 0.62, col);              // wrist
    if (sl) seg(g, [[cx + w * 0.6, cy + h * 0.92], [cx + w * 1.4, cy + h * 1.7]], w * 0.9, sl);        // sleeve
    circle(g, cx + w * 0.16, cy + h * 0.54, w * 0.4, col);                                          // palm
    for (let i = 0; i < 4; i++) seg(g, [[cx - w * 0.4, cy + h * 0.14 + i * h * 0.085], [cx - w * 0.6, cy + h * 0.16 + i * h * 0.085]], w * 0.15, col); // fingers wrapping left edge
    if (thumb) seg(g, [[cx + w * 0.46, cy + h * 0.44], [lerp(cx + w * 0.46, thumb[0], 0.5) + w * 0.14, lerp(cy + h * 0.44, thumb[1], 0.5) + w * 0.04], thumb], w * 0.19, col);
    else seg(g, [[cx + w * 0.46, cy + h * 0.44], [cx + w * 0.58, cy + h * 0.24]], w * 0.19, col);
    g.restore();
  };
  if (back) { draw(rimC, null, -w * 0.03, -w * 0.03); draw(ink, null, 0, 0); return; }
  draw(rimC, null, -w * 0.035, -w * 0.035); draw(ink, sleeve, 0, 0);
}
export function thumbOnly(g, cx, cy, w, thumb, rimC) { const h = w * 2.05, ink = S().ink; for (const [c, d] of [[rimC, -w * 0.03], [ink, 0]]) { g.save(); g.translate(d, d); seg(g, [[cx + w * 0.42, cy + h * 0.22], [lerp(cx + w * 0.42, thumb[0], 0.5) + w * 0.12, lerp(cy + h * 0.22, thumb[1], 0.5) + w * 0.05], thumb], w * 0.19, c); g.restore(); } }

export const fmtMoney = (v, dec = 0) => '$' + Math.round(v).toLocaleString('en-US');
// app screen. o = { mode:'balance'|'call'|'dm'|'toggle'|'block'|'transfer'|'logo'|'number', value, valueColor, label, chip, chipColor, curve, chartP, chartColor, button, btnPress, btnPulse, name, sub, msgs:[[t,str,from]], t }
export function appScreen(g, x, y, w, h, o = {}) {
  const ui = S().ui, t = o.t || 0, u = w / 300;
  g.fillStyle = linGrad(g, 0, y, 0, y + h, o.bg || ['#121c30', '#0a101c']); g.fillRect(x, y, w, h);
  const T = (s, xx, yy, oo = {}) => text(g, s, xx, yy, { font: FONTS.ui, weight: 900, ...oo });
  if (o.mode !== 'call') { T('9:41', x + 30 * u, y + 34 * u, { size: 15 * u, color: alpha(ui.cream, 0.7), align: 'left' }); }
  if (o.mode === 'logo') {
    const k = ease.outBack(prog(t, 0.05, 0.6)); g.save(); g.translate(x + w / 2, y + h * 0.45); g.scale(k, k); jar(g, 0, 50 * u, 0.75 * u, { coins: 6, glow: 1 }); g.restore();
    T('JAR', x + w / 2, y + h * 0.62, { size: 44 * u, color: ui.gold, glow: 20, glowColor: alpha(ui.gold, 0.6), alpha: k });
    T('INVEST · $1 A DAY', x + w / 2, y + h * 0.68, { size: 14 * u, color: alpha(ui.cream, 0.6), spacing: 2, alpha: k }); return;
  }
  if (o.mode === 'call') {
    g.fillStyle = linGrad(g, 0, y, 0, y + h, o.bg || ['#1a1530', '#0b0a16']); g.fillRect(x, y, w, h);
    const pulse = 0.5 + 0.5 * Math.sin(t * 9);
    for (let k = 0; k < 3; k++) ring(g, x + w / 2, y + h * 0.33, 62 * u + ((t * 60 + k * 30) % 90) * u, 2.5 * u, alpha(o.ringColor || ui.cream, 0.4 * (1 - ((t * 60 + k * 30) % 90) / 90)));
    circle(g, x + w / 2, y + h * 0.33, 58 * u, o.avatar || '#8a5ad6'); text(g, o.initial || (o.name || 'MOM')[0], x + w / 2, y + h * 0.335, { size: 58 * u, color: '#fff', font: FONTS.title });
    T(o.name || 'MOM', x + w / 2, y + h * 0.5, { size: 34 * u, color: ui.cream });
    T(o.sub || 'incoming call', x + w / 2, y + h * 0.555, { size: 15 * u, color: alpha(ui.cream, 0.6), spacing: 1 });
    if (o.clock) T(o.clock, x + w / 2, y + h * 0.13, { size: 40 * u, color: alpha(ui.cream, 0.9) });
    circle(g, x + w * 0.27, y + h * 0.84, 30 * u, '#e0453a'); circle(g, x + w * 0.73, y + h * 0.84, 30 * u * (o.accept ? 1.15 : 1 + 0.06 * pulse), '#3fbf6a');
    seg(g, [[x + w * 0.73 - 12 * u, y + h * 0.84 + 6 * u], [x + w * 0.73 - 6 * u, y + h * 0.84 - 10 * u], [x + w * 0.73 + 12 * u, y + h * 0.84 - 4 * u]], 6 * u, '#fff');
    seg(g, [[x + w * 0.27 - 13 * u, y + h * 0.84], [x + w * 0.27 + 13 * u, y + h * 0.84]], 7 * u, '#fff');
    if (o.redFlag) { rr(g, x + w * 0.12, y + h * 0.6, w * 0.76, 34 * u, 10 * u); g.fillStyle = alpha('#e0453a', 0.25); g.fill(); T(o.redFlag, x + w / 2, y + h * 0.6 + 17 * u, { size: 14 * u, color: '#ff8a7a', spacing: 1 }); }
    return;
  }
  T(o.header || 'JAR', x + 30 * u, y + 76 * u, { size: 22 * u, color: ui.gold, align: 'left' });
  if (o.mode === 'dm') {
    T(o.name || 'Mr. Black', x + w / 2, y + 76 * u, { size: 20 * u, color: ui.cream });
    circle(g, x + 40 * u, y + 76 * u, 16 * u, '#1d1a24'); ring(g, x + 40 * u, y + 76 * u, 16 * u, 2 * u, alpha(ui.cream, 0.4));
    seg(g, [[x, y + 104 * u], [x + w, y + 104 * u]], 1.5 * u, alpha(ui.cream, 0.15));
    let yy = y + 140 * u;
    for (const [t0, str, from, col] of (o.msgs || [])) {
      const k = ease.outBack(prog(t, t0, t0 + 0.3)); if (k <= 0) continue;
      const fs = 17 * u, mw = Math.min(w * 0.78, str.length * fs * 0.6 + 34 * u), mine = from === 'me';
      const bx = mine ? x + w - 18 * u - mw : x + 18 * u;
      g.save(); g.globalAlpha *= clamp(k); g.translate(bx + (mine ? mw : 0), yy); g.scale(k, k); g.translate(-(bx + (mine ? mw : 0)), -yy);
      rr(g, bx, yy - 24 * u, mw, 46 * u, 18 * u); g.fillStyle = mine ? '#3a6ea5' : (col || '#2a2438'); g.fill();
      T(str, bx + mw / 2, yy, { size: fs, color: col ? '#fff' : ui.cream }); g.restore(); yy += 60 * u;
    }
    if (o.blocked) { const k = ease.outBack(prog(t, o.blocked, o.blocked + 0.35)); g.save(); g.translate(x + w / 2, y + h * 0.62); g.rotate(-0.18); g.scale(1 + (1 - k) * 0.8, 1 + (1 - k) * 0.8); g.globalAlpha *= clamp(k * 1.5); rr(g, -w * 0.38, -36 * u, w * 0.76, 72 * u, 10 * u); g.strokeStyle = '#ff5a4a'; g.lineWidth = 6 * u; g.stroke(); T('BLOCKED', 0, 2 * u, { size: 40 * u, color: '#ff5a4a', spacing: 3 }); g.restore(); }
    if (o.blockBtn != null) { const pr = t > o.blockBtn; rr(g, x + w * 0.15, y + h - 120 * u, w * 0.7, 60 * u, 30 * u); g.fillStyle = pr ? '#ff5a4a' : alpha('#ff5a4a', 0.25); g.fill(); T('BLOCK', x + w / 2, y + h - 90 * u, { size: 22 * u, color: pr ? '#fff' : '#ff8a7a', spacing: 2 }); }
    return;
  }
  if (o.mode === 'trade') {
    T(o.app || 'QUIKGAIN', x + 30 * u, y + 76 * u, { size: 22 * u, color: '#5fd39a', align: 'left' });
    T('PORTFOLIO', x + 30 * u, y + h * 0.2, { size: 15 * u, color: alpha(ui.cream, 0.6), align: 'left', spacing: 2 });
    const pv = o.from != null ? lerp(o.from, o.to, ease.inOut(prog(t, o.cStart ?? 0.2, (o.cStart ?? 0.2) + (o.cDur ?? 1.5)))) : o.value;
    T(o.valueStr || fmtMoney(pv), x + 28 * u, y + h * 0.27, { size: 52 * u, color: o.valueColor || '#5fd39a', align: 'left', glow: 22, glowColor: 'rgba(95,211,154,.55)' });
    const ch = o.chip || '+3% TODAY'; rr(g, x + 30 * u, y + h * 0.315, (ch.length * 11 + 26) * u, 32 * u, 16 * u); g.fillStyle = alpha(o.chipColor || '#5fd39a', 0.22); g.fill(); T(ch, x + 43 * u, y + h * 0.315 + 17 * u, { size: 17 * u, color: o.chipColor || '#5fd39a', align: 'left' });
    const cx0 = x + 24 * u, cx1 = x + w - 24 * u, cy0 = y + h * 0.66, cy1 = y + h * 0.42; g.beginPath(); for (let i = 0; i <= 60; i++) { const v = i / 60; const yy = lerp(cy0, cy1, Math.pow(v, 2.2) + Math.sin(v * 30) * 0.02); i ? g.lineTo(lerp(cx0, cx1, v), yy) : g.moveTo(lerp(cx0, cx1, v), yy); } g.strokeStyle = '#5fd39a'; g.lineWidth = 4 * u; g.stroke();
    for (let i = 0; i < 3; i++) poly(g, [[x + w * (0.25 + i * 0.25), y + h * 0.71], [x + w * (0.25 + i * 0.25) - 10 * u, y + h * 0.73], [x + w * (0.25 + i * 0.25) + 10 * u, y + h * 0.73]], alpha('#5fd39a', 0.5));
    if (o.flagged != null && t > o.flagged) { const k = ease.outBack(prog(t, o.flagged, o.flagged + 0.3)); g.save(); g.translate(x + w / 2, y + h * 0.5); g.scale(k, k); rr(g, -w * 0.44, -70 * u, w * 0.88, 140 * u, 14 * u); g.fillStyle = '#2a0e12'; g.fill(); g.strokeStyle = '#ff5a4a'; g.lineWidth = 3 * u; g.stroke(); T('ACCOUNT FLAGGED', 0, -32 * u, { size: 22 * u, color: '#ff5a4a', spacing: 2 }); T('Pay $8,000 deposit', 0, 6 * u, { size: 17 * u, color: ui.cream }); T('to release funds', 0, 32 * u, { size: 17 * u, color: ui.cream }); g.restore(); }
    if (o.button) { const pr = o.btnPress != null && t > o.btnPress, pulse = 0.5 + 0.5 * Math.sin(t * 5), bw = w * 0.76, bh = 66 * u, bx = x + (w - bw) / 2, by = y + h * 0.8, bc = o.btnColor || '#3fbf6a';
      glow(g, x + w / 2, by + bh / 2, bw * 0.7, bc, 0.25 + 0.25 * pulse); rr(g, bx, by, bw, bh, bh / 2); g.fillStyle = pr ? shade(bc, 0.2) : bc; g.fill(); T(o.button, x + w / 2, by + bh / 2 + 1 * u, { size: 24 * u, color: '#fff', spacing: 3 }); return { button: [x + w / 2, by + bh / 2] }; }
    return { button: [x + w / 2, y + h * 0.8 + 33 * u] };
  }
  if (o.mode === 'feed') {
    T('FEED', x + 30 * u, y + 76 * u, { size: 22 * u, color: ui.cream, align: 'left' });
    const posts = [['+340%', 'car'], ['+1,200%', 'up'], ['+87% TODAY', 'up'], ['NEW CAR!', 'car'], ['+500%', 'up'], ['QUIT MY JOB', 'up']];
    const off = (t * 90 * u) % (170 * u);
    posts.forEach((p, i) => { const py = y + 110 * u + i * 170 * u - off; if (py > y + h) return; rr(g, x + 18 * u, py, w - 36 * u, 150 * u, 14 * u); g.fillStyle = '#1a2436'; g.fill(); circle(g, x + 46 * u, py + 30 * u, 14 * u, ['#f29ac0', '#3a6ea5', '#d6a43a', '#8a5ad6', '#3fb950', '#e0453a'][i]); rr(g, x + 70 * u, py + 22 * u, 90 * u, 14 * u, 7 * u); g.fillStyle = alpha(ui.cream, 0.25); g.fill(); T(p[0], x + 40 * u, py + 95 * u, { size: 34 * u, color: '#5fd39a', align: 'left', glow: 14, glowColor: 'rgba(95,211,154,.5)' }); poly(g, [[x + w - 70 * u, py + 110 * u], [x + w - 40 * u, py + 70 * u], [x + w - 10 * u - 30 * u, py + 110 * u]], '#5fd39a'); });
    return;
  }
  if (o.mode === 'search') {
    rr(g, x + 20 * u, y + 100 * u, w - 40 * u, 50 * u, 25 * u); g.fillStyle = '#1a2436'; g.fill();
    const q = o.query || 'QUIKGAIN', n = Math.floor(clamp(t / 1.0) * q.length); T(q.slice(0, n) + (t % 0.6 < 0.3 ? '|' : ''), x + 44 * u, y + 125 * u, { size: 20 * u, color: ui.cream, align: 'left' });
    T('REGISTERED FIRMS', x + 30 * u, y + 190 * u, { size: 14 * u, color: alpha(ui.cream, 0.5), align: 'left', spacing: 2 });
    if (t > (o.resultAt ?? 1.3)) { const k = ease.outBack(prog(t, o.resultAt ?? 1.3, (o.resultAt ?? 1.3) + 0.3)); g.save(); g.translate(x + w / 2, y + h * 0.48); g.scale(k, k); T('0 RESULTS', 0, 0, { size: 44 * u, color: '#ff5a4a' }); T('not registered', 0, 44 * u, { size: 18 * u, color: alpha(ui.cream, 0.7) }); g.restore(); }
    return;
  }
  if (o.mode === 'video') {
    g.fillStyle = '#0b0a14'; g.fillRect(x, y, w, h); circle(g, x + w / 2, y + h * 0.35, 60 * u, '#3a2a40'); T('J', x + w / 2, y + h * 0.355, { size: 60 * u, color: '#fff' });
    T('Jade', x + w / 2, y + h * 0.5, { size: 30 * u, color: ui.cream }); const ended = t > (o.endAt ?? 1.5);
    T(ended ? 'call declined' : 'video calling' + '...'.slice(0, 1 + Math.floor(t * 3) % 3), x + w / 2, y + h * 0.55, { size: 16 * u, color: ended ? '#ff5a4a' : alpha(ui.cream, 0.6) });
    if (ended) T('USER UNAVAILABLE', x + w / 2, y + h * 0.7, { size: 18 * u, color: alpha(ui.cream, 0.5), spacing: 2 });
    return;
  }
  if (o.mode === 'toggle') {
    T('AUTO-INVEST', x + 30 * u, y + h * 0.3, { size: 22 * u, color: ui.cream, align: 'left' }); T('$1 every day · index fund', x + 30 * u, y + h * 0.3 + 30 * u, { size: 14 * u, color: alpha(ui.cream, 0.55), align: 'left' });
    const k = ease.inOut(prog(t, o.on ?? 0.6, (o.on ?? 0.6) + 0.25)), tx = x + w - 90 * u, ty = y + h * 0.3 + 10 * u;
    rr(g, tx, ty - 20 * u, 70 * u, 40 * u, 20 * u); g.fillStyle = mix('#3a3f55', '#3fbf6a', k); g.fill(); circle(g, tx + 20 * u + 30 * u * k, ty, 16 * u, '#fff');
    if (k > 0.9) { T('ON', x + w / 2, y + h * 0.55, { size: 40 * u, color: '#5fd39a', glow: 18, glowColor: 'rgba(95,211,154,.6)', alpha: clamp((t - (o.on ?? 0.6) - 0.25) * 4) }); }
    return;
  }
  if (o.mode === 'transfer') {
    const p = ease.inOut(prog(t, o.tStart ?? 0.3, (o.tStart ?? 0.3) + (o.tDur ?? 1.6)));
    T(o.fromLabel || 'YOUR ACCOUNT', x + w / 2, y + h * 0.2, { size: 15 * u, color: alpha(ui.cream, 0.6), spacing: 2 });
    T(fmtMoney(lerp(o.from0, o.from1, p)), x + w / 2, y + h * 0.27, { size: 36 * u, color: ui.gold });
    for (let i = 0; i < 6; i++) { const k = ((t * 1.2 + i / 6) % 1); if (p > 0 && p < 1) coin(g, x + w / 2 + Math.sin(i * 2) * 10 * u, lerp(y + h * 0.34, y + h * 0.62, k), 10 * u, { a: Math.sin(k * Math.PI) }); }
    poly(g, [[x + w / 2 - 16 * u, y + h * 0.6], [x + w / 2 + 16 * u, y + h * 0.6], [x + w / 2, y + h * 0.63]], alpha(ui.cream, 0.5));
    T(o.toLabel || "MOM'S ACCOUNT", x + w / 2, y + h * 0.7, { size: 15 * u, color: alpha(ui.cream, 0.6), spacing: 2 });
    T(fmtMoney(lerp(o.to0, o.to1, p)), x + w / 2, y + h * 0.77, { size: 36 * u, color: o.toColor || '#5fd39a' });
    return;
  }
  // balance (default)
  T(o.label || 'BALANCE', x + 30 * u, y + h * 0.2, { size: 15 * u, color: alpha(ui.cream, 0.6), align: 'left', spacing: 2 });
  const val = o.valueStr || (o.value != null ? fmtMoney(o.value) : '');
  const vs = Math.min(56 * u, (w - 50 * u) / Math.max(1, val.length * 0.58));
  T(val, x + 28 * u, y + h * 0.27, { size: vs, color: o.valueColor || ui.gold, align: 'left', glow: 22, glowColor: alpha(o.valueColor || ui.gold, 0.55) });
  if (o.strike) { const k = ease.out(prog(t, o.strike, o.strike + 0.4)); seg(g, [[x + 24 * u, y + h * 0.27], [x + 24 * u + (w - 60 * u) * k, y + h * 0.27]], 5 * u, '#ff6f61'); }
  if (o.chip) { const k = ease.outBack(prog(t, o.chipAt ?? 0.4, (o.chipAt ?? 0.4) + 0.3)); if (k > 0) { g.save(); g.translate(x + 30 * u, y + h * 0.335); g.scale(k, k); rr(g, 0, -16 * u, (o.chip.length * 11 + 26) * u, 32 * u, 16 * u); g.fillStyle = alpha(o.chipColor || '#5fd39a', 0.22); g.fill(); T(o.chip, 13 * u, 1 * u, { size: 17 * u, color: o.chipColor || '#5fd39a', align: 'left' }); g.restore(); } }
  // chart
  const cx0 = x + 24 * u, cx1 = x + w - 24 * u, cy0 = y + h * 0.66, cy1 = y + h * 0.42, curve = o.curveType === 'crash' ? ((v) => (v < 0.7 ? 0.2 + v * 0.9 : 0.83 - (v - 0.7) * 1.9)) : o.curve || ((v) => v * v), cp = o.chartP ?? 1;
  g.strokeStyle = alpha(ui.cream, 0.08); g.lineWidth = 1.5 * u; for (let i = 0; i < 4; i++) { const yy = lerp(cy0, cy1, i / 3); g.beginPath(); g.moveTo(cx0, yy); g.lineTo(cx1, yy); g.stroke(); }
  const col = o.chartColor || ui.gold; g.beginPath(); for (let i = 0; i <= 80; i++) { const v = (i / 80) * cp; const px = lerp(cx0, cx1, v), py = lerp(cy0, cy1, curve(v)); i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.strokeStyle = col; g.lineWidth = 4 * u; g.lineJoin = 'round'; g.stroke();
  const end = [lerp(cx0, cx1, cp), lerp(cy0, cy1, curve(cp))]; glow(g, end[0], end[1], 30 * u, col, 0.8); circle(g, end[0], end[1], 5 * u, '#fff');
  if (o.button) {
    const pr = o.btnPress != null && t > o.btnPress, pulse = o.btnPulse ? 0.5 + 0.5 * Math.sin(t * 5) : 0;
    const bw = w * 0.76, bh = 66 * u, bx = x + (w - bw) / 2, by = y + h * 0.8;
    if (pulse || pr) glow(g, x + w / 2, by + bh / 2, bw * 0.7, '#ff6f61', 0.25 + 0.25 * pulse + (pr ? 0.4 : 0));
    g.save(); const sc = pr ? 0.94 : 1; g.translate(x + w / 2, by + bh / 2); g.scale(sc, sc); g.translate(-(x + w / 2), -(by + bh / 2));
    rr(g, bx, by, bw, bh, bh / 2); g.fillStyle = pr ? '#ff6f61' : alpha('#ff6f61', 0.18); g.fill(); g.strokeStyle = '#ff6f61'; g.lineWidth = 2.5 * u; g.stroke();
    T(o.button, x + w / 2, by + bh / 2 + 1 * u, { size: 24 * u, color: pr ? '#fff' : '#ff8a7a', spacing: 3 }); g.restore();
    return { button: [x + w / 2, by + bh / 2] };
  }
  return { button: [x + w / 2, y + h * 0.8 + 33 * u] };
}

// ---------- car, pizza, cup ----------
export function car(g, x, y, s = 1, color = '#f2c21a', o = {}) {
  const c = color, d = shade(c, -0.35), ink = S().ink;
  g.save(); g.translate(x, y); g.scale(s * (o.facing || 1), s);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(0, 4, 230, 16, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = c; g.beginPath(); g.moveTo(-220, -30); g.quadraticCurveTo(-224, -80, -180, -86); g.lineTo(-110, -92); g.quadraticCurveTo(-60, -150, 10, -152); g.lineTo(80, -150); g.quadraticCurveTo(130, -140, 160, -96); g.quadraticCurveTo(222, -88, 226, -50); g.lineTo(226, -24); g.quadraticCurveTo(226, -10, 210, -10); g.lineTo(-206, -10); g.quadraticCurveTo(-220, -10, -220, -30); g.fill();
  g.fillStyle = shade(c, -0.15); g.fillRect(-220, -42, 446, 14);
  g.fillStyle = '#141826'; g.beginPath(); g.moveTo(-90, -96); g.quadraticCurveTo(-50, -138, 6, -140); g.lineTo(6, -96); g.closePath(); g.fill(); g.beginPath(); g.moveTo(20, -140); g.lineTo(76, -138); g.quadraticCurveTo(116, -130, 140, -96); g.lineTo(20, -96); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(160,200,255,.18)'; g.beginPath(); g.moveTo(-70, -100); g.lineTo(-30, -134); g.lineTo(-14, -134); g.lineTo(-54, -100); g.fill(); g.restore();
  for (const wx of [-140, 140]) { circle(g, wx, -12, 40, ink); circle(g, wx, -12, 22, '#55505e'); circle(g, wx, -12, 8, '#2a2630'); }
  if (o.lights !== false) { glow(g, 222, -56, 60, '#fff3d0', 0.6); rr(g, 210, -64, 16, 14, 4); g.fillStyle = '#fff6dd'; g.fill(); rr(g, -222, -60, 10, 14, 3); g.fillStyle = '#ff4a3a'; g.fill(); glow(g, -220, -54, 40, '#ff4a3a', 0.4); }
  if (o.shine) { g.save(); g.globalCompositeOperation = 'lighter'; const sx = -220 + ((o.shine * 600) % 700); g.fillStyle = linGrad(g, sx - 50, 0, sx + 50, 0, ['rgba(255,255,255,0)', 'rgba(255,255,255,.55)', 'rgba(255,255,255,0)']); g.beginPath(); g.moveTo(-220, -30); g.quadraticCurveTo(-224, -80, -180, -86); g.lineTo(-110, -92); g.quadraticCurveTo(-60, -150, 10, -152); g.lineTo(80, -150); g.quadraticCurveTo(130, -140, 160, -96); g.quadraticCurveTo(222, -88, 226, -50); g.lineTo(226, -10); g.lineTo(-220, -10); g.closePath(); g.fill(); g.restore(); }
  g.restore();
}
export function pizza(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -70, -8, 140, 16, 3); g.fillStyle = '#b89464'; g.fill();
  circle(g, 0, -10, 62, '#c98a45'); circle(g, 0, -10, 52, '#f0c24a');
  for (const [a, b] of [[-22, -28], [18, -20], [-6, 8], [26, 14], [-30, 10], [4, -40]]) circle(g, a, b - 10, 9, '#b8452f');
  g.strokeStyle = 'rgba(120,70,30,.5)'; g.lineWidth = 2; for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 4; g.beginPath(); g.moveTo(Math.cos(a) * 52, -10 + Math.sin(a) * 52); g.lineTo(-Math.cos(a) * 52, -10 - Math.sin(a) * 52); g.stroke(); }
  g.restore();
}
export function teacup(g, x, y, s = 1, steam = 0, t = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -16, -24, 32, 24, 6); g.fillStyle = '#f2ece4'; g.fill(); seg(g, [[16, -18], [24, -13], [16, -6]], 4, '#f2ece4'); g.fillStyle = '#e8e0d4'; g.beginPath(); g.ellipse(0, 0, 26, 5, 0, 0, Math.PI * 2); g.fill();
  if (steam) for (let i = 0; i < 3; i++) { g.strokeStyle = `rgba(255,245,230,${0.25 * steam})`; g.lineWidth = 3; g.beginPath(); for (let k = 0; k <= 10; k++) { const yy = -28 - k * 6, xx = -8 + i * 8 + Math.sin(t * 2 + k * 0.6 + i) * 4; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  g.restore();
}
// wall calendar with big label
export function trafficLight(g, x, y, s = 1, state = 'red', t = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#15121c'; g.fillRect(-6, -420, 12, 420); rr(g, -34, -560, 68, 170, 12); g.fill(); const cols = { red: '#ff3a2a', yellow: '#ffc23a', green: '#3fe07a' }; ['red', 'yellow', 'green'].forEach((c, i) => { const on = c === state; circle(g, 0, -530 + i * 52, 20, on ? cols[c] : shade(cols[c], -0.7)); if (on) { glow(g, 0, -530 + i * 52, 160, cols[c], 0.7); } }); g.restore(); }
export function pan(g, x, y, s = 1, flip = 0) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[30, 0], [90, -10]], 7, '#2a2028'); g.fillStyle = '#2a2830'; g.beginPath(); g.ellipse(0, 0, 36, 9, 0, 0, Math.PI * 2); g.fill(); const py = -Math.sin(flip * Math.PI) * 70; g.save(); g.translate(0, py - 6); g.scale(1, Math.max(0.15, Math.abs(Math.cos(flip * Math.PI * 2)))); g.fillStyle = '#e8b464'; g.beginPath(); g.ellipse(0, 0, 26, 8, 0, 0, Math.PI * 2); g.fill(); g.restore(); g.restore(); }
export function calendar(g, x, y, w, label = 'SUN', o = {}) { const h = w * 1.1; g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x - w / 2 + 5, y + 5, w, h); g.fillStyle = '#efe6d6'; g.fillRect(x - w / 2, y, w, h); g.fillStyle = o.color || '#c0453a'; g.fillRect(x - w / 2, y, w, h * 0.26); text(g, o.top || 'SUNDAY', x, y + h * 0.13, { size: w * 0.14, color: '#fff', font: FONTS.ui, weight: 900 }); text(g, label, x, y + h * 0.62, { size: w * 0.42, color: '#2a2230', font: FONTS.ui, weight: 900 }); }
