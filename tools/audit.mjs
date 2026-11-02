// Kører audit-reglerne (tools/audit-rules.js) på Lectio-sider i dev-browseren og tæller brud på retning D.
// Brug: npm run audit -- [sti ...] [--rule navn,navn] [--theme light|dark|both] [--width 1280] [--own] [--offline] [--click <css>]
// Uden stier køres alle sider i Mere undtagen Studieplan, som har en egen visning.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ROOT, EXT, ORIGIN, connect, schoolBase, reloadExtension, setSettings, slug } from './lib.mjs';

const navCtx = {};
vm.runInNewContext(fs.readFileSync(path.join(EXT, 'src', 'shell', 'nav.js'), 'utf8'), navCtx);
export const PLAN2_PAGES = navCtx.LP.MORE_ITEMS.map((n) => n.path).filter((p) => !p.startsWith('studieplan.aspx'));
// De egne visninger (plan 3): fanerne, Studieplan og den første opgave og lektion fra de gemte sider.
const fixture = (name, re) => { try { const m = fs.readFileSync(path.join(ROOT, 'test', 'fixtures', 'private', name), 'utf8').match(re); return m ? m[0].replace(/&amp;/g, '&') : null; } catch (e) { return null; } };
export const OWN_PAGES = navCtx.LP.NAV_TABS.map((n) => n.path).concat(['studieplan.aspx?displaytype=ugeteksttabel',
  fixture('OpgaverElev.aspx.html', /ElevAflevering\.aspx\?[^"']+/), fixture('SkemaNy.aspx.html', /aktivitet\/aktivitetforside2\.aspx\?absid=\d+/)]).filter(Boolean);

const opts = { theme: 'both', width: '1280', rule: '', own: false, offline: false };
const paths = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--own') opts.own = true;
  else if (argv[i] === '--offline') opts.offline = true;
  else if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i];
  else paths.push(argv[i]);
}
const pages = paths.length ? paths : opts.own ? OWN_PAGES : PLAN2_PAGES;
const themes = opts.theme === 'both' ? ['light', 'dark'] : [opts.theme];
const rules = opts.rule ? opts.rule.split(',') : null;
const width = +opts.width;
const allow = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'audit-allow.json'), 'utf8'));
const allowed = (p, v) => allow.some((a) => (a.page === '*' || a.page === p) && a.rule === v.rule && (a.selector === '*' || v.selector.includes(a.selector)));
const src = fs.readFileSync(path.join(ROOT, 'tools', 'audit-rules.js'), 'utf8');

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
    await page.waitForTimeout(300);
  };
}
const report = [];
for (const p of pages) {
  for (const theme of themes) {
    try {
    await open(p, theme);
    if (opts.click) { await page.click(opts.click); await page.waitForTimeout(900); }
    await page.evaluate(src);
    const found = await page.evaluate((o) => {
      const cs = getComputedStyle(document.documentElement);
      const own = ['--accent', '--accent-soft', '--bar', '--bar-ink-2'].map((v) => cs.getPropertyValue(v).trim());
      globalThis.AUDIT.canvas = true;
      return globalThis.AUDIT.collect(document, window, { theme: o.theme, own, ownViews: o.ownViews });
    }, { theme, ownViews: opts.own });
    const kept = found.filter((v) => (!rules || rules.includes(v.rule)) && !allowed(p, v));
    report.push({ page: p, theme, width, violations: kept });
    } catch (e) {
      report.push({ page: p, theme, width, violations: [{ rule: 'fejl', selector: 'side', detail: e.message.split('\n')[0], count: 1 }] });
    }
  }
}
await page.close();
if (browser) await browser.close();

fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'shots', `audit${opts.own ? '-own' : ''}-${width}.json`), JSON.stringify(report, null, 1));
const names = ['fejl', 'rund', 'tag', 'skrift', 'blaa', 'kontrast', 'lys', 'tabel', 'knap', 'overloeb', 'flugt'].filter((n) => !rules || rules.includes(n));
console.log(['side'.padEnd(46), ...names.map((n) => n.padStart(8))].join(''));
let total = 0;
for (const r of report) {
  const counts = names.map((n) => r.violations.filter((v) => v.rule === n).length);
  total += counts.reduce((a, b) => a + b, 0);
  console.log([`${slug(r.page).slice(0, 38)} ${r.theme}`.padEnd(46), ...counts.map((c) => String(c || '.').padStart(8))].join(''));
}
console.log(`\n${total} brud (unikke selectors) ved ${width} px. Detaljer: shots/audit${opts.own ? '-own' : ''}-${width}.json`);
process.exit(total ? 1 : 0);
