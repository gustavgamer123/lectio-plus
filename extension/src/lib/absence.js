/* Lectio+ : fraværsberegner (spec 7.2). Regner på periodens brøker i Lectios fraværstabel (moduler og elevtid),
   fordi "Opgjort" kun er en procent uden nævner. Resultatet er et skøn og vises med "ca.". */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});
  const ratio = (a, n) => (n > 0 ? (a / n) * 100 : null);

  // rows: fra parseAbsence; picks: { mods: { <hold>: antal moduler }, hours: { <hold>: elevtimer } }.
  LP.absenceForecast = (rows, picks = {}) => {
    const mk = picks.mods || {};
    const hk = picks.hours || {};
    const out = [];
    let A = 0; let N = 0; let K = 0; let M = 0; let T = 0; let H = 0;
    for (const r of rows || []) {
      const [a, n] = r.mods || [0, 0];
      const [m, t] = r.wTime || [0, 0];
      const k = mk[r.hold] || 0;
      const h = hk[r.hold] || 0;
      A += a; N += n; K += k; M += m; T += t; H += h;
      if (!k && !h) continue;
      out.push({ hold: r.hold, k, h, mods: { now: ratio(a, n), then: ratio(a + k, n + k) }, hours: { now: ratio(m, t), then: ratio(m + h, t + h) } });
    }
    return { rows: out, total: { k: K, h: H, mods: { now: ratio(A, N), then: ratio(A + K, N + K) }, hours: { now: ratio(M, T), then: ratio(M + H, T + H) } } };
  };

  // Rækken i fraværstabellen for et hold-felt fra skemaet eller opgavelisten (kan være "21 Ty, 2b TY").
  LP.absenceHold = (rows, holdText) => {
    const parts = String(holdText || '').split(/\s*,\s*/).map((s) => s.trim().toLowerCase()).filter(Boolean);
    const hit = (rows || []).find((r) => parts.includes(String(r.hold).trim().toLowerCase()));
    return hit ? hit.hold : null;
  };
})();
