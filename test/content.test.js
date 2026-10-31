// Indlæser hele content-scriptet i manifestets rækkefølge på en falsk, logget ind Lectio-side.
// En fejl i content.js må aldrig efterlade eleven med startdækket og uden menu.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadExt, EXT } = require('./helpers/load');

const manifestJs = JSON.parse(fs.readFileSync(path.join(EXT, 'manifest.json'), 'utf8')).content_scripts.find((c) => c.js.includes('content.js')).js;
const PAGE = (title) => `<!doctype html><html class="lp-on lp-boot"><head><title>Eleven Freja Holm, 2b - ${title} - Skole</title></head>
  <body><form id="aspnetForm"><a href="/lectio/123/logout.aspx">Log ud</a></form></body></html>`;
const stubs = (win) => {
  win.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
  win.fetch = () => new Promise(() => {});
};
const tick = () => new Promise((r) => setTimeout(r, 50));

function run(files, page, title) {
  const errors = [];
  const onRejection = (e) => errors.push(e);
  process.on('unhandledRejection', onRejection);
  const win = loadExt(files, { html: PAGE(title), url: `https://www.lectio.dk/lectio/123/${page}`, before: (w) => { stubs(w); w.addEventListener('error', (e) => errors.push(e.error || e.message)); } });
  return tick().then(() => { process.off('unhandledRejection', onRejection); return { win, doc: win.document, errors, html: win.document.documentElement }; });
}

test('hele content-scriptet bygger skallen på en Lectio-side', async () => {
  const { doc, errors, html } = await run(manifestJs, 'DokumentOversigt.aspx', 'Dokumenter');
  assert.deepEqual(errors.map(String), []);
  assert.equal(doc.body.firstElementChild.id, 'lp-shell');
  assert.ok(!html.classList.contains('lp-boot'));
  assert.match(doc.querySelector('.lp-more-btn').textContent, /Dokumenter/);
});

test('mangler et bibliotek, falder siden tilbage til almindeligt Lectio', async () => {
  const { doc, errors, html } = await run(manifestJs.filter((f) => f !== 'src/shell/shell.js'), 'DokumentOversigt.aspx', 'Dokumenter');
  assert.deepEqual(errors.map(String), []);
  assert.equal(doc.getElementById('lp-shell'), null);
  assert.ok(!html.classList.contains('lp-boot'), 'startdækket skal væk');
  assert.ok(!html.classList.contains('lp-on'), 'Lectios egen menu skal vises igen');
});
