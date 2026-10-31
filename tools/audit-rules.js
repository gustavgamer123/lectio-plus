/* Lectio+ audit: finder det, der bryder retning D, på Lectios egne sider.
   Kører både i browseren (tools/audit.mjs sprøjter filen ind) og i node (test/audit-rules.test.js). */
(() => {
  'use strict';
  const A = (globalThis.AUDIT = globalThis.AUDIT || {});
  A.canvas = A.canvas || false;

  /* ---------- farver ---------- */
  const cache = new Map();
  function viaCanvas(s, doc) {
    const cv = doc.createElement('canvas');
    cv.width = cv.height = 1;
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.clearRect(0, 0, 1, 1);
    g.fillStyle = 'rgba(0,0,0,0)';
    g.fillStyle = s;
    g.fillRect(0, 0, 1, 1);
    const d = g.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
  }
  // Oversætter enhver CSS-farve (også oklch) til sRGB. Uden canvas (node) kun #rrggbb og rgb()/rgba().
  A.toRgb = (c, doc) => {
    if (!c) return null;
    const s = String(c).trim();
    if (cache.has(s)) return cache.get(s);
    let out = null;
    let m = s.match(/^#([0-9a-f]{6})$/i);
    if (m) { const n = parseInt(m[1], 16); out = { r: n >> 16, g: (n >> 8) & 255, b: n & 255, a: 1 }; }
    else if ((m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/i))) {
      out = { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : parseFloat(m[4]) / (m[5] ? 100 : 1) };
    } else if (s === 'transparent') out = { r: 0, g: 0, b: 0, a: 0 };
    else if (A.canvas && doc) out = viaCanvas(s, doc);
    cache.set(s, out);
    return out;
  };
  A.lum = ({ r, g, b }) => [r, g, b].map((v) => v / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
  A.contrast = (a, b) => {
    const [x, y] = [A.lum(a), A.lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const hsl = ({ r, g, b }) => {
    const [R, G, B] = [r / 255, g / 255, b / 255];
    const max = Math.max(R, G, B); const min = Math.min(R, G, B); const d = max - min; const l = (max + min) / 2;
    if (!d) return { h: 0, s: 0, l };
    const s = d / (1 - Math.abs(2 * l - 1));
    let h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
    h *= 60; if (h < 0) h += 360;
    return { h, s, l };
  };
  const dist = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
  // Blå, der ikke er en af vores egne blå (accent m.fl.), fx Lectios petrolblå #006493.
  A.isForeignBlue = (rgb, own) => {
    if (!rgb || rgb.a <= 0.3) return false;
    const { h, s, l } = hsl(rgb);
    if (h < 180 || h > 250 || s <= 0.35 || l < 0.12 || l > 0.92) return false;
    const mine = (Array.isArray(own) ? own : [own]).filter(Boolean);
    return !mine.some((o) => dist(rgb, o) <= 12);
  };
  const blend = (fg, bg) => (fg.a >= 1 ? fg : { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });

  /* ---------- sider ---------- */
  // Uden ownViews måles kun Lectios egne sider; med ownViews også vores egne visninger (#lp-app og lektionspanelet).
  const SKIP_BASE = '#lp-shell, #lp-palette, [class*="fonticon"], .material-symbols-outlined, .material-icons, img, svg, script, style, noscript, canvas, video';
  const SKIP_OWN = '#lp-app, #lp-drawer, ' + SKIP_BASE;
  const TABLES = '.ls-table-layout1, .ls-table-layout2, .ls-table-layout5, .lf-grid, .s2skema, table.lp-table';
  const BUTTONS = '.buttonfilled, .buttonoutlined, .buttonfilledtonal, .buttontext, .buttonicon';
  const short = (el) => {
    if (!el || el.nodeType !== 1) return '';
    const cls = [...el.classList].filter((c) => !/^lp-dk-|^lf-excel/.test(c)).slice(0, 2).map((c) => '.' + c).join('');
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : cls);
  };
  const selectorOf = (el) => (el.id ? short(el) : `${short(el.parentElement)} > ${short(el)}`);
  const bgOf = (el, win, doc) => {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const c = A.toRgb(win.getComputedStyle(e).backgroundColor, doc);
      if (c && c.a > 0.5) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  // Samlet opacity op gennem forældrene; den dæmper teksten ligesom en gennemsigtig farve.
  const opacityOf = (el, win) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(win.getComputedStyle(e).opacity) || 0; return o; };
  const scrollsX = (el, stop, win) => {
    for (let e = el.parentElement; e && e !== stop; e = e.parentElement) {
      if (/auto|scroll/.test(win.getComputedStyle(e).overflowX)) return true;
    }
    return false;
  };

  A.collect = (doc, win, opts = {}) => {
    const out = [];
    const seen = new Map();
    const add = (rule, el, detail) => {
      const selector = selectorOf(el);
      const k = rule + '|' + selector;
      if (seen.has(k)) { seen.get(k).count++; return; }
      const v = { rule, selector, detail, count: 1 };
      seen.set(k, v); out.push(v);
    };
    const SKIP = opts.ownViews ? SKIP_BASE : SKIP_OWN;
    const roots = [doc.querySelector('.outerContentFrame'), ...(opts.ownViews ? [doc.getElementById('lp-app'), doc.getElementById('lp-drawer')] : [])].filter(Boolean);
    const own = (opts.own || []).map((c) => A.toRgb(c, doc));
    for (const root of roots) {
    const frameRight = root.getBoundingClientRect().right;
    for (const el of root.querySelectorAll('*')) {
      if (el.closest(SKIP)) continue;
      const cs = win.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const radius = Math.max(...['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].map((p) => parseFloat(cs[p]) || 0));
      if (radius > 6 && r.width >= 24 && r.height >= 24) add('rund', el, radius + 'px');
      // pills: v1's runde mærker og knapper i de egne visninger
      if (opts.ownViews && (el.classList.contains('lp-pill') || (radius >= 12 && r.height <= 36 && r.width >= 24))) add('tag', el, radius + 'px');
      if (text && !/^"?LP Plex/.test(cs.fontFamily)) add('skrift', el, cs.fontFamily.slice(0, 40));
      for (const p of ['color', 'backgroundColor', 'borderTopColor']) {
        if (p === 'color' && !text) continue;
        if (p === 'borderTopColor' && !(parseFloat(cs.borderTopWidth) > 0)) continue;
        if (A.isForeignBlue(A.toRgb(cs[p], doc), own)) { add('blaa', el, `${p} ${cs[p]}`); break; }
      }
      if (text) {
        const fg = A.toRgb(cs.color, doc);
        const bg = bgOf(el, win, doc);
        if (fg && fg.a > 0) {
          const size = parseFloat(cs.fontSize);
          const bold = (parseInt(cs.fontWeight, 10) || 400) >= 700;
          const off = !!el.closest('[disabled], [aria-disabled="true"], .disabled, .aspNetDisabled');
          const min = size >= 24 || (size >= 18.66 && bold) || off ? 3 : 4.5;
          const c = A.contrast(blend({ ...fg, a: fg.a * opacityOf(el, win) }, bg), bg);
          if (c < min) add('kontrast', el, c.toFixed(2));
        }
      }
      if (opts.theme === 'dark') {
        const bgc = A.toRgb(cs.backgroundColor, doc);
        if (bgc && bgc.a > 0.5 && A.lum(bgc) > 0.5 && r.width >= 20 && r.height >= 20) add('lys', el, 'flade ' + cs.backgroundColor);
        for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
          if (!(parseFloat(cs[`border${side}Width`]) > 0) || cs[`border${side}Style`] === 'none') continue;
          const bc = A.toRgb(cs[`border${side}Color`], doc);
          if (bc && bc.a > 0.3 && A.lum(bc) > 0.6) { add('lys', el, 'kant ' + side.toLowerCase()); break; }
        }
      }
      if (/^(TD|TH)$/.test(el.tagName) && el.closest(TABLES) && (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0) > 14) add('tabel', el, `${cs.paddingTop} ${cs.paddingBottom}`);
      if (el.matches(BUTTONS)) {
        const a = el.querySelector('a, button');
        if (a && a.getBoundingClientRect().width < r.width * 0.9) add('knap', el, 'link fylder ikke knappen');
      }
      if (r.right > frameRight + 2 && !scrollsX(el, root, win)) add('overloeb', el, Math.round(r.right - frameRight) + ' px');
    }
    }
    // ugeskemaet: timegitteret skal starte i samme højde i alle dage
    for (const wk of doc.querySelectorAll('.lp-week')) {
      const tops = [...wk.querySelectorAll('.lp-day > .lp-day-body')].map((b) => b.getBoundingClientRect().top);
      if (tops.length > 1 && Math.max(...tops) - Math.min(...tops) > 1) out.push({ rule: 'flugt', selector: 'div.lp-week', detail: Math.round(Math.max(...tops) - Math.min(...tops)) + ' px', count: 1 });
    }
    if (doc.documentElement.scrollWidth > win.innerWidth + 1) out.push({ rule: 'overloeb', selector: 'html', detail: 'hele siden ruller vandret', count: 1 });
    return out;
  };
})();
