// sets/track.js: athletics track at dusk. view 'stands' (tiered crowd, floodlights, giant screen) or
// 'road' (fence with an open gate, the main road beyond). Returns { GY, CX, M, fenceY, roadY, gateX }.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { GYd } from '../lib.js';

export const trackColor = (M) => mix(M.floor, '#a8452e', 0.55);
export function track(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYd(), CX = E.W / 2, view = o.view || 'stands';
  const fenceY = GY - V(230, 330), roadY = fenceY - V(40, 60), gateX = o.gateX ?? CX + V(380, 160);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX - V(620, 260), fenceY - V(260, 520), 58, '#fff3dc', M.key, 5); FX.clouds(g, { y: V(140, 300), h: 180, color: '#ffd9c0', a: 0.12, seed: 21 }); });
  if (view === 'stands') {
    layer(g, cam, 0.35, (g) => {
      const base = fenceY - 10, rows = 9;
      for (let j = 0; j < rows; j++) { const y = base - j * 34; g.fillStyle = shade(M.wall, -0.45 + j * 0.02); g.fillRect(-E.W, y - 34, E.W * 3, 34); }
      FX.crowd(g, t, { x: -E.W, y: base - rows * 34 + 30, w: E.W * 3, rows: rows, rowH: 34, size: 1.4, color: shade(M.wall, -0.1), colors: o.crowdColors, flags: 0.03, cheer: o.cheer ?? 0.3, wave: o.wave ?? 0 });
      g.fillStyle = shade(M.wall, -0.6); g.fillRect(-E.W, base - rows * 34 - 40, E.W * 3, 44);
      for (const x of [-500, CX - 900, CX + 820, E.W + 500]) { seg(g, [[x, base - rows * 34 - 40], [x, base - rows * 34 - 420]], 12, shade(M.dark, -0.2)); rr(g, x - 90, base - rows * 34 - 500, 180, 90, 8); g.fillStyle = shade(M.dark, -0.3); g.fill(); for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) { circle(g, x - 55 + i * 55, base - rows * 34 - 478 + k * 42, 15, '#fff8e8'); } glow(g, x, base - rows * 34 - 455, 420, '#fff2d6', 0.35); FX.lightCone(g, x, base - rows * 34 - 455, { angle: Math.PI / 2 + (x < CX ? -0.35 : 0.35), spread: 0.5, len: 1300, color: '#fff2d6', a: 0.07 }); }
      // giant screen
      const sx = CX + V(150, -200), sy = base - rows * 34 - V(330, 380); rr(g, sx - 10, sy - 10, 420, 220, 10); g.fillStyle = '#0a0a10'; g.fill(); g.fillStyle = o.screenColor || '#1a2a44'; g.fillRect(sx, sy, 400, 200);
      if (o.screenText) text(g, o.screenText, sx + 200, sy + 100, { size: 50, color: o.screenTextColor || '#ffe7b0', font: FONTS.title, weight: 700, glow: 18, glowColor: alpha(o.screenTextColor || '#ffb060', 0.7) });
      glow(g, sx + 200, sy + 100, 340, o.screenTextColor || '#6a8ac0', 0.18);
    });
  } else {
    layer(g, cam, 0.4, (g) => {
      for (let i = 0; i < 9; i++) FX.facade(g, { x: -E.W + i * 520, y: roadY - 40, w: 480, h: V(300, 560) + (i % 3) * 50, color: shade(M.wall, -0.35 - (i % 2) * 0.08), win: M.practical, dark: shade(M.wall, -0.6), cols: 3, rows: 2, lit: 0.4, seed: 120 + i });
      g.fillStyle = shade(M.floor, -0.1); g.fillRect(-E.W, roadY - 40, E.W * 3, 14);
      g.fillStyle = linGrad(g, 0, roadY - 30, 0, fenceY, [shade(M.road, -0.1), shade(M.road, 0.08)]); g.fillRect(-E.W, roadY - 30, E.W * 3, fenceY - roadY + 30);
      for (let x = -E.W; x < E.W * 2; x += 150) { g.fillStyle = alpha('#f2e6c8', 0.5); g.fillRect(x, roadY - 6, 70, 5); }
      for (const x of [-300, 700, 1700, 2700]) FX.lampPost(g, x, roadY - 30, 240, { light: M.practical, a: 0.12 });
      o.onRoad?.(g, roadY);
    });
  }
  layer(g, cam, 0.6, (g) => {
    // infield grass up to the fence, then fence (with open gate in 'road' view)
    g.fillStyle = linGrad(g, 0, fenceY, 0, GY - 110, [shade(M.grass, -0.5), shade(M.grass, -0.3)]); g.fillRect(-E.W, fenceY, E.W * 3, GY - 110 - fenceY + 4);
    const ink = shade(M.dark, -0.2), fh = view === 'road' ? 60 : 44;
    seg(g, [[-E.W, fenceY - fh], [gateX - 60, fenceY - fh]], 4, ink); seg(g, [[gateX + 60, fenceY - fh], [E.W * 2, fenceY - fh]], 4, ink);
    for (let x = -E.W; x < E.W * 2; x += 40) if (view !== 'road' || Math.abs(x - gateX) > 60) seg(g, [[x, fenceY], [x, fenceY - fh]], 2, alpha(ink, 0.8));
    if (view === 'road') { for (const s of [-1, 1]) { g.fillStyle = ink; g.fillRect(gateX + s * 62 - 5, fenceY - fh - 14, 10, fh + 14); } for (let i = 0; i < 4; i++) seg(g, [[gateX + 66 + i * 12, fenceY + 6 + i * 3], [gateX + 66 + i * 12, fenceY - fh + 6 + i * 3]], 2.5, ink); }
    o.onField?.(g, fenceY);
  });
  layer(g, cam, 0.9, (g) => {
    const tc = trackColor(M), top = GY - 110;
    g.fillStyle = linGrad(g, 0, top, 0, GY + 300, [shade(tc, -0.15), shade(tc, -0.45), shade(M.dark, -0.2)]); g.fillRect(-E.W, top, E.W * 3, E.H * 2);
    for (let i = 0; i < 6; i++) { const y = top + 8 + i * (i * 9 + 22); g.fillStyle = alpha('#f4ece0', 0.45 - i * 0.04); g.fillRect(-E.W, y, E.W * 3, 3 + i * 0.6); }
    if (o.startLine) { g.fillStyle = alpha('#f4ece0', 0.6); poly(g, [[o.startLine - 4, top], [o.startLine + 4, top], [o.startLine + 40, GY + 300], [o.startLine + 28, GY + 300]], alpha('#f4ece0', 0.6)); }
    FX.pool(g, CX, GY + 20, 900, 110, '#fff2d6', 0.12);
  });
  return { GY, CX, M, fenceY, roadY, gateX };
}
// starting block (side view) at x, ground y
export function blocks(g, x, GY, s = 1, c = '#c8c2d0') { g.save(); g.translate(x, GY); g.scale(s, s); poly(g, [[-70, 0], [30, 0], [30, -10], [-70, -10]], shade(c, -0.4)); poly(g, [[-60, -10], [-40, -10], [-46, -40]], c); poly(g, [[-6, -10], [14, -10], [8, -34]], c); g.restore(); }
