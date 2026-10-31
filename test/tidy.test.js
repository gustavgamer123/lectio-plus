const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');

const page = `<!doctype html><html><body><div class="outerContentFrame"><table class="ls-table-layout1">
  <tr id="hoved"><th>Fag</th><th>Karakter</th></tr>
  <tr id="tom"><td> </td><td>&nbsp;</td></tr>
  <tr id="tekst"><td>Fysik</td><td>7</td></tr>
  <tr id="felt"><td></td><td><input type="checkbox"></td></tr>
  <tr id="billede"><td><img src="x.png"></td><td></td></tr>
</table></div></body></html>`;

test('markEmptyRows markerer kun rækker uden tekst og uden kontroller', () => {
  const win = loadExt(['src/lib/core.js', 'src/lib/tidy.js'], { html: page });
  win.LP.markEmptyRows(win.document.querySelector('.outerContentFrame'));
  const marked = [...win.document.querySelectorAll('tr.lp-empty-row')].map((r) => r.id);
  assert.deepEqual(marked, ['tom']);
});
