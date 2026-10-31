/* Lectio+ : beregninger til ugeskemaet */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  // Heldagsrækken får samme højde i alle dage, så timegitteret flugter på tværs af ugen.
  LP.alldayHeight = (days, lessons) => {
    const per = (days || []).map((_, i) => (lessons || []).filter((l) => l.allDay && l.day === i).length);
    const max = Math.max(0, ...per);
    return max ? max * 26 + 6 : 6;
  };
})();
