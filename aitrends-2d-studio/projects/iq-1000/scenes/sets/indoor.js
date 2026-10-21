// sets/indoor.js: kitchen, bedroom, cinema, hallway, classroom, supermarket. Each returns { GY, CX, M }.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { GYd } from '../lib.js';

function wallAndFloor(g, M, GY, o = {}) {
  g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.dark, -0.2), shade(M.wall, o.wallLift ?? -0.2)]); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H);
  g.fillStyle = linGrad(g, 0, GY - 6, 0, GY + 500, [shade(M.floor, 0.08), shade(M.dark, -0.15)]); g.fillRect(-E.W * 2, GY - 6, E.W * 5, E.H * 2);
}

// kitchen, morning: big window (sunrise sky), upper cabinets, counter + toaster spot, wall clock, tiles
export function kitchen(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.45, (g) => {
    wallAndFloor(g, M, GY);
    const wx = CX - V(380, 300), wy = GY - V(640, 1000), ww = V(560, 600), wh = V(330, 420);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(M.wall, -0.55), bar: 12 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h); FX.sun(g, x + w * 0.65, y + h * 0.7, 46, '#fff7e6', M.key, 4);
      FX.hills(g, { y: y + h, amp: 40, color: alpha(shade(M.wall, -0.4), 0.8), seed: 3 }); for (let i = 0; i < 4; i++) FX.tree(g, x + 60 + i * 150, y + h + 10, 0.6, alpha(shade(M.wall, -0.6), 0.9));
    });
    glow(g, wx + ww / 2, wy + wh / 2, 520, M.key, 0.16); FX.godRays(g, wx + ww * 0.65, wy + wh * 0.6, { count: 6, angle: Math.PI * 0.62, spread: 0.6, len: 1100, a: 0.06, t });
    // upper cabinets either side
    for (const x of [CX - V(980, 760), CX + V(320, 360)]) { rr(g, x, wy - 20, V(560, 400), V(200, 240), 6); g.fillStyle = shade(M.wall, -0.4); g.fill(); seg(g, [[x + V(280, 200), wy - 10], [x + V(280, 200), wy + V(170, 210)]], 4, shade(M.wall, -0.55)); }
    FX.clock(g, CX + V(560, 340), wy - V(80, 140), 40, (o.clockT ?? 7 * 3600 + 42 * 60) + t * (o.clockSpeed ?? 1), { face: '#efe8e0', speed: 1 });
  });
  layer(g, cam, 0.7, (g) => {
    const cy = GY - V(170, 200);
    FX.counter(g, { x: -E.W, y: GY - 40, w: E.W * 3, h: V(150, 170), color: shade(M.wall, -0.45), top: shade(M.wall, -0.1), doors: 22 });
    g.fillStyle = alpha(M.key, 0.25); g.fillRect(-E.W, cy - 30, E.W * 3, 3);
    // tiles
    g.fillStyle = linGrad(g, 0, GY - 40, 0, GY + 400, [shade(M.floor, 0.1), shade(M.dark, -0.15)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2);
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 120) { g.beginPath(); g.moveTo(x, GY - 40); g.lineTo(CX + (x - CX) * 2.4, GY + 500); g.stroke(); }
    FX.floorLines(g, GY - 40, GY + 500, 'rgba(0,0,0,.18)', 0.12); FX.pool(g, CX - 60, GY + 20, 520, 80, M.key, 0.22);
  });
  return { GY, CX, M, counterTop: GY - 40 - V(150, 170) - 8 };
}
export function table(g, x, GY, w = 360, c = '#24161a') { const top = GY - 150; rr(g, x - w / 2, top - 14, w, 16, 6); g.fillStyle = c; g.fill(); g.fillStyle = 'rgba(255,210,150,.3)'; g.fillRect(x - w / 2 + 6, top - 14, w - 12, 3); for (const dx of [-w / 2 + 24, w / 2 - 24]) seg(g, [[x + dx, top], [x + dx, GY]], 9, c); return { top: top - 14 }; }

// bedroom at night: moon window, bed, desk with gaming monitor, door with light gap
export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = GYd(), CX = E.W / 2, scr = o.screen || '#59c8ff';
  layer(g, cam, 0.45, (g) => {
    wallAndFloor(g, M, GY, { wallLift: -0.1 });
    const wx = CX - V(140, 260), wy = GY - V(640, 1050), ww = V(420, 520), wh = V(360, 440);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(M.wall, -0.5), bar: 10 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h); FX.stars(g, t, { count: 50, area: [x, y, w, h * 0.7] }); FX.moon(g, x + w * 0.7, y + h * 0.3, 34);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.45, color: shade(M.wall, -0.5), windowColor: alpha(M.practical, 0.7), lit: 0.2, seed: 6 });
    });
    FX.lightCone(g, wx + ww / 2, wy + wh / 2, { angle: Math.PI * 0.55, spread: 0.7, len: 900, color: '#c9d4ff', a: 0.08 });
    // poster + shelf
    rr(g, CX + V(380, 260), wy + 20, 160, 220, 4); g.fillStyle = shade(M.wall, 0.15); g.fill(); circle(g, CX + V(460, 340), wy + 110, 46, alpha(M.practical, 0.5));
    // door far right with light gap
    const dx = CX + V(700, 380); g.fillStyle = shade(M.wall, -0.45); g.fillRect(dx, GY - V(420, 520), 190, V(420, 520));
    g.fillStyle = alpha(M.practical, o.doorGlow ?? 0.75); g.fillRect(dx - 4, GY - 8, 198, 8); glow(g, dx + 95, GY - 4, 160, M.practical, 0.25 * (o.doorGlow ?? 0.75));
    circle(g, dx + 160, GY - V(210, 260), 8, shade(M.wall, 0.2));
  });
  layer(g, cam, 0.75, (g) => {
    // desk + monitor on the left
    const dx = CX - V(760, 470), top = GY - 160;
    rr(g, dx - 220, top, 440, 16, 4); g.fillStyle = shade(M.wall, -0.55); g.fill(); seg(g, [[dx - 200, top], [dx - 200, GY]], 10, shade(M.wall, -0.6)); seg(g, [[dx + 200, top], [dx + 200, GY]], 10, shade(M.wall, -0.6));
    FX.screen(g, { x: dx - 170, y: top - 230, w: 340, h: 200, glowC: scr, a: 0.35, bg: shade(scr, -0.7) }, (g, x, y, w, h) => { o.screenFx?.(g, x, y, w, h); if (!o.screenFx) { g.fillStyle = alpha(scr, 0.4); for (let i = 0; i < 6; i++) g.fillRect(x + 20 + i * 52, y + h - 40 - ((i * 37 + Math.floor(t * 3) * 13) % 90), 30, 40 + ((i * 37 + Math.floor(t * 3) * 13) % 90)); } });
    seg(g, [[dx, top - 30], [dx, top]], 12, '#0c0b10');
    FX.lightCone(g, dx, top - 130, { angle: Math.PI * 0.15, spread: 1.2, len: 900, color: scr, a: 0.1 });
    // bed on the right
    FX.bed(g, { x: CX + V(160, 120), y: GY, w: V(520, 420), color: shade('#4a5aa0', -0.2), frame: shade(M.wall, -0.55), pillow: '#cfd4ea' });
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.25)', 0.08); FX.pool(g, CX - 120, GY + 40, 520, 70, '#c9d4ff', 0.12);
  });
  return { GY, CX, M, deskX: CX - V(760, 470), deskTop: GY - 160, doorX: CX + V(700, 380) };
}

// cinema: dark rows, glowing screen above, projector beam from behind
export function cinema(g, t, cam, o = {}) {
  const M = mood('void'), GY = GYd(), CX = E.W / 2, sc = o.screenColor || '#cfe0ff';
  layer(g, cam, 0.35, (g) => {
    backdrop(g, ['#07070d', '#0e0d18']);
    const sw = V(1300, 900), sh = V(520, 520), sx = CX - sw / 2, sy = GY - V(820, 1300);
    rr(g, sx - 20, sy - 20, sw + 40, sh + 40, 6); g.fillStyle = '#0a0a10'; g.fill();
    g.fillStyle = alpha(sc, 0.18 * (o.screenA ?? 1)); g.fillRect(sx, sy, sw, sh); o.screenFx?.(g, sx, sy, sw, sh);
    glow(g, CX, sy + sh / 2, sw * 0.75, sc, 0.18 * (o.screenA ?? 1));
    for (const x of [sx - 120, sx + sw + 80]) { g.fillStyle = '#2a0e16'; g.fillRect(x, sy - 60, 40, sh + 200); }
  });
  layer(g, cam, 0.7, (g) => {
    FX.lightCone(g, CX + V(300, 100), -200, { angle: Math.PI * 0.62, spread: 0.18, len: 1200, color: sc, a: 0.07 * (o.screenA ?? 1) });
    for (let j = 0; j < 3; j++) { const y = GY - 80 + j * 90, c = shade('#2a1420', -0.2 - j * 0.15); for (let x = -E.W + (j % 2) * 60; x < E.W * 2; x += 120) { rr(g, x, y - 90, 100, 110, 18); g.fillStyle = c; g.fill(); } }
  });
  return { GY, CX, M, screen: { x: CX - V(650, 450), y: GY - V(820, 1300), w: V(1300, 900), h: 520 } };
}

// school hallway (cool fluorescent): lockers, high windows, ceiling tubes that can flicker
export function hallway(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = GYd(), CX = E.W / 2, fl = o.flicker ?? 1;
  layer(g, cam, 0.45, (g) => {
    wallAndFloor(g, M, GY, { wallLift: -0.05 });
    const top = GY - V(560, 860);
    for (let i = 0; i < 9; i++) FX.windowFrame(g, { x: -E.W + 140 + i * 520, y: top - 20, w: 300, h: V(150, 260), cols: 3, frame: shade(M.wall, -0.45), bar: 8 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, o.warm ? ['#f7cf98', '#f2b585'] : M.sky); g.fillRect(x, y, w, h); });
    // lockers
    const ly = GY - V(330, 430); for (let x = -E.W; x < E.W * 2.2; x += 92) { rr(g, x, ly, 86, GY - ly - 8, 4); g.fillStyle = shade(o.lockerColor || '#3a5a8a', -0.35); g.fill(); for (let k = 0; k < 4; k++) g.fillRect(x + 20, ly + 20 + k * 9, 46, 3); g.fillStyle = shade(M.wall, 0.2); g.fillRect(x + 66, ly + V(150, 200), 6, 30); }
    // ceiling tubes
    for (let i = 0; i < 7; i++) { const x = -E.W + 300 + i * 640, on = fl >= 1 ? 1 : fl; rr(g, x, top - V(170, 260), 260, 14, 7); g.fillStyle = alpha('#f4f8ff', 0.35 + 0.65 * on); g.fill(); glow(g, x + 130, top - V(160, 250), 320, '#dfe8ff', 0.35 * on); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, 0.25), shade(M.dark, -0.1)]); g.fillRect(-E.W, GY - 4, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.2)', 0.1); for (let i = 0; i < 7; i++) FX.pool(g, -E.W + 430 + i * 640, GY + 60, 260, 40, '#dfe8ff', 0.18 * fl);
    if (o.warm) FX.pool(g, CX, GY + 40, 900, 110, '#ffcf8f', 0.2);
  });
  return { GY, CX, M };
}

// classroom (warm daylight): green board, wall clock, windows on the right, desks
export function classroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = GYd(), CX = E.W / 2;
  layer(g, cam, 0.45, (g) => {
    wallAndFloor(g, M, GY);
    const bx = CX - V(560, 420), by = GY - V(560, 960); rr(g, bx - 14, by - 14, V(980, 840) + 28, V(300, 380) + 28, 8); g.fillStyle = shade(M.wall, -0.55); g.fill();
    g.fillStyle = '#1f3a32'; g.fillRect(bx, by, V(980, 840), V(300, 380)); g.strokeStyle = alpha('#e8f0e8', 0.6); g.lineWidth = 4;
    g.beginPath(); for (let i = 0; i < 6; i++) { g.moveTo(bx + 60, by + 60 + i * 40); g.lineTo(bx + 60 + 200 + ((i * 97) % 420), by + 60 + i * 40); } g.stroke();
    FX.clock(g, CX + V(560, 0), by - V(10, 110), 44, (o.clockT ?? 10 * 3600) + t * (o.clockSpeed ?? 1));
    for (let i = 0; i < 3; i++) FX.windowFrame(g, { x: CX + V(760, 300) + i * 420, y: GY - V(620, 900), w: 300, h: V(440, 520), cols: 2, rows: 2, frame: shade(M.wall, -0.5), bar: 10 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h); });
    FX.godRays(g, CX + V(900, 400), GY - V(560, 840), { count: 6, angle: Math.PI * 0.7, spread: 0.5, len: 1300, a: 0.06, t });
  });
  layer(g, cam, 0.8, (g) => { FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.2)', 0.08); FX.pool(g, CX + 300, GY + 40, 700, 90, M.key, 0.18); });
  return { GY, CX, M };
}
export function desk(g, x, GY, c = '#2a1c1e') { const top = GY - 120; rr(g, x - 110, top - 12, 220, 14, 4); g.fillStyle = c; g.fill(); seg(g, [[x - 96, top], [x - 96, GY]], 8, c); seg(g, [[x + 96, top], [x + 96, GY]], 8, c); return { top: top - 12 }; }

// supermarket aisle (cool): shelves of bright boxes, ceiling lights, glossy floor
export function market(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = GYd(), CX = E.W / 2;
  const cols = ['#e04a3a', '#f2c21a', '#3a7ae0', '#5fbf6a', '#f08a3a', '#c05ad0', '#e8e0d0'];
  layer(g, cam, 0.5, (g) => {
    wallAndFloor(g, M, GY, { wallLift: 0.05 });
    const top = GY - V(520, 760), r = rng(17);
    g.fillStyle = shade(M.wall, -0.35); g.fillRect(-E.W, top, E.W * 3, GY - top);
    for (let s = 0; s < 5; s++) { const sy = top + 30 + s * ((GY - top - 40) / 5); g.fillStyle = shade(M.wall, 0.25); g.fillRect(-E.W, sy + (GY - top - 40) / 5 - 12, E.W * 3, 10);
      for (let x = -E.W; x < E.W * 2; x += 46 + r() * 20) { const h = 50 + r() * 50, c = mix(cols[Math.floor(r() * cols.length)], M.wall, 0.55); g.fillStyle = shade(c, -0.25); g.fillRect(x, sy + (GY - top - 40) / 5 - 12 - h, 38, h); g.fillStyle = alpha('#ffffff', 0.25); g.fillRect(x + 6, sy + (GY - top - 40) / 5 - 12 - h + 10, 26, 8); } }
    text_sign(g, CX - 160, top - 70, o.sign || 'CEREAL', M);
    for (let i = 0; i < 6; i++) { rr(g, -E.W + 200 + i * 700, top - 170, 380, 12, 6); g.fillStyle = '#f4f8ff'; g.fill(); glow(g, -E.W + 390 + i * 700, top - 160, 380, '#e8f0ff', 0.3); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, 0.35), shade(M.dark, 0.0)]); g.fillRect(-E.W, GY - 4, E.W * 3, E.H * 2); FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.15)', 0.1); FX.pool(g, CX, GY + 40, 900, 100, '#e8f0ff', 0.18); });
  return { GY, CX, M };
}
function text_sign(g, x, y, str, M) { rr(g, x, y, 320, 64, 10); g.fillStyle = shade(M.wall, -0.6); g.fill(); g.fillStyle = '#f4f8ff'; g.font = '700 38px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, x + 160, y + 34); }
