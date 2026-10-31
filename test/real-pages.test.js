// Kører parserne på rigtige Lectio-sider gemt med `npm run capture`. Filerne er private og ligger ikke i git,
// så testene springes over, hvis de mangler.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadExt } = require('./helpers/load');
const win = loadExt(['src/lib/core.js', 'src/lib/subjects.js', 'src/lib/parse.js']);
const { LP } = win;
const DIR = path.join(__dirname, 'fixtures', 'private');
const BASE = '/lectio/123/';

function page(name, fn) {
  const file = path.join(DIR, name + '.html');
  const has = fs.existsSync(file);
  test(name, has ? {} : { skip: 'mangler fixture' }, () => fn(new win.DOMParser().parseFromString(fs.readFileSync(file, 'utf8'), 'text/html')));
}

page('SkemaNy.aspx', (d) => {
  const sk = LP.parseSkema(d, BASE);
  assert.notEqual(sk, null);
  assert.ok(sk.days.length >= 5, `dage: ${sk.days.length}`);
  sk.lessons.filter((l) => !l.allDay).forEach((l) => assert.ok(l.start < l.end, `${l.title || l.hold}`));
});
page('OpgaverElev.aspx', (d) => {
  const t = LP.parseAssignments(d, BASE);
  assert.ok(Array.isArray(t));
  t.forEach((x) => assert.ok(x.title.length > 0));
});
page('material_lektieoversigt.aspx', (d) => assert.ok(Array.isArray(LP.parseHomework(d, BASE))));
page('beskeder2.aspx', (d) => assert.ok(Array.isArray(LP.parseMessages(d, BASE))));
page('subnav_fravaerelev.aspx', (d) => {
  const a = LP.parseAbsence(d);
  assert.notEqual(a, null);
  assert.ok(a.rows.length > 0);
});
page('grades_grade_report.aspx', (d) => {
  const g = LP.parseGrades(d);
  assert.ok(g.current.length > 0 && g.current.every((c) => c.subject && !/Hold:/.test(c.subject)));
  assert.ok(g.protocol.some((l) => typeof l.weight === 'number' && l.weight > 0));
});
page('forside.aspx', (d) => {
  const f = LP.parseFront(d, BASE);
  assert.ok(Array.isArray(f.notices));
  assert.ok(Array.isArray(f.hold));
});
