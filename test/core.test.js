const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP, Date: D } = loadExt(['src/lib/core.js']);

test('esc', () => assert.equal(LP.esc(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;'));
test('isoWeek og weekParam', () => {
  assert.deepEqual({ ...LP.isoWeek(new D(2026, 10, 2)) }, { w: 45, y: 2026 });
  assert.deepEqual({ ...LP.isoWeek(new D(2027, 0, 1)) }, { w: 53, y: 2026 });
  assert.equal(LP.weekParam(new D(2026, 10, 2)), '452026');
});
test('mondayOf', () => assert.equal(LP.mondayOf(new D(2026, 10, 4)).getDate(), 2));
test('dayLabel', () => {
  const now = new D(2026, 10, 2, 10, 0);
  assert.equal(LP.dayLabel(new D(2026, 10, 3), now), 'i morgen');
  assert.equal(LP.dayLabel(new D(2026, 10, 5), now), 'torsdag');
  assert.equal(LP.dayLabel(new D(2026, 10, 20), now), '20. nov');
});
test('relTime', () => {
  const now = new D(2026, 10, 2, 10, 47);
  assert.equal(LP.relTime(new D(2026, 10, 2, 12, 10), now), 'om 1 t 23 min');
  assert.equal(LP.relTime(new D(2026, 10, 6, 23, 59), now), 'om 5 dage');
});
test('num', () => { assert.equal(LP.num('7,5 %'), 7.5); assert.equal(LP.num('-'), null); });
test('abs', () => {
  const b = '/lectio/123/';
  assert.equal(LP.abs('SkemaNy.aspx', b), 'https://www.lectio.dk/lectio/123/SkemaNy.aspx');
  assert.equal(LP.abs('/lectio/123/x.aspx?a=1', b), 'https://www.lectio.dk/lectio/123/x.aspx?a=1');
  assert.equal(LP.abs('javascript:void(0)', b), null);
  assert.equal(LP.abs('#', b), null);
});
