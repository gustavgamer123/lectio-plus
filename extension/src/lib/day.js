/* Lectio+ : "Klar til i morgen" (spec 7.5). Næste skoledag, om Forside skal vise den, og en kort plan for dagen. */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});
  const real = (l) => l && l.start && !l.allDay && !l.cancelled;
  const day0 = (d) => { const x = new Date(d); return new Date(x.getFullYear(), x.getMonth(), x.getDate()); };

  // Første dag efter i dag med mindst ét modul, der ikke er aflyst. null hvis der ingen er.
  LP.nextSchoolDay = (lessons, now = new Date()) => {
    const today = +day0(now);
    const days = (lessons || []).filter(real).map((l) => +day0(l.start)).filter((d) => d > today).sort((a, b) => a - b);
    return days.length ? new Date(days[0]) : null;
  };

  // Forside viser næste skoledag, når dagens sidste modul er slut, eller når der ikke er moduler i dag.
  LP.eveningMode = (lessons, now = new Date()) => {
    const today = +day0(now);
    const todays = (lessons || []).filter((l) => real(l) && +day0(l.start) === today);
    if (!todays.length) return true;
    return Math.max(...todays.map((l) => +new Date(l.end || l.start))) <= +now;
  };

  // Plan for én dag: første modul, antal moduler, sidste sluttid og fagkoderne i rækkefølge.
  LP.dayPlan = (lessons, day) => {
    const d = +day0(day);
    const list = (lessons || []).filter((l) => real(l) && +day0(l.start) === d).sort((a, b) => new Date(a.start) - new Date(b.start));
    if (!list.length) return null;
    const codes = [...new Set(list.map((l) => l.subject?.code).filter(Boolean))];
    return { first: list[0], count: list.length, end: new Date(Math.max(...list.map((l) => +new Date(l.end || l.start)))), codes, lessons: list };
  };
})();
