const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/week.js']);

const days = [0, 1, 2, 3, 4].map((i) => ({ name: 'dag' + i }));
test('alldayHeight giver plads til flest heldagsbegivenheder på én dag', () => {
  const lessons = [{ day: 0, allDay: true }, { day: 0, allDay: true }, { day: 2, allDay: true }, { day: 1, allDay: false }];
  assert.equal(LP.alldayHeight(days, lessons), 58);
});
test('alldayHeight uden heldagsbegivenheder', () => assert.equal(LP.alldayHeight(days, [{ day: 0, allDay: false }]), 6));
