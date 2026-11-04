/* Lectio+ : "Hvad er ændret?" (spec 7.1). Et lille øjebliksbillede pr. datatype sammenlignes med friske data,
   og forskellene skrives i én fælles log, som Forside (og senere notifikationerne) læser. */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});
  const t = (d) => (d == null || d === '' ? null : d instanceof Date ? d.getTime() : typeof d === 'number' ? d : new Date(d).getTime());
  const idOf = (href, re) => ((href || '').match(re) || [])[1] || '';
  const hash = (s) => { let h = 0; for (const ch of String(s || '')) h = (h * 31 + ch.charCodeAt(0)) | 0; return (h >>> 0).toString(36); };
  const DAY = 864e5;
  const startOfDay = (ms) => { const d = new Date(ms); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
  LP.CHANGE_MAX = 40;

  // Et stabilt billede af én datatype: kun de felter, der kan give en meningsfuld ændring.
  LP.snapshot = (part, data) => {
    const out = {};
    const kind = String(part).split(':')[0];
    for (const x of data || []) {
      if (kind === 'skema') {
        if (x.allDay || !x.start) continue;
        const key = idOf(x.href, /absid=(\d+)/i) || `${t(x.start)}|${x.subject?.code || x.title || ''}`;
        out[key] = { s: t(x.start), e: t(x.end) || t(x.start), name: x.subject?.name || x.title || x.hold || 'Modul', room: x.room || '', x: !!x.cancelled, c: !!x.changed, href: x.href || '' };
      } else if (kind === 'tasks') {
        const key = idOf(x.href, /exerciseid=(\d+)/i) || hash(`${x.title}|${x.hold}`);
        out[key] = { title: x.title || '', due: t(x.due), done: /afleveret/i.test(x.status || ''), name: x.subject?.name || x.hold || '', href: x.href || '' };
      } else if (kind === 'hw') {
        const key = hash(`${x.href || x.activity || ''}|${t(x.date)}`);
        out[key] = { d: t(x.date), h: hash(x.text), name: x.subject?.name || '', href: x.href || '' };
      } else if (kind === 'msgs') {
        const key = idOf(x.href, /[?&]id=(\d+)/) || hash(`${x.subject}|${x.from}`);
        out[key] = { title: x.subject || '', from: x.from || '', unread: !!x.unread, href: x.href || '' };
      }
    }
    return out;
  };

  // Linjer for det der er ændret mellem to billeder. Uden et tidligere billede: ingen linjer (kun et udgangspunkt).
  LP.diffSnapshots = (part, prev, next, now = Date.now()) => {
    if (!prev) return [];
    const kind = String(part).split(':')[0];
    const at = t(now);
    const out = [];
    const line = (o) => out.push({ part: kind, at, ...o });
    for (const [key, n] of Object.entries(next || {})) {
      const p = prev[key];
      if (kind === 'skema') {
        if (!p || n.e < at) continue;
        const base = { key, name: n.name, when: n.s, href: n.href, until: n.e };
        if (n.x && !p.x) line({ ...base, id: `x:${key}`, kind: 'cancelled' });
        else if (!n.x && n.room && p.room && n.room !== p.room) line({ ...base, id: `room:${key}:${n.room}`, kind: 'room', from: p.room, to: n.room });
        else if (!n.x && n.c && !p.c) line({ ...base, id: `c:${key}`, kind: 'changed' });
      } else if (kind === 'tasks') {
        if (n.done || (n.due != null && n.due < at)) continue;
        const base = { key, name: n.name, title: n.title, when: n.due, href: n.href, until: n.due };
        if (!p) line({ ...base, id: `tn:${key}`, kind: 'task-new' });
        else if (p.due != null && n.due != null && p.due !== n.due) line({ ...base, id: `td:${key}:${n.due}`, kind: 'task-due' });
      } else if (kind === 'hw') {
        if (n.d == null || startOfDay(n.d) + DAY <= at) continue;
        const base = { key, name: n.name, when: n.d, href: n.href, until: startOfDay(n.d) + DAY };
        if (!p) line({ ...base, id: `hw:${key}:${n.h}`, kind: 'hw', isNew: true });
        else if (p.h !== n.h) line({ ...base, id: `hw:${key}:${n.h}`, kind: 'hw', isNew: false });
      } else if (kind === 'msgs') {
        if (!p && n.unread) line({ key, id: `m:${key}`, kind: 'msg', title: n.title, from: n.from, href: n.href, until: at + 7 * DAY });
      }
    }
    return out;
  };

  // Nye linjer øverst, ingen dubletter (en kendt linje beholder sit første tidspunkt), udløbne og læste beskeder fjernes.
  LP.mergeLog = (log, lines, now = Date.now(), snaps = {}) => {
    const at = t(now);
    const seen = new Set();
    const known = new Set((log || []).map((l) => l.id));
    return [...(lines || []).filter((l) => !known.has(l.id)), ...(log || [])].filter((l) => {
      if (seen.has(l.id)) return false;
      seen.add(l.id);
      if (l.until != null && l.until < at) return false;
      const m = l.part === 'msgs' && snaps.msgs ? snaps.msgs[l.key] : null;
      return !(m && !m.unread);
    }).slice(0, LP.CHANGE_MAX);
  };

  const dayText = (ms, now) => {
    const d = new Date(ms);
    const diff = Math.round((startOfDay(ms) - startOfDay(t(now))) / DAY);
    if (diff === 0) return 'i dag';
    if (diff === 1) return 'i morgen';
    return `${LP.DAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  };
  const hm = (ms) => LP.hm(new Date(ms));
  LP.changeText = (l, now = Date.now()) => {
    const when = l.when != null ? `${dayText(l.when, now)} ${hm(l.when)}` : '';
    switch (l.kind) {
      case 'room': return `${l.name} ${when} er flyttet fra ${l.from} til ${l.to}`;
      case 'cancelled': return `${l.name} ${when} er aflyst`;
      case 'changed': return `${l.name} ${when} er ændret`;
      case 'task-new': return `Ny opgave${l.name ? ` i ${l.name}` : ''}: ${l.title}${when ? `, frist ${when}` : ''}`;
      case 'task-due': return `Fristen for ${l.title} er flyttet til ${when}`;
      case 'hw': return l.isNew ? `Ny lektie til ${l.name} ${dayText(l.when, now)}` : `Lektien til ${l.name} ${dayText(l.when, now)} er ændret`;
      case 'msg': return `Ny besked fra ${l.from}: ${l.title}`;
      default: return '';
    }
  };
  // Tag pr. type: tekst og farve (klasse på .lp-tag).
  LP.CHANGE_TAG = { room: ['lokale', 'is-warn'], cancelled: ['aflyst', 'is-danger'], changed: ['ændret', 'is-warn'], 'task-new': ['ny opgave', 'is-accent'], 'task-due': ['ny frist', 'is-warn'], hw: ['lektie', ''], msg: ['besked', 'is-accent'] };
})();
