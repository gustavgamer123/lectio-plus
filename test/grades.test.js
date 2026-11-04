const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/grades.js']);

test('gradeAverage vægter og tager kun tællende 7-trinskarakterer', () => {
  const r = LP.gradeAverage([{ counts: true, weight: 1, grade: '10' }, { counts: true, weight: 2, grade: '7' }, { counts: false, weight: 1, grade: '12' }, { counts: true, weight: 1, grade: 'B' }]);
  assert.deepEqual({ ...r }, { avg: 8, weight: 3, n: 2 });
});
test('gradeAverage uden linjer', () => assert.deepEqual({ ...LP.gradeAverage([]) }, { avg: null, weight: 0, n: 0 }));

// Snit-simulator (spec 7.3)
const P = [
  { subject: 'Matematik', form: 'Skriftlig', type: 'Afsl. Standpkt.', counts: true, weight: 1, grade: '7' },
  { subject: 'Dansk', form: 'Mundtlig', type: 'Eksamenskar.', counts: true, weight: 1, grade: '10' },
  { subject: 'Idræt', form: 'Mundtlig', type: 'Afsl. Standpkt.', counts: false, weight: 1, grade: '12' }
];
test('simulateAverage: en anden karakter på en linje regnes om med linjens vægt', () => {
  assert.equal(LP.simulateAverage(P, { 0: '12' }).avg, 11);
  assert.equal(LP.simulateAverage(P, { 2: '-3' }).avg, 8.5, 'en linje der ikke tæller med, tæller stadig ikke med');
  assert.equal(LP.simulateAverage(P, { 1: '' }).avg, 7, 'Fjern tager linjen ud');
});
test('simulateAverage: en forventet karakter uden linje på beviset tæller med vægt 1, også uden protokol', () => {
  assert.equal(LP.simulateAverage(P, {}, [{ grade: '4' }]).avg, 7);
  const r = LP.simulateAverage([], {}, [{ grade: '10' }, { grade: '02' }]);
  assert.equal(r.avg, 6);
  assert.equal(r.n, 2);
});
test('protocolIndex finder linjen for et fag, en form og årskarakter eller eksamen', () => {
  assert.equal(LP.protocolIndex(P, { subject: 'matematik', form: 'Skriftlig' }, 'year'), 0);
  assert.equal(LP.protocolIndex(P, { subject: 'Dansk', form: 'Mundtlig' }, 'exam'), 1);
  assert.equal(LP.protocolIndex(P, { subject: 'Dansk', form: 'Mundtlig' }, 'year'), -1);
});
test('yearAverage: snit af årskarakterer uden vægt, med simulerede karakterer', () => {
  const cur = [{ year: '7' }, { year: '10' }, { year: '' }, { year: 'B' }];
  assert.equal(LP.yearAverage(cur), 8.5);
  assert.equal(LP.yearAverage(cur, { 2: '4' }), 7);
  assert.equal(LP.yearAverage([]), null);
});

// Snit af standpunkter: seneste standpunkt pr. fag (2. hvis det findes, ellers 1.), uden vægt, og de kan simuleres.
test('standpointAverage bruger 2. standpunkt, ellers 1., og kan simuleres', () => {
  const cur = [{ s1: '7', s2: '10' }, { s1: '4', s2: '' }, { s1: '', s2: '' }, { s1: 'B', s2: '' }];
  assert.equal(LP.standpointAverage(cur), 7);
  assert.equal(LP.standpointAverage(cur, { 1: '12' }), 11, 'simuleret 1. standpunkt');
  assert.equal(LP.standpointAverage(cur, {}, { 1: '02', 2: '7' }), (10 + 2 + 7) / 3, 'simuleret 2. standpunkt og et fag uden standpunkt');
  assert.equal(LP.standpointAverage(cur, {}, { 0: '' }), (7 + 4) / 2, 'Uden karakter på 2. standpunkt falder tilbage til 1.');
  assert.equal(LP.standpointAverage([]), null);
});
