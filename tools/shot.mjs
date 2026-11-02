// Tager skærmbilleder af Lectio-sider med udvidelsen i lyst og mørkt tema.
// Brug: npm run shot -- <sti ...> [--theme light|dark|both] [--width 1280] [--click <css>] [--press <taster>] [--type <tekst>] [--name <tillæg>]
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ORIGIN, connect, schoolBase, reloadExtension, setSettings, slug } from './lib.mjs';

const opts = { theme: 'both', width: '1280' };
const paths = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--offline') opts.offline = true;
  else if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i];
  else paths.push(argv[i]);
}
if (!paths.length) { console.error('Angiv mindst én side, fx forside.aspx'); process.exit(1); }
const themes = opts.theme === 'both' ? ['light', 'dark'] : [opts.theme];
const width = +opts.width;
const out = path.join(ROOT, 'shots');
fs.mkdirSync(out, { recursive: true });

// --offline: siderne vises fra fixtures i en headless Chromium (tools/offline.mjs), så der ikke skal være logget ind.
let page; let open; let browser;
if (opts.offline) {
  const off = await import('./offline.mjs');
  ({ browser } = await off.offlineContext(width));
  page = await browser.contexts()[0].newPage();
  open = (p, theme) => off.openOffline(page, p, theme);
} else {
  const { context } = await connect();
  const base = schoolBase(context);
  await reloadExtension(context);
  await setSettings(context, { theme: 'auto' });
  page = await context.newPage();
  await page.setViewportSize({ width, height: 800 });
  open = async (p, theme) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(ORIGIN + base + p, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  };
}
for (const p of paths) {
  for (const colorScheme of themes) {
    try {
    await open(p, colorScheme);
    if (opts.click) await page.click(opts.click);
    if (opts.press) await page.keyboard.press(opts.press);
    if (opts.type) await page.keyboard.type(opts.type);
    await page.waitForTimeout(400);
    const file = path.join(out, `${slug(p)}${opts.name ? '-' + opts.name : ''}-${colorScheme}-${width}.png`);
    await page.screenshot({ path: file });
    console.log(file);
    } catch (e) {
      console.error(`${p} ${colorScheme}: ${e.message.split('\n')[0]}`);
    }
  }
}
await page.close();
if (browser) await browser.close();
process.exit(0);
