/* Lectio+ : popuppen og indstillingssiden. Indstillingerne ligger i chrome.storage.sync med samme nøgler som i 1.x. */
const DEFAULTS = { enabled: true, theme: 'auto', dashboard: true, skema: true, views: true, hideDone: false, colors: {}, remember: {} };
const NOTIFY = { on: false, room: true, changed: true, msg: true, due: true };
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

if (new URLSearchParams(location.search).has('options') || window.innerWidth > 500) document.documentElement.classList.add('lp-options');
$('#pp-version').textContent = 'version ' + chrome.runtime.getManifest().version;

const applyTheme = (t) => {
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-lp-theme', dark ? 'dark' : 'light');
};

chrome.storage.sync.get({ ...DEFAULTS, notify: NOTIFY }, (s) => {
  applyTheme(s.theme);
  document.querySelectorAll('[data-k]').forEach((el) => {
    const k = el.dataset.k;
    if (el.type === 'checkbox') el.checked = !!s[k]; else el.value = s[k];
    el.addEventListener('change', () => {
      const v = el.type === 'checkbox' ? el.checked : el.value;
      chrome.storage.sync.set({ [k]: v });
      if (k === 'theme') applyTheme(v);
    });
  });

  /* ---------- notifikationer ---------- */
  let notify = { ...NOTIFY, ...s.notify };
  const save = () => chrome.storage.sync.set({ notify });
  const on = $('#n-on');
  const draw = async () => {
    const has = await chrome.permissions.contains({ permissions: ['notifications'] });
    on.checked = notify.on && has;
    $('#n-types').hidden = !on.checked;
    document.querySelectorAll('[data-n]').forEach((cb) => { cb.checked = !!notify[cb.dataset.n]; });
    const bg = await new Promise((r) => chrome.storage.local.get('lp-bg', (o) => r(o['lp-bg'] || null)));
    const st = $('#n-status');
    let msg = ''; let cls = '';
    if (on.checked) {
      if (!bg || !bg.base) { msg = 'Åbn Lectio én gang, så Lectio+ ved, hvilken skole du går på.'; cls = 'is-warn'; }
      else if (bg.loggedOut || bg.session === 'logget ud') { msg = 'Log ind på Lectio for at få notifikationer.'; cls = 'is-warn'; }
      else if (Date.now() - (bg.lastVisit || 0) > 3 * 864e5) { msg = 'Pause: Lectio har ikke været åbnet i 3 dage. Åbn Lectio for at starte igen.'; cls = 'is-warn'; }
      else if (bg.lastPoll) { msg = `Sidst tjekket i dag kl. ${hm(new Date(bg.lastPoll))}.`; cls = 'is-ok'; }
      else msg = 'Første tjek sker inden for et minut.';
    }
    st.hidden = !msg; st.textContent = msg; st.className = 'pp-status ' + cls;
  };
  on.addEventListener('change', async () => {
    if (on.checked) {
      const ok = await chrome.permissions.request({ permissions: ['notifications'] });
      if (!ok) { on.checked = false; return; }
      notify.on = true;
      // Lectio+ skal vide, hvor der hentes fra; det skrives, når Lectio er åbnet. Ellers er Lectio stadig "åbnet for nylig".
      chrome.storage.local.get('lp-bg', (o) => { const bg = o['lp-bg']; if (bg) chrome.storage.local.set({ 'lp-bg': { ...bg, loggedOut: false } }); });
    } else notify.on = false;
    save(); draw();
  });
  document.querySelectorAll('[data-n]').forEach((cb) => cb.addEventListener('change', () => { notify[cb.dataset.n] = cb.checked; save(); }));
  $('#n-now').addEventListener('click', async () => {
    const b = $('#n-now'); b.disabled = true; b.textContent = 'Tjekker ...';
    const r = await chrome.runtime.sendMessage({ type: 'lp-poll-now' }).catch(() => null);
    b.disabled = false; b.textContent = 'Tjek nu';
    const st = $('#n-status');
    st.hidden = false;
    if (r && r.ok) { st.className = 'pp-status is-ok'; st.textContent = r.lines ? `Tjekket nu: ${r.lines} ${r.lines === 1 ? 'ændring' : 'ændringer'}.` : 'Tjekket nu: ingen ændringer.'; }
    else { st.className = 'pp-status is-warn'; st.textContent = r && r.why === 'logget ud' ? 'Log ind på Lectio for at få notifikationer.' : 'Kunne ikke tjekke: ' + ((r && r.why) || 'ukendt fejl') + '.'; }
  });
  draw();

  /* ---------- huskeliste ---------- */
  let remember = s.remember || {};
  chrome.storage.local.get('lp-subjects', (o) => {
    const names = o['lp-subjects'] || {};
    const nameOf = (c) => names[c] || c;
    const list = $('#r-list');
    const drawR = () => {
      const rows = Object.entries(remember).flatMap(([c, items]) => items.map((txt, i) => ({ c, txt, i })));
      list.innerHTML = rows.length ? rows.map((r) => `<li><span>${esc(r.txt)}</span><small>${esc(nameOf(r.c))}</small><button type="button" data-rem="${esc(r.c)}:${r.i}" aria-label="Fjern ${esc(r.txt)}">×</button></li>`).join('')
        : '<li class="pp-empty">Tom. Tilføj fx idrætstøj til idræt.</li>';
    };
    const codes = [...new Set([...Object.keys(names), ...Object.keys(remember)])].sort((a, b) => nameOf(a).localeCompare(nameOf(b), 'da'));
    $('#r-subj').innerHTML = codes.length ? codes.map((c) => `<option value="${esc(c)}">${esc(nameOf(c))}</option>`).join('') : '<option value="">Åbn Lectio først</option>';
    list.addEventListener('click', (e) => {
      const b = e.target.closest('[data-rem]'); if (!b) return;
      const [c, i] = b.dataset.rem.split(':');
      remember = { ...remember, [c]: (remember[c] || []).filter((_, j) => j !== +i) };
      if (!remember[c].length) delete remember[c];
      chrome.storage.sync.set({ remember }); drawR();
    });
    $('#r-add').addEventListener('submit', (e) => {
      e.preventDefault();
      const c = $('#r-subj').value; const txt = $('#r-text').value.trim();
      if (!c || !txt) return;
      remember = { ...remember, [c]: [...(remember[c] || []), txt].slice(0, 10) };
      chrome.storage.sync.set({ remember }); $('#r-text').value = ''; drawR();
    });
    drawR();
  });
});
