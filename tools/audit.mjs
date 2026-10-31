// Kører audit-reglerne (tools/audit-rules.js) på Lectio-sider i dev-browseren og tæller brud på retning D.
// Brug: npm run audit -- [sti ...] [--rule navn,navn] [--theme light|dark|both] [--width 1280]
// Uden stier køres alle sider i Mere undtagen Studieplan, som har en egen visning.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ROOT, EXT, ORIGIN, connect, schoolBase, reloadExtension, setSettings, slug } from './lib.mjs';

const navCtx = {};
vm.runInNewContext(fs.readFileSync(path.join(EXT, 'src', 'shell', 'nav.js'), 'utf8'), navCtx);
export const PLAN2_PAGES = navCtx.LP.MORE_ITEMS.map((n) => n.path).filter((p) => !p.startsWith('studieplan.aspx'));

const opts = { theme: 'both', width: '1280', rule: '' };
const paths = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i];
  else paths.push(argv[i]);
}
const pages = paths.length ? paths : PLAN2_PAGES;
const themes = opts.theme === 'both' ? ['light', 'dark'] : [opts.theme];
const rules = opts.rule ? opts.rule.split(',') : null;
const width = +opts.width;
const allow = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'audit-allow.json'), 'utf8'));
const allowed = (p, v) => allow.some((a) => (a.page === '*' || a.page === p) && a.rule === v.rule && (a.selector === '*' || v.selector.includes(a.selector)));
const src = fs.readFileSync(path.join(ROOT, 'tools', 'audit-rules.js'), 'utf8');

const { context } = await connect();
const base = schoolBase(context);
await reloadExtension(context);
await setSettings(context, { theme: 'auto' });
const page = await context.newPage();
await page.setViewportSize({ width, height: 800 });
const report = [];
for (const p of pages) {
  for (const theme of themes) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(ORIGIN + base + p, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(300);
    await page.evaluate(src);
    const found = await page.evaluate((o) => {
      const cs = getComputedStyle(document.documentElement);
      const own = ['--accent', '--accent-soft', '--bar', '--bar-ink-2'].map((v) => cs.getPropertyValue(v).trim());
      globalThis.AUDIT.canvas = true;
      return globalThis.AUDIT.collect(document, window, { theme: o.theme, own });
    }, { theme });
    const kept = found.filter((v) => (!rules || rules.includes(v.rule)) && !allowed(p, v));
    report.push({ page: p, theme, width, violations: kept });
  }
}
await page.close();

fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'shots', `audit-${width}.json`), JSON.stringify(report, null, 1));
const names = ['rund', 'skrift', 'blaa', 'kontrast', 'lys', 'tabel', 'knap', 'overloeb'].filter((n) => !rules || rules.includes(n));
console.log(['side'.padEnd(46), ...names.map((n) => n.padStart(8))].join(''));
let total = 0;
for (const r of report) {
  const counts = names.map((n) => r.violations.filter((v) => v.rule === n).length);
  total += counts.reduce((a, b) => a + b, 0);
  console.log([`${slug(r.page).slice(0, 38)} ${r.theme}`.padEnd(46), ...counts.map((c) => String(c || '.').padStart(8))].join(''));
}
console.log(`\n${total} brud (unikke selectors) ved ${width} px. Detaljer: shots/audit-${width}.json`);
process.exit(total ? 1 : 0);
