# Lectio+ 2.0, plan 1: Fundament og skal

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Arbejdsrepo, testværktøjer og en dev-browser er på plads. De rene hjælpefunktioner og parserne er flyttet ud af `content.js` og har tests. Farver og skrift i retning D er sat op. Sidemenuen er erstattet af den nye blå topbjælke med faner på alle Lectio-sider.

**Architecture:** Extensionen har stadig ikke noget build-trin. Nye filer er almindelige scripts, som manifestet indlæser i rækkefølge i det samme content-script-miljø. De deler objektet `globalThis.LP`. `content.js` bliver ved med at eksistere i denne plan, men henter hjælpere, parsere, navigation og skal fra `LP`. Tests kører med `node --test`, hvor scriptene indlæses i et jsdom-vindue. Den visuelle kontrol sker i en Chromium med extensionen indlæst (Playwright), hvor Gustav selv logger ind.

**Tech Stack:** Manifest V3, almindelig JavaScript og CSS, Node 25 (`node --test`), jsdom, Playwright (kun til udvikling), IBM Plex via @fontsource (kun til at kopiere skriftfilerne).

**Spec:** `docs/superpowers/specs/2026-10-31-lectio-plus-2-design.md` (og `2026-10-31-lectio-plus-2-retning-d.html`)

**Planer i alt** (hver plan skrives, når den forrige er færdig):
1. Fundament og skal (denne plan)
2. Lectios egne sider i D: fælles stilregler for tabeller, formularer, knapper og islands, og gennemgang af alle sider i spec afsnit 6
3. Egne visninger i D: Forside, Skema, lektionspanel, Lektier, Opgaver, Beskeder, Fravær, Karakterer, Studieplan, opgaveside og lektionsside
4. Nye funktioner 7.1 til 7.5
5. Notifikationer (7.6), popup, "Nyt i 2.0", overførsel af indstillinger og udgivelse af 2.0.0

## Global Constraints

- Manifest V3. Den skal virke i Chrome, Edge og Brave. Der er intet build-trin, og manifestet indlæser filerne direkte.
- Al tekst i brugerfladen er på dansk, i et enkelt og direkte sprog.
- Data forlader aldrig computeren. Der hentes kun fra `https://www.lectio.dk`.
- Alle hentninger fra Lectio går gennem den eksisterende kø (`fetchDoc` i `content.js`). Det gælder også værktøjerne i `tools/`, som skal hente én side ad gangen.
- Der må ikke være noget blink af gammelt Lectio. `early.js` sætter klasserne før siden tegnes.
- Restyling må aldrig fjerne, flytte eller kopiere formularfelter. Lectios postbacks skal virke uændret.
- Builderen afleverer aldrig opgaver, sender aldrig beskeder, udfylder aldrig spørgeskemaer og ændrer aldrig valg eller indstillinger i Lectio.
- Hele siden må aldrig rulle vandret. Fanerne må gerne rulle vandret i smalle vinduer.
- Tilgængelighed: alt kan nås med tastaturet, fokus kan altid ses, og kontrasten er mindst 4,5:1 for tekst. `--ink-3` bruges kun til tekst, der ikke er vigtig, og skal være mindst 3:1.
- Personlige data må aldrig committes. `.dev-profile/`, `test/fixtures/private/` og `shots/` står i `.gitignore`.
- Commit-beskeder slutter med linjen `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Der pushes ikke til GitHub, før Gustav siger til.

## Review Focus

1. **Lange navne og mange ulæste i en smal bærbar (1024 px):** topbjælken må ikke bryde om eller skubbe siden bredere. Fanerne ruller vandret. Pinnes med et skærmbillede i 1024 px i Task 7.
2. **"Mine hold" med 0 eller 15+ hold:** gruppen er skjult, når der ikke er nogen hold. Når der er mange, ruller Mere-menuen inde i sig selv og går ikke ud over skærmen. Pinnes med jsdom-tests i Task 6 og et skærmbillede i Task 7.
3. **En side der ikke står i navigationen** (fx en ny Lectio-side): skallen vises stadig, ingen fane er markeret, og intet går i stykker. Pinnes med tests i Task 5 og Task 6.
4. **Uge 1 hvor mandagen ligger i december:** datoerne i skemaet får det rigtige år. Pinnes med en parser-test i Task 2.
5. **Lektier efter nytår:** "5/1" set fra december bliver januar næste år. Pinnes med en parser-test i Task 2.

---

## Filstruktur

Arbejdsrepoet er en klon af `https://github.com/gustavgamer123/lectio-plus` i `C:\Users\gusta\Downloads\lectio-plus-repo`. Hjemmesiden ligger i roden og røres ikke.

```
lectio-plus-repo/
  extension/
    manifest.json            ændres: css/js-rækkefølge
    early.js                 uændret i denne plan
    content.js               ændres: bruger LP.*, sidemenu fjernet
    styles.css               ændres: v1-farver, sidemenu og Schibsted fjernet
    src/lib/core.js          ny: datoer, tekst og URL-hjælpere
    src/lib/subjects.js      ny: fag, farver og lærerforkortelser
    src/lib/parse.js         ny: alle parsere, cleanText og safeHtml
    src/lib/icons.js         ny: ICONS (flyttet fra content.js)
    src/shell/nav.js         ny: faner, Mere-menu og hvilken side der er aktiv
    src/shell/shell.js       ny: topbjælke, faner og Mere-menu
    styles/tokens.css        ny: farver og skrift i retning D, lyst og mørkt
    styles/shell.css         ny: skal, sidehoved, underfaner, søgning og knapper
    fonts/plex-*.woff2       nye, og sg-*.woff2 fjernes
  test/
    helpers/load.js          indlæser extension-scripts i et jsdom-vindue
    core.test.js  subjects.test.js  parse.test.js  real-pages.test.js
    tokens.test.js  nav.test.js  shell.test.js
    fixtures/private/        gitignored: rigtige Lectio-sider
  tools/
    dev-browser.mjs          starter Chromium med extensionen og fast profil
    lib.mjs                  fælles: forbind via CDP, find skole-id, genindlæs extension
    capture.mjs              gemmer rå HTML fra Lectio som fixtures
    shot.mjs                 tager skærmbilleder i lyst og mørkt tema
  docs/superpowers/          flyttes hertil fra Downloads/lectio-plus/docs
  package.json  .gitignore
```

---

### Task 1: Arbejdsrepo, testopsætning og core.js

**Files:**
- Create: `package.json`, `.gitignore`, `test/helpers/load.js`, `test/core.test.js`, `extension/src/lib/core.js`
- Modify: `extension/content.js:37-76` (hjælperne erstattes af LP), `extension/manifest.json` (js-listen)
- Move: `C:\Users\gusta\Downloads\lectio-plus\docs\superpowers\` til `docs/superpowers/` i repoet

**Interfaces:**
- Produces: `globalThis.LP` med `esc(s)`, `pad(n)`, `hm(date)`, `DAYS`, `MONTHS`, `sameDay(a,b)`, `startOfDay(d)`, `num(s) -> number|null`, `isoWeek(d) -> {w,y}`, `weekParam(d) -> "WWYYYY"`, `mondayOf(d)`, `dayLabel(d, now)`, `relTime(d, now)`, `ORIGIN = 'https://www.lectio.dk'`, `abs(href, base) -> string|null`.
- Produces: `loadExt(files: string[], { html?, url? }) -> window` i `test/helpers/load.js`. Den indlæser stierne relativt til `extension/` og returnerer jsdom-vinduet, hvor `window.LP` findes.

- [ ] **Step 1: Klon repoet og sammenlign det med mappen i Downloads**

```bash
cd /c/Users/gusta/Downloads && git clone https://github.com/gustavgamer123/lectio-plus.git lectio-plus-repo
cd lectio-plus-repo && git switch -c v2
diff -rq --exclude=docs /c/Users/gusta/Downloads/lectio-plus extension
```
Forventet: ingen forskelle, bortset fra `README.txt`, hvis den kun findes ét sted. Er der andre forskelle, så stop og spørg Gustav, hvilken udgave der er den rigtige.

- [ ] **Step 2: Flyt docs ind i repoet og opret package.json og .gitignore**

Flyt `docs/superpowers` fra Downloads-mappen ind i repoet. `package.json`: `"private": true`, `"scripts": { "test": "node --test test/", "dev": "node tools/dev-browser.mjs", "capture": "node tools/capture.mjs", "shot": "node tools/shot.mjs" }`, og devDependencies `jsdom`, `playwright`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`. Kør `npm install`. `.gitignore`: `node_modules/`, `.dev-profile/`, `test/fixtures/private/`, `shots/`.

- [ ] **Step 3: Skriv test/helpers/load.js**

```js
// Indlæser extension-scripts som almindelige scripts i ét jsdom-vindue, ligesom Chromes content-script-miljø.
process.env.TZ = 'Europe/Copenhagen';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const EXT = path.join(__dirname, '..', '..', 'extension');
function loadExt(files, { html = '<!doctype html><html><head></head><body></body></html>', url = 'https://www.lectio.dk/lectio/123/forside.aspx' } = {}) {
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  for (const f of files) dom.window.eval(fs.readFileSync(path.join(EXT, f), 'utf8'));
  return dom.window;
}
module.exports = { loadExt, EXT };
```

- [ ] **Step 4: Skriv den fejlende test test/core.test.js**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadExt } = require('./helpers/load');
const { LP, Date: D } = loadExt(['src/lib/core.js']);

test('esc', () => assert.equal(LP.esc(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;'));
test('isoWeek og weekParam', () => {
  assert.deepEqual({ ...LP.isoWeek(new D(2026, 10, 2)) }, { w: 45, y: 2026 });
  assert.deepEqual({ ...LP.isoWeek(new D(2027, 0, 1)) }, { w: 53, y: 2026 });
  assert.equal(LP.weekParam(new D(2026, 10, 2)), '452026');
});
test('mondayOf', () => assert.equal(LP.mondayOf(new D(2026, 10, 4)).getDate(), 2));
test('dayLabel', () => {
  const now = new D(2026, 10, 2, 10, 0);
  assert.equal(LP.dayLabel(new D(2026, 10, 3), now), 'i morgen');
  assert.equal(LP.dayLabel(new D(2026, 10, 5), now), 'torsdag');
  assert.equal(LP.dayLabel(new D(2026, 10, 20), now), '20. nov');
});
test('relTime', () => {
  const now = new D(2026, 10, 2, 10, 47);
  assert.equal(LP.relTime(new D(2026, 10, 2, 12, 10), now), 'om 1 t 23 min');
  assert.equal(LP.relTime(new D(2026, 10, 6, 23, 59), now), 'om 5 dage');
});
test('num', () => { assert.equal(LP.num('7,5 %'), 7.5); assert.equal(LP.num('-'), null); });
test('abs', () => {
  const b = '/lectio/123/';
  assert.equal(LP.abs('SkemaNy.aspx', b), 'https://www.lectio.dk/lectio/123/SkemaNy.aspx');
  assert.equal(LP.abs('/lectio/123/x.aspx?a=1', b), 'https://www.lectio.dk/lectio/123/x.aspx?a=1');
  assert.equal(LP.abs('javascript:void(0)', b), null);
  assert.equal(LP.abs('#', b), null);
});
```

- [ ] **Step 5: Kør testen, så du ser den fejle**

Run: `npm test`
Expected: FAIL, fordi `extension/src/lib/core.js` ikke findes.

- [ ] **Step 6: Opret extension/src/lib/core.js**

Filen starter med `(() => { const LP = (globalThis.LP = globalThis.LP || {}); ... })();`. Flyt hjælperne fra `content.js:37-76` uændret ind i den. `abs(href, base)` bruger `new URL(href, LP.ORIGIN + base)` i stedet for `location.origin + BASE`. Lig dem på `LP`.

- [ ] **Step 7: Kør testen, så du ser den bestå**

Run: `npm test`
Expected: PASS (7 tests)

- [ ] **Step 8: Lad content.js bruge LP**

Slet definitionerne i `content.js:37-76` og indsæt i stedet `const { esc, pad, hm, DAYS, MONTHS, sameDay, startOfDay, num, isoWeek, weekParam, mondayOf, dayLabel, relTime } = LP;` og `const abs = (href) => LP.abs(href, BASE);`. I `manifest.json` bliver content-scriptets `js` til `["src/lib/core.js", "content.js"]`.

- [ ] **Step 9: Tjek syntaksen og commit**

Run: `node --check extension/content.js && npm test`
Expected: ingen fejl, og PASS.

```bash
git add -A && git commit -m "Lectio+ 2.0: repo, tests og core.js

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: subjects.js og parse.js

**Files:**
- Create: `extension/src/lib/subjects.js`, `extension/src/lib/parse.js`, `test/subjects.test.js`, `test/parse.test.js`
- Modify: `extension/content.js` (fag, safeHtml, parsere og parseFront erstattes af tynde wrappers), `extension/manifest.json`

**Interfaces:**
- Consumes: `LP.abs`, `LP.num` fra Task 1.
- Produces, på `LP`: `SUBJECTS`, `SWATCHES`, `subjectFrom(hold, title) -> {code,name}|null`, `hueFor(code, colors) -> number`, `shortTeacher(t)`, `cleanText(el)`, `safeHtml(src, baseUrl) -> string`, `parseTip(text)`, `parseSkema(doc, base)`, `parseAssignments(doc, base)`, `parseHomework(doc, base, now = new Date())`, `parseMessages(doc, base)`, `parseAbsence(doc)`, `parseGrades(doc)`, `parseFront(doc, base)`. Returtyperne er de samme som i 1.7.1.

- [ ] **Step 1: Skriv de fejlende tests**

`test/subjects.test.js` indlæser `['src/lib/core.js', 'src/lib/subjects.js']`:
- `subjectFrom('2b FY')` giver `{ code: 'FY', name: 'Fysik' }`. `subjectFrom('2b XY')` giver `{ code: 'XY', name: 'XY' }`. `subjectFrom('Studietur')` og `subjectFrom('')` giver `null`.
- `hueFor('FY', { FY: 135 })` giver `135`. `hueFor(null, {})` giver `230`. `hueFor('FY', {})` giver det samme tal to gange, og tallet er et af `[230, 262, 292, 330, 352, 18, 36, 152, 172, 196, 210, 120]`.
- `shortTeacher('Mette Lund (ML), Anders Nielsen (AN)')` giver `'ML,AN'`.

`test/parse.test.js` indlæser core, subjects og parse og bygger små HTML-stumper med `new window.DOMParser().parseFromString(html, 'text/html')`. Base er `'/lectio/123/'`.
- **parseTip** af teksten `"Ændret!\n10/11-2026 10:05 til 11:35\nHold: 2b FY\nLærer: Mette Lund (ML)\nLokale: 2.14\nLektier:\nLæs kap. 3.2\nNote:\nHusk lommeregner"` giver: `status 'changed'`, start 10/11 2026 kl. 10:05, slut kl. 11:35, `hold '2b FY'`, `teacher 'Mette Lund (ML)'`, `room '2.14'`, `homework 'Læs kap. 3.2'`, `note 'Husk lommeregner'` og `subject.code 'FY'`. `"Aflyst!\n9/11-2026 08:15 til 09:45\nHold: 2b MA"` giver `status 'cancelled'`. `"Studietur\n12/11-2026 Hele dagen"` giver `allDay true`, `title 'Studietur'` og start 12/11 2026 kl. 00:00.
- **parseSkema:** `.s2weekHeader` indeholder "Uge 45 - 2026". `table.s2skema` har række 0 (tom), række 1 `tr.s2dayHeader` med `<td></td><td>Mandag (2/11)</td><td>Tirsdag (3/11)</td>`, række 2 (heldagsrækken) med en `a.s2skemabrik` i mandag-cellen, og række 3 med to brikker. Den ene af de to har klassen `s2changed` og `href="/lectio/123/aktivitet/aktivitetforside2.aspx?absid=1"`, den anden har `s2cancelled`. Der er også `.s2module-info` med "1. modul 08:15 - 09:45". Forventet: `week 45`, `year 2026`, `days[0].name 'Mandag'` med dato 2/11 2026, `modules[0]` lig `{n:1,start:'08:15',end:'09:45'}`, heldagsbrikken har `allDay true`, den ændrede har `changed true` og `href 'https://www.lectio.dk/lectio/123/aktivitet/aktivitetforside2.aspx?absid=1'`, og den aflyste har `cancelled true`.
- **parseSkema i uge 1 (Review Focus 4):** "Uge 1 - 2027" med dagen "Mandag (28/12)" giver datoen 28/12 2026.
- **parseAssignments:** `#s_m_Content_Content_ExerciseGV` med en overskriftsrække og en række med 10 celler: `['45', '2b FY', '<a href="ElevAflevering.aspx?exerciseid=9">Rapport: frit fald</a>', '6/11-2026 23:59', '5,00', 'Venter', '0 %', 'Elev', '', '']`. Forventet: `title 'Rapport: frit fald'`, `due` 6/11 2026 kl. 23:59, `hours '5,00'`, `status 'Venter'`, `subject.code 'FY'` og `href 'https://www.lectio.dk/lectio/123/ElevAflevering.aspx?exerciseid=9'`.
- **parseHomework** med `now` lig 2/11 2026: rækken `['3/11', 'Engelsk 2. modul - 2b EN • lokale 1.07', 'Read<br>"The Lottery"']` giver dato 3/11 2026, `text 'Read\n"The Lottery"'` og `subject.code 'EN'`.
- **parseHomework efter nytår (Review Focus 5):** med `now` lig 20/12 2026 giver rækken `'5/1'` datoen 5/1 2027.
- **parseMessages:** `table[id*="threadGV"]` med to rækker á 8 celler. Den ene har `img[id$="readId"][src="/lectio/img/mread.gif"]`, og den anden har en anden src. Celle 3 indeholder `onclick="...'_12345678'"`. Forventet: `unread` er henholdsvis `false` og `true`, og `href` er `'/lectio/123/beskeder2.aspx?type=visbesked&id=12345678'`.
- **parseAbsence:** `table[id$="SFTabStudentAbsenceDataTable"]` med rækkerne `['2b FY','3/40','7,50 %','2,00/20,00','10,00 %']`, `['2b DA','1/40','2,50 %','0/10','0 %']` og `['Samlet','4/80','5,00 %','2,00/30,00','6,67 %']`. Forventet: `rows[0].hold '2b FY'` (sorteret efter højeste procent), `rows[0].mods [3,40]`, `total.pct 5` og `total.wPct 6.67`.
- **parseGrades:** en tabel hvor første række indeholder "Fag" og "Årskarakter", plus endnu en overskriftsrække og rækken `['Fysik B','1,00','7','C','1,00','10','B']`. Forventet: `{ subject:'Fysik B', weight:1, grade:'7', ects:'C', examWeight:1, exam:'10', examEcts:'B' }`.
- **parseFront:** en `section.lf-island` med `.dashboardTextHeader` "Hold og grupper" og to links giver to `hold`. En anden island med "Studievejledning" og `table.dashboard tr` med `td.infoCol` (som indeholder `<script>` og en tekst) og `td.timeCol.attention` giver `notices[0].rows[0].attention true`. Dens `html` indeholder ikke "script".
- **safeHtml:** `<button>` og `<input>` fjernes. Et link med `href="javascript:x()"` får ingen href. Et link til `https://example.com` får `target="_blank"`, og `<img src="/x.png">` bliver til `https://www.lectio.dk/x.png`.

- [ ] **Step 2: Kør testene, så du ser dem fejle**

Run: `npm test`
Expected: FAIL, fordi `subjects.js` og `parse.js` ikke findes.

- [ ] **Step 3: Opret extension/src/lib/subjects.js**

Flyt `SUBJECTS`, `subjectFrom`, `SWATCHES`, `hueFor` og `shortTeacher` fra `content.js:77-106` uændret ind i filen, med samme mønster som core.js. `hueFor(str, colors)` læser egne farver fra `colors` i stedet for `settings.colors`.

- [ ] **Step 4: Opret extension/src/lib/parse.js**

Flyt `cleanText`, `KEEP`, `DROP`, `safeHtml`, `parseTip`, `parseSkema`, `parseAssignments`, `parseHomework`, `parseMessages`, `parseAbsence`, `parseGrades` og `parseFront` ind i filen, uden at ændre logikken. Der er tre tilpasninger:
- Funktionerne får `base` med som argument i stedet for at bruge `BASE` og `location`.
- `safeHtml` laver elementer med `src.ownerDocument` og sammenligner med værten `'www.lectio.dk'`.
- `parseFront` kalder `safeHtml(info, LP.ORIGIN + base)`, og `parseHomework` tager `now`.

- [ ] **Step 5: Lad content.js bruge LP**

Slet de flyttede funktioner fra `content.js` og indsæt wrappers med de gamle navne:
- `const parseSkema = (d) => LP.parseSkema(d, BASE);` og tilsvarende for de andre parsere.
- `const { SUBJECTS, SWATCHES, subjectFrom, shortTeacher, cleanText, safeHtml, parseTip, parseAbsence, parseGrades } = LP;`
- `const hueFor = (s) => LP.hueFor(s, settings.colors);`

I `manifest.json` bliver `js` til `["src/lib/core.js", "src/lib/subjects.js", "src/lib/parse.js", "content.js"]`.

- [ ] **Step 6: Kør testene, så du ser dem bestå**

Run: `node --check extension/content.js && npm test`
Expected: PASS (alle tests i core, subjects og parse)

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Lectio+ 2.0: fag og parsere flyttet til src/lib med tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Dev-browser, fixtures og skærmbilleder

**Files:**
- Create: `tools/dev-browser.mjs`, `tools/lib.mjs`, `tools/capture.mjs`, `tools/shot.mjs`, `test/real-pages.test.js`

**Interfaces:**
- Consumes: `LP.parse*` fra Task 2.
- Produces: `npm run dev` starter Chromium med `--load-extension=extension`, profilen `.dev-profile/` og `--remote-debugging-port=9333`. Den åbner `https://www.lectio.dk/lectio/login_list.aspx` og bliver ved med at køre.
- Produces: `tools/lib.mjs` eksporterer:
  - `connect() -> { browser, context }`, via `chromium.connectOverCDP('http://localhost:9333')`.
  - `schoolBase(context) -> '/lectio/<id>/'`, læst fra en åben lectio.dk-fane. Er der ingen, fejler den med "Log ind på Lectio i dev-browseren først".
  - `reloadExtension(context)`, som åbner `chrome://extensions`, finder id'et for "Lectio+" med `chrome.developerPrivate.getExtensionsInfo()` og kalder `chrome.developerPrivate.reload(id)`. Hvis det fejler, skriver den "Genindlæs Lectio+ i chrome://extensions", og så beder builderen Gustav om at gøre det. Browseren må ikke genstartes, for så bliver Gustav logget ud.
- Produces: `npm run capture -- [sti ...]` gemmer rå HTML med `page.evaluate((u) => fetch(u, { credentials: 'include' }).then((r) => r.text()), url)` i en lectio.dk-fane, så cookies kommer med. Den henter én side ad gangen og gemmer i `test/fixtures/private/<slug>.html`. Slug laves ved at erstatte alt der ikke er bogstaver, tal eller punktum med `_`. Uden argumenter gemmes standardlisten: `forside.aspx`, `SkemaNy.aspx`, `material_lektieoversigt.aspx`, `OpgaverElev.aspx`, `beskeder2.aspx`, `subnav/fravaerelev.aspx`, `grades/grade_report.aspx` og `studieplan.aspx?displaytype=ugeteksttabel`.
- Produces: `npm run shot -- <sti ...> [--theme light|dark|both] [--width 1280] [--click <css>] [--press <taster>] [--type <tekst>] [--name <tillæg>]` genindlæser først extensionen og åbner så siden. Den sætter `emulateMedia({ colorScheme })` og venter på `networkidle`. Derefter udfører den `--click`, `--press` og `--type` i den rækkefølge, hvis de er givet, og gemmer `shots/<slug>[-<tillæg>]-<tema>-<bredde>.png`. Standard er `both` og `1280`.

- [ ] **Step 1: Skriv tools/dev-browser.mjs og tools/lib.mjs ud fra interfacet ovenfor**

`dev-browser.mjs` bruger `chromium.launchPersistentContext('.dev-profile', { headless: false, channel: 'chromium', viewport: { width: 1280, height: 800 }, args: [...] })`. Kør `npx playwright install chromium` én gang.

- [ ] **Step 2: Start dev-browseren, og få Gustav til at logge ind**

Run (i baggrunden): `npm run dev`
Bed Gustav om at logge ind på Lectio i det vindue, der åbner, og om at sige til, når han er inde. Vent på hans svar.

- [ ] **Step 3: Skriv tools/capture.mjs, og gem standardlisten**

Run: `npm run capture`
Expected: 8 filer i `test/fixtures/private/`. Hver fil er større end 5 KB og indeholder `logout.aspx`, hvilket viser at man var logget ind.

- [ ] **Step 4: Skriv test/real-pages.test.js**

Hver test springes over med `{ skip: 'mangler fixture' }`, hvis filen ikke findes:
- `parseSkema` giver ikke `null`, har mindst 5 dage, og for hver lektion med tid gælder at `start < end`.
- `parseAssignments` giver en liste, hvor hver række har en `title`, som ikke er tom.
- `parseHomework` og `parseMessages` giver lister. `parseAbsence` giver ikke `null`, og `rows.length` er større end 0.
- `parseGrades` giver en liste. `parseFront` giver `notices` og `hold` som lister.

- [ ] **Step 5: Kør testene**

Run: `npm test`
Expected: PASS, og ingen af testene i real-pages er sprunget over.

- [ ] **Step 6: Skriv tools/shot.mjs, og tag et skærmbillede af forsiden**

Run: `npm run shot -- forside.aspx`
Expected: `shots/forside.aspx-light-1280.png` og `-dark-1280.png` findes. Se dem med Read. De viser stadig 1.7-designet, fordi intet er ændret endnu.

- [ ] **Step 7: Commit**

```bash
git add tools test/real-pages.test.js package.json package-lock.json && git commit -m "Lectio+ 2.0: dev-browser, fixtures og skærmbilleder

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Farver og skrift i retning D

**Files:**
- Create: `extension/styles/tokens.css`, `extension/fonts/plex-sans-{400,500,600,700}.woff2`, `extension/fonts/plex-mono-{400,500}.woff2`, `extension/fonts/OFL-IBM-Plex.txt`, `test/tokens.test.js`
- Modify: `extension/styles.css:1-41` (v1-farverne og Schibsted-skriften slettes), `extension/manifest.json` (`css` bliver `["styles/tokens.css", "styles.css"]`)
- Delete: `extension/fonts/sg-*.woff2`, `extension/fonts/OFL.txt`

**Interfaces:**
- Produces: CSS-variabler på `html.lp-on, html.lp-lite, #lp-pill` (lyst tema) og på `html[data-lp-theme="dark"].lp-on, html[data-lp-theme="dark"].lp-lite, html[data-lp-theme="dark"] #lp-pill` (mørkt tema). Navnene fra v1 bevares, så de eksisterende visninger virker: `--bg --surface --sunk --ink --ink-2 --ink-3 --rule --accent --accent-soft --warn --danger --ok --tint-l --tint-s --dot-l --font`. Der kommer nye til: `--accent-ink --warn-soft --danger-soft --ok-soft --bar --bar-ink --bar-ink-2 --mono --radius --radius-sm --shell-h`. `--side` bliver kun stående indtil Task 7.

**Værdier:**

| Token | Lyst | Mørkt |
|---|---|---|
| `--bg` | `#f3f5f8` | `#0f1318` |
| `--surface` | `#ffffff` | `#161b22` |
| `--sunk` | `#f7f8fa` | `#1b212a` |
| `--ink` | `#1d2733` | `#e3e8ee` |
| `--ink-2` | `#66717f` | `#9aa5b1` |
| `--ink-3` | `#848d98` | `#6b7682` |
| `--rule` | `#e1e6ec` | `#29313b` |
| `--accent` | `#1b5ea8` | `#7fb2ec` |
| `--accent-ink` | `#ffffff` | `#0f1318` |
| `--accent-soft` | `#eef4fb` | `#18283a` |
| `--bar` | `#1b5ea8` | `#14243a` |
| `--bar-ink` | `#ffffff` | `#e3e8ee` |
| `--bar-ink-2` | `#c6dcf7` | `#7fb2ec` |
| `--warn` / `--warn-soft` | `#a35a00` / `#fdf1e1` | `#e0a14a` / `#2e2414` |
| `--danger` / `--danger-soft` | `#c42b1c` / `#fbe9e7` | `#f08273` / `#331b18` |
| `--ok` / `--ok-soft` | `#2e7350` / `#e6f2ea` | `#6fc495` / `#16291f` |
| `--tint-l` `--tint-s` `--dot-l` | `95%` `45%` `46%` | `17%` `22%` `62%` |

Fælles for begge temaer: `--font: "LP Plex", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`, `--mono: "LP Plex Mono", ui-monospace, Consolas, monospace`, `--radius: 4px`, `--radius-sm: 3px` og `--shell-h: 88px`. Desuden `--side: 224px` midlertidigt, så sidemenuen fra 1.x ser rigtig ud indtil Task 7, hvor den fjernes. `@font-face` bruger `url("chrome-extension://__MSG_@@extension_id__/fonts/plex-sans-400.woff2")` osv. og `font-display: swap`.

- [ ] **Step 1: Skriv den fejlende test test/tokens.test.js**

Testen læser `extension/styles/tokens.css` som tekst og trækker blokken for lyst og mørkt tema ud med en regex. Den har en lille funktion `contrast(hexA, hexB)` efter WCAG 2.1 (relativ luminans). Den tester:
- Kontrasten er mindst 4,5 for disse par i begge temaer: `ink/surface`, `ink/bg`, `ink-2/surface`, `ink-2/bg`, `accent/surface`, `accent/accent-soft`, `accent-ink/accent`, `bar-ink/bar`, `bar-ink-2/bar`, `danger/surface`, `danger/danger-soft`, `warn/surface`, `warn/warn-soft`, `ok/surface` og `ok/ok-soft`.
- Kontrasten er mindst 3,0 for `ink-3/surface` og `ink-3/bg`.
- Alle filer i `url(".../fonts/X")` i tokens.css findes i `extension/fonts/`.
- Ingen fil i `extension/` nævner `LP Schibsted` eller `--side`.

- [ ] **Step 2: Kør testen, så du ser den fejle**

Run: `npm test`
Expected: FAIL, fordi `tokens.css` ikke findes.

- [ ] **Step 3: Kopiér skriftfilerne og licensen**

Kopiér `node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-{400,500,600,700}-normal.woff2` til `extension/fonts/plex-sans-*.woff2` og `ibm-plex-mono-latin-{400,500}-normal.woff2` til `extension/fonts/plex-mono-*.woff2`. Licensen fra pakken kopieres til `OFL-IBM-Plex.txt`. Latin-udvalget dækker æ, ø og å. Slet `sg-*.woff2` og `OFL.txt`.

- [ ] **Step 4: Opret styles/tokens.css med værdierne fra tabellen, og slet styles.css:1-41**

`--side` og sidemenuen fjernes først i Task 7, så testen for `--side` kan først bestå efter Task 7. Markér den med `{ todo: 'fjernes i Task 7' }` indtil da.

- [ ] **Step 5: Kør testen, så du ser den bestå**

Run: `npm test`
Expected: PASS (testen for `--side` vises som todo)

- [ ] **Step 6: Tjek forsiden og ugeskemaet visuelt**

Run: `npm run shot -- forside.aspx SkemaNy.aspx`
Expected: Plex-skriften og den blå accent ses i både lyst og mørkt tema. Alt er læsbart, og sidemenuen er der stadig.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Lectio+ 2.0: farver og IBM Plex i retning D

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Navigationsmodel

**Files:**
- Create: `extension/src/shell/nav.js`, `test/nav.test.js`
- Modify: `extension/content.js:456-546` (NAV_*, PAL_ONLY, MORE_ITEMS og activeKey flyttes)

**Interfaces:**
- Produces, på `LP`:
  - `NAV_TABS`: de 7 faner i rækkefølgen Forside, Skema, Lektier, Opgaver, Beskeder, Fravær og Karakterer. Nøgler, stier, ikoner og `words` er de samme som i v1's `NAV_MAIN`, men label for `forside` er `'Forside'`.
  - `NAV_MORE`: grupperne `{ group, items }` i rækkefølgen `'Studie og dokumenter'` (med `studieplan` og `dokumenter` fra v1's `NAV_SECOND`), `'Skema og kalender'`, `'Studie'`, `'Dig'` og `'Lectio'`. Punkterne er de samme som i v1.
  - `MORE_ITEMS` og `PAL_ONLY` er som i v1.
  - `activeKey(page, search) -> string|null` har samme regler som v1's `activeKey`, men tager `page` (stien efter `/lectio/<id>/`, med små bogstaver) og `search` som argumenter.
  - `tabFor(key) -> string|null`: giver nøglen selv for fanerne, `'fravaer'` for `fravaersaarsager`, `'karakterer'` for `karakterblad`, `'more'` for andre nøgler i `MORE_ITEMS` og `null` for `null`.

- [ ] **Step 1: Skriv den fejlende test test/nav.test.js**

```js
const { LP } = loadExt(['src/lib/core.js', 'src/shell/nav.js']);
test('faner', () => assert.deepEqual([...LP.NAV_TABS].map((n) => n.label), ['Forside', 'Skema', 'Lektier', 'Opgaver', 'Beskeder', 'Fravær', 'Karakterer']));
test('Mere starter med studieplan og dokumenter', () => assert.deepEqual([...LP.NAV_MORE[0].items].map((n) => n.key), ['studieplan', 'dokumenter']));
test('activeKey', () => {
  assert.equal(LP.activeKey('forside.aspx', ''), 'forside');
  assert.equal(LP.activeKey('aktivitet/aktivitetforside2.aspx', '?absid=1'), 'skema');
  assert.equal(LP.activeKey('elevaflevering.aspx', '?exerciseid=9'), 'opgaver');
  assert.equal(LP.activeKey('subnav/fravaerelev_fravaersaarsager.aspx', ''), 'fravaersaarsager');
  assert.equal(LP.activeKey('dokumentoversigt.aspx', ''), 'dokumenter');
  assert.equal(LP.activeKey('ukendt/side.aspx', ''), null);
});
test('tabFor', () => {
  assert.equal(LP.tabFor('skema'), 'skema');
  assert.equal(LP.tabFor('fravaersaarsager'), 'fravaer');
  assert.equal(LP.tabFor('karakterblad'), 'karakterer');
  assert.equal(LP.tabFor('dokumenter'), 'more');
  assert.equal(LP.tabFor(null), null);
});
```

- [ ] **Step 2: Kør testen, så du ser den fejle**

Run: `npm test`
Expected: FAIL, fordi `nav.js` ikke findes.

- [ ] **Step 3: Opret extension/src/shell/nav.js, og flyt listerne og activeKey fra content.js**

`activeKey` bruger argumenterne i stedet for `PAGE` og `location.search`. I `content.js` indsættes `const { NAV_MORE, MORE_ITEMS, PAL_ONLY } = LP;`, `const NAV_MAIN = LP.NAV_TABS;`, `const NAV_SECOND = [];` og `const activeKey = () => LP.activeKey(PAGE, location.search);`. `nav.js` tilføjes i manifestet efter `parse.js`.

- [ ] **Step 4: Kør testen, så du ser den bestå**

Run: `node --check extension/content.js && npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Lectio+ 2.0: navigationsmodel med faner og Mere

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Skal-komponenten

**Files:**
- Create: `extension/src/lib/icons.js`, `extension/src/shell/shell.js`, `test/shell.test.js`
- Modify: `extension/content.js:424-454` (ICONS flyttes til icons.js, og content.js bruger `const { ICONS } = LP;`)

**Interfaces:**
- Consumes: `LP.esc`, `LP.NAV_TABS`, `LP.NAV_MORE`, `LP.tabFor`, `LP.subjectFrom`, `LP.ICONS`.
- Produces: `LP.buildShell(opts) -> { el, setBadge(key, n), setHold(list) }`.
  - `opts`: `{ doc, base, activeKey, user: { name, cls }, schoolName, logoutHref, onSearch, onTheme, onOriginal }`.
  - Funktionen indsætter `<header id="lp-shell">` som første barn af `doc.body`.
  - `setBadge(key, n)`: `n <= 0` skjuler mærket, `n > 99` viser `'99+'`.
  - `setHold(list: {name, href}[])` viser gruppen "Mine hold" øverst i Mere-menuen. Gruppen er skjult, når listen er tom.

**Opmærkning (låst, så CSS og tests passer sammen):**
- `#lp-shell > .lp-bar` indeholder i rækkefølge:
  - `a.lp-mark` ("Lectio" og `<span>+</span>`, link til `base + 'forside.aspx'`)
  - `span.lp-school`
  - `button.lp-find` (søgeikon, "Søg" og `<kbd>Ctrl K</kbd>`)
  - `span.lp-who` (`<strong>` navn og `<small>` klasse)
  - `button[data-act=theme][aria-label="Skift tema"]`, `button[data-act=original][aria-label="Vis Lectios egen visning"]` og `a[data-act=logout][aria-label="Log ud"]`
- `#lp-shell > nav.lp-tabs-main[aria-label="Lectio"]` indeholder:
  - én `a.lp-tab[data-key]` pr. fane, med `<b class="lp-badge" data-badge="<key>" hidden>`
  - `div.lp-more-wrap` med `button.lp-tab.lp-more-btn[aria-expanded][aria-haspopup="true"]` og `div.lp-more-pop[hidden]`
  - `div.lp-more-pop` indeholder `section.lp-more-hold[hidden]` og én `section` pr. gruppe i `NAV_MORE`, hver med `h3` og links `a.lp-more-item`.
- Den aktive fane får `is-active` og `aria-current="page"`. Hvis `tabFor(activeKey)` er `'more'`, får `.lp-more-btn` `is-active`, og teksten bliver punktets label, fx "Dokumenter". Det aktive punkt i menuen får `aria-current="page"`.

- [ ] **Step 1: Skriv den fejlende test test/shell.test.js**

Testen indlæser core, subjects, icons, nav og shell, og kalder `buildShell` med `base '/lectio/123/'`, `user { name: 'Freja Holm', cls: '2b' }` og tomme callbacks:
- Med `activeKey 'skema'`: der er 7 `.lp-tab[data-key]`. Linket til Skema har `href '/lectio/123/SkemaNy.aspx'`, `aria-current 'page'` og klassen `is-active`, og ingen anden fane har `aria-current`.
- Med `activeKey 'dokumenter'`: `.lp-more-btn` har `is-active`, og teksten indeholder "Dokumenter".
- Med `activeKey 'fravaersaarsager'`: fanen Fravær er aktiv.
- **Ukendt side (Review Focus 3):** med `activeKey null` er der intet med `aria-current`, og skallen findes stadig.
- `setBadge('beskeder', 3)` viser "3". `setBadge('beskeder', 120)` viser "99+". `setBadge('beskeder', 0)` skjuler mærket.
- **Mine hold (Review Focus 2):** `setHold([])` holder `.lp-more-hold` skjult. `setHold` med 15 hold viser gruppen med 15 links.
- Et klik på `.lp-more-btn` sætter `aria-expanded 'true'` og viser menuen. `Escape` lukker den og flytter fokus tilbage til knappen. Et klik uden for menuen lukker den også.
- Et klik på `.lp-find` kalder `onSearch` én gang, `[data-act=theme]` kalder `onTheme`, og `[data-act=original]` kalder `onOriginal`.

- [ ] **Step 2: Kør testen, så du ser den fejle**

Run: `npm test`
Expected: FAIL, fordi `buildShell` ikke findes.

- [ ] **Step 3: Flyt ICONS til extension/src/lib/icons.js, og opret extension/src/shell/shell.js efter opmærkningen ovenfor**

- [ ] **Step 4: Kør testen, så du ser den bestå**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Lectio+ 2.0: skal med topbjælke, faner og Mere-menu

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Skallen erstatter sidemenuen

**Files:**
- Create: `extension/styles/shell.css`
- Modify: `extension/content.js` (sidemenu-koden fjernes, og skallen kobles på), `extension/styles.css` (sidemenu, topbar, scrim og `--side` fjernes), `extension/manifest.json`

**Interfaces:**
- Consumes: `LP.buildShell` fra Task 6.
- Manifestet ender med `css: ["styles/tokens.css", "styles.css", "styles/shell.css"]` og `js: ["src/lib/core.js", "src/lib/subjects.js", "src/lib/parse.js", "src/lib/icons.js", "src/shell/nav.js", "src/shell/shell.js", "content.js"]`.

- [ ] **Step 1: Kobl skallen på i content.js**

Slet `sideOpen`, `rememberOpen`, `buildSidebar` og `renderHoldGroup`, og fjern `#lp-topbar`, `#lp-scrim` og `lp-menu-open` alle steder. Gør så følgende:
- I `init` kaldes `shell = LP.buildShell({ doc: document, base: BASE, activeKey: activeKey(), user: USER, schoolName, logoutHref: logoutLink.getAttribute('href'), onSearch: openPalette, onTheme, onOriginal })`.
- `onTheme` og `onOriginal` er de to handlere fra den gamle `buildSidebar`. De flyttes uændret.
- `setBadge` bliver til `(k, n) => shell && shell.setBadge(k, n)`.
- `cachePut('front', ...)` kalder `shell.setHold(data.hold)`. Ved start kaldes `shell.setHold(cache.front?.d?.hold || [])`.
- I `OWN_UI` erstattes `#lp-side, ... #lp-topbar, ... #lp-scrim` af `#lp-shell`.

- [ ] **Step 2: Skriv styles/shell.css, og ryd op i styles.css**

- `#lp-shell` er `position: fixed; inset: 0 0 auto 0; z-index: 9000` og har højden `var(--shell-h)`.
- `.lp-bar` er 46 px høj, har baggrunden `var(--bar)` og teksten `var(--bar-ink)`. "+" i `.lp-mark` er `var(--bar-ink-2)`.
- `.lp-find` er et felt med `rgba(255,255,255,.14)` som baggrund og `kbd` i `var(--mono)`.
- `nav.lp-tabs-main` er 42 px høj, har baggrunden `var(--surface)`, en bundkant på `1px var(--rule)` og `overflow-x: auto` (Review Focus 1). `.lp-tab` er 14 px, vægt 500 og `var(--ink-2)`. `.is-active` har `var(--ink)`, vægt 600 og en streg på `3px var(--accent)` i bunden.
- `.lp-badge` har baggrunden `var(--accent)`, teksten `var(--accent-ink)` og hjørner på `var(--radius-sm)`.
- `.lp-more-pop` er `position: fixed`, ligger under fanerne, har `max-height: calc(100vh - var(--shell-h) - 24px)` og `overflow-y: auto` (Review Focus 2). Den har en kant på `1px var(--rule)`, hjørner på `var(--radius)` og en skygge `0 12px 32px rgba(0,0,0,.18)`. Grupperne ligger i kolonner med `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`.
- `html.lp-on body { padding-top: var(--shell-h) !important; padding-left: 0 !important; }` og `html.lp-on { scroll-padding-top: var(--shell-h); }`.
- Startdækket bliver til `html.lp-boot body::before { content:""; position:fixed; inset:0 0 auto 0; height: var(--shell-h); background: var(--bar); z-index: 8990; }`.
- Under `@media print` skjules `#lp-shell`.
- Fokus har `outline: 2px solid` med `var(--bar-ink)` i bjælken og `var(--accent)` i fanerne.

I `styles.css` slettes alle regler for `#lp-side`, `.lp-brand*`, `.lp-search-btn`, `.lp-nav*`, `.lp-side-foot`, `.lp-me`, `.lp-foot-actions`, sidemenuens `.lp-more*`, `#lp-topbar`, `#lp-scrim` og `--side`, også i `@media (max-width: 860px)`. Slet `--side: 224px` i `tokens.css`, og fjern `todo` fra testen for `--side` i `tokens.test.js`.

- [ ] **Step 3: Kør testene**

Run: `node --check extension/content.js && npm test`
Expected: PASS, og der er ingen todo tilbage.

- [ ] **Step 4: Tjek visuelt i 1280 og 1024 px (Review Focus 1 og 2)**

Run: `npm run shot -- forside.aspx SkemaNy.aspx OpgaverElev.aspx DokumentOversigt.aspx kalender.aspx && npm run shot -- forside.aspx DokumentOversigt.aspx --width 1024`
Expected, set med Read for hvert billede:
- Den blå bjælke og fanerne ligger øverst, og der er ingen sidemenu.
- Den rigtige fane er markeret. På Dokumenter står der "Dokumenter" på Mere-knappen.
- Indholdet ligger ikke gemt under skallen.
- I 1024 px brydes bjælken ikke om, og siden ruller ikke vandret.
- Begge temaer er læsbare.

Run: `npm run shot -- forside.aspx --click .lp-more-btn --name mere`
Expected: Mere-menuen er åben med grupperne i kolonner. Den går ikke ud over skærmen, og "Mine hold" står øverst, hvis Lectio viser hold på forsiden.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Lectio+ 2.0: topbjælke og faner erstatter sidemenuen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Sidehoved, underfaner, søgning og knapper i D

**Files:**
- Modify: `extension/styles/shell.css` (nye regler), `extension/styles.css` (de gamle regler for de samme klasser slettes)

**Interfaces:**
- Consumes: de eksisterende klasser fra `content.js` uden ændringer i opmærkningen: `.lp-vhead`, `.lp-vhead-actions`, `.lp-tabs` (underfaner fra `subTabs()`), `.lp-viewsub`, `.lp-btn`, `.lp-btn-ghost`, `.lp-btn-primary`, `#lp-palette` med `.lp-pal-*` og `#lp-pill`.

- [ ] **Step 1: Skriv reglerne i shell.css**

- `.lp-vhead h1` er 24 px, vægt 600 og `letter-spacing: -.015em`.
- `.lp-tabs` er niveau to: en fanerække på 36 px, 13,5 px skrift, en bundkant på `1px var(--rule)` og `.is-on` med en streg på `2px var(--accent)` i bunden. Den må ikke bruge pills.
- `.lp-btn` er 32 px høj, har hjørner på `var(--radius)`, en kant på `1px var(--rule)` og 13,5 px skrift. `.lp-btn-primary` bruger `var(--accent)` og `var(--accent-ink)`.
- Søgningen: `.lp-pal-box` har hjørner på `var(--radius)`. `.lp-pal-item.is-sel` har baggrunden `var(--accent-soft)` og en streg på `2px var(--accent)` i venstre side. `kbd` bruger `var(--mono)`.
- `#lp-pill` har hjørner på `var(--radius)`.

Slet de gamle regler for de samme klasser i `styles.css`, så der ikke er to regelsæt, der kæmper mod hinanden.

- [ ] **Step 2: Tjek visuelt på sider med sidehoved og underfaner**

Run: `npm run shot -- subnav/fravaerelev.aspx grades/grade_report.aspx OpgaverElev.aspx beskeder2.aspx && npm run shot -- forside.aspx --press Control+K --type fys --name soeg`
Expected i begge temaer:
- Underfanerne ligger som en tynd fanerække under titlen.
- Knapperne er firkantede med en lille radius.
- Søgningen viser resultater med den markerede række fremhævet.
- Der er ingen afrundede pills tilbage i disse dele.

- [ ] **Step 3: Kør testene og commit**

Run: `npm test`
Expected: PASS

```bash
git add -A && git commit -m "Lectio+ 2.0: sidehoved, underfaner, søgning og knapper i D

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Saml observationer til plan 2 og 3**

Tag skærmbilleder af alle sider i `LP.NAV_TABS` og `LP.MORE_ITEMS` i begge temaer, med `npm run shot` på stierne. Skriv en kort liste i `docs/superpowers/plans/notes-efter-plan-1.md` over hvad der stadig ligner gammelt Lectio på hver side. Listen bruges, når plan 2 og 3 skrives. Commit filen.
