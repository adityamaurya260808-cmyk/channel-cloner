// sets/track3d.js: low-poly 3D stadium for establishing shots. Track runs along x (100 m straight), stands at -z,
// fence + open gate + main road at +z. buildStadium(T, {mood, crowdColors}) -> { stage, ... }
import { mood, shade, alpha } from '/engine/core.js';

export function buildStadium(T, o = {}) {
  const M = mood(o.mood || 'dusk'), { THREE } = T;
  const st = T.stage({ mood: o.mood || 'dusk', fov: o.fov || 38, fog: [60, 220], keyPos: [-30, 18, 20], keyIntensity: 3.0, ambient: 2.4, shadowSize: 40 });
  st.add(T.ground(400, 400, shade(M.grass, -0.45)));
  const trackC = T.canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#7a3526'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(240,230,220,.75)'; for (let i = 0; i <= 8; i++) g.fillRect(0, i * (h / 8) - 1, w, 2); }, [1, 1]);
  const trk = T.plane(130, 10, T.mat('#ffffff', { map: trackC })); trk.rotation.x = -Math.PI / 2; trk.position.set(0, 0.02, 0); st.add(trk);
  for (const x of [-50, 50]) st.add(T.box(0.15, 0.03, 10, '#efe8e0', x, 0.03, 0));
  // stands with crowd
  const crowd = T.crowd3D({ rows: 14, perRow: 140, width: 120, step: 0.9, rise: 0.55, z0: -9, colors: o.crowdColors || ['#6a5a90', '#7a6a98', '#5a4e80', '#8a6a9a', '#9a5a6a'], seed: 7 }); st.add(crowd);
  st.add(T.box(124, 1.2, 1, shade(M.wall, -0.5), 0, 8.4, -21.8));
  // floodlights
  for (const x of [-45, -15, 15, 45]) { st.add(T.cyl(0.25, 0.35, 24, '#1a1622', x, 12, -24)); const p = T.windowPane(5, 2.2, { glowColor: '#fff2d6', cols: 3, rows: 2, power: 1.6 }); p.position.set(x, 24, -23.6); p.rotation.x = 0.35; st.add(p); const sh = T.shaft(8, 34, '#fff2d6', 0.05); sh.position.set(x, 12, -10); sh.rotation.x = 0.9; st.add(sh); const pl = new THREE.PointLight('#fff2d6', 400, 80, 1.6); pl.position.set(x, 20, -14); st.add(pl); }
  // giant screen
  const scr = T.windowPane(14, 6, { glowColor: o.screenColor || '#4a6aa0', cols: 1, rows: 1, power: 0.7 }); scr.position.set(30, 15, -22); st.add(scr);
  // fence with an open gate, then the main road and buildings
  for (let x = -65; x <= 65; x += 2.5) if (Math.abs(x - (o.gateX ?? 12)) > 2) st.add(T.box(0.08, 1.2, 0.08, '#15121c', x, 0.6, 9));
  st.add(T.box(130, 0.06, 0.06, '#15121c', 0, 1.2, 9));
  const road = T.plane(400, 8, '#2c2834'); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.03, 15); st.add(road);
  for (let x = -150; x < 150; x += 6) st.add(T.box(3, 0.02, 0.18, '#d8cfc0', x, 0.05, 15));
  for (let i = 0; i < 14; i++) { const b = T.building(8 + (i % 3) * 2, 6 + (i * 37 % 9), 6, { color: shade(M.wall, -0.4), win: M.practical, lit: 0.45, seed: 30 + i }); b.position.set(-90 + i * 13, 0, 26); b.rotation.y = Math.PI; st.add(b); }
  for (const x of [-60, -30, 0, 30, 60]) { st.add(T.cyl(0.08, 0.1, 5, '#15121c', x, 2.5, 19)); const l = T.sphere(0.25, T.basic(M.practical), x, 5, 19); st.add(l); }
  return { stage: st, M };
}
