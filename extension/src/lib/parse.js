/* Lectio+ : læser data ud af Lectios sider. Alle parsere får skolens mappe (base), fx /lectio/123/. */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});
  const LECTIO_HOST = 'www.lectio.dk';

  LP.cleanText = (el) => {
    if (!el) return '';
    const c = el.cloneNode(true);
    c.querySelectorAll('[class*="material"], .ls-fonticon, .ls-icon, img, script, style').forEach((x) => { if (x.tagName === 'IMG' || x.textContent.trim().length < 25) x.remove(); });
    return c.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
      .replace(/^(?:sms|bookmark|chat|description|attach_file|mail|check_circle|schedule|event)+/i, '').trim();
  };

  /* sikker kopi af Lectio-indhold: kun tekst, links, lister og billeder */
  const KEEP = new Set(['A', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'SPAN', 'P', 'DIV', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'ARTICLE', 'SECTION', 'HR', 'IMG', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'BLOCKQUOTE', 'PRE', 'CODE', 'SUP', 'SUB']);
  const DROP = /^(SCRIPT|STYLE|LINK|META|INPUT|TEXTAREA|SELECT|BUTTON|IFRAME|OBJECT|EMBED|NOSCRIPT|TEMPLATE|MENUTEMPLATE|DIALOG|FORM|SVG)$/;
  LP.safeHtml = (src, base) => {
    const document = src.ownerDocument;
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
          if (u) { el.href = u.href; if (u.host !== LECTIO_HOST) { el.target = '_blank'; el.rel = 'noopener'; } }
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
  };

  /* ---------------- parsere ---------------- */
  LP.parseTip = (t) => {
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
    o.subject = LP.subjectFrom(o.hold, o.title);
    return o;
  };

  LP.parseSkema = (doc, base) => {
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
      const info = LP.parseTip(a.getAttribute('data-tooltip') || '');
      const day = Math.max(0, (td ? td.cellIndex : 1) - 1);
      lessons.push({
        ...info,
        day,
        allDay: info.allDay || (tr && tr.rowIndex === 2) || !info.start,
        href: LP.abs(a.getAttribute('href'), base),
        changed: a.classList.contains('s2changed') || info.status === 'changed',
        cancelled: a.classList.contains('s2cancelled') || info.status === 'cancelled'
      });
    });
    lessons.forEach((l) => { if (!l.start && days[l.day]?.date) { l.start = days[l.day].date; } });
    lessons.sort((a, b) => (a.start || 0) - (b.start || 0));
    return { week: weekNo, year, days, lessons, modules };
  };

  LP.parseAssignments = (doc, base) => {
    const t = doc.querySelector('#s_m_Content_Content_ExerciseGV');
    if (!t) return [];
    return [...t.rows].slice(1).filter((r) => r.cells.length > 6).map((r) => {
      const c = r.cells;
      const fm = c[3].textContent.trim().match(/(\d{1,2})\/(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/);
      const due = fm ? new Date(+fm[3], +fm[2] - 1, +fm[1], +fm[4], +fm[5]) : null;
      return {
        week: c[0].textContent.trim(),
        hold: c[1].textContent.trim(),
        title: LP.cleanText(c[2]),
        href: LP.abs(c[2].querySelector('a')?.getAttribute('href'), base),
        due,
        hours: c[4].textContent.trim(),
        status: c[5].textContent.trim(),
        absence: c[6].textContent.trim(),
        waiting: c[7].textContent.trim(),
        grade: c[9] ? c[9].textContent.trim() : '',
        subject: LP.subjectFrom(c[1].textContent.trim())
      };
    });
  };

  LP.parseHomework = (doc, base, now = new Date()) => {
    const t = doc.querySelector('#s_m_Content_Content_MaterialLektieOverblikGV');
    if (!t) return [];
    return [...t.rows].slice(1).filter((r) => r.cells.length >= 3).map((r) => {
      const c = r.cells;
      const dateTxt = c[0].textContent.trim();
      const dm = dateTxt.match(/(\d{1,2})\/(\d{1,2})/);
      let date = null;
      if (dm) {
        date = new Date(now.getFullYear(), +dm[2] - 1, +dm[1]);
        if (date < new Date(now.getFullYear(), now.getMonth() - 6, 1)) date.setFullYear(now.getFullYear() + 1);
      }
      const activity = LP.cleanText(c[1]);
      const holdMatch = activity.match(/modul\s*-\s*([^•]+)•/) || activity.match(/^([^•]+)•/);
      return {
        dateTxt, date, activity,
        href: LP.abs(c[1].querySelector('a')?.getAttribute('href'), base),
        text: (() => {
          const cl = c[2].cloneNode(true);
          cl.querySelectorAll('[class*="fonticon"], script, style').forEach((n) => n.remove());
          cl.querySelectorAll('br').forEach((n) => n.replaceWith('\n'));
          cl.querySelectorAll('div, p, li').forEach((n) => n.prepend('\n'));
          return cl.textContent.replace(/[ \t ]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
        })(),
        subject: LP.subjectFrom(holdMatch ? holdMatch[1].trim() : '')
      };
    });
  };

  LP.parseMessages = (doc, base) => {
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
        subject: LP.cleanText(c[3]),
        from: LP.cleanText(c[4]),
        first: LP.cleanText(c[5]),
        to: LP.cleanText(c[6]),
        changed: LP.cleanText(c[7]),
        unread: !!src && !/\/mread\.gif/i.test(src),
        flagged: /flag/i.test((r.querySelector('[id$="flagId"]')?.getAttribute('src')) || '') && !/noflag|flagoff|flag_off/i.test(r.querySelector('[id$="flagId"]')?.getAttribute('src') || ''),
        href: mid ? `${base}beskeder2.aspx?type=visbesked&id=${mid}` : LP.abs(link && link.getAttribute('href'), base)
      };
    });
  };

  LP.parseAbsence = (doc) => {
    const num = LP.num;
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
  };

  LP.parseGrades = (doc) => {
    const num = LP.num;
    const t = [...doc.querySelectorAll('table')].find((x) => x.rows.length > 1 && /Årskarakter/.test(x.rows[0].textContent) && /Fag/.test(x.rows[0].textContent));
    if (!t) return [];
    return [...t.rows].slice(2).filter((r) => r.cells.length >= 7).map((r) => {
      const c = [...r.cells].map((x) => x.textContent.trim().split('\n')[0].trim());
      return { subject: c[0], weight: num(c[1]), grade: c[2], ects: c[3], examWeight: num(c[4]), exam: c[5], examEcts: c[6] };
    });
  };

  LP.parseFront = (doc, base) => {
    const notices = [];
    const hold = [];
    doc.querySelectorAll('section.lf-island').forEach((s) => {
      const title = (s.querySelector('.dashboardLinkHeaderText, .dashboardTextHeader')?.textContent || '').trim();
      if (!title) return;
      if (/^hold og grupper/i.test(title)) {
        s.querySelectorAll('a[href]').forEach((a) => { const h = LP.abs(a.getAttribute('href'), base); const n = a.textContent.trim(); if (h && n) hold.push({ name: n, href: h }); });
        return;
      }
      if (/^(lektier|opgaveaflevering|beskeder|i dag|i morgen|skema)/i.test(title)) return;
      const link = LP.abs(s.querySelector('a.dashboardItemTitle')?.getAttribute('href'), base);
      const rows = [...s.querySelectorAll('table.dashboard tr')].map((tr) => {
        const info = tr.querySelector('td.infoCol') || tr.cells[0];
        const time = tr.querySelector('td.timeCol');
        return { html: info ? LP.safeHtml(info, LP.ORIGIN + base) : '', time: time ? time.textContent.trim() : '', attention: !!(time && time.classList.contains('attention')) };
      }).filter((r) => r.html.replace(/<[^>]+>/g, '').trim());
      if (rows.length) notices.push({ title, link, rows });
    });
    return { notices, hold };
  };
})();
