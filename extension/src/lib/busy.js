/* Lectio+ : travle uger (spec 7.4). De næste 8 uger (mandag til søndag) med antal ikke-afleverede opgaver og
   summen af deres elevtimer. Den travleste uge (flest elevtimer, ellers flest opgaver) får top: true. */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  LP.busyWeeks = (tasks, now = new Date(), n = 8) => {
    const starts = [];
    const mon = LP.mondayOf(now);
    for (let i = 0; i <= n; i++) { const s = new Date(mon); s.setDate(s.getDate() + i * 7); starts.push(s.getTime()); }
    const weeks = starts.slice(0, n).map((s, i) => ({ ...LP.isoWeek(new Date(s)), start: s, end: starts[i + 1], count: 0, hours: 0, top: false }));
    const at = now.getTime();
    for (const t of tasks || []) {
      if (/afleveret/i.test(t.status || '') || !t.due) continue;
      const d = new Date(t.due).getTime();
      if (d < at) continue;
      const wk = weeks.find((x) => d >= x.start && d < x.end);
      if (!wk) continue;
      wk.count++;
      wk.hours += LP.num(t.hours) || 0;
    }
    let best = null;
    for (const x of weeks) if (x.count && (!best || x.hours > best.hours || (x.hours === best.hours && x.count > best.count))) best = x;
    if (best) best.top = true;
    return weeks;
  };
})();
