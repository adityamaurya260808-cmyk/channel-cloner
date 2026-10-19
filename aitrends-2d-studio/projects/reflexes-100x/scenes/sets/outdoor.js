// sets/outdoor.js: garden, park, school gate, street (walk home) and road. Each returns { GY, CX, M }.
// Call set(g, t, cam, opts) first, then draw characters at depth 1. Walls/skies extend far past the frame.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { GYd } from '../lib.js';

function lawn(g, M, GY, t, o = {}) {
  g.fillStyle = linGrad(g, 0, GY - 10, 0, GY + 500, [shade(M.grass, o.lift ?? -0.25), shade(M.grass, -0.65), shade(M.dark, -0.2)]); g.fillRect(-E.W * 2, GY - 10, E.W * 5, E.H * 2);
  const r = rng(o.seed || 31); g.strokeStyle = alpha(shade(M.grass, 0.15), 0.35); g.lineWidth = 2;
  for (let i = 0; i < 160; i++) { const x = -E.W + r() * E.W * 3, y = GY + r() * 260, h = 6 + r() * 10; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(t * 1.5 + i) * 2, y - h); g.stroke(); }
}

// backyard at golden hour: fence, house corner with a warm window, trees, low sun
export function garden(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky); const sx = CX + V(380, 180), sy = GY - V(330, 760);
    FX.sun(g, sx, sy, 64, '#fff3dc', M.key, 5); FX.godRays(g, sx, sy, { count: 9, angle: Math.PI / 2 + 0.3, spread: 2.4, len: 1600, a: 0.05, t });
    FX.clouds(g, { y: GY - V(800, 1400), h: 220, color: '#ffe7c7', a: 0.14, seed: 4 });
  });
  layer(g, cam, 0.3, (g) => {
    FX.hills(g, { y: GY - V(130, 260), amp: 70, color: mix(M.sky[0], M.dark, 0.55), seed: 5 });
    for (let i = 0; i < 9; i++) FX.tree(g, -600 + i * 420 + (i % 2) * 90, GY - V(120, 240), 1.4 + (i % 3) * 0.3, mix(M.sky[0], M.dark, 0.72));
  });
  layer(g, cam, 0.55, (g) => {
    const fy = GY - V(150, 220), wall = shade(M.wall, -0.35);
    g.fillStyle = shade(M.wall, -0.5); g.fillRect(-E.W, fy, E.W * 3.5, GY - fy + 40);
    for (let x = -E.W; x < E.W * 2.5; x += 46) { g.fillStyle = (x / 46) % 2 ? shade(M.wall, -0.42) : shade(M.wall, -0.48); g.fillRect(x, fy - 14, 40, GY - fy + 54); poly(g, [[x, fy - 14], [x + 20, fy - 30], [x + 40, fy - 14]], shade(M.wall, -0.42)); g.fillStyle = alpha(M.rim, 0.22); g.fillRect(x, fy - 14, 40, 3); }
    // house corner on the left with a warm kitchen window
    const hx = -760, hw = 900, hy = GY - V(620, 1000);
    g.fillStyle = linGrad(g, 0, hy, 0, GY, [shade(wall, 0.05), wall, shade(wall, -0.3)]); g.fillRect(hx, hy, hw, GY - hy + 40);
    poly(g, [[hx - 60, hy + 10], [hx + hw + 60, hy + 10], [hx + hw / 2, hy - 180]], shade(M.wall, -0.6));
    FX.windowFrame(g, { x: hx + 520, y: hy + 110, w: 240, h: 200, cols: 2, rows: 2, frame: shade(wall, -0.5), bar: 8 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, [M.practical, shade(M.practical, -0.45)]); g.fillRect(x, y, w, h); });
    glow(g, hx + 640, hy + 210, 260, M.practical, 0.18);
  });
  layer(g, cam, 0.9, (g) => { lawn(g, M, GY, t, { lift: -0.5 }); FX.pool(g, CX + V(200, 60), GY + 50, 700, 90, M.key, 0.14); });
  return { GY, CX, M };
}
export function picnicTable(g, x, GY, o = {}) {
  const c = o.color || '#2a1b18', top = GY - 140;
  rr(g, x - 220, top - 16, 440, 20, 6); g.fillStyle = c; g.fill(); g.fillStyle = 'rgba(255,210,150,.35)'; g.fillRect(x - 214, top - 16, 428, 3);
  for (const dx of [-170, 170]) { seg(g, [[x + dx - 30, GY], [x + dx + 30, top]], 10, c); seg(g, [[x + dx + 30, GY], [x + dx - 30, top]], 10, c); }
  rr(g, x - 250, GY - 76, 500, 12, 4); g.fillStyle = shade(c, 0.1); g.fill();
  return { top: top - 16 };
}

// park at golden hour: open grass, tree clumps, distant skyline, low sun behind
export function park(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX - V(260, 120), GY - V(260, 640), 72, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - V(760, 1300), h: 200, color: '#ffe7c7', a: 0.12, seed: 9 }); });
  layer(g, cam, 0.25, (g) => FX.skyline(g, { x: -E.W, y: GY - V(160, 300), w: E.W * 3, minH: 40, maxH: V(220, 360), color: mix(M.sky[1], M.dark, 0.7), windowColor: alpha(M.practical, 0.5), lit: 0.12, seed: 14 }));
  layer(g, cam, 0.45, (g) => { FX.hills(g, { y: GY - V(60, 160), amp: 50, color: shade(M.grass, -0.55), seed: 7 }); for (let i = 0; i < 10; i++) FX.tree(g, -700 + i * 380 + (i % 3) * 70, GY - V(60, 150), 1.1 + (i % 2) * 0.5, shade(M.grass, -0.72)); });
  layer(g, cam, 0.9, (g) => { lawn(g, M, GY, t, { lift: -0.15, seed: 41 }); FX.pool(g, CX - V(200, 60), GY + 40, 800, 100, M.key, 0.12); });
  return { GY, CX, M };
}

// school gate (golden afternoon): brick wall, iron gate, school building behind, trees
export function gate(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, CX + V(520, 220), GY - V(420, 820), 60, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.4, (g) => {
    const top = GY - V(520, 900), w = shade(M.wall, -0.25);
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(w, 0.05), shade(w, -0.3)]); g.fillRect(-E.W, top, E.W * 3, GY - top);
    for (let i = 0; i < 14; i++) for (let j = 0; j < 2; j++) { const wx = -E.W + 150 + i * 330, wy = top + 70 + j * 190; g.fillStyle = (i + j) % 3 ? alpha(M.practical, 0.75) : shade(M.wall, -0.55); g.fillRect(wx, wy, 150, 120); }
    g.fillStyle = shade(M.wall, -0.55); g.fillRect(-E.W, top - 30, E.W * 3, 34);
    for (const x of [-500, 2400]) FX.tree(g, x, GY - 40, 2.6, shade(M.grass, -0.7));
  });
  layer(g, cam, 0.8, (g) => {
    const wy = GY - V(170, 220), brick = shade(M.wall, -0.15);
    g.fillStyle = brick; g.fillRect(-E.W, wy, E.W + CX - 260, GY - wy); g.fillRect(CX + 260, wy, E.W * 2, GY - wy);
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 2; for (let y = wy + 22; y < GY; y += 22) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 3, y); g.stroke(); }
    g.fillStyle = shade(brick, 0.2); g.fillRect(-E.W, wy - 10, E.W + CX - 250, 12); g.fillRect(CX + 250, wy - 10, E.W * 2, 12);
    for (const px of [CX - 280, CX + 240]) { g.fillStyle = shade(brick, -0.2); g.fillRect(px, wy - 90, 40, GY - wy + 90); circle(g, px + 20, wy - 96, 22, shade(brick, -0.1)); }
    // open iron gate (one leaf swung)
    const ink = shade(M.dark, -0.3); for (let i = 0; i < 6; i++) seg(g, [[CX - 240 + i * 20, GY], [CX - 240 + i * 20, wy - 40]], 4, ink); seg(g, [[CX - 240, wy - 30], [CX - 140, wy - 30]], 5, ink); seg(g, [[CX - 240, GY - 30], [CX - 140, GY - 30]], 5, ink);
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.road, 0.1), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.2)', 0.1); FX.pool(g, CX, GY + 30, 520, 70, M.key, 0.2);
  });
  return { GY, CX, M };
}

// sidewalk at sunset (walking home): row houses, lamp posts, low sun down the street
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, CX + V(120, 60), GY - V(240, 600), 70, '#fff3dc', M.key, 5); FX.godRays(g, CX + 120, GY - 240, { count: 10, angle: Math.PI / 2, spread: 2.6, len: 1500, a: 0.05, t }); });
  layer(g, cam, 0.4, (g) => { for (let i = 0; i < 9; i++) FX.facade(g, { x: -E.W + i * 520, y: GY - 20, w: 470, h: V(420, 700) + (i % 3) * 60, color: shade(M.wall, -0.35 - (i % 2) * 0.08), win: M.practical, dark: shade(M.wall, -0.6), cols: 3, rows: 3, lit: 0.45, seed: 60 + i }); });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY - 20, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.25)', 0.09);
    for (const x of [-300, 700, 1700, 2700]) FX.lampPost(g, x, GY, V(380, 520), { light: M.practical, a: 0.12 });
    FX.pool(g, CX, GY + 30, 800, 90, M.key, 0.15);
  });
  return { GY, CX, M };
}

// road: asphalt running left-right, curb + sidewalk in front, facades behind. o.night for the "crazy" beat.
export function road(g, t, cam, o = {}) {
  const M = mood(o.mood || (o.night ? 'night' : 'dusk')), GY = GYd(), CX = E.W / 2, roadTop = GY - V(190, 260);
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); if (o.night) { FX.stars(g, t, { count: 90, area: [-200, 0, E.W + 400, E.H * 0.4] }); FX.moon(g, CX - V(500, 200), V(170, 300), 40); } else FX.sun(g, CX - V(560, 200), roadTop - V(260, 600), 60, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.4, (g) => {
    for (let i = 0; i < 10; i++) FX.facade(g, { x: -E.W + i * 480, y: roadTop - 30, w: 440, h: V(360, 640) + (i % 4) * 50, color: shade(M.wall, -0.3 - (i % 2) * 0.1), win: M.practical, dark: shade(M.wall, -0.6), cols: 3, rows: 3, lit: o.night ? 0.55 : 0.35, seed: 80 + i });
    g.fillStyle = shade(M.floor, -0.15); g.fillRect(-E.W, roadTop - 30, E.W * 3, 30);
  });
  layer(g, cam, 0.75, (g) => {
    g.fillStyle = linGrad(g, 0, roadTop, 0, GY - 30, [shade(M.road, -0.15), shade(M.road, 0.05)]); g.fillRect(-E.W, roadTop, E.W * 3, GY - roadTop);
    const dash = alpha('#f2e6c8', 0.55), my = (roadTop + GY - 30) / 2; for (let x = -E.W; x < E.W * 2; x += 180) { g.fillStyle = dash; g.fillRect(x, my - 4, 90, 8); }
    if (o.night) for (let i = 0; i < 6; i++) FX.lensStreak(g, -200 + i * 500, my + 20 + (i % 2) * 30, 400, M.practical, 0.12, 6);
    for (const x of [-400, 500, 1400, 2300]) FX.lampPost(g, x, roadTop - 20, V(360, 480), { light: M.practical, a: o.night ? 0.2 : 0.1 });
  });
  layer(g, cam, 0.95, (g) => {
    g.fillStyle = shade(M.floor, 0.18); g.fillRect(-E.W, GY - 34, E.W * 3, 14); g.fillStyle = shade(M.floor, -0.25); g.fillRect(-E.W, GY - 20, E.W * 3, 20);
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [shade(M.floor, 0.0), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 400, 'rgba(0,0,0,.25)', 0.12);
  });
  if (o.rain) FX.rain(g, t, { a: 0.22, count: 200 });
  return { GY, CX, M, roadTop, laneY: (roadTop + GY - 30) / 2 };
}
