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

test('markCategoryCells gør skolens kategorifarve til en variabel og markerer cellen', () => {
  const html = `<!doctype html><html><body><div class="outerContentFrame"><table class="forsideTabel"><tr>
    <td id="farve" class="forsideCell13" style="background-color: rgb(80, 120, 200)">Kategori</td>
    <td id="ingen" class="forsideCell14">Kategori</td></tr></table></div></body></html>`;
  const win = loadExt(['src/lib/core.js', 'src/lib/tidy.js'], { html });
  win.LP.markCategoryCells(win.document.querySelector('.outerContentFrame'));
  const td = win.document.getElementById('farve');
  assert.ok(td.classList.contains('lp-cat'));
  assert.equal(td.style.getPropertyValue('--lp-cat'), 'rgb(80, 120, 200)');
  assert.ok(!win.document.getElementById('ingen').classList.contains('lp-cat'));
});
