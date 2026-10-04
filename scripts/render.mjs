// Render scenes/svg/*.svg to scenes/png/*.png (1920x1080) with headless Chromium.
// Usage: NODE_PATH=<dir with playwright> node scripts/render.mjs [chromium-path]
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const svgDir = path.join(root, 'scenes', 'svg');
const pngDir = path.join(root, 'scenes', 'png');
fs.mkdirSync(pngDir, { recursive: true });

const exe = process.argv[2] || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

const files = fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg')).sort();
for (const f of files) {
  const svg = fs.readFileSync(path.join(svgDir, f), 'utf8');
  await page.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(pngDir, f.replace('.svg', '.png')) });
}
await browser.close();
console.log(`rendered ${files.length} images`);
