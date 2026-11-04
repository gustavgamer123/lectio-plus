// Travle uger (spec 7.4): de næste 8 uger med antal afleveringer og elevtimer for opgaver, der ikke er afleveret.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/busy.js']);

const NOW = new Date(2026, 10, 2, 9, 0); // mandag 2. november 2026, uge 45
const task = (d, h, status = 'Venter', hours = '2') => ({ due: new Date(2026, 10, d, h, 0), status, hours });

test('8 uger fra denne uge, med antal og elevtimer (komma-timer), og den travleste er fremhævet', () => {
  const w = LP.busyWeeks([task(4, 12, 'Venter', '2,5'), task(6, 23), task(12, 10, 'Venter', '5'), task(13, 10, 'Afleveret', '9'), task(1, 10)], NOW);
  assert.equal(w.length, 8);
  assert.deepEqual([w[0].w, w[0].count, w[0].hours], [45, 2, 4.5]);
  assert.deepEqual([w[1].w, w[1].count, w[1].hours], [46, 1, 5]);
  assert.equal(w[1].top, true);
  assert.equal(w.filter((x) => x.top).length, 1);
});

test('årsskiftet: uge 53 i 2026 efterfølges af uge 1 i 2027', () => {
  const w = LP.busyWeeks([], new Date(2026, 11, 29, 12));
  assert.deepEqual([w[0].w, w[0].y, w[1].w, w[1].y], [53, 2026, 1, 2027]);
});

test('ingen opgaver: alle uger er 0, og ingen er fremhævet', () => {
  const w = LP.busyWeeks([], NOW);
  assert.ok(w.every((x) => x.count === 0 && x.hours === 0 && !x.top));
});

test('lige mange elevtimer: flest opgaver vinder', () => {
  const w = LP.busyWeeks([task(4, 12, 'Venter', '2'), task(10, 12, 'Venter', '1'), task(11, 12, 'Venter', '1')], NOW);
  assert.equal(w[1].top, true);
});
