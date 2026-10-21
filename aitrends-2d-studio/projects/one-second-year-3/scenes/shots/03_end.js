// shots/03_end.js: the choice (s141-s149), the reveal (s150-s169), the beat and countdown (s170-s179), the resolution (s180-s193),
// Sunday (s194-s205), is any of this real (s206-s213), end (s214-s215).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, alpha, shade,
  seg, circle, ring, rr, poly, glow, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { push, wt, talk, blinkAt, rimOf, faceShot, slowTint, popIn, label, stamp } from '../lib.js';
import { voidSpace, bigClock, recordPlayer, notes, heartIcon } from '../sets/extra.js';
import { vending, greenDoor } from '../sets/corridor.js';
import { LEO, NOVA, GRANDPA, JAKE, SOL, WIFE, DOCTOR, CAST3 } from '../cast.js';
import { kitchenScene, dance } from '../p1kit.js';
import { bigNum, balance } from '../k2.js';
import { VIO, VIOL, threeVoid, solFig, face, solClose, ward, wface, solReal, CP, bigCount, whisper, voiceRings, thoughtLink } from '../k3.js';

const K = () => CP();
const DOC_FROZEN = () => K().sol + V(520, 360);
const frozenWard = (g, t, cam, o = {}) => ward(g, t, cam, { frozen: true, doc: { x: DOC_FROZEN() }, gp: { look: [1, 0] }, leo: { look: [1, 0], facing: 1, expr: 'shocked' }, nova: { look: [1, 0], expr: 'shocked' }, ...o });

// ---------- the choice ----------
registerShot('s141', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), x = E.W / 2, y = E.H * 0.7;
  UI.lineFigure(g, { x, y, s: 1.3, pose: { ...POSES.holdFront, eF: [26, -150], hF: [50, -150], eB: [-26, -150], hB: [-50, -150] }, color: alpha(LEO.color, 0.9) });
  for (const [d, col, at] of [[-1, '#5fe0d0', 0.3], [1, VIOL, 0.8]]) { const k = popIn(t, at); if (k > 0) UI.lineFigure(g, { x: x + d * 170, y: y - 40, s: 0.9 * k, pose: POSES.lie, color: alpha(col, 0.8) }); }
  label(g, t, 'CARRY TWO?', E.W / 2, E.H * 0.2, 0.4, { size: V(56, 52) });
} });
registerShot('s142', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 'THREE?', { color: VIOL, size: V(180, 140) }); } });
registerShot('s143', { draw(g, t, info) { UI.blueprint(g); balance(g, t, E.W / 2, E.H * 0.34, 1.1, -ease.inOut(prog(t, 0.1, 0.9)) * 0.7, 'SAVE YOURSELF', 'SAVE ALL THREE'); } });
registerShot('s144', { draw(g, t, info) { UI.blueprint(g); balance(g, t, E.W / 2, E.H * 0.34, 1.1, lerp(-0.7, 0.8, ease.inOut(prog(t, 0.1, 1.2))), 'SAVE YOURSELF', 'SAVE ALL THREE'); } });
registerShot('s145', { draw(g, t, info) { frozenWard(g, t, push(t, info, { z0: 1.3, z1: 1.4, x0: K().sol - E.W / 2 + 80, x1: K().sol - E.W / 2 + 80, y0: 120, y1: 130 }), { gp: false, leo: false, nova: false }); } });
registerShot('s146', { draw(g, t, info) { solReal(g, t, info, { frozen: true, zoom: 0.02 }); label(g, t, 'STILL', E.W * 0.24, E.H * 0.3, 0.05, { size: V(60, 56), color: S().ui.cream }); } });
registerShot('s147', { draw(g, t, info) { solReal(g, t, info, { frozen: true, zoom: 0.06 }); label(g, t, 'EYES CLOSED', E.W * 0.24, E.H * 0.3, 0.05, { size: V(52, 50), color: S().ui.cream }); } });
registerShot('s148', { draw(g, t, info) { frozenWard(g, t, push(t, info, { z0: 1.45, z1: 1.5, x0: (K().sol + DOC_FROZEN()) / 2 - E.W / 2, x1: (K().sol + DOC_FROZEN()) / 2 - E.W / 2, y0: 140, y1: 142 }), { gp: false, leo: false, nova: false }); const k = ease.out(prog(t, 0.3, 1.2)); seg(g, [[E.W * 0.68, E.H * 0.5], [lerp(E.W * 0.68, E.W * 0.45, k), E.H * 0.5]], 6, S().ui.gold); poly(g, [[lerp(E.W * 0.68, E.W * 0.45, k) - 20, E.H * 0.5], [lerp(E.W * 0.68, E.W * 0.45, k) + 4, E.H * 0.5 - 16], [lerp(E.W * 0.68, E.W * 0.45, k) + 4, E.H * 0.5 + 16]], S().ui.gold); } });
registerShot('s149', { draw(g, t, info) {
  const p = ease.inOut(prog(t, 0, info.dur)), cam = push(t, info, { z0: 1.3, z1: 1.36, x0: K().sol - E.W / 2 + 80, x1: K().sol - E.W / 2 + 80, y0: 120, y1: 124 });
  frozenWard(g, t, cam, { gp: false, leo: false, nova: false, doc: undefined, sol: { a: 1 } });
  g.save(); g.globalAlpha = p; voidSpace(g, t, cam, { color: VIO }); layer(g, cam, 1, (g) => solFig(g, K().sol, E.H * V(0.8, 0.68), 1.1, { glints: p })); g.restore();
} });

// ---------- the reveal ----------
registerShot('s150', { draw(g, t, info) { face(g, t, info, LEO, { expr: 'thinking', look: [1, -0.2], talk: () => talk(info), color: VIO }); } });
registerShot('s151', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.2, z1: 1.25, y0: 100, y1: 102 }), { nova: { a: 0.25 }, leo: { expr: 'neutral', pose: { ...POSES.explain } }, sol: { glints: 0.6 }, vlink: 0.6 }); whisper(g, t, 'What do you see in your picture?', { at: 0.1, y: E.H * 0.18, size: V(50, 44), color: S().ui.cream }); } });
registerShot('s152', { draw(g, t, info) { backdrop(g, ['#020205', '#04050a']); whisper(g, t, '…', { at: 0.2, size: V(100, 90), color: alpha(VIOL, 0.5) }); } });
function voidProp(g, t, info, draw) { const cam = push(t, info, { z0: 1.0, z1: 1.06 }), r = voidSpace(g, t, cam, { color: VIO }); layer(g, cam, 1, (g) => { const k = ease.out(prog(t, 0, 0.6)); g.save(); g.globalAlpha *= k; draw(g, r); g.restore(); }); }
registerShot('s153', { draw(g, t, info) { voidProp(g, t, info, (g, r) => { greenDoor(g, E.W / 2, r.GY + 40, 1.3, { glow: 0.5 }); }); } });
registerShot('s154', { draw(g, t, info) { voidProp(g, t, info, (g, r) => { greenDoor(g, E.W / 2 + V(360, 220), r.GY + 40, 1.0, { glow: 0.3 }); vending(g, E.W / 2 - V(220, 140), r.GY + 40, 1.2, {}); }); } });
registerShot('s155', { draw(g, t, info) { voidProp(g, t, info, (g, r) => { vending(g, E.W / 2, r.GY + 260, 2.2, { highlight: 0.8 + 0.2 * Math.sin(t * 4) }); }); } });
registerShot('s156', { draw(g, t, info) { voidProp(g, t, info, (g, r) => { vending(g, E.W / 2, r.GY + 260, 2.2, { highlight: 1, wobble: Math.sin(t * 20) * 0.05 }); }); stamp(g, t, 'STUCK', E.W * 0.72, E.H * 0.3, 0.1, V(90, 80), '#5fa0ff'); } });
registerShot('s157', { draw(g, t, info) { face(g, t, info, LEO, { expr: 'shocked', noBlink: true, zoom: 0.12, talk: () => talk(info), color: VIO }); whisper(g, t, 'It’s you.', { at: 0.05, x: E.W * 0.7, y: E.H * 0.3, size: V(70, 60), color: S().ui.cream }); } });
registerShot('s158', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.4, z1: 1.5, x0: K().sol - E.W / 2 + 60, x1: K().sol - E.W / 2 + 60, y0: 130, y1: 140 });
  frozenWard(g, t, cam, { gp: false, leo: false, nova: false });
  const k = 0.5 + 0.3 * Math.sin(t * 3); g.save(); g.globalAlpha *= k * ease.out(prog(t, 0.2, 0.8)); layer(g, cam, 1, (g) => solFig(g, K().sol, E.H * V(0.8, 0.68) - 22, 1.15, { glints: 1, a: 0.6, pose: { ...POSES.sit } })); g.restore();
  label(g, t, 'SOL', E.W * 0.2, E.H * 0.3, 0.3, { size: V(90, 80), color: VIOL, font: FONTS.title });
} });
registerShot('s159', { draw(g, t, info) { voidProp(g, t, info, (g, r) => greenDoor(g, E.W / 2, r.GY + 40, 1.3, { glow: 0.6 + 0.4 * Math.sin(t * 3) })); whisper(g, t, 'What’s behind that door, Sol?', { at: 0.1, y: E.H * 0.18, size: V(50, 44), color: S().ui.cream }); } });
registerShot('s160', { draw(g, t, info) { backdrop(g, ['#020205', '#04050a']); voiceRings(g, t, E.W / 2, E.H / 2, { color: VIOL, r0: 60, r1: 400, a: 0.08 }); } });
const solCry = (g, t, info, o = {}) => solReal(g, t, info, { bg: (g2, tt, cam) => voidSpace(g2, tt, cam, { color: VIO }), face: { eyes: o.open ? 'dot' : 'happy', mouth: o.mouth || 'frown', brows: 'worried' }, talk: o.talk, zoom: 0.05, tint: false, front: (g, t2, cx, cy, r) => { if (!o.tears) return; for (const d of [-1, 1]) { const ph = (t * 0.6 + (d > 0 ? 0.4 : 0)) % 1; g.fillStyle = alpha('#9fd0ff', 0.9); g.beginPath(); g.ellipse(cx + d * r * 0.34, cy - r * 0.02 + ph * r * 0.5, r * 0.04, r * 0.07, 0, 0, 7); g.fill(); } }, ...o });
registerShot('s161', { draw(g, t, info) { solCry(g, t, info, { talk: () => talk(info) }); whisper(g, t, 'My wife.', { at: 0.05, x: E.W * 0.28, y: E.H * 0.3, size: V(70, 60), color: VIOL }); } });
registerShot('s162', { draw(g, t, info) { frozenWard(g, t, push(t, info, { z0: 1.5, z1: 1.56, x0: K().door - E.W / 2 + 60, x1: K().door - E.W / 2 + 60, y0: 150, y1: 152 }), { gp: false, leo: false, nova: false, doorGlow: 0.6 }); whisper(g, t, '…to tell me if she woke up.', { at: 0.6, y: E.H * 0.27, size: V(50, 44), color: VIOL }); } });
registerShot('s163', { draw(g, t, info) { solCry(g, t, info, { tears: true, talk: () => talk(info) }); } });
registerShot('s164', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.2, z1: 1.25, y0: 100, y1: 102 }), { leo: false, nova: false, sol: { pose: { ...POSES.crouch, head: [10, -110] }, glints: 0.3 } }); label(g, t, 'HIDING', E.W * 0.75, E.H * 0.3, 0.3, { size: V(70, 64), color: VIOL, font: FONTS.title }); } });
registerShot('s165', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 3000 * ease.out(prog(t, 0, 1.0)), { color: VIOL, sub: 'YEARS OF HIDING', subAt: 0.3 }); } });
registerShot('s166', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.15, z1: 1.2, y0: 90, y1: 92 }), { nova: { a: 0.4, expr: 'sleepy' }, leo: { expr: 'neutral', pose: POSES.relaxed }, sol: { glints: 0.4, pose: { ...POSES.crouch, head: [10, -110] } } }); } });
registerShot('s167', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: -V(420, 260) + 100, x1: -V(420, 260) + 100, y0: 160, y1: 162 }), { nova: false, sol: false, leo: { pose: posesAt(t, [[0, { ...POSES.ready }], [0.6, POSES.relaxed]], 0.5), expr: 'smile' } }); } });
registerShot('s168', { draw(g, t, info) { face(g, t, info, LEO, { expr: 'smile', look: [1, 0.1], talk: () => talk(info), color: VIO }); } });
registerShot('s169', { draw(g, t, info) { const k = ease.out(prog(t, 0, 1.0)); threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, y0: 120, y1: 122 }), { leo: { x: E.W / 2 - V(220, 140), expr: 'smile' }, nova: { x: E.W / 2 + V(220, 140), a: 0.5, expr: 'smile' }, sol: { glints: 0.4, pose: { ...POSES.crouch, head: [10, -110] } }, link: k, linkColor: S().ui.gold }); whisper(g, t, 'We’ll hear it with you.', { at: 0.05, y: E.H * 0.18, size: V(54, 48), color: S().ui.gold }); } });

// ---------- the beat and the countdown ----------
const sepia = (g, a = 0.3) => { g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = alpha('#c89a60', a); g.fillRect(0, 0, E.W, E.H); g.restore(); };
registerShot('s170', { draw(g, t, info) { kitchenScene(g, t, push(t, info, { z0: 1.5, z1: 1.58, x0: -V(260, 200) - 40, x1: -V(260, 200) - 20, y0: 170, y1: 175 }), { leo: false, table: false }); sepia(g, 0.35); } });
function pulse(g, t) { const ui = S().ui, k = 1 - clamp(t / 0.45); voidSpace(g, t, { z: 1 + 0.03 * k, x: 0, y: 0 }, { color: VIO }); heartIcon(g, E.W / 2, E.H * 0.5, 3.6 * (1 + 0.2 * k), ui.accent); FX.rings(g, E.W / 2, E.H * 0.5, t, { count: 2, r0: 160, r1: 800, speed: 1.6, color: ui.accent, a: 0.3 * k + 0.08 }); text(g, 'BOOM', E.W / 2, E.H * 0.2, { size: V(80, 70) * (1 + 0.3 * k), color: ui.gold, font: FONTS.title, weight: 700, glow: 24, glowColor: alpha(ui.gold, 0.5) }); }
registerShot('s171', { draw(g, t) { pulse(g, t); } });
registerShot('s172', { draw(g, t) { pulse(g, t); } });
registerShot('s173', { draw(g, t) { pulse(g, t); } });
registerShot('s174', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.3, z1: 1.36, y0: 120, y1: 122 }), { leo: { x: E.W / 2 - V(220, 140), expr: 'smile' }, nova: { x: E.W / 2 + V(220, 140), a: 0.4 }, sol: { glints: 0.5 }, link: 0.8 }); whisper(g, t, 'A second is plenty, Sol…', { at: 0.1, y: E.H * 0.2, size: V(60, 52) }); } });
registerShot('s175', { draw(g, t, info) { threeVoid(g, t, push(t, info, { z0: 1.36, z1: 1.42, y0: 124, y1: 126 }), { leo: { x: E.W / 2 - V(220, 140), expr: 'smile' }, nova: { x: E.W / 2 + V(220, 140), a: 0.45 }, sol: { glints: 0.7, pose: POSES.stand }, link: 1 }); whisper(g, t, '…if you use it.', { at: 0.05, y: E.H * 0.2, size: V(70, 60) }); } });
registerShot('s176', { draw(g, t, info) { face(g, t, info, NOVA, { expr: 'smile', face: { eyes: 'happy' }, look: [0, 0], color: '#8a9ad8', dx: 0, veil: 0.6 }); veil(g, '#05060c', 0.35); whisper(g, t, '(a whisper)', { at: 2.6, y: E.H * 0.18, size: V(40, 36), color: alpha('#5fe0d0', 0.7) }); } });
const cd = (g, t, info, n) => { voidSpace(g, t, { z: 1.05, x: 0, y: 0 }, { color: VIO }); thoughtLink(g, t, [E.W * 0.12, E.H * 0.5], [E.W * 0.88, E.H * 0.5], { k: 0.5 + (3 - n) * 0.3 }); bigNum(g, t, n, { dur: info.dur }); };
registerShot('s177', { draw(g, t, info) { cd(g, t, info, 3); } });
registerShot('s178', { draw(g, t, info) { cd(g, t, info, 2); } });
registerShot('s179', { draw(g, t, info) { cd(g, t, info, 1); } });

// ---------- resolution ----------
registerShot('s180', { draw(g, t, info) { const k = clamp(t / 0.7); ward(g, t, push(t, info, { z0: 1.09, z1: 1.04, x0: 60, x1: 60, y0: 34, y1: 30 }), { doc: { x: DOC_FROZEN() - t * 40 }, gp: { look: [1, 0] }, leo: { look: [1, 0], facing: 1, expr: 'surprised' }, nova: { look: [1, 0], expr: 'surprised' } }); slowTint(g, 0.34 * (1 - k)); for (const x of [K().leo, K().nova]) { const p = clamp(t / 1.2); for (let i = 0; i < 5; i++) circle(g, x + 30 + p * 100 + i * 14, E.H * 0.55 + Math.sin(i) * 8, (8 + i * 3) * p, alpha('#ffffff', 0.3 * (1 - p))); } } });
registerShot('s181', { draw(g, t, info) { ward(g, t, push(t, info, { z0: 1.0, z1: 1.04, y0: 20, y1: 24 }), { doc: { x: DOC_FROZEN() - 60 - t * 80 }, gp: { look: [1, 0] }, leo: { look: [1, 0], facing: 1 }, nova: { look: [1, 0] } }); } });
const docFace = (g, t, info, o = {}) => wface(g, t, info, DOCTOR, { left: false, expr: 'smile', look: [-1, 0], bgCam: { z: 1.6, x: 450, y: 100 }, ...o });
registerShot('s182', { draw(g, t, info) { docFace(g, t, info, { expr: 'happy' }); } });
registerShot('s183', { draw(g, t, info) { docFace(g, t, info, { expr: 'happy', talk: () => talk(info) }); label(g, t, 'SHE’S AWAKE', E.W * 0.28, E.H * 0.3, 0.2, { size: V(64, 60), font: FONTS.title }); } });
registerShot('s184', { draw(g, t, info) { docFace(g, t, info, { expr: 'smile', talk: () => talk(info) }); whisper(g, t, 'She’s asking for you.', { at: 0.1, x: E.W * 0.3, y: E.H * 0.3, size: V(52, 46), color: S().ui.cream }); } });
registerShot('s185', { draw(g, t, info) { const o = t > 0.6; solReal(g, t, info, { face: { eyes: o ? 'dot' : 'happy', mouth: o ? 'o' : 'flat', brows: o ? 'raised' : null }, look: [-0.3, 0], zoom: 0.06 }); } });
registerShot('s186', { draw(g, t, info) { solReal(g, t, info, { face: { eyes: 'happy', mouth: 'smile', brows: 'worried' }, zoom: 0.04, front: (g, t2, cx, cy, r) => { for (const d of [-1, 1]) { const ph = (t * 0.7 + (d > 0 ? 0.5 : 0)) % 1; g.fillStyle = alpha('#9fd0ff', 0.9); g.beginPath(); g.ellipse(cx + d * r * 0.34, cy - r * 0.02 + ph * r * 0.5, r * 0.04, r * 0.07, 0, 0, 7); g.fill(); } } }); } });
const TAP = [[0, POSES.relaxed], [0.5, { ...POSES.point, eF: [-30, -150], hF: [-62, -150] }], [0.8, POSES.relaxed]];
registerShot('s187', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 1.5, z1: 1.55, x0: k.vend - E.W / 2 + 140, x1: k.vend - E.W / 2 + 140, y0: 160, y1: 162 }), { sol: false, nova: { x: k.vend + V(560, 380), facing: -1, expr: 'smile' }, leo: { x: k.vend + V(400, 270), expr: 'smile', look: [-1, 0] }, gp: { x: k.vend + V(200, 140), pose: posesAt(t, TAP, 0.2), expr: 'happy' }, wobble: t > 0.75 ? Math.sin((t - 0.75) * 30) * 0.15 : 0 }); label(g, t, 'TAP', E.W * 0.38, E.H * 0.3, 0.75, { size: V(60, 56), color: S().ui.cream, font: FONTS.title }); } });
registerShot('s188', { draw(g, t, info) { const k = K(); ward(g, t, push(t, info, { z0: 2.4, z1: 2.45, x0: k.vend - E.W / 2 - 50, x1: k.vend - E.W / 2 - 50, y0: 100, y1: 100 }), { gp: false, leo: false, nova: false, sol: false, canFall: Math.min(0.99, ease.in(prog(t, 0.1, 0.9))), canGlow: 0.7 }); } });
registerShot('s189', { draw(g, t, info) { const k = K(), sh = Math.sin(t * 60) * 6 * Math.max(0, 1 - t * 3); ward(g, t, { z: 2.4, x: k.vend - E.W / 2 - 50 + sh, y: 100 + sh }, { gp: false, leo: false, nova: false, sol: false, canFall: 1 }); stamp(g, t, 'CLUNK!', E.W * 0.7, E.H * 0.3, 0.0, V(100, 84), '#5fa0ff'); } });
registerShot('s190', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, rows = [['YEAR', 1], ['MONTH', 0.35], ['DAY', 0.12], ['HOUR', 0.04]];
  rows.forEach(([n, v], i) => { const y = E.H * (0.28 + i * 0.15), k = ease.out(prog(t, 0.2 + i * 0.3, 0.8 + i * 0.3)); text(g, n, E.W * 0.2, y, { size: V(40, 38), color: UI.bpStroke(), font: FONTS.ui, weight: 900, align: 'right' }); rr(g, E.W * 0.23, y - 26, Math.max(6, E.W * 0.6 * v * k), 52, 26); g.fillStyle = alpha(VIOL, 0.8); g.fill(); });
  label(g, t, 'SHORTER', E.W * 0.75, E.H * 0.85, 1.2, { size: V(52, 50), color: ui.gold });
} });
registerShot('s191', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 'A MONTH', { size: V(150, 110), color: VIOL }); } });
registerShot('s192', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 'A DAY', { size: V(150, 110), color: VIOL }); } });
registerShot('s193', { draw(g, t, info) { UI.blueprint(g); bigCount(g, t, 'AN HOUR', { size: V(150, 110), color: VIOL }); } });

// ---------- Sunday ----------
function party(g, t, cam, o = {}) {
  return kitchenScene(g, t, cam, { table: false, leo: false, gpExpr: 'joy', gpPose: o.gpPose,
    extra: (g, r, s) => { const rim = rimOf(r.M, [-0.6, -0.8]), X = E.W / 2;
      const people = [[X - V(20, 10), SOL, 1, 0.15], [X + V(120, 70), WIFE, -1, 0.35], [X + V(330, 200), NOVA, 1, 0.5], [X + V(470, 290), JAKE, -1, 0.7], [X + V(650, 400), LEO, -1, 0.9]];
      for (const [x, of, f, ph] of people) drawFigure(g, { x, y: r.GY, s: s * 0.95, facing: f, outfit: of, pose: o.still === of ? breathe(POSES.relaxed, t) : dance(t + ph), expr: o.still === of ? (o.stillExpr || 'smile') : 'joy', face: of === SOL ? { eyes: 'happy', mouth: 'grin' } : undefined, rim, blink: blinkAt(t, 3.3, ph) }); } });
}
registerShot('s194', { draw(g, t, info) {
  party(g, t, push(t, info, { z0: 1.0, z1: 1.1, x0: 0, x1: 120, y0: 0, y1: 40 }));
  label(g, t, 'SUNDAY', E.W / 2, V(140, 220), 0.3, { size: V(50, 50), color: S().ui.cream });
  label(g, t, 'SOL + HIS WIFE', E.W * 0.52, E.H * 0.86, wt(info, 'wife', 3.0) - 0.1, { size: V(40, 38), color: VIOL });
  label(g, t, 'NOVA + JAKE', E.W * 0.8, E.H * 0.86, wt(info, 'jake', 5.4) - 0.1, { size: V(40, 38), color: '#5fe0d0' });
} });
const pface = (g, t, info, outfit, o = {}) => faceShot(g, t, info, { M: mood('interiorWarm'), bg: (g2, tt, cam) => party(g2, tt, cam), bgCam: { z: 1.6, x: outfit === GRANDPA ? -400 : 300, y: -150 }, outfit, side: outfit === GRANDPA ? 1 : -1, dx: o.dx ?? (outfit === GRANDPA ? -V(160, 0) : V(160, 0)), look: outfit === GRANDPA ? [1, 0] : [-1, 0], ...o });
registerShot('s195', { draw(g, t, info) { pface(g, t, info, LEO, { expr: 'awe', look: [-0.3, -0.3] }); } });
function kclock(g, t, info, ticks, lab) { blurLayer(g, 14, (g2) => party(g2, t, { z: 1.5, x: -300, y: -100 })); veil(g, '#0a0710', 0.4); const cam = push(t, info, { z0: 1.0, z1: 1.04 }); layer(g, cam, 1, (g) => bigClock(g, E.W / 2, E.H * 0.5, V(280, 240), 10 + ticks, { face: '#f4efe6' })); if (lab) label(g, t, lab, E.W / 2, E.H * 0.84, 0.2, { size: V(56, 52), font: FONTS.title }); }
registerShot('s196', { draw(g, t, info) { kclock(g, t, info, 0); } });
registerShot('s197', { draw(g, t, info) { kclock(g, t, info, t > 0.4 ? 1 : 0); } });
registerShot('s198', { draw(g, t, info) { kclock(g, t, info, 1 + (t > 0.3 ? 1 : 0), '1 SECOND'); } });
registerShot('s199', { draw(g, t, info) { party(g, t, push(t, info, { z0: 1.0, z1: 1.04, x0: 60, x1: 70 })); label(g, t, 'ORDINARY', E.W / 2, V(150, 230), 0.1, { size: V(56, 54), color: S().ui.cream }); } });
registerShot('s200', { draw(g, t, info) { party(g, t, push(t, info, { z0: 1.2, z1: 1.26, x0: 160, x1: 180, y0: 60, y1: 64 })); label(g, t, 'PERFECT', E.W / 2, V(150, 230), 0.1, { size: V(64, 60), font: FONTS.title }); } });
registerShot('s201', { draw(g, t, info) { pface(g, t, info, LEO, { expr: 'happy', look: [-0.5, 0] }); } });
registerShot('s202', { draw(g, t, info) { pface(g, t, info, GRANDPA, { expr: 'smile', face: t > 0.5 && t < 1.0 ? { eyes: 'happy', mouth: 'smirk' } : null }); } });
registerShot('s203', { draw(g, t, info) { pface(g, t, info, GRANDPA, { expr: 'happy', talk: () => talk(info) }); } });
registerShot('s204', { draw(g, t, info) { pface(g, t, info, GRANDPA, { expr: 'happy', dx: -V(260, 0), talk: () => talk(info) }); whisper(g, t, 'A second is plenty.', { at: 0.05, x: E.W * 0.7, y: E.H * 0.3, size: V(64, 54) }); } });
registerShot('s205', { draw(g, t, info) { party(g, t, push(t, info, { z0: 1.12, z1: 0.98, x0: 100, x1: 60, y0: 40, y1: 0 })); notes(g, t, E.W / 2, E.H * 0.4, { count: 6, spread: 900, a: 0.8 }); } });

// ---------- is any of this real ----------
registerShot('s206', { draw(g, t, info) { UI.blueprint(g); UI.bigLine(g, t, { str: 'IS ANY OF THIS REAL?', dur: info.dur + 0.4, size: V(90, 70) }); } });
registerShot('s207', { draw(g, t, info) { UI.blueprint(g); text(g, '1 YEAR IN 1 SECOND', E.W / 2, E.H * 0.42, { size: V(70, 56), color: S().ui.cream, font: FONTS.title, weight: 700 }); stamp(g, t, 'NOT POSSIBLE', E.W / 2, E.H * 0.6, wt(info, 'no', 0.2) + 0.3, V(90, 76)); } });
function brain(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, 150, 110, 0, 0, 7); g.stroke(); for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-120 + i * 55, -80); g.bezierCurveTo(-100 + i * 55, -20, -150 + i * 55, 20, -110 + i * 55, 80); g.stroke(); } seg(g, [[0, -110], [0, 110]], 4, c); g.restore(); }
registerShot('s208', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui; brain(g, E.W * 0.25, E.H * 0.48, 1.2, c);
  const bend = ease.inOut(prog(t, 0.6, 2.0)); g.strokeStyle = ui.gold; g.lineWidth = 8; g.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60, x = E.W * (0.45 + u * 0.45), y = E.H * 0.5 + Math.sin(u * Math.PI) * -160 * bend; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  label(g, t, 'TIME FEELS ELASTIC', E.W * 0.67, E.H * 0.72, 1.0, { size: V(46, 44) });
} });
function clockPanel(g, t, x, y, R, speed, lab, col) { bigClock(g, x, y, R, (t * speed) % 60, { face: '#efe6d2' }); text(g, lab, x, y + R + 60, { size: V(46, 42), color: col, font: FONTS.ui, weight: 900, spacing: 4 }); }
registerShot('s209', { draw(g, t, info) { UI.blueprint(g); clockPanel(g, t, E.W / 2, E.H * 0.45, V(220, 200), 0.3, 'WAITING = SLOW', S().ui.accent); UI.lineFigure(g, { x: E.W * 0.82, y: E.H * 0.78, s: 0.9, pose: POSES.crossArms, color: alpha(UI.bpStroke(), 0.9) }); } });
registerShot('s210', { draw(g, t, info) { UI.blueprint(g); clockPanel(g, t, E.W / 2, E.H * 0.45, V(220, 200), 60, 'FUN = FAST', '#7ae07a'); FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.45, count: 30, a: 0.2, inner: 260 }); UI.lineFigure(g, { x: E.W * 0.82, y: E.H * 0.78, s: 0.9, pose: dance(t), color: alpha('#7ae07a', 0.9) }); } });
registerShot('s211', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui;
  [['ROUTINE DAY', 4, c, 0.2], ['NEW DAY', 18, ui.gold, wt(info, 'new', 0.4) + 0.3]].forEach(([n, cnt, col, at], i) => { const y = E.H * (0.36 + i * 0.28); text(g, n, E.W * 0.18, y, { size: V(40, 38), color: col, font: FONTS.ui, weight: 900, align: 'left' }); rr(g, E.W * 0.4, y - 40, E.W * 0.5, 80, 14); g.strokeStyle = col; g.lineWidth = 3; g.stroke(); for (let j = 0; j < cnt; j++) { const k = popIn(t, at + j * 0.12); if (k <= 0) continue; circle(g, E.W * 0.42 + j * (E.W * 0.46 / 18) + 12, y, 12 * k, col); } });
  label(g, t, 'MORE MEMORIES = FEELS LONGER', E.W / 2, E.H * 0.86, wt(info, 'detail', 4.6) - 0.1, { size: V(44, 40) });
} });
const ICONS = ['✈', '♫', '★', '☂', '⚽', '✎', '☀', '♥', '⛰', '✿'];
registerShot('s212', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(); UI.lineFigure(g, { x: E.W / 2, y: E.H * 0.76, s: 1.2, pose: POSES.cheer, color: alpha(LEO.color, 0.9) }); for (let i = 0; i < 10; i++) { const k = popIn(t, 0.2 + i * 0.18); if (k <= 0) continue; const a = -Math.PI + i * Math.PI / 9; text(g, ICONS[i], E.W / 2 + Math.cos(a) * 380, E.H * 0.5 + Math.sin(a) * 260, { size: 70 * k, color: S().ui.gold, font: FONTS.ui, weight: 700 }); } label(g, t, 'A LONGER-FEELING LIFE', E.W / 2, E.H * 0.18, 0.4, { size: V(46, 44) }); } });
registerShot('s213', { draw(g, t, info) { UI.blueprint(g); const ui = S().ui; for (let i = 0; i < 12; i++) { const x = E.W * (0.12 + (i % 6) * 0.15), y = E.H * (0.36 + Math.floor(i / 6) * 0.3), k = popIn(t, 0.2 + i * 0.18); rr(g, x - 60, y - 60, 120, 120, 16); g.strokeStyle = UI.bpStroke(); g.lineWidth = 3; g.stroke(); if (k > 0) text(g, ICONS[i % ICONS.length], x, y, { size: 60 * k, color: ui.gold, font: FONTS.ui, weight: 700 }); } label(g, t, 'FILL YOUR SECONDS', E.W / 2, E.H * 0.14, 0.2, { size: V(52, 50) }); } });
registerShot('s214', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, z1: 1.0, y0: 60, y1: 0, ease: ease.out }), r = voidSpace(g, t, cam);
  layer(g, cam, 0.95, (g) => { g.save(); g.translate(E.W / 2, r.GY + 40); g.scale(1, 0.32); bigClock(g, 0, 0, V(820, 600), 12.0 + t, { face: '#e8e2da' }); g.restore(); });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2 - 90, y: r.GY + 30, s: 0.9, facing: 1, outfit: LEO, pose: POSES.stand, expr: 'smile', look: [0.3, -1], rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false }); drawFigure(g, { x: E.W / 2 + 90, y: r.GY + 30, s: 0.9, facing: -1, outfit: NOVA, pose: POSES.stand, expr: 'smile', look: [-0.3, -1], rim: { color: '#cfe0ff', dir: [0, -1] }, blink: false }); });
  UI.bigLine(g, t, { str: 'WHICH SECOND WOULD YOU STRETCH?', dur: info.dur + 0.4, y: E.H * 0.24, size: V(64, 54) });
} });
registerShot('s215', { draw(g, t, info) {
  const M = mood('dusk');
  UI.endScreen(g, t, { question: 'Which second would you stretch?', cast: CAST3, moodColors: [shade(M.dark, -0.3), M.dark, shade(M.wall, -0.2)], rim: M.rim });
  label(g, t, 'NEXT SUPERPOWER? COMMENT BELOW', E.W / 2, V(400, 680), wt(info, 'superpower', 4.6) - 0.4, { size: V(36, 40), color: S().ui.cream });
  label(g, t, 'SUBSCRIBE FOR MORE WHAT IFS', E.W / 2, V(460, 740), wt(info, 'subscribe', 8.6) - 0.6, { size: V(40, 44), color: S().ui.gold });
  FX.dust(g, t, { count: 40, a: 0.3 });
} });
