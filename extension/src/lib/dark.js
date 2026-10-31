/* Lectio+ : mørkt tema på Lectios egne sider. Lectio har faste farver, så lyse flader, mørk tekst og lyse kanter
   findes ud fra den beregnede stil og får klasserne lp-dk-bg, lp-dk-fg, lp-dk-link og lp-dk-bd (se lectio.css). */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  // Vores egne flader, som darkFix aldrig rører.
  LP.OWN_UI = '#lp-shell, #lp-app, #lp-drawer, #lp-palette, #lp-pill, #lp-afl, #lp-act-hero, #lp-shell-head, .lp-act-cardhead, .lp-fb-empty, #lp-colors';

  // Lysstyrke 0..1 for oklch()/rgb()/rgba(), eller null hvis farven er (næsten) gennemsigtig eller ukendt.
  LP.lum = (c) => {
    let m = c.match(/^oklch\(\s*([\d.]+)(%?)[^/)]*(?:\/\s*([\d.]+)(%?))?/);
    if (m) {
      if (m[3] !== undefined && parseFloat(m[3]) / (m[4] ? 100 : 1) < 0.35) return null;
      const v = parseFloat(m[1]); return m[2] ? v / 100 : v;
    }
    m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?/);
    if (m) {
      if (m[4] !== undefined && +m[4] < 0.35) return null;
      return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
    }
    return null;
  };

  const SIDES = ['Top', 'Right', 'Bottom', 'Left'];
  LP.darkFix = (root, doc = document) => {
    const html = doc.documentElement;
    if (html.getAttribute('data-lp-theme') !== 'dark' || !html.classList.contains('lp-on') || html.classList.contains('lp-takeover')) return;
    root = root || doc.getElementById('masterContent') || doc.body;
    if (!root || root.nodeType !== 1 || root.closest(LP.OWN_UI)) return;
    const win = doc.defaultView;
    for (const el of [root, ...root.getElementsByTagName('*')]) {
      if (el.closest(LP.OWN_UI)) continue;
      const cs = win.getComputedStyle(el);
      if (cs.display === 'none') continue;
      const b = LP.lum(cs.backgroundColor);
      if (b != null && b > 0.72) el.classList.add('lp-dk-bg');
      const f = LP.lum(cs.color);
      if (f != null && f < 0.4) el.classList.add(el.tagName === 'A' || el.closest('a') ? 'lp-dk-link' : 'lp-dk-fg');
      for (const s of SIDES) {
        if (!(parseFloat(cs[`border${s}Width`]) > 0) || cs[`border${s}Style`] === 'none') continue;
        const bd = LP.lum(cs[`border${s}Color`]);
        if (bd != null && bd > 0.6) { el.classList.add('lp-dk-bd'); break; }
      }
    }
  };
})();
