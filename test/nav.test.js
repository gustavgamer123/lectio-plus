const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/shell/nav.js']);

test('faner', () => assert.deepEqual([...LP.NAV_TABS].map((n) => n.label), ['Forside', 'Skema', 'Lektier', 'Opgaver', 'Beskeder', 'Fravær', 'Karakterer']));
test('Mere starter med studieplan og dokumenter', () => assert.deepEqual([...LP.NAV_MORE[0].items].map((n) => n.key), ['studieplan', 'dokumenter']));
test('activeKey', () => {
  assert.equal(LP.activeKey('forside.aspx', ''), 'forside');
  assert.equal(LP.activeKey('aktivitet/aktivitetforside2.aspx', '?absid=1'), 'skema');
  assert.equal(LP.activeKey('elevaflevering.aspx', '?exerciseid=9'), 'opgaver');
  assert.equal(LP.activeKey('subnav/fravaerelev_fravaersaarsager.aspx', ''), 'fravaersaarsager');
  assert.equal(LP.activeKey('dokumentoversigt.aspx', ''), 'dokumenter');
  assert.equal(LP.activeKey('ukendt/side.aspx', ''), null);
});
test('tabFor', () => {
  assert.equal(LP.tabFor('skema'), 'skema');
  assert.equal(LP.tabFor('fravaersaarsager'), 'fravaer');
  assert.equal(LP.tabFor('karakterblad'), 'karakterer');
  assert.equal(LP.tabFor('dokumenter'), 'more');
  assert.equal(LP.tabFor(null), null);
});
test('activeKey vælger punktet med query før punktet uden', () => {
  assert.equal(LP.activeKey('default.aspx', '?menu=kontakt'), 'kontakt');
  assert.equal(LP.activeKey('default.aspx', ''), 'hovedmenu');
});
