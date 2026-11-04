// Klar til i morgen (spec 7.5): næste skoledag, aftentilstand og dagens plan.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadExt, EXT } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/day.js']);

const at = (d, h, m = 0) => new Date(2026, 10, d, h, m); // november 2026: 2 = mandag, 6 = fredag, 9 = mandag
const L = (d, h, o = {}) => ({ start: at(d, h), end: at(d, h, 45), room: 'B208', subject: { code: 'DA', name: 'Dansk' }, allDay: false, cancelled: false, ...o });
const week = [L(5, 8), L(5, 10, { subject: { code: 'MA', name: 'Matematik' }, room: 'B207' }), L(6, 8), L(6, 12, { end: at(6, 14, 55) }), L(9, 9, { subject: { code: 'ID', name: 'Idræt' }, room: 'GYM' }), L(9, 10)];

test('nextSchoolDay: dagen efter i dag med mindst ét modul; fredag og weekend giver mandag', () => {
  assert.equal(+LP.nextSchoolDay(week, at(5, 18)), +new Date(2026, 10, 6));
  assert.equal(+LP.nextSchoolDay(week, at(6, 16)), +new Date(2026, 10, 9));
  assert.equal(+LP.nextSchoolDay(week, at(7, 12)), +new Date(2026, 10, 9));
});
test('nextSchoolDay springer dage over, hvor alt er aflyst eller kun er heldagsbegivenheder, og giver null uden moduler', () => {
  const w = [L(6, 8, { cancelled: true }), L(6, 0, { allDay: true }), L(9, 9)];
  assert.equal(+LP.nextSchoolDay(w, at(5, 18)), +new Date(2026, 10, 9));
  assert.equal(LP.nextSchoolDay([], at(5, 18)), null);
});
test('eveningMode: sand når dagens sidste modul er slut, eller når der ingen moduler er i dag', () => {
  assert.equal(LP.eveningMode(week, at(5, 9)), false);
  assert.equal(LP.eveningMode(week, at(5, 11)), true);
  assert.equal(LP.eveningMode(week, at(7, 9)), true, 'lørdag');
});
test('dayPlan: første modul, antal, fri og fagkoder', () => {
  const p = LP.dayPlan(week, new Date(2026, 10, 9));
  assert.equal(p.count, 2);
  assert.equal(p.first.room, 'GYM');
  assert.equal(+p.end, +at(9, 10, 45));
  assert.deepEqual(JSON.parse(JSON.stringify(p.codes)), ['ID', 'DA']);
  assert.equal(LP.dayPlan(week, new Date(2026, 10, 7)), null);
});

test('Lectio+ genindlæser ikke siden, når ændringsloggen skriver til chrome.storage.local', () => {
  const src = fs.readFileSync(path.join(EXT, 'content.js'), 'utf8');
  assert.match(src, /onChanged\.addListener\(\(ch, area\) => \{\s*if \(area !== 'sync'\) return;/);
});
