/* Lectio+ : fag, farver og lærerforkortelser */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  LP.SUBJECTS = {
    DA: 'Dansk', MA: 'Matematik', EN: 'Engelsk', TY: 'Tysk', FR: 'Fransk', SP: 'Spansk', BT: 'Bioteknologi', BI: 'Biologi',
    KE: 'Kemi', FY: 'Fysik', HI: 'Historie', SA: 'Samfundsfag', RE: 'Religion', ID: 'Idræt', MU: 'Musik', BK: 'Billedkunst',
    DE: 'Design', DD: 'Design og arkitektur', PS: 'Psykologi', NG: 'Naturvidenskabeligt grundforløb', AP: 'Almen sprogforståelse',
    OL: 'Oldtidskundskab', IN: 'Informatik', NV: 'Naturvidenskab', NA: 'Naturgeografi', GE: 'Geografi', MD: 'Mediefag',
    DR: 'Dramatik', FI: 'Filosofi', LA: 'Latin', IT: 'Italiensk', KI: 'Kinesisk', JA: 'Japansk', VØ: 'Virksomhedsøkonomi',
    EØ: 'Erhvervsøkonomi', AS: 'Astronomi', BIO: 'Biologi', MAT: 'Matematik', KS: 'Kultur og samfundsfag', SRP: 'SRP', SRO: 'SRO', DHO: 'DHO'
  };
  LP.subjectFrom = (hold, title) => {
    if (!hold) return null;
    const first = hold.split(',')[0].trim();
    const parts = first.split(/\s+/);
    const code = (parts.length > 1 ? parts[parts.length - 1] : parts[0]).toUpperCase();
    if (LP.SUBJECTS[code]) return { code, name: LP.SUBJECTS[code] };
    if (/^[A-ZÆØÅ]{1,4}\d?$/.test(code)) return { code, name: code };
    return null;
  };
  // Farver brugeren selv har valgt til et fag (gemt pr. fagkode) går forud for de automatiske.
  LP.SWATCHES = [0, 20, 38, 55, 90, 135, 162, 182, 200, 218, 238, 262, 288, 322];
  LP.hueFor = (str, colors) => {
    if (!str) return 230;
    const own = colors && colors[str];
    if (typeof own === 'number') return own;
    let h = 0;
    for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const palette = [230, 262, 292, 330, 352, 18, 36, 152, 172, 196, 210, 120];
    return palette[h % palette.length];
  };
  LP.shortTeacher = (t) => (t || '').replace(/[^,]*\(([^)]+)\)/g, '$1').trim();
})();
