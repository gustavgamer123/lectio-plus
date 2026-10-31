const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const src = fs.readFileSync(path.join(__dirname, '..', 'tools', 'audit-rules.js'), 'utf8');
const dom = new JSDOM('<!doctype html><html><body><div class="outerContentFrame"><p style="font-family: Verdana">Hej</p></div></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
const win = dom.window;
win.HTMLElement.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, top: 0, left: 0, width: 100, height: 20, right: 100, bottom: 20 });
win.eval(src);
const { AUDIT } = win;
const rgb = (h) => AUDIT.toRgb(h);

test('kontrast efter WCAG', () => assert.ok(AUDIT.contrast(rgb('#ffffff'), rgb('#1d2733')) > 14));
test('Lectios petrolblå er en fremmed blå, accenten og rød er ikke', () => {
  assert.equal(AUDIT.isForeignBlue(rgb('#006493'), rgb('#1b5ea8')), true);
  assert.equal(AUDIT.isForeignBlue(rgb('#1b5ea8'), rgb('#1b5ea8')), false);
  assert.equal(AUDIT.isForeignBlue(rgb('#c42b1c'), rgb('#1b5ea8')), false);
});
test('collect finder gammel skrift', () => {
  const v = AUDIT.collect(win.document, win, { theme: 'light', own: ['#1b5ea8'] });
  assert.ok(v.some((x) => x.rule === 'skrift'), JSON.stringify(v));
});
test('collect regner opacity med i kontrasten', () => {
  const d = new JSDOM('<!doctype html><html><body style="background:#fff"><div class="outerContentFrame"><div style="opacity:0.3"><p style="color: rgb(0, 0, 0); font-family: \'LP Plex\'">Dæmpet</p></div></div></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
  d.window.HTMLElement.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, top: 0, left: 0, width: 100, height: 20, right: 100, bottom: 20 });
  d.window.eval(src);
  const v = d.window.AUDIT.collect(d.window.document, d.window, { theme: 'light', own: ['#1b5ea8'] });
  assert.ok(v.some((x) => x.rule === 'kontrast'), JSON.stringify(v));
});
