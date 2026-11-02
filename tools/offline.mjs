// Viser Lectio-sider med udvidelsen uden login: siderne kommer fra de gemte fixtures (test/fixtures/private),
// Lectios egne scripts fjernes, og udvidelsens CSS og scripts lægges på i manifestets rækkefølge.
// Lectios eget stylesheet og billeder hentes stadig fra nettet. Bruges af audit.mjs og shot.mjs med --offline.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { ROOT, EXT, ORIGIN, slug } from './lib.mjs';

const FIX = path.join(ROOT, 'test', 'fixtures', 'private');
const FONT_HOST = 'https://lp-fonts.local/';
const manifest = JSON.parse(fs.readFileSync(path.join(EXT, 'manifest.json'), 'utf8'));
const scripts = (cs) => cs.flatMap((c) => c.js || []);
const css = () => manifest.content_scripts.flatMap((c) => c.css || []).map((f) => fs.readFileSync(path.join(EXT, f), 'utf8')).join('\n')
  .split('chrome-extension://__MSG_@@extension_id__/fonts/').join(FONT_HOST);
const js = () => scripts(manifest.content_scripts).filter((f) => f !== 'early.js').map((f) => fs.readFileSync(path.join(EXT, f), 'utf8'));

export const offlineBase = () => {
  const f = fs.readFileSync(path.join(FIX, 'forside.aspx.html'), 'utf8');
  return (f.match(/\/lectio\/\d+\//) || ['/lectio/0/'])[0];
};

function fixtureFor(url) {
  const u = new URL(url);
  const rel = u.pathname.replace(/^\/lectio\/\d+\//, '') + u.search;
  for (const cand of [rel, rel.split('?')[0]]) {
    const f = path.join(FIX, slug(cand) + '.html');
    if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
  }
  return null;
}

export async function offlineContext(width) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width, height: 800 } });
  return { browser, context };
}

// Åbner en side offline i det givne tema og venter, til udvidelsen har bygget sine flader.
export async function openOffline(page, p, theme) {
  if (!page.__lpRouted) {
    page.__lpRouted = true;
    await page.route('**/*', (route) => {
      const req = route.request();
      const url = req.url();
      if (url.startsWith(FONT_HOST)) return route.fulfill({ body: fs.readFileSync(path.join(EXT, 'fonts', url.slice(FONT_HOST.length))), contentType: 'font/woff2' });
      if (/^https:\/\/www\.lectio\.dk\/lectio\/\d+\/.*\.aspx/i.test(url) && ['document', 'fetch', 'xhr'].includes(req.resourceType())) {
        const html = fixtureFor(url);
        return route.fulfill({ status: html ? 200 : 404, body: html || '<html><body>mangler fixture</body></html>', contentType: 'text/html' });
      }
      if (['stylesheet', 'image', 'font'].includes(req.resourceType())) return route.continue();
      return route.abort();
    });
  }
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(ORIGIN + offlineBase() + p, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
  await page.addStyleTag({ content: css() });
  await page.evaluate(() => document.documentElement.classList.add('lp-on', 'lp-boot'));
  for (const s of js()) await page.evaluate(s).catch((e) => console.error('script:', e.message.split('\n')[0]));
  await page.waitForTimeout(1200);
}
