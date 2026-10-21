// lib/tpl_3d.js — low-poly 3D shots: city of 500 companies, the 40-year bar city, Mom's house.
import { E, V, S, mood, ease, prog, clamp, lerp, rng, alpha, shade, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { CAST } from '../cast.js';
import { T as TT, popIn, kmoney } from './common.js';

export const TPL3 = {};
const acct = (y) => 365 * (Math.pow(1.1, y) - 1) / 0.1;

TPL3.city500 = {
  kind: '3d',
  init(T) {
    const M = mood('dusk'), st = T.stage({ mood: 'dusk', fov: V(40, 58), fog: [30, 140], keyPos: [-30, 20, -40], keyIntensity: 2.2, ambient: 1.0 });
    st.add(T.ground(400, 400, shade(M.floor, -0.2)));
    const r = rng(11), protos = [];
    for (let i = 0; i < 6; i++) protos.push(T.building(2.2, 8, 2.2, { color: shade(M.wall, -0.2 + i * 0.05), win: M.practical, lit: 0.45 + i * 0.05, seed: 30 + i }));
    let n = 0; const ms = [];
    for (let i = 0; i < 25; i++) for (let j = 0; j < 20; j++) { const b = protos[(i * 7 + j) % 6].clone(); const h = 0.4 + r() ** 2 * 2.2; b.scale.set(0.8 + r() * 0.5, h, 0.8 + r() * 0.5); b.position.set((i - 12) * 3.2, 4 * h, (j - 10) * 3.2); st.add(b); ms.push(b); n++; }
    const gold = T.building(2.4, 8, 2.4, { color: '#6a4a1a', win: '#ffe28a', lit: 0.9, seed: 3 }); gold.scale.set(1, 2.4, 1); gold.position.set(0, 9.6, 0); st.add(gold);
    return { stage: st, n };
  },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0, 3, 0], radius: [62, 44], height: [34, 22], from: -0.5, to: 0.25, dur: info.dur }); },
  overlay(g, t, info) { const u = S().ui, k = popIn(t, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(k, k); TT(g, info.label || '500 OF AMERICA\'S BIGGEST COMPANIES', 0, 0, { size: 52, color: u.cream, glow: 20, glowColor: 'rgba(0,0,0,.8)', spacing: 3 }); g.restore(); } const n = Math.round(500 * ease.out(prog(t, 0.6, 2.6))); TT(g, String(n), E.W / 2, E.H * 0.82, { size: 110, color: u.gold, glow: 30, glowColor: alpha(u.gold, 0.6), alpha: popIn(t, 0.5) }); },
};

TPL3.barCity = {
  kind: '3d',
  init(T) {
    const M = mood('night'), st = T.stage({ mood: 'night', fov: V(42, 60), fog: [30, 120], keyPos: [10, 30, 20], keyIntensity: 1.6, ambient: 1.1, bloom: 0.9 });
    st.add(T.ground(300, 300, shade(M.floor, -0.3), T.tiles(shade(M.floor, -0.2), 20, [30, 30])));
    const bars = [];
    for (let y = 1; y <= 40; y++) { const late = y > 30; const m = T.box(1.1, 1, 1.1, T.mat(late ? '#ffcf5a' : '#5a7ab8', { emissive: late ? '#a8701a' : '#1a2a50', emissiveIntensity: late ? 0.9 : 0.4, roughness: 0.6 }), (y - 20.5) * 1.6, 0.5, 0); st.add(m); bars.push({ m, h: (acct(y) / acct(40)) * 18 + 0.05 }); }
    const fig = T.figure3D(CAST.SAM, { rim: M.rim, pose: POSES.pointUp, s: 1.2 }); fig.position.set(-36, 0, 4); fig.rotation.y = 0.4; st.add(fig);
    return { stage: st, bars, fig };
  },
  draw(s, t, info, T) {
    const grow = ease.inOut(prog(t, 0, info.dur * 0.7));
    s.bars.forEach((b, i) => { const k = clamp(grow * 1.3 - i / 40 * 0.3); const h = Math.max(0.05, b.h * k); b.m.scale.y = h; b.m.position.y = h / 2; });
    T.dolly(s.stage.camera, t, [[0, { pos: [-46, 5, 26], look: [-14, 3, 0], fov: V(42, 60) }], [info.dur, { pos: [14, 16, 42], look: [14, 7, 0], fov: V(42, 60) }]]);
  },
  overlay(g, t, info) { const u = S().ui; const k = popIn(t, info.dur * 0.55); if (k > 0) { g.save(); g.translate(E.W * 0.72, E.H * 0.18); g.scale(k, k); TT(g, info.label || 'THE END OF THE PLAN', 0, 0, { size: 56, color: u.gold, glow: 24, glowColor: alpha(u.gold, 0.6), spacing: 3 }); g.restore(); } },
};

TPL3.house3D = {
  kind: '3d',
  init(T, info) {
    const md = info.mood || 'golden', M = mood(md), st = T.stage({ mood: md, fov: V(36, 54), fog: [25, 90], keyPos: md === 'night' ? [-10, 14, -10] : [-12, 9, 16], keyIntensity: md === 'night' ? 0.8 : 2.6, ambient: md === 'night' ? 0.7 : 1.5 });
    st.add(T.ground(200, 200, shade(M.grass, -0.35)));
    const wall = shade(M.wall, 0.1);
    const house = (x, z, s, lit, seed) => { const grp = new T.THREE.Group(); grp.add(T.box(6 * s, 3 * s, 5 * s, wall, 0, 1.5 * s, 0)); const roof = T.cone(4.9 * s, 2.4 * s, shade(M.dark, 0.1), 0, 4.2 * s, 0, 4); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.85); grp.add(roof);
      for (const wx of [-1.6, 1.6]) { const w = T.windowPane(1.3 * s, 1.1 * s, { glowColor: M.practical, cols: 2, rows: 2, power: lit, lit: lit > 0 }); w.position.set(wx * s, 1.6 * s, 2.52 * s); grp.add(w); }
      const door = T.box(0.9 * s, 1.9 * s, 0.1, shade(M.dark, 0.2), 0, 0.95 * s, 2.52 * s); grp.add(door); grp.position.set(x, 0, z); st.add(grp); return grp; };
    house(0, 0, 1, 1.0); house(-12, -4, 0.9, 0.5); house(12, -3, 0.9, info.mood === 'night' ? 0.2 : 0.6);
    st.add(T.tree3D(-6, 3, 1.3, shade(M.dark, -0.1)), T.tree3D(7, 4, 1.1, shade(M.dark, -0.1)), T.tree3D(-18, 2, 1.4, shade(M.dark, -0.2)), T.tree3D(18, 1, 1.3, shade(M.dark, -0.2)));
    const path = T.box(1.4, 0.02, 8, shade(M.road, 0.1), 0, 0.01, 6.5); st.add(path);
    const lamp = new T.THREE.PointLight(M.practical, md === 'night' ? 6 : 2, 12); lamp.position.set(0, 2.6, 3.2); st.add(lamp);
    const fam = []; if (info.family) { const outfits = [[CAST.SAM_OLD, -1.3], [CAST.MOM_OLD, -0.4], [CAST.MAX, 0.6], [CAST.MIA, 1.4]]; for (const [o, x] of outfits) { const f = T.figure3D(o, { rim: M.rim, pose: POSES.relaxed }); f.position.set(x, 0, 4.2); f.rotation.y = -Math.PI / 2 + 0.2; st.add(f); fam.push(f); } }
    return { stage: st };
  },
  draw(s, t, info, T) {
    if (info.move === 'pullout') T.dolly(s.stage.camera, t, [[0, { pos: [2, 2.2, 13], look: [0, 1.6, 0] }], [info.dur, { pos: [6, 7, 30], look: [0, 2.2, 0] }]]);
    else T.orbit(s.stage.camera, t, { target: [0, 2, 0], radius: [22, 16], height: [5, 3.5], from: -0.35, to: 0.25, dur: info.dur });
  },
  overlay(g, t, info) { if (info.badge) UI.badge(g, { str: info.badge, a: clamp(t / 0.4) * clamp((info.dur - t) / 0.3) }); if (info.label) { const u = S().ui, k = popIn(t, info.labelAt ?? 0.6); if (k > 0) TT(g, info.label, E.W / 2, E.H * 0.82, { size: 60, color: info.labelColor || u.cream, alpha: k, glow: 20, glowColor: 'rgba(0,0,0,.8)' }); } },
};
