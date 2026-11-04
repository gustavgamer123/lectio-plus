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

  // Snit-simulator (spec 7.3). overrides: { <linjeindeks>: '12' } ('' = fjern linjen); extra: forventede karakterer
  // uden linje på beviset, som regnes med vægt 1. Om en linje tæller med, ændres ikke.
  LP.simulateAverage = (protocol, overrides = {}, extra = []) => {
    const lines = (protocol || []).map((l, i) => (Object.prototype.hasOwnProperty.call(overrides, i) ? { ...l, grade: overrides[i] } : l));
    return LP.gradeAverage(lines.concat((extra || []).map((e) => ({ counts: true, weight: e.weight || 1, grade: e.grade }))));
  };

  // Linjen på beviset for en række i "Karakterer i år": samme fag og form, og årskarakter (standpunkt) eller eksamen.
  LP.protocolIndex = (protocol, row, kind) => {
    const re = kind === 'exam' ? /eksamen/i : /standp|årskar/i;
    const name = String(row.subject || '').trim().toLowerCase();
    return (protocol || []).findIndex((l) => String(l.subject || '').trim().toLowerCase() === name && l.form === row.form && re.test(l.type || ''));
  };

  // Snit af årskaraktererne i "Karakterer i år", uden vægt (som 1.x). overrides: { <rækkeindeks>: '7' }.
  LP.yearAverage = (current, overrides = {}) => {
    const gs = (current || []).map((r, i) => String(Object.prototype.hasOwnProperty.call(overrides, i) ? overrides[i] : r.year || '').trim()).filter((g) => LP.SCALE_7.includes(g));
    return gs.length ? gs.reduce((a, g) => a + Number(g), 0) / gs.length : null;
  };

  // Snit af standpunkter for alle fag: seneste standpunkt pr. række (2. hvis der er en tal-karakter, ellers 1.), uden vægt.
  // o1/o2: simulerede 1. og 2. standpunkter { <rækkeindeks>: '7' } ('' = uden karakter).
  LP.standpointAverage = (current, o1 = {}, o2 = {}) => {
    const pick = (o, i, v) => String(Object.prototype.hasOwnProperty.call(o, i) ? o[i] : v || '').trim();
    const gs = (current || []).map((r, i) => {
      const b = pick(o2, i, r.s2);
      if (LP.SCALE_7.includes(b)) return b;
      const a = pick(o1, i, r.s1);
      return LP.SCALE_7.includes(a) ? a : null;
    }).filter(Boolean);
    return gs.length ? gs.reduce((s, g) => s + Number(g), 0) / gs.length : null;
  };
})();
