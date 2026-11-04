/* Lectio+ : fælles hjælpere til datoer, tekst og adresser */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  LP.ORIGIN = 'https://www.lectio.dk';
  LP.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  LP.pad = (n) => String(n).padStart(2, '0');
  LP.hm = (d) => `${LP.pad(d.getHours())}:${LP.pad(d.getMinutes())}`;
  LP.DAYS = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  LP.MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  LP.sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  LP.startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  // Lectio-links er relative til skolens mappe, fx /lectio/123/.
  LP.abs = (href, base) => { if (!href || href === '#' || /^javascript:/i.test(href)) return null; try { return new URL(href, LP.ORIGIN + base).href; } catch (e) { return null; } };
  LP.num = (s) => { const v = parseFloat(String(s).replace(',', '.').replace(/[^\d.\-]/g, '')); return isNaN(v) ? null : v; };

  // Tryk på en af Lectios egne knapper. Mange er javascript:-links, som Chrome blokerer, når udvidelsen klikker
  // direkte; derfor beder vi scriptet i sidens egen verden (src/main/click.js) om at klikke. Uden det: almindeligt klik.
  LP.lectioClick = (el) => {
    if (!el) return false;
    if (el.ownerDocument.documentElement.hasAttribute('data-lp-main')) el.dispatchEvent(new el.ownerDocument.defaultView.Event('lp-click'));
    else el.click();
    return true;
  };

  LP.isoWeek = (d) => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = t.getUTCFullYear();
    const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
    return { w, y };
  };
  LP.weekParam = (d) => { const { w, y } = LP.isoWeek(d); return LP.pad(w) + y; };
  LP.mondayOf = (d) => { const x = LP.startOfDay(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };

  LP.dayLabel = (d, now = new Date()) => {
    const diff = Math.round((LP.startOfDay(d) - LP.startOfDay(now)) / 864e5);
    if (diff === 0) return 'i dag';
    if (diff === 1) return 'i morgen';
    if (diff === -1) return 'i går';
    if (diff > 1 && diff < 7) return LP.DAYS[d.getDay()];
    return `${d.getDate()}. ${LP.MONTHS[d.getMonth()].slice(0, 3)}`;
  };
  LP.relTime = (d, now = new Date()) => {
    const mins = Math.round((d - now) / 6e4);
    const a = Math.abs(mins);
    let txt;
    if (a < 60) txt = `${a} min`;
    else if (a < 60 * 24) txt = `${Math.floor(a / 60)} t ${a % 60 ? (a % 60) + ' min' : ''}`.trim();
    else txt = `${Math.round(a / 1440)} ${Math.round(a / 1440) === 1 ? 'dag' : 'dage'}`;
    return mins >= 0 ? `om ${txt}` : `for ${txt} siden`;
  };
})();
