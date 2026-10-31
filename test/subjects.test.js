const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/subjects.js']);

test('subjectFrom kender fagkoder', () => {
  assert.deepEqual({ ...LP.subjectFrom('2b FY') }, { code: 'FY', name: 'Fysik' });
  assert.deepEqual({ ...LP.subjectFrom('2b XY') }, { code: 'XY', name: 'XY' });
});
test('subjectFrom giver null uden fag', () => {
  assert.equal(LP.subjectFrom('Studietur'), null);
  assert.equal(LP.subjectFrom(''), null);
});
test('hueFor bruger egne farver først', () => {
  assert.equal(LP.hueFor('FY', { FY: 135 }), 135);
  assert.equal(LP.hueFor(null, {}), 230);
});
test('hueFor er stabil og fra paletten', () => {
  const a = LP.hueFor('FY', {});
  assert.equal(LP.hueFor('FY', {}), a);
  assert.ok([230, 262, 292, 330, 352, 18, 36, 152, 172, 196, 210, 120].includes(a));
});
test('shortTeacher', () => assert.equal(LP.shortTeacher('Mette Lund (ML), Anders Nielsen (AN)'), 'ML,AN'));
