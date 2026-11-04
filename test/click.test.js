// Fejl: "Ny besked" og "Markér alle som læst" i Lectio+ gjorde ingenting. Lectios knapper er javascript:-links, og Chrome
// blokerer dem, når udvidelsen klikker på dem fra sin egen verden (udvidelsens CSP). Klikket skal ske fra sidens egen verden.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadExt, EXT } = require('./helpers/load');

const html = '<!doctype html><html><head></head><body><a id="lectio" href="#">Ny besked</a></body></html>';

test('LP.lectioClick sender klikket til sidens egen verden, når scriptet der er indlæst', () => {
  const w = loadExt(['src/main/click.js', 'src/lib/core.js'], { html });
  const el = w.document.getElementById('lectio');
  let direct = 0;
  el.click = () => { direct++; }; // et direkte klik fra udvidelsen må ikke bruges
  const seen = [];
  w.document.addEventListener('lp-click', (e) => seen.push(e.target.id), true);
  assert.equal(w.LP.lectioClick(el), true);
  assert.deepEqual(seen, ['lectio'], 'klikket går som en lp-click-hændelse på selve knappen');
  assert.equal(direct, 1, 'scriptet i sidens verden klikker på knappen');
});

test('scriptet i sidens verden klikker på knappen, når det får en lp-click', () => {
  const w = loadExt(['src/main/click.js'], { html });
  const el = w.document.getElementById('lectio');
  el.addEventListener('click', (e) => { e.preventDefault(); w.clicks = (w.clicks || 0) + 1; });
  el.dispatchEvent(new w.Event('lp-click'));
  assert.equal(w.clicks, 1);
  assert.equal(w.document.documentElement.getAttribute('data-lp-main'), '1');
});

test('uden scriptet i sidens verden falder LP.lectioClick tilbage til et almindeligt klik', () => {
  const w = loadExt(['src/lib/core.js'], { html });
  const el = w.document.getElementById('lectio');
  el.addEventListener('click', (e) => { e.preventDefault(); w.clicks = (w.clicks || 0) + 1; });
  w.LP.lectioClick(el);
  assert.equal(w.clicks, 1);
  assert.equal(w.LP.lectioClick(null), false);
});

test('manifestet indlæser klik-scriptet i sidens egen verden på alle Lectio-sider', () => {
  const m = JSON.parse(fs.readFileSync(path.join(EXT, 'manifest.json'), 'utf8'));
  const main = m.content_scripts.find((c) => (c.js || []).includes('src/main/click.js'));
  assert.ok(main, 'src/main/click.js mangler i manifestet');
  assert.equal(main.world, 'MAIN');
  assert.equal(main.run_at, 'document_start');
  assert.deepEqual(main.matches, m.content_scripts[0].matches);
});

test('content.js klikker aldrig direkte på Lectios knapper', () => {
  const src = fs.readFileSync(path.join(EXT, 'content.js'), 'utf8');
  for (const bad of [/getElementById\([^)]*\)\?\.click\(\)/, /\b(newBtn|allRead)\.click\(\)/, /\.a\.click\(\)/]) assert.doesNotMatch(src, bad);
});
