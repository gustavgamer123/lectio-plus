// Indlæser extension-scripts som almindelige scripts i ét jsdom-vindue, ligesom Chromes content-script-miljø.
process.env.TZ = 'Europe/Copenhagen';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const EXT = path.join(__dirname, '..', '..', 'extension');
// before(window) kan sætte ting op, som jsdom mangler, før scriptene køres.
function loadExt(files, { html = '<!doctype html><html><head></head><body></body></html>', url = 'https://www.lectio.dk/lectio/123/forside.aspx', before } = {}) {
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  if (before) before(dom.window);
  for (const f of files) dom.window.eval(fs.readFileSync(path.join(EXT, f), 'utf8'));
  return dom.window;
}
module.exports = { loadExt, EXT };
