/* Lectio+ : baggrundshentning til notifikationer (spec 7.6).
   Kører kun, når eleven har slået notifikationer til i popuppen. Henter skema, beskeder og opgaver fra lectio.dk med
   elevens egne cookies, læser dem i et offscreen-dokument (service workers har ingen DOMParser), sammenligner med
   den fælles ændringslog (src/lib/changes.js) og viser en Chrome-notifikation for det, eleven har valgt.
   Data forlader aldrig computeren: alt hentes fra lectio.dk og gemmes i chrome.storage.local. */
importScripts('src/lib/core.js', 'src/lib/changes.js', 'src/lib/day.js');

const ALARM = 'lp-poll';
const PERIOD_MIN = 20;
const STALE_MS = 3 * 864e5; // stop når Lectio ikke har været åbnet i 3 dage
const NOTIFY_DEFAULTS = { on: false, room: true, changed: true, msg: true, due: true };
const LP = globalThis.LP;

const local = {
  get: (k) => new Promise((r) => chrome.storage.local.get(k, (o) => r(o[k]))),
  set: (k, v) => new Promise((r) => chrome.storage.local.set({ [k]: v }, () => r()))
};
const notifySettings = () => new Promise((r) => chrome.storage.sync.get({ notify: NOTIFY_DEFAULTS }, (s) => r({ ...NOTIFY_DEFAULTS, ...s.notify })));

async function schedule() {
  const n = await notifySettings();
  const has = await chrome.permissions.contains({ permissions: ['notifications'] });
  if (n.on && has) chrome.alarms.create(ALARM, { periodInMinutes: PERIOD_MIN, delayInMinutes: 1 });
  else chrome.alarms.clear(ALARM);
}
// Indstillingerne fra 1.x har samme nøgler og betydning (spec 9); versionen noteres, og "Nyt i 2.0" vises én gang (seen20).
chrome.runtime.onInstalled.addListener((d) => {
  if (d.reason === 'update' || d.reason === 'install') chrome.storage.sync.set({ settingsVersion: 2 });
  schedule();
});
chrome.runtime.onStartup.addListener(schedule);
chrome.storage.onChanged.addListener((ch, area) => { if (area === 'sync' && ch.notify) schedule(); });

/* ---------- offscreen-dokumentet læser HTML med de samme parsere som siderne ---------- */
let creating = null;
async function ensureOffscreen() {
  if (await chrome.offscreen.hasDocument?.()) return;
  if (!creating) creating = chrome.offscreen.createDocument({ url: 'offscreen.html', reasons: ['DOM_PARSER'], justification: 'Læse Lectio-sider til notifikationer' }).finally(() => { creating = null; });
  await creating;
}
async function parse(kind, html, base) {
  await ensureOffscreen();
  return chrome.runtime.sendMessage({ target: 'lp-offscreen', kind, html, base });
}

/* ---------- én hentning ad gangen, ligesom på siderne ---------- */
async function get(base, path) {
  const r = await fetch(LP.ORIGIN + base + path, { credentials: 'include', cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const html = await r.text();
  if (!/logout\.aspx/i.test(html)) { const e = new Error('logget ud'); e.loggedOut = true; throw e; }
  return html;
}

async function poll(reason) {
  const n = await notifySettings();
  if (!n.on || !(await chrome.permissions.contains({ permissions: ['notifications'] }))) { chrome.alarms.clear(ALARM); return { ok: false, why: 'slået fra' }; }
  const bg = await local.get('lp-bg');
  if (!bg || !bg.base || !bg.user) return { ok: false, why: 'ingen skole endnu' };
  if (bg.loggedOut || Date.now() - (bg.lastVisit || 0) > STALE_MS) { chrome.alarms.clear(ALARM); return { ok: false, why: bg.loggedOut ? 'logget ud' : 'Lectio ikke åbnet i 3 dage' }; }
  if (reason !== 'test' && Date.now() - (bg.lastFetch || 0) < 2 * 6e4) return { ok: false, why: 'en Lectio-fane henter lige nu' };
  const key = `lp-changes:${bg.school}:${bg.user}`;
  const now = new Date();
  const found = [];
  try {
    const weeks = [0];
    if (now.getDay() >= 5 || now.getDay() === 0) weeks.push(7); // fredag til søndag: næste skoledag ligger i næste uge
    const lessons = [];
    for (const d of weeks) {
      const wk = LP.weekParam(new Date(now.getTime() + d * 864e5));
      const sk = await parse('skema', await get(bg.base, 'SkemaNy.aspx?week=' + wk), bg.base);
      if (sk) { lessons.push(...sk.lessons); found.push(...(await record(key, 'skema:' + wk, sk.lessons))); }
    }
    found.push(...(await record(key, 'msgs', await parse('msgs', await get(bg.base, 'beskeder2.aspx?mappeid=-70'), bg.base))));
    const tasks = await parse('tasks', await get(bg.base, 'OpgaverElev.aspx'), bg.base);
    found.push(...(await record(key, 'tasks', tasks)));
    await notify(n, found, lessons, tasks, now);
    await local.set('lp-bg', { ...bg, lastPoll: Date.now(), session: 'ok' });
    return { ok: true, lines: found.length };
  } catch (e) {
    if (e.loggedOut) { await local.set('lp-bg', { ...bg, session: 'logget ud' }); chrome.alarms.clear(ALARM); }
    return { ok: false, why: e.message };
  }
}
chrome.alarms.onAlarm.addListener((a) => { if (a.name === ALARM) poll('alarm'); });

async function record(key, part, data) {
  const st = (await local.get(key)) || { snap: {}, log: [], seenAt: null };
  const t = Date.now();
  const next = LP.snapshot(part, data || []);
  const lines = LP.diffSnapshots(part, st.snap[part] || null, next, t);
  st.snap[part] = next;
  st.log = LP.mergeLog(st.log, lines, t, st.snap);
  if (!st.seenAt) st.seenAt = t;
  await local.set(key, st);
  return lines;
}

/* ---------- notifikationer ---------- */
async function notify(n, lines, lessons, tasks, now) {
  const sent = (await local.get('lp-notified')) || {};
  const links = (await local.get('lp-notif-links')) || {};
  const today = LP.startOfDay(now).getTime();
  const next = LP.nextSchoolDay(lessons, now);
  const soon = (ms) => { const d = LP.startOfDay(new Date(ms)).getTime(); return d === today || (next && d === next.getTime()); };
  const out = [];
  for (const l of lines) {
    if (l.kind === 'room' && n.room && soon(l.when)) out.push({ id: l.id, title: 'Nyt lokale', text: LP.changeText(l, now), href: l.href });
    else if ((l.kind === 'cancelled' || l.kind === 'changed') && n.changed && soon(l.when)) out.push({ id: l.id, title: l.kind === 'cancelled' ? 'Aflyst' : 'Ændret modul', text: LP.changeText(l, now), href: l.href });
    else if (l.kind === 'msg' && n.msg) out.push({ id: l.id, title: 'Ny besked', text: LP.changeText(l, now), href: l.href });
  }
  if (n.due) for (const t of tasks || []) {
    const due = t.due ? new Date(t.due).getTime() : 0;
    if (!due || /afleveret/i.test(t.status || '') || due < now.getTime() || due - now.getTime() > 864e5) continue;
    const id = 'due:' + (((t.href || '').match(/exerciseid=(\d+)/i) || [])[1] || t.title) + ':' + due;
    out.push({ id, title: 'Frist om under et døgn', text: `${t.title} skal afleveres ${LP.dayLabel(new Date(due), now)} kl. ${LP.hm(new Date(due))}`, href: t.href });
  }
  for (const m of out) {
    if (sent[m.id]) continue;
    sent[m.id] = Date.now();
    links[m.id] = m.href || LP.ORIGIN + '/lectio/';
    chrome.notifications.create(m.id, { type: 'basic', iconUrl: 'icon128.png', title: m.title, message: m.text, priority: 1 });
  }
  const cut = Date.now() - 14 * 864e5;
  for (const k of Object.keys(sent)) if (sent[k] < cut) { delete sent[k]; delete links[k]; }
  await local.set('lp-notified', sent);
  await local.set('lp-notif-links', links);
}
chrome.notifications?.onClicked.addListener(async (id) => {
  const links = (await local.get('lp-notif-links')) || {};
  if (links[id]) chrome.tabs.create({ url: links[id] });
  chrome.notifications.clear(id);
});

/* ---------- beskeder fra popuppen og siderne ---------- */
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg && msg.type === 'lp-poll-now') { poll('test').then(reply); return true; }
  // Prøve (spec 7.6): kommer elevens cookies med fra baggrunden? Henter kun Forside og beskedlisten.
  if (msg && msg.type === 'lp-probe') {
    local.get('lp-bg').then(async (bg) => {
      if (!bg || !bg.base) return reply({ ok: false, why: 'ingen skole endnu' });
      try {
        const html = await get(bg.base, 'forside.aspx');
        const msgs = await parse('msgs', await get(bg.base, 'beskeder2.aspx?mappeid=-70'), bg.base);
        reply({ ok: true, loggedIn: true, forside: html.length, beskeder: (msgs || []).length });
      } catch (e) { reply({ ok: false, loggedOut: !!e.loggedOut, why: e.message }); }
    });
    return true;
  }
  if (msg && msg.type === 'lp-open-options') { chrome.runtime.openOptionsPage(); return false; }
  return false;
});
