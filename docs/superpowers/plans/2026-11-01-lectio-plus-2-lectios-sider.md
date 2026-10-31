# Lectio+ 2.0, plan 2: Lectios egne sider i D

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alle Lectio-sider, som ikke har en egen visning, ser ud som retning D i både lyst og mørkt tema. Det sker med ét fælles regelsæt for Lectios komponenter (islands, knapper, links, formularer, tabeller og overskrifter) plus de få sidespecifikke rettelser. De udskudte småfejl i skallen fra plan 1 rettes også.

**Architecture:** Lectio har ingen CSS-variabler; farverne står direkte i `lectio-css.bundle.css`. Derfor samles alle regler for Lectios egne komponenter i én ny fil, `extension/styles/lectio.css`. Den indlæses efter `styles.css`, og de gamle regler for de samme komponenter fjernes fra `styles.css`. Kvaliteten måles med et audit-værktøj, der kører i dev-browseren (Playwright) på rigtige sider og tæller regelbrud. Hver opgave skal bringe sine regler ned på nul brud. De rene funktioner i audit-reglerne har node-tests.

**Tech Stack:** CSS, almindelig JavaScript, node --test, jsdom og Playwright (dev-browseren fra plan 1).

**Spec:** `docs/superpowers/specs/2026-10-31-lectio-plus-2-design.md`, afsnit 3, 5 og 6. Input: `docs/superpowers/plans/notes-efter-plan-1.md`.

## Global Constraints

Alt fra plan 1 gælder stadig: intet build-trin, dansk tekst, ingen data ud af computeren, én forespørgsel ad gangen til Lectio, ingen blink, ingen ændring af formularfelter eller postbacks, builderen udfører aldrig rigtige handlinger i Lectio, ingen personlige data i git, og commits slutter med `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push til `origin v2` efter hver opgave (Gustav har givet lov).

Desuden:
- Ingen regel i `lectio.css` må skjule eller flytte et formularfelt, en knap eller et link, som Lectio viser. Restyling ændrer kun udseende.
- Alt med `position: sticky` eller `fixed` og en `top` lægger `var(--shell-h)` til (`test/css-rules.test.js`).
- Farver kommer kun fra tokens i `tokens.css`. Ingen faste farver i `lectio.css` undtagen `transparent`, `currentColor` og `rgba(0,0,0,x)` til skygger.
- Egne visninger (`#lp-app`) hører til plan 3 og ignoreres af audit'en i denne plan.

## Review Focus

1. **En Lectio-knap der er et `<a>` i en `div.buttonfilled`:** hele knappen er klikbar og har fokusring, ikke kun teksten. Pinnes med audit-reglen `knap` (Task 3), som også tjekker at `<a>` fylder wrapperen.
2. **Deaktiverede knapper og links (fx "Rediger mappe"):** de er dæmpede, men stadig synlige (kontrast mindst 3:1). Pinnes med audit-reglen `kontrast` (Task 4), som bruger 3,0 for deaktiverede elementer.
3. **Skolens egen HTML (fx studieretningspræsentationen):** teksten er læsbar i begge temaer, selvom skolen har sat faste farver. Pinnes med audit-reglen `kontrast` på `studieretningElevValg.aspx` (Task 6).
4. **Sider med vandret overløb i 1024 px (Dokumenter):** indholdet kan nås ved at rulle i indholdsfeltet, og hele siden ruller ikke. Pinnes med audit-reglen `overloeb` ved 1024 px (Task 7).
5. **Tabelrækker med flere linjers indhold:** de må gerne være høje. Det er luften, der skal væk. Audit-reglen `tabel` måler derfor cellernes polstring, ikke rækkehøjden (Task 5).

---

## Filstruktur

```
extension/styles/lectio.css     ny: alle regler for Lectios egne komponenter i D
extension/styles.css            ændres: "Lectios egne sider" og andre regler for Lectios komponenter flyttes ud
extension/manifest.json         ændres: css = tokens.css, styles.css, lectio.css, shell.css
extension/src/lib/dark.js       ny: darkFix og lum flyttet fra content.js og udvidet til alle fire kanter
extension/content.js            ændres: bruger LP.darkFix; #lp-shell-head og html.lp-shell omdøbes
extension/src/shell/nav.js      ændres: activeKey vælger link med query før link uden
extension/src/shell/shell.js    ændres: focusout, temaikon
extension/styles/shell.css      ændres: Mere-menuens bredde, fanerækkens rullebjælke
tools/audit-rules.js            ny: rene funktioner og collect(document, window) til audit'en
tools/audit.mjs                 ny: kører audit'en på sider i begge temaer og skriver shots/audit.json
tools/audit-allow.json          ny: dokumenterede undtagelser (side, regel, selector, begrundelse)
test/audit-rules.test.js        ny: tests af de rene funktioner
test/dark.test.js               ny: tests af darkFix
```

Siderne i denne plan (`PLAN2_PAGES` i `tools/audit.mjs`) er alle stier i `LP.MORE_ITEMS` undtagen `studieplan.aspx?displaytype=ugeteksttabel`, som har en egen visning (plan 3). Det er 22 sider.

---

### Task 1: Audit-værktøjet

**Files:** Create `tools/audit-rules.js`, `tools/audit.mjs`, `tools/audit-allow.json`, `test/audit-rules.test.js`. Modify `package.json` (script `"audit": "node tools/audit.mjs"`).

**Interfaces:**
- `tools/audit-rules.js` er et almindeligt script, der lægger `AUDIT` på `globalThis` (så det både kan sprøjtes ind i en side og indlæses i node):
  - `toRgb(cssColor, doc) -> {r,g,b,a}|null`: oversætter enhver CSS-farve, også `oklch(...)`, via et canvas' `fillStyle`. I node uden canvas tager den kun imod `#rrggbb` og `rgb()/rgba()`.
  - `lum({r,g,b}) -> 0..1` og `contrast(a, b) -> number` efter WCAG 2.1.
  - `isForeignBlue(rgb, accentRgb) -> boolean`: sand, når farvens hue ligger mellem 180 og 250, mætningen (HSL) er over 0,35, og afstanden (euklidisk i RGB) til accenten er over 40.
  - `collect(doc, win, { accent, theme }) -> Violation[]`, hvor `Violation = { rule, selector, detail }`. Den kigger kun på synlige elementer inde i `.outerContentFrame` og springer `#lp-app`, `#lp-shell`, `#lp-palette`, `#lp-drawer` og alt med `[class*="fonticon"]`, `.material-symbols-outlined` og `img` over.
- Regler i `collect`:
  - `rund`: `border-radius` over 6 px på et element, der er mindst 24 × 24 px.
  - `skrift`: synlig tekst, hvor `font-family` ikke starter med `"LP Plex"`.
  - `blaa`: `color`, `background-color` eller `border-color` er `isForeignBlue`.
  - `kontrast`: tekst med kontrast under 4,5 mod den første uigennemsigtige baggrund opad (3,0 for tekst på mindst 24 px, eller 18,66 px og fed, og for elementer med `disabled`, `aria-disabled="true"` eller klassen `disabled`).
  - `lys` (kun mørkt tema): baggrund med `lum` over 0,5 på et element på mindst 20 × 20 px, eller kant med `lum` over 0,6.
  - `tabel`: en `td` eller `th` i `.ls-table-layout1/2/5`, `.lf-grid` eller `.s2skema`, hvor `padding-top + padding-bottom` er over 14 px.
  - `knap`: et element med klassen `buttonfilled`, `buttonoutlined`, `buttonfilledtonal`, `buttontext` eller `buttonicon`, hvor det første `a` eller `button` indeni er under 90 % af wrapperens bredde.
  - `overloeb`: `document.documentElement.scrollWidth` er større end `innerWidth`, eller et element i indholdet rækker mere end 2 px ud over `.outerContentFrame`'s højre kant uden at en forælder har `overflow-x: auto` eller `scroll`.
- `npm run audit -- [sti ...] [--rule <navn,...>] [--theme light|dark|both] [--width 1280]` forbinder til dev-browseren, genindlæser extensionen og kører `collect` på hver side og i hvert tema. Uden stier bruges `PLAN2_PAGES`. Den skriver `shots/audit.json` og en tabel med antal brud pr. side og regel. Brud, der står i `audit-allow.json` (`{ page, rule, selector, why }`), tælles ikke med. Exitkoden er 1, hvis der er brud tilbage.

- [ ] **Step 1: Skriv test/audit-rules.test.js (den skal fejle)**
  - `contrast(toRgb('#ffffff'), toRgb('#1d2733'))` er over 14.
  - `isForeignBlue(toRgb('#006493'), toRgb('#1b5ea8'))` er `true`. `isForeignBlue(toRgb('#1b5ea8'), toRgb('#1b5ea8'))` er `false`. `isForeignBlue(toRgb('#c42b1c'), toRgb('#1b5ea8'))` er `false`.
  - `collect` på et jsdom-dokument med `<div class="outerContentFrame"><p style="font-family: Verdana">Hej</p></div>` giver et brud med `rule: 'skrift'`. jsdom har intet layout, så testen sætter `win.HTMLElement.prototype.getBoundingClientRect` til at returnere 100 × 20 px.
- [ ] **Step 2: Kør `npm test`, og se testen fejle, fordi `tools/audit-rules.js` mangler.**
- [ ] **Step 3: Skriv `tools/audit-rules.js` og `tools/audit.mjs` efter interfacet, og opret `tools/audit-allow.json` som `[]`.**
- [ ] **Step 4: Kør `npm test`. Forventet: PASS.**
- [ ] **Step 5: Kør audit'en som udgangspunkt.**
  Run: `npm run audit`
  Expected: exitkode 1 og en tabel med brud for alle regler på de fleste sider. Gem tabellen som `docs/superpowers/plans/audit-foer-plan-2.txt`. Den er bevis på RED for Task 2 til 7.
- [ ] **Step 6: Commit og push.**

---

### Task 2: Paneler og kort (mønster 1)

**Files:** Create `extension/styles/lectio.css`. Modify `extension/styles.css` (flyt sektionen "Lectios egne sider" og alle regler for `lf-island`, `islandHeaderContainer`, `islandContent`, `ls-card-filled`, `ls-card-elevated` og `ls-island-*` over i `lectio.css`), `extension/manifest.json`.

Regler (D):
- `section.lf-island`, `.ls-card-filled`, `.ls-card-elevated` og Lectios `ls-island-*`: fladen er `var(--surface)`, kanten er `1px solid var(--rule)`, hjørnerne er `var(--radius)`, der er ingen skygge, og `margin-bottom` er 16 px. Islands ved siden af hinanden i `.ls-std-island-layout-ltr` får `align-items: stretch` og `gap: 16px`, så de flugter.
- `.islandHeaderContainer`: 40 px høj, `padding: 0 14px`, bundkant `1px var(--rule)`, ingen egen radius. `.islandHeader` er 14,5 px og vægt 600 i `var(--ink)`. `.islandHeaderRight` er højrestillet i `var(--ink-2)`.
- `.islandContent`: `padding: 12px 14px`.
- `section.lf-island.noheader` og islands uden tekst i `.islandHeader`: overskriftsfeltet skjules helt (`display: none`), så der ikke står tom plads. Det er en ren visuel ændring, for feltet indeholder ingen kontroller.
- Et kort inde i et kort (Hjælp): det indre `.ls-card-elevated` eller island i en island får ingen kant og ingen skygge.

- [ ] **Step 1: RED er audit-tabellen fra Task 1 (reglen `rund` på islands).**
- [ ] **Step 2: Skriv reglerne, og flyt de gamle.**
- [ ] **Step 3: Kør `npm run audit -- --rule rund`.** Forventet: ingen brud fra islands og kort. Tilbageværende brud på `rund` skal komme fra knapper og felter, for de rettes i Task 3 og 4. Skriv dem i ledger.
- [ ] **Step 4: Skærmbilleder.** Run `npm run shot -- help/mainhelp.aspx Elev_SPS.aspx subnav/fravaerelev_fravaersaarsager.aspx MinButik.aspx`. Forventet: ingen store, bløde kort, og ingen tom overskriftsplads på Hjælp. Kortene på SPS og Fraværsårsager flugter.
- [ ] **Step 5: `npm test`, commit og push.**

---

### Task 3: Knapper, links og den fremmede blå (mønster 2 og 3)

**Files:** Modify `extension/styles/lectio.css`, `extension/styles.css` (fjern `input[type=submit]`, `.button` og `.lec-button` med radius 8 px).

Regler (D), alle under `html.lp-on .outerContentFrame`:
- `.buttonfilled`, `.buttonoutlined`, `.buttonfilledtonal`, `.buttontext`, `.buttonicon` og `input[type=submit|button]` samt `button` (ikke inde i `#lp-*`):
  - Wrapperen har ingen egen flade, kant eller radius. `<a>` eller `<button>` indeni fylder den (`display: inline-flex`, `width: 100%`) og er 32 px høj med `padding: 0 12px`, hjørner på `var(--radius)` og 13,5 px skrift i vægt 500.
  - `buttonfilled` og submit-knapper: fladen er `var(--accent)`, teksten `var(--accent-ink)`.
  - `buttonoutlined`: fladen er `var(--surface)`, kanten `1px var(--rule)`, teksten `var(--ink)`.
  - `buttonfilledtonal`: fladen er `var(--accent-soft)`, teksten `var(--accent)`.
  - `buttontext`: ingen flade, teksten er `var(--accent)`.
  - `buttonicon`: 32 × 32 px, ingen flade, ikonet er `var(--ink-2)`.
  - Hover gør fladen en anelse mørkere med `filter: brightness(.96)` (accent: `brightness(1.08)`). Fokus er `outline: 2px solid var(--accent)` med `outline-offset: 2px`.
  - Deaktiveret (`[disabled]`, `[aria-disabled="true"]` eller `.disabled`): `opacity: .55` og ingen hover.
- Links: alle `a` i indholdet får `color: var(--accent)`, også punkttegn (`li::marker`) og Lectios ikonlinks. Hjælpetekst i Lectios kursive petrolblå bliver til `var(--ink-2)` uden kursiv.
- Mappefiltre og statusknapper, der er pills, bliver til `var(--radius-sm)`.
- Lectios flydende handlingsbjælke (Valgfag, selector fundet med audit'en) bliver til en fast bund med fladen `var(--surface)`, en topkant på `1px var(--rule)`, ingen radius og ingen gennemsigtighed.

- [ ] **Step 1: RED er audit-tabellen (reglerne `knap`, `blaa` og `rund` på knapper).**
- [ ] **Step 2: Skriv reglerne.**
- [ ] **Step 3: Kør `npm run audit -- --rule knap,blaa,rund`.** Forventet: 0 brud, bortset fra formularfelter, som rettes i Task 4.
- [ ] **Step 4: Skærmbilleder** af `indstillinger/studentIndstillinger.aspx`, `studieretningValgfag.aspx`, `DokumentOversigt.aspx` og `spoergeskema/spoergeskema_rapport.aspx`. Forventet: Gem, Annuller, Anvend, Søg, Vis QR kode og Studiekort har samme firkantede stil. Handlingslinks er accentblå i begge temaer.
- [ ] **Step 5: `npm test`, commit og push.**

---

### Task 4: Formularer, afkrydsningsfelter og mørkt tema (mønster 4)

**Files:** Create `extension/src/lib/dark.js`, `test/dark.test.js`. Modify `extension/content.js` (`lum`, `OWN_UI` og `darkFix` flyttes til `dark.js`, og content.js bruger `LP.darkFix(root, doc)`), `extension/styles/lectio.css`, `extension/manifest.json` (dark.js efter parse.js).

**Interfaces:** `LP.lum(cssColor) -> number|null` (uændret logik) og `LP.darkFix(root, doc)` sætter `lp-dk-bg`, `lp-dk-fg`, `lp-dk-link` og `lp-dk-bd` som i 1.x. Forskellen er, at kanter nu tjekkes på alle fire sider (`border-top/right/bottom/left`), ikke kun top og venstre.

Regler (D):
- `html[data-lp-theme="dark"].lp-on { color-scheme: dark; }` og `html.lp-on { accent-color: var(--accent); }`, så de indbyggede afkrydsningsfelter og radioknapper tegnes med synligt flueben i begge temaer.
- Tekstfelter, `select` og `textarea` i indholdet: 32 px høje (`textarea` undtaget), hjørner på `var(--radius-sm)`, kant `1px var(--rule)`, fladen `var(--surface)`, teksten `var(--ink)` og fokus `outline: 2px solid var(--accent)`. Dette erstatter reglen med radius 8 px i `styles.css`.
- Knaptekst, der har samme farve som fladen (Beskeder, "Markér alle som læst"), dækkes af knapreglerne i Task 3. Er der stadig et brud, rettes det med en selector fundet med audit'en.

- [ ] **Step 1: Skriv test/dark.test.js (den skal fejle).** I jsdom: et `div` med `style="border-bottom: 1px solid rgb(240,240,240)"` inde i `#masterContent` på en side med `data-lp-theme="dark"` og klassen `lp-on` får `lp-dk-bd` af `LP.darkFix`. Et `div` med `style="background: rgb(255,255,255)"` får `lp-dk-bg`. Et element inde i `#lp-shell` røres ikke.
- [ ] **Step 2: Kør `npm test`, og se testen fejle.**
- [ ] **Step 3: Opret dark.js, kobl content.js på den, og skriv CSS-reglerne.**
- [ ] **Step 4: Kør `npm test` (PASS) og `npm run audit -- --rule lys,kontrast --theme dark`.** Forventet: 0 brud. Brud, der kommer fra tabeller eller skolens HTML, rettes i Task 5 og 6.
- [ ] **Step 5: Commit og push.**

---

### Task 5: Tabeller (mønster 5)

**Files:** Modify `extension/styles/lectio.css`, `extension/styles.css` (tabelreglerne i "Lectios egne sider" og `.s2skema` i mørkt tema flyttes).

Regler (D) for `.ls-table-layout1/2/5`, `.lf-grid`, `.ls-std-table-inputlist` og `table.s2skema` uden for vores egne visninger:
- `border-collapse: collapse`, ingen ydre kant og ingen lodrette streger. Der er en vandret streg på `1px var(--rule)` under hver række, og ingen stiplede kanter.
- `th`: 12,5 px, vægt 600, `var(--ink-2)` og `padding: 6px 10px`. Links i `th` (sortering) har samme farve som teksten, ikke blå.
- `td`: `padding: 6px 10px` og `vertical-align: top`. Tomme mellemrækker (`tr`, hvor alle celler er tomme, fundet med `:has()`) skjules: `tr:not(:has(td:not(:empty)))`.
- Skematabellerne (Dags- og Ugeændringer): ingen creme baggrund. Lektioner står i `var(--ink)` uden kursiv, aflyst er gennemstreget i `var(--danger)`, og ændret står i `var(--warn)`, ud fra Lectios egne klasser `s2cancelled` og `s2changed`. Billedteksten (`caption`) er venstrestillet med 14,5 px og vægt 600. Tabellen lægges i en flade med `var(--surface)`, kant og `var(--radius)`, ligesom et island.
- Månedskalenderen: månedsnavnene er venstrestillede med 15 px og vægt 600, tomme dage har ikke ekstra højde, og tabellerne fylder bredden (`width: 100%`).

- [ ] **Step 1: RED er audit-tabellen (reglen `tabel`).**
- [ ] **Step 2: Skriv reglerne.**
- [ ] **Step 3: Kør `npm run audit -- --rule tabel,blaa,lys`.** Forventet: 0 brud.
- [ ] **Step 4: Skærmbilleder** af `SkemaDagsaendringer.aspx`, `SkemaUgeaendringer.aspx`, `kalender.aspx`, `BD/UserReservations.aspx` og `indstillinger/AdgangIndstillinger.aspx`. Forventet: tætte tabeller med tynde vandrette streger og grå tabelhoveder. Ingen creme flader og ingen grøn kursiv.
- [ ] **Step 5: `npm test`, commit og push.**

---

### Task 6: Overskrifter, lister, ikoner og skolens egen HTML (mønster 6)

**Files:** Modify `extension/styles/lectio.css`.

Regler (D):
- Lectios sidetitler inde i indholdet (centrerede titler og `.maintitle`) følger sidehovedets skala: venstrestillet, 24 px og vægt 600. Mellemoverskrifter er 15 px og vægt 600.
- Find skemas kolonneliste (selector fundet i fixturen `FindSkema.aspx_type_laerer.html`) bliver til en tæt liste i kolonner: ingen bokse omkring punkterne, 13,5 px skrift og en tynd skillelinje mellem rækkerne.
- Lectios gamle mappe-bitmaps i Dokumenter (`img` med `folder` i `src`) skjules og erstattes af en lille mappe tegnet med CSS-`mask` i farven `var(--ink-3)`. Det gælder kun billeder, og knapper og links røres ikke.
- Skolens egen HTML (studieretningspræsentationen og indlejret indhold i `.islandContent`): `font-family: var(--font) !important` på alle efterkommere. I mørkt tema får `[style*="color"]` farven `var(--ink)` og `[style*="background"]` fladen `transparent`. I lyst tema rettes kun tekst, hvis kontrasten er under 4,5. Det sker med klassen `lp-dk-fg`, som `LP.darkFix` sætter, når den kaldes med `{ theme: 'light' }` på indholdet af islands.
- "STUDIEKORT" i tynde versaler bliver til 18 px i vægt 600 uden versaler.

- [ ] **Step 1: RED er audit-tabellen (reglerne `skrift` og `kontrast`).**
- [ ] **Step 2: Skriv reglerne. Hvis `LP.darkFix` skal tage `{ theme }`, så tilføj først en test i `test/dark.test.js`, se den fejle, og implementer den derefter.**
- [ ] **Step 3: Kør `npm run audit -- --rule skrift,kontrast`.** Forventet: 0 brud.
- [ ] **Step 4: Skærmbilleder** af `studieretningElevValg.aspx`, `FindSkema.aspx?type=laerer`, `DokumentOversigt.aspx`, `digitaltStudiekort.aspx` og `studieplan/undervisningsbeskrivelse.aspx`.
- [ ] **Step 5: `npm test`, commit og push.**

---

### Task 7: Sidespecifikke rettelser og overløb

**Files:** Modify `extension/styles/lectio.css`, `extension/styles.css` (`overflow-x: hidden` på `html.lp-on, html.lp-on body` erstattes).

- `html.lp-on .outerContentFrame { overflow-x: auto; }`. Siden ruller ikke vandret, men indhold, der er bredere end vinduet, kan rulles i indholdsfeltet (Review Focus 4).
- Det, der stadig er tilbage i noterne under "Sider" og ikke er dækket af Task 2 til 6, rettes her. Hver rettelse noteres i ledger med side og selector.

- [ ] **Step 1: RED:** `npm run audit -- DokumentOversigt.aspx --rule overloeb --width 1024` giver mindst ét brud.
- [ ] **Step 2: Skriv reglerne.**
- [ ] **Step 3: Kør audit'en på alle regler i både 1280 og 1024 px.** `npm run audit && npm run audit -- --width 1024`. Forventet: exitkode 0. Brud, der ikke kan fjernes uden at ændre Lectios funktion, skrives i `audit-allow.json` med en begrundelse.
- [ ] **Step 4: `npm test`, commit og push.**

---

### Task 8: Småfejl i skallen fra plan 1

**Files:** Modify `extension/src/shell/nav.js`, `extension/src/shell/shell.js`, `extension/styles/shell.css`, `extension/content.js`, `extension/styles.css`, `test/nav.test.js`, `test/shell.test.js`.

- [ ] **Step 1: Skriv de fejlende tests.**
  - nav: `LP.activeKey('default.aspx', '?menu=kontakt')` giver `'kontakt'`, og `LP.activeKey('default.aspx', '')` giver `'hovedmenu'`.
  - shell: når fokus flytter til et element uden for `.lp-more-wrap` (`focusout` med `relatedTarget` udenfor), lukkes menuen.
  - shell: `buildShell({ ..., theme: 'dark' })` viser `ICONS.sun` i temaknappen (knappen indeholder solens path). `theme: 'light'` viser månen. `shell.setTheme(t)` skifter ikonet.
- [ ] **Step 2: Kør `npm test`, og se de tre tests fejle.**
- [ ] **Step 3: Implementer.**
  - `activeKey` prøver punkter med `?` i stien før punkter uden.
  - `shell.js` lytter efter `focusout` på `.lp-more-wrap`. Den tager `opts.theme` og returnerer `setTheme(theme)`.
  - `content.js` sender `theme` med og kalder `shell.setTheme` i `onTheme`.
  - `shell.css`: `.lp-more-pop` bruger `left: 12px; right: 12px; max-width: 920px` i stedet for `100vw`, og fanerækken får `scrollbar-width: thin`.
  - `#lp-colors` får `z-index: 9500`.
  - `#lp-shell-head` omdøbes til `#lp-pagehead`, og `html.lp-shell` til `html.lp-has-pagehead`, både i content.js og i CSS.
- [ ] **Step 4: Kør `npm test`. Forventet: PASS.** Tjek også, at `grep -rn "lp-shell-head\|html.lp-shell\b"` ikke finder noget i `extension/`.
- [ ] **Step 5: Commit og push.**

---

### Task 9: Samlet kontrol

- [ ] **Step 1:** Kør `npm run audit` og `npm run audit -- --width 1024`. Forventet: exitkode 0 begge gange.
- [ ] **Step 2:** Tag skærmbilleder af alle sider i `PLAN2_PAGES` i begge temaer, og lad en agent sammenligne dem med "Sider" i `notes-efter-plan-1.md`. Agenten skriver `docs/superpowers/plans/notes-efter-plan-2.md` med det, der stadig mangler, og med noter til plan 3 (egne visninger). Tjek filen for persondata, og commit den.
- [ ] **Step 3:** `npm test`, commit og push.
