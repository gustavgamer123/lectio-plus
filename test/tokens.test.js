// Tjekker farverne i retning D mod WCAG 2.1 og at skriftfilerne findes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { EXT } = require('./helpers/load');

const css = fs.existsSync(path.join(EXT, 'styles', 'tokens.css')) ? fs.readFileSync(path.join(EXT, 'styles', 'tokens.css'), 'utf8') : '';
// Første blok er lyst tema; blokken hvis selector indeholder data-lp-theme="dark" er mørkt tema.
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));
const vars = (b) => Object.fromEntries([...(b ? b.body : '').matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const light = vars(blocks.find((b) => /html\.lp-on/.test(b.sel) && !/dark/.test(b.sel)));
const dark = { ...light, ...vars(blocks.find((b) => /data-lp-theme="dark"/.test(b.sel))) };

function lum(hex) {
  const n = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const AA = [['ink', 'surface'], ['ink', 'bg'], ['ink-2', 'surface'], ['ink-2', 'bg'], ['accent', 'surface'], ['accent', 'accent-soft'],
  ['accent-ink', 'accent'], ['bar-ink', 'bar'], ['bar-ink-2', 'bar'], ['danger', 'surface'], ['danger', 'danger-soft'],
  ['warn', 'surface'], ['warn', 'warn-soft'], ['ok', 'surface'], ['ok', 'ok-soft']];
for (const [name, t] of [['lyst', light], ['mørkt', dark]]) {
  test(`kontrast mindst 4,5 i ${name} tema`, () => {
    for (const [fg, bg] of AA) {
      assert.ok(t[fg] && t[bg], `mangler --${fg} eller --${bg}`);
      const c = contrast(t[fg], t[bg]);
      assert.ok(c >= 4.5, `--${fg} på --${bg}: ${c.toFixed(2)}`);
    }
  });
  test(`--ink-3 mindst 3,0 i ${name} tema`, () => {
    for (const bg of ['surface', 'bg']) assert.ok(contrast(t['ink-3'], t[bg]) >= 3, `--ink-3 på --${bg}`);
  });
}

test('alle skriftfiler i tokens.css findes', () => {
  const files = [...css.matchAll(/url\("[^"]*\/fonts\/([^"]+)"\)/g)].map((m) => m[1]);
  assert.ok(files.length >= 6, `kun ${files.length} skriftfiler`);
  files.forEach((f) => assert.ok(fs.existsSync(path.join(EXT, 'fonts', f)), f));
});

const allText = () => {
  const out = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (/\.(js|css|html|json)$/.test(e.name)) out.push([p, fs.readFileSync(p, 'utf8')]);
  });
  walk(EXT);
  return out;
};
test('Schibsted-skriften er væk', () => allText().forEach(([p, t]) => assert.ok(!t.includes('LP Schibsted'), p)));
test('--side er væk', () => allText().forEach(([p, t]) => assert.ok(!t.includes('--side'), p)));
