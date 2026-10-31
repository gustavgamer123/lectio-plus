const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/grades.js']);

test('gradeAverage vægter og tager kun tællende 7-trinskarakterer', () => {
  const r = LP.gradeAverage([{ counts: true, weight: 1, grade: '10' }, { counts: true, weight: 2, grade: '7' }, { counts: false, weight: 1, grade: '12' }, { counts: true, weight: 1, grade: 'B' }]);
  assert.deepEqual({ ...r }, { avg: 8, weight: 3, n: 2 });
});
test('gradeAverage uden linjer', () => assert.deepEqual({ ...LP.gradeAverage([]) }, { avg: null, weight: 0, n: 0 }));
