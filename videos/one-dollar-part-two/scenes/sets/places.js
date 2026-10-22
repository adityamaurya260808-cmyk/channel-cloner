// sets/places.js — the locations. Each: place(g, t, cam, o) -> { GY, CX, M, ...anchors }. Characters go at depth 1 afterwards.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, text, FONTS, rng, clamp, lerp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { jar, car, calendar, teacup, trafficLight } from './props.js';

export const GYf = () => E.H * V(0.8, 0.68);
const CXf = () => E.W / 2;

// ---------- Sam's bedroom (night): moonlit window right, bed left, nightstand with phone, shelf with the jar ----------
export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = GYf(), CX = CXf();
  const wall = shade(M.wall, -0.25), wallD = shade(M.wall, -0.55);
  const win = { x: CX + 180, y: GY - 640, w: 460, h: 420 };
  const day = o.day ?? 0;                                         // 0 night .. 1 day (time-lapse)
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 900, 0, GY, [shade(wall, -0.2), wall, wallD]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H + 4);
    FX.windowFrame(g, { ...win, cols: 2, rows: 2, frame: wallD, bar: 10 }, (g, x, y, w, h) => {
      const sky = day > 0 ? M.sky.map((c, i) => mix(c, mood('day').sky[Math.min(i, 2)], day)) : M.sky;
      g.fillStyle = linGrad(g, 0, y, 0, y + h, sky); g.fillRect(x, y, w, h);
      if (day < 0.5) { FX.stars(g, t, { area: [x, y, w, h * 0.6], count: 40, seed: 3 }); FX.moon(g, x + w * 0.72, y + h * 0.24, 30); }
      else FX.sun(g, x + w * 0.3, y + h * 0.3, 30, '#fff8e8', '#ffe2a8', 3);
      FX.skyline(g, { x: x - 20, y: y + h + 6, w: w + 40, minH: 60, maxH: 230, color: mix(M.sky[0], '#05060d', 0.5), windowColor: alpha(M.practical, 0.75 - day * 0.5), lit: 0.3, seed: 12 });
      if (o.rain) FX.rain(g, t, { area: [x, y, w, h], count: 90, a: 0.4, len: 30 });
      if (o.flash) { g.fillStyle = `rgba(220,230,255,${o.flash})`; g.fillRect(x, y, w, h); }
    });
    glow(g, win.x + win.w / 2, win.y + win.h / 2, 520, M.rim, 0.12 + day * 0.15);
    // shelf + jar
    if (o.shelf !== false) { const sx = CX - 120, sy = GY - 470; rr(g, sx - 150, sy, 300, 14, 4); g.fillStyle = wallD; g.fill(); seg(g, [[sx - 110, sy + 14], [sx - 110, sy + 44]], 6, wallD); seg(g, [[sx + 110, sy + 14], [sx + 110, sy + 44]], 6, wallD);
      if (o.jar !== false) jar(g, sx + 40, sy, 0.62, { coins: o.coins ?? 30, bills: 2, note: 'front', glow: o.jarGlow ?? 0.5 });
      for (let i = 0; i < 4; i++) { rr(g, sx - 130 + i * 22, sy - 70 + (i % 2) * 10, 18, 70 - (i % 2) * 10, 2); g.fillStyle = shade(['#5a3a4a', '#3a4a6a', '#6a5a3a', '#4a3a5a'][i], -0.3); g.fill(); } }
    // wall clock
    if (o.clock !== false) FX.clock(g, CX - 520, GY - 560, 46, o.clockT ?? 3 * 3600 + t, { face: shade('#f2efe8', -0.55), ink: '#1a1622', red: '#a83a2a' });
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 420, [shade(M.floor, -0.15), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.3)', 0.08);
    // moonlight patch on floor
    g.save(); g.globalCompositeOperation = 'lighter'; poly(g, [[win.x - 40, GY + 20], [win.x + win.w - 140, GY + 20], [win.x + win.w - 420, GY + 300], [win.x - 380, GY + 300]], alpha(M.rim, 0.06 + day * 0.06)); g.restore();
    FX.bed(g, { x: CX - 820, y: GY, w: 520, color: shade(M.ambient, 0.1), frame: wallD, pillow: shade('#e8e4f4', -0.35) });
    // nightstand + phone
    const nx = CX - 230; rr(g, nx - 60, GY - 120, 120, 120, 6); g.fillStyle = shade(wallD, 0.1); g.fill(); g.fillStyle = shade(wallD, -0.3); g.fillRect(nx - 50, GY - 80, 100, 4);
    const ph = o.phone ?? 0; if (o.phoneOnStand !== false) { rr(g, nx - 26, GY - 130, 52, 10, 3); g.fillStyle = '#0b0a10'; g.fill(); if (ph > 0) { const bz = o.buzz ? Math.sin(t * 60) * 3 : 0; g.fillStyle = alpha('#9fd8ff', ph); g.fillRect(nx - 22 + bz, GY - 129, 44, 6); glow(g, nx + bz, GY - 140, 180, '#7fb6ff', 0.55 * ph); FX.lightCone(g, nx, GY - 130, { angle: -Math.PI / 2, spread: 1.4, len: 260, color: '#9fd8ff', a: 0.18 * ph }); } }
    if (o.lamp) { seg(g, [[nx + 30, GY - 120], [nx + 30, GY - 200]], 4, '#1a1622'); poly(g, [[nx + 8, GY - 200], [nx + 52, GY - 200], [nx + 44, GY - 236], [nx + 16, GY - 236]], '#e8d8b8'); glow(g, nx + 30, GY - 210, 260, M.practical, 0.5 * o.lamp); FX.pool(g, nx, GY + 10, 260, 40, M.practical, 0.25 * o.lamp); }
  });
  return { GY, CX, M, bedX: CX - 820, bedTop: GY - 96, nightX: CX - 230, shelf: [CX - 80, GY - 470], win };
}

// ---------- Mom's kitchen (warm): sunset window centre, pendant lamp, table, fridge, calendar ----------
export function kitchen(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = GYf(), CX = CXf();
  const wall = shade(M.wall, -0.2), wallD = shade(M.wall, -0.5);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 900, 0, GY, [shade(wall, -0.25), wall, wallD]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H + 4);
    // tiles band
    g.fillStyle = shade(wall, 0.05); g.fillRect(-E.W, GY - 330, E.W * 3, 150); g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 46) { g.beginPath(); g.moveTo(x, GY - 330); g.lineTo(x, GY - 180); g.stroke(); } for (let y = GY - 330; y < GY - 180; y += 46) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
    const win = { x: CX - 260, y: GY - 700, w: 520, h: 340 };
    FX.windowFrame(g, { ...win, cols: 3, rows: 1, frame: wallD, bar: 10 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, o.night ? mood('night').sky : M.sky); g.fillRect(x, y, w, h);
      if (o.night) { FX.stars(g, t, { area: [x, y, w, h * 0.6], count: 30 }); FX.moon(g, x + w * 0.7, y + h * 0.3, 22); }
      else FX.sun(g, x + w * 0.62, y + h * 0.72, 34, '#fff3dc', M.key, 4);
      FX.hills(g, { y: y + h - 10, amp: 50, color: mix(M.sky[0], wallD, 0.6), seed: 4 });
      FX.tree(g, x + w * 0.2, y + h, 0.7, mix(M.sky[0], wallD, 0.8));
    });
    if (!o.night) FX.godRays(g, win.x + win.w * 0.62, win.y + win.h * 0.72, { angle: Math.PI / 2 + 0.25, spread: 0.9, len: 900, a: 0.07, t, color: M.key });
    glow(g, CX, win.y + win.h / 2, 520, o.night ? '#8fa0e0' : M.key, o.night ? 0.06 : 0.16);
    // cabinets / fridge
    rr(g, CX - 900, GY - 520, 200, 520, 10); g.fillStyle = shade(wall, 0.12); g.fill(); seg(g, [[CX - 720, GY - 420], [CX - 720, GY - 340]], 6, shade(wall, -0.3)); seg(g, [[CX - 900, GY - 330], [CX - 700, GY - 330]], 3, shade(wall, -0.3));
    for (const cx of [CX + 420, CX + 600]) { rr(g, cx, GY - 760, 160, 180, 6); g.fillStyle = shade(wall, -0.1); g.fill(); seg(g, [[cx + 140, GY - 620], [cx + 140, GY - 600]], 5, shade(wall, -0.4)); }
    FX.counter(g, { x: CX + 400, y: GY, w: 600, h: 170, color: shade(wall, -0.25), top: shade(wall, 0.05), doors: 4 });
    if (o.calendar !== false) calendar(g, CX - 520, GY - 640, 110, o.calLabel || '7', { top: o.calTop || 'SUNDAY' });
    FX.clock(g, CX + 340, GY - 640, 34, 17 * 3600 + t * 3, { face: shade('#f2efe8', -0.25) });
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 420, [shade(M.floor, -0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    // checker floor
    g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = -40; i < 80; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) { const y0 = GY + j * j * 6 + j * 14, y1 = GY + (j + 1) * (j + 1) * 6 + (j + 1) * 14; g.beginPath(); g.moveTo(CX + (i * 60 - 0) * (1 + j * 0.25) / 1, y0); g.lineTo(CX + ((i + 1) * 60) * (1 + j * 0.25), y0); g.lineTo(CX + ((i + 1) * 60) * (1 + (j + 1) * 0.25), y1); g.lineTo(CX + (i * 60) * (1 + (j + 1) * 0.25), y1); g.fill(); }
    FX.pool(g, CX, GY + 20, 520, 60, o.night ? M.practical : M.key, 0.22);
  });
  // pendant lamp (depth 0.95) + table (depth 1)
  layer(g, cam, 0.95, (g) => { const ly = GY - 470; seg(g, [[CX, -E.H], [CX, ly - 40]], 3, '#1a1418'); poly(g, [[CX - 60, ly], [CX + 60, ly], [CX + 26, ly - 46], [CX - 26, ly - 46]], '#2a1e24'); glow(g, CX, ly + 6, 300, M.practical, o.night ? 0.7 : 0.4); FX.lightCone(g, CX, ly, { angle: Math.PI / 2, spread: 1.0, len: 520, color: M.practical, a: o.night ? 0.2 : 0.1 }); circle(g, CX, ly + 4, 14, '#fff3d6'); });
  return { GY, CX, M, tableTop: GY - 150 };
}
export function kitchenTable(g, CX, GY, o = {}) {
  const top = GY - 150, c = o.color || '#2a1c20';
  seg(g, [[CX - 200, top], [CX - 210, GY - 4]], 10, c); seg(g, [[CX + 200, top], [CX + 210, GY - 4]], 10, c);
  rr(g, CX - 260, top - 14, 520, 18, 6); g.fillStyle = c; g.fill(); g.fillStyle = 'rgba(255,210,150,.3)'; g.fillRect(CX - 254, top - 14, 508, 3);
  return top - 14;
}

// ---------- the street outside (dusk): row houses with lit windows, lamp post, optional car ----------
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYf(), CX = CXf();
  const wall = shade(M.wall, -0.3), wallD = shade(M.wall, -0.6);
  layer(g, cam, 0.12, (g) => {
    backdrop(g, M.sky);
    if (o.mood === 'storm') FX.clouds(g, { y: GY - 900, h: 300, count: 9, color: '#9aa4d0', a: 0.12 });
    else FX.sun(g, CX - 380, GY - 420, 50, '#fff3dc', M.key, 5);
    FX.skyline(g, { x: -E.W, y: GY - 380, w: E.W * 3, minH: 60, maxH: 300, color: mix(M.sky[1] || M.sky[0], wallD, 0.75), windowColor: alpha(M.practical, 0.5), lit: 0.2, seed: 21 });
  });
  layer(g, cam, 0.55, (g) => {
    for (let i = -3; i <= 3; i++) { const hx = CX + i * 420 - 200, hh = 520 + ((i * 37) % 3) * 40; FX.facade(g, { x: hx, y: GY - 60, w: 400, h: hh, color: shade(wall, (i % 2) * 0.06), win: M.practical, dark: wallD, cols: 3, rows: 3, lit: 0.45, seed: 30 + i }); poly(g, [[hx - 10, GY - 60 - hh], [hx + 410, GY - 60 - hh], [hx + 200, GY - 60 - hh - 90]], shade(wallD, -0.2)); rr(g, hx + 150, GY - 60, 100, 60, 2); g.fillStyle = shade(wallD, 0.1); g.fill(); }
    FX.fog(g, GY - 260, 260, M.fog, 0.12);
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.05), shade(M.dark, -0.25)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    g.fillStyle = shade(M.road, -0.2); g.fillRect(-E.W, GY + 120, E.W * 3, 400); g.fillStyle = alpha('#ffffff', 0.12); for (let x = -E.W; x < E.W * 2; x += 180) g.fillRect(x, GY + 200, 90, 6);
    FX.floorLines(g, GY, GY + 110, 'rgba(0,0,0,.25)', 0.2);
    FX.lampPost(g, CX + 560, GY + 10, 380, { light: M.practical, a: 0.2 });
    FX.pool(g, CX + 590, GY + 30, 260, 40, M.practical, 0.3);
    if (o.light) trafficLight(g, CX + (o.lightX ?? 300), GY + 110, 1.0, o.light, t);
    if (o.car) car(g, (o.carX ?? CX - 520), GY + (o.carY ?? 150), o.carS ?? 0.95, o.carColor || '#f2c21a', { shine: o.carShine, facing: o.carFacing || 1 });
    if (o.wet) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [alpha(M.practical, 0.1), alpha(M.practical, 0)]); g.fillRect(-E.W, GY, E.W * 3, 300); g.restore(); }
  });
  return { GY, CX, M };
}
export function streetFX(g, t, o = {}) { if (o.rain) FX.rain(g, t, { count: 300, a: 0.3 }); else FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 }); }

// ---------- factory (cool): tall windows, conveyor belt with boxes ----------
export function factory(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = GYf(), CX = CXf();
  const wall = shade(M.wall, -0.15), wallD = shade(M.wall, -0.5);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -100, 0, GY, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    for (let i = -3; i <= 3; i++) { const wx = CX + i * 330 - 110; FX.windowFrame(g, { x: wx, y: GY - 820, w: 220, h: 480, cols: 2, rows: 4, frame: wallD, bar: 8 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#5a6aa0', '#2a3560']); g.fillRect(x, y, w, h); }); FX.godRays(g, wx + 110, GY - 580, { angle: Math.PI / 2 + 0.35, spread: 0.3, len: 900, a: 0.05, color: M.key, count: 3, t }); }
    for (let i = -2; i <= 2; i++) { const lx = CX + i * 460; seg(g, [[lx, -E.H], [lx, GY - 760]], 3, '#0d0f1a'); poly(g, [[lx - 50, GY - 760], [lx + 50, GY - 760], [lx + 24, GY - 790], [lx - 24, GY - 790]], '#1a1e2e'); FX.lightCone(g, lx, GY - 760, { angle: Math.PI / 2, spread: 0.7, len: 700, color: M.practical, a: 0.12 }); }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    // conveyor
    const by = GY - 110; g.fillStyle = '#1c2030'; g.fillRect(-E.W, by, E.W * 3, 28); for (let x = -E.W; x < E.W * 2; x += 120) { seg(g, [[x, by + 28], [x, GY]], 8, '#151826'); }
    g.fillStyle = 'rgba(255,255,255,.08)'; for (let x = -E.W + ((t * 120) % 60); x < E.W * 2; x += 60) g.fillRect(x, by + 4, 20, 3);
    for (let i = -8; i < 10; i++) { const bx = ((i * 260 + t * 120) % (E.W * 2.6)) - E.W * 0.4; rr(g, bx, by - 70, 90, 70, 4); g.fillStyle = '#7a6a52'; g.fill(); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(bx, by - 40, 90, 6); }
  });
  return { GY, CX, M, beltY: GY - 110 };
}

// ---------- office: bank / police (cool): blinds window, counter, monitor ----------
export function office(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = GYf(), CX = CXf();
  const wall = shade(M.wall, -0.1), wallD = shade(M.wall, -0.5);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -100, 0, GY, [shade(wall, -0.3), wall]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    FX.windowFrame(g, { x: CX + 120, y: GY - 700, w: 560, h: 380, cols: 2, rows: 1, frame: wallD, bar: 10, blinds: 50 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, mood('day').sky); g.fillRect(x, y, w, h); FX.skyline(g, { x, y: y + h, w, color: '#7a88a8', windowColor: '#cfe0ff', lit: 0.2, seed: 5 }); });
    glow(g, CX + 400, GY - 510, 480, M.key, 0.12);
    rr(g, CX - 760, GY - 760, 420, 110, 10); g.fillStyle = wallD; g.fill(); text(g, o.sign || 'BANK', CX - 550, GY - 705, { size: 64, color: o.signColor || '#cfe0ff', font: FONTS.title, glow: 18, glowColor: alpha(o.signColor || '#9fc0ff', 0.6), spacing: 6 });
    if (o.police) { for (const [c, dx] of [['#ff3a3a', -40], ['#3a6aff', 40]]) glow(g, CX - 550 + dx, GY - 790, 160, c, 0.25 + 0.25 * Math.sin(t * 8 + dx)); }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.25)', 0.08); });
  return { GY, CX, M };
}
export function desk(g, CX, GY, o = {}) { const top = GY - 150; rr(g, CX - 230, top, 460, 150, 6); g.fillStyle = o.color || '#1e2234'; g.fill(); g.fillStyle = 'rgba(200,220,255,.15)'; g.fillRect(CX - 230, top, 460, 4); FX.screen(g, { x: CX + 40, y: top - 130, w: 170, h: 110, glowC: '#9fe0ff', a: 0.3 }, (g, x, y, w, h) => { g.fillStyle = '#1a2a40'; g.fillRect(x, y, w, h); for (let i = 0; i < 5; i++) { g.fillStyle = alpha('#9fe0ff', 0.4); g.fillRect(x + 12, y + 14 + i * 18, (w - 30) * (0.4 + ((i * 37) % 6) / 10), 6); } }); seg(g, [[CX + 125, top - 20], [CX + 125, top]], 8, '#0c0c12'); return top; }

// ---------- Mom's little house, exterior: one storey, lit window, porch light, neighbour houses ----------
export function houseExt(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = GYf(), CX = CXf();
  const wall = shade(M.wall, -0.15), wallD = shade(M.wall, -0.55);
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); if (o.mood === 'golden' || o.mood === 'dusk') FX.sun(g, CX + 520, GY - 380, 56, '#fff3dc', M.key, 5); else { FX.stars(g, t, { count: 120 }); FX.moon(g, CX - 560, GY - 760, 40); } FX.hills(g, { y: GY - 140, amp: 90, color: mix(M.sky[0], wallD, 0.7), seed: 9 }); });
  layer(g, cam, 0.4, (g) => { for (const dx of [-900, 900]) { const hx = CX + dx - 220; FX.facade(g, { x: hx, y: GY - 20, w: 440, h: 280, color: shade(wall, -0.25), win: M.practical, dark: wallD, cols: 3, rows: 1, lit: o.neighbourLit ?? 0.5, seed: 40 + dx }); poly(g, [[hx - 30, GY - 300], [hx + 470, GY - 300], [hx + 220, GY - 430]], shade(wallD, -0.25)); } for (const dx of [-560, 620]) FX.tree(g, CX + dx, GY - 10, 1.6, shade(wallD, -0.3)); });
  layer(g, cam, 0.7, (g) => {
    const hx = CX - 300, hw = 600, hy = GY, hh = 300;
    g.fillStyle = wall; g.fillRect(hx, hy - hh, hw, hh); poly(g, [[hx - 50, hy - hh], [hx + hw + 50, hy - hh], [hx + hw / 2, hy - hh - 190]], shade(wallD, -0.2));
    seg(g, [[hx - 50, hy - hh], [hx + hw / 2, hy - hh - 190], [hx + hw + 50, hy - hh]], 8, alpha(M.rim, 0.35));
    rr(g, hx + hw - 150, hy - hh - 160, 50, 100, 4); g.fillStyle = shade(wallD, -0.1); g.fill();
    const lit = o.lit ?? 1;
    for (const wx of [hx + 70, hx + 380]) FX.windowFrame(g, { x: wx, y: hy - 230, w: 150, h: 120, cols: 2, rows: 2, frame: wallD, bar: 7 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, [mix(wallD, M.practical, lit), mix(wallD, shade(M.practical, -0.4), lit)]); g.fillRect(x, y, w, h); if (o.momInWindow && wx > hx + 300) { circle(g, x + w * 0.55, y + h * 0.42, 14, alpha('#0e0b12', 0.9)); g.fillStyle = alpha('#0e0b12', 0.9); g.fillRect(x + w * 0.55 - 16, y + h * 0.42 + 12, 32, 60); circle(g, x + w * 0.55 - 12, y + h * 0.42 - 12, 8, alpha('#0e0b12', 0.9)); } });
    for (const wx of [hx + 70, hx + 380]) glow(g, wx + 75, hy - 170, 200, M.practical, 0.3 * lit);
    FX.door(g, { x: hx + hw / 2 - 45, y: hy, w: 90, h: 180, color: shade(wallD, 0.1), open: 0, light: M.practical });
    glow(g, hx + hw / 2, hy - 200, 140, M.practical, 0.6 * (o.porch ?? 1)); circle(g, hx + hw / 2, hy - 200, 8, '#fff1d0');
    if (o.sign) { seg(g, [[hx + hw + 90, hy], [hx + hw + 90, hy - 130]], 6, '#2a2028'); rr(g, hx + hw + 20, hy - 190, 140, 70, 4); g.fillStyle = '#efe6d6'; g.fill(); text(g, o.sign, hx + hw + 90, hy - 155, { size: 26, color: '#b8352a', font: FONTS.ui, weight: 900 }); }
    // mailbox
    seg(g, [[hx - 120, hy], [hx - 120, hy - 90]], 6, '#2a2028'); rr(g, hx - 150, hy - 120, 60, 36, 10); g.fillStyle = shade(wallD, 0.2); g.fill();
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.grass, -0.45), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); poly(g, [[CX - 40, GY], [CX + 40, GY], [CX + 160, GY + 300], [CX - 160, GY + 300]], shade(M.road, -0.1)); FX.pool(g, CX, GY + 20, 300, 50, M.practical, 0.25 * (o.porch ?? 1)); });
  return { GY, CX, M };
}
