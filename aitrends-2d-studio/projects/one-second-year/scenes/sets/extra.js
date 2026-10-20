// sets/extra.js: sets and props new to this video: football pitch, storm, hospital, the frozen void,
// plus the record player, glasses, spoon, heart monitor and a big clock face.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { GYd } from '../lib.js';
import { park, road } from './outdoor.js';
import { classroom } from './indoor.js';

// football pitch at golden hour: park + touchline + a goal on the right (goalX = near post)
export function pitch(g, t, cam, o = {}) {
  const r = park(g, t, cam, { mood: o.mood || 'golden' });
  const { GY, M } = r, gx = o.goalX ?? E.W * 0.78;
  layer(g, cam, 0.92, (g) => {
    for (let i = 0; i < 6; i++) { g.fillStyle = alpha(i % 2 ? shade(M.grass, -0.15) : shade(M.grass, -0.3), 0.35); g.fillRect(-E.W + i * 640, GY - 10, 640, 400); }
    g.fillStyle = alpha('#f4ece0', 0.55); g.fillRect(-E.W, GY + 40, E.W * 3, 4);
    if (o.goal !== false) goal(g, gx, GY, o.goalS ?? 1, M);
  });
  return { ...r, goalX: gx };
}
export function goal(g, x, GY, s = 1, M) {
  const w = 520 * s, h = 250 * s, white = '#f4f0ea';
  g.save(); g.strokeStyle = alpha('#e8e4f0', 0.25); g.lineWidth = 1.5;
  for (let i = 0; i <= 14; i++) { g.beginPath(); g.moveTo(x + i * w / 14, GY - h); g.lineTo(x + i * w / 14 + 60 * s, GY - h + 40 * s); g.lineTo(x + i * w / 14 + 60 * s, GY); g.stroke(); }
  for (let j = 0; j <= 8; j++) { g.beginPath(); g.moveTo(x, GY - h + j * h / 8); g.lineTo(x + w, GY - h + j * h / 8); g.stroke(); }
  g.restore();
  seg(g, [[x, GY], [x, GY - h], [x + w, GY - h], [x + w, GY]], 12 * s, white); glow(g, x, GY - h, 60, M.rim, 0.25);
}

// storm over the city at night
export function storm(g, t, cam, o = {}) {
  const r = road(g, t, cam, { mood: 'storm', night: false, rain: o.rain !== false });
  return r;
}
// a lightning bolt that grows over time k (0..1); deterministic jagged path
export function bolt(g, x1, y1, x2, y2, k, o = {}) {
  const { seed = 5, w = 6, color = '#dfe8ff', branches = 4 } = o, rr2 = rng(seed);
  const n = 18, pts = [[x1, y1]]; for (let i = 1; i <= n; i++) { const u = i / n; pts.push([x1 + (x2 - x1) * u + (rr2() - 0.5) * 90 * (i < n ? 1 : 0), y1 + (y2 - y1) * u + (rr2() - 0.5) * 20]); }
  const m = Math.max(1, Math.floor(n * k)) + 1, P = pts.slice(0, m);
  g.save(); g.globalCompositeOperation = 'lighter'; g.shadowColor = color; g.shadowBlur = 30; seg(g, P, w, alpha(color, 0.95)); seg(g, P, w * 0.4, '#ffffff'); g.restore();
  for (let b = 0; b < branches; b++) { const at = 3 + Math.floor(rr2() * (n - 6)); if (at >= m - 1) continue; const [bx, by] = pts[at]; const L = 3 + Math.floor(rr2() * 4), dir = rr2() > 0.5 ? 1 : -1; const bp = [[bx, by]]; for (let i = 1; i <= L; i++) bp.push([bx + dir * i * 50 + (rr2() - 0.5) * 30, by + i * 45]); const bk = Math.min(bp.length, 1 + Math.floor((m - at) / 2)); if (bk > 1) { g.save(); g.globalCompositeOperation = 'lighter'; g.shadowColor = color; g.shadowBlur = 18; seg(g, bp.slice(0, bk), w * 0.45, alpha(color, 0.8)); g.restore(); } }
  glow(g, P[P.length - 1][0], P[P.length - 1][1], 160, color, 0.4);
}

// hospital room, soft morning: pale wall, window light, bed with rails, monitor, IV pole
export function hospital(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = GYd(), CX = E.W / 2, warm = mood('interiorWarm');
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.1), shade(M.wall, 0.12)]); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H);
    const wx = CX - V(700, 400), wy = GY - V(640, 1000), ww = V(420, 380), wh = V(380, 440);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(M.wall, -0.4), bar: 10, blinds: 8 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, warm.sky); g.fillRect(x, y, w, h); FX.sun(g, x + w * 0.6, y + h * 0.5, 40, '#fff7e6', warm.key, 4); });
    FX.godRays(g, wx + ww / 2, wy + wh / 2, { count: 7, angle: Math.PI * 0.3, spread: 0.6, len: 1400, a: 0.07, color: warm.key, t });
    g.fillStyle = shade(M.wall, -0.25); g.fillRect(-E.W, GY - V(260, 320), E.W * 3, 10);
  });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, 0.3), shade(M.dark, 0.0)]); g.fillRect(-E.W, GY - 4, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.15)', 0.1); FX.pool(g, CX - 200, GY + 40, 700, 90, warm.key, 0.22);
    const mx = CX + V(620, 330), my = GY - V(420, 520);
    seg(g, [[mx, GY], [mx, my + 140]], 8, '#3a3a48'); FX.screen(g, { x: mx - 90, y: my, w: 180, h: 120, glowC: '#5fd39a', a: 0.25, bg: '#0a1a14' }, (g, x, y, w, h) => ecg(g, x, y + h * 0.55, w, h * 0.35, t, '#5fd39a'));
    const ix = CX - V(500, 300); seg(g, [[ix, GY], [ix, GY - 420]], 5, '#8a8a98'); seg(g, [[ix - 40, GY - 420], [ix + 40, GY - 420]], 5, '#8a8a98'); rr(g, ix - 22, GY - 410, 44, 70, 14); g.fillStyle = alpha('#cfe8ff', 0.6); g.fill();
  });
  return { GY, CX, M };
}
export function hospitalBed(g, x, GY, w = 560, c = '#d8dce8') {
  const top = GY - 130; g.fillStyle = shade(c, -0.5); g.fillRect(x - w / 2, top, w, 16); for (const dx of [-w / 2 + 20, w / 2 - 20]) seg(g, [[x + dx, top], [x + dx, GY]], 8, shade(c, -0.5));
  rr(g, x - w / 2, top - 40, w, 44, 14); g.fillStyle = '#e8eaf2'; g.fill(); rr(g, x - w / 2 + 10, top - 70, 120, 40, 14); g.fillStyle = '#f4f6fa'; g.fill();
  seg(g, [[x + w / 2 - 10, top - 10], [x + w / 2 - 10, top - 120], [x + w / 2 - 60, top - 120]], 8, shade(c, -0.3));
  return { top: top - 40 };
}
// heart-monitor trace; flat=true draws a flat line; beatAt: local time of a single beat
export function ecg(g, x, y, w, h, t, c = '#5fd39a', o = {}) {
  g.strokeStyle = c; g.lineWidth = 3; g.beginPath();
  for (let i = 0; i <= 120; i++) { const u = i / 120, px = x + u * w; let v = 0;
    if (!o.flat) { const ph = ((u * 2.5 - t * 1.2) % 1 + 1) % 1; v = ph < 0.04 ? -ph * 6 : ph < 0.08 ? (ph - 0.04) * 30 - 0.24 : ph < 0.12 ? 1 - (ph - 0.08) * 30 : 0; }
    else if (o.beatAt != null) { const d = u - o.beatU; v = Math.abs(d) < 0.03 ? Math.max(0, 1 - Math.abs(d) / 0.03) * (t > o.beatAt ? 1 : 0) : 0; }
    i ? g.lineTo(px, y - v * h) : g.moveTo(px, y - v * h); }
  g.stroke(); glow(g, x + w, y, 30, c, 0.5);
}

// the frozen year: dark blue endless space, faint perspective floor, drifting dust
export function voidSpace(g, t, cam, o = {}) {
  const M = mood('void'), GY = GYd(), CX = E.W / 2, c = o.color || '#8fb8e8';
  layer(g, cam, 0.3, (g) => { backdrop(g, ['#05070f', '#0b1222', '#121a30']); glow(g, CX, GY - 200, 1100, c, 0.08); FX.stars(g, 0, { count: 90, area: [-E.W, 0, E.W * 3, E.H * 0.7], color: alpha(c, 0.6) }); });
  layer(g, cam, 0.8, (g) => { g.strokeStyle = alpha(c, 0.12); g.lineWidth = 1.5; for (let i = -20; i <= 20; i++) { g.beginPath(); g.moveTo(CX + i * 40, GY); g.lineTo(CX + i * 400, E.H * 2); g.stroke(); } for (let j = 0; j < 10; j++) { const y = GY + j * j * 8; g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); } FX.fog(g, GY - 120, 260, c, 0.08); });
  FX.dust(g, t * 0.15, { count: 60, color: c, a: 0.35, speed: 2 });
  return { GY, CX, M };
}

// ---------- props ----------
export function recordPlayer(g, x, y, s = 1, t = 0, spin = true, M) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -150, -50, 300, 50, 8); g.fillStyle = '#3a2418'; g.fill(); g.fillStyle = 'rgba(255,210,150,.3)'; g.fillRect(-146, -50, 292, 3);
  g.fillStyle = '#0c0b10'; g.beginPath(); g.ellipse(-20, -56, 110, 22, 0, 0, Math.PI * 2); g.fill();
  const a = spin ? t * 4 : 0; g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1.5; for (const rr2 of [40, 60, 80, 100]) { g.beginPath(); g.ellipse(-20, -56, rr2, rr2 * 0.2, 0, a, a + 2); g.stroke(); }
  g.fillStyle = '#d64a5a'; g.beginPath(); g.ellipse(-20, -56, 26, 6, 0, 0, Math.PI * 2); g.fill();
  seg(g, [[120, -60], [110, -110], [40, -70]], 5, '#c8c2d0'); circle(g, 120, -60, 10, '#c8c2d0');
  g.restore();
}
export function glassesProp(g, x, y, s = 1, rot = 0, c = '#efe8e0') { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 5; for (const dx of [-34, 34]) { g.beginPath(); g.arc(dx, 0, 26, 0, Math.PI * 2); g.stroke(); g.fillStyle = 'rgba(200,225,255,.18)'; g.fill(); } seg(g, [[-8, -4], [8, -4]], 4, c); seg(g, [[-60, -6], [-90, -14]], 4, c); seg(g, [[60, -6], [90, -14]], 4, c); g.restore(); }
export function spoonProp(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = '#d8dce6'; g.beginPath(); g.ellipse(-60, 0, 26, 16, 0, 0, Math.PI * 2); g.fill(); seg(g, [[-36, 0], [80, -4]], 9, '#d8dce6'); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(-66, -5, 10, 5, -0.3, 0, Math.PI * 2); g.fill(); g.restore(); }
export function bigClock(g, x, y, R, secT, o = {}) {
  circle(g, x, y, R, o.face || '#efe8e0'); ring(g, x, y, R, R * 0.05, '#1a1622');
  for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30; seg(g, [[x + Math.cos(a) * R * (i % 5 ? 0.9 : 0.8), y + Math.sin(a) * R * (i % 5 ? 0.9 : 0.8)], [x + Math.cos(a) * R * 0.95, y + Math.sin(a) * R * 0.95]], i % 5 ? R * 0.012 : R * 0.03, '#1a1622'); }
  const sa = -Math.PI / 2 + (secT / 60) * Math.PI * 2; seg(g, [[x, y], [x + Math.cos(-Math.PI / 2 + 1.1) * R * 0.5, y + Math.sin(-Math.PI / 2 + 1.1) * R * 0.5]], R * 0.04, '#1a1622'); seg(g, [[x, y], [x + Math.cos(-Math.PI / 2 + 4.2) * R * 0.7, y + Math.sin(-Math.PI / 2 + 4.2) * R * 0.7]], R * 0.03, '#1a1622');
  seg(g, [[x, y], [x + Math.cos(sa) * R * 0.85, y + Math.sin(sa) * R * 0.85]], R * 0.015, o.hand || '#e04a3a'); circle(g, x, y, R * 0.04, '#1a1622');
}
export function heartIcon(g, x, y, s, c, a = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = alpha(c, a); g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-60, -10, -40, -60, 0, -30); g.bezierCurveTo(40, -60, 60, -10, 0, 30); g.fill(); g.restore(); }
export function notes(g, t, x, y, o = {}) { const { count = 5, color = S().ui.gold, spread = 300, a = 1 } = o; for (let i = 0; i < count; i++) { const ph = (t * 0.35 + i / count) % 1, nx = x + Math.sin(i * 2.3 + t) * spread * 0.4 + (i - count / 2) * spread / count, ny = y - ph * 240; g.save(); g.globalAlpha *= a * Math.sin(ph * Math.PI); g.fillStyle = color; g.beginPath(); g.ellipse(nx, ny, 12, 9, -0.4, 0, 7); g.fill(); seg(g, [[nx + 10, ny - 2], [nx + 10, ny - 44]], 3, color); if (i % 2) seg(g, [[nx + 10, ny - 44], [nx + 26, ny - 36]], 3, color); g.restore(); } }
export function frame(g, x, y, w, h, draw, c = '#efe6d2') { rr(g, x - 14, y - 14, w + 28, h + 28, 8); g.fillStyle = c; g.fill(); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); draw(g, x, y, w, h); g.restore(); }
export { classroom };
