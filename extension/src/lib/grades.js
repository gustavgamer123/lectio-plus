/* Lectio+ : snittet på beviset ud fra protokollinjerne på karaktersiden */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});
  LP.SCALE_7 = ['-3', '00', '02', '4', '7', '10', '12'];

  // Vægtet snit af linjer, der tæller med ("Medtæller: Ja") og har en karakter på 7-trinsskalaen.
  LP.gradeAverage = (lines) => {
    let sum = 0; let weight = 0; let n = 0;
    for (const l of lines || []) {
      const g = String(l.grade || '').trim();
      if (!l.counts || !LP.SCALE_7.includes(g) || !(l.weight > 0)) continue;
      sum += Number(g) * l.weight; weight += l.weight; n++;
    }
    return { avg: weight ? sum / weight : null, weight, n };
  };
})();
