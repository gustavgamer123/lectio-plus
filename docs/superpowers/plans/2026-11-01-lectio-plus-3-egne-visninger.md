# Lectio+ 2.0, plan 3: Egne visninger i D

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Forside, Skema, Lektier, Opgaver, Beskeder, Fravær, Karakterer, Studieplan, opgavesiden, lektionssiden og lektionspanelet har retning D og ser ud som Lectios sider fra plan 2. Datafejlene i karakterer, fravær og skema er rettet med tests.

**Architecture:** Visningerne bygges stadig af render-funktionerne i `content.js`. Opmærkningen ændres, hvor en luftig liste skal være en tæt tabel. Al CSS til de egne visninger flyttes til en ny fil, `extension/styles/views.css`, og de gamle lag fra 1.0 til 1.7 i `styles.css` slettes, efterhånden som de erstattes. Målet er, at `styles.css` er tom og kan fjernes til sidst. Audit-værktøjet fra plan 2 udvides, så det også måler de egne visninger (`#lp-app`, `#lp-afl`, `#lp-drawer`).

**Tech Stack:** Som plan 2.

**Spec:** `docs/superpowers/specs/2026-10-31-lectio-plus-2-design.md`, afsnit 5, 6 og 8. Input: `docs/superpowers/plans/notes-efter-plan-2.md`, afsnittet "Egne visninger" og "Mønstre til plan 3".

## Global Constraints

Alt fra plan 1 og 2 gælder. Desuden:
- Alt, hvad 1.x kan i visningerne, skal stadig kunne (spec afsnit 8). Det gælder lektionspanelet med pile, egne fagfarver, flueben ved lektier, `hideDone`, fagfilter, Alt+pile i skemaet, læsepanelet i Beskeder og linket til Lectios visning.
- Fagfarver bruges kun som prikker (8 px, radius 2 px) og som tynde streger (højst 3 px), aldrig som flader.
- Statusmærker er tags: 20 px høje, `padding: 0 6px`, `var(--radius-sm)`, 12 px skrift i vægt 600. Rød, rav og grøn tags bruger `--danger/--danger-soft`, `--warn/--warn-soft` og `--ok/--ok-soft`, og neutrale bruger `--ink-2/--sunk`.
- Panelet er det samme som i plan 2: kant `1px var(--rule)`, `var(--radius)`, et hoved på 40 px med en titel på 14,5 px i vægt 600 over en streg, og indhold med `12px 14px` luft.
- Ingen overskrift i en visning er større end sidetitlen (24 px).

## Review Focus

1. **En elev uden karakterer på beviset endnu:** Karakterer viser de nuværende karakterer, og snittet står som "–" med forklaringen "Ingen karakterer på beviset endnu". Pinnes med en test af `LP.gradeAverage([])` i Task 1 og et skærmbillede i Task 6.
2. **En uge, hvor kun nogle dage har heldagsbegivenheder:** alle dage starter i samme højde. Pinnes med en test af `LP.alldayHeight` i Task 1 og audit-reglen `flugt` i Task 4.
3. **Weekend og aften på Forside:** "Nu" mangler, og "Næste" viser næste skoledag. Det må ikke se tomt eller ødelagt ud. Pinnes med et skærmbillede i Task 3 (i dag er en weekend).
4. **Meget lange titler** (opgaver, beskeder, forløb): de ombrydes i tabellen og skubber ikke siden bredere. Pinnes med audit-reglen `overloeb` på de egne visninger i 1024 px (Task 9).
5. **Lektionspanelet åbnet fra Forside, Skema og søgningen:** samme udseende og pilene virker. Pinnes med skærmbilleder i Task 8 (`--click` på en lektion).

---

## Filstruktur

```
extension/styles/views.css      ny: alle regler for de egne visninger i D
extension/styles.css            ændres: gamle lag slettes, efterhånden som views.css tager over (målet er en tom fil, der fjernes)
extension/manifest.json         ændres: css = tokens, lectio, views, shell (+ styles.css indtil den er tom)
extension/src/lib/parse.js      ændres: parseGrades giver { current, protocol }
extension/src/lib/grades.js     ny: gradeAverage(protocol)
extension/src/lib/week.js       ny: alldayHeight(days, lessons)
extension/content.js            ændres: render-funktionerne for visningerne
tools/audit-rules.js            ændres: valgfri måling af egne visninger, nye regler flugt og tag
tools/audit.mjs                 ændres: --own kører på visningernes sider
test/parse.test.js, test/grades.test.js, test/week.test.js, test/real-pages.test.js
```

---

### Task 1: Data før stil

**Files:** Modify `extension/src/lib/parse.js`, `extension/content.js` (`renderGradesView` og karakterchippen på Forside), `test/parse.test.js`, `test/real-pages.test.js`. Create `extension/src/lib/grades.js`, `extension/src/lib/week.js`, `test/grades.test.js`, `test/week.test.js`.

**Interfaces:**
- `LP.parseGrades(doc) -> { current: Current[], protocol: Line[] }`.
  - `Current = { hold, subject, level, form, s1, s2, year, exam }` kommer fra tabellen `[id$="KarakterGV"]`, og kun celler uden `OnlyMobile` læses. `subject` og `level` deles fra "Bioteknologi A", og `form` er "Skriftlig" eller "Mundtlig" eller tom.
  - `Line = { term, type, counts, subject, form, hold, weight, grade, scale }` kommer fra `[id$="ProtokolLinierGrid"]`. `counts` er `true`, når "Medtæller" er "Ja". `weight` er et tal.
- `LP.gradeAverage(lines) -> { avg: number|null, weight: number, n: number }`. Den vægter med `weight` og tager kun linjer, hvor `counts` er sand, og `grade` er et heltal på 7-trinsskalaen (-3, 00, 02, 4, 7, 10, 12).
- `LP.alldayHeight(days, lessons) -> px`. Den giver `max(antal heldagsbegivenheder pr. dag) * 26 + 6`, eller 6, hvis der ingen er.
- Fravær: `parseAbsence` ændres ikke. Visningen viser `pct` som "Opgjort" og `mods` som "Moduler i perioden", så de ikke står som ét tal.

- [ ] **Step 1: Skriv de fejlende tests.**
  - Syntetisk `parseGrades`: en tabel med id `x_KarakterGV`, hvor rækken er `['2y BT', 'Bioteknologi A, Skriftlig', '<mobil>', '7', '', '', '']` (den tredje celle har klassen `OnlyMobile`). Det giver `current[0]` lig `{ hold: '2y BT', subject: 'Bioteknologi', level: 'A', form: 'Skriftlig', s1: '7', s2: '', year: '', exam: '' }`. En tabel med id `x_ProtokolLinierGrid` og rækken `['Sommer 2026', 'Afsl. Standpkt.', 'Ja', '4686C Design og arkitektur', 'Mundtlig', '2025 de_c', '1,00', '10', '7-trinsskala']` giver `protocol[0]` med `counts: true`, `weight: 1` og `grade: '10'`.
  - `gradeAverage([{counts:true,weight:1,grade:'10'},{counts:true,weight:2,grade:'7'},{counts:false,weight:1,grade:'12'},{counts:true,weight:1,grade:'B'}])` giver `{ avg: 8, weight: 3, n: 2 }`. `gradeAverage([])` giver `{ avg: null, weight: 0, n: 0 }` (Review Focus 1).
  - `alldayHeight` med 5 dage, hvor mandag har 2 heldagsbegivenheder og onsdag 1, giver `58`. Uden heldagsbegivenheder giver den `6`.
  - Rigtig fixture: `parseGrades(grades_grade_report)` giver mindst én `current` med `subject` uden "Hold:" og mindst én `protocol`-linje med en vægt, der er et tal.
- [ ] **Step 2:** Kør `npm test`, og se dem fejle.
- [ ] **Step 3:** Implementer. Opdater Forsides "Snit"-chip og `renderGradesView` til den nye form. Selve udseendet af visningen kommer i Task 6.
- [ ] **Step 4:** Kør `npm test` (PASS). Commit og push.

---

### Task 2: Fælles sideramme, paneler, tags og tabeller til visningerne, og audit af visningerne

**Files:** Create `extension/styles/views.css`. Modify `extension/manifest.json`, `extension/styles.css` (slet `#lp-app`-rammen, `.lp-card`, `.lp-sheet`, `.lp-group`, `.lp-pill`, `.lp-card-head` og `.lp-card-foot` i alle lag), `tools/audit-rules.js`, `tools/audit.mjs`, `test/audit-rules.test.js`.

- Siderammen: `#lp-app` får samme placering som Lectios side. Titlen står ved x 61 og y 138, og indholdet ved x 68 ved 1280 px. Det svarer til `padding: 50px 61px 64px` og et indhold med `margin: 0 7px` under sidehovedet. `max-width` er 1760 px ligesom Lectio.
- Komponenter (genbruges af alle visninger):
  - `.lp-panel`, med `.lp-panel-head` (h2 + højre handlinger) og `.lp-panel-body`, er panelet fra plan 2. `.lp-card`, `.lp-sheet` og `.lp-group` bliver aliaser, indtil visningerne er skrevet om.
  - `.lp-tag` med `.is-danger`, `.is-warn`, `.is-ok` og `.is-accent` følger Global Constraints. `.lp-pill` bliver til `.lp-tag`.
  - `table.lp-table` følger samme regel som Lectios tabeller (th 12,5 px/600/`--ink-2`, td `6px 10px`, vandret streg). `tr.is-late` får en rød streg på 3 px i venstre side, og `tr.is-done` er dæmpet til `--ink-2`.
  - `.lp-sd` (fagprik) bliver 8 × 8 px med radius 2 px.
- Audit:
  - `collect(doc, win, { own: true })` måler også inde i `#lp-app`, `#lp-afl`, `#lp-act-hero` og `#lp-drawer`.
  - `TABLES` får `table.lp-table`.
  - Ny regel `flugt`: i `.lp-week` skal den første `.lp-day-body` i hver dag starte i samme `top` (±1 px).
  - Ny regel `tag`: elementer med `.lp-pill` eller en radius på 12 px eller mere og en højde på højst 36 px tælles som pills.
  - `npm run audit -- --own` kører på `LP.NAV_TABS` plus `studieplan.aspx?displaytype=ugeteksttabel`, den første opgave og den første lektion fra fixtures.

- [ ] **Step 1:** Tilføj en test i `test/audit-rules.test.js`: et jsdom-dokument med `#lp-app` og `<span class="lp-pill" style="border-radius:16px">x</span>` giver et brud med reglen `tag`, når `own: true`, og intet brud uden. Se den fejle.
- [ ] **Step 2:** Implementer audit-ændringerne. Kør `npm test` (PASS) og `npm run audit -- --own` som RED-udgangspunkt for Task 3 til 8, og gem tabellen i `docs/superpowers/plans/audit-foer-plan-3.txt`.
- [ ] **Step 3:** Skriv views.css (ramme og komponenter), og slet de gamle regler.
- [ ] **Step 4:** `npm test`, `npm run audit -- --own --rule rund,tag` (færre brud end udgangspunktet) og skærmbilleder af Fravær og Fraværsårsager efter hinanden. Fanerne må ikke hoppe (samme x og y for titel og faner). Commit og push.

---

### Task 3: Forside

**Files:** Modify `extension/content.js` (`renderDashboard`), `extension/styles/views.css`, `extension/styles.css` (slet forsidens gamle regler).

Layout (mockup D, `docs/superpowers/specs/2026-10-31-lectio-plus-2-retning-d.html`):
- Sidehovedet er `pageHead('Forside', '<dag> <dato>. <måned>, uge <n>')` som de andre sider. Hilsenen udgår. Statustags (mangler, denne uge, ulæste, frister, fravær og snit) står i højre side af sidehovedet.
- "Nu" og "Næste" er to kompakte paneler side om side (eller ét, når det andet mangler):
  - Etiketten står med 11 px versaler i `--ink-2`.
  - Fag og lokale står med 18 px i vægt 600 som "Fysik, B208".
  - Tid og lærer står i `--mono` 12 px.
  - "Nu" har en venstrekant på 3 px i `--accent` og en fremdriftslinje på 3 px.
  - Uden "Nu" og "Næste" vises én linje: "Ingen flere moduler i denne og næste uge" (Review Focus 3).
- Grid med to kolonner (1,05fr og 1fr, `gap: 12px`):
  - Venstre: panelet "I dag" (eller "<dag>"), en `lp-table` med tid (mono), fag med prik, lokale og lærer. Den igangværende række har fladen `--accent-soft`, ændret og aflyst får tags, og heldagsbegivenheder står som rækker uden tid øverst.
  - Højre: panelerne "Lektier til <dag>", "Afleveringer" (en `lp-table` med frist i mono, titel, fag og status-tag, hvor titlen må ombrydes) og "Beskeder".
  - "Fra skolen" fylder begge kolonner nederst.
- Klik på en række i "I dag" åbner lektionspanelet ligesom før.

- [ ] **Step 1:** RED: `npm run audit -- forside.aspx --own --rule rund,tag` giver brud.
- [ ] **Step 2:** Skriv `renderDashboard` om efter layoutet. Al logik til data (cache, ugeskift og fejlen fra plan 1 om at tegne ovenpå) bevares.
- [ ] **Step 3:** Kør `npm test` og audit'en (0 brud på forsiden), og tag skærmbilleder i 1280 og 1024 px i begge temaer. Commit og push.

---

### Task 4: Skema

**Files:** Modify `extension/content.js` (`renderWeek`), `extension/styles/views.css`, `extension/styles.css`.

- Heldagsrækken har samme højde i alle dage (`LP.alldayHeight`), så timegitteret flugter (Review Focus 2).
- Lektionsblokke: fladen er `--surface`, kanten `1px var(--rule)`, venstrestriben er 3 px i fagfarven, og radius er `var(--radius-sm)`. Faget står med 12,5 px i vægt 600, og tid og lokale i 11,5 px `--ink-2`. Afholdte lektioner har faget i `--ink-2` (ikke `opacity`), så kontrasten holder. Igangværende har en ring på 2 px i `--accent`. Ændret har et rav-tag, og aflyst er gennemstreget med et rødt tag.
- Heldagsbegivenheder er en række tags i `--sunk` uden stiplet kant.
- Etiketterne på tidsaksen krydses ikke af gitterstreger (`z-index` og baggrund).
- Panelet følger plan 2.

- [ ] **Step 1:** RED: `npm run audit -- SkemaNy.aspx --own --rule flugt,rund,kontrast` giver brud.
- [ ] **Step 2:** Implementer.
- [ ] **Step 3:** Kør audit'en (0), skærmbilleder i begge temaer og `npm test`. Commit og push.

---

### Task 5: Opgaver og Lektier

**Files:** Modify `extension/content.js` (`renderTasksView`, `renderHomeworkView`), `extension/styles/views.css`, `extension/styles.css`.

- Opgaver:
  - En `lp-table` med kolonnerne Frist (mono, "9. nov 09:00"), Opgave (titel og noten i `--ink-2` 12,5 px nedenunder), Fag (prik og navn), Elevtid (mono) og Status (tag: mangler er rød, under 24 t er rød, under 72 t er rav, afleveret er grøn, ellers neutral, og "venter på dig" er et neutralt tag).
  - Grupperne Mangler, Kommende og Afleveret (foldet sammen) er paneler.
  - Fagfilteret bevares.
- Lektier:
  - Grupper pr. dag som paneler, hvor hver lektie er en række med flueben, fag (prik), modul og indhold. Kun links i indholdet er links, og teksten er ikke et stort link.
  - Citatblokke får fladen `--sunk` uden radius over 3 px og samme skriftstørrelse.
  - Den tomme linje før første link fjernes.

- [ ] **Step 1:** RED: `npm run audit -- OpgaverElev.aspx material_lektieoversigt.aspx --own` giver brud.
- [ ] **Step 2:** Implementer.
- [ ] **Step 3:** Kør audit'en (0), skærmbilleder og `npm test`. Commit og push.

---

### Task 6: Fravær, Karakterer og Studieplan

**Files:** Modify `extension/content.js` (`renderAbsenceView`, `renderGradesView`, `renderStudyPlanView`), `extension/styles/views.css`, `extension/styles.css`.

- Fravær:
  - Nøgletallene er to små paneler side om side ligesom på Fraværsårsager (24 px fed og en etiket under).
  - Tabellen er en `lp-table` med Hold (prik og fag), Opgjort (procent, mono), Moduler i perioden, en bjælke (fuld ved det største tal, mindst 10 %, og med teksten "Bjælken er fuld ved X %" i noten) og Skriftligt.
  - 0 % viser ingen bjælke, og "ingen" og "0,0 %" bliver begge til "–".
- Karakterer:
  - Panelet "Snit på beviset" viser `gradeAverage(protocol)` som 24 px fed, med "vægtet, n karakterer" under. Er der ingen linjer, står der "Ingen karakterer på beviset endnu" (Review Focus 1).
  - Panelet "Karakterer i år" er en `lp-table` med Fag (navn og niveau), Form, 1. standpunkt, 2. standpunkt, Årskarakter og Eksamen.
  - Panelet "Beviset" er en `lp-table` med protokollinjerne (Termin, Fag, Form, Vægt, Karakter, og en dæmpet række, når Medtæller er Nej).
- Studieplan: én `lp-table` med Fag (prik), Hold, Nuværende forløb (link) og Uger. Hvert hold kan foldes ud (`details`) til alle forløb.

- [ ] **Step 1:** RED: audit'en på de tre sider med `--own` giver brud.
- [ ] **Step 2:** Implementer.
- [ ] **Step 3:** Kør audit'en (0) og skærmbilleder. Fanerne hopper ikke mellem Fravær og Fraværsårsager, mellem Karakterer og Karaktermeddelelse, eller mellem Studieplan og Undervisningsbeskrivelse. Kør `npm test`. Commit og push.

---

### Task 7: Beskeder

**Files:** Modify `extension/content.js` (`renderMessagesView`), `extension/styles/views.css`, `extension/styles.css`.

- Mappefiltre og filterfeltet er firkantede (`.lp-filter`-stil), og det valgte filter er `--accent-soft` med en `--accent`-kant.
- Primærknappen er fyldt accent. Knappen ved "Markér alle som læst" bruger `.lp-btn` (synlig tekst i begge temaer).
- Listen er tæt: rækker på ca. 40 px med afsender, emne og tid (mono), og ulæst er fed med en prik i accent.
- Læsepanelet er ét panel, beskedtitlen står med 18 px i vægt 600, og beskedteksten står uden indre boks.
- Kun liste og læsepanel ruller, ikke siden, når begge står ved siden af hinanden: højden er `calc(100vh - var(--shell-h) - 200px)`.

- [ ] **Step 1:** RED: `npm run audit -- beskeder2.aspx --own` giver brud.
- [ ] **Step 2:** Implementer.
- [ ] **Step 3:** Kør audit'en (0), skærmbilleder og `npm test`. Commit og push.

---

### Task 8: Opgaveside, lektionsside og lektionspanelet

**Files:** Modify `extension/content.js` (`enhanceAssignmentPage`, `enhanceActivityPage`, `renderDrawer`), `extension/styles/views.css`, `extension/styles.css`.

- Opgavesiden:
  - Opgavens titel er sidetitlen. Topkortet bliver et panel med en feltliste (`dl` i to kolonner).
  - Status er et tag.
  - "Vælg dokument og send" er fyldt accent.
  - Tabelhovederne er venstrestillede, og dokumentikonet har 6 px afstand.
- Lektionssiden:
  - Topkortet bliver et panel, og fag og hold står kun én gang.
  - "Lektier og materialer" er et panel med hoved.
  - Lektieteksten er almindelig tekst med links, ikke en fed blok.
- Lektionspanelet (skuffen fra højre): samme panelstil, mono-tider, tags for aflyst, ændret og i gang, og ingen radius over `var(--radius)`.

- [ ] **Step 1:** RED: audit'en på den første opgave og lektion med `--own` giver brud.
- [ ] **Step 2:** Implementer.
- [ ] **Step 3:** Kør audit'en (0). Tag skærmbilleder af lektionspanelet åbnet fra Forside og Skema med `npm run shot -- forside.aspx --click "#lp-c-day [data-li]" --name panel` og `SkemaNy.aspx --click ".lp-blk" --name panel` (Review Focus 5). Kør `npm test`. Commit og push.

---

### Task 9: Samlet kontrol og oprydning

- [ ] **Step 1:** Er `styles.css` tom, så slet den og fjern den fra manifestet. Er den ikke tom, så skriv i ledger, hvad der er tilbage, og hvorfor.
- [ ] **Step 2:** Kør `npm run audit`, `npm run audit -- --width 1024`, `npm run audit -- --own` og `npm run audit -- --own --width 1024`. Forventet: exitkode 0 alle fire gange.
- [ ] **Step 3:** Tag skærmbilleder af alle visninger i begge temaer, og lad en agent skrive `docs/superpowers/plans/notes-efter-plan-3.md` (tjek den for persondata). Kør `npm test`. Commit og push.
