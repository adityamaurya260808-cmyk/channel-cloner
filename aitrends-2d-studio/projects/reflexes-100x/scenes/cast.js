// cast.js: one outfit per recurring character. The signature colour is their identity; keep it identical in every shot.
export const THEO = { top: 'hoodie', color: '#d64a33', head: 'spiky' };                                   // "you", 14
export const SAM = { top: 'none', head: 'cap', headColor: '#f2c21a', kid: true };                        // little brother, 7
export const MIA = { top: 'none', head: 'beanie', headColor: '#f29ac0' };                                // best friend
export const MOM = { top: 'dress', color: '#8a5ad6', head: 'bun' };                                      // mom
export const COACH = { top: 'tracksuit', color: '#3fb950', color2: '#e8f5ea', head: 'visor', headColor: '#3fb950' }; // Coach Lee
export const EXTRA = { top: 'none', head: 'none' };                                                      // classmates, crowd, drivers
export const EXTRA2 = { top: 'none', head: 'ponytail' };
export const EXTRA3 = { top: 'none', head: 'curly' };
export const RUNNER = (n) => ({ top: 'jersey', color: '#4a4458', color2: '#d8d2e0', number: String(n), head: 'none' });
export const CAST = [THEO, SAM, MIA, MOM, COACH];
