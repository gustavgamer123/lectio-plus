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
  // Mangler en af filerne i src/, vises almindeligt Lectio i stedet for et startdække uden menu.
  const LP = globalThis.LP;
  if (!LP || !['esc', 'hueFor', 'parseSkema', 'ICONS', 'activeKey', 'buildShell', 'darkFix', 'markEmptyRows', 'markCategoryCells', 'gradeAverage', 'alldayHeight'].every((k) => LP[k])) {
    document.documentElement.classList.remove('lp-on', 'lp-takeover', 'lp-boot');
    return;
  }

  /* ---------------- indstillinger ---------------- */
  const DEFAULTS = { enabled: true, theme: 'auto', dashboard: true, skema: true, views: true, hideDone: false, colors: {} };
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
  const { esc, pad, hm, DAYS, MONTHS, sameDay, startOfDay, num, isoWeek, weekParam, mondayOf, dayLabel, relTime } = LP;
  const abs = (href) => LP.abs(href, BASE);

  /* fag, farver og parsere ligger i src/lib */
  const { SUBJECTS, SWATCHES, subjectFrom, shortTeacher, cleanText, safeHtml, parseTip, parseAbsence, parseGrades } = LP;
  const hueFor = (s) => LP.hueFor(s, settings.colors);
  const parseSkema = (d) => LP.parseSkema(d, BASE);
  const parseAssignments = (d) => LP.parseAssignments(d, BASE);
  const parseHomework = (d) => LP.parseHomework(d, BASE);
  const parseMessages = (d) => LP.parseMessages(d, BASE);
  const parseFront = (d) => LP.parseFront(d, BASE);

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
    if (key === 'front' && shell) shell.setHold((data && data.hold) || []);
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

  /* ---------------- ikoner ---------------- */
  const { ICONS } = LP;

  /* ---------------- navigation ---------------- */
  const { NAV_MORE, MORE_ITEMS, PAL_ONLY } = LP;
  const NAV_MAIN = LP.NAV_TABS;
  const NAV_SECOND = [];
  const activeKey = () => LP.activeKey(PAGE, location.search);

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
    if (shell) shell.setTheme(t);
    if (t === 'dark' && typeof darkFix === 'function' && document.documentElement.classList.contains('lp-on')) setTimeout(darkFix, 0);
  }
  mq.addEventListener?.('change', applyTheme);

  /* ---------------- skal: topbjælke og faner ---------------- */
  let shell = null;
  function onTheme() {
    const cur = document.documentElement.getAttribute('data-lp-theme');
    settings.theme = cur === 'dark' ? 'light' : 'dark';
    saveSetting('theme', settings.theme);
    saveBoot();
    applyTheme();
  }
  function onOriginal() {
    sessionStorage.setItem('lp-original', '1');
    location.reload();
  }
  const setBadge = (key, n) => shell && shell.setBadge(key, n);
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
        if (b.dataset.dr === 'color') {
          const box = b.closest('.lp-dr-body').querySelector('.lp-dr-colors');
          box.hidden = !box.hidden; b.setAttribute('aria-expanded', !box.hidden);
          return;
        }
        if (b.dataset.dr === 'x') closeModal(); else stepLesson(+b.dataset.dr);
      });
      document.documentElement.classList.add('lp-drawer-open');
    }
    const p = dr.querySelector('.lp-dr-panel');
    const live = !l.cancelled && !l.allDay && l.start <= now && now < l.end;
    const flag = l.cancelled ? '<span class="lp-tag is-danger">aflyst</span>' : l.changed ? '<span class="lp-tag is-warn">ændret</span>' : live ? '<span class="lp-tag is-ok">i gang</span>' : '';
    const when = `${esc(cap(DAYS[l.start.getDay()]))} ${l.start.getDate()}. ${esc(MONTHS[l.start.getMonth()])}${l.allDay ? ', hele dagen' : ` <span class="lp-mono">${hm(l.start)}–${hm(l.end)}</span>`}`;
    const meta = [l.room ? `<div><dt>Lokale</dt><dd>${esc(l.room)}</dd></div>` : '', l.teacher ? `<div><dt>${/,/.test(l.teacher) ? 'Lærere' : 'Lærer'}</dt><dd>${esc(l.teacher)}</dd></div>` : '', l.hold ? `<div><dt>Hold</dt><dd>${esc(l.hold)}</dd></div>` : ''].join('');
    const drName = l.title || l.subject?.name || l.hold || 'Aktivitet';
    const prevL = seq[idx - 1];
    const nextL = seq[idx + 1];
    const navLabel = (x) => (x ? `${x.subject?.name || x.title || 'Aktivitet'}, ${dayLabel(x.start, now)}${x.allDay ? '' : ' ' + hm(x.start)}` : '');
    const tipBlock = (title, txt) => (txt ? `<section><h4 class="lp-c-head">${title}</h4><p class="lp-pre">${esc(txt.replace(/\s*\[\.\.\.\]\s*/g, ' ...'))}</p></section>` : '');
    const fromTip = tipBlock('Note', l.note) + tipBlock('Lektier', l.homework) + tipBlock('Øvrigt indhold', l.other);
    const code = l.subject?.code;
    p.style.setProperty('--h', hueFor(code || l.title));
    if (code) p.dataset.hc = code; else delete p.dataset.hc;
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
        <div class="lp-dr-subj"><h2>${subjDot(code || l.title)}${esc(drName)}</h2>${flag}${code ? `<button type="button" class="lp-dr-colbtn" data-dr="color" aria-expanded="false" title="Skift farve på alle ${esc(l.subject.name)}-timer">${ICONS.palette}Farve</button>` : ''}</div>
        ${code ? `<div class="lp-dr-colors" hidden>${swatchRow(code, l.subject.name)}</div>` : ''}
        <p class="lp-dr-when">${l.subject && l.subject.name !== drName ? `${esc(l.subject.name)}, ` : ''}${when}</p>
        ${live ? `<span class="lp-progress"><i style="width:${Math.round(((now - l.start) / (l.end - l.start)) * 100)}%"></i></span>` : ''}
        ${meta ? `<dl class="lp-fields">${meta}</dl>` : ''}
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
  const hc = (code) => (code ? ` data-hc="${esc(code)}"` : '');
  const subjDot = (code) => `<i class="lp-sd"${hc(code)} style="--h:${hueFor(code)}"></i>`;

  /* ---------------- egne farver til fag ---------------- */
  // Række med farveprøver til ét fag. Klik håndteres samlet nedenfor.
  const swatchRow = (code, name) => {
    const own = settings.colors && typeof settings.colors[code] === 'number' ? settings.colors[code] : null;
    return `<div class="lp-swatches" data-code="${esc(code)}" role="group" aria-label="Farve til ${esc(name || code)}">
      <div class="lp-sw-grid">${SWATCHES.map((h, i) => `<button type="button" class="lp-sw${own === h ? ' is-on' : ''}" data-sw="${h}" style="--h:${h}" aria-pressed="${own === h}" aria-label="Farve ${i + 1}"></button>`).join('')}</div>
      <button type="button" class="lp-sw-reset${own == null ? ' is-on' : ''}" data-sw="" aria-pressed="${own == null}">Standardfarve</button>
    </div>`;
  };
  function repaintColors() {
    document.querySelectorAll('[data-hc]').forEach((el) => el.style.setProperty('--h', hueFor(el.dataset.hc)));
    document.querySelectorAll('.lp-swatches[data-code]').forEach((row) => {
      const own = settings.colors ? settings.colors[row.dataset.code] : undefined;
      row.querySelectorAll('[data-sw]').forEach((b) => {
        const on = b.dataset.sw === '' ? typeof own !== 'number' : +b.dataset.sw === own;
        b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on);
      });
    });
    document.querySelectorAll('.lp-col-row [data-own]').forEach((s) => { s.textContent = typeof settings.colors?.[s.dataset.own] === 'number' ? 'Egen farve' : ''; });
    const rb = document.querySelector('#lp-colors [data-col="reset"]');
    if (rb) rb.disabled = !Object.keys(settings.colors || {}).length;
  }
  function setColor(code, h) {
    const c = { ...(settings.colors || {}) };
    if (h == null) delete c[code]; else c[code] = h;
    settings.colors = c;
    saveSetting('colors', c);
    repaintColors();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-sw]');
    if (!b) return;
    const row = b.closest('.lp-swatches[data-code]');
    if (row) setColor(row.dataset.code, b.dataset.sw === '' ? null : +b.dataset.sw);
  });
  // Fag fra skemaet, ens hold og dem man allerede har farvet.
  function knownSubjects(lessons = []) {
    const map = new Map();
    const add = (s) => { if (s && s.code && !map.has(s.code)) map.set(s.code, s.name || s.code); };
    lessons.forEach((l) => add(l.subject));
    (cache.front?.d?.hold || []).forEach((h) => add(subjectFrom(h.name)));
    Object.keys(settings.colors || {}).forEach((code) => add({ code, name: SUBJECTS[code] || code }));
    return [...map].map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name, 'da'));
  }
  function closeColors() {
    const p = document.getElementById('lp-colors');
    if (!p) return;
    p.remove();
    document.querySelector('[data-act="colors"]')?.setAttribute('aria-expanded', 'false');
  }
  function toggleColors(btn, lessons) {
    if (document.getElementById('lp-colors')) { closeColors(); return; }
    const subs = knownSubjects(lessons);
    const pop = document.createElement('div');
    pop.id = 'lp-colors';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Farver til fag');
    pop.innerHTML = `<header><h3>Farver til fag</h3><button type="button" class="lp-icon-btn" data-col="x" aria-label="Luk">${ICONS.x}</button></header>
      <p class="lp-col-help">Vælg en farve til et fag. Den bruges i skemaet og alle andre steder i Lectio+.</p>
      ${subs.length ? `<ul class="lp-col-list">${subs.map((s) => `<li>
        <button type="button" class="lp-col-row" aria-expanded="false">${subjDot(s.code)}<span>${esc(s.name)}</span><small data-own="${esc(s.code)}">${typeof settings.colors?.[s.code] === 'number' ? 'Egen farve' : ''}</small></button>
        ${swatchRow(s.code, s.name)}</li>`).join('')}</ul>` : '<p class="lp-empty">Ingen fag fundet i denne uge.</p>'}
      <footer><button type="button" class="lp-btn lp-btn-ghost" data-col="reset"${Object.keys(settings.colors || {}).length ? '' : ' disabled'}>Nulstil alle farver</button></footer>`;
    btn.closest('.lp-vhead').appendChild(pop);
    btn.setAttribute('aria-expanded', 'true');
    const openRow = (li) => {
      pop.querySelectorAll('.lp-col-list li').forEach((x) => { const on = x === li && !x.classList.contains('is-open'); x.classList.toggle('is-open', on); x.querySelector('.lp-col-row').setAttribute('aria-expanded', on); });
    };
    pop.addEventListener('click', (e) => {
      const r = e.target.closest('.lp-col-row');
      if (r) { openRow(r.closest('li')); return; }
      const a = e.target.closest('[data-col]');
      if (!a) return;
      if (a.dataset.col === 'x') closeColors();
      if (a.dataset.col === 'reset') { settings.colors = {}; saveSetting('colors', {}); repaintColors(); }
    });
    pop.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeColors(); btn.focus(); } });
    setTimeout(() => {
      const away = (e) => {
        if (!document.getElementById('lp-colors')) { document.removeEventListener('pointerdown', away, true); return; }
        if (e.target.closest('#lp-colors, [data-act="colors"]')) return;
        closeColors(); document.removeEventListener('pointerdown', away, true);
      };
      document.addEventListener('pointerdown', away, true);
    });
    pop.tabIndex = -1;
    pop.focus({ preventScroll: true });
  }
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
  async function renderDashboard(app) {
    const now = new Date();
    const today = startOfDay(now);
    const hour = now.getHours();
    const { w } = isoWeek(now);
    app.classList.add('lp-dash');
    const card = (id, title, link, linkLabel, body, cls = '') => `<section class="lp-card ${cls}" id="${id}">
        <header class="lp-card-head"><h2>${title}</h2>${link ? `<a class="lp-link" href="${link}">${linkLabel}</a>` : ''}</header>
        <div class="lp-card-body">${body}</div></section>`;
    app.innerHTML = `
      <header class="lp-vhead"><h1>Forside</h1><nav id="lp-chips" class="lp-chips" aria-label="Status"></nav></header>
      <p class="lp-viewsub">${esc(cap(DAYS[now.getDay()]))} ${now.getDate()}. ${esc(MONTHS[now.getMonth()])}, uge ${w}</p>
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
      if (chips.missing) out.push(`<a class="lp-tag is-danger" href="${BASE}OpgaverElev.aspx">${chips.missing} ${chips.missing === 1 ? 'aflevering mangler' : 'afleveringer mangler'}</a>`);
      if (chips.soon) out.push(`<a class="lp-tag" href="${BASE}OpgaverElev.aspx">${chips.soon} ${chips.soon === 1 ? 'aflevering' : 'afleveringer'} denne uge</a>`);
      if (chips.unread) out.push(`<a class="lp-tag" href="${BASE}beskeder2.aspx">${chips.unread} ${chips.unread === 1 ? 'ulæst besked' : 'ulæste beskeder'}</a>`);
      (chips.deadlines || []).forEach((d) => out.push(`<a class="lp-tag is-warn" href="${esc(d.link || '#lp-c-front')}">${esc(d.title)} senest ${esc(niceTime(d.time))}</a>`));
      if (chips.abs != null) out.push(`<a class="lp-tag${chips.abs >= 10 ? ' is-danger' : chips.abs >= 5 ? ' is-warn' : ''}" href="${BASE}subnav/fravaerelev.aspx">Fravær ${chips.abs.toFixed(1).replace('.', ',')} %</a>`);
      if (chips.avg != null) out.push(`<a class="lp-tag" href="${BASE}grades/grade_report.aspx">Snit ${chips.avg.toFixed(1).replace('.', ',')}</a>`);
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
          // Kom næste uge fra cachen, har kaldet ovenfor allerede tegnet alt med de nye data.
          if (weeks.next) return;
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
      const block = (lbl, l, sub, extra = '') => `<button type="button" class="lp-hero-item${lbl === 'nu' ? ' is-live' : ''}" data-n="${lbl}"${hc(l.subject?.code)} style="--h:${hueFor(l.subject?.code)}">
          <span class="lp-hero-lbl">${lbl === 'nu' ? 'Nu' : cur ? 'Bagefter' : 'Næste time'}</span>
          <strong>${subjDot(l.subject?.code)}${esc(l.subject?.name || l.title || 'Aktivitet')}${l.room ? `<span>, ${esc(l.room)}</span>` : ''}</strong>
          <span class="lp-hero-sub lp-mono">${esc(sub)}</span>${extra}</button>`;
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
      const a = LP.gradeAverage((g && g.protocol) || []);
      if (a.avg != null) { chips.avg = a.avg; writeChips(); }
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
    const mo = mondayOf(weekDate); const fr = new Date(mo.getTime() + 4 * 864e5);
    app.innerHTML = `${pageHead('Skema', `Uge ${w}, ${mo.getDate()}. ${MONTHS[mo.getMonth()]} til ${fr.getDate()}. ${MONTHS[fr.getMonth()]}`,
        `<button type="button" class="lp-btn" data-wk="-1" title="Forrige uge (Alt+venstre)" aria-label="Forrige uge">${ICONS.left}</button>
          <button type="button" class="lp-btn${isCurrent ? ' is-disabled' : ''}" data-wk="0">I dag</button>
          <button type="button" class="lp-btn" data-wk="1" title="Næste uge (Alt+højre)" aria-label="Næste uge">${ICONS.right}</button>
          <button type="button" class="lp-btn lp-btn-ghost" data-act="colors" aria-expanded="false" aria-haspopup="dialog" title="Vælg farver til fagene">${ICONS.palette}Farver</button>
          <a class="lp-btn lp-btn-ghost" href="${BASE}SkemaNy.aspx?week=${wp}&lp=orig">Lectios visning</a>`)}
      <div id="lp-week" class="lp-card lp-week-card">${skeleton(8)}</div>`;
    let weekLessons = [];
    app.querySelector('[data-act="colors"]').addEventListener('click', (e) => toggleColors(e.currentTarget, weekLessons));
    app.querySelectorAll('[data-wk]').forEach((b) => b.addEventListener('click', () => {
      const d = +b.dataset.wk;
      const nd = d === 0 ? new Date() : new Date(weekDate.getTime() + d * 7 * 864e5);
      history.replaceState(null, '', `${BASE}SkemaNy.aspx?week=${weekParam(nd)}`);
      renderWeek(app, nd);
    }));
    const draw = (sk) => {
      if (token !== weekToken) return;
      weekLessons = sk.lessons;
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
      const AH = LP.alldayHeight(sk.days, all);
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
          return `<button type="button" class="lp-blk${l.cancelled ? ' is-cancelled' : ''}${l.changed ? ' is-changed' : ''}${live ? ' is-live' : ''}${l.end < now ? ' is-past' : ''}${hgt < 44 ? ' is-short' : ''}" data-li="${all.indexOf(l)}"${hc(l.subject?.code)}
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
          <div class="lp-day-all" style="height:${AH}px">${dayAll.map((l) => `<button type="button" class="lp-allday" data-li="${all.indexOf(l)}"${hc(l.subject?.code || l.title)} style="--h:${hueFor(l.subject?.code || l.title)}">${esc(l.title || l.subject?.name || 'Begivenhed')}</button>`).join('')}</div>
          <div class="lp-day-body" style="height:${H}px">${hours.map((t) => `<div class="lp-hline" style="top:${(t - minM) * PX}px"></div>`).join('')}${blocks}${nowLine}</div>
        </div>`;
      }).join('');
      const anyAll = all.some((l) => l.allDay);
      const box = document.getElementById('lp-week');
      box.innerHTML = `<div class="lp-week${anyAll ? '' : ' no-allday'}">
        <div class="lp-gutter"><div class="lp-day-head"></div><div class="lp-day-all" style="height:${AH}px"></div><div class="lp-day-body" style="height:${H}px">${hours.map((t) => `<span style="top:${(t - minM) * PX}px">${pad(Math.floor(t / 60))}:00</span>`).join('')}</div></div>
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
  // Fælles sidehoved for alle sider: titel, handlinger til højre, faner og evt. en undertekst.
  function groupTitle() {
    const p = PAGE;
    if (p.startsWith('subnav/fravaer')) return 'Fravær';
    if (p.startsWith('grades/')) return 'Karakterer';
    if (/^(studieplan|studieretning|fagvalg\/|teacherstudybook)/.test(p)) return 'Studieplan';
    if (p.startsWith('indstillinger/') || p === 'minbutik.aspx') return 'Profil';
    if (p.startsWith('aktivitet/')) return 'Lektion';
    return '';
  }
  let shellActions = '';
  let shellTabs = '';
  let shellTitle = ''; // fx opgavens titel på opgavesiden
  const pageHead = (title, sub, actions = '') => `<header class="lp-vhead"><h1>${esc(title)}</h1>${actions ? `<div class="lp-vhead-actions">${actions}</div>` : ''}</header>${shellTabs || subTabs()}${sub ? `<p class="lp-viewsub">${sub}</p>` : ''}`;
  const viewHead = (title, sub, extra = '') => pageHead(groupTitle() || title, sub, `${extra}<a class="lp-btn lp-btn-ghost" href="${esc(origLink())}">Lectios visning</a>`);
  // Lectios egne sider får samme sidehoved som de nye sider.
  function buildPageShell() {
    const cc = document.querySelector('.outerContentFrame > .ls-content-container');
    if (!cc || document.getElementById('lp-pagehead')) return;
    const t = document.getElementById('s_m_HeaderContent_MainTitle') || document.querySelector('[id$="HeaderContent_MainTitle"], .maintitle');
    let title = (t ? t.textContent : '').trim();
    const m = title.match(TITLE_RE);
    if (m) title = m[4].trim();
    if (!title) { const dm = document.title.match(TITLE_RE); title = (dm ? dm[4] : document.title).split(' - ')[0].trim(); }
    title = shellTitle || groupTitle() || title.replace(/\s+oversigt$/i, '');
    const head = document.createElement('div');
    head.id = 'lp-pagehead';
    head.innerHTML = pageHead(title, '', shellActions);
    cc.prepend(head);
    head.querySelectorAll('[data-proxy]').forEach((b) => b.addEventListener('click', () => LP.lectioClick(document.getElementById(b.dataset.proxy))));
    document.documentElement.classList.add('lp-has-pagehead');
  }
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
    // Status som tags: mangler og under 24 t er røde, under 72 t rav, afleveret grøn.
    const status = (x, d) => {
      const st = x.status.toLowerCase();
      let cls = ''; let txt = x.status;
      if (/afleveret/.test(st)) { cls = 'is-ok'; txt = 'Afleveret'; }
      else if (/mangler/.test(st)) { cls = 'is-danger'; txt = 'Mangler'; }
      else if (d) { const hrs = (d - now) / 36e5; txt = relTime(d, now); cls = hrs < 24 ? 'is-danger' : hrs < 72 ? 'is-warn' : ''; }
      const wait = x.waiting && !/afleveret/i.test(x.status) ? (/elev/i.test(x.waiting) ? 'venter på dig' : /lærer/i.test(x.waiting) ? 'venter på læreren' : x.waiting) : '';
      return `<span class="lp-tag ${cls}">${esc(txt)}</span>${wait ? ` <span class="lp-tag">${esc(wait)}</span>` : ''}`;
    };
    const row = (x) => {
      const d = x.due;
      const cls = /mangler/i.test(x.status) ? ' class="is-late"' : /afleveret/i.test(x.status) ? ' class="is-done"' : '';
      return `<tr data-subj="${esc(x.subject?.code || '')}"${cls}>
        <td class="lp-mono">${d ? `${d.getDate()}. ${esc(MONTHS[d.getMonth()].slice(0, 3))} ${hm(d)}` : ''}</td>
        <td class="lp-task-what"><a href="${esc(x.href || '#')}">${esc(x.title)}</a>${x.note ? `<div class="lp-task-note">${esc(x.note)}</div>` : ''}</td>
        <td class="lp-task-subj">${subjDot(x.subject?.code)}${esc(x.subject?.name || x.hold)}</td>
        <td class="lp-mono">${x.hours && x.hours !== '0,00' ? esc(x.hours) : ''}</td>
        <td class="lp-task-state">${status(x, d)}${x.grade ? ` <span class="lp-tag is-accent">${esc(x.grade)}</span>` : ''}</td></tr>`;
    };
    const table = (list) => `<table class="lp-table lp-tasks"><thead><tr><th>Frist</th><th>Opgave</th><th>Fag</th><th>Elevtid</th><th>Status</th></tr></thead><tbody>${list.map(row).join('')}</tbody></table>`;
    const group = (title, list, cls = '') => list.length ? `<section class="lp-group ${cls}"><h2>${esc(title)} <span>${list.length}</span></h2>${table(list)}</section>` : '';
    app.innerHTML = viewHead('Opgaver', `${open.length} åbne, ${missing.length} mangler, ${done.length} afleveret`) +
      subjectFilter(app, tasks) +
      `<div class="lp-sheet">${group('Mangler', missing, 'is-late')}${group('Kommende', open)}${open.length + missing.length === 0 ? '<p class="lp-empty">Ingen åbne opgaver.</p>' : ''}
       ${done.length ? `<details class="lp-group lp-done"><summary><h2>Afleveret <span>${done.length}</span></h2></summary>${table(done)}</details>` : ''}</div>`;
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
    const pct = (v) => (v || 0).toFixed(1).replace('.', ',') + ' %';
    const lvl = (p) => (p >= 10 ? 'is-danger' : p >= 5 ? 'is-warn' : '');
    const max = Math.max(10, ...a.rows.map((r) => r.pct || 0));
    const bar = (p) => (p ? `<span class="lp-bar ${lvl(p)}"><i style="width:${Math.min(100, (p / max) * 100)}%"></i></span>` : '');
    const frac = (m) => (m ? `${String(m[0]).replace('.', ',')} / ${m[1]}` : '–');
    // Lectio har to tal pr. hold: "Opgjort" er fraværet indtil nu, og brøken er moduler i hele perioden. De står hver for sig.
    const rows = a.rows.slice().sort((x, y) => x.hold.localeCompare(y.hold, 'da')).map((r) => {
      const s = subjectFrom(r.hold);
      return `<tr><td>${subjDot(s?.code)}${esc(s?.name || r.hold)} <small class="lp-muted">${esc(r.hold)}</small></td>
        <td class="lp-mono ${lvl(r.pct)}">${r.pct ? pct(r.pct) : '–'}</td><td class="lp-abs-bar">${bar(r.pct)}</td>
        <td class="lp-mono">${frac(r.mods)}</td><td class="lp-mono">${r.wPct ? pct(r.wPct) : '–'}</td></tr>`;
    }).join('');
    app.innerHTML = viewHead('Fravær', 'Opgjort for dette skoleår') +
      `<div class="lp-bignums">
        <div class="${lvl(a.total.pct)}"><b>${pct(a.total.pct)}</b><span>almindeligt fravær, opgjort</span></div>
        <div class="${lvl(a.total.wPct)}"><b>${pct(a.total.wPct)}</b><span>skriftligt fravær, opgjort</span></div>
      </div>
      <section class="lp-panel"><header class="lp-panel-head"><h2>Pr. hold</h2></header>
        <table class="lp-table lp-abs"><thead><tr><th>Hold</th><th>Opgjort</th><th></th><th>Moduler i perioden</th><th>Skriftligt</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="lp-note">Opgjort er fraværet indtil nu. Moduler i perioden er fravær ud af alle moduler i perioden. Bjælken er fuld ved ${String(Math.round(max * 10) / 10).replace('.', ',')} %.</p>
      </section>`;
  }

  function renderGradesView(app) {
    const { current, protocol } = parseGrades(document);
    const a = LP.gradeAverage(protocol);
    const g = (v) => esc(v || '–');
    const now = current.length ? `<table class="lp-table"><thead><tr><th>Fag</th><th>Form</th><th>1. standpunkt</th><th>2. standpunkt</th><th>Årskarakter</th><th>Eksamen</th></tr></thead><tbody>
      ${current.map((x) => { const s = subjectFrom(x.hold); return `<tr><td>${subjDot(s?.code)}${esc(x.subject)} ${esc(x.level)} <small class="lp-muted">${esc(x.hold)}</small></td><td>${g(x.form)}</td>
        <td class="lp-mono">${g(x.s1)}</td><td class="lp-mono">${g(x.s2)}</td><td class="lp-mono">${g(x.year)}</td><td class="lp-mono">${g(x.exam)}</td></tr>`; }).join('')}</tbody></table>`
      : '<p class="lp-empty lp-pad">Ingen karakterer endnu.</p>';
    const bevis = protocol.length ? `<section class="lp-panel"><header class="lp-panel-head"><h2>Beviset</h2><small>${protocol.length} linjer</small></header>
      <table class="lp-table"><thead><tr><th>Termin</th><th>Fag</th><th>Form</th><th>Type</th><th>Vægt</th><th>Karakter</th></tr></thead><tbody>
      ${protocol.map((l) => `<tr${l.counts ? '' : ' class="is-done"'}><td>${esc(l.term)}</td><td>${esc(l.subject)}</td><td>${esc(l.form)}</td><td>${esc(l.type)}${l.counts ? '' : ' <span class="lp-tag">tæller ikke med</span>'}</td>
        <td class="lp-mono">${l.weight == null ? '' : String(l.weight).replace('.', ',')}</td><td class="lp-mono"><b>${esc(l.grade)}</b></td></tr>`).join('')}</tbody></table></section>` : '';
    app.innerHTML = viewHead('Karakterer', '') +
      `<div class="lp-bignums"><div><b>${a.avg == null ? '–' : a.avg.toFixed(1).replace('.', ',')}</b><span>${a.n ? `snit på beviset, vægtet, ${a.n} karakterer` : 'Ingen karakterer på beviset endnu'}</span></div></div>
      <section class="lp-panel"><header class="lp-panel-head"><h2>Karakterer i år</h2></header>${now}</section>${bevis}`;
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
      ${pageHead('Beskeder', `${esc(cur ? cur.title : 'Indbakke')}, ${list.length} ${list.length === 1 ? 'tråd' : 'tråde'}`,
        `${allRead ? '<button type="button" class="lp-btn" data-act="allread">Markér alle som læst</button>' : ''}${newBtn ? '<button type="button" class="lp-btn lp-btn-main" data-act="new">Ny besked</button>' : ''}<a class="lp-btn lp-btn-ghost" href="${esc(origLink())}">Lectios visning</a>`)}
      <div class="lp-mfolders">
        ${main.map((f) => `<button type="button" class="lp-fchip${f.selected ? ' is-on' : ''}" data-f="${f.i}"${f.selected ? ' aria-current="true"' : ''}>${esc(f.title.replace(/^Alle /, '').replace(/^./, (c) => c.toUpperCase()))}</button>`).join('')}
        ${rest.length ? `<select class="lp-fselect" aria-label="Andre mapper"><option value="">${rest.some((f) => f.selected) ? '' : 'Hold og grupper'}</option>${rest.map((f) => `<option value="${f.i}"${f.selected ? ' selected' : ''}>${'  '.repeat(Math.min(3, Math.round(f.indent / 16)))}${esc(f.title)}</option>`).join('')}</select>` : ''}
        <input type="search" class="lp-msearch" placeholder="Filtrér i mappen" aria-label="Filtrér beskeder">
      </div>
      <div class="lp-mpanes">
        <div class="lp-mlist" role="list">${list.length ? list.map((m, i) => `
          <a class="lp-mitem${m.unread ? ' is-unread' : ''}" role="listitem" href="${esc(m.href || '#')}" data-i="${i}" title="${esc(m.subject)}${m.to ? ' (til ' + esc(m.to) + ')' : ''}">
            <span class="lp-mi-top"><strong>${esc(m.from)}</strong><small class="lp-mono">${esc(m.changed)}</small></span>
            <span class="lp-mi-subj">${esc(m.subject)}</span>
          </a>`).join('') : '<p class="lp-empty lp-pad">Ingen beskeder i denne mappe.</p>'}</div>
        <div class="lp-mread" aria-live="polite"><p class="lp-empty">Vælg en besked for at læse den her.</p></div>
      </div>`;
    app.querySelector('[data-act=new]')?.addEventListener('click', () => LP.lectioClick(newBtn));
    app.querySelector('[data-act=allread]')?.addEventListener('click', () => LP.lectioClick(allRead));
    app.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => LP.lectioClick(folders[+b.dataset.f]?.a)));
    app.querySelector('.lp-fselect')?.addEventListener('change', (e) => { const f = folders[+e.target.value]; if (f) LP.lectioClick(f.a); });
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
    const sec = (title, body) => `<section class="lp-afl-sec"><h3>${title}</h3>${body}</section>`;
    const box = document.createElement('section');
    box.id = 'lp-afl';
    box.className = 'lp-panel lp-afl';
    box.style.setProperty('--h', hueFor(subj?.code));
    if (subj?.code) box.dataset.hc = subj.code;
    // Opgavens titel er sidetitlen; panelet har fag og hold i hovedet og en feltliste.
    shellTitle = info.opgavetitel || '';
    if (!done) shellActions = '<a class="lp-btn" href="#lp-afl-upload">Gå til aflevering</a>';
    const stTag = `<span class="lp-tag ${done ? 'is-ok' : /mangler/i.test(status) ? 'is-danger' : ''}">${esc(status || 'Ikke afleveret')}</span>`;
    box.innerHTML = `
      <header class="lp-panel-head"><h2>${subjDot(subj?.code)}${esc(subj?.name || info.hold || 'Opgave')}${info.hold && subj ? `<small>${esc(info.hold)}</small>` : ''}</h2></header>
      <dl class="lp-fields">
        ${fact('Frist', due ? `<span>${esc(cap(DAYS[due.getDay()]))} ${due.getDate()}. ${esc(MONTHS[due.getMonth()])} <span class="lp-mono">${hm(due)}</span></span>${done ? '' : dueText(due, status, now)}` : esc(info.afleveringsfrist || ''))}
        ${fact('Status', stTag)}
        ${fact('Afventer', esc(waiting))}
        ${fact('Karakter', grade ? `<b class="lp-mono">${esc(grade)}</b>` : '', 'is-grade')}
        ${fact('Elevtid', esc(info.elevtid || ''))}
        ${fact('Ansvarlig', esc(info.ansvarlig || ''))}
      </dl>
      ${descHtml && descHtml.replace(/<[^>]+>/g, '').trim() ? sec('Opgavebeskrivelse', `<div class="lp-act">${descHtml}</div>`) : ''}
      ${info.opgavenote ? sec('Note fra læreren', `<p class="lp-pre">${esc(info.opgavenote)}</p>`) : ''}
      ${gradeNote ? sec('Karakternote', `<p class="lp-pre">${esc(gradeNote)}</p>`) : ''}`;
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

  /* ---------------- lektionsside ---------------- */
  function enhanceActivityPage() {
    const content = document.getElementById('homeworkContentContainer');
    const fb = document.getElementById('ElevContentContainer');
    const host = document.querySelector('#contenttable, .ls-content');
    if ((!content && !fb) || !host || document.getElementById('lp-act-hero')) return;
    const brik = document.querySelector('[id$="actHeader"] a.s2skemabrik[data-tooltip], .ls-paper-header a.s2skemabrik[data-tooltip]') || document.querySelector('a.s2skemabrik[data-tooltip]');
    const l = brik ? parseTip(brik.getAttribute('data-tooltip') || '') : {};
    if (brik) { l.changed = brik.classList.contains('s2changed') || l.status === 'changed'; l.cancelled = brik.classList.contains('s2cancelled') || l.status === 'cancelled'; }
    const noteTa = document.querySelector('textarea.activity-note');
    const note = noteTa ? (noteTa.value || noteTa.textContent || '').trim() : '';
    const forl = [...document.querySelectorAll('a[href*="forloeb_vis"]')].map((a) => ({ t: a.textContent.trim(), h: a.href })).filter((x) => x.t);
    const subj = l.subject;
    const when = l.start ? `${esc(cap(DAYS[l.start.getDay()]))} ${l.start.getDate()}. ${esc(MONTHS[l.start.getMonth()])}${l.allDay ? ', hele dagen' : ` <span class="lp-mono">${hm(l.start)}–${hm(l.end)}</span>`}` : '';
    const fact = (label, val) => (val ? `<div><dt>${label}</dt><dd>${val}</dd></div>` : '');
    const flag = l.cancelled ? '<span class="lp-tag is-danger">aflyst</span>' : l.changed ? '<span class="lp-tag is-warn">ændret</span>' : '';
    const hero = document.createElement('section');
    hero.id = 'lp-act-hero';
    hero.className = 'lp-panel lp-afl';
    hero.style.setProperty('--h', hueFor(subj?.code || l.title));
    if (subj?.code) hero.dataset.hc = subj.code;
    // Fag og hold står kun én gang: faget (eller lektionens titel) i hovedet, holdet i feltlisten.
    const name = l.title || subj?.name || 'Lektion';
    hero.innerHTML = `
      <header class="lp-panel-head"><h2>${subjDot(subj?.code || l.title)}${esc(name)}${subj && subj.name !== name ? `<small>${esc(subj.name)}</small>` : ''}</h2>${flag}</header>
      <dl class="lp-fields">
        ${fact('Tid', when)}
        ${fact('Lokale', esc(l.room || ''))}
        ${fact(/,/.test(l.teacher || '') ? 'Lærere' : 'Lærer', esc(l.teacher || ''))}
        ${fact('Hold', esc(l.hold || ''))}
        ${forl.length ? fact('Forløb', `<span class="lp-flist">${forl.map((f) => `<a href="${esc(f.h)}">${esc(f.t)}</a>`).join('')}</span>`) : ''}
      </dl>
      ${note ? `<section class="lp-afl-sec"><h3>Note fra læreren</h3><p class="lp-pre">${esc(note)}</p></section>` : ''}`;
    host.prepend(hero);
    document.documentElement.classList.add('lp-actpage');
    // navigation og faner flyttes op i sidehovedet
    const btn = (id, label, icon) => (document.getElementById('s_m_Content_Content_' + id) ? `<button type="button" class="lp-btn" data-proxy="s_m_Content_Content_${id}" title="${label}" aria-label="${label}">${icon}</button>` : '');
    const holdLink = document.getElementById('s_m_Content_Content_holdActLink');
    shellActions = `${btn('ctl02', 'Min forrige lektion', ICONS.left)}${btn('ctl03', 'Min næste lektion', ICONS.right)}${holdLink ? `<a class="lp-btn lp-btn-ghost" href="${esc(holdLink.href)}">Holdets lektioner</a>` : ''}`;
    const tabs = [...document.querySelectorAll('.lectioTabToolbar a')].map((a) => ({ t: a.textContent.trim(), h: a.getAttribute('href') || '#', on: !a.getAttribute('href') || a.getAttribute('href') === '#' }));
    if (tabs.length > 1) shellTabs = `<nav class="lp-tabs" aria-label="Undersider">${tabs.map((x) => `<a href="${esc(x.on ? '#' : abs(x.h) || x.h)}"${x.on ? ' class="is-on" aria-current="page"' : ''}>${esc(x.t)}</a>`).join('')}</nav>`;
    if (fb) { enhanceFeedback(fb); return; }
    // indholdskortet får en overskrift som de andre kort
    if (!content.querySelector('.lp-act-cardhead')) {
      const h = document.createElement('div');
      h.className = 'lp-act-cardhead';
      h.innerHTML = '<h2>Lektier og materialer</h2>';
      content.prepend(h);
    }
    if (!content.textContent.replace(/Lektier og materialer/, '').trim()) content.insertAdjacentHTML('beforeend', '<p class="lp-empty">Ingen lektier eller materialer til denne lektion.</p>');
  }
  // Fanen Elevfeedback: elevens egne noter og svar til lektionen. Lectio skifter mellem
  // læse- og skrivetilstand med en hel sideindlæsning, så tilstanden aflæses én gang her.
  function enhanceFeedback(fb) {
    const html = document.documentElement;
    // Lectios editor (CKEditor) starter først efter at Lectio+ har kørt, så skrivetilstand
    // aflæses fra serverens eget tekstfelt, som kun findes når man skriver.
    const editing = !!fb.querySelector('textarea, .cke, [contenteditable="true"]');
    html.classList.add('lp-fbpage');
    html.classList.toggle('lp-fbedit', editing);
    if (fb.querySelector('.lp-act-cardhead')) return;
    const info = fb.querySelector('.nb_type_information');
    const body = fb.querySelector('[id$="inlineHomeworkDiv"]');
    const empty = !editing && (!body || (!body.textContent.trim() && !body.querySelector('img, iframe, video, audio, a, table')));
    const editBtn = document.querySelector('[id$="tocAndToolbar_editModeBtn"]');
    const newBtn = document.querySelector('[id$="NytElevindholdBtn"]');
    const proxy = (el, label, icon, cls = '') => (el && el.id ? `<button type="button" class="lp-btn ${cls}" data-proxy="${esc(el.id)}">${icon}${label}</button>` : '');
    const sub = editing ? 'Tryk på Gem i værktøjslinjen eller Alt+S når du er færdig.' : (info ? info.textContent.trim() : '');
    const head = document.createElement('div');
    head.className = 'lp-act-cardhead lp-fb-head';
    head.innerHTML = `<div><h2>Elevfeedback</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
      <div class="lp-fb-actions">${editing ? proxy(newBtn, 'Nyt indlæg', ICONS.plus, 'lp-btn-ghost') : proxy(editBtn, empty ? 'Skriv' : 'Rediger', ICONS.pen)}</div>`;
    fb.prepend(head);
    head.querySelectorAll('[data-proxy]').forEach((b) => b.addEventListener('click', () => LP.lectioClick(document.getElementById(b.dataset.proxy))));
    if (empty) head.insertAdjacentHTML('afterend', '<p class="lp-empty lp-fb-empty">Du har ikke skrevet noget til denne lektion endnu.</p>');
    // ekstra sikkerhed: dukker editoren op senere, skiftes kortet til skrivetilstand
    if (!editing) {
      const recheck = () => setTimeout(() => {
        if (!fb.querySelector('.cke, [contenteditable="true"]') || html.classList.contains('lp-fbedit')) return;
        fb.querySelectorAll('.lp-fb-head, .lp-fb-empty').forEach((x) => x.remove());
        enhanceFeedback(fb);
      }, 300);
      if (document.readyState === 'complete') recheck(); else addEventListener('load', recheck, { once: true });
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
    const range = (p) => (p.from && p.to && p.from !== p.to ? `${p.from}-${p.to}` : p.from ? `${p.from}` : '');
    const link = (p) => `<a href="${esc(p.href || '#')}">${esc(p.title)}</a>`;
    const rows = sp.holds.filter((h) => h.phases.length).map((h) => {
      const s = subjectFrom(h.name);
      const y = sp.nowY;
      const cur = y != null ? h.phases.find((p) => p.y <= y && y < p.y2) : null;
      const next = y != null ? h.phases.find((p) => p.y > y) : null;
      const prog = cur ? Math.round(((y - cur.y) / (cur.y2 - cur.y)) * 100) : 0;
      return `<tr${hc(s?.code)}><td>${subjDot(s?.code || h.name)}${esc(s?.name || h.name)}</td><td class="lp-muted">${esc(h.name)}</td>
        <td>${cur ? `${link(cur)}<span class="lp-progress"><i style="width:${prog}%"></i></span>` : '<span class="lp-muted">Intet forløb lige nu</span>'}</td>
        <td class="lp-mono">${cur ? esc(range(cur)) : ''}</td><td>${next ? `${link(next)} <small class="lp-mono lp-muted">${esc(range(next))}</small>` : '–'}</td>
        <td><details class="lp-sp-all"><summary>${h.phases.length} forløb</summary><ul>${h.phases.map((p) => `<li>${link(p)} <small class="lp-mono lp-muted">${esc(range(p))}</small></li>`).join('')}</ul></details></td></tr>`;
    });
    app.innerHTML = viewHead('Studieplan', 'Forløb i dine hold lige nu og hvad der kommer') +
      (rows.length ? `<section class="lp-panel"><table class="lp-table lp-sp"><thead><tr><th>Fag</th><th>Hold</th><th>Nu</th><th>Uger</th><th>Næste</th><th>Alle</th></tr></thead><tbody>${rows.join('')}</tbody></table></section>` : '<p class="lp-empty">Studieplanen er tom.</p>');
    return true;
  }

  /* ---------------- oprydning på Lectios egne sider ---------------- */
  function tidyLectioPage() {
    const t = document.getElementById('s_m_HeaderContent_MainTitle') || document.querySelector('[id$="HeaderContent_MainTitle"], .maintitle');
    if (!t) return;
    const m = t.textContent.trim().match(TITLE_RE);
    if (m) t.textContent = m[4].trim();
  }
  const { OWN_UI } = LP;
  // Finder lyse flader og mørk tekst i Lectios egne sider og farver dem om i mørkt tema (src/lib/dark.js).
  const darkFix = (root) => LP.darkFix(root, document);
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
        idle(() => nodes.forEach((n) => { if (n.isConnected) { LP.markEmptyRows(n); LP.markCategoryCells(n); darkFix(n); } }), 500);
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
      if (PAGE === 'grades/grade_report.aspx' && !q.length) { const g = parseGrades(document); if (g.current.length || g.protocol.length) cachePut('grades', g); }
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
    try { localStorage.removeItem('lp-test-code'); localStorage.removeItem('lp-dev-code'); localStorage.removeItem('lpx-run'); localStorage.removeItem('lpq'); localStorage.removeItem('lpz'); localStorage.removeItem('lpy'); localStorage.removeItem('lpx2'); } catch (e) { /* oprydning efter test */ }
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
      if (PAGE === 'grades/grade_report.aspx' && parseGrades(document).current.length) takeover = 'karakterer';
    }
    if (settings.views && PAGE === 'beskeder2.aspx' && [...params.keys()].every((k) => k === 'mappeid') &&
        document.querySelector('table[id*="threadGV"]') && !document.querySelector('textarea, [id$="ViewThreadPagePanel"] .message-thread-container')) takeover = 'beskeder';
    if (settings.views && PAGE === 'studieplan.aspx' && [...params.keys()].every((k) => k === 'displaytype') && params.get('displaytype') === 'ugeteksttabel' &&
        document.querySelector('[id$="spUge_theTable"] .phase')) takeover = 'studieplan';
    if (takeover) html.classList.add('lp-takeover'); else html.classList.remove('lp-takeover');

    primeCache(params);
    shell = LP.buildShell({ doc: document, base: BASE, activeKey: activeKey(), user: USER, schoolName, logoutHref: logoutLink.getAttribute('href'), colors: settings.colors, theme: document.documentElement.getAttribute('data-lp-theme'), onSearch: openPalette, onTheme, onOriginal });
    shell.setHold(cache.front?.d?.hold || []);
    updateBadges();
    tidyLectioPage();
    if (!takeover) { const oc = document.querySelector('.outerContentFrame'); LP.markEmptyRows(oc); LP.markCategoryCells(oc); darkFix(); }
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
        // Lectio viser næste uge i weekenden; så gør vi også, så overskrift og skema passer sammen.
        else if (d.getDay() === 0 || d.getDay() === 6) { d = mondayOf(d); d.setDate(d.getDate() + 7); }
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
      if (PAGE === 'aktivitet/aktivitetforside2.aspx') enhanceActivityPage();
      buildPageShell();
    }
    if (takeover !== 'dashboard') refreshStale();
  }

  if (hasChrome && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((ch) => {
      if (ch.theme && Object.keys(ch).length === 1) { settings.theme = ch.theme.newValue; saveBoot(); applyTheme(); return; }
      if (ch.hideDone && Object.keys(ch).length === 1) return;
      if (ch.colors && Object.keys(ch).length === 1) { settings.colors = ch.colors.newValue || {}; repaintColors(); return; }
      location.reload();
    });
  }

  init();
})();
