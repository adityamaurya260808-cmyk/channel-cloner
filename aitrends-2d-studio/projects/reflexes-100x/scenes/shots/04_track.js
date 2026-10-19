// shots/04_track.js: track. 3D establishing (s055), the instant false start (s056-s058), the 0.10 s rule (s059-s062),
// learning to wait with Coach Lee (s063-s069).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, alpha, shade, mix,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, wtEnd, talk, exprAt, blinkAt, rimOf, faceShot, slowTint, popIn, label, stamp, pistol, smoke, MARKS, SETP } from '../lib.js';
import { track, blocks } from '../sets/track.js';
import { buildStadium } from '../sets/track3d.js';
import { reactionAxis } from './02_numbers.js';
import { THEO, COACH, RUNNER } from '../cast.js';

registerShot('s055', { kind: '3d',
  init(T) { const s = buildStadium(T, { mood: 'dusk' }); const { stage } = s;
    const r1 = T.figure3D(THEO, { rim: s.M.rim, pose: MARKS }); r1.position.set(-48, 0, 1.6); stage.add(r1);
    for (const [z, n] of [[-1.6, 3], [0.5, 5], [2.8, 7]]) { const r = T.figure3D(RUNNER(n), { rim: s.M.rim, pose: POSES.stand }); r.position.set(-48.5, 0, z); stage.add(r); }
    const c = T.figure3D(COACH, { rim: s.M.rim, pose: POSES.stand }); c.position.set(-52, 0, 5); stage.add(c); return s; },
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [-18, 14, 30], look: [-42, 4, -6] }], [info.dur, { pos: [-30, 6, 20], look: [-46, 2, -4] }]]); },
});

// ---------- the start line (2D) ----------
const L = () => ({ coach: E.W * 0.17, theo: E.W * 0.4, r2: E.W * 0.58, r3: E.W * 0.74 });
function startLine(g, t, cam, o = {}) {
  const { GY, M } = track(g, t, cam, { view: o.view || 'stands', screenText: o.screenText, cheer: o.cheer ?? 0.25, startLine: L().theo + 60 });
  const l = L(), s = o.s ?? 1.15, rim = rimOf(M, [-0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    for (const [x, n] of [[l.r2, 4], [l.r3, 6]]) { blocks(g, x, GY, s); drawFigure(g, { x, y: GY, s, facing: 1, outfit: RUNNER(n), pose: o.othersPose || breathe(MARKS, t, 0.4, n), expr: 'determined', rim }); }
    if (!o.noTheoBlocks) blocks(g, l.theo, GY, s);
    if (!o.hideTheo) drawFigure(g, { x: o.theoX ?? l.theo, y: GY, s, facing: 1, outfit: THEO, pose: o.theoPose || breathe(MARKS, t, 0.4), expr: o.theoExpr || 'determined', rim, trail: o.trail, blink: blinkAt(t, 3.3) });
    if (!o.hideCoach) drawFigure(g, { x: l.coach, y: GY, s: s * 1.05, facing: 1, outfit: COACH, pose: o.coachPose || breathe(POSES.stand, t, 1, 5), expr: o.coachExpr || 'determined', talk: o.coachTalk || 0, rim });
    o.extra?.(g, GY, s, M);
  });
  FX.dust(g, t, { count: 40, a: 0.3 });
  return { GY, M };
}
const GUNUP = { ...POSES.pointUp, eF: [16, -214], hF: [20, -254] };
function gunAt(g, GY, s, l) { const hx = l.coach + 20 * s * 1.05, hy = GY - 254 * s * 1.05; pistol(g, hx - 8, hy + 6, 0.9, -Math.PI / 2 + 0.15); return [hx + 2, hy - 56]; }
registerShot('s056', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.12, z1: 1.18, x0: -150, x1: -130, y0: 70, y1: 75 }), l = L(), tF = wt(info, 'fires', 0.9) + 0.25;
  const [sx, sy] = t > tF ? shake(t, 8 * (1 - prog(t, tF, tF + 0.4)), 30) : [0, 0];
  startLine(g, t, { ...cam, x: cam.x + sx, y: cam.y + sy }, { coachPose: posesAt(t, [[0, POSES.stand], [0.25, GUNUP]]), theoPose: t > tF ? SETP : breathe(SETP, t, 0.3), othersPose: SETP,
    extra: (g, GY, s) => { const [mx, my] = gunAt(g, GY, s, l); if (t > tF) { glow(g, mx, my, 160 * (1 - prog(t, tF, tF + 0.3)), '#fff2c0', 1); smoke(g, mx, my - 10, prog(t, tF, tF + 2.5)); } } });
} });
registerShot('s057', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.12, z1: 1.15, x0: -150, x1: -150, y0: 70, y1: 70 }), l = L();
  const x = lerp(l.theo + 80, E.W * 1.15, ease.in(prog(t, 0, info.dur * 0.75)));
  startLine(g, t, cam, { coachPose: GUNUP, othersPose: SETP, theoX: x, theoPose: walkPose(t * 2 * Math.PI * 1.9, { run: true }), trail: { count: 5, dx: -70 }, theoExpr: 'determined',
    extra: (g, GY, s) => { const [mx, my] = gunAt(g, GY, s, l); smoke(g, mx, my - 10, 0.08 + t * 0.03); } });
  FX.speedLines(g, t, { cx: E.W * 0.85, cy: E.H * 0.55, count: 40, a: 0.22 });
  label(g, t, '0.0025 s', E.W * 0.5, V(160, 300), 0.3, { size: V(60, 64) });
} });
registerShot('s058', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, z1: 1.36, x0: 120, x1: 130, y0: 140, y1: 145 }), l = L();
  startLine(g, t, cam, { coachPose: breathe({ ...POSES.point, eF: [34, -186], hF: [56, -206] }, t), coachExpr: 'angry', coachTalk: t > 0.3 ? 0.7 : 0, othersPose: POSES.stand, theoX: E.W * 0.83, noTheoBlocks: false, theoPose: breathe(POSES.sad, t), theoExpr: 'sad' });
  stamp(g, t, 'DQ', E.W * 0.66, E.H * 0.36, 0.08, V(170, 150));
} });

// ---------- the rule (blueprint) ----------
function ruleBoard(g, t, info, stage) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cam = push(t, info, { z0: 1, z1: 1.04 });
  layer(g, cam, 1, (g) => {
    const x0 = V(380, 140), x1 = E.W - V(200, 100), y = E.H * V(0.6, 0.55), sc = (x1 - x0) / 0.3;
    reactionAxis(g, x0, x1, y + 60);
    text(g, 'TIME AFTER THE GUN', x0, y + V(170, 190), { size: V(28, 30), color: alpha(c, 0.8), font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    pistol(g, x0 - 60, y - 40, 1.2, 0, c); glow(g, x0 + 20, y - 52, 40, ui.gold, 0.6);
    const tZ = stage === 0 ? wt(info, 'tenth', 1.6) - 0.2 : -1, kz = ease.out(prog(t, tZ, tZ + 0.5));
    if (kz > 0) { g.fillStyle = alpha(ui.accent, 0.18 * kz); g.fillRect(x0, y - 220, 0.1 * sc * kz, 280); label(g, t, 'FALSE START', x0 + 0.05 * sc, y - 260, tZ + 0.2, { color: ui.accent, size: V(40, 40) }); }
    if (stage === 0) { const tG = wt(info, 'guessed', 4.5) - 0.2; label(g, t, '"YOU GUESSED"', x0 + 0.05 * sc, y - 170, tG, { color: ui.cream, size: V(34, 34) }); }
    if (stage >= 1) { const k = stage === 1 ? ease.out(prog(t, 0.2, 1.4)) : 1, xs = x0 + 0.15 * sc;
      seg(g, [[xs, y - 200], [xs, y + 60]], 3, alpha(c, k)); UI.lineFigure(g, { x: xs + 70, y: y + 30, s: 0.9, pose: POSES.ready, color: alpha(c, k) });
      text(g, 'BEST SPRINTERS', xs + 20, y - 250, { size: V(36, 36), color: c, font: FONTS.ui, weight: 900, align: 'left', alpha: k }); text(g, '0.15 s', xs + 20, y - 200, { size: V(56, 56), color: c, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(prog(t, stage === 1 ? wt(info, 'fifteen', 2) - 0.2 : -1, (stage === 1 ? wt(info, 'fifteen', 2) : 0) + 0.2)) }); }
    if (stage >= 2) { const k = stage === 2 ? ease.outBack(prog(t, 0.15, 0.5)) : 1, xw = x0 + 0.1 * sc;
      rr(g, xw - 10, y - 230 * k, 20, 290 * k, 6); g.fillStyle = ui.accent; g.fill(); glow(g, xw, y - 90, 200, ui.accent, 0.35 * k);
      text(g, '0.10 s', xw, y - 270, { size: V(44, 44), color: ui.accent, font: FONTS.ui, weight: 900, alpha: clamp(k) });
      if (stage === 2) label(g, t, 'NOBODY BEATS IT', E.W / 2, V(140, 200), 0.4, { color: ui.accent, size: V(50, 50) }); }
    if (stage >= 3) { const tY = wt(info, 'except', 1.0) - 0.1, k = ease.outBack(prog(t, tY, tY + 0.4)), xy = x0 + 0.0025 * sc;
      if (k > 0) { glow(g, xy, y - 30, 160 * k, ui.gold, 0.6); circle(g, xy + 10, y - 30, 16 * k, ui.gold); UI.lineFigure(g, { x: xy + 40, y: y + 30, s: 0.9, pose: SETP, color: alpha(ui.gold, clamp(k)) });
        text(g, 'YOU 0.0025 s', xy + 30, y - 120, { size: V(48, 48), color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(k), glow: 16, glowColor: alpha(ui.gold, 0.6) }); } }
  });
}
registerShot('s059', { draw(g, t, info) { ruleBoard(g, t, info, 0); } });
registerShot('s060', { draw(g, t, info) { ruleBoard(g, t, info, 1); } });
registerShot('s061', { draw(g, t, info) { ruleBoard(g, t, info, 2); } });
registerShot('s062', { draw(g, t, info) { ruleBoard(g, t, info, 3); } });

// ---------- learning to wait ----------
const C2 = () => ({ coach: E.W * 0.6, theo: E.W * 0.42 });
function lesson(g, t, cam, o = {}) {
  const { GY, M } = track(g, t, cam, { view: 'stands', cheer: 0.05, mood: 'dusk' });
  const c = C2(), s = o.s ?? 1.3, rim = rimOf(M, [-0.7, -0.7]);
  layer(g, cam, 1, (g) => {
    if (o.blocks) blocks(g, c.theo, GY, s);
    drawFigure(g, { x: o.theoX ?? c.theo, y: GY, s, facing: 1, outfit: THEO, pose: o.theoPose || breathe(POSES.relaxed, t), expr: o.theoExpr || 'neutral', talk: o.theoTalk || 0, rim, blink: blinkAt(t, 3.3), prop: o.theoProp });
    drawFigure(g, { x: o.coachX ?? c.coach, y: GY, s: s * 1.05, facing: -1, outfit: COACH, pose: o.coachPose || breathe(POSES.crossArms, t, 1, 5), expr: o.coachExpr || 'smile', talk: o.coachTalk || 0, rim, blink: blinkAt(t, 3.7, 1), prop: o.coachProp });
  });
  FX.dust(g, t, { count: 40, a: 0.3 });
  return { GY, M };
}
registerShot('s063', { draw(g, t, info) { lesson(g, t, push(t, info, { z0: 1.25, z1: 1.32, x0: 20, x1: 40, y0: 120, y1: 130 }), { blocks: true, theoPose: breathe(MARKS, t, 0.4), theoExpr: 'determined', coachX: E.W * 0.58, coachPose: breathe(POSES.crossArms, t) }); } });
registerShot('s064', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => track(g2, tt, cam, { view: 'stands', cheer: 0 }), bgCam: { z: 1.4, x: 100, y: -200 }, outfit: THEO, expr: 'sleepy', face: { mouth: 'smallFlat' }, side: -1, noBlink: true, zoom: 0.03 });
  for (let i = 0; i < 3; i++) { const k = prog(t, i * 0.5, i * 0.5 + 0.5); if (k > 0) FX.rings(g, E.W / 2, E.H * 0.6, k * 0.7, { count: 1, r0: 360, r1: 520, color: S().ui.gold, a: 0.4 * (1 - k) }); }
} });
registerShot('s065', { draw(g, t, info) {
  const give = { ...POSES.holdFront, eF: [26, -150], hF: [56, -156], eB: [-7, -136], hB: [-9, -100] };
  const k = ease.inOut(prog(t, 0.4, 1.4));
  lesson(g, t, push(t, info, { z0: 1.45, z1: 1.5, x0: 20, x1: 30, y0: 150, y1: 155 }), { coachX: E.W * 0.56, coachPose: breathe(give, t), coachProp: k < 0.6 ? { type: 'paper' } : null, theoPose: breathe(posesAt(t, [[0, POSES.relaxed], [0.9, { ...POSES.reach, eF: [30, -150], hF: [58, -158], head: [6, -208], sh: [2, -174] }]]), t), theoProp: k >= 0.6 ? { type: 'paper' } : null, theoExpr: 'confused' });
} });
registerShot('s066', { draw(g, t, info) {
  faceShot(g, t, info, { M: mood('dusk'), bg: (g2, tt, cam) => track(g2, tt, cam, { view: 'stands', cheer: 0 }), bgCam: { z: 1.4, x: -200, y: -200 }, outfit: COACH, expr: 'determined', talk: () => talk(info), side: 1, dx: V(220, 0), seed: 2 });
} });
registerShot('s067', { draw(g, t, info) { lesson(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: -40, x1: -50, y0: 180, y1: 185 }), { theoPose: breathe(POSES.shrug, t), theoExpr: 'confused', theoTalk: talk(info), theoProp: { type: 'paper' } }); } });
registerShot('s068', { draw(g, t, info) { lesson(g, t, push(t, info, { z0: 1.6, z1: 1.66, x0: 80, x1: 90, y0: 180, y1: 185 }), { coachPose: breathe(POSES.explain, t), coachTalk: talk(info), coachExpr: 'smile', theoExpr: 'thinking', theoProp: { type: 'paper' }, theoPose: breathe(POSES.holdFront, t) }); } });
registerShot('s069', { draw(g, t, info) {
  blurLayer(g, 12, (g2) => track(g2, t, { z: 1.2 + 0.02 * t, x: -60, y: -80 }, { view: 'stands', cheer: 0 })); veil(g, '#0a0710', 0.5);
  const tOn = wt(info, 'on', 1.5) - 0.1, ui = S().ui;
  text(g, "FAST DOESN'T MATTER.", E.W / 2, E.H * 0.42, { size: V(84, 70), color: ui.cream, font: FONTS.title, weight: 700, spacing: 3, glow: 24, glowColor: 'rgba(255,170,90,.5)', alpha: clamp(prog(t, 0.05, 0.4)) * (t > tOn ? 0.55 : 1) });
  const k = ease.outBack(prog(t, tOn, tOn + 0.4)); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.58); g.scale(k, k); text(g, 'ON TIME DOES.', 0, 0, { size: V(110, 90), color: ui.gold, font: FONTS.title, weight: 700, spacing: 4, glow: 36, glowColor: alpha(ui.gold, 0.7) }); g.restore(); }
  FX.dust(g, t, { count: 30, a: 0.35 });
} });
