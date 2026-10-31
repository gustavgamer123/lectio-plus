/* Lectio+ : fanerne foroven, Mere-menuen og hvilken side der er aktiv */
(() => {
  'use strict';
  const LP = (globalThis.LP = globalThis.LP || {});

  // Fanerne hedder det samme som i Lectio.
  LP.NAV_TABS = [
    { key: 'forside', label: 'Forside', icon: 'home', path: 'forside.aspx', words: 'forside hjem dashboard overblik' },
    { key: 'skema', label: 'Skema', icon: 'cal', path: 'SkemaNy.aspx', words: 'skema uge timer moduler' },
    { key: 'lektier', label: 'Lektier', icon: 'book', path: 'material_lektieoversigt.aspx', words: 'lektier' },
    { key: 'opgaver', label: 'Opgaver', icon: 'task', path: 'OpgaverElev.aspx', words: 'opgaver afleveringer frister' },
    { key: 'beskeder', label: 'Beskeder', icon: 'mail', path: 'beskeder2.aspx', words: 'beskeder indbakke mail' },
    { key: 'fravaer', label: 'Fravær', icon: 'absence', path: 'subnav/fravaerelev.aspx', words: 'fravær fravaer procent' },
    { key: 'karakterer', label: 'Karakterer', icon: 'star', path: 'grades/grade_report.aspx', words: 'karakterer karakter snit' }
  ];
  LP.NAV_MORE = [
    { group: 'Studie og dokumenter', items: [
      { key: 'studieplan', label: 'Studieplan', icon: 'plan', path: 'studieplan.aspx?displaytype=ugeteksttabel', words: 'studieplan forløb kalender' },
      { key: 'dokumenter', label: 'Dokumenter', icon: 'doc', path: 'DokumentOversigt.aspx', words: 'dokumenter filer' }
    ] },
    { group: 'Skema og kalender', items: [
      { key: 'dagsaendringer', label: 'Dagsændringer', path: 'SkemaDagsaendringer.aspx', words: 'ændringer aflyst i dag' },
      { key: 'ugeaendringer', label: 'Ugeændringer', path: 'SkemaUgeaendringer.aspx', words: 'ændringer uge' },
      { key: 'kalender', label: 'Månedskalender', path: 'kalender.aspx', words: 'kalender måned begivenheder' },
      { key: 'findskema', label: 'Find skema', path: 'FindSkema.aspx?type=laerer', words: 'find skema lærer lokale klasse elev' }
    ] },
    { group: 'Studie', items: [
      { key: 'uvb', label: 'Undervisningsbeskrivelse', path: 'studieplan/undervisningsbeskrivelse.aspx', words: 'undervisningsbeskrivelse forløb' },
      { key: 'kontaktbog', label: 'Kontaktbøger', path: 'teacherstudybook.aspx?type=contactbooks', words: 'kontaktbog' },
      { key: 'studieretning', label: 'Studieretning', path: 'studieretningElevValg.aspx', words: 'studieretning' },
      { key: 'valgfag', label: 'Valgfag', path: 'studieretningValgfag.aspx', words: 'valgfag ønsker' },
      { key: 'fagvalg', label: 'Fagvalg', path: 'fagvalg/fagvalgoversigt.aspx', words: 'fagvalg' },
      { key: 'karakterblad', label: 'Karaktermeddelelse', path: 'grades/grade_karakterblad.aspx', words: 'karaktermeddelelse karakterblad' },
      { key: 'fravaersaarsager', label: 'Fraværsårsager', path: 'subnav/fravaerelev_fravaersaarsager.aspx', words: 'fraværsårsager årsag' }
    ] },
    { group: 'Dig', items: [
      { key: 'boger', label: 'Bøger', path: 'BD/UserReservations.aspx', words: 'bøger boger lån' },
      { key: 'sporgeskema', label: 'Spørgeskemaer', path: 'spoergeskema/spoergeskema_rapport.aspx', words: 'spørgeskema' },
      { key: 'sps', label: 'SPS', path: 'Elev_SPS.aspx', words: 'sps støtte' },
      { key: 'studiekort', label: 'Studiekort', path: 'digitaltStudiekort.aspx', words: 'studiekort id' },
      { key: 'profil', label: 'Profil', path: 'indstillinger/studentIndstillinger.aspx', words: 'profil indstillinger' },
      { key: 'betalinger', label: 'Betalinger', path: 'MinButik.aspx', words: 'betalinger butik' },
      { key: 'adgangslog', label: 'Log', path: 'indstillinger/AdgangIndstillinger.aspx', words: 'log adgang login' }
    ] },
    { group: 'Lectio', items: [
      { key: 'hovedmenu', label: 'Hovedmenu', path: 'default.aspx', words: 'hovedmenu alt menu' },
      { key: 'kontakt', label: 'Kontakt', path: 'default.aspx?menu=kontakt', words: 'kontakt skolen' },
      { key: 'hjaelp', label: 'Hjælp', path: 'help/mainhelp.aspx', words: 'hjælp help' }
    ] }
  ];
  // Kun i søgningen, ikke i menuerne.
  LP.PAL_ONLY = [
    { label: 'Find skema for elev', path: 'FindSkema.aspx?type=elev', words: 'find elev skema' },
    { label: 'Find skema for lærer', path: 'FindSkema.aspx?type=laerer', words: 'find lærer skema' },
    { label: 'Find skema for klasse', path: 'FindSkema.aspx?type=stamklasse', words: 'find klasse skema' },
    { label: 'Find skema for lokale', path: 'FindSkema.aspx?type=lokale', words: 'find lokale rum skema' },
    { label: 'Find skema for hold', path: 'FindSkema.aspx?type=hold', words: 'find hold skema' },
    { label: 'Find skema for ressource', path: 'FindSkema.aspx?type=ressource', words: 'find ressource skema' },
    { label: 'Avanceret skema', path: 'FindSkemaAdv.aspx', words: 'avanceret skema' },
    { label: 'Undervisningsbeskrivelser for skolen', path: 'studieplan/uvb_list_off.aspx', words: 'undervisningsbeskrivelser' }
  ];
  LP.MORE_ITEMS = LP.NAV_MORE.flatMap((g) => g.items);

  const pathOnly = (p) => p.split('?')[0].toLowerCase();
  // page er stien efter /lectio/<skole>/ med små bogstaver, search er location.search.
  LP.activeKey = (page, search) => {
    const p = page;
    const q = (search || '').toLowerCase();
    const exact = LP.NAV_TABS.concat(LP.MORE_ITEMS).find((n) => pathOnly(n.path) === p && (!n.path.includes('?') || n.key === 'studieplan' || q.includes(n.path.split('?')[1].toLowerCase())));
    if (exact) return exact.key;
    if (p.startsWith('forside')) return 'forside';
    if (p.startsWith('skemany') || p.startsWith('skema/') || p.startsWith('aktivitet/')) return 'skema';
    if (p.startsWith('findskema')) return 'findskema';
    if (p.startsWith('material_lektie')) return 'lektier';
    if (p.startsWith('opgave') || p.startsWith('elevaflevering') || p.startsWith('elev_aflevering')) return 'opgaver';
    if (p.startsWith('beskeder')) return 'beskeder';
    if (p.startsWith('subnav/fravaer')) return 'fravaer';
    if (p.startsWith('grades')) return 'karakterer';
    if (p.startsWith('studieplan') || p.startsWith('studieretning') || p.startsWith('fagvalg')) return 'studieplan';
    if (p.startsWith('dokument')) return 'dokumenter';
    if (p.startsWith('bd/')) return 'boger';
    if (p.startsWith('spoergeskema')) return 'sporgeskema';
    if (p.startsWith('indstillinger')) return 'profil';
    return null;
  };

  // Lectios undersider til en fane markerer fanen; resten af Mere markerer Mere.
  const TAB_OF = { fravaersaarsager: 'fravaer', karakterblad: 'karakterer' };
  LP.tabFor = (key) => {
    if (!key) return null;
    if (LP.NAV_TABS.some((n) => n.key === key)) return key;
    if (TAB_OF[key]) return TAB_OF[key];
    return LP.MORE_ITEMS.some((n) => n.key === key) ? 'more' : null;
  };
})();
