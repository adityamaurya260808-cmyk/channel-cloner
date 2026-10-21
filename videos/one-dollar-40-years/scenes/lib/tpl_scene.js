// lib/tpl_scene.js — character / location templates. Each TPL entry is draw(g, t, info) (2D).
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, talkAmount, rr, seg, circle, ring, poly, glow, alpha, shade, mix, linGrad, radGrad, text, FONTS, measure, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { CAST } from '../cast.js';
import { kitchenTable, desk } from '../sets/places.js';
import { jar, note, coin, bill, phoneBody, phoneHand, appScreen, scribble, car, pizza, teacup, calendar } from '../sets/props.js';
import { who, PLACES, placeMood, camAt, at, drawActors, holdItem, T, popIn, icon, stamp, lair, money } from './common.js';

export const TPL = {};

function overlays(g, t, info, base, actorsOut = []) {
  const ui = S().ui;
  if (info.badge) { const b = info.badge; const a = clamp((t - (b.t0 ?? 0.2)) / 0.3) * clamp((info.dur - t) / 0.3); UI.badge(g, { str: b.str, a, color: b.color || ui.gold }); }
  if (info.callout) { const c = info.callout, h = actorsOut[c.actor ?? 0]?.head || [E.W / 2, E.H / 2, 30]; UI.callout(g, t, { at: [h[0], h[1] - h[2] * 1.2], to: [h[0] + (c.dx ?? 160), h[1] - h[2] * 1.2 + (c.dy ?? -150)], str: c.str, start: c.t0 ?? 0.3 }); }
  if (info.readout) { const r = info.readout; UI.readout(g, { label: r.label, value: r.value, x: r.x ?? V(140, 90), y: r.y ?? E.H - V(150, 620), a: ease.out(prog(t, r.t0 ?? 0.3, (r.t0 ?? 0.3) + 0.3)) * clamp((info.dur - t) / 0.25), color: r.color, align: r.align }); }
  if (info.bigText) { const b = info.bigText; const k = popIn(t, b.t0 ?? 0.2); if (k > 0) { g.save(); g.translate(b.x ?? E.W / 2, b.y ?? E.H * 0.2); g.scale(k, k); T(g, b.str, 0, 0, { size: b.size || 72, color: b.color || ui.gold, glow: 24, glowColor: alpha(b.color || ui.gold, 0.6), font: b.font || FONTS.title, weight: 700, spacing: 3, alpha: clamp((info.dur - t) / 0.3) }); g.restore(); } }
  if (info.stampTxt) stamp(g, info.stampTxt.str, info.stampTxt.x ?? E.W / 2, info.stampTxt.y ?? E.H * 0.25, t, info.stampTxt.t0 ?? 0.4, info.stampTxt);
  if (info.flashback) { veil(g, '#3a2a18', 0.28, 'color'); veil(g, '#000', 0.15); }
  if (info.tint) veil(g, info.tint[0], info.tint[1], info.tint[2] || 'source-over');
}
function atmo(g, t, info, M) {
  const a = info.atmo ?? (info.set === 'street' ? (info.setOpts?.rain ? 'rain' : 'dust') : info.set === 'bedroom' ? (info.setOpts?.rain ? 'rain' : 'dustCool') : 'dust');
  if (a === 'rain') FX.rain(g, t, { count: 280, a: 0.28 });
  if (a === 'dust') FX.dust(g, t, { count: 36, color: '#ffe2bd', a: 0.3 });
  if (a === 'dustCool') FX.dust(g, t, { count: 30, color: '#c8d4ff', a: 0.25 });
  if (a === 'drops') FX.drops(g, t, { count: 60, drift: 3 });
}

// ---------- staged scene: set + actors + items ----------
TPL.wide = (g, t, info) => {
  const cam = camAt(t, info.dur, info.cam), set = PLACES[info.set] || PLACES.kitchen;
  const base = set(g, t, cam, { ...(info.setOpts || {}) });
  let out = [];
  layer(g, cam, 1, (g) => {
    if (info.table) { const top = kitchenTable(g, base.CX + (info.tableX ?? 0), base.GY); for (const it of info.tableItems || []) { if (it.t0 != null && t < it.t0) continue; if (it.kind === 'jar') jar(g, base.CX + it.x, top, it.s ?? 0.5, { coins: it.coins ?? 1, bills: it.bills ?? 1, glow: it.glow ?? 0.7, note: it.note }); if (it.kind === 'tea') teacup(g, base.CX + it.x, top, 1.1, 1, t); if (it.kind === 'phone') { rr(g, base.CX + it.x - 30, top - 8, 60, 8, 3); g.fillStyle = '#0b0a10'; g.fill(); if (it.glow) glow(g, base.CX + it.x, top - 10, 120, '#7fb6ff', 0.4); } if (it.kind === 'paper') { g.fillStyle = '#e8dcc0'; g.fillRect(base.CX + it.x - 40, top - 4, 80, 4); } } }
    if (info.desk) desk(g, base.CX + (info.deskX ?? 0), base.GY);
    for (const c of info.chairs || []) { g.save(); g.translate(base.CX + c.x, 0); g.scale(c.facing ?? 1, 1); FX.chair(g, -18 * (c.s ?? 1.1), base.GY, c.s ?? 1.1, '#1e1418'); g.restore(); }
    for (const it of info.items || []) { const x = base.CX + it.x, y = base.GY + (it.y ?? 0); if (it.kind === 'jar') jar(g, x, y, it.s ?? 0.6, { coins: it.coins ?? 10, bills: it.bills ?? 1, glow: it.glow ?? 0.6, note: it.note }); if (it.kind === 'car') car(g, x, y, it.s ?? 0.9, it.color || '#f2c21a', { shine: it.shine ? t * 0.6 : 0, facing: it.facing }); }
    out = drawActors(g, t, info, base, info.actors, info.s);
  });
  if (info.fg === 'shoulder' && info.fgWho) blurLayer(g, 10, (g) => drawFigure(g, { x: base.CX + (info.fgX ?? -620), y: base.GY + 520, s: 3.4, facing: info.fgFacing ?? 1, outfit: who(info.fgWho), pose: POSES.stand, rim: { color: base.M.rim, dir: [0, -1], w: 5 } }), cam, 1.6);
  if (info.fg === 'plant') blurLayer(g, 12, (g) => { for (const [dx, r] of [[-860, 160], [-760, 120], [-900, 110]]) circle(g, base.CX + dx, base.GY - 40, r, shade(base.M.dark, -0.4)); }, cam, 1.7);
  atmo(g, t, info, base.M);
  overlays(g, t, info, base, out);
};

// ---------- giant face close-up ----------
TPL.face = (g, t, info) => {
  const set = PLACES[info.set] || PLACES.kitchen, M = info.set === 'lair' ? { ...placeMood('lair'), rim: '#3fd0c0' } : placeMood(info.set, info.setOpts);
  blurLayer(g, 14, (g) => set(g, t, { z: 1.5, x: info.bgx ?? -150 + t * 8, y: -120 }, { ...(info.setOpts || {}) })); veil(g, '#0a0610', info.veil ?? 0.35);
  if (info.setOpts?.rain || info.rain) FX.rain(g, t, { count: 200, a: 0.25 });
  const k = t / info.dur, r = V(300, 330) * (info.r ?? 1) * (1 + (info.push ?? 0.05) * ease.inOut(k));
  let cx = E.W / 2 + (info.fx ?? 0), cy = E.H * V(0.6, 0.55) + (info.fy ?? 0);
  if (info.shake) { cx += Math.sin(t * 43) * info.shake; cy += Math.cos(t * 37) * info.shake; }
  const talk = info.talk ? talkAmount(info.globalT, info.shot.start + info.talk[0], info.shot.start + info.talk[1]) : 0;
  const side = info.rimSide ?? -1;
  if (info.underGlow) glow(g, cx, cy + r * 1.1, r * 1.4, info.underGlow, 0.45);
  bigFace(g, cx, cy, r, { outfit: who(info.who), expr: at(t, info.exprs ?? info.expr, 'neutral'), talk, blink: (t % 3.3) > 3.2 && !info.noBlink, look: at(t, info.look, [0, 0]), rimColor: info.rimColor || M.rim, rimSide: side, tilt: info.tilt ? info.tilt * Math.sin(t * 0.8) : 0 });
  if (info.phoneEar) { const px = cx - side * r * 1.02, py = cy + r * 0.05; g.save(); g.translate(px, py); g.rotate(side * 0.25); rr(g, -r * 0.13, -r * 0.42, r * 0.26, r * 0.62, r * 0.05); g.fillStyle = '#0b0a10'; g.fill(); g.restore(); seg(g, [[px, py + r * 0.2], [px + side * r * 0.25, cy + r * 1.3]], r * 0.22, S().ink); glow(g, px, py, r * 0.6, '#7fb6ff', 0.25); }
  if (info.voice) { const px = cx - side * r * 1.05; FX.rings(g, px, cy, t, { count: 3, r0: r * 0.25, r1: r * 0.9, a: 0.4, color: info.voiceColor || M.rim, speed: info.voiceShake ? 2.6 : 1.4 }); }
  if (info.talk && talk > 0.05) FX.rings(g, cx, cy + r * 0.42, t, { count: 2, r0: r * 1.05, r1: r * 1.5, a: 0.18, color: M.rim });
  if (info.echo) { const a = clamp((t - (info.echo.t0 ?? 0.3)) / 0.4); for (let i = 0; i < 3; i++) T(g, info.echo.str, cx + (i - 1) * r * 1.7 * (1 + 0.15 * Math.sin(t + i)), cy - r * 1.25 + i * 30 - i * 20, { size: 46 - i * 6, color: S().ui.cream, alpha: a * (0.6 - i * 0.15), font: FONTS.serif, italic: true }); }
  if (info.float) { for (const [i, f] of info.float.entries()) { const k2 = popIn(t, f.t0 ?? 0.3 + i * 0.3); if (k2 <= 0) continue; T(g, f.str, cx + f.dx, cy + f.dy - t * 10, { size: f.size || 54, color: f.color || S().ui.gold, alpha: clamp(k2) * clamp((info.dur - t) / 0.3), glow: 16, glowColor: alpha(f.color || S().ui.gold, 0.5) }); } }
  if (info.fgBlur) blurLayer(g, 8, (g) => { if (info.fgBlur === 'pizza') pizza(g, E.W * 0.85, E.H * 0.95, 3.2); if (info.fgBlur === 'jar') jar(g, E.W * 0.12, E.H * 1.05, 2.8, { coins: 20, glow: 1 }); });
  FX.dust(g, t, { count: 26, color: '#ffe2bd', a: 0.22 });
  overlays(g, t, info, { M });
};

// ---------- phone insert ----------
TPL.phone = (g, t, info) => {
  const set = PLACES[info.set] || PLACES.bedroom, M = placeMood(info.set, info.setOpts);
  blurLayer(g, 16, (g) => set(g, t, { z: 1.6, x: 120 - t * 10, y: -100 }, { ...(info.setOpts || {}) })); veil(g, '#05040a', info.veil ?? 0.45);
  const z = 1 + (info.push ?? 0.07) * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const w = V(330, 420) * (info.pw ?? 1);
  let cx = E.W * (info.px ?? 0.52), cy = E.H * 0.53 + (info.slideIn ? (1 - ease.out(prog(t, 0, 0.5))) * 500 : 0);
  if (info.buzz && t > (info.buzz[0] ?? 0) && t < (info.buzz[1] ?? 99)) { cx += Math.sin(t * 70) * 6; cy += Math.cos(t * 63) * 3; }
  let btn = null; const app = { ...(info.app || {}), t };
  const scr = phoneBody(g, cx, cy, w, (g, x, y, sw, sh) => { const r = appScreen(g, x, y, sw, sh, app); btn = r?.button; }, { cracked: info.cracked, glowColor: info.glowColor, rot: info.rot });
  if (app.mode === 'call') btn = [scr.sx + scr.sw * 0.73, scr.sy + scr.sh * 0.84];
  if (info.hand !== false) {
    const th = at(t, info.thumb, 'off'); let tp = null;
    if (th === 'hover' && btn) tp = [btn[0] + 40, btn[1] + 70 + Math.sin(t * 2.2) * 8];
    if (th === 'press' && btn) { const k = ease.out(prog(t, info.pressAt ?? 0, (info.pressAt ?? 0) + 0.25)); tp = [btn[0] + 40 - 30 * k, btn[1] + 70 * (1 - k)]; }
    if (Array.isArray(th)) tp = [scr.sx + scr.sw * th[0], scr.sy + scr.sh * th[1]];
    phoneHand(g, cx, cy, w, info.sleeve || (who(info.who || 'SAM').color) || '#d64a33', M.rim, tp);
  }
  g.restore();
  if (info.buzz && t > (info.buzz[0] ?? 0) && t < (info.buzz[1] ?? 99)) for (const s of [-1, 1]) for (let i = 0; i < 3; i++) seg(g, [[cx + s * (w * 0.75 + i * 22), cy - 60 + i * 20], [cx + s * (w * 0.75 + i * 22), cy + 60 - i * 20]], 4, alpha(S().ui.cream, 0.35 * (0.5 + 0.5 * Math.sin(t * 30 + i))));
  FX.dust(g, t, { count: 20, color: '#c8d4ff', a: 0.2 });
  overlays(g, t, info, { M });
};

// ---------- jar macro ----------
TPL.jarMacro = (g, t, info) => {
  const set = PLACES[info.set] || PLACES.kitchen, M = placeMood(info.set, info.setOpts);
  blurLayer(g, 16, (g) => set(g, t, { z: 1.5, x: -60 + t * 8, y: -60 }, { ...(info.setOpts || {}), jar: false })); veil(g, '#08050c', info.veil ?? 0.4);
  const z = 1 + (info.push ?? 0.06) * ease.inOut(t / info.dur), s = V(2.8, 3.2) * (info.js ?? 1) * z;
  const jx = E.W * (info.jx ?? 0.5), jy = E.H * (info.jy ?? 0.9);
  // surface
  g.fillStyle = linGrad(g, 0, jy - 10, 0, E.H, [shade(M.floor, -0.1), shade(M.dark, -0.4)]); g.fillRect(-10, jy - 6, E.W + 20, E.H);
  glow(g, jx, jy - 10, 500, M.key, 0.15);
  const drops = info.drops || [], landed = drops.filter((d) => t > d + 0.5).length;
  const coins = (at(t, info.coins, 0) || 0) + landed;
  const grey = at(t, info.grey, false);
  jar(g, jx, jy, s, { coins, bills: at(t, info.bills, 0), billValue: info.billValue, note: info.note, glow: (info.glow ?? 0.8) * (1 + 0.15 * Math.sin(t * 2)), label: info.label && t > (info.labelAt ?? 0) ? info.label : null, grey, sprout: info.sprout ? key(t, info.sprout) : 0, dust: info.dust, lidOff: info.lidOff });
  // falling coins
  for (const d of drops) { const k = prog(t, d, d + 0.5); if (k <= 0 || k >= 1) { if (k >= 1 && t < d + 0.9) { FX.sparkle(g, jx, jy - 150 * s * 0.35, 40 * (1 - prog(t, d + 0.5, d + 0.9)), '#fff3d0'); FX.rings(g, jx, jy - 60 * s, t - d - 0.5, { count: 1, r0: 20, r1: 160, a: 0.4 }); } continue; } coin(g, jx + Math.sin(d * 7) * 20, lerp(-60, jy - 80 * s, ease.in(k)), 14 * s * 0.55, { edge: k > 0.6 }); }
  if (info.billDrop != null) { const k = ease.inOut(prog(t, info.billDrop, info.billDrop + 1.2)); if (k > 0 && k < 1) bill(g, jx + Math.sin(k * 9) * 60, lerp(-80, jy - 70 * s, k), 70 * s * 0.55, { rot: Math.sin(k * 7) * 0.6, value: info.billValue || '1' }); }
  // pulling a coin out
  if (info.pull) { const p = info.pull, k = ease.inOut(prog(t, p.t0, p.t0 + 1.0)), gy = clamp((t - (p.greyAt ?? p.t0 + 1.1)) / 0.5); const cx = jx + lerp(0, 260, k), cy = lerp(jy - 30 * s, jy - 230 * s, k);
    coin(g, cx, cy, 13 * s * 0.75, { grey: gy > 0.5 }); if (gy > 0 && gy < 1) FX.rings(g, cx, cy, t, { count: 2, r0: 30, r1: 120, a: 0.4, color: '#9a98a6' });
    for (const [c, d] of [[M.rim, -5], [S().ink, 0]]) { g.save(); g.translate(d, d); seg(g, [[cx + 30, cy + 10], [E.W + 300, cy + 300]], 70, c); circle(g, cx + 26, cy + 6, 38, c); seg(g, [[cx + 10, cy - 24], [cx - 22, cy - 6]], 18, c); g.restore(); }
    seg(g, [[cx + 210, cy + 110], [E.W + 300, cy + 330]], 96, who(info.who || 'SAM').color);
    if (gy > 0.5 && info.pull.label) T(g, info.pull.label, cx - 40, cy - 120, { size: 44, color: '#b8b6c4', alpha: clamp(gy * 2 - 1) * clamp((info.dur - t) / 0.3), spacing: 3 }); }
  if (info.reach != null) { const k = ease.inOut(prog(t, info.reach, info.reach + 1.2)); const hx = lerp(E.W + 200, jx + 120 * s * 0.45, k), hy = jy - 80 * s; for (const [c, d] of [[M.rim, -5], [S().ink, 0]]) { g.save(); g.translate(d, d); seg(g, [[hx, hy], [hx + 900, hy + 200]], 70, c); circle(g, hx, hy, 46, c); for (let i = 0; i < 4; i++) seg(g, [[hx - 10, hy - 30 + i * 20], [hx - 70, hy - 36 + i * 22]], 18, c); g.restore(); } seg(g, [[hx + 230, hy + 50], [hx + 900, hy + 220]], 96, who(info.who || 'SAM_OLD').color); }
  if (info.multiply) for (let i = 0; i < 6; i++) { const ph = (t * 0.9 + i / 6) % 1; FX.sparkle(g, jx + Math.sin(i * 2.3) * 120 * s * 0.4, jy - 30 * s - ph * 80 * s * 0.4, 26 * Math.sin(ph * Math.PI), '#fff3d0'); }
  FX.dust(g, t, { count: 34, color: '#ffe2bd', a: 0.3 });
  overlays(g, t, info, { M });
};

// ---------- note macro (front / back / flip) ----------
TPL.noteMacro = (g, t, info) => {
  const set = PLACES[info.set] || PLACES.bedroom;
  blurLayer(g, 18, (g) => set(g, t, { z: 1.6, x: -100, y: -80 }, { ...(info.setOpts || {}) })); veil(g, '#08050c', 0.45);
  const z = 1 + 0.07 * ease.inOut(t / info.dur), w = V(820, 820) * z, h = w * 0.62;
  const flip = info.flip ? ease.inOut(prog(t, info.flip[0], info.flip[1])) : info.back ? 1 : 0;
  glow(g, E.W / 2, E.H / 2, w * 0.8, info.warm ? '#ffcf8a' : '#c8d4ff', info.warm ? 0.3 : 0.12);
  note(g, E.W / 2, E.H / 2 + Math.sin(t * 0.8) * 6, w, h, { rot: -0.04 + 0.01 * Math.sin(t), lines: info.lines || ['One a day.', "Don't touch."], back: info.backLines || ['Unless it\'s for', 'someone you love.'], size: w * 0.085, tape: true, flip });
  if (info.ghost && flip < 0.5) scribble(g, E.W / 2, E.H / 2 + h * 0.05, w * 0.8, h * 0.6, 4, 'rgba(60,40,60,.12)');
  if (info.reveal) { const k = clamp((t - info.reveal) / 0.8); if (k > 0) { glow(g, E.W / 2, E.H / 2, w * 0.7, '#ffd59a', 0.35 * k); FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.5 * k, seed: 11 }); } }
  FX.dust(g, t, { count: 24, color: '#ffe9d2', a: 0.25 });
  overlays(g, t, info, { M: placeMood(info.set) });
};

// ---------- freeze frame: the note knocked loose ----------
TPL.freezeNote = (g, t, info) => {
  const M = placeMood('bedroom');
  blurLayer(g, 12, (g) => PLACES.bedroom(g, 0, { z: 1.4, x: -60, y: -60 }, { jar: false })); veil(g, '#0a1630', 0.4);
  const jx = E.W * 0.32, jy = E.H * 0.95, s = V(2.4, 2.6);
  jar(g, jx, jy, s, { coins: 40, bills: 3, glow: 0.8 });
  // the frozen hand
  const hx = jx + 210, hy = jy - 300; for (const [c, d] of [[M.rim, -5], [S().ink, 0]]) { g.save(); g.translate(d, d); seg(g, [[hx, hy], [hx + 900, hy + 160]], 70, c); circle(g, hx, hy, 46, c); for (let i = 0; i < 4; i++) seg(g, [[hx - 10, hy - 30 + i * 20], [hx - 70, hy - 36 + i * 22]], 18, c); g.restore(); } seg(g, [[hx + 230, hy + 40], [hx + 900, hy + 180]], 96, CAST.SAM_OLD.color);
  // note hanging in mid air, rotating slowly
  const fl = info.flipTo ? ease.inOut(prog(t, info.flipAt ?? 1.2, (info.flipAt ?? 1.2) + 1.6)) * info.flipTo : 0;
  const nx = E.W * 0.6 + t * 6, ny = E.H * 0.38 - t * 4;
  g.save(); g.translate(nx, ny); g.rotate(0.25 + t * 0.05); note(g, 0, 0, 360, 230, { lines: ['One a day.', "Don't touch."], back: ['· · ·'], size: 32, tape: true, flip: fl }); g.restore();
  FX.drops(g, t, { count: 50, rMin: 2, rMax: 9, drift: 2, color: '#cfe0ff' });
  FX.rings(g, nx, ny, t, { count: 3, r0: 160, r1: 420, a: 0.25, speed: 0.5, color: '#cfe0ff' });
  UI.badge(g, { str: 'FROZEN', color: '#cfe0ff', a: clamp(t / 0.4) });
  overlays(g, t, info, { M });
};

// ---------- title card ----------
TPL.title = (g, t, info) => {
  const cam = camAt(t, info.dur, { z: [1.08, 1.0], x: [0, 0] });
  blurLayer(g, 6, (g) => { const b = PLACES.kitchen(g, t, cam, {}); layer(g, cam, 1, (g) => { const top = kitchenTable(g, b.CX, b.GY); jar(g, b.CX, top, 0.7, { coins: 1, bills: 1, glow: 1.3 }); }); });
  veil(g, '#0a0610', 0.45);
  UI.titleCard(g, t, { lines: info.lines || ['WHAT IF YOU INVESTED', '$1 EVERY DAY', 'FOR 40 YEARS?'], sub: info.sub, dur: info.dur, y: E.H * 0.47 });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
};
TPL.bigLine = (g, t, info) => {
  const set = PLACES[info.set] || PLACES.kitchen;
  if (info.set === 'blueprint') { const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); }
  else { blurLayer(g, 10, (g) => set(g, t, camAt(t, info.dur, { z: [1.12, 1.02] }), { ...(info.setOpts || {}) })); veil(g, '#0a0610', 0.5); }
  const lines = info.lines || [info.str || 'LINE'];
  lines.forEach((ln, i) => { const k = popIn(t, (info.t0 ?? 0.15) + i * (info.stagger ?? 0.5), 0.4); if (k <= 0) return; g.save(); g.translate(E.W / 2, E.H * 0.5 + (i - (lines.length - 1) / 2) * (info.gap ?? 110)); g.scale(k, k); const col = (info.colors || [])[i] || info.color || S().ui.gold; T(g, ln, 0, 0, { size: (info.sizes || [])[i] || info.size || 84, color: col, glow: 30, glowColor: alpha(col, 0.65), font: info.serif ? FONTS.serif : FONTS.title, weight: info.serif ? 900 : 700, italic: !!info.serif, spacing: info.serif ? 0 : 3, alpha: clamp((info.dur - t) / 0.35) }); g.restore(); });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
  overlays(g, t, info, { M: placeMood(info.set) });
};

// ---------- year card ----------
TPL.yearCard = (g, t, info) => {
  const set = PLACES[info.set] || PLACES.bedroom, ui = S().ui;
  blurLayer(g, 14, (g) => set(g, t, { z: 1.3, x: -80 + t * 20, y: -40 }, { ...(info.setOpts || {}) })); veil(g, '#06040a', 0.55);
  // calendar pages flying
  const r = rng(info.year || 3);
  for (let i = 0; i < 14; i++) { const ph = (t * 0.8 + r()) % 1, x = lerp(E.W * (0.2 + r() * 0.6), E.W * (r() < 0.5 ? -0.1 : 1.1), ease.in(ph)), y = E.H * (0.2 + r() * 0.6) - ph * 120; g.save(); g.translate(x, y); g.rotate(ph * 3 * (r() - 0.5)); g.globalAlpha = 0.35 * Math.sin(ph * Math.PI); g.fillStyle = '#efe6d6'; g.fillRect(-36, -40, 72, 80); g.fillStyle = '#c0453a'; g.fillRect(-36, -40, 72, 18); g.restore(); }
  const k = popIn(t, 0.08, 0.45), col = info.color || ui.gold;
  g.save(); g.translate(E.W / 2, E.H * 0.47); g.scale(k * (1 + 0.03 * t), k * (1 + 0.03 * t));
  T(g, 'YEAR', 0, -70, { size: 46, color: alpha(ui.cream, 0.85), spacing: 12, font: FONTS.title, weight: 700 });
  T(g, String(info.year), 0, 40, { size: 190, color: col, glow: 40, glowColor: alpha(col, 0.6), font: FONTS.title, weight: 700 });
  g.restore();
  if (info.sub) { const k2 = popIn(t, info.subAt ?? 0.7); if (k2 > 0) T(g, info.sub, E.W / 2, E.H * 0.47 + 190, { size: 64, color: info.subColor || ui.cream, alpha: clamp(k2), glow: 18, glowColor: alpha(ui.gold, 0.5) }); }
  if (info.age) UI.badge(g, { str: info.age, a: clamp((t - 0.3) / 0.3) });
  FX.dust(g, t, { count: 24, color: '#ffe2bd', a: 0.25 });
};

// ---------- split screen ----------
TPL.split = (g, t, info) => {
  const k = ease.out(prog(t, 0, 0.4));
  for (const [side, sub] of [[-1, info.left], [1, info.right]]) {
    if (!sub) continue; const f = TPL[sub.tpl];
    g.save(); g.beginPath(); side < 0 ? g.rect(-10, -10, E.W / 2 + 10, E.H + 20) : g.rect(E.W / 2, -10, E.W / 2 + 10, E.H + 20); g.clip();
    g.translate(side * E.W * 0.25 * k, 0);
    f && f(g, t, { ...info, ...sub, badge: null, readout: null });
    g.restore();
  }
  seg(g, [[E.W / 2, -10], [E.W / 2, E.H + 10]], 6, '#05040a'); seg(g, [[E.W / 2, -10], [E.W / 2, E.H + 10]], 2, alpha(S().ui.cream, 0.4));
  overlays(g, t, { ...info, flashback: false }, { M: mood('night') });
};

// ---------- scam call centre ----------
TPL.scamCenter = (g, t, info) => {
  const cam = camAt(t, info.dur, info.cam || { z: [1, 1.08], x: [-40, 40] });
  const base = lair(g, t, cam, { screen: info.screen });
  layer(g, cam, 0.8, (g) => { for (let i = -4; i <= 4; i++) drawCaller(g, base.CX + i * 300 + 40, base.GY - 120, 0.75, t + i, true, base.M.rim); });
  layer(g, cam, 1, (g) => {
    for (let i = -2; i <= 2; i++) { const x = base.CX + i * 420; rr(g, x - 150, base.GY - 150, 300, 150, 6); g.fillStyle = '#0d0f18'; g.fill(); FX.screen(g, { x: x - 20, y: base.GY - 260, w: 140, h: 90, bg: '#06121a', glowC: info.screen || '#3fd0c0', a: 0.25 }); drawCaller(g, x - 90, base.GY, 1.15, t * 1.2 + i * 2, false, base.M.rim, i === (info.dialer ?? 0) && info.dialing); }
    if (info.boss) { const bx = base.CX + lerp(-500, 500, ease.inOut(t / info.dur)); drawFigure(g, { x: bx, y: base.GY + 60, s: 1.5, facing: 1, outfit: CAST.MRBLACK, pose: (info.bossPose === 'cross' ? POSES.crossArms : POSES.stand), expr: 'smirk', rim: { color: base.M.rim, dir: [0.4, -1], w: 4 } }); }
  });
  FX.fog(g, base.GY - 200, 300, '#1a3040', 0.15);
  FX.dust(g, t, { count: 24, color: '#8fe0d8', a: 0.2 });
  overlays(g, t, info, base);
};
function drawCaller(g, x, y, s, t, dim, rim, dialing) {
  const p = breathe(dialing ? POSES.phone : POSES.sit, t, 1, x);
  drawFigure(g, { x, y, s, facing: 1, outfit: CAST.CALLER, pose: p, expr: 'smirk', dim, rim: { color: rim, dir: [0.6, -1], w: 3 }, talk: dialing ? 0.3 + 0.3 * Math.abs(Math.sin(t * 9)) : 0 });
  const [hx, hy, hr] = headPos({ x, y, s, pose: p, facing: 1 });
  g.strokeStyle = '#2a2a34'; g.lineWidth = 4 * s; g.beginPath(); g.arc(hx, hy, hr * 1.12, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); seg(g, [[hx + hr * 0.9, hy], [hx + hr * 1.2, hy + hr * 0.9]], 3 * s, '#2a2a34'); circle(g, hx + hr * 1.2, hy + hr * 0.9, 4 * s, rim);
}

// ---------- time lapse in the bedroom ----------
TPL.timeLapse = (g, t, info) => {
  const day = 0.5 + 0.5 * Math.sin(t * (info.speed ?? 5));
  const cam = camAt(t, info.dur, info.cam || { z: [1.0, 1.06], x: [-60, -100] });
  const base = PLACES[info.set || 'bedroom'](g, t, cam, { ...(info.setOpts || {}), day, clockT: t * 20000, phone: 0.3 });
  layer(g, cam, 1, (g) => { drawActors(g, t, info, base, info.actors || [{ who: 'SAM', x: -560, y: 0, pose: 'sit', expr: 'sleepy', facing: 1 }], info.s ?? 1.2); });
  veil(g, '#000', 0.25 * (1 - day));
  if (info.years) { const y = Math.round(lerp(info.years[0], info.years[1], ease.inOut(t / info.dur))); UI.badge(g, { str: (info.prefix || 'YEAR ') + y }); }
  FX.dust(g, t, { count: 30, color: '#c8d4ff', a: 0.25 });
  overlays(g, t, { ...info, badge: null }, base);
};

// ---------- end screen ----------
TPL.end = (g, t, info) => {
  UI.endScreen(g, t, { question: info.question || 'What do you think?', cast: [CAST.SAM, CAST.MOM, CAST.MAX, CAST.MIA, CAST.MRBLACK], rim: '#ffb070' });
  if (info.jar) { jar(g, E.W * 0.86, E.H * 0.5, 1.1, { coins: 30, bills: 2, note: 'front', glow: 1 }); }
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
};
