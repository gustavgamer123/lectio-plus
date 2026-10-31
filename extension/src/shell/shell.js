/* Lectio+ : skallen med den blå topbjælke, fanerne og Mere-menuen */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  // opts: { doc, base, activeKey, user: { name, cls }, schoolName, logoutHref, colors?, onSearch, onTheme, onOriginal }
  LP.buildShell = (opts) => {
    const { doc, base, activeKey, user = {}, schoolName = '', logoutHref, colors, onSearch, onTheme, onOriginal } = opts;
    const { esc, ICONS } = LP;
    const tab = LP.tabFor(activeKey);
    const moreItem = tab === 'more' ? LP.MORE_ITEMS.find((n) => n.key === activeKey) : null;
    // Fanen for selve siden er "page"; fanen over en underside (fx Fraværsårsager under Fravær) er "true".
    const tabs = LP.NAV_TABS.map((n) => {
      const on = n.key === tab;
      const cur = on ? ` aria-current="${n.key === activeKey ? 'page' : 'true'}"` : '';
      return `<a class="lp-tab${on ? ' is-active' : ''}" data-key="${n.key}" href="${esc(base + n.path)}"${cur}><span>${esc(n.label)}</span><b class="lp-badge" data-badge="${n.key}" hidden></b></a>`;
    }).join('');
    const groups = LP.NAV_MORE.map((g) => `<section><h3>${esc(g.group)}</h3>${g.items.map((n) =>
      `<a class="lp-more-item" href="${esc(base + n.path)}"${n.key === activeKey ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}</section>`).join('');

    const el = doc.createElement('header');
    el.id = 'lp-shell';
    el.innerHTML = `
      <div class="lp-bar">
        <a class="lp-mark" href="${esc(base)}forside.aspx">Lectio<span>+</span></a>
        <span class="lp-school">${esc(schoolName)}</span>
        <button type="button" class="lp-find">${ICONS.search}<span>Søg</span><kbd>Ctrl K</kbd></button>
        <span class="lp-who"><strong>${esc(user.name || '')}</strong> <small>${esc(user.cls || '')}</small></span>
        <button type="button" class="lp-bar-btn" data-act="theme" aria-label="Skift tema" title="Skift tema">${ICONS.moon}</button>
        <button type="button" class="lp-bar-btn" data-act="original" aria-label="Vis Lectios egen visning" title="Vis Lectios egen visning">${ICONS.layers}</button>
        <a class="lp-bar-btn" data-act="logout" href="${esc(logoutHref || '#')}" aria-label="Log ud" title="Log ud">${ICONS.out}</a>
      </div>
      <nav class="lp-tabs-main" aria-label="Lectio">
        ${tabs}
        <div class="lp-more-wrap">
          <button type="button" class="lp-tab lp-more-btn${moreItem ? ' is-active' : ''}" aria-expanded="false" aria-haspopup="true">${esc(moreItem ? moreItem.label : 'Mere')}</button>
          <div class="lp-more-pop" hidden>
            <section class="lp-more-hold" hidden><h3>Mine hold</h3><div class="lp-more-holdlist"></div></section>
            ${groups}
          </div>
        </div>
      </nav>`;
    doc.body.prepend(el);

    const btn = el.querySelector('.lp-more-btn');
    const pop = el.querySelector('.lp-more-pop');
    const setOpen = (open, focusBtn) => {
      pop.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (!open && focusBtn) btn.focus();
    };
    btn.addEventListener('click', () => setOpen(pop.hidden));
    doc.addEventListener('click', (e) => { if (!pop.hidden && !(e.target.closest && e.target.closest('.lp-more-wrap'))) setOpen(false); });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) setOpen(false, true); });
    el.querySelector('.lp-find').addEventListener('click', () => onSearch && onSearch());
    el.querySelector('[data-act=theme]').addEventListener('click', () => onTheme && onTheme());
    el.querySelector('[data-act=original]').addEventListener('click', () => onOriginal && onOriginal());

    const setBadge = (key, n) => {
      const b = el.querySelector(`[data-badge="${key}"]`);
      if (!b) return;
      if (n > 0) { b.textContent = n > 99 ? '99+' : String(n); b.hidden = false; } else b.hidden = true;
    };
    const setHold = (list) => {
      const g = el.querySelector('.lp-more-hold');
      const items = list || [];
      const here = doc.location ? doc.location.href.split('#')[0] : '';
      g.querySelector('.lp-more-holdlist').innerHTML = items.map((h) => {
        const code = LP.subjectFrom(h.name)?.code || h.name;
        return `<a class="lp-more-item" href="${esc(h.href)}"${h.href === here ? ' aria-current="page"' : ''}><i class="lp-sd" data-hc="${esc(code)}" style="--h:${LP.hueFor(code, colors)}"></i>${esc(h.name)}</a>`;
      }).join('');
      g.hidden = !items.length;
    };
    return { el, setBadge, setHold };
  };
})();
