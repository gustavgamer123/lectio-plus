/* Lectio+ : klik på Lectios egne knapper fra sidens egen verden (indlæses med "world": "MAIN").
   Mange af Lectios knapper er javascript:-links, der laver en postback (fx "Ny besked"). Når udvidelsen selv klikker
   på sådan et link, kører Chrome det under udvidelsens sikkerhedsregler og blokerer det. Herfra er klikket sidens eget.
   Udvidelsen beder om et klik ved at sende hændelsen "lp-click" til knappen (LP.lectioClick i core.js). */
(() => {
  'use strict';
  document.documentElement.setAttribute('data-lp-main', '1');
  document.addEventListener('lp-click', (e) => {
    const el = e.target;
    if (el && el.nodeType === 1 && el.isConnected && typeof el.click === 'function') el.click();
  }, true);
})();
