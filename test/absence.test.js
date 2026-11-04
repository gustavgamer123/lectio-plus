// Fraværsberegner (spec 7.2): fra a/n til (a+k)/(n+k) pr. hold og samlet, for moduler og elevtid.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/absence.js']);
const plain = (x) => JSON.parse(JSON.stringify(x));
const round = (v) => (v == null ? v : Math.round(v * 100) / 100);

const rows = [
  { hold: '2y DA', mods: [1, 10], pct: 2.4, wTime: [0, 3], wPct: 0 },
  { hold: '2y MA', mods: [0, 10], pct: 0, wTime: [2, 10], wPct: 1 }
];

test('valgte moduler giver nyt fravær for holdet og samlet', () => {
  const r = LP.absenceForecast(rows, { mods: { '2y DA': 2 } });
  assert.equal(r.rows.length, 1);
  assert.equal(r.rows[0].hold, '2y DA');
  assert.deepEqual(plain(r.rows[0].mods), { now: 10, then: 25 });
  assert.equal(round(r.total.mods.now), 5);
  assert.equal(round(r.total.mods.then), 13.64);
  assert.equal(r.total.k, 2);
});

test('en opgave der ikke afleveres, lægger elevtimer til skriftligt fravær', () => {
  const r = LP.absenceForecast(rows, { hours: { '2y MA': 2 } });
  assert.deepEqual(plain(r.rows[0].hours).now, 20);
  assert.equal(round(r.rows[0].hours.then), 33.33);
});

test('0 moduler og ingen elevtid giver null, aldrig NaN', () => {
  const r = LP.absenceForecast([{ hold: 'X', mods: [0, 0], wTime: null }], { mods: { X: 1 } });
  assert.equal(r.rows[0].mods.now, null);
  assert.equal(r.rows[0].mods.then, 100);
  assert.equal(r.rows[0].hours.now, null);
  assert.equal(r.rows[0].hours.then, null);
  assert.doesNotMatch(JSON.stringify(r), /NaN/);
  assert.deepEqual(plain(LP.absenceForecast([], {}).rows), []);
});

test('absenceHold finder rækken for en lektion med flere hold', () => {
  assert.equal(LP.absenceHold([{ hold: '21 Ty' }, { hold: '2y DA' }], '21 Ty, 2b TY'), '21 Ty');
  assert.equal(LP.absenceHold([{ hold: '2y DA' }], '3x FY'), null);
});
