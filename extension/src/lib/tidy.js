/* Lectio+ : små oprydninger i Lectios egne sider, som CSS ikke kan klare alene. */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  // Lectio bruger tomme tabelrækker som afstand. De får klassen lp-empty-row og skjules i lectio.css.
  // En række er kun tom, hvis den hverken har tekst, felter, knapper eller billeder.
  const KEEP = 'input, select, textarea, button, img, svg, a, iframe, video, canvas, [class*="fonticon"]';
  LP.markEmptyRows = (root) => {
    if (!root || !root.querySelectorAll) return;
    for (const tr of root.querySelectorAll('table tr')) {
      if (tr.classList.contains('lp-empty-row') || !tr.cells.length) continue;
      if (tr.textContent.replace(/[\s ]/g, '') === '' && !tr.querySelector(KEEP)) tr.classList.add('lp-empty-row');
    }
  };

  // Skolens kategorifarver i studieretningspræsentationen (td.forsideCellNN) har en betydning. Farven gemmes i --lp-cat,
  // så lectio.css kan vise den som en stribe i venstre side i stedet for som flade bag teksten.
  LP.markCategoryCells = (root) => {
    if (!root || !root.querySelectorAll) return;
    const win = root.ownerDocument.defaultView;
    for (const td of root.querySelectorAll('table.forsideTabel td[class*="forsideCell"]')) {
      if (td.classList.contains('lp-cat')) continue;
      const bg = win.getComputedStyle(td).backgroundColor;
      if (!bg || bg === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(bg)) continue;
      td.style.setProperty('--lp-cat', bg);
      td.classList.add('lp-cat');
    }
  };
})();
