// "Hvad er ændret?" (spec 7.1): øjebliksbilleder, forskelle og den fælles log.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP } = loadExt(['src/lib/core.js', 'src/lib/changes.js']);

const NOW = new Date(2026, 10, 2, 18, 0); // mandag 2. november kl. 18
const at = (d, h, m = 0) => new Date(2026, 10, d, h, m);
const lesson = (o) => ({ title: '', room: 'B208', cancelled: false, changed: false, allDay: false, subject: { code: 'DA', name: 'Dansk' }, href: 'https://www.lectio.dk/lectio/1/aktivitet/aktivitetforside2.aspx?absid=111', start: at(3, 8), end: at(3, 8, 45), ...o });
const plain = (x) => JSON.parse(JSON.stringify(x));

test('første gang en datatype ses, gemmes kun et udgangspunkt: ingen linjer', () => {
  const snap = LP.snapshot('skema', [lesson({})]);
  assert.deepEqual(plain(LP.diffSnapshots('skema:45', null, snap, NOW)), []);
});

test('et modul der skifter lokale og samtidig er markeret ændret, giver én linje', () => {
  const before = LP.snapshot('skema', [lesson({})]);
  const after = LP.snapshot('skema', [lesson({ room: 'B207', changed: true })]);
  const lines = LP.diffSnapshots('skema:45', before, after, NOW);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].kind, 'room');
  assert.equal(LP.changeText(lines[0], NOW), 'Dansk i morgen 08:00 er flyttet fra B208 til B207');
  assert.equal(lines[0].until, at(3, 8, 45).getTime());
});

test('aflyst og ændret giver hver sin type; overståede moduler giver ingen linje', () => {
  const past = lesson({ href: '?absid=222', start: at(2, 8), end: at(2, 8, 45) });
  const before = LP.snapshot('skema', [lesson({}), lesson({ href: '?absid=333', start: at(4, 10), end: at(4, 10, 45) }), past]);
  const after = LP.snapshot('skema', [lesson({ cancelled: true }), lesson({ href: '?absid=333', start: at(4, 10), end: at(4, 10, 45), changed: true }), { ...past, room: 'X1' }]);
  const kinds = LP.diffSnapshots('skema:45', before, after, NOW).map((l) => l.kind).sort();
  assert.deepEqual(plain(kinds), ['cancelled', 'changed']);
});

test('ny opgave og flyttet frist', () => {
  const task = (o) => ({ title: 'Skriveopgave 2', hold: '2y DA', status: 'Venter', subject: { code: 'DA', name: 'Dansk' }, href: '?exerciseid=9', due: at(10, 23, 59), ...o });
  const before = LP.snapshot('tasks', [task({})]);
  const after = LP.snapshot('tasks', [task({ due: at(12, 23, 59) }), task({ title: 'Rapport', href: '?exerciseid=10', due: at(20, 12) }), task({ title: 'Gammel', href: '?exerciseid=11', status: 'Afleveret' })]);
  const lines = LP.diffSnapshots('tasks', before, after, NOW);
  assert.deepEqual(plain(lines.map((l) => l.kind).sort()), ['task-due', 'task-new']);
  const due = lines.find((l) => l.kind === 'task-due');
  assert.equal(LP.changeText(due, NOW), 'Fristen for Skriveopgave 2 er flyttet til torsdag 12/11 23:59');
});

test('ny og ændret lektie', () => {
  const hw = (o) => ({ date: at(3, 0), href: '?absid=111', text: 'Læs s. 10-20', subject: { code: 'DA', name: 'Dansk' }, ...o });
  const before = LP.snapshot('hw', [hw({})]);
  const after = LP.snapshot('hw', [hw({ text: 'Læs s. 10-30' }), hw({ href: '?absid=444', date: at(4, 0), subject: { code: 'MA', name: 'Matematik' } })]);
  const texts = LP.diffSnapshots('hw', before, after, NOW).map((l) => LP.changeText(l, NOW)).sort();
  assert.deepEqual(plain(texts), ['Lektien til Dansk i morgen er ændret', 'Ny lektie til Matematik onsdag 4/11']);
});

test('ny ulæst besked giver en linje, og den forsvinder fra loggen, når den er læst', () => {
  const msg = (o) => ({ subject: 'Ekskursion', from: 'Tina', unread: true, href: '?type=visbesked&id=555', ...o });
  const before = LP.snapshot('msgs', []);
  const snapNew = LP.snapshot('msgs', [msg({})]);
  const lines = LP.diffSnapshots('msgs', before, snapNew, NOW);
  assert.equal(LP.changeText(lines[0], NOW), 'Ny besked fra Tina: Ekskursion');
  let log = LP.mergeLog([], lines, NOW, { msgs: snapNew });
  assert.equal(log.length, 1);
  log = LP.mergeLog(log, [], NOW, { msgs: LP.snapshot('msgs', [msg({ unread: false })]) });
  assert.equal(log.length, 0);
});

test('mergeLog: nye linjer øverst, ingen dubletter, udløbne fjernes, højst 40', () => {
  const line = (id, until, atMs = 1) => ({ id, part: 'tasks', kind: 'task-new', until, at: atMs });
  const future = NOW.getTime() + 1e7;
  let log = LP.mergeLog([line('a', future)], [line('b', future, 2), line('a', future, 3), line('old', NOW.getTime() - 1)], NOW, {});
  assert.deepEqual(plain(log.map((l) => l.id)), ['b', 'a']);
  assert.equal(log.find((l) => l.id === 'a').at, 1, 'en kendt linje beholder sit første tidspunkt');
  log = LP.mergeLog(log, Array.from({ length: 50 }, (_, i) => line('n' + i, future)), NOW, {});
  assert.equal(log.length, 40);
});
