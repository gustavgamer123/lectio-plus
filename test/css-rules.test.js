// Regler for CSS, der skal holde, når skallen ligger fast øverst på siden.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { EXT } = require('./helpers/load');

const read = (f) => fs.readFileSync(path.join(EXT, f), 'utf8');
const rules = (css) => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));

const manifestCss = () => JSON.parse(read('manifest.json')).content_scripts.flatMap((c) => c.css || []);

test('manifestet har ikke længere den gamle styles.css, og alle CSS-filer findes', () => {
  const css = manifestCss();
  assert.ok(!css.includes('styles.css'), 'styles.css er tømt og fjernet i plan 3');
  for (const f of css) assert.ok(fs.existsSync(path.join(EXT, f)), `${f} mangler`);
});

test('ting der hænger fast ved rulning, starter under skallen', () => {
  for (const f of manifestCss()) {
    for (const r of rules(read(f)).filter((x) => /position:\s*sticky/.test(x.body))) {
      const top = (r.body.match(/(?:^|;)\s*top:\s*([^;]+)/) || [])[1] || '';
      assert.match(top, /var\(--shell-h\)/, `${f}: ${r.sel.split('\n').pop().trim()} har top: ${top}`);
    }
  }
});

test('startdækket har samme farver som skallen: blå bjælke og hvid fanerække', () => {
  const boot = rules(read('styles/shell.css')).find((r) => /html\.lp-boot body::before/.test(r.sel));
  assert.ok(boot, 'mangler startdækket');
  assert.match(boot.body, /var\(--bar\)/);
  assert.match(boot.body, /var\(--surface\)/);
});

test('undtagelser for vores egne flader i lectio.css har ingen specificitet og dækker opgave- og lektionssiden', () => {
  const css = read('styles/lectio.css');
  const bare = [...css.matchAll(/:not\(:is\(#/g)].filter((m) => css.slice(Math.max(0, m.index - 7), m.index) !== ':where(');
  assert.equal(bare.length, 0, 'en :not(:is(#...)) uden :where( giver ID-specificitet');
  const lists = [...css.matchAll(/:where\(:not\(:is\(([^)]*)\)/g)].map((m) => m[1]);
  assert.ok(lists.length >= 3, `kun ${lists.length} undtagelseslister`);
  for (const l of lists) for (const id of ['#lp-pagehead', '#lp-app', '#lp-drawer', '#lp-afl', '#lp-act-hero', '.lp-afl', '.lp-act-cardhead']) assert.ok(l.includes(id), `${id} mangler i: ${l}`);
});
