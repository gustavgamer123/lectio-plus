const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const win = loadExt(['src/lib/core.js', 'src/lib/subjects.js', 'src/lib/parse.js']);
const { LP, Date: D } = win;
const BASE = '/lectio/123/';
const doc = (body) => new win.DOMParser().parseFromString(`<!doctype html><html><body>${body}</body></html>`, 'text/html');
const at = (...a) => new D(...a).getTime();
const brik = (cls, tip, href = '') => `<a class="s2skemabrik ${cls}"${href ? ` href="${href}"` : ''} data-tooltip="${LP.esc(tip)}">x</a>`;
const row = (cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;

test('parseTip: ændret modul med lektier og note', () => {
  const o = LP.parseTip('Ændret!\n10/11-2026 10:05 til 11:35\nHold: 2b FY\nLærer: Mette Lund (ML)\nLokale: 2.14\nLektier:\nLæs kap. 3.2\nNote:\nHusk lommeregner');
  assert.equal(o.status, 'changed');
  assert.equal(o.start.getTime(), at(2026, 10, 10, 10, 5));
  assert.equal(o.end.getTime(), at(2026, 10, 10, 11, 35));
  assert.equal(o.hold, '2b FY');
  assert.equal(o.teacher, 'Mette Lund (ML)');
  assert.equal(o.room, '2.14');
  assert.equal(o.homework, 'Læs kap. 3.2');
  assert.equal(o.note, 'Husk lommeregner');
  assert.equal(o.subject.code, 'FY');
});
test('parseTip: aflyst', () => assert.equal(LP.parseTip('Aflyst!\n9/11-2026 08:15 til 09:45\nHold: 2b MA').status, 'cancelled'));
test('parseTip: hele dagen', () => {
  const o = LP.parseTip('Studietur\n12/11-2026 Hele dagen');
  assert.equal(o.allDay, true);
  assert.equal(o.title, 'Studietur');
  assert.equal(o.start.getTime(), at(2026, 10, 12));
});

test('parseSkema: uge, dage, moduler og brikker', () => {
  const sk = LP.parseSkema(doc(`
    <div class="s2weekHeader">Uge 45 - 2026</div>
    <div class="s2module-info">1. modul 08:15 - 09:45</div>
    <table class="s2skema"><tbody>
      <tr><td></td><td></td><td></td></tr>
      <tr class="s2dayHeader"><td></td><td>Mandag (2/11)</td><td>Tirsdag (3/11)</td></tr>
      <tr><td></td><td>${brik('', 'Studietur\n2/11-2026 Hele dagen')}</td><td></td></tr>
      <tr><td></td>
        <td>${brik('s2changed', '2/11-2026 10:05 til 11:35\nHold: 2b FY', '/lectio/123/aktivitet/aktivitetforside2.aspx?absid=1')}</td>
        <td>${brik('s2cancelled', '3/11-2026 08:15 til 09:45\nHold: 2b MA')}</td></tr>
    </tbody></table>`), BASE);
  assert.equal(sk.week, 45);
  assert.equal(sk.year, 2026);
  assert.equal(sk.days[0].name, 'Mandag');
  assert.equal(sk.days[0].date.getTime(), at(2026, 10, 2));
  assert.deepEqual({ ...sk.modules[0] }, { n: 1, start: '08:15', end: '09:45' });
  assert.equal(sk.lessons.find((l) => l.title === 'Studietur').allDay, true);
  const ch = sk.lessons.find((l) => l.changed);
  assert.equal(ch.href, 'https://www.lectio.dk/lectio/123/aktivitet/aktivitetforside2.aspx?absid=1');
  assert.equal(ch.subject.code, 'FY');
  assert.equal(sk.lessons.find((l) => l.cancelled).subject.code, 'MA');
});
test('parseSkema: uge 1 med mandag i december får året før', () => {
  const sk = LP.parseSkema(doc(`
    <div class="s2weekHeader">Uge 1 - 2027</div>
    <table class="s2skema"><tbody><tr><td></td><td></td></tr>
      <tr class="s2dayHeader"><td></td><td>Mandag (28/12)</td></tr></tbody></table>`), BASE);
  assert.equal(sk.days[0].date.getTime(), at(2026, 11, 28));
});

test('parseAssignments', () => {
  const [t] = LP.parseAssignments(doc(`<table id="s_m_Content_Content_ExerciseGV"><tbody>
    ${row(['Uge', 'Hold', 'Opgave', 'Frist', 'Elevtid', 'Status', 'Fravær', 'Afventer', 'Note', 'Karakter'])}
    ${row(['45', '2b FY', '<a href="ElevAflevering.aspx?exerciseid=9">Rapport: frit fald</a>', '6/11-2026 23:59', '5,00', 'Venter', '0 %', 'Elev', '', ''])}
  </tbody></table>`), BASE);
  assert.equal(t.title, 'Rapport: frit fald');
  assert.equal(t.due.getTime(), at(2026, 10, 6, 23, 59));
  assert.equal(t.hours, '5,00');
  assert.equal(t.status, 'Venter');
  assert.equal(t.subject.code, 'FY');
  assert.equal(t.href, 'https://www.lectio.dk/lectio/123/ElevAflevering.aspx?exerciseid=9');
});

const hwTable = (date) => doc(`<table id="s_m_Content_Content_MaterialLektieOverblikGV"><tbody>
  ${row(['Dato', 'Aktivitet', 'Note'])}
  ${row([date, 'Engelsk 2. modul - 2b EN • lokale 1.07', 'Read<br>"The Lottery"'])}
</tbody></table>`);
test('parseHomework', () => {
  const [h] = LP.parseHomework(hwTable('3/11'), BASE, new D(2026, 10, 2));
  assert.equal(h.date.getTime(), at(2026, 10, 3));
  assert.equal(h.text, 'Read\n"The Lottery"');
  assert.equal(h.subject.code, 'EN');
});
test('parseHomework: januar set fra december er næste år', () => {
  const [h] = LP.parseHomework(hwTable('5/1'), BASE, new D(2026, 11, 20));
  assert.equal(h.date.getTime(), at(2027, 0, 5));
});

test('parseMessages: læst, ulæst og link', () => {
  const msg = (src) => row(['', '', `<img id="x_readId" src="${src}">`, `<span onclick="__doPostBack('t','_12345678')">Emne</span>`, 'Afsender', 'Første', 'Til', 'i går']);
  const m = LP.parseMessages(doc(`<table id="s_m_Content_Content_threadGV_ctl00"><tbody>
    ${row(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])}${msg('/lectio/img/mread.gif')}${msg('/lectio/img/munread.gif')}
  </tbody></table>`), BASE);
  assert.equal(m[0].unread, false);
  assert.equal(m[1].unread, true);
  assert.equal(m[0].href, '/lectio/123/beskeder2.aspx?type=visbesked&id=12345678');
});

// Baggrundens offscreen-dokument omdøber on*-attributter til data-lp-on*, så Chrome ikke logger CSP-fejl ved læsningen.
test('parseMessages finder besked-id, også når onclick er omdøbt til data-lp-onclick', () => {
  const m = LP.parseMessages(doc(`<table id="s_m_Content_Content_threadGV_ctl00"><tbody>
    ${row(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])}${row(['', '', '<img id="x_readId" src="/lectio/img/mread.gif">', `<span data-lp-onclick="__doPostBack('t','_87654321')">Emne</span>`, 'Afsender', 'Første', 'Til', 'i går'])}
  </tbody></table>`), BASE);
  assert.equal(m[0].href, '/lectio/123/beskeder2.aspx?type=visbesked&id=87654321');
});

test('parseAbsence: hold sorteret og samlet', () => {
  const a = LP.parseAbsence(doc(`<table id="s_m_Content_Content_SFTabStudentAbsenceDataTable"><tbody>
    ${row(['2b DA', '1/40', '2,50 %', '0/10', '0 %'])}
    ${row(['2b FY', '3/40', '7,50 %', '2,00/20,00', '10,00 %'])}
    ${row(['Samlet', '4/80', '5,00 %', '2,00/30,00', '6,67 %'])}
  </tbody></table>`));
  assert.equal(a.rows[0].hold, '2b FY');
  assert.deepEqual([...a.rows[0].mods], [3, 40]);
  assert.equal(a.total.pct, 5);
  assert.equal(a.total.wPct, 6.67);
});

test('parseGrades: nuværende karakterer og protokollinjer', () => {
  const g = LP.parseGrades(doc(`<table id="x_KarakterGV"><tbody>
    <tr><th>Hold</th><th>Fag</th><th class="OnlyMobile">Hold/Fag</th><th>1.standpunkt</th><th>2.standpunkt</th><th>Årskarakter</th><th>Eksamen</th></tr>
    <tr><td>2y BT</td><td>Bioteknologi A, Skriftlig</td><td class="OnlyMobile">Hold: 2y BT</td><td>7</td><td></td><td></td><td></td></tr></tbody></table>
    <table id="x_ProtokolLinierGrid"><tbody>
    <tr><th>Termin</th><th>Type</th><th>Medtæller</th><th>XPRS fag</th><th>Evalueringsform</th><th>Hold</th><th>Vægt</th><th>Karakter</th><th>Skala</th></tr>
    <tr><td>Sommer 2026</td><td>Afsl. Standpkt.</td><td>Ja</td><td>4686C Design og arkitektur</td><td>Mundtlig</td><td>2025 de_c</td><td>1,00</td><td>10</td><td>7-trinsskala</td></tr></tbody></table>`));
  assert.deepEqual({ ...g.current[0] }, { hold: '2y BT', subject: 'Bioteknologi', level: 'A', form: 'Skriftlig', s1: '7', s2: '', year: '', exam: '' });
  assert.deepEqual({ ...g.protocol[0] }, { term: 'Sommer 2026', type: 'Afsl. Standpkt.', counts: true, subject: 'Design og arkitektur', form: 'Mundtlig', hold: '2025 de_c', weight: 1, grade: '10', scale: '7-trinsskala' });
});

test('parseFront: hold og opslag fra skolen', () => {
  const f = LP.parseFront(doc(`
    <section class="lf-island"><span class="dashboardTextHeader">Hold og grupper</span>
      <a href="SkemaNy.aspx?type=holdelement&id=1">2b FY</a><a href="SkemaNy.aspx?type=holdelement&id=2">2b DA</a></section>
    <section class="lf-island"><span class="dashboardTextHeader">Studievejledning</span>
      <table class="dashboard"><tbody><tr><td class="infoCol"><script>alert(1)</script>Book en samtale med din studievejleder</td><td class="timeCol attention">ma 9/11 12:00</td></tr></tbody></table></section>`), BASE);
  assert.equal(f.hold.length, 2);
  assert.equal(f.hold[0].href, 'https://www.lectio.dk/lectio/123/SkemaNy.aspx?type=holdelement&id=1');
  assert.equal(f.notices[0].rows[0].attention, true);
  assert.ok(!f.notices[0].rows[0].html.includes('script'));
});

test('safeHtml fjerner farlige ting og gør links absolutte', () => {
  const src = doc('<div id="s"><button>x</button><input><a href="javascript:x()">j</a><a href="https://example.com">e</a><img src="/x.png"></div>').getElementById('s');
  const out = doc(LP.safeHtml(src, 'https://www.lectio.dk/lectio/123/'));
  assert.equal(out.querySelector('button, input'), null);
  assert.equal(out.querySelectorAll('a')[0].hasAttribute('href'), false);
  assert.equal(out.querySelectorAll('a')[1].getAttribute('target'), '_blank');
  assert.equal(out.querySelector('img').getAttribute('src'), 'https://www.lectio.dk/x.png');
});
