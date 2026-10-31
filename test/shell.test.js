const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');

function make(activeKey) {
  const win = loadExt(['src/lib/core.js', 'src/lib/subjects.js', 'src/lib/icons.js', 'src/shell/nav.js', 'src/shell/shell.js'], {
    html: '<!doctype html><html><body><form id="aspnetForm"><p>Lectio</p></form></body></html>'
  });
  const calls = { search: 0, theme: 0, original: 0 };
  const shell = win.LP.buildShell({
    doc: win.document, base: '/lectio/123/', activeKey, user: { name: 'Freja Holm', cls: '2b' }, schoolName: 'Struer Statsgymnasium',
    logoutHref: '/lectio/123/logout.aspx', onSearch: () => calls.search++, onTheme: () => calls.theme++, onOriginal: () => calls.original++
  });
  return { win, doc: win.document, shell, calls };
}

test('skallen er første barn i body og har faner', () => {
  const { doc } = make('skema');
  assert.equal(doc.body.firstElementChild.id, 'lp-shell');
  assert.equal(doc.querySelectorAll('#lp-shell .lp-tab[data-key]').length, 7);
  const sk = doc.querySelector('.lp-tab[data-key="skema"]');
  assert.equal(sk.getAttribute('href'), '/lectio/123/SkemaNy.aspx');
  assert.equal(sk.getAttribute('aria-current'), 'page');
  assert.ok(sk.classList.contains('is-active'));
  assert.equal(doc.querySelectorAll('.lp-tab[aria-current]').length, 1);
});
test('en side i Mere markerer Mere med sidens navn', () => {
  const { doc } = make('dokumenter');
  const btn = doc.querySelector('.lp-more-btn');
  assert.ok(btn.classList.contains('is-active'));
  assert.match(btn.textContent, /Dokumenter/);
  assert.equal(doc.querySelector('.lp-more-item[aria-current="page"]').textContent.trim(), 'Dokumenter');
});
test('Fraværsårsager markerer fanen Fravær', () => {
  const { doc } = make('fravaersaarsager');
  assert.ok(doc.querySelector('.lp-tab[data-key="fravaer"]').classList.contains('is-active'));
});
test('ukendt side: ingen fane er markeret, men skallen findes', () => {
  const { doc } = make(null);
  assert.ok(doc.getElementById('lp-shell'));
  assert.equal(doc.querySelectorAll('#lp-shell [aria-current]').length, 0);
});
test('setBadge', () => {
  const { doc, shell } = make('forside');
  const b = doc.querySelector('[data-badge="beskeder"]');
  shell.setBadge('beskeder', 3);
  assert.equal(b.hidden, false);
  assert.equal(b.textContent, '3');
  shell.setBadge('beskeder', 120);
  assert.equal(b.textContent, '99+');
  shell.setBadge('beskeder', 0);
  assert.equal(b.hidden, true);
});
test('Mine hold er skjult uden hold og vises med mange', () => {
  const { doc, shell } = make('forside');
  const g = doc.querySelector('.lp-more-hold');
  shell.setHold([]);
  assert.equal(g.hidden, true);
  shell.setHold(Array.from({ length: 15 }, (_, i) => ({ name: `2b H${i}`, href: `https://www.lectio.dk/lectio/123/x.aspx?id=${i}` })));
  assert.equal(g.hidden, false);
  assert.equal(g.querySelectorAll('a').length, 15);
});
test('Mere åbner, og Escape lukker og giver fokus tilbage', () => {
  const { win, doc } = make('forside');
  const btn = doc.querySelector('.lp-more-btn');
  const pop = doc.querySelector('.lp-more-pop');
  btn.click();
  assert.equal(btn.getAttribute('aria-expanded'), 'true');
  assert.equal(pop.hidden, false);
  doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(pop.hidden, true);
  assert.equal(btn.getAttribute('aria-expanded'), 'false');
  assert.equal(doc.activeElement, btn);
});
test('klik uden for Mere lukker den', () => {
  const { doc } = make('forside');
  doc.querySelector('.lp-more-btn').click();
  doc.querySelector('#aspnetForm p').click();
  assert.equal(doc.querySelector('.lp-more-pop').hidden, true);
});
test('knapperne i bjælken kalder deres handlinger', () => {
  const { doc, calls } = make('forside');
  doc.querySelector('.lp-find').click();
  doc.querySelector('[data-act=theme]').click();
  doc.querySelector('[data-act=original]').click();
  assert.deepEqual({ ...calls }, { search: 1, theme: 1, original: 1 });
  assert.equal(doc.querySelector('a[data-act=logout]').getAttribute('href'), '/lectio/123/logout.aspx');
});
