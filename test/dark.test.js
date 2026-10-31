const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');

const page = `<!doctype html><html class="lp-on" data-lp-theme="dark"><body><div id="masterContent">
  <div id="bund" style="border-bottom: 1px solid rgb(240, 240, 240)">tekst</div>
  <div id="hvid" style="background-color: rgb(255, 255, 255)">tekst</div>
  <header id="lp-shell"><div id="egen" style="background-color: rgb(255, 255, 255)">tekst</div></header>
</div></body></html>`;

function run() {
  const win = loadExt(['src/lib/core.js', 'src/lib/dark.js'], { html: page });
  win.LP.darkFix(win.document.getElementById('masterContent'), win.document);
  return win.document;
}

test('darkFix finder en lys kant i bunden', () => assert.ok(run().getElementById('bund').classList.contains('lp-dk-bd')));
test('darkFix finder en hvid flade', () => assert.ok(run().getElementById('hvid').classList.contains('lp-dk-bg')));
test('darkFix rører ikke vores egne flader', () => assert.ok(!run().getElementById('egen').classList.contains('lp-dk-bg')));
test('darkFix gør intet i lyst tema', () => {
  const win = loadExt(['src/lib/core.js', 'src/lib/dark.js'], { html: page.replace('data-lp-theme="dark"', 'data-lp-theme="light"') });
  win.LP.darkFix(win.document.getElementById('masterContent'), win.document);
  assert.ok(!win.document.getElementById('hvid').classList.contains('lp-dk-bg'));
});
