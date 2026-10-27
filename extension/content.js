/* Lectio+ : et moderne lag oven på Lectio */
(() => {
  'use strict';
  if (window.top !== window) return;
  if (document.documentElement.dataset.lpLoaded) return;
  document.documentElement.dataset.lpLoaded = '1';

  const m = location.pathname.match(/^\/lectio\/(\d+)\//i);
  if (!m) return;
  const SCHOOL = m[1];
  const BASE = `/lectio/${SCHOOL}/`;
  const PAGE = location.pathname.slice(BASE.length).toLowerCase();
  const logoutLink = document.querySelector('a[href*="logout.aspx"]');
  if (!logoutLink) { document.documentElement.classList.remove('lp-on', 'lp-takeover', 'lp-boot'); return; } // ikke logget ind

  /* ---------------- indstillinger ---------------- */
  const DEFAULTS = { enabled: true, theme: 'auto', dashboard: true, skema: true, views: true, hideDone: false };
  const hasChrome = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync;
  function loadSettings() {
    return new Promise((res) => {
      if (hasChrome) {
        try { chrome.storage.sync.get(DEFAULTS, (s) => res({ ...DEFAULTS, ...s })); return; } catch (e) { /* fald tilbage */ }
      }
      let s = {};
      try { s = JSON.parse(localStorage.getItem('lp-settings') || '{}'); } catch (e) { /* tom */ }
      res({ ...DEFAULTS, ...s });
    });
  }
  function saveSetting(key, val) {
    if (hasChrome) { try { chrome.storage.sync.set({ [key]: val }); return; } catch (e) { /* fald tilbage */ } }
    try {
      const s = JSON.parse(localStorage.getItem('lp-settings') || '{}');
      s[key] = val; localStorage.setItem('lp-settings', JSON.stringify(s));
    } catch (e) { /* ignorer */ }
  }

  /* ---------------- hjælpere ---------------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const DAYS = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const abs = (href) => { if (!href || href === '#' || /^javascript:/i.test(href)) return null; try { return new URL(href, location.origin + BASE).href; } catch (e) { return null; } };
  const num = (s) => { const v = parseFloat(String(s).replace(',', '.').replace(/[^\d.\-]/g, '')); return isNaN(v) ? null : v; };

  function isoWeek(d) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = t.getUTCFullYear();
    const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
    return { w, y };
  }
  const weekParam = (d) => { const { w, y } = isoWeek(d); return pad(w) + y; };
  const mondayOf = (d) => { const x = startOfDay(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };

  function dayLabel(d, now = new Date()) {
    const diff = Math.round((startOfDay(d) - startOfDay(now)) / 864e5);
    if (diff === 0) return 'i dag';
    if (diff === 1) return 'i morgen';
    if (diff === -1) return 'i går';
    if (diff > 1 && diff < 7) return DAYS[d.getDay()];
    return `${d.getDate()}. ${MONTHS[d.getMonth()].slice(0, 3)}`;
  }
  function relTime(d, now = new Date()) {
    const mins = Math.round((d - now) / 6e4);
    const a = Math.abs(mins);
    let txt;
    if (a < 60) txt = `${a} min`;
    else if (a < 60 * 24) txt = `${Math.floor(a / 60)} t ${a % 60 ? (a % 60) + ' min' : ''}`.trim();
    else txt = `${Math.round(a / 1440)} ${Math.round(a / 1440) === 1 ? 'dag' : 'dage'}`;
    return mins >= 0 ? `om ${txt}` : `for ${txt} siden`;
  }

  /* fag og farver */
  const SUBJECTS = {
    DA: 'Dansk', MA: 'Matematik', EN: 'Engelsk', TY: 'Tysk', FR: 'Fransk', SP: 'Spansk', BT: 'Bioteknologi', BI: 'Biologi',
    KE: 'Kemi', FY: 'Fysik', HI: 'Historie', SA: 'Samfundsfag', RE: 'Religion', ID: 'Idræt', MU: 'Musik', BK: 'Billedkunst',
    DE: 'Design', DD: 'Design og arkitektur', PS: 'Psykologi', NG: 'Naturvidenskabeligt grundforløb', AP: 'Almen sprogforståelse',
    OL: 'Oldtidskundskab', IN: 'Informatik', NV: 'Naturvidenskab', NA: 'Naturgeografi', GE: 'Geografi', MD: 'Mediefag',
    DR: 'Dramatik', FI: 'Filosofi', LA: 'Latin', IT: 'Italiensk', KI: 'Kinesisk', JA: 'Japansk', VØ: 'Virksomhedsøkonomi',
    EØ: 'Erhvervsøkonomi', AS: 'Astronomi', BIO: 'Biologi', MAT: 'Matematik', KS: 'Kultur og samfundsfag', SRP: 'SRP', SRO: 'SRO', DHO: 'DHO'
  };
  function subjectFrom(hold, title) {
    if (!hold) return null;
    const first = hold.split(',')[0].trim();
    const parts = first.split(/\s+/);
    const code = (parts.length > 1 ? parts[parts.length - 1] : parts[0]).toUpperCase();
    if (SUBJECTS[code]) return { code, name: SUBJECTS[code] };
    if (/^[A-ZÆØÅ]{1,4}\d?$/.test(code)) return { code, name: code };
    return null;
  }
  function hueFor(str) {
    if (!str) return 230;
    let h = 0;
    for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const palette = [230, 262, 292, 330, 352, 18, 36, 152, 172, 196, 210, 120];
    return palette[h % palette.length];
  }
  const shortTeacher = (t) => (t || '').replace(/[^,]*\(([^)]+)\)/g, '$1').trim();

  function cleanText(el) {
    if (!el) return '';
    const c = el.cloneNode(true);
    c.querySelectorAll('[class*="material"], .ls-fonticon, .ls-icon, img, script, style').forEach((x) => { if (x.tagName === 'IMG' || x.textContent.trim().length < 25) x.remove(); });
    return c.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
      .replace(/^(?:sms|bookmark|chat|description|attach_file|mail|check_circle|schedule|event)+/i, '').trim();
  }

  /* ---------------- hentning, kø og cache ---------------- */
  // Lectio behandler kun én forespørgsel ad gangen pr. bruger. Derfor hentes alt i en kø
  // og gemmes i sessionStorage, så sider vises med det samme fra cache.
  const memo = {};
  const INITIAL = (location.pathname.slice(BASE.length) + location.search).toLowerCase();
  const pageCtrl = new AbortController();
  addEventListener('pagehide', () => pageCtrl.abort());
  let queue = Promise.resolve();
  function fetchDoc(path) {
    if (path.toLowerCase() === INITIAL) return Promise.resolve(document);
    if (!memo[path]) {
      const run = () => {
        if (pageCtrl.signal.aborted) throw new Error('afbrudt');
        return fetch(BASE + path, { credentials: 'include', signal: pageCtrl.signal })
          .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
          .then((t) => new DOMParser().parseFromString(t, 'text/html'));
      };
      const p = queue.then(run, run);
      queue = p.catch(() => {});
      memo[path] = p.catch((e) => { delete memo[path]; throw e; });
    }
    return memo[path];
  }
  const idle = (fn, timeout = 2000) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 300));

  const CACHE_KEY = 'lp-cache:' + SCHOOL;
  const ISO_RE = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/;
  let cache = {};
  try { cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}', (k, v) => (typeof v === 'string' && ISO_RE.test(v) ? new Date(v) : v)) || {}; } catch (e) { cache = {}; }
  let cacheTimer = null;
  function saveCache() {
    clearTimeout(cacheTimer);
    cacheTimer = setTimeout(() => {
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
      catch (e) { Object.keys(cache).filter((k) => k.startsWith('act:')).forEach((k) => delete cache[k]); try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e2) { /* fuld */ } }
    }, 60);
  }
  function cachePut(key, data) {
    cache[key] = { t: Date.now(), d: data };
    if (key.startsWith('act:')) {
      const acts = Object.keys(cache).filter((k) => k.startsWith('act:')).sort((a, b) => cache[a].t - cache[b].t);
      while (acts.length > 40) delete cache[acts.shift()];
    }
    saveCache();
    if (/^(msgs|tasks|hw)$/.test(key) && typeof updateBadges === 'function') updateBadges();
    if (key === 'front' && typeof renderHoldGroup === 'function') renderHoldGroup();
  }
  const isFresh = (key, min) => cache[key] && Date.now() - cache[key].t < min * 6e4;

  const TTL = { skema: 10, hw: 10, tasks: 10, msgs: 3, abs: 60, grades: 60, front: 30 }; // minutter
  const SOURCES = {
    hw: { path: 'material_lektieoversigt.aspx', parse: (d) => parseHomework(d) },
    tasks: { path: 'OpgaverElev.aspx', parse: (d) => parseAssignments(d) },
    msgs: { path: 'beskeder2.aspx', parse: (d) => parseMessages(d) },
    abs: { path: 'subnav/fravaerelev.aspx', parse: (d) => parseAbsence(d) },
    grades: { path: 'grades/grade_report.aspx', parse: (d) => parseGrades(d) },
    front: { path: 'forside.aspx', parse: (d) => parseFront(d) }
  };
  // Viser cachede data med det samme og henter kun nyt hvis de er for gamle.
  function load(key, fetcher, ttlMin, onData, onError) {
    const c = cache[key];
    if (c) { try { onData(c.d, true); } catch (e) { console.warn('[Lectio+]', e); } }
    if (c && Date.now() - c.t < ttlMin * 6e4) return;
    fetcher().then((d) => { cachePut(key, d); onData(d, false); })
      .catch((e) => { if (!c && onError && !pageCtrl.signal.aborted) onError(e); });
  }
  const loadSrc = (key, onData, onError) => load(key, () => fetchDoc(SOURCES[key].path).then(SOURCES[key].parse), TTL[key], onData, onError);
  const skemaKey = (d) => 'skema:' + weekParam(d);
  const loadWeek = (d, onData, onError) => load(skemaKey(d), () => fetchDoc('SkemaNy.aspx?week=' + weekParam(d)).then((doc) => {
    const s = parseSkema(doc); if (!s) throw new Error('Skemaet kunne ikke læses'); return s;
  }), TTL.skema, onData, onError);

  /* sikker kopi af Lectio-indhold: kun tekst, links, lister og billeder */
  const KEEP = new Set(['A', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'SPAN', 'P', 'DIV', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'ARTICLE', 'SECTION', 'HR', 'IMG', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'BLOCKQUOTE', 'PRE', 'CODE', 'SUP', 'SUB']);
  const DROP = /^(SCRIPT|STYLE|LINK|META|INPUT|TEXTAREA|SELECT|BUTTON|IFRAME|OBJECT|EMBED|NOSCRIPT|TEMPLATE|MENUTEMPLATE|DIALOG|FORM|SVG)$/;
  function safeHtml(src, base) {
    const tpl = document.createElement('template');
    const walk = (node, parent) => {
      for (const ch of node.childNodes) {
        if (ch.nodeType === 3) { parent.appendChild(document.createTextNode(ch.textContent)); continue; }
        if (ch.nodeType !== 1 || DROP.test(ch.tagName)) continue;
        if (ch.matches('[class*="fonticon"], .lf-excel-exclude, .OnlyMobile, .ls-hidden-bigscreen')) continue;
        const tag = ch.tagName;
        if (!KEEP.has(tag)) { walk(ch, parent); continue; }
        let el;
        if (/^H\d$/.test(tag)) {
          if (ch.classList.contains('ls-paper-section-heading')) { el = document.createElement('h4'); el.className = 'lp-c-head'; }
          else if (ch.closest('article')) { el = document.createElement('p'); el.className = 'lp-c-file'; }
          else el = document.createElement('h5');
        } else el = document.createElement(tag.toLowerCase());
        if (tag === 'A') {
          const h = ch.getAttribute('href');
          let u = null;
          try { if (h && h !== '#' && !/^\s*javascript:/i.test(h)) u = new URL(h, base); } catch (e) { u = null; }
          if (u) { el.href = u.href; if (u.host !== location.host) { el.target = '_blank'; el.rel = 'noopener'; } }
        }
        if (tag === 'IMG') {
          const s = ch.getAttribute('src');
          try { if (!s) continue; el.src = new URL(s, base).href; } catch (e) { continue; }
          el.alt = ch.getAttribute('alt') || ''; el.loading = 'lazy';
        }
        if ((tag === 'TD' || tag === 'TH') && ch.getAttribute('colspan')) el.colSpan = +ch.getAttribute('colspan') || 1;
        if (ch.getAttribute('title')) el.title = ch.getAttribute('title');
        parent.appendChild(el);
        walk(ch, el);
      }
    };
    walk(src, tpl.content);
    return tpl.innerHTML;
  }

  /* ---------------- parsere ---------------- */
  function parseTip(t) {
    const o = { title: '', hold: '', teacher: '', room: '', homework: '', other: '', note: '', status: null, start: null, end: null, allDay: false };
    const pre = [];
    const secs = { homework: [], other: [], note: [] };
    let sec = null;
    let dated = false;
    for (const line of (t || '').split('\n')) {
      const l = line.trim();
      if (!dated) {
        const dm = l.match(/^(\d{1,2})\/(\d{1,2})-(\d{4})\s+(?:(\d{1,2}):(\d{2})\s+til\s+(?:(\d{1,2})\/(\d{1,2})-(\d{4})\s+)?(\d{1,2}):(\d{2})|Hele dagen)/);
        if (dm) {
          dated = true;
          const D = new Date(+dm[3], +dm[2] - 1, +dm[1]);
          if (dm[4]) {
            o.start = new Date(D); o.start.setHours(+dm[4], +dm[5]);
            o.end = dm[6] ? new Date(+dm[8], +dm[7] - 1, +dm[6]) : new Date(D);
            o.end.setHours(+dm[9], +dm[10]);
          } else { o.allDay = true; o.start = D; o.end = new Date(D); o.end.setHours(23, 59); }
          continue;
        }
        if (/^Ændret!?$/i.test(l)) { o.status = 'changed'; continue; }
        if (/^Aflyst!?$/i.test(l)) { o.status = 'cancelled'; continue; }
        if (l) pre.push(l);
        continue;
      }
      let mm;
      if ((mm = l.match(/^Hold:\s*(.*)/))) { o.hold = mm[1]; sec = null; continue; }
      if ((mm = l.match(/^Lærere?:\s*(.*)/))) { o.teacher = mm[1]; sec = null; continue; }
      if ((mm = l.match(/^Lokaler?:\s*(.*)/))) { o.room = mm[1]; sec = null; continue; }
      if ((mm = l.match(/^Elever?:\s*(.*)/))) { sec = null; continue; }
      if (/^Lektier:$/.test(l)) { sec = 'homework'; continue; }
      if (/^Øvrigt indhold:$/.test(l)) { sec = 'other'; continue; }
      if (/^Note:$/.test(l)) { sec = 'note'; continue; }
      if (sec) secs[sec].push(line.replace(/\s+$/, ''));
    }
    o.title = pre.join(' ');
    for (const k in secs) o[k] = secs[k].join('\n').trim();
    o.subject = subjectFrom(o.hold, o.title);
    return o;
  }

  function parseSkema(doc) {
    const table = doc.querySelector('table.s2skema');
    if (!table) return null;
    const wk = (doc.querySelector('.s2weekHeader')?.textContent || '').match(/Uge\s+(\d+)\D+(\d{4})/);
    const weekNo = wk ? +wk[1] : null;
    const year = wk ? +wk[2] : new Date().getFullYear();
    const headerRow = table.querySelector('tr.s2dayHeader');
    const dayCells = headerRow ? [...headerRow.cells].slice(1) : [];
    const days = dayCells.map((td) => {
      const t = td.textContent.trim();
      const mm = t.match(/(\S+)\s*\((\d{1,2})\/(\d{1,2})\)/);
      if (!mm) return { name: t, date: null };
      let y = year;
      if (weekNo <= 1 && +mm[3] === 12) y--;
      if (weekNo >= 52 && +mm[3] === 1) y++;
      return { name: mm[1], date: new Date(y, +mm[3] - 1, +mm[2]) };
    });
    const modules = [...doc.querySelectorAll('.s2module-info')].map((x) => {
      const mm = x.textContent.match(/(\d+)\.\s*modul\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      return mm ? { n: +mm[1], start: mm[2], end: mm[3] } : null;
    }).filter(Boolean);
    const lessons = [];
    table.querySelectorAll('a.s2skemabrik').forEach((a) => {
      const td = a.closest('td');
      const tr = td && td.parentElement;
      const info = parseTip(a.getAttribute('data-tooltip') || '');
      const day = Math.max(0, (td ? td.cellIndex : 1) - 1);
      lessons.push({
        ...info,
        day,
        allDay: info.allDay || (tr && tr.rowIndex === 2) || !info.start,
        href: abs(a.getAttribute('href')),
        changed: a.classList.contains('s2changed') || info.status === 'changed',
        cancelled: a.classList.contains('s2cancelled') || info.status === 'cancelled'
      });
    });
    lessons.forEach((l) => { if (!l.start && days[l.day]?.date) { l.start = days[l.day].date; } });
    lessons.sort((a, b) => (a.start || 0) - (b.start || 0));
    return { week: weekNo, year, days, lessons, modules };
  }

  function parseAssignments(doc) {
    const t = doc.querySelector('#s_m_Content_Content_ExerciseGV');
    if (!t) return [];
    return [...t.rows].slice(1).filter((r) => r.cells.length > 6).map((r) => {
      const c = r.cells;
      const fm = c[3].textContent.trim().match(/(\d{1,2})\/(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/);
      const due = fm ? new Date(+fm[3], +fm[2] - 1, +fm[1], +fm[4], +fm[5]) : null;
      return {
        week: c[0].textContent.trim(),
        hold: c[1].textContent.trim(),
        title: cleanText(c[2]),
        href: abs(c[2].querySelector('a')?.getAttribute('href')),
        due,
        hours: c[4].textContent.trim(),
        status: c[5].textContent.trim(),
        absence: c[6].textContent.trim(),
        waiting: c[7].textContent.trim(),
        grade: c[9] ? c[9].textContent.trim() : '',
        subject: subjectFrom(c[1].textContent.trim())
      };
    });
  }

  function parseHomework(doc) {
    const t = doc.querySelector('#s_m_Content_Content_MaterialLektieOverblikGV');
    if (!t) return [];
    const now = new Date();
    return [...t.rows].slice(1).filter((r) => r.cells.length >= 3).map((r) => {
      const c = r.cells;
      const dateTxt = c[0].textContent.trim();
      const dm = dateTxt.match(/(\d{1,2})\/(\d{1,2})/);
      let date = null;
      if (dm) {
        date = new Date(now.getFullYear(), +dm[2] - 1, +dm[1]);
        if (date < new Date(now.getFullYear(), now.getMonth() - 6, 1)) date.setFullYear(now.getFullYear() + 1);
      }
      const activity = cleanText(c[1]);
      const holdMatch = activity.match(/modul\s*-\s*([^•]+)•/) || activity.match(/^([^•]+)•/);
      return {
        dateTxt, date, activity,
        href: abs(c[1].querySelector('a')?.getAttribute('href')),
        text: (() => {
          const cl = c[2].cloneNode(true);
          cl.querySelectorAll('[class*="fonticon"], script, style').forEach((n) => n.remove());
          cl.querySelectorAll('br').forEach((n) => n.replaceWith('\n'));
          cl.querySelectorAll('div, p, li').forEach((n) => n.prepend('\n'));
          return cl.textContent.replace(/[ \t\u00a0]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
        })(),
        subject: subjectFrom(holdMatch ? holdMatch[1].trim() : '')
      };
    });
  }

  function parseMessages(doc) {
    const t = doc.querySelector('#s_m_Content_Content_threadGV_ctl00') || doc.querySelector('table[id*="threadGV"]');
    if (!t) return [];
    return [...t.rows].slice(1).filter((r) => r.cells.length > 7).map((r) => {
      const c = r.cells;
      const readImg = r.querySelector('[id$="readId"]');
      const src = readImg ? readImg.getAttribute('src') || '' : '';
      const oc = c[3].querySelector('[onclick]')?.getAttribute('onclick') || '';
      const mid = (oc.match(/_(\d{6,})'/) || [])[1];
      const link = c[3].querySelector('a');
      return {
        subject: cleanText(c[3]),
        from: cleanText(c[4]),
        first: cleanText(c[5]),
        to: cleanText(c[6]),
        changed: cleanText(c[7]),
        unread: !!src && !/\/mread\.gif/i.test(src),
        flagged: /flag/i.test((r.querySelector('[id$="flagId"]')?.getAttribute('src')) || '') && !/noflag|flagoff|flag_off/i.test(r.querySelector('[id$="flagId"]')?.getAttribute('src') || ''),
        href: mid ? `${BASE}beskeder2.aspx?type=visbesked&id=${mid}` : abs(link && link.getAttribute('href'))
      };
    });
  }

  function parseAbsence(doc) {
    const t = doc.querySelector('table[id$="SFTabStudentAbsenceDataTable"]');
    if (!t) return null;
    const rows = [];
    let total = null;
    [...t.rows].forEach((r) => {
      const c = [...r.cells].map((x) => x.textContent.trim());
      if (c.length < 5 || !/\d/.test(c.join(''))) return;
      if (!/%/.test(c[2] || '')) return;
      const frac = (c[1] || '').match(/([\d,]+)\s*\/\s*([\d,]+)/);
      const frac2 = (c[3] || '').match(/([\d,]+)\s*\/\s*([\d,]+)/);
      const row = {
        hold: c[0],
        mods: frac ? [num(frac[1]), num(frac[2])] : null,
        pct: num(c[2]),
        wTime: frac2 ? [num(frac2[1]), num(frac2[2])] : null,
        wPct: num(c[4])
      };
      if (/samlet|i alt|total/i.test(c[0])) total = row; else rows.push(row);
    });
    if (!total) {
      const sum = (k) => rows.reduce((a, r) => (r[k] ? [a[0] + r[k][0], a[1] + r[k][1]] : a), [0, 0]);
      const m1 = sum('mods'); const m2 = sum('wTime');
      total = { hold: 'Samlet', pct: m1[1] ? (m1[0] / m1[1]) * 100 : 0, wPct: m2[1] ? (m2[0] / m2[1]) * 100 : 0, mods: m1, wTime: m2 };
    }
    rows.sort((a, b) => (b.pct || 0) - (a.pct || 0));
    return { rows, total };
  }

  function parseGrades(doc) {
    const t = [...doc.querySelectorAll('table')].find((x) => x.rows.length > 1 && /Årskarakter/.test(x.rows[0].textContent) && /Fag/.test(x.rows[0].textContent));
    if (!t) return [];
    return [...t.rows].slice(2).filter((r) => r.cells.length >= 7).map((r) => {
      const c = [...r.cells].map((x) => x.textContent.trim().split('\n')[0].trim());
      return { subject: c[0], weight: num(c[1]), grade: c[2], ects: c[3], examWeight: num(c[4]), exam: c[5], examEcts: c[6] };
    });
  }

  /* ---------------- ikoner ---------------- */
  const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICONS = {
    home: I('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
    cal: I('<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
    book: I('<path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2Z"/><path d="M4 19.5A2 2 0 0 0 6 21.5h13"/>'),
    task: I('<rect x="4" y="3.5" width="16" height="18" rx="2.5"/><path d="M9 3.5V2.5h6v1M8.5 12l2.2 2.2L15.5 9.5"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>'),
    absence: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    star: I('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>'),
    plan: I('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>'),
    doc: I('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    books: I('<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="m16 5 3.5-1 2.5 15.5-3.5 1Z"/>'),
    survey: I('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>'),
    card: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14 10h4M14 13h3"/>'),
    user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    out: I('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17 5 12l5-5M5 12h11"/>'),
    search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    left: I('<path d="m15 18-6-6 6-6"/>'),
    right: I('<path d="m9 18 6-6-6-6"/>'),
    moon: I('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>'),
    sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    menu: I('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    x: I('<path d="M6 6l12 12M18 6 6 18"/>'),
    pin: I('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    ext: I('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    layers: I('<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>')
  };

  /* ---------------- navigation ---------------- */
  const NAV_MAIN = [
    { key: 'forside', label: 'Overblik', icon: 'home', path: 'forside.aspx', words: 'forside hjem dashboard' },
    { key: 'skema', label: 'Skema', icon: 'cal', path: 'SkemaNy.aspx', words: 'skema uge timer moduler' },
    { key: 'lektier', label: 'Lektier', icon: 'book', path: 'material_lektieoversigt.aspx', words: 'lektier' },
    { key: 'opgaver', label: 'Opgaver', icon: 'task', path: 'OpgaverElev.aspx', words: 'opgaver afleveringer frister' },
    { key: 'beskeder', label: 'Beskeder', icon: 'mail', path: 'beskeder2.aspx', words: 'beskeder indbakke mail' },
    { key: 'fravaer', label: 'Fravær', icon: 'absence', path: 'subnav/fravaerelev.aspx', words: 'fravær fravaer procent' },
    { key: 'karakterer', label: 'Karakterer', icon: 'star', path: 'grades/grade_report.aspx', words: 'karakterer karakter snit' }
  ];
  const NAV_SECOND = [
    { key: 'studieplan', label: 'Studieplan', icon: 'plan', path: 'studieplan.aspx?displaytype=ugeteksttabel', words: 'studieplan forløb kalender' },
    { key: 'dokumenter', label: 'Dokumenter', icon: 'doc', path: 'DokumentOversigt.aspx', words: 'dokumenter filer' }
  ];
  const NAV_MORE = [
    { group: 'Skema og kalender', items: [
      { key: 'dagsaendringer', label: 'Dagsændringer', path: 'SkemaDagsaendringer.aspx', words: 'ændringer aflyst i dag' },
      { key: 'ugeaendringer', label: 'Ugeændringer', path: 'SkemaUgeaendringer.aspx', words: 'ændringer uge' },
      { key: 'kalender', label: 'Månedskalender', path: 'kalender.aspx', words: 'kalender måned begivenheder' },
      { key: 'findskema', label: 'Find skema', path: 'FindSkema.aspx?type=laerer', words: 'find skema lærer lokale klasse elev' }
    ] },
    { group: 'Studie', items: [
      { key: 'uvb', label: 'Undervisningsbeskrivelse', path: 'studieplan/undervisningsbeskrivelse.aspx', words: 'undervisningsbeskrivelse forløb' },
      { key: 'kontaktbog', label: 'Kontaktbøger', path: 'teacherstudybook.aspx?type=contactbooks', words: 'kontaktbog' },
      { key: 'studieretning', label: 'Studieretning', path: 'studieretningElevValg.aspx', words: 'studieretning' },
      { key: 'valgfag', label: 'Valgfag', path: 'studieretningValgfag.aspx', words: 'valgfag ønsker' },
      { key: 'fagvalg', label: 'Fagvalg', path: 'fagvalg/fagvalgoversigt.aspx', words: 'fagvalg' },
      { key: 'karakterblad', label: 'Karaktermeddelelse', path: 'grades/grade_karakterblad.aspx', words: 'karaktermeddelelse karakterblad' },
      { key: 'fravaersaarsager', label: 'Fraværsårsager', path: 'subnav/fravaerelev_fravaersaarsager.aspx', words: 'fraværsårsager årsag' }
    ] },
    { group: 'Dig', items: [
      { key: 'boger', label: 'Bøger', path: 'BD/UserReservations.aspx', words: 'bøger boger lån' },
      { key: 'sporgeskema', label: 'Spørgeskemaer', path: 'spoergeskema/spoergeskema_rapport.aspx', words: 'spørgeskema' },
      { key: 'sps', label: 'SPS', path: 'Elev_SPS.aspx', words: 'sps støtte' },
      { key: 'studiekort', label: 'Studiekort', path: 'digitaltStudiekort.aspx', words: 'studiekort id' },
      { key: 'profil', label: 'Profil', path: 'indstillinger/studentIndstillinger.aspx', words: 'profil indstillinger' },
      { key: 'betalinger', label: 'Betalinger', path: 'MinButik.aspx', words: 'betalinger butik' },
      { key: 'adgangslog', label: 'Log', path: 'indstillinger/AdgangIndstillinger.aspx', words: 'log adgang login' }
    ] },
    { group: 'Lectio', items: [
      { key: 'hovedmenu', label: 'Hovedmenu', path: 'default.aspx', words: 'hovedmenu alt menu' },
      { key: 'kontakt', label: 'Kontakt', path: 'default.aspx?menu=kontakt', words: 'kontakt skolen' },
      { key: 'hjaelp', label: 'Hjælp', path: 'help/mainhelp.aspx', words: 'hjælp help' }
    ] }
  ];
  const PAL_ONLY = [
    { label: 'Find skema for elev', path: 'FindSkema.aspx?type=elev', words: 'find elev skema' },
    { label: 'Find skema for lærer', path: 'FindSkema.aspx?type=laerer', words: 'find lærer skema' },
    { label: 'Find skema for klasse', path: 'FindSkema.aspx?type=stamklasse', words: 'find klasse skema' },
    { label: 'Find skema for lokale', path: 'FindSkema.aspx?type=lokale', words: 'find lokale rum skema' },
    { label: 'Find skema for hold', path: 'FindSkema.aspx?type=hold', words: 'find hold skema' },
    { label: 'Find skema for ressource', path: 'FindSkema.aspx?type=ressource', words: 'find ressource skema' },
    { label: 'Avanceret skema', path: 'FindSkemaAdv.aspx', words: 'avanceret skema' },
    { label: 'Undervisningsbeskrivelser for skolen', path: 'studieplan/uvb_list_off.aspx', words: 'undervisningsbeskrivelser' }
  ];
  const MORE_ITEMS = NAV_MORE.flatMap((g) => g.items);
  const pathOnly = (p) => p.split('?')[0].toLowerCase();
  function activeKey() {
    const p = PAGE;
    const exact = NAV_MAIN.concat(NAV_SECOND, MORE_ITEMS).find((n) => pathOnly(n.path) === p && (!n.path.includes('?') || n.key === 'studieplan' || location.search.toLowerCase().includes(n.path.split('?')[1].toLowerCase())));
    if (exact) return exact.key;
    if (p.startsWith('forside')) return 'forside';
    if (p.startsWith('skemany') || p.startsWith('skema/') || p.startsWith('aktivitet/')) return 'skema';
    if (p.startsWith('findskema')) return 'findskema';
    if (p.startsWith('material_lektie')) return 'lektier';
    if (p.startsWith('opgave') || p.startsWith('elevaflevering') || p.startsWith('elev_aflevering')) return 'opgaver';
    if (p.startsWith('beskeder')) return 'beskeder';
    if (p.startsWith('subnav/fravaer')) return 'fravaer';
    if (p.startsWith('grades')) return 'karakterer';
    if (p.startsWith('studieplan') || p.startsWith('studieretning') || p.startsWith('fagvalg')) return 'studieplan';
    if (p.startsWith('dokument')) return 'dokumenter';
    if (p.startsWith('bd/')) return 'boger';
    if (p.startsWith('spoergeskema')) return 'sporgeskema';
    if (p.startsWith('indstillinger')) return 'profil';
    return null;
  }

  const TITLE_RE = /^(?:Eleven|Læreren)\s+(.+?)(?:,\s*([^\s,]+)|\s\(([^)]*)\))\s+-\s+(.+)$/s;
  let USER = null;
  {
    const m = document.title.match(TITLE_RE);
    if (m) USER = { name: m[1].trim(), cls: (m[2] || (m[3] || '').split(/\s+/)[0] || '').trim() };
    try {
      if (USER) sessionStorage.setItem('lp-user:' + SCHOOL, JSON.stringify(USER));
      else USER = JSON.parse(sessionStorage.getItem('lp-user:' + SCHOOL) || 'null');
    } catch (e) { /* ignorer */ }
    USER = USER || { name: '', cls: '' };
    USER.first = USER.name.split(' ')[0];
    if (USER.name && cache.__user && cache.__user !== USER.name) cache = {};
    if (USER.name) cache.__user = USER.name;
  }
  const schoolName = (document.title.split(' - ').pop() || 'Lectio').trim();

  /* ---------------- tema ---------------- */
  let settings = DEFAULTS;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    const t = settings.theme === 'auto' ? (mq.matches ? 'dark' : 'light') : settings.theme;
    document.documentElement.setAttribute('data-lp-theme', t);
    if (t === 'dark' && typeof darkFix === 'function' && document.documentElement.classList.contains('lp-on')) setTimeout(darkFix, 0);
  }
  mq.addEventListener?.('change', applyTheme);

  /* ---------------- sidebar ---------------- */
  const sideOpen = (() => { try { return JSON.parse(localStorage.getItem('lp-side-open') || '{}'); } catch (e) { return {}; } })();
  function rememberOpen(id, open) { sideOpen[id] = open; try { localStorage.setItem('lp-side-open', JSON.stringify(sideOpen)); } catch (e) { /* ignorer */ } }
  function buildSidebar() {
    const ak = activeKey();
    const item = (n) => `<a class="lp-nav-item${n.key === ak ? ' is-active' : ''}" href="${BASE + n.path}" data-key="${n.key}"${n.key === ak ? ' aria-current="page"' : ''}>${ICONS[n.icon]}<span>${esc(n.label)}</span><b class="lp-badge" data-badge="${n.key}" hidden></b></a>`;
    const moreActive = MORE_ITEMS.some((n) => n.key === ak);
    const more = NAV_MORE.map((g) => `<p class="lp-more-group">${esc(g.group)}</p>${g.items.map((n) => `<a class="lp-more-item${n.key === ak ? ' is-active' : ''}" href="${BASE + n.path}" title="${esc(n.label)}"${n.key === ak ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}`).join('');
    const side = document.createElement('aside');
    side.id = 'lp-side';
    side.innerHTML = `
      <div class="lp-brand">
        <div class="lp-brand-txt"><strong>Lectio<span>+</span></strong><small>${esc(schoolName)}</small></div>
      </div>
      <button class="lp-search-btn" type="button">${ICONS.search}<span>Søg</span><kbd>Ctrl K</kbd></button>
      <nav class="lp-nav" aria-label="Lectio">
        ${NAV_MAIN.map(item).join('')}
        <div class="lp-nav-sep"></div>
        ${NAV_SECOND.map(item).join('')}
        <details class="lp-more" data-id="hold" hidden><summary>${ICONS.layers}<span>Mine hold</span></summary><div class="lp-more-list" id="lp-hold-list"></div></details>
        <details class="lp-more" data-id="more"${moreActive || sideOpen.more ? ' open' : ''}><summary>${ICONS.menu}<span>Mere</span></summary><div class="lp-more-list">${more}</div></details>
      </nav>
      <div class="lp-side-foot">
        <div class="lp-me"><div><strong>${esc(USER.name || 'Lectio')}</strong><small>${esc(USER.cls)}</small></div></div>
        <div class="lp-foot-actions">
          <button type="button" class="lp-icon-btn" data-act="theme" title="Skift tema" aria-label="Skift tema">${ICONS.moon}</button>
          <button type="button" class="lp-icon-btn" data-act="original" title="Vis Lectios egen visning" aria-label="Vis Lectios egen visning">${ICONS.layers}</button>
          <a class="lp-icon-btn" href="${esc(logoutLink.getAttribute('href'))}" title="Log ud" aria-label="Log ud">${ICONS.out}</a>
        </div>
      </div>`;
    document.body.appendChild(side);

    const top = document.createElement('div');
    top.id = 'lp-topbar';
    top.innerHTML = `<button type="button" class="lp-icon-btn" data-act="menu" aria-label="Menu">${ICONS.menu}</button><strong>Lectio<span>+</span></strong><button type="button" class="lp-icon-btn" data-act="search" aria-label="Søg">${ICONS.search}</button>`;
    document.body.appendChild(top);

    const scrim = document.createElement('div');
    scrim.id = 'lp-scrim';
    document.body.appendChild(scrim);

    side.querySelector('.lp-search-btn').addEventListener('click', openPalette);
    top.querySelector('[data-act=search]').addEventListener('click', openPalette);
    top.querySelector('[data-act=menu]').addEventListener('click', () => document.documentElement.classList.toggle('lp-menu-open'));
    scrim.addEventListener('click', () => document.documentElement.classList.remove('lp-menu-open'));
    side.querySelectorAll('details.lp-more').forEach((d) => d.addEventListener('toggle', () => rememberOpen(d.dataset.id, d.open)));
    side.querySelector('[data-act=theme]').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-lp-theme');
      settings.theme = cur === 'dark' ? 'light' : 'dark';
      saveSetting('theme', settings.theme);
      saveBoot();
      applyTheme();
    });
    side.querySelector('[data-act=original]').addEventListener('click', () => {
      sessionStorage.setItem('lp-original', '1');
      location.reload();
    });
    renderHoldGroup();
    updateBadges();
  }
  function renderHoldGroup() {
    const box = document.getElementById('lp-hold-list');
    const hold = cache.front?.d?.hold || [];
    if (!box || !hold.length) return;
    const here = location.href.split('#')[0];
    box.innerHTML = hold.map((h) => `<a class="lp-more-item${h.href === here ? ' is-active' : ''}" href="${esc(h.href)}">${subjDot(subjectFrom(h.name)?.code || h.name)}${esc(h.name)}</a>`).join('');
    const det = box.closest('details');
    det.hidden = false;
    if (sideOpen.hold || hold.some((h) => h.href === here)) det.open = true;
  }
  function setBadge(key, n) {
    const b = document.querySelector(`[data-badge="${key}"]`);
    if (!b) return;
    if (n > 0) { b.textContent = n > 99 ? '99+' : n; b.hidden = false; } else b.hidden = true;
  }
  function updateBadges() {
    const now = new Date();
    const today = startOfDay(now);
    if (cache.msgs) setBadge('beskeder', cache.msgs.d.filter((x) => x.unread).length);
    if (cache.tasks) setBadge('opgaver', cache.tasks.d.filter((t) => !/afleveret/i.test(t.status) && t.due && ((t.due > now && (t.due - now) / 864e5 < 7) || (t.due < now && /mangler/i.test(t.status)))).length);
    if (cache.hw) setBadge('lektier', cache.hw.d.filter((x) => x.date && x.date >= today && (x.date - today) / 864e5 <= 1).length);
  }

  /* ---------------- søgning (Ctrl+K) ---------------- */
  let paletteItems = [];
  function paletteData() {
    const out = [];
    const now = new Date();
    const page = (n, icon) => ({ group: 'Sider', label: n.label, sub: '', icon: n.icon || icon, href: BASE + n.path, words: n.words });
    NAV_MAIN.concat(NAV_SECOND).forEach((n) => out.push(page(n)));
    MORE_ITEMS.forEach((n) => out.push(page(n, 'right')));
    PAL_ONLY.forEach((n) => out.push(page(n, 'search')));
    (cache.front?.d?.hold || []).forEach((h) => out.push({ group: 'Hold', label: h.name, sub: subjectFrom(h.name)?.name || '', icon: 'layers', href: h.href, words: 'hold' }));
    const wk = cache[skemaKey(now)]?.d;
    if (wk) wk.lessons.forEach((l) => out.push({ group: 'Skema denne uge', label: l.subject?.name || l.title || 'Aktivitet', sub: `${l.start ? dayLabel(l.start, now) + (l.allDay ? '' : ' ' + hm(l.start)) : ''} ${l.room || ''}`.trim(), icon: 'cal', href: l.href || BASE + 'SkemaNy.aspx', words: `${l.hold} ${l.teacher} ${l.title}`, lesson: l, list: wk.lessons }));
    (cache.tasks?.d || []).forEach((t) => out.push({ group: 'Opgaver', label: t.title, sub: `${t.subject?.name || t.hold}, ${t.status.toLowerCase()}`, icon: 'task', href: t.href || BASE + 'OpgaverElev.aspx', words: t.hold }));
    (cache.hw?.d || []).forEach((x) => out.push({ group: 'Lektier', label: x.text.split('\n')[0].slice(0, 90), sub: `${x.dateTxt} ${x.subject?.name || ''}`, icon: 'book', href: x.href || BASE + 'material_lektieoversigt.aspx', words: x.text }));
    (cache.msgs?.d || []).forEach((x) => out.push({ group: 'Beskeder', label: x.subject, sub: x.from, icon: 'mail', href: x.href || BASE + 'beskeder2.aspx' }));
    return out;
  }
  function openPalette() {
    document.documentElement.classList.remove('lp-menu-open');
    let pal = document.getElementById('lp-palette');
    if (!pal) {
      pal = document.createElement('div');
      pal.id = 'lp-palette';
      pal.innerHTML = `<div class="lp-pal-box" role="dialog" aria-label="Søg i Lectio">
        <div class="lp-pal-in">${ICONS.search}<input type="text" placeholder="Søg efter side, hold, fag, opgave eller lektie" autocomplete="off" spellcheck="false" aria-label="Søg"><kbd>Esc</kbd></div>
        <div class="lp-pal-list" role="listbox"></div></div>`;
      document.body.appendChild(pal);
      pal.addEventListener('mousedown', (e) => { if (e.target === pal) closePalette(); });
      const input = pal.querySelector('input');
      input.addEventListener('input', () => renderPalette(input.value));
      input.addEventListener('keydown', (e) => {
        const items = [...pal.querySelectorAll('.lp-pal-item')];
        let i = items.findIndex((x) => x.classList.contains('is-sel'));
        if (e.key === 'ArrowDown') { e.preventDefault(); i = Math.min(items.length - 1, i + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); i = Math.max(0, i - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); items[i]?.click(); return; }
        else if (e.key === 'Escape') { closePalette(); return; }
        else return;
        items.forEach((x, j) => x.classList.toggle('is-sel', j === i));
        items[i]?.scrollIntoView({ block: 'nearest' });
      });
      pal.querySelector('.lp-pal-list').addEventListener('click', (e) => {
        const a = e.target.closest('.lp-pal-item');
        if (!a) return;
        const it = paletteItems[+a.dataset.i];
        if (it && it.lesson && !(e.ctrlKey || e.metaKey)) { e.preventDefault(); closePalette(); openLesson(it.lesson, it.list); }
      });
    }
    pal.classList.add('is-open');
    const input = pal.querySelector('input');
    input.value = '';
    renderPalette('');
    input.focus();
  }
  function closePalette() { document.getElementById('lp-palette')?.classList.remove('is-open'); }
  function renderPalette(q) {
    const pal = document.getElementById('lp-palette');
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const all = paletteData();
    paletteItems = (terms.length ? all.filter((it) => {
      const hay = `${it.label} ${it.sub} ${it.words || ''} ${it.group}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }) : all.filter((it) => it.group === 'Sider').slice(0, 9)).slice(0, 40);
    let lastGroup = null;
    pal.querySelector('.lp-pal-list').innerHTML = paletteItems.length ? paletteItems.map((it, i) => {
      const g = it.group !== lastGroup ? `<div class="lp-pal-group">${esc(it.group)}</div>` : '';
      lastGroup = it.group;
      return `${g}<a class="lp-pal-item${i === 0 ? ' is-sel' : ''}" role="option" data-i="${i}" href="${esc(it.href)}">${ICONS[it.icon] || ICONS.right}<span>${esc(it.label)}</span><small>${esc(it.sub)}</small></a>`;
    }).join('') : '<div class="lp-empty">Ingen resultater. Prøv et andet ord.</div>';
  }
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '') || document.activeElement?.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); openPalette(); }
    else if (k === '/' && !typing) { e.preventDefault(); openPalette(); }
    else if (k === 'escape') { closePalette(); closeModal(); }
    else if (drawerState && !typing && !e.altKey && !e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); stepLesson(e.key === 'ArrowLeft' ? -1 : 1); }
  });

  /* ---------------- lektionsvisning ---------------- */
  let drawerState = null;
  let drawerReturn = null;
  function closeModal() {
    if (!document.getElementById('lp-drawer')) return;
    document.getElementById('lp-drawer').remove();
    drawerState = null;
    document.documentElement.classList.remove('lp-drawer-open');
    if (drawerReturn && drawerReturn.isConnected) drawerReturn.focus();
  }
  function openLesson(l, list) {
    if (!l) return;
    if (!drawerState) drawerReturn = document.activeElement;
    const seq = (list && list.length ? list : [l]).filter((x) => x && x.start).slice()
      .sort((a, b) => (a.start - b.start) || ((b.allDay ? 1 : 0) - (a.allDay ? 1 : 0)));
    let idx = seq.indexOf(l);
    if (idx < 0) { seq.push(l); idx = seq.length - 1; }
    drawerState = { seq, idx };
    renderDrawer();
  }
  function stepLesson(d) {
    if (!drawerState) return;
    const n = drawerState.idx + d;
    if (n < 0 || n >= drawerState.seq.length) return;
    drawerState.idx = n;
    renderDrawer();
  }
  function loadActivity(href) {
    const id = (href.match(/absid=(\d+)/i) || [])[1] || href;
    const key = 'act:' + id;
    if (isFresh(key, 10)) return Promise.resolve(cache[key].d);
    const url = new URL(href, location.href);
    const rel = url.pathname.slice(BASE.length) + url.search;
    return fetchDoc(rel).then((doc) => {
      const box = doc.querySelector('#homeworkContentContainer');
      const ta = doc.querySelector('textarea.activity-note');
      const note = ta ? (ta.value || ta.textContent || '').trim() : '';
      let html = '';
      if (box) {
        const cl = box.cloneNode(true);
        cl.querySelectorAll('[id$="actHeader"], .ls-paper-subsection-separator').forEach((x) => x.remove());
        if (cl.textContent.trim()) html = safeHtml(cl, url.href);
      }
      const d = { html, note };
      cachePut(key, d);
      return d;
    });
  }
  function renderDrawer() {
    const { seq, idx } = drawerState;
    const l = seq[idx];
    const now = new Date();
    let dr = document.getElementById('lp-drawer');
    if (!dr) {
      dr = document.createElement('div');
      dr.id = 'lp-drawer';
      dr.innerHTML = '<div class="lp-dr-scrim"></div><aside class="lp-dr-panel" role="dialog" aria-modal="true" aria-label="Lektion" tabindex="-1"></aside>';
      document.body.appendChild(dr);
      dr.querySelector('.lp-dr-scrim').addEventListener('click', closeModal);
      dr.querySelector('.lp-dr-panel').addEventListener('click', (e) => {
        const b = e.target.closest('[data-dr]');
        if (!b) return;
        if (b.dataset.dr === 'x') closeModal(); else stepLesson(+b.dataset.dr);
      });
      document.documentElement.classList.add('lp-drawer-open');
    }
    const p = dr.querySelector('.lp-dr-panel');
    const live = !l.cancelled && !l.allDay && l.start <= now && now < l.end;
    const flag = l.cancelled ? '<span class="lp-flag is-danger">aflyst</span>' : l.changed ? '<span class="lp-flag is-warn">ændret</span>' : live ? '<span class="lp-flag is-ok">i gang</span>' : '';
    const when = `${cap(DAYS[l.start.getDay()])} ${l.start.getDate()}. ${MONTHS[l.start.getMonth()]}${l.allDay ? ', hele dagen' : `, ${hm(l.start)} til ${hm(l.end)}`}`;
    const prevL = seq[idx - 1];
    const nextL = seq[idx + 1];
    const navLabel = (x) => (x ? `${x.subject?.name || x.title || 'Aktivitet'}, ${dayLabel(x.start, now)}${x.allDay ? '' : ' ' + hm(x.start)}` : '');
    const tipBlock = (title, txt) => (txt ? `<section><h4 class="lp-c-head">${title}</h4><p class="lp-pre">${esc(txt.replace(/\s*\[\.\.\.\]\s*/g, ' ...'))}</p></section>` : '');
    const fromTip = tipBlock('Note', l.note) + tipBlock('Lektier', l.homework) + tipBlock('Øvrigt indhold', l.other);
    p.style.setProperty('--h', hueFor(l.subject?.code || l.title));
    p.innerHTML = `
      <header class="lp-dr-top">
        <div class="lp-dr-nav">
          <button type="button" class="lp-icon-btn" data-dr="-1"${prevL ? ` title="${esc(navLabel(prevL))}"` : ' disabled'} aria-label="Forrige lektion">${ICONS.left}</button>
          <button type="button" class="lp-icon-btn" data-dr="1"${nextL ? ` title="${esc(navLabel(nextL))}"` : ' disabled'} aria-label="Næste lektion">${ICONS.right}</button>
          <span class="lp-dr-count">${idx + 1} af ${seq.length}</span>
        </div>
        <button type="button" class="lp-icon-btn" data-dr="x" aria-label="Luk">${ICONS.x}</button>
      </header>
      <div class="lp-dr-body">
        <p class="lp-dr-subj">${subjDot(l.subject?.code || l.title)}<span>${esc(l.subject?.name || 'Aktivitet')}</span>${flag}</p>
        <h2>${esc(l.title || l.subject?.name || l.hold || 'Aktivitet')}</h2>
        <p class="lp-dr-when">${esc(when)}</p>
        ${live ? `<span class="lp-progress"><i style="width:${Math.round(((now - l.start) / (l.end - l.start)) * 100)}%"></i></span>` : ''}
        <dl class="lp-dr-meta">
          ${l.room ? `<div><dt>Lokale</dt><dd>${esc(l.room)}</dd></div>` : ''}
          ${l.teacher ? `<div><dt>${/,/.test(l.teacher) ? 'Lærere' : 'Lærer'}</dt><dd>${esc(l.teacher)}</dd></div>` : ''}
          ${l.hold ? `<div><dt>Hold</dt><dd>${esc(l.hold)}</dd></div>` : ''}
        </dl>
        <div class="lp-dr-content" aria-live="polite">
          ${l.href ? `${fromTip ? `<div class="lp-dr-tip">${fromTip}</div>` : ''}<p class="lp-dr-loading">Henter hele indholdet fra Lectio</p>` : (fromTip || '<p class="lp-empty">Ingen lektier eller noter.</p>')}
        </div>
      </div>
      ${l.href ? `<footer class="lp-dr-foot"><a class="lp-btn lp-btn-primary" href="${esc(l.href)}">Åbn lektionen i Lectio ${ICONS.ext}</a><span class="lp-dr-keys"><kbd>←</kbd> <kbd>→</kbd> skifter lektion</span></footer>` : ''}`;
    p.focus({ preventScroll: true });
    if (!l.href) return;
    const content = p.querySelector('.lp-dr-content');
    loadActivity(l.href).then((d) => {
      if (!drawerState || drawerState.seq[drawerState.idx] !== l || !content.isConnected) return;
      const noteHtml = d.note ? `<section><h4 class="lp-c-head">Note</h4><p class="lp-pre">${esc(d.note)}</p></section>` : '';
      content.innerHTML = noteHtml + (d.html ? `<div class="lp-act">${d.html}</div>` : '') ||
        '<p class="lp-empty">Ingen lektier eller noter til denne lektion.</p>';
    }).catch(() => {
      if (!content.isConnected) return;
      const ld = content.querySelector('.lp-dr-loading');
      if (ld) ld.textContent = 'Kunne ikke hente hele indholdet. Åbn lektionen i Lectio for at se det.';
    });
  }

  /* ---------------- komponenter ---------------- */
  const subjDot = (code) => `<i class="lp-sd" style="--h:${hueFor(code)}"></i>`;
  const skeleton = (n = 3) => `<div class="lp-skel">${'<i></i>'.repeat(n)}</div>`;
  const errBox = (e) => `<p class="lp-empty">Lectio svarede ikke. Prøv at genindlæse siden.<br><small>${esc(e?.message || e)}</small></p>`;
  const section = (title, href, body, cls = '') => `<section class="lp-sec ${cls}">
      <header><h2>${esc(title)}</h2>${href ? `<a class="lp-link" href="${href}">Åbn</a>` : ''}</header>${body}</section>`;
  const cap = (s) => s.replace(/^./, (c) => c.toUpperCase());
  const DAY_ABBR = { ma: 'mandag', ti: 'tirsdag', on: 'onsdag', to: 'torsdag', fr: 'fredag', 'lø': 'lørdag', 'sø': 'søndag' };
  // Lectio skriver fx "to 21/1 09:00". Det bliver til "torsdag 21/1 kl. 09:00".
  const niceTime = (s) => String(s || '').replace(/^(ma|ti|on|to|fr|lø|sø)\s+(\d{1,2}\/\d{1,2})(?:\s+(\d{1,2}:\d{2}))?/i, (m, d, dt, t) => `${DAY_ABBR[d.toLowerCase()]} ${dt}${t ? ' kl. ' + t : ''}`);

  function lessonRow(l, now, idx) {
    const live = !l.cancelled && l.start <= now && now < l.end;
    const past = l.end <= now;
    const prog = live ? Math.round(((now - l.start) / (l.end - l.start)) * 100) : 0;
    const note = l.cancelled ? '<span class="lp-flag is-danger">aflyst</span>' : l.changed ? '<span class="lp-flag is-warn">ændret</span>' : '';
    return `<button type="button" class="lp-row${live ? ' is-live' : ''}${past ? ' is-past' : ''}${l.cancelled ? ' is-cancelled' : ''}" data-li="${idx}">
      <span class="lp-row-time">${hm(l.start)}</span>
      <span class="lp-row-main">
        <span class="lp-row-title">${subjDot(l.subject?.code)}${esc(l.subject?.name || l.title || 'Aktivitet')}${note}</span>
        <span class="lp-row-sub">${esc([l.room, shortTeacher(l.teacher)].filter(Boolean).join(', '))}${l.homework ? '<span class="lp-hwmark">lektier</span>' : ''}</span>
        ${live ? `<span class="lp-progress"><i style="width:${prog}%"></i></span>` : ''}
      </span>
      <span class="lp-row-end">${hm(l.end)}</span>
    </button>`;
  }

  function dueText(due, status, now) {
    if (/afleveret/i.test(status)) return '<span class="lp-due is-ok">afleveret</span>';
    if (due < now) return '<span class="lp-due is-danger">mangler</span>';
    const hrs = (due - now) / 36e5;
    const cls = hrs < 24 ? 'is-danger' : hrs < 72 ? 'is-warn' : '';
    return `<span class="lp-due ${cls}">${esc(relTime(due, now))}</span>`;
  }

  /* ---------------- overblik (forside) ---------------- */
  function parseFront(doc) {
    const notices = [];
    const hold = [];
    doc.querySelectorAll('section.lf-island').forEach((s) => {
      const title = (s.querySelector('.dashboardLinkHeaderText, .dashboardTextHeader')?.textContent || '').trim();
      if (!title) return;
      if (/^hold og grupper/i.test(title)) {
        s.querySelectorAll('a[href]').forEach((a) => { const h = abs(a.getAttribute('href')); const n = a.textContent.trim(); if (h && n) hold.push({ name: n, href: h }); });
        return;
      }
      if (/^(lektier|opgaveaflevering|beskeder|i dag|i morgen|skema)/i.test(title)) return;
      const link = abs(s.querySelector('a.dashboardItemTitle')?.getAttribute('href'));
      const rows = [...s.querySelectorAll('table.dashboard tr')].map((tr) => {
        const info = tr.querySelector('td.infoCol') || tr.cells[0];
        const time = tr.querySelector('td.timeCol');
        return { html: info ? safeHtml(info, location.origin + BASE) : '', time: time ? time.textContent.trim() : '', attention: !!(time && time.classList.contains('attention')) };
      }).filter((r) => r.html.replace(/<[^>]+>/g, '').trim());
      if (rows.length) notices.push({ title, link, rows });
    });
    return { notices, hold };
  }

  async function renderDashboard(app) {
    const now = new Date();
    const today = startOfDay(now);
    const hour = now.getHours();
    const greet = hour < 10 ? 'Godmorgen' : hour < 12 ? 'God formiddag' : hour < 18 ? 'God eftermiddag' : 'God aften';
    const { w } = isoWeek(now);
    app.classList.add('lp-dash');
    const card = (id, title, link, linkLabel, body, cls = '') => `<section class="lp-card ${cls}" id="${id}">
        <header class="lp-card-head"><h2>${title}</h2>${link ? `<a class="lp-link" href="${link}">${linkLabel}</a>` : ''}</header>
        <div class="lp-card-body">${body}</div></section>`;
    app.innerHTML = `
      <header class="lp-dhead">
        <div><p class="lp-date">${esc(cap(DAYS[now.getDay()]))} ${now.getDate()}. ${esc(MONTHS[now.getMonth()])}, uge ${w}</p>
        <h1>${greet}${USER.first ? ', ' + esc(USER.first) : ''}</h1></div>
        <nav id="lp-chips" class="lp-chips" aria-label="Status"></nav>
      </header>
      <div id="lp-next" class="lp-hero">${skeleton(1)}</div>
      <div class="lp-dgrid">
        ${card('lp-c-day', 'I dag', BASE + 'SkemaNy.aspx', 'Hele ugen', skeleton(6))}
        ${card('lp-c-hw', 'Lektier', BASE + 'material_lektieoversigt.aspx', 'Alle lektier', skeleton(4))}
        ${card('lp-c-tasks', 'Afleveringer', BASE + 'OpgaverElev.aspx', 'Alle opgaver', skeleton(4))}
        ${card('lp-c-msgs', 'Beskeder', BASE + 'beskeder2.aspx', 'Indbakke', skeleton(3))}
        <section class="lp-card lp-span2" id="lp-c-front" hidden></section>
      </div>`;
    const setBody = (id, html, title) => {
      const c = document.getElementById(id);
      if (!c) return null;
      c.querySelector('.lp-card-body').innerHTML = html;
      if (title) c.querySelector('h2').textContent = title;
      return c;
    };

    /* status som små rolige pills */
    const chips = {};
    const writeChips = () => {
      const el = document.getElementById('lp-chips');
      if (!el) return;
      const out = [];
      if (chips.missing) out.push(`<a class="lp-pill is-danger" href="${BASE}OpgaverElev.aspx">${chips.missing} ${chips.missing === 1 ? 'aflevering mangler' : 'afleveringer mangler'}</a>`);
      if (chips.soon) out.push(`<a class="lp-pill" href="${BASE}OpgaverElev.aspx">${chips.soon} ${chips.soon === 1 ? 'aflevering' : 'afleveringer'} denne uge</a>`);
      if (chips.unread) out.push(`<a class="lp-pill" href="${BASE}beskeder2.aspx">${chips.unread} ${chips.unread === 1 ? 'ulæst besked' : 'ulæste beskeder'}</a>`);
      (chips.deadlines || []).forEach((d) => out.push(`<a class="lp-pill is-warn" href="${esc(d.link || '#lp-c-front')}">${esc(d.title)} senest ${esc(niceTime(d.time))}</a>`));
      if (chips.abs != null) out.push(`<a class="lp-pill${chips.abs >= 10 ? ' is-danger' : chips.abs >= 5 ? ' is-warn' : ''}" href="${BASE}subnav/fravaerelev.aspx">Fravær ${chips.abs.toFixed(1).replace('.', ',')} %</a>`);
      if (chips.avg != null) out.push(`<a class="lp-pill" href="${BASE}grades/grade_report.aspx">Snit ${chips.avg.toFixed(1).replace('.', ',')}</a>`);
      el.innerHTML = out.join('');
    };

    /* fra skolen: læses fra forsiden uden ekstra forespørgsel */
    try {
      const front = parseFront(document);
      cachePut('front', front);
      chips.deadlines = front.notices.flatMap((n) => n.rows.filter((r) => r.attention).map((r) => ({ title: n.title, time: r.time, link: n.link })));
      writeChips();
      if (front.notices.length) {
        const c = document.getElementById('lp-c-front');
        c.hidden = false;
        c.innerHTML = `<header class="lp-card-head"><h2>Fra skolen</h2></header><div class="lp-card-body lp-notices">${front.notices.map((n) => `
          <div class="lp-notice">
            <h3>${n.link ? `<a href="${esc(n.link)}">${esc(n.title)}</a>` : esc(n.title)}</h3>
            ${n.rows.map((r) => `<div class="lp-nrow"><div class="lp-ntext">${r.html}</div>${r.time ? `<span class="lp-ntime${r.attention ? ' is-warn' : ''}">${esc(niceTime(r.time))}</span>` : ''}</div>`).join('')}
          </div>`).join('')}</div>`;
        c.querySelectorAll('.lp-ntext').forEach((el) => {
          if (el.scrollHeight > el.clientHeight + 4) {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'lp-more-btn'; b.textContent = 'Læs mere';
            b.addEventListener('click', () => { const o = el.classList.toggle('is-open'); b.textContent = o ? 'Vis mindre' : 'Læs mere'; });
            el.after(b);
          }
        });
      }
    } catch (e) { console.warn('[Lectio+]', e); }

    /* skema: nu og næste øverst, dagens moduler i første kort */
    const weeks = { cur: null, next: null, askedNext: false };
    const knownLessons = () => (weeks.cur ? weeks.cur.lessons : []).concat(weeks.next ? weeks.next.lessons : []).filter((l) => l.start);
    /* lektier: kun næste skoledag, resten bag et klik */
    let hwData = null;
    const absId = (href) => ((href || '').match(/absid=(\d+)/i) || [])[1];
    const drawHomework = () => {
      if (!hwData) return;
      const upcoming = hwData.filter((x) => x.date && x.date > today).sort((a, b) => a.date - b.date);
      const todayLeft = hwData.filter((x) => x.date && sameDay(x.date, now));
      const showToday = todayLeft.length && hour < 12;
      const day = showToday ? today : upcoming[0]?.date;
      if (!day) { setBody('lp-c-hw', '<p class="lp-empty">Ingen lektier lige nu.</p>', 'Lektier'); return; }
      const items = (showToday ? todayLeft : upcoming.filter((x) => sameDay(x.date, day)));
      const later = hwData.filter((x) => x.date && x.date > day).length;
      const lessons = knownLessons();
      const body = `<div class="lp-hwl">${items.map((x, i) => {
        const id = absId(x.href);
        const lesson = id ? lessons.find((l) => absId(l.href) === id) : null;
        const lines = x.text.replace(/\s*\[\.\.\.\]\s*/g, ' ...').split('\n').map((s) => s.trim()).filter(Boolean);
        const modul = (x.activity.match(/(\d+)\.\s*modul/) || [])[1];
        return `<details class="lp-hwi">
          <summary>${subjDot(x.subject?.code)}<span class="lp-hwi-main"><strong>${esc(x.subject?.name || 'Lektie')}</strong>${lesson ? `<small>${hm(lesson.start)}</small>` : modul ? `<small>${modul}. modul</small>` : ''}<span class="lp-hwi-line">${esc(lines[0] || '')}</span></span></summary>
          <div class="lp-hwi-full"><p class="lp-pre">${esc(lines.join('\n'))}</p>
            ${lesson ? `<button type="button" class="lp-link-btn" data-hw="${i}">Se hele lektionen</button>` : x.href ? `<a class="lp-link" href="${esc(x.href)}">Åbn i Lectio</a>` : ''}</div>
        </details>`;
      }).join('')}</div>${later ? `<a class="lp-card-foot" href="${BASE}material_lektieoversigt.aspx">${later} ${later === 1 ? 'lektie' : 'lektier'} senere</a>` : ''}`;
      const c = setBody('lp-c-hw', body, `Lektier til ${dayLabel(day, now)}`);
      c.querySelectorAll('[data-hw]').forEach((b) => b.addEventListener('click', () => {
        const x = items[+b.dataset.hw];
        const lesson = lessons.find((l) => absId(l.href) === absId(x.href));
        if (lesson) openLesson(lesson, lessons);
      }));
    };
    const drawSchedule = () => {
      if (!weeks.cur) return;
      const all = knownLessons();
      const lessons = all.filter((l) => !l.allDay);
      const allDay = all.filter((l) => l.allDay);
      let targetDay = null;
      if (lessons.some((l) => sameDay(l.start, now) && l.end > now)) targetDay = today;
      else {
        const future = lessons.filter((l) => startOfDay(l.start) > today);
        if (future.length) targetDay = startOfDay(future[0].start);
        else if (!weeks.askedNext) {
          weeks.askedNext = true;
          const nxt = new Date(mondayOf(now)); nxt.setDate(nxt.getDate() + 7);
          loadWeek(nxt, (sk) => { weeks.next = sk; drawSchedule(); drawHomework(); });
        }
      }
      const dayLessons = targetDay ? lessons.filter((l) => sameDay(l.start, targetDay)) : [];
      const dayAll = targetDay ? allDay.filter((l) => sameDay(l.start, targetDay)) : [];
      const isToday = targetDay && sameDay(targetDay, now);
      const title = !targetDay ? 'Skema' : isToday ? 'I dag' : cap(dayLabel(targetDay, now));
      const seq = dayLessons.concat(dayAll);
      let body = dayAll.map((l) => `<button type="button" class="lp-event" data-li="${seq.indexOf(l)}">${esc(l.title || 'Begivenhed')}<small>hele dagen</small></button>`).join('');
      body += dayLessons.length ? `<div class="lp-rows">${dayLessons.map((l) => lessonRow(l, now, seq.indexOf(l))).join('')}</div>` : '<p class="lp-empty">Ingen moduler.</p>';
      const c = setBody('lp-c-day', body, title);
      c.querySelectorAll('[data-li]').forEach((b) => b.addEventListener('click', () => openLesson(seq[+b.dataset.li], seq)));

      const cur = dayLessons.find((l) => !l.cancelled && l.start <= now && now < l.end);
      const next = lessons.filter((l) => !l.cancelled && l.start > now)[0];
      const block = (lbl, l, sub, extra = '') => `<button type="button" class="lp-hero-item" data-n="${lbl}" style="--h:${hueFor(l.subject?.code)}">
          <span class="lp-hero-lbl">${lbl === 'nu' ? 'Nu' : cur ? 'Bagefter' : 'Næste time'}</span>
          <strong>${esc(l.subject?.name || l.title || 'Aktivitet')}</strong>
          <span class="lp-hero-room">${esc(l.room || 'Intet lokale')}</span>
          <span class="lp-hero-sub">${esc(sub)}</span>${extra}</button>`;
      let h = '';
      if (cur) {
        const prog = Math.round(((now - cur.start) / (cur.end - cur.start)) * 100);
        h += block('nu', cur, `${hm(cur.start)} til ${hm(cur.end)}, ${shortTeacher(cur.teacher)}`.replace(/, $/, ''), `<span class="lp-progress"><i style="width:${prog}%"></i></span>`);
      }
      if (next) {
        const when = sameDay(next.start, now) ? `kl. ${hm(next.start)}, ${relTime(next.start, now)}` : `${dayLabel(next.start, now)} kl. ${hm(next.start)}`;
        h += block('naeste', next, when);
      }
      const hero = document.getElementById('lp-next');
      if (!h && weeks.askedNext && !weeks.next) h = skeleton(1);
      hero.innerHTML = h || '<p class="lp-hero-free">Ingen flere timer i denne og næste uge.</p>';
      hero.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => openLesson(b.dataset.n === 'nu' ? cur : next, lessons)));
    };
    loadWeek(now, (sk) => { weeks.cur = sk; drawSchedule(); drawHomework(); }, (e) => {
      setBody('lp-c-day', errBox(e));
      document.getElementById('lp-next').innerHTML = '';
    });

    loadSrc('hw', (hw) => { hwData = hw; drawHomework(); }, (e) => setBody('lp-c-hw', errBox(e)));

    /* afleveringer: de mangler og de næste fem */
    loadSrc('tasks', (tasks) => {
      const open = tasks.filter((t) => !/afleveret/i.test(t.status) && t.due);
      const missing = open.filter((t) => t.due < now && /mangler/i.test(t.status)).sort((a, b) => b.due - a.due);
      const coming = open.filter((t) => t.due >= now).sort((a, b) => a.due - b.due);
      chips.missing = missing.length;
      chips.soon = coming.filter((t) => (t.due - now) / 864e5 < 7).length;
      writeChips();
      const row = (t, late) => `<a class="lp-tsk${late ? ' is-late' : ''}" href="${esc(t.href || BASE + 'OpgaverElev.aspx')}">
          <span class="lp-tsk-date"><b>${t.due.getDate()}</b><small>${esc(MONTHS[t.due.getMonth()].slice(0, 3))}</small></span>
          <span class="lp-tsk-main"><strong>${esc(t.title)}</strong><small>${subjDot(t.subject?.code)}${esc(t.subject?.name || t.hold)}, ${esc(DAYS[t.due.getDay()])} kl. ${hm(t.due)}</small></span>
          ${dueText(t.due, t.status, now)}</a>`;
      const shown = missing.map((t) => row(t, true)).concat(coming.slice(0, 5).map((t) => row(t)));
      const rest = coming.length - 5;
      setBody('lp-c-tasks', shown.length ? `<div class="lp-tsks">${shown.join('')}</div>${rest > 0 ? `<a class="lp-card-foot" href="${BASE}OpgaverElev.aspx">${rest} mere</a>` : ''}` : '<p class="lp-empty">Ingen kommende afleveringer.</p>');
    }, (e) => setBody('lp-c-tasks', errBox(e)));

    /* beskeder */
    loadSrc('msgs', (msgs) => {
      const unread = msgs.filter((x) => x.unread).length;
      chips.unread = unread; writeChips();
      setBody('lp-c-msgs', msgs.length ? `<div class="lp-msgs">${msgs.slice(0, 6).map((x) => `
        <a class="lp-msg${x.unread ? ' is-unread' : ''}" href="${esc(x.href || BASE + 'beskeder2.aspx')}">
          <span class="lp-msg-main"><strong>${esc(x.subject)}</strong><small>${esc(x.from)}</small></span>
          <span class="lp-msg-time">${esc(x.changed)}</span>
        </a>`).join('')}</div>` : '<p class="lp-empty">Indbakken er tom.</p>', unread ? `Beskeder, ${unread} ulæste` : 'Beskeder');
    }, (e) => setBody('lp-c-msgs', errBox(e)));

    /* fravær og snit som pills */
    loadSrc('abs', (a) => { if (a) { chips.abs = a.total.pct || 0; writeChips(); } });
    loadSrc('grades', (g) => {
      let ws = 0; let wt = 0;
      g.forEach((x) => { const v = num(x.grade); if (v != null && x.weight && /^-?\d+$/.test(x.grade.trim())) { ws += v * x.weight; wt += x.weight; } });
      if (wt) { chips.avg = ws / wt; writeChips(); }
    });

    setTimeout(() => {
      if (!document.getElementById('lp-app')) return;
      if (document.hidden) { document.addEventListener('visibilitychange', () => renderDashboard(app), { once: true }); return; }
      Object.keys(memo).forEach((k) => delete memo[k]);
      renderDashboard(app);
    }, 5 * 60 * 1000);
  }

  /* ---------------- ugeskema ---------------- */
  let weekToken = 0;
  function renderWeek(app, weekDate) {
    const token = ++weekToken;
    const now = new Date();
    const wp = weekParam(weekDate);
    const isCurrent = wp === weekParam(now);
    const { w } = isoWeek(weekDate);
    app.innerHTML = `<div class="lp-week-head">
        <div><h1>Uge ${w}</h1><p class="lp-date">${(() => { const mo = mondayOf(weekDate); const fr = new Date(mo.getTime() + 4 * 864e5); return `${mo.getDate()}. ${MONTHS[mo.getMonth()]} til ${fr.getDate()}. ${MONTHS[fr.getMonth()]}`; })()}</p></div>
        <div class="lp-week-nav">
          <button type="button" class="lp-btn" data-wk="-1" title="Forrige uge (Alt+venstre)" aria-label="Forrige uge">${ICONS.left}</button>
          <button type="button" class="lp-btn${isCurrent ? ' is-disabled' : ''}" data-wk="0">I dag</button>
          <button type="button" class="lp-btn" data-wk="1" title="Næste uge (Alt+højre)" aria-label="Næste uge">${ICONS.right}</button>
          <a class="lp-btn lp-btn-ghost" href="${BASE}SkemaNy.aspx?week=${wp}&lp=orig">Lectios visning</a>
        </div></div>
      <div id="lp-week" class="lp-card lp-week-card">${skeleton(8)}</div>`;
    app.querySelectorAll('[data-wk]').forEach((b) => b.addEventListener('click', () => {
      const d = +b.dataset.wk;
      const nd = d === 0 ? new Date() : new Date(weekDate.getTime() + d * 7 * 864e5);
      history.replaceState(null, '', `${BASE}SkemaNy.aspx?week=${weekParam(nd)}`);
      renderWeek(app, nd);
    }));
    const draw = (sk) => {
      if (token !== weekToken) return;
      const timed = sk.lessons.filter((l) => !l.allDay && l.start && l.end);
      const toMin = (s) => { const [a, b] = s.split(':').map(Number); return a * 60 + b; };
      let minM = sk.modules.length ? toMin(sk.modules[0].start) : 8 * 60;
      let maxM = sk.modules.length ? toMin(sk.modules[sk.modules.length - 1].end) : 16 * 60;
      timed.forEach((l) => { minM = Math.min(minM, l.start.getHours() * 60 + l.start.getMinutes()); maxM = Math.max(maxM, l.end.getHours() * 60 + l.end.getMinutes()); });
      const lastUsed = timed.reduce((mx, l) => Math.max(mx, l.end.getHours() * 60 + l.end.getMinutes()), minM + 4 * 60);
      maxM = Math.min(maxM, Math.max(lastUsed, minM + 6 * 60));
      minM = Math.floor(minM / 30) * 30; maxM = Math.ceil(maxM / 30) * 30;
      const PX = 1.15;
      const H = (maxM - minM) * PX;
      const hours = [];
      for (let t = Math.ceil(minM / 60) * 60; t <= maxM; t += 60) hours.push(t);
      const all = sk.lessons;
      const cols = sk.days.map((d, di) => {
        const isToday = d.date && sameDay(d.date, now);
        const dayAll = all.filter((l) => l.day === di && l.allDay);
        const dayTimed = timed.filter((l) => l.day === di);
        const lanes = [];
        dayTimed.forEach((l) => {
          let lane = lanes.findIndex((end) => end <= l.start);
          if (lane === -1) { lane = lanes.length; lanes.push(l.end); } else lanes[lane] = l.end;
          l._lane = lane;
        });
        dayTimed.forEach((l) => { l._lanes = Math.max(1, ...dayTimed.filter((o) => o.start < l.end && l.start < o.end).map((o) => o._lane + 1)); });
        const blocks = dayTimed.map((l) => {
          const top = ((l.start.getHours() * 60 + l.start.getMinutes()) - minM) * PX;
          const hgt = Math.max(22, ((l.end - l.start) / 6e4) * PX - 3);
          const live = !l.cancelled && l.start <= now && now < l.end;
          const width = 100 / l._lanes;
          return `<button type="button" class="lp-blk${l.cancelled ? ' is-cancelled' : ''}${l.changed ? ' is-changed' : ''}${live ? ' is-live' : ''}${l.end < now ? ' is-past' : ''}${hgt < 44 ? ' is-short' : ''}" data-li="${all.indexOf(l)}"
            style="--h:${hueFor(l.subject?.code)};top:${top}px;height:${hgt}px;left:calc(${width * l._lane}% + 3px);width:calc(${width}% - 6px)">
            <strong>${esc(l.subject?.name || l.title || 'Aktivitet')}</strong>
            <small>${hm(l.start)}${l.room ? ', ' + esc(l.room) : ''}</small>
            ${hgt > 60 && l.title && l.subject ? `<em>${esc(l.title)}</em>` : ''}
            <span class="lp-blk-icons">${l.homework ? '<i title="Lektier"></i>' : ''}</span>
          </button>`;
        }).join('');
        const nowM = now.getHours() * 60 + now.getMinutes();
        const nowLine = isToday && nowM >= minM && nowM <= maxM ? `<div class="lp-nowline" style="top:${(nowM - minM) * PX}px"></div>` : '';
        return `<div class="lp-day${isToday ? ' is-today' : ''}">
          <div class="lp-day-head"><span>${esc(d.name)}</span><b>${d.date ? d.date.getDate() : ''}</b></div>
          <div class="lp-day-all">${dayAll.map((l) => `<button type="button" class="lp-allday" data-li="${all.indexOf(l)}" style="--h:${hueFor(l.title)}">${esc(l.title || l.subject?.name || 'Begivenhed')}</button>`).join('')}</div>
          <div class="lp-day-body" style="height:${H}px">${hours.map((t) => `<div class="lp-hline" style="top:${(t - minM) * PX}px"></div>`).join('')}${blocks}${nowLine}</div>
        </div>`;
      }).join('');
      const anyAll = all.some((l) => l.allDay);
      const box = document.getElementById('lp-week');
      box.innerHTML = `<div class="lp-week${anyAll ? '' : ' no-allday'}">
        <div class="lp-gutter"><div class="lp-day-head"></div><div class="lp-day-all"></div><div class="lp-day-body" style="height:${H}px">${hours.map((t) => `<span style="top:${(t - minM) * PX}px">${pad(Math.floor(t / 60))}:00</span>`).join('')}</div></div>
        ${cols}</div>
        <div class="lp-legend"><span><i class="lp-lg-ch"></i>Ændret</span><span><i class="lp-lg-ca"></i>Aflyst</span><span><i class="lp-lg-hw"></i>Har lektier</span><span>Klik på et modul for at se lektier og noter</span></div>`;
      box.querySelectorAll('[data-li]').forEach((b) => b.addEventListener('click', () => openLesson(all[+b.dataset.li], all)));
    };
    const fail = (e) => { if (token === weekToken) document.getElementById('lp-week').innerHTML = errBox(e); };
    if (isCurrent && !/week=/i.test(INITIAL) && PAGE === 'skemany.aspx') {
      const sk = parseSkema(document);
      if (sk) { cachePut(skemaKey(now), sk); draw(sk); } else fail(new Error('Skemaet kunne ikke læses'));
    } else loadWeek(weekDate, draw, fail);
    // hent ugen efter i baggrunden så bladring føles øjeblikkelig
    const nextWeek = new Date(weekDate.getTime() + 7 * 864e5);
    if (!isFresh(skemaKey(nextWeek), TTL.skema)) idle(() => { if (token === weekToken) loadWeek(nextWeek, () => {}); }, 4000);
  }

  /* ---------------- forbedringer af originale sider ---------------- */
  function enhanceAssignments() {
    const t = document.querySelector('#s_m_Content_Content_ExerciseGV');
    if (!t) return;
    const now = new Date();
    const data = parseAssignments(document);
    const rows = [...t.rows].slice(1).filter((r) => r.cells.length > 6);
    rows.forEach((r, i) => {
      const d = data[i];
      if (!d) return;
      const st = d.status.toLowerCase();
      r.classList.add(st.includes('afleveret') ? 'lp-row-done' : st.includes('mangler') ? 'lp-row-missing' : 'lp-row-open');
      const cell = r.cells[5];
      if (cell && !cell.querySelector('.lp-chip')) {
        const cls = st.includes('afleveret') ? 'is-ok' : st.includes('mangler') ? 'is-danger' : d.due && d.due - now < 3 * 864e5 ? 'is-warn' : '';
        cell.innerHTML = `<span class="lp-chip ${cls}">${esc(d.status)}</span>`;
      }
      if (d.due && !st.includes('afleveret') && d.due > now) {
        const fc = r.cells[3];
        if (fc && !fc.querySelector('.lp-rel')) fc.insertAdjacentHTML('beforeend', `<small class="lp-rel">${esc(relTime(d.due, now))}</small>`);
      }
    });
    const open = data.filter((d) => !/afleveret/i.test(d.status)).length;
    const done = data.length - open;
    const bar = document.createElement('div');
    bar.className = 'lp-toolbar';
    bar.innerHTML = `<span><b>${open}</b> åbne</span><span><b>${done}</b> afleveret</span><span class="lp-muted">${data.length} i alt</span>
      <label class="lp-switch"><input type="checkbox" ${settings.hideDone ? 'checked' : ''}><i></i>Skjul afleverede</label>`;
    t.parentNode.insertBefore(bar, t);
    const cb = bar.querySelector('input');
    const apply = () => document.documentElement.classList.toggle('lp-hide-done', cb.checked);
    cb.addEventListener('change', () => { settings.hideDone = cb.checked; saveSetting('hideDone', cb.checked); apply(); });
    apply();
  }

  function originalPill() {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.id = 'lp-pill';
    pill.innerHTML = `Tilbage til Lectio<span>+</span>`;
    pill.addEventListener('click', () => {
      sessionStorage.removeItem('lp-original');
      const u = new URL(location.href); u.searchParams.delete('lp');
      location.href = u.href;
    });
    document.body.appendChild(pill);
  }


  /* ---------------- egne visninger: opgaver, lektier, fravær, karakterer ---------------- */
  const origLink = () => { const u = new URL(location.href); u.searchParams.set('lp', 'orig'); return u.href; };
  const viewHead = (title, sub, extra = '') => `<header class="lp-vhead">
      <div><h1>${esc(title)}</h1>${sub ? `<p class="lp-date">${sub}</p>` : ''}</div>
      <div class="lp-vhead-actions">${extra}<a class="lp-btn lp-btn-ghost" href="${esc(origLink())}">Lectios visning</a></div>
    </header>${subTabs()}`;
  // Lectios egne underfaner (fx Karaktermeddelelse og Fraværsårsager) vises også i de nye visninger.
  function subTabs() {
    const seen = new Set();
    const items = [];
    document.querySelectorAll('.ls-subnav-container a').forEach((a) => {
      if (a.closest('[id$="subnavigator_generic_tr"]')) return;
      const t = a.textContent.trim();
      const h = abs(a.getAttribute('href'));
      if (!t || !h || seen.has(t)) return;
      seen.add(t); items.push({ t, h });
    });
    if (items.length < 2) return '';
    const here = location.pathname.toLowerCase();
    return `<nav class="lp-tabs" aria-label="Undersider">${items.map((i) => { const on = new URL(i.h).pathname.toLowerCase() === here; return `<a href="${esc(i.h)}"${on ? ' class="is-on" aria-current="page"' : ''}>${esc(i.t)}</a>`; }).join('')}</nav>`;
  }
  function subjectFilter(app, items, attr = 'data-subj') {
    const subs = [...new Map(items.filter((x) => x.subject).map((x) => [x.subject.code, x.subject.name])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'da'));
    if (subs.length < 2) return '';
    setTimeout(() => {
      app.querySelectorAll('.lp-filter button').forEach((b) => b.addEventListener('click', () => {
        app.querySelectorAll('.lp-filter button').forEach((x) => x.classList.toggle('is-on', x === b));
        const v = b.dataset.f;
        app.querySelectorAll(`[${attr}]`).forEach((el) => { el.hidden = v !== '' && el.getAttribute(attr) !== v; });
        app.querySelectorAll('.lp-group').forEach((g) => { g.hidden = !g.querySelector(`[${attr}]:not([hidden])`); });
      }));
    });
    return `<div class="lp-filter" role="group" aria-label="Vis fag"><button type="button" class="is-on" data-f="">Alle fag</button>${subs.map(([c, n]) => `<button type="button" data-f="${esc(c)}">${subjDot(c)}${esc(n)}</button>`).join('')}</div>`;
  }

  function renderTasksView(app) {
    const now = new Date();
    const tasks = parseAssignments(document);
    const t = document.querySelector('#s_m_Content_Content_ExerciseGV');
    if (t) [...t.rows].slice(1).filter((r) => r.cells.length > 6).forEach((r, i) => { if (tasks[i]) tasks[i].note = r.cells[8] ? r.cells[8].innerText.trim() : ''; });
    const missing = tasks.filter((x) => /mangler/i.test(x.status)).sort((a, b) => (b.due || 0) - (a.due || 0));
    const open = tasks.filter((x) => !/afleveret|mangler/i.test(x.status)).sort((a, b) => (a.due || 0) - (b.due || 0));
    const done = tasks.filter((x) => /afleveret/i.test(x.status)).sort((a, b) => (b.due || 0) - (a.due || 0));
    const row = (x) => {
      const d = x.due;
      return `<a class="lp-task-row" href="${esc(x.href || '#')}" data-subj="${esc(x.subject?.code || '')}">
        <span class="lp-task-when">${d ? `<b>${d.getDate()}. ${esc(MONTHS[d.getMonth()].slice(0, 3))}</b><small>${esc(DAYS[d.getDay()].slice(0, 3))} kl. ${hm(d)}</small>` : ''}</span>
        <span class="lp-task-what"><strong>${esc(x.title)}</strong>
          <small>${subjDot(x.subject?.code)}${esc(x.subject?.name || x.hold)}${x.hours && x.hours !== '0,00' ? `, ${esc(x.hours)} elevtimer` : ''}${x.grade ? `, karakter ${esc(x.grade)}` : ''}</small>
          ${x.note ? `<span class="lp-task-note">${esc(x.note)}</span>` : ''}</span>
        <span class="lp-task-state">${d ? dueText(d, x.status, now) : esc(x.status)}${x.waiting && !/afleveret/i.test(x.status) ? `<small>${/elev/i.test(x.waiting) ? 'venter på dig' : /lærer/i.test(x.waiting) ? 'venter på læreren' : esc(x.waiting)}</small>` : ''}</span>
      </a>`;
    };
    const group = (title, list, cls = '') => list.length ? `<section class="lp-group ${cls}"><h2>${esc(title)} <span>${list.length}</span></h2><div class="lp-list">${list.map(row).join('')}</div></section>` : '';
    app.innerHTML = viewHead('Opgaver', `${open.length} åbne, ${missing.length} mangler, ${done.length} afleveret`) +
      subjectFilter(app, tasks) +
      `<div class="lp-sheet">${group('Mangler', missing, 'is-late')}${group('Kommende', open)}${open.length + missing.length === 0 ? '<p class="lp-empty">Ingen åbne opgaver.</p>' : ''}
       ${done.length ? `<details class="lp-group lp-done"><summary><h2>Afleveret <span>${done.length}</span></h2></summary><div class="lp-list">${done.map(row).join('')}</div></details>` : ''}</div>`;
  }

  function renderHomeworkView(app) {
    const now = new Date();
    const t = document.querySelector('#s_m_Content_Content_MaterialLektieOverblikGV');
    const items = parseHomework(document);
    const rows = t ? [...t.rows].slice(1).filter((r) => r.cells.length >= 3) : [];
    let doneSet = {};
    try { doneSet = JSON.parse(localStorage.getItem('lp-hw-done') || '{}'); } catch (e) { /* tom */ }
    const keyOf = (x) => { let h = 0; for (const ch of `${x.dateTxt}|${x.activity}|${x.text.slice(0, 80)}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'k' + h.toString(36); };
    const groups = new Map();
    items.forEach((x, i) => { x.node = rows[i] ? rows[i].cells[2] : null; x.key = keyOf(x); const k = x.date ? x.date.getTime() : x.dateTxt; if (!groups.has(k)) groups.set(k, { date: x.date, label: x.dateTxt, items: [] }); groups.get(k).items.push(x); });
    const modul = (a) => (a.match(/(\d+)\.\s*modul/) || [])[1];
    app.innerHTML = viewHead('Lektier', `${items.length} lektier de næste 14 dage. Sæt flueben når du er færdig.`) +
      subjectFilter(app, items) +
      `<div class="lp-sheet">${[...groups.values()].map((g) => `<section class="lp-group"><h2>${g.date ? esc(cap(dayLabel(g.date, now))) : esc(g.label)} <small>${g.date ? `${esc(DAYS[g.date.getDay()])} ${g.date.getDate()}/${g.date.getMonth() + 1}` : ''}</small></h2>
        <div class="lp-list">${g.items.map((x) => `<div class="lp-hw-item${doneSet[x.key] ? ' is-done' : ''}" data-subj="${esc(x.subject?.code || '')}" data-key="${x.key}">
          <label class="lp-check"><input type="checkbox" ${doneSet[x.key] ? 'checked' : ''} aria-label="Færdig"><i></i></label>
          <div class="lp-hw-body"><div class="lp-hw-top"><a href="${esc(x.href || '#')}">${subjDot(x.subject?.code)}<strong>${esc(x.subject?.name || 'Aktivitet')}</strong></a><small>${modul(x.activity) ? `${modul(x.activity)}. modul` : ''}</small></div>
          <div class="lp-hw-content" data-i="${items.indexOf(x)}"></div></div></div>`).join('')}</div></section>`).join('') || '<p class="lp-empty">Ingen lektier lige nu.</p>'}</div>`;
    app.querySelectorAll('.lp-hw-content').forEach((el) => {
      const x = items[+el.dataset.i];
      if (x.node) {
        const c = x.node.cloneNode(true);
        c.querySelectorAll('script, [class*="fonticon"]').forEach((n) => n.remove());
        while (c.firstChild) el.appendChild(c.firstChild);
      } else el.textContent = x.text;
    });
    app.querySelectorAll('.lp-hw-item input').forEach((cb) => cb.addEventListener('change', () => {
      const it = cb.closest('.lp-hw-item');
      it.classList.toggle('is-done', cb.checked);
      if (cb.checked) doneSet[it.dataset.key] = Date.now(); else delete doneSet[it.dataset.key];
      const cutoff = Date.now() - 60 * 864e5;
      Object.keys(doneSet).forEach((k) => { if (doneSet[k] < cutoff) delete doneSet[k]; });
      try { localStorage.setItem('lp-hw-done', JSON.stringify(doneSet)); } catch (e) { /* ignorer */ }
    }));
  }

  function renderAbsenceView(app) {
    const a = parseAbsence(document);
    if (!a) { app.innerHTML = viewHead('Fravær', '') + errBox('Fraværstabellen blev ikke fundet'); return; }
    const fmt = (v) => (v || 0).toFixed(1).replace('.', ',') + ' %';
    const lvl = (p) => (p >= 10 ? 'is-danger' : p >= 5 ? 'is-warn' : '');
    const max = Math.max(10, ...a.rows.map((r) => Math.max(r.pct || 0, r.wPct || 0)));
    const bar = (p) => `<span class="lp-bar ${lvl(p)}"><i style="width:${Math.max(0, Math.min(100, ((p || 0) / max) * 100))}%"></i></span>`;
    app.innerHTML = viewHead('Fravær', 'Opgjort for dette skoleår') +
      `<div class="lp-bignums">
        <div class="${lvl(a.total.pct)}"><b>${fmt(a.total.pct)}</b><span>almindeligt fravær${a.total.mods ? `, ${String(a.total.mods[0]).replace('.', ',')} af ${a.total.mods[1]} moduler` : ''}</span></div>
        <div class="${lvl(a.total.wPct)}"><b>${fmt(a.total.wPct)}</b><span>skriftligt fravær${a.total.wTime ? `, ${String(a.total.wTime[0]).replace('.', ',')} af ${String(a.total.wTime[1]).replace('.', ',')} elevtimer` : ''}</span></div>
      </div>
      <div class="lp-sheet"><section class="lp-group"><h2>Pr. hold</h2>
        <div class="lp-abs-table" role="table">
          <div class="lp-abs-row is-head" role="row"><span>Hold</span><span>Almindeligt</span><span></span><span>Skriftligt</span><span></span></div>
          ${a.rows.slice().sort((x, y) => x.hold.localeCompare(y.hold, 'da')).map((r) => { const s = subjectFrom(r.hold); return `<div class="lp-abs-row" role="row">
            <span>${subjDot(s?.code)}${esc(s?.name || r.hold)} <small>${esc(r.hold)}</small></span>
            <span class="${lvl(r.pct)}">${fmt(r.pct)}<small>${r.mods ? `${String(r.mods[0]).replace('.', ',')}/${r.mods[1]}` : ''}</small></span>${bar(r.pct)}
            <span class="${lvl(r.wPct)}">${r.wTime || r.wPct ? fmt(r.wPct) : '<small>ingen</small>'}</span>${r.wTime || r.wPct ? bar(r.wPct) : '<span></span>'}
          </div>`; }).join('')}
        </div>
        <p class="lp-note">Tallene er Lectios egne. Grafen og fraværsskemaet findes under Lectios visning.</p></section></div>`;
  }

  function renderGradesView(app) {
    const g = parseGrades(document);
    let ws = 0; let wt = 0;
    g.forEach((x) => { const v = num(x.grade); if (v != null && x.weight && /^-?\d+$/.test(x.grade.trim())) { ws += v * x.weight; wt += x.weight; } });
    const fmtW = (w) => (w == null ? '' : String(w).replace('.', ','));
    app.innerHTML = viewHead('Karakterer', g.length ? `${g.length} fag på beviset` : '') +
      `<div class="lp-bignums"><div><b>${wt ? (ws / wt).toFixed(1).replace('.', ',') : '-'}</b><span>vægtet snit af årskarakterer</span></div></div>
      <div class="lp-sheet"><section class="lp-group"><h2>Linjer på bevis</h2>
        <div class="lp-gr-table" role="table">
          <div class="lp-gr-row is-head" role="row"><span>Fag</span><span>Årskarakter</span><span>Eksamen</span><span>Vægt</span></div>
          ${g.map((x) => `<div class="lp-gr-row" role="row"><span>${esc(x.subject)}</span>
            <span class="lp-grade">${esc(x.grade || '-')}<small>${esc(x.ects && x.ects !== '-' ? x.ects : '')}</small></span>
            <span class="lp-grade">${esc(x.exam || '-')}<small>${esc(x.examEcts && x.examEcts !== '-' ? x.examEcts : '')}</small></span>
            <span class="lp-muted">${esc(fmtW(x.weight))}</span></div>`).join('') || '<p class="lp-empty">Ingen karakterer endnu.</p>'}
        </div>
        <p class="lp-note">Karakternoter, bemærkninger og protokollinjer findes under Lectios visning.</p></section></div>`;
  }

  /* ---------------- beskedsiden ---------------- */
  function enhanceMessages() {
    document.documentElement.classList.add('lp-msgpage');
    const t = document.querySelector('table[id*="threadGV"]');
    if (t && !t.dataset.lp) {
      t.dataset.lp = '1';
      [...t.rows].forEach((r, i) => {
        [5, 9].forEach((ci) => r.cells[ci] && r.cells[ci].classList.add('lp-hide'));
        if (i === 0) return;
        const oc = r.querySelector('td:nth-child(4) [onclick]')?.getAttribute('onclick') || '';
        const id = (oc.match(/_(\d{6,})'/) || [])[1];
        const read = r.querySelector('[id$="readId"]')?.getAttribute('src') || '';
        if (read && !/\/mread\.gif/i.test(read)) r.classList.add('lp-unread');
        if (id) {
          const url = `${BASE}beskeder2.aspx?type=visbesked&id=${id}`;
          r.classList.add('lp-clickrow');
          r.addEventListener('click', (e) => {
            if (e.target.closest('input, img, select, [onclick]')) return;
            if (e.ctrlKey || e.metaKey) window.open(url, '_blank'); else location.href = url;
          });
        }
      });
    }
    document.querySelectorAll('.outerContentFrame a').forEach((a) => {
      if (a.dataset.lpb) return;
      const txt = a.textContent.trim();
      if (/^(Ny besked|Alle læst|Vis\/skjul slettede|Svar|Videresend|Vedhæft fil)$/i.test(txt)) { a.dataset.lpb = '1'; a.classList.add('lp-lbtn'); if (/^Ny besked$/i.test(txt)) a.classList.add('is-primary'); }
    });
  }

  /* ---------------- beskeder: indbakke med læsepanel ---------------- */
  function msgFolders() {
    const nodes = [...document.querySelectorAll('[id$="ListGridSelectionTree"] .TreeNode-container')];
    return nodes.map((n, i) => {
      const a = n.querySelector('a.TreeNode');
      const title = (n.querySelector('.TreeNode-title')?.textContent || '').trim();
      const indent = parseFloat(n.querySelector('.TreeNode-indent')?.style.width || '0') || 0;
      return { i, a, title, indent, selected: !!a && a.classList.contains('selectedFolder') };
    }).filter((f) => f.a && f.title);
  }
  function parseThread(doc) {
    const msgs = [...doc.querySelectorAll('[id="GridRowMessage"]')].filter((m) => /\d{1,2}-\d{1,2}-\d{4}/.test(m.querySelector('.message-thread-message-sender')?.textContent || '')).map((m) => {
      const s = (m.querySelector('.message-thread-message-sender')?.textContent || '').trim().replace(/\s+/g, ' ');
      const sm = s.match(/^(.*),\s*(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/);
      const date = sm ? new Date(+sm[4], +sm[3] - 1, +sm[2], +sm[5], +sm[6]) : null;
      const body = m.querySelector('.message-thread-message-content');
      return {
        from: sm ? sm[1].trim() : s,
        date,
        title: (m.querySelector('.message-thread-message-header')?.textContent || '').trim(),
        html: body ? safeHtml(body, location.origin + BASE) : ''
      };
    });
    const rec = doc.querySelector('[id$="RecipientsReadMode"]');
    const to = rec ? ([...rec.querySelectorAll(':scope > span, :scope > a')].map((x) => x.textContent.trim()).filter(Boolean).join(', ') || rec.textContent.trim()) : '';
    const locked = !!doc.querySelector('.thread-header-content-recipients .grayed-out');
    return { msgs, to, locked, subject: msgs[0]?.title || '' };
  }
  function fmtWhen(d, now = new Date()) {
    if (!d) return '';
    if (sameDay(d, now)) return `i dag kl. ${hm(d)}`;
    const diff = Math.round((startOfDay(now) - startOfDay(d)) / 864e5);
    if (diff === 1) return `i går kl. ${hm(d)}`;
    return `${d.getDate()}. ${MONTHS[d.getMonth()].slice(0, 3)}${d.getFullYear() !== now.getFullYear() ? ' ' + d.getFullYear() : ''} kl. ${hm(d)}`;
  }
  function renderMessagesView(app) {
    const list = parseMessages(document);
    const folders = msgFolders();
    const main = folders.filter((f) => f.indent === 0).slice(0, 6);
    const rest = folders.filter((f) => !main.includes(f));
    const cur = folders.find((f) => f.selected);
    const proxy = (re) => [...document.querySelectorAll('#s_m_outerContentFrameDiv a, #s_m_outerContentFrameDiv input[type="submit"]')].find((a) => re.test((a.textContent || a.value || '').trim()));
    const newBtn = document.getElementById('s_m_Content_Content_NewMessageLnk') || proxy(/^Ny besked$/i);
    const allRead = proxy(/^Alle læst$/i);
    const idOf = (m) => ((m.href || '').match(/[?&]id=(\d+)/) || [])[1];
    app.classList.add('lp-msgview');
    app.innerHTML = `
      <header class="lp-vhead">
        <div><h1>Beskeder</h1><p class="lp-date">${esc(cur ? cur.title : 'Indbakke')}, ${list.length} ${list.length === 1 ? 'tråd' : 'tråde'}</p></div>
        <div class="lp-vhead-actions">
          ${allRead ? '<button type="button" class="lp-btn" data-act="allread">Markér alle som læst</button>' : ''}
          ${newBtn ? '<button type="button" class="lp-btn lp-btn-main" data-act="new">Ny besked</button>' : ''}
          <a class="lp-btn lp-btn-ghost" href="${esc(origLink())}">Lectios visning</a>
        </div>
      </header>
      <div class="lp-mfolders">
        ${main.map((f) => `<button type="button" class="lp-fchip${f.selected ? ' is-on' : ''}" data-f="${f.i}"${f.selected ? ' aria-current="true"' : ''}>${esc(f.title.replace(/^Alle /, '').replace(/^./, (c) => c.toUpperCase()))}</button>`).join('')}
        ${rest.length ? `<select class="lp-fselect" aria-label="Andre mapper"><option value="">${rest.some((f) => f.selected) ? '' : 'Hold og grupper'}</option>${rest.map((f) => `<option value="${f.i}"${f.selected ? ' selected' : ''}>${'  '.repeat(Math.min(3, Math.round(f.indent / 16)))}${esc(f.title)}</option>`).join('')}</select>` : ''}
        <input type="search" class="lp-msearch" placeholder="Filtrér i mappen" aria-label="Filtrér beskeder">
      </div>
      <div class="lp-mpanes">
        <div class="lp-mlist" role="list">${list.length ? list.map((m, i) => `
          <a class="lp-mitem${m.unread ? ' is-unread' : ''}" role="listitem" href="${esc(m.href || '#')}" data-i="${i}">
            <span class="lp-mi-top"><strong>${esc(m.from)}</strong><small>${esc(m.changed)}</small></span>
            <span class="lp-mi-subj">${esc(m.subject)}</span>
            <span class="lp-mi-to">Til ${esc(m.to)}</span>
          </a>`).join('') : '<p class="lp-empty">Ingen beskeder i denne mappe.</p>'}</div>
        <div class="lp-mread" aria-live="polite"><p class="lp-empty">Vælg en besked for at læse den her.</p></div>
      </div>`;
    app.querySelector('[data-act=new]')?.addEventListener('click', () => newBtn.click());
    app.querySelector('[data-act=allread]')?.addEventListener('click', () => allRead.click());
    app.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => folders[+b.dataset.f]?.a.click()));
    app.querySelector('.lp-fselect')?.addEventListener('change', (e) => { const f = folders[+e.target.value]; if (f) f.a.click(); });
    app.querySelector('.lp-msearch').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      app.querySelectorAll('.lp-mitem').forEach((el) => { el.hidden = q && !el.textContent.toLowerCase().includes(q); });
    });
    const reader = app.querySelector('.lp-mread');
    const wide = () => app.querySelector('.lp-mpanes').clientWidth > 860;
    let token = 0;
    const openThread = (i) => {
      const m = list[i];
      const id = idOf(m);
      if (!id) return false;
      app.querySelectorAll('.lp-mitem').forEach((el) => el.classList.toggle('is-sel', +el.dataset.i === i));
      const t = ++token;
      reader.innerHTML = `<div class="lp-mhead"><h2>${esc(m.subject)}</h2><p>${esc(m.from)}, ${esc(m.changed)}</p></div><p class="lp-dr-loading">Henter beskeden</p>`;
      fetchDoc('beskeder2.aspx?type=visbesked&id=' + id).then((doc) => {
        if (t !== token) return;
        const th = parseThread(doc);
        delete memo['beskeder2.aspx?type=visbesked&id=' + id];
        app.querySelector(`.lp-mitem[data-i="${i}"]`)?.classList.remove('is-unread');
        if (m.unread && cache.msgs) { const cm = cache.msgs.d.find((x) => idOf(x) === id); if (cm) { cm.unread = false; cachePut('msgs', cache.msgs.d); } }
        reader.innerHTML = `
          <div class="lp-mhead">
            <h2>${esc(th.subject || m.subject)}</h2>
            <p>Til ${esc(th.to || m.to)}</p>
            <div class="lp-mactions">
              ${th.locked ? '<span class="lp-muted">Tråden kan ikke besvares</span>' : `<a class="lp-btn lp-btn-main" href="${esc(m.href)}">Svar</a>`}
              <a class="lp-btn lp-btn-ghost" href="${esc(m.href)}">Åbn i Lectio</a>
            </div>
          </div>
          ${th.msgs.map((x) => `<article class="lp-mmsg">
            <header><strong>${esc(x.from)}</strong><small>${esc(fmtWhen(x.date))}</small></header>
            ${x.title && x.title !== th.subject ? `<h3>${esc(x.title)}</h3>` : ''}
            <div class="lp-mbody">${x.html}</div></article>`).join('')}`;
        reader.scrollTop = 0;
      }).catch(() => { if (t === token) reader.innerHTML = `<p class="lp-empty">Beskeden kunne ikke hentes. <a href="${esc(m.href)}">Åbn den i Lectio</a>.</p>`; });
      return true;
    };
    app.querySelector('.lp-mlist').addEventListener('click', (e) => {
      const a = e.target.closest('.lp-mitem');
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey || !wide()) return;
      if (openThread(+a.dataset.i)) e.preventDefault();
    });
    const firstUnread = list.findIndex((m) => m.unread);
    if (wide() && list.length) openThread(firstUnread >= 0 ? firstUnread : 0);
  }

  /* ---------------- opgaveaflevering ---------------- */
  function enhanceAssignmentPage() {
    const root = document.querySelector('.ls-elevaflevering-root');
    if (!root || document.getElementById('lp-afl')) return;
    const info = {};
    let descHtml = '';
    document.querySelectorAll('table.ls-std-table-inputlist tr').forEach((tr) => {
      const cells = [...tr.cells];
      if (cells.length < 2) return;
      const k = cells[0].textContent.trim().replace(/:$/, '').toLowerCase();
      const v = cells[cells.length - 1];
      info[k] = v.textContent.trim().replace(/\s+/g, ' ').replace(/^[^:]+:\s*/, (x) => (x.toLowerCase().startsWith(k) ? '' : x));
      if (k.startsWith('opgavebeskrivelse')) descHtml = safeHtml(v, location.href);
    });
    const st = document.querySelector('[id$="StudentGV"]');
    const sRow = st && st.rows[1] ? [...st.rows[1].cells].map((c) => c.textContent.trim().replace(/\s+/g, ' ').replace(/^[^:]+:\s*/, '')) : [];
    const status = (sRow[3] || '').split('/')[0].trim();
    const waiting = sRow[2] || '';
    const grade = sRow[5] || '';
    const gradeNote = sRow[6] || '';
    const fm = (info.afleveringsfrist || '').match(/(\d{1,2})\/(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/);
    const due = fm ? new Date(+fm[3], +fm[2] - 1, +fm[1], +fm[4], +fm[5]) : null;
    const now = new Date();
    const subj = subjectFrom(info.hold || '');
    const done = /afleveret/i.test(status);
    const fact = (label, val, cls = '') => (val ? `<div class="${cls}"><dt>${label}</dt><dd>${val}</dd></div>` : '');
    const box = document.createElement('section');
    box.id = 'lp-afl';
    box.className = 'lp-afl';
    box.style.setProperty('--h', hueFor(subj?.code));
    box.innerHTML = `
      <p class="lp-afl-subj">${subjDot(subj?.code)}${esc(subj?.name || info.hold || 'Opgave')}${info.hold && subj ? `<small>${esc(info.hold)}</small>` : ''}</p>
      <h1>${esc(info.opgavetitel || 'Opgave')}</h1>
      <dl class="lp-afl-facts">
        ${fact('Frist', due ? `${esc(cap(DAYS[due.getDay()]))} ${due.getDate()}. ${esc(MONTHS[due.getMonth()])} kl. ${hm(due)} ${done ? '' : dueText(due, status, now)}` : esc(info.afleveringsfrist || ''))}
        ${fact('Status', `<span class="lp-chip ${done ? 'is-ok' : /mangler/i.test(status) ? 'is-danger' : ''}">${esc(status || 'Ikke afleveret')}</span>`)}
        ${fact('Afventer', esc(waiting))}
        ${fact('Karakter', esc(grade), 'is-grade')}
        ${fact('Elevtid', esc(info.elevtid || ''))}
        ${fact('Ansvarlig', esc(info.ansvarlig || ''))}
      </dl>
      ${descHtml && descHtml.replace(/<[^>]+>/g, '').trim() ? `<div class="lp-afl-desc"><h2>Opgavebeskrivelse</h2><div class="lp-act">${descHtml}</div></div>` : ''}
      ${info.opgavenote ? `<div class="lp-afl-desc"><h2>Note fra læreren</h2><p class="lp-pre">${esc(info.opgavenote)}</p></div>` : ''}
      ${gradeNote ? `<div class="lp-afl-desc"><h2>Karakternote</h2><p class="lp-pre">${esc(gradeNote)}</p></div>` : ''}
      ${done ? '' : '<a class="lp-btn lp-btn-main lp-afl-go" href="#lp-afl-upload">Gå til aflevering</a>'}`;
    root.parentNode.insertBefore(box, root);
    document.documentElement.classList.add('lp-aflpage');
    if (info.opgavetitel) root.classList.add('lp-afl-hasinfo');
    const sections = [...root.querySelectorAll('section.lf-island')];
    sections.forEach((s) => {
      const h = (s.querySelector('.islandHeader')?.textContent || '').trim();
      if (/^Opgaveoplysninger/i.test(h)) s.classList.add('lp-afl-info');
      if (/^Opgaveindlæg/i.test(h)) {
        s.id = 'lp-afl-upload'; s.classList.add('lp-afl-entries');
        const hh = s.querySelector('.islandHeader'); if (hh) hh.textContent = 'Aflevering og feedback';
      }
      if (/^Afleveres af/i.test(h)) {
        s.classList.add('lp-afl-students');
        const editable = s.querySelector('input:not([type="hidden"]):not([disabled]), textarea, select');
        if (!editable && info.opgavetitel) s.classList.add('lp-afl-redundant');
      }
    });
    const entries = root.querySelector('.lp-afl-entries');
    const students = root.querySelector('.lp-afl-students');
    if (entries && students) {
      let a = entries; let b = students;
      while (a.parentElement && !a.parentElement.contains(students)) a = a.parentElement;
      while (b.parentElement && b.parentElement !== a.parentElement) b = b.parentElement;
      if (a.parentElement === b.parentElement && a !== b) a.parentElement.insertBefore(a, b);
    }
  }

  /* ---------------- studieplan: forløb pr. hold ---------------- */
  function parseStudyPlan(doc) {
    const t = doc.querySelector('[id$="spUge_theTable"]');
    if (!t || t.rows.length < 2) return null;
    const holdAt = [];
    [...t.rows[0].cells].forEach((c) => { for (let k = 0; k < c.colSpan; k++) holdAt.push(c.textContent.trim()); });
    const cells = [...t.rows[1].cells];
    const top = (el) => parseFloat(el.style.top) || 0;
    const weeks = [...(cells[1]?.children || [])].map((w) => ({ n: +w.textContent.trim() || null, top: top(w), h: parseFloat(w.style.height) || 21 })).filter((w) => w.n);
    const weekAt = (y) => { let r = weeks[0]; for (const w of weeks) { if (w.top <= y + 1) r = w; else break; } return r ? r.n : null; };
    const thisWeekEl = t.querySelector('.thisWeek');
    const nowY = thisWeekEl ? top(thisWeekEl) + 1 : null;
    const holds = new Map();
    cells.forEach((c, i) => {
      if (!/phaseCol/.test(c.className)) return;
      const name = holdAt[i];
      if (!name || /^(måned|uge|elevtid)$/i.test(name)) return;
      if (!holds.has(name)) holds.set(name, []);
      c.querySelectorAll('.phase').forEach((p) => {
        const a = p.querySelector('a');
        const y = top(p); const hgt = parseFloat(p.style.height) || 21;
        const title = (a ? a.textContent : p.textContent).trim().replace(/\s+/g, ' ');
        if (!title) return;
        holds.get(name).push({ title, href: abs(a?.getAttribute('href')), y, y2: y + hgt, from: weekAt(y), to: weekAt(y + hgt - 2) });
      });
    });
    return { nowY, holds: [...holds.entries()].map(([name, phases]) => ({ name, phases: phases.sort((a, b) => a.y - b.y) })) };
  }
  function renderStudyPlanView(app) {
    const sp = parseStudyPlan(document);
    if (!sp) return false;
    const range = (p) => (p.from && p.to && p.from !== p.to ? `uge ${p.from} til ${p.to}` : p.from ? `uge ${p.from}` : '');
    const cards = sp.holds.filter((h) => h.phases.length).map((h) => {
      const s = subjectFrom(h.name);
      const y = sp.nowY;
      const cur = y != null ? h.phases.find((p) => p.y <= y && y < p.y2) : null;
      const next = y != null ? h.phases.find((p) => p.y > y) : null;
      const past = y != null ? h.phases.filter((p) => p.y2 <= y) : [];
      const later = y != null ? h.phases.filter((p) => p.y > y && p !== next) : h.phases;
      const prog = cur ? Math.round(((y - cur.y) / (cur.y2 - cur.y)) * 100) : 0;
      const item = (p) => `<li><a href="${esc(p.href || '#')}">${esc(p.title)}</a><small>${esc(range(p))}</small></li>`;
      return `<section class="lp-card lp-sp" style="--h:${hueFor(s?.code || h.name)}">
        <header class="lp-card-head"><h2>${subjDot(s?.code || h.name)}${esc(s?.name || h.name)}</h2><small>${esc(h.name)}</small></header>
        <div class="lp-card-body">
          ${cur ? `<div class="lp-sp-now"><span>Nu</span><a href="${esc(cur.href || '#')}"><strong>${esc(cur.title)}</strong></a><small>${esc(range(cur))}</small><span class="lp-progress"><i style="width:${prog}%"></i></span></div>` : '<p class="lp-empty lp-sp-none">Intet forløb lige nu.</p>'}
          ${next ? `<div class="lp-sp-next"><span>Næste</span><a href="${esc(next.href || '#')}">${esc(next.title)}</a><small>${esc(range(next))}</small></div>` : ''}
          ${past.length || later.length ? `<details class="lp-sp-more"><summary>Alle forløb (${h.phases.length})</summary>
            ${past.length ? `<p class="lp-sp-group">Tidligere</p><ul>${past.map(item).join('')}</ul>` : ''}
            ${later.length ? `<p class="lp-sp-group">Senere</p><ul>${later.map(item).join('')}</ul>` : ''}</details>` : ''}
        </div></section>`;
    });
    app.innerHTML = viewHead('Studieplan', 'Forløb i dine hold lige nu og hvad der kommer') +
      (cards.length ? `<div class="lp-spgrid">${cards.join('')}</div>` : '<p class="lp-empty">Studieplanen er tom.</p>');
    return true;
  }

  /* ---------------- oprydning på Lectios egne sider ---------------- */
  function tidyLectioPage() {
    const t = document.getElementById('s_m_HeaderContent_MainTitle') || document.querySelector('[id$="HeaderContent_MainTitle"], .maintitle');
    if (!t) return;
    const m = t.textContent.trim().match(TITLE_RE);
    if (m) t.textContent = m[4].trim();
  }
  function lum(c) {
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
  }
  const OWN_UI = '#lp-side, #lp-app, #lp-drawer, #lp-palette, #lp-topbar, #lp-pill, #lp-scrim, #lp-afl';
  // Finder lyse flader og mørk tekst i Lectios egne sider og farver dem om i mørk tilstand.
  function darkFix(root) {
    const html = document.documentElement;
    if (html.getAttribute('data-lp-theme') !== 'dark' || !html.classList.contains('lp-on') || html.classList.contains('lp-takeover')) return;
    root = root || document.getElementById('masterContent') || document.body;
    if (!root || root.nodeType !== 1 || root.closest(OWN_UI)) return;
    const els = [root, ...root.getElementsByTagName('*')];
    for (const el of els) {
      if (el.id && el.id.startsWith('lp-')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      const b = lum(cs.backgroundColor);
      if (b != null && b > 0.72) el.classList.add('lp-dk-bg');
      const f = lum(cs.color);
      if (f != null && f < 0.4) el.classList.add(el.tagName === 'A' || el.closest('a') ? 'lp-dk-link' : 'lp-dk-fg');
      if (parseFloat(cs.borderTopWidth) || parseFloat(cs.borderLeftWidth)) {
        const bd = lum(parseFloat(cs.borderTopWidth) ? cs.borderTopColor : cs.borderLeftColor);
        if (bd != null && bd > 0.6) el.classList.add('lp-dk-bd');
      }
    }
  }
  // Holder øje med det Lectio selv ændrer på siden og retter kun de nye dele.
  let lectioChange = null;
  let lectioSig = '';
  function watchPage() {
    const target = document.getElementById('masterContent') || document.body;
    const pending = new Set();
    let timer = null;
    new MutationObserver((muts) => {
      let header = false;
      for (const m of muts) {
        if (m.target.nodeType === 1 && m.target.closest('.ls-master-pageheader')) header = true;
        for (const n of m.addedNodes) if (n.nodeType === 1 && !n.closest(OWN_UI)) pending.add(n);
      }
      if (header) tidyLectioPage();
      if (!pending.size) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const nodes = [...pending];
        pending.clear();
        if (PAGE.startsWith('beskeder')) enhanceMessages();
        if (lectioChange) {
          const t = document.querySelector('table[id*="threadGV"]');
          const sig = (t ? t.textContent.length + ':' + t.rows.length : '') + (document.querySelector('.selectedFolder')?.textContent || '');
          if (sig !== lectioSig) { lectioSig = sig; lectioChange(); }
        }
        idle(() => nodes.forEach((n) => { if (n.isConnected) darkFix(n); }), 500);
      }, 120);
    }).observe(target, { childList: true, subtree: true });
  }

  /* ---------------- start ---------------- */
  function saveBoot() {
    try { localStorage.setItem('lp-boot', JSON.stringify({ enabled: settings.enabled, theme: settings.theme, dashboard: settings.dashboard, skema: settings.skema, views: settings.views })); } catch (e) { /* ignorer */ }
  }
  // Gemmer data fra den side man står på, så andre sider ikke skal hente dem igen.
  function primeCache(params) {
    const q = [...params.keys()];
    try {
      if (PAGE === 'opgaverelev.aspx' && !q.length) cachePut('tasks', parseAssignments(document));
      if (PAGE === 'material_lektieoversigt.aspx' && !q.length) cachePut('hw', parseHomework(document));
      if (PAGE === 'beskeder2.aspx' && (!q.length || params.get('mappeid') === '-70')) { const m = parseMessages(document); if (m.length) cachePut('msgs', m); }
      if (PAGE === 'subnav/fravaerelev.aspx' && !q.length) { const a = parseAbsence(document); if (a) cachePut('abs', a); }
      if (PAGE === 'grades/grade_report.aspx' && !q.length) { const g = parseGrades(document); if (g.length) cachePut('grades', g); }
      if (PAGE === 'skemany.aspx' && q.every((k) => k === 'week')) {
        const sk = parseSkema(document);
        const wk = params.get('week');
        if (sk) cachePut(wk && /^\d{6}$/.test(wk) ? 'skema:' + wk : skemaKey(new Date()), sk);
      }
      if (PAGE === 'forside.aspx' && !q.length) cachePut('front', parseFront(document));
    } catch (e) { console.warn('[Lectio+]', e); }
  }
  // Holder badges friske uden at belaste Lectio: højst én lille hentning pr. side.
  function refreshStale() {
    const k = ['msgs', 'tasks', 'hw', 'front'].find((key) => !isFresh(key, TTL[key] * 2));
    if (!k) return;
    const go = () => idle(() => fetchDoc(SOURCES[k].path).then(SOURCES[k].parse).then((d) => cachePut(k, d)).catch(() => {}), 3000);
    if (document.readyState === 'complete') setTimeout(go, 1200); else addEventListener('load', () => setTimeout(go, 1200), { once: true });
  }

  async function init() {
    try { localStorage.removeItem('lp-test-code'); localStorage.removeItem('lp-dev-code'); } catch (e) { /* oprydning efter test */ }
    settings = await loadSettings();
    saveBoot();
    applyTheme();
    const html = document.documentElement;
    const params = new URLSearchParams(location.search);
    if (!settings.enabled) { html.classList.remove('lp-on', 'lp-takeover', 'lp-boot'); return; }
    if (sessionStorage.getItem('lp-original') === '1' || params.get('lp') === 'orig') {
      html.classList.remove('lp-on', 'lp-takeover', 'lp-boot');
      if (params.get('lp') === 'orig') html.classList.add('lp-lite');
      originalPill();
      return;
    }
    html.classList.add('lp-on');
    document.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('a[href*="logout.aspx"]')) { try { sessionStorage.removeItem(CACHE_KEY); sessionStorage.removeItem('lp-user:' + SCHOOL); } catch (er) { /* ignorer */ } }
    }, true);

    const onlyWeek = [...params.keys()].every((k) => k === 'week');
    const noParams = [...params.keys()].length === 0;
    let takeover = null;
    if (settings.dashboard && PAGE === 'forside.aspx' && noParams) takeover = 'dashboard';
    if (settings.skema && PAGE === 'skemany.aspx' && onlyWeek && document.querySelector('table.s2skema')) takeover = 'skema';
    if (settings.views && noParams) {
      if (PAGE === 'opgaverelev.aspx' && document.querySelector('#s_m_Content_Content_ExerciseGV')) takeover = 'opgaver';
      if (PAGE === 'material_lektieoversigt.aspx' && document.querySelector('#s_m_Content_Content_MaterialLektieOverblikGV')) takeover = 'lektier';
      if (PAGE === 'subnav/fravaerelev.aspx' && document.querySelector('table[id$="SFTabStudentAbsenceDataTable"]')) takeover = 'fravaer';
      if (PAGE === 'grades/grade_report.aspx' && parseGrades(document).length) takeover = 'karakterer';
    }
    if (settings.views && PAGE === 'beskeder2.aspx' && [...params.keys()].every((k) => k === 'mappeid') &&
        document.querySelector('table[id*="threadGV"]') && !document.querySelector('textarea, [id$="ViewThreadPagePanel"] .message-thread-container')) takeover = 'beskeder';
    if (settings.views && PAGE === 'studieplan.aspx' && [...params.keys()].every((k) => k === 'displaytype') && params.get('displaytype') === 'ugeteksttabel' &&
        document.querySelector('[id$="spUge_theTable"] .phase')) takeover = 'studieplan';
    if (takeover) html.classList.add('lp-takeover'); else html.classList.remove('lp-takeover');

    primeCache(params);
    buildSidebar();
    tidyLectioPage();
    if (!takeover) darkFix();
    watchPage();
    html.classList.remove('lp-boot');

    if (takeover) {
      const app = document.createElement('main');
      app.id = 'lp-app';
      document.body.appendChild(app);
      if (takeover === 'dashboard') renderDashboard(app);
      else if (takeover === 'opgaver') renderTasksView(app);
      else if (takeover === 'lektier') renderHomeworkView(app);
      else if (takeover === 'fravaer') renderAbsenceView(app);
      else if (takeover === 'karakterer') renderGradesView(app);
      else if (takeover === 'beskeder') { renderMessagesView(app); const t0 = document.querySelector('table[id*="threadGV"]'); lectioSig = (t0 ? t0.textContent.length + ':' + t0.rows.length : '') + (document.querySelector('.selectedFolder')?.textContent || ''); lectioChange = () => renderMessagesView(app); }
      else if (takeover === 'studieplan') { if (!renderStudyPlanView(app)) { html.classList.remove('lp-takeover'); app.remove(); } }
      else {
        const wk = params.get('week');
        let d = new Date();
        if (wk && /^\d{6}$/.test(wk)) { d = mondayOf(new Date(+wk.slice(2), 0, 4)); d.setDate(d.getDate() + (+wk.slice(0, 2) - 1) * 7); }
        let cur = d;
        renderWeek(app, cur);
        document.addEventListener('keydown', (e) => {
          if (!e.altKey || !/Arrow(Left|Right)/.test(e.key) || drawerState) return;
          e.preventDefault();
          cur = new Date(cur.getTime() + (e.key === 'ArrowLeft' ? -7 : 7) * 864e5);
          history.replaceState(null, '', `${BASE}SkemaNy.aspx?week=${weekParam(cur)}`);
          renderWeek(app, cur);
        });
      }
    } else {
      if (PAGE === 'opgaverelev.aspx') enhanceAssignments();
      if (PAGE.startsWith('beskeder')) enhanceMessages();
      if (PAGE === 'elevaflevering.aspx') enhanceAssignmentPage();
    }
    if (takeover !== 'dashboard') refreshStale();
  }

  if (hasChrome && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((ch) => {
      if (ch.theme && Object.keys(ch).length === 1) { settings.theme = ch.theme.newValue; saveBoot(); applyTheme(); return; }
      if (ch.hideDone && Object.keys(ch).length === 1) return;
      location.reload();
    });
  }

  init();
})();
