// Gemmer Lectios rå HTML som testdata i test/fixtures/private (gitignored, fordi siderne indeholder personlige data).
// Brug: npm run capture -- [sti ...]. Henter én side ad gangen, fordi Lectio kun tager én forespørgsel ad gangen.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, connect, lectioPage, schoolBase, slug } from './lib.mjs';

const DEFAULT = ['forside.aspx', 'SkemaNy.aspx', 'material_lektieoversigt.aspx', 'OpgaverElev.aspx', 'beskeder2.aspx',
  'subnav/fravaerelev.aspx', 'grades/grade_report.aspx', 'studieplan.aspx?displaytype=ugeteksttabel'];
const paths = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;
const out = path.join(ROOT, 'test', 'fixtures', 'private');
fs.mkdirSync(out, { recursive: true });

const { context } = await connect();
const base = schoolBase(context);
const page = lectioPage(context);
for (const p of paths) {
  const html = await page.evaluate((u) => fetch(u, { credentials: 'include' }).then((r) => r.text()), base + p);
  const file = path.join(out, slug(p) + '.html');
  fs.writeFileSync(file, html);
  console.log(`${p}: ${Math.round(html.length / 1024)} KB${html.includes('logout.aspx') ? '' : '  (ikke logget ind?)'}`);
}
process.exit(0);
