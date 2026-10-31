// Regler for CSS, der skal holde, når skallen ligger fast øverst på siden.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { EXT } = require('./helpers/load');

const read = (f) => fs.readFileSync(path.join(EXT, f), 'utf8');
const rules = (css) => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));

test('ting der hænger fast ved rulning, starter under skallen', () => {
  for (const f of ['styles.css', 'styles/shell.css']) {
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
