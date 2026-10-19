// shots/03_plus.js: PLUS (catch with Mia, video games, movies) and MINUS (flickering hallway). s032-s054
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix, rng,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, insertBg, slowTint, slowBadge, popIn, label, stamp, ball } from '../lib.js';
import { park } from '../sets/outdoor.js';
import { bedroom, cinema, hallway } from '../sets/indoor.js';
import { THEO, MIA, EXTRA, EXTRA2, EXTRA3 } from '../cast.js';

const chapter = (g, t, str, color, at = 0.2) => { const k = popIn(t, at); if (k <= 0) return; g.save(); g.translate(V(170, 140), V(120, 170)); g.scale(k, k); rr(g, -110, -40, 220, 80, 40); g.fillStyle = alpha(color, 0.18); g.fill(); g.strokeStyle = color; g.lineWidth = 4; g.stroke(); text(g, str, 0, 2, { size: 46, color, font: FONTS.title, weight: 700, spacing: 4, glow: 16, glowColor: alpha(color, 0.6) }); g.restore(); };

// ---------- park: catch ----------
const P = () => ({ theo: E.W / 2 - V(330, 220), mia: E.W / 2 + V(330, 220) });
function parkTwo(g, t, cam, o = {}) {
  const { GY, M } = park(g, t, cam), p = P(), s = o.s ?? 1.35, rim = rimOf(M, [-0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: p.theo, y: GY, s, facing: 1, outfit: THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'smile', talk: o.theoTalk || 0, look: o.theoLook, rim, blink: blinkAt(t, 3.2), prop: o.theoProp });
    drawFigure(g, { x: p.mia + (o.miaDx || 0), y: GY, s, facing: -1, outfit: MIA, pose: o.miaPose || breathe(POSES.relaxed, t, 1, 3), expr: o.miaExpr || 'happy', talk: o.miaTalk || 0, rim, blink: blinkAt(t, 2.9, 1) });
    o.extra?.(g, GY, s);
  });
  FX.dust(g, t, { count: 45, color: '#ffe2bd', a: 0.35 });
  return { GY, M };
}
registerShot('s032', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06, x0: -30, x1: 30 }), p = P();
  const ph = (t % 1.4) / 1.4, dir = Math.floor(t / 1.4) % 2, x0 = dir ? p.mia - 50 : p.theo + 50, x1 = dir ? p.theo + 50 : p.mia - 50;
  parkTwo(g, t, cam, { theoPose: breathe(POSES.holdFront, t), miaPose: breathe(POSES.holdFront, t, 1, 3), extra: (g, GY, s) => ball(g, lerp(x0, x1, ph), GY - 150 * s - Math.sin(ph * Math.PI) * 260, 16, t * 6) });
  chapter(g, t, 'PLUS', S().ui.good);
} });
registerShot('s033', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.35, z1: 1.42, x0: 60, x1: 80, y0: 150, y1: 160 }), p = P();
  const tT = wt(info, 'throws', 1.4), wind = { ...POSES.point, eF: [-30, -180], hF: [-50, -214] }, thr = { ...POSES.point, eF: [36, -176], hF: [74, -170] };
  const fly = prog(t, tT + 0.1, tT + 1.6);
  parkTwo(g, t, cam, { theoExpr: fly > 0 ? 'surprised' : 'smile', miaExpr: t > tT - 0.6 ? 'smirk' : 'happy', miaPose: posesAt(t, [[0, POSES.relaxed], [tT - 0.6, wind], [tT, thr]], 0.2),
    extra: (g, GY, s) => { if (t < tT) return; const x = lerp(p.mia - 60 * s, p.theo + 40 * s, ease.out(fly)), y = GY - 172 * s - Math.sin(fly * Math.PI) * 30 * s; ball(g, x, y, 16, t * 10); if (fly < 1) for (let i = 1; i < 6; i++) circle(g, x + i * 22, y + i * 2, 16 - i * 2.5, alpha('#e0402f', 0.12)); } });
} });
registerShot('s034', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('golden'), bg: (g2, tt, cam) => park(g2, 0, cam), bgCam: { z: 1.6, x: 300, y: -120 }, outfit: THEO, expr: 'sleepy', face: { mouth: 'oBig', eyes: 'closed', brows: 'raised' }, side: -1, dx: -V(260, 0), noBlink: true, zoom: 0.02,
    front: (g) => { blurLayer(g, 3, (g2) => ball(g2, E.W * V(0.74, 0.7), E.H * 0.46, V(170, 150), 0.4)); FX.drops(g, t, { count: 24, rMax: 7, drift: 2 }); } });
  slowTint(g, 0.3); slowBadge(g, t, '100x', 0.05);
} });
registerShot('s035', { draw(g, t, info) {
  const cam = { z: 1.7, x: -260, y: 190 }, snap = 0.3, p = P();
  const [sx, sy] = t > snap ? shake(t, 10 * (1 - prog(t, snap, snap + 0.5)), 30) : [0, 0];
  const catchPose = { ...POSES.reach, eF: [30, -196], hF: [52, -222] };
  parkTwo(g, t, { ...cam, x: cam.x + sx, y: cam.y + sy }, { theoExpr: t > snap ? 'smirk' : 'neutral', theoPose: posesAt(t, [[0, POSES.relaxed], [snap - 0.12, catchPose]], 0.12),
    extra: (g, GY, s) => { const hx = p.theo + 52 * s + 10, hy = GY - 222 * s; if (t < snap) ball(g, lerp(E.W * 0.9, hx, ease.in(prog(t, 0, snap))), lerp(GY - 300, hy, prog(t, 0, snap)), 16, t * 20); else { ball(g, hx, hy, 16, 0.4); FX.rings(g, hx, hy, t - snap, { count: 3, r0: 20, r1: 180, speed: 1.8, color: '#fff3e0', a: 0.6 * (1 - prog(t, snap, snap + 1)) }); } } });
  if (t > snap) FX.speedLines(g, t, { cx: E.W * 0.4, cy: E.H * 0.4, count: 40, a: 0.3 * (1 - prog(t, snap, snap + 0.6)) });
} });
registerShot('s036', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('golden'), bg: (g2, tt, cam) => park(g2, tt, cam), bgCam: { z: 1.6, x: -300 + 20 * t, y: -120 }, outfit: MIA, expr: (tt) => tt < 1.2 ? 'shocked' : 'surprised', talk: () => talk(info), side: 1, dx: V(220, 0), seed: 1 });
} });
registerShot('s037', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.8, z1: 1.86, x0: -330, x1: -320, y0: 200, y1: 205 }), p = P();
  const toss = Math.abs(Math.sin(t * 2.6)), hold = { ...POSES.holdFront, eF: [22, -144], hF: [36, -160] };
  parkTwo(g, t, cam, { theoExpr: 'smirk', theoTalk: talk(info), theoPose: breathe(hold, t),
    extra: (g, GY, s) => { ball(g, p.theo + 38 * s, GY - 175 * s - toss * 120, 16, t * 3); const [hx, hy] = headPos({ x: p.theo, y: GY, s, facing: 1, pose: hold }); if (talk(info) > 0) FX.rings(g, hx, hy, t, { count: 2, r0: 40, r1: 90, color: '#fff3e0', a: 0.35 }); } });
} });
registerShot('s038', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.35, z1: 1.4, x0: 40, x1: 60, y0: 150, y1: 155 });
  const back = ease.inOut(prog(t, 0.2, 1.2)) * 70;
  parkTwo(g, t, cam, { theoExpr: 'smile', miaDx: back, miaExpr: exprAt(t, [[0, 'neutral'], [0.6, 'nervous']]), miaTalk: talk(info), miaPose: breathe(posesAt(t, [[0, POSES.relaxed], [0.5, POSES.crossArms]]), t, 1, 3) });
} });

// ---------- bedroom: video games ----------
function gameScreen(g, x, y, w, h, t, o = {}) {
  const red = o.red ?? 0, ui = S().ui;
  g.fillStyle = mix('#0e1a2a', '#3a0c10', red); g.fillRect(x, y, w, h);
  g.strokeStyle = alpha('#59c8ff', 0.12 * (1 - red)); g.lineWidth = 1; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(x, y + i * h / 12); g.lineTo(x + w, y + i * h / 12); g.stroke(); }
  if (o.enemies) { const r = rng(4); for (let i = 0; i < 6; i++) { const ex = x + w * (0.15 + r() * 0.7), ey = y + h * (0.2 + r() * 0.6), a = r() * 6.28, mv = Math.max(0, t - 0.6 - i * 0.12) * 40; const px = ex + Math.cos(a) * mv, py = ey + Math.sin(a) * mv;
      g.setLineDash([6, 6]); seg(g, [[ex, ey], [ex + Math.cos(a) * 90, ey + Math.sin(a) * 90]], 3, alpha(ui.gold, clamp((t - 0.2 - i * 0.08) * 3))); g.setLineDash([]);
      rr(g, px - 14, py - 14, 28, 28, 6); g.fillStyle = '#ff4a5a'; g.fill(); glow(g, px, py, 40, '#ff4a5a', 0.4); circle(g, px - 5, py - 3, 3, '#fff'); circle(g, px + 5, py - 3, 3, '#fff'); }
    ring(g, x + w / 2, y + h / 2, 30, 3, '#d8f4ff'); seg(g, [[x + w / 2 - 50, y + h / 2], [x + w / 2 + 50, y + h / 2]], 2, '#d8f4ff'); seg(g, [[x + w / 2, y + h / 2 - 50], [x + w / 2, y + h / 2 + 50]], 2, '#d8f4ff'); }
  if (o.wins != null) { text(g, 'WIN STREAK', x + w / 2, y + h * 0.3, { size: h * 0.09, color: '#9fe0ff', font: FONTS.ui, weight: 900, spacing: 6 }); text(g, String(o.wins), x + w / 2, y + h * 0.58, { size: h * 0.36, color: ui.gold, font: FONTS.title, weight: 700, glow: 30, glowColor: alpha(ui.gold, 0.7) }); for (let i = 0; i < Math.min(40, o.wins); i++) rr(g, x + w * 0.1 + i * (w * 0.8 / 40), y + h * 0.82, w * 0.8 / 40 - 4, 14, 3), g.fillStyle = alpha(ui.good, 0.9), g.fill(); }
  if (o.ban) { const k = o.ban; text(g, 'BANNED', x + w / 2, y + h * 0.45, { size: h * 0.26 * (1 + 0.3 * (1 - k)), color: '#ff5a5a', font: FONTS.title, weight: 700, glow: 30, glowColor: 'rgba(255,60,60,.8)', alpha: k, spacing: 8 }); text(g, 'SUSPECTED CHEATING', x + w / 2, y + h * 0.66, { size: h * 0.075, color: '#ffd0d0', font: FONTS.ui, weight: 900, spacing: 6, alpha: clamp(k * 2 - 1) }); }
}
registerShot('s039', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, z1: 1.22, x0: -260, x1: -280, y0: 70, y1: 80 });
  const { GY, M, deskX } = bedroom(g, t, cam, { screenFx: (g, x, y, w, h) => gameScreen(g, x, y, w, h, t, { enemies: true }) });
  const s = 1.3, x = deskX + V(260, 200);
  layer(g, cam, 1, (g) => { g.save(); g.translate(x, 0); g.scale(-1, 1); FX.chair(g, -18 * s, GY, s, '#151320'); g.restore();
    drawFigure(g, { x, y: GY, s, facing: -1, outfit: THEO, pose: breathe({ ...POSES.sit, eF: [24, -116], hF: [50, -118], eB: [18, -118], hB: [44, -120] }, t), expr: 'determined', rim: rimOf({ rim: '#7fd8ff' }, [-1, -0.2], 5), shadow: false }); });
  FX.dust(g, t, { count: 30, color: '#9fd8ff', a: 0.25 });
} });
function screenInsert(g, t, info, o) {
  const cam = push(t, info, { z0: 1.0, z1: 1.06 });
  insertBg(g, t, (g2, tt) => bedroom(g2, tt, { z: 1.4, x: -500, y: -150 }, { screen: o.red ? '#ff4a4a' : '#59c8ff' }), null, 0.5);
  layer(g, cam, 1, (g) => { const w = V(1300, 960), h = w * 0.56, x = (E.W - w) / 2, y = (E.H - h) / 2 - 20;
    rr(g, x - 24, y - 24, w + 48, h + 48, 18); g.fillStyle = '#08080c'; g.fill(); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); gameScreen(g, x, y, w, h, t, o); g.restore();
    glow(g, E.W / 2, E.H / 2, w * 0.7, o.red ? '#ff4a4a' : '#59c8ff', 0.15); });
}
registerShot('s040', { draw(g, t, info) { screenInsert(g, t, info, { enemies: true }); } });
registerShot('s041', { draw(g, t, info) { screenInsert(g, t, info, { wins: Math.round(40 * ease.out(prog(t, 0.15, 1.2))) }); } });
registerShot('s042', { draw(g, t, info) { const k = ease.out(prog(t, wt(info, 'bans', 1.1) - 0.1, wt(info, 'bans', 1.1) + 0.3)); screenInsert(g, t, info, k > 0 ? { red: k, ban: k } : { wins: 40 }); } });
registerShot('s043', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('night'), bg: (g2, tt, cam) => bedroom(g2, tt, cam, { screen: '#ff4a4a' }), bgCam: { z: 1.5, x: -400, y: -150 }, outfit: THEO, expr: 'neutral', face: { mouth: 'flat', brows: 'worried' }, talk: () => talk(info), rimColor: '#ff6a5a', side: -1, dx: -V(80, 0), zoom: 0.03 });
} });
registerShot('s044', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, z1: 1.2, x0: -270, x1: -280, y0: 70, y1: 70 });
  const { GY, deskX } = bedroom(g, t, cam, { screen: '#ff4a4a', screenFx: (g, x, y, w, h) => gameScreen(g, x, y, w, h, t, { red: 1, ban: 1 }) });
  const s = 1.3, x = deskX + V(260, 200);
  layer(g, cam, 1, (g) => { g.save(); g.translate(x, 0); g.scale(-1, 1); FX.chair(g, -18 * s, GY, s, '#151320'); g.restore();
    drawFigure(g, { x, y: GY, s, facing: -1, outfit: THEO, pose: breathe(posesAt(t, [[0, POSES.sit], [0.3, { ...POSES.sitBack, eF: [24, -150], hF: [20, -184] }]]), t), expr: 'sad', rim: rimOf({ rim: '#ff6a5a' }, [-1, -0.2], 5), shadow: false }); });
} });

// ---------- cinema: movies ----------
function runnerOnScreen(g, x, y, w, h, tt, c) { const ph = tt * 2 * Math.PI * 1.4; UI.lineFigure(g, { x: x + w * (0.15 + ((tt * 0.18) % 0.7)), y: y + h * 0.82, s: h / 420, pose: walkPose(ph, { run: true }), color: c }); seg(g, [[x, y + h * 0.83], [x + w, y + h * 0.83]], 2, alpha(c, 0.5)); }
function heads(g, M, t, list) { for (const [x, y, s, of] of list) { const r = 26 * s; circle(g, x - 2, y - 3, r + 4, alpha('#cfe0ff', 0.55)); circle(g, x, y, r, S().ink); if (of.head === 'beanie') { g.fillStyle = of.headColor; g.beginPath(); g.ellipse(x, y - r * 0.2, r * 1.06, r, 0, Math.PI, Math.PI * 2); g.fill(); } if (of.head === 'spiky') { g.fillStyle = S().ink; g.beginPath(); for (let i = 0; i <= 6; i++) { const a = Math.PI * (1.05 + i * 0.15), rr2 = i % 2 ? r * 1.45 : r * 0.95; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.closePath(); g.fill(); } g.fillStyle = S().ink; g.beginPath(); g.ellipse(x, y + r * 2, r * 1.6, r * 1.3, 0, Math.PI, Math.PI * 2); g.fill(); g.fillStyle = of === THEO ? THEO.color : S().ink; g.beginPath(); g.ellipse(x, y + r * 2.1, r * 1.5, r * 1.1, 0, Math.PI, Math.PI * 2); g.fill(); } }
registerShot('s045', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, z1: 1.12, y0: -40, y1: -60 });
  const { GY, screen } = cinema(g, t, cam, { screenFx: (g, x, y, w, h) => runnerOnScreen(g, x, y, w, h, t, '#e8f0ff') });
  layer(g, cam, 1, (g) => heads(g, null, t, [[E.W / 2 - V(140, 120), GY - 60, 2.2, THEO], [E.W / 2 + V(140, 120), GY - 56, 2.1, MIA]]));
} });
registerShot('s046', { draw(g, t, info) {
  backdrop(g, ['#07070d', '#121222']); const ui = S().ui, fw = V(260, 220), fh = fw * 0.75, y = E.H / 2 - fh / 2 - 30, off = (t * fw * 5) % (fw + 30);
  g.fillStyle = '#16141c'; g.fillRect(-20, y - 60, E.W + 40, fh + 120); for (let x = -off; x < E.W + 60; x += 46) { rr(g, x, y - 46, 26, 22, 4); g.fillStyle = '#05050a'; g.fill(); rr(g, x, y + fh + 24, 26, 22, 4); g.fill(); }
  for (let i = -1; i < E.W / (fw + 30) + 2; i++) { const x = i * (fw + 30) - off + (fw + 30); g.fillStyle = '#d8e4ff'; g.fillRect(x, y, fw, fh); runnerOnScreen(g, x, y, fw, fh, i * 0.05, '#1a1a2a'); }
  glow(g, E.W / 2, E.H / 2, 700, '#cfe0ff', 0.12);
  const n = Math.round(24 * ease.out(prog(t, wt(info, 'twenty', 1.0) - 0.2, wt(info, 'twenty', 1.0) + 0.6)));
  label(g, t, n + ' PICTURES / SECOND', E.W / 2, E.H - V(150, 400), wt(info, 'twenty', 1.0) - 0.3, { size: V(64, 60) });
} });
function screenPOV(g, t, info, stepped) {
  const cam = push(t, info, { z0: 1.5, z1: 1.56, y0: -230, y1: -240 });
  const tt = stepped ? Math.floor(t * 3) / 3 : t, gap = stepped && (t * 3) % 1 > 0.75;
  const { GY } = cinema(g, t, cam, { screenA: gap ? 0.15 : 1, screenFx: (g, x, y, w, h) => { if (gap) return; if (!stepped) for (let k = 4; k >= 1; k--) runnerOnScreen(g, x, y, w, h, tt - k * 0.03, alpha('#e8f0ff', 0.15)); runnerOnScreen(g, x, y, w, h, tt, '#e8f0ff'); } });
  layer(g, cam, 1, (g) => heads(g, null, t, [[E.W / 2 + (stepped ? -V(160, 120) : V(160, 120)), GY + 30, 2.6, stepped ? THEO : MIA]]));
  label(g, t, stepped ? 'YOU: A SLIDESHOW' : 'EVERYONE ELSE: MOTION', E.W / 2, E.H - V(230, 380), stepped ? wt(info, 'slideshow', 1.2) - 0.2 : 0.4, { size: V(48, 52), color: stepped ? S().ui.gold : S().ui.cream });
}
registerShot('s047', { draw(g, t, info) { screenPOV(g, t, info, false); } });
registerShot('s048', { draw(g, t, info) { screenPOV(g, t, info, true); } });
registerShot('s049', { draw(g, t, info) {
  const clicks = [wt(info, 'click', 0.1), wt(info, 'click', 1.0, wt(info, 'click', 0.1) + 0.3), 0].map((v) => v); clicks[2] = wt(info, 'click', 2.0, clicks[1] + 0.3);
  let flash = 0; for (const c of clicks) if (t >= c) flash = Math.max(flash, 1 - prog(t, c, c + 0.35));
  faceShot(g, t, info, { M: mood('void'), bg: (g2, tt, cam) => cinema(g2, tt, cam, { screenA: 0.4 + flash * 0.6 }), bgCam: { z: 1.4, y: 200 }, outfit: THEO, expr: 'neutral', face: { mouth: 'flat' }, rimColor: '#cfe0ff', side: 1, noBlink: true, zoom: 0.02 });
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#cfe0ff', 0.22 * flash); g.fillRect(0, 0, E.W, E.H); g.restore();
  clicks.forEach((c, i) => label(g, t, 'CLICK', E.W * (0.2 + i * 0.3), E.H * 0.18, c - 0.05, { size: V(56, 60), color: S().ui.cream }));
} });
registerShot('s050', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.04 }), M = mood('void');
  backdrop(g, ['#07070d', '#0e0d18']); const GY = E.H * 0.86;
  layer(g, cam, 0.5, (g) => { FX.lightCone(g, E.W / 2, -300, { angle: Math.PI / 2, spread: 0.5, len: 1400, color: '#cfe0ff', a: 0.12 }); });
  layer(g, cam, 1, (g) => {
    const s = 2.1, rim = { color: '#cfe0ff', dir: [0, -1], w: 5 };
    drawFigure(g, { x: E.W / 2 - V(220, 160), y: GY, s, facing: 1, outfit: THEO, pose: breathe(POSES.sit, t), expr: 'neutral', face: { mouth: 'flat' }, rim, shadow: false });
    drawFigure(g, { x: E.W / 2 + V(220, 160), y: GY, s, facing: -1, outfit: MIA, pose: breathe({ ...POSES.sit, eF: [24, -120], hF: [44, -132] }, t, 1, 2), expr: 'joy', talk: talk(info), rim, shadow: false, blink: blinkAt(t, 2.9) });
    for (const x of [E.W / 2 - V(220, 160), E.W / 2 + V(220, 160)]) { rr(g, x - 70, GY - 70, 140, 90, 20); g.fillStyle = '#1e0e16'; g.fill(); }
  });
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.3 });
} });
registerShot('s051', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('void'), bg: (g2, tt, cam) => cinema(g2, tt, cam), bgCam: { z: 1.4, y: 200 }, outfit: THEO, expr: 'neutral', face: { mouth: 'smallFlat', brows: null }, talk: () => talk(info), rimColor: '#cfe0ff', side: 1, dx: -V(120, 0) });
} });

// ---------- hallway: flicker ----------
const flick = (t, f = 1) => 0.72 + 0.28 * Math.sign(Math.sin(t * 2 * Math.PI * 3.1 * f)) * (0.5 + 0.5 * Math.sin(t * 1.7));
registerShot('s052', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, z1: 1.07, x0: -60, x1: 40 });
  const { GY, M } = hallway(g, t, cam, { flicker: flick(t) });
  layer(g, cam, 1, (g) => { for (const [x, of, sd] of [[E.W * 0.3, EXTRA, 0], [E.W * 0.62, EXTRA2, 1], [E.W * 0.8, EXTRA3, 2]]) drawFigure(g, { x: x + t * 30, y: GY, s: 1.2, facing: 1, outfit: of, pose: walkPose(t * 5.6 + sd), expr: 'neutral', rim: rimOf(M, [0, -1]) }); });
  chapter(g, t, 'MINUS', S().ui.accent);
  label(g, t, '100 FLICKERS / SECOND', E.W / 2, V(150, 260), wt(info, 'hundred', 2.2) - 0.2, { size: V(46, 50), color: S().ui.cream });
} });
registerShot('s053', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.36, x0: 60, x1: 80, y0: 110, y1: 120 });
  const { GY, M } = hallway(g, t, cam, { flicker: flick(t) });
  const tYou = wt(info, 'you', 1.6);
  layer(g, cam, 1, (g) => {
    for (const [x, of, sd] of [[E.W * 0.15, EXTRA, 0], [E.W * 0.3, EXTRA3, 2]]) drawFigure(g, { x: x + t * 60, y: GY, s: 1.25, facing: 1, outfit: of, pose: walkPose(t * 5.6 + sd), expr: 'happy', rim: rimOf(M, [0, -1]) });
    drawFigure(g, { x: E.W * 0.62, y: GY, s: 1.25, facing: -1, outfit: THEO, pose: breathe(posesAt(t, [[0, POSES.relaxed], [tYou, POSES.facepalm]]), t), expr: t > tYou ? 'angry' : 'confused', look: [0.3, -1], rim: rimOf(M, [0, -1]) });
  });
} });
registerShot('s054', { draw(g, t, info) {
  const st = Math.floor(t * 3) / 3, beat = (t * 3) % 1;
  const cam = push(t, info, { z0: 1.12, z1: 1.18, r: 0.015 });
  const { GY, M } = hallway(g, st, cam, { flicker: beat < 0.5 ? 1 : 0.35 });
  layer(g, cam, 1, (g) => { for (const [x, of, sd] of [[E.W * 0.2, EXTRA, 0], [E.W * 0.45, EXTRA2, 1], [E.W * 0.75, EXTRA3, 2]]) drawFigure(g, { x: x + st * 60, y: GY, s: 1.25, facing: 1, outfit: of, pose: walkPose(st * 5.6 + sd), expr: 'happy', rim: rimOf(M, [0, -1]) });
    drawFigure(g, { x: E.W * 0.58, y: GY, s: 1.25, facing: -1, outfit: THEO, pose: breathe(POSES.handsOnHead, t), expr: 'nervous', rim: { color: beat < 0.5 ? '#ff7ad0' : '#5ff2e8', dir: [0, -1] } }); });
  const c = Math.floor(t * 3) % 2 ? '#5ff2e8' : '#ff4fa3';
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha(c, 0.35); g.fillRect(0, 0, E.W, E.H); g.restore();
  for (let i = 0; i < 3; i++) FX.lightCone(g, E.W * (0.2 + i * 0.3), -40, { angle: Math.PI / 2 + Math.sin(t * 1.3 + i) * 0.4, spread: 0.18, len: 1200, color: c, a: 0.12 });
} });
