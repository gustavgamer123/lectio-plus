// Kaskaden mellem extensionens CSS-filer, målt i en rigtig (headless) Chromium. jsdom kan ikke regne :is/:where/:has.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { EXT } = require('./helpers/load');

const manifest = JSON.parse(fs.readFileSync(path.join(EXT, 'manifest.json'), 'utf8'));
const css = manifest.content_scripts[0].css.map((f) => fs.readFileSync(path.join(EXT, f), 'utf8')).join('\n');

async function styleOf(htmlClass, body, selector, props) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><html class="${htmlClass}" data-lp-theme="light"><head><style>${css}</style></head><body>${body}</body></html>`);
    return await page.evaluate(([s, p]) => { const cs = getComputedStyle(document.querySelector(s)); return Object.fromEntries(p.map((k) => [k, cs[k]])); }, [selector, props]);
  } finally {
    await browser.close();
  }
}

test('skrivefeltet i Beskeder beholder sin højde og skrift', async () => {
  const s = await styleOf('lp-on lp-msgpage', '<div class="outerContentFrame"><textarea></textarea></div>', 'textarea', ['minHeight', 'fontSize']);
  assert.deepEqual(s, { minHeight: '130px', fontSize: '15px' });
});
test('et almindeligt tekstfelt i Lectio er mindst 96 px højt', async () => {
  const s = await styleOf('lp-on', '<div class="outerContentFrame"><textarea></textarea></div>', 'textarea', ['minHeight']);
  assert.equal(s.minHeight, '96px');
});
