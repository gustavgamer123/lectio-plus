/* Lectio+ : kører før siden tegnes, så der ikke blinker hvidt eller vises gammelt Lectio først */
(() => {
  try {
    if (window.top !== window) return;
    const m = location.pathname.match(/^\/lectio\/\d+\/(.*)$/i);
    if (!m) return;
    const boot = JSON.parse(localStorage.getItem('lp-boot') || 'null');
    if (!boot || !boot.enabled) return;
    const q = location.search;
    if (sessionStorage.getItem('lp-original') === '1' || /[?&]lp=orig/i.test(q)) return;
    const dark = boot.theme === 'dark' || (boot.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    const p = m[1].toLowerCase();
    const views = ['opgaverelev.aspx', 'material_lektieoversigt.aspx', 'subnav/fravaerelev.aspx', 'grades/grade_report.aspx'];
    const takeover = (boot.dashboard && p === 'forside.aspx' && !q) ||
        (boot.skema && p === 'skemany.aspx' && (!q || /^\?week=\d{6}$/i.test(q))) ||
        (boot.views && !q && views.includes(p)) ||
        (boot.views && p === 'beskeder2.aspx' && (!q || /^\?mappeid=-?\d+$/i.test(q))) ||
        (boot.views && p === 'studieplan.aspx' && /^\?displaytype=ugeteksttabel$/i.test(q));
    const apply = (html) => {
      html.setAttribute('data-lp-theme', dark ? 'dark' : 'light');
      html.classList.add('lp-on', 'lp-boot');
      if (takeover) html.classList.add('lp-takeover');
    };
    if (document.documentElement) apply(document.documentElement);
    else {
      const mo = new MutationObserver(() => { if (document.documentElement) { mo.disconnect(); apply(document.documentElement); } });
      mo.observe(document, { childList: true });
    }
  } catch (e) { /* udvidelsen starter normalt bagefter */ }
})();
