# Lectio+ 2.0, plan 4: De fem nye funktioner på siderne

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Funktion 7.1 til 7.5 fra specen virker på Forside, Fravær, Karakterer og Opgaver: Hvad er ændret, Fraværsberegner, Snit-simulator, Travle uger og Klar til i morgen med huskeliste.

**Architecture:** Al logik ligger i små, rene moduler i `extension/src/lib/` med tests i jsdom (`node --test`). `content.js` henter data gennem den eksisterende kø (`fetchDoc`), kalder modulerne og tegner resultatet i D med de komponenter, der findes (`.lp-panel`, `table.lp-table`, `.lp-tag`, `.lp-btn`, `.lp-fields`, `.lp-filter`). Ændringsloggen gemmes i `chrome.storage.local`, huskelisten i `chrome.storage.sync` sammen med de andre indstillinger.

**Tech Stack:** Som plan 1 til 3. Ingen nye tilladelser i denne plan.

**Spec:** `docs/superpowers/specs/2026-10-31-lectio-plus-2-design.md`, afsnit 7.1 til 7.5. Notifikationer (7.6), popup, "Nyt i 2.0" og udgivelse ligger i plan 5.

## Global Constraints

Alt fra plan 1 til 3 gælder. Desuden:
- Ingen ny forespørgsel til Lectio uden om køen. Funktionerne bruger de sider, der allerede hentes (skema for denne og næste uge, opgaver, lektier, beskeder, fravær og karakterer), og henter højst næste uges skema ekstra.
- Simulerede tal (fravær og snit) står altid som "ca." eller med tagget "simuleret", og der er en knap til at nulstille. De gemmes ikke.
- Første gang ændringsloggen ser en datatype, gemmes kun et udgangspunkt. Der vises ingen "ændringer" for data, der bare er nye for Lectio+.
- Al tekst er dansk, kort og konkret ("Dansk i morgen 08:00 er flyttet fra B208 til B207").

## Valg truffet af builderen

- **[mit valg] Fraværsberegneren regner på periodens moduler.** Lectios tabel har kun brøker under "Periode" (fx 1/14 moduler og 0/3 elevtimer). "Opgjort" er kun en procent uden nævner. Beregneren viser derfor periodens fravær fra a/n til (a+k)/(n+k) og har Lectios opgjorte procent stående ved siden af som det officielle tal.
- **[mit valg] Snit-simulatoren** regner på protokollinjerne (beviset) med deres vægt. Et fag uden linje på beviset kan få en forventet karakter fra tabellen "Karakterer i år"; den regnes med vægt 1, og det står i forklaringen. Tal nummer to er snittet af årskaraktererne i "Karakterer i år" uden vægt, som i 1.x.
- **[mit valg] En linje i "Hvad er ændret" forsvinder**, når eleven trykker "Marker som set", eller når den ikke er relevant længere: modulet er slut, fristen er overstået, lektiedagen er gået, eller beskeden er læst. Højst 40 linjer gemmes.
- **[mit valg] Huskelisten** gemmes pr. fagkode (`remember: { "MA": ["lommeregner"] }`), så den virker for alle hold i faget.

## Review Focus

1. **Første besøg efter installation:** "Hvad er ændret" er tom og fylder ikke noget. Pinnes med en test af `LP.diffSnapshots(null, snap)`.
2. **Et modul, der både flytter lokale og bliver ændret:** én linje, ikke to. Pinnes med en test.
3. **Fravær uden elevtimer eller med 0 moduler:** ingen division med 0 og ingen "NaN %". Pinnes med en test af `LP.absenceForecast`.
4. **Karakterer uden protokol:** simulatoren virker stadig på "Karakterer i år". Pinnes med en test af `LP.simulateAverage([], ...)`.
5. **Fredag aften og weekend:** "Klar til i morgen" viser mandag. Pinnes med en test af `LP.nextSchoolDay`.

---

## Filstruktur

```
extension/src/lib/changes.js     ny: snapshot, diff og log for "Hvad er ændret"
extension/src/lib/absence.js     ny: absenceForecast
extension/src/lib/grades.js      ændres: simulateAverage, yearAverage
extension/src/lib/busy.js        ny: busyWeeks
extension/src/lib/day.js         ny: nextSchoolDay, eveningMode, dayPlan
extension/manifest.json          ændres: de nye filer i js-listen før content.js
extension/content.js             ændres: kobler modulerne på visningerne og gemmer log og huskeliste
extension/styles/views.css       ændres: regler til de nye flader
test/changes.test.js, test/absence.test.js, test/grades.test.js, test/busy.test.js, test/day.test.js
```

---

### Task 1: Ændringslog og "Hvad er ændret" på Forside

**Files:** Create `src/lib/changes.js`, `test/changes.test.js`. Modify `manifest.json`, `content.js`, `views.css`.

- `LP.snapshot(part, data)` laver et lille, stabilt billede af én datatype:
  - `skema`: pr. lektion (nøgle = absid fra href, ellers start+fag) med start, slut, fag, lokale, aflyst og ændret.
  - `tasks`: pr. opgave (nøgle = exerciseid) med titel, frist og status.
  - `hw`: pr. lektie (nøgle = href+dato) med en kort hash af teksten.
  - `msgs`: pr. tråd (nøgle = id) med emne, afsender og ulæst.
- `LP.diffSnapshots(part, prev, next, now)` giver linjer: `{ id, part, kind, text, href, until, at }`. Typerne er `room`, `cancelled`, `changed`, `task-new`, `task-due`, `hw`, `msg`. Uden `prev` gives `[]`. Kun fremtidige moduler, ikke-afleverede opgaver og ulæste beskeder giver linjer. Lokale og ændret på samme modul giver én linje (`room`).
- `LP.mergeLog(log, lines, now)` lægger nye linjer øverst, fjerner dubletter efter `id`, fjerner linjer med `until < now` og beholder højst 40.
- I `content.js`: `recordChanges(part, data)` læser `{ snap, log, seenAt }` fra `chrome.storage.local` (nøgle `lp-changes:<skole>`), kalder `snapshot`, `diffSnapshots` og `mergeLog`, og gemmer. Kaldes hver gang skema, opgaver, lektier eller beskeder er hentet friske. Skemaet tæller kun med for denne og næste uge.
- Forside: et panel "Hvad er ændret" øverst, kun når der er linjer. Hovedet viser "siden <tidspunkt for seenAt>" og knappen "Marker som set". Hver linje er et link med et tag for typen. Beskeder om aflyst bruger `is-danger`, lokale og ændret `is-warn`.

- [ ] **Step 1:** RED: tests for snapshot, diff (inkl. Review Focus 1 og 2, en flyttet frist, en ny opgave, en læst besked der forsvinder) og mergeLog (dublet, udløb, maks 40).
- [ ] **Step 2:** Implementér `changes.js` til GREEN. Læg filen i manifestet før `content.js`.
- [ ] **Step 3:** Kobl på `content.js` og tegn panelet. Prøv med en fixture, hvor et lokale er ændret i hånden (offline), og tag skærmbillede i begge temaer.
- [ ] **Step 4:** `npm test`, `npm run audit -- forside.aspx --own --offline`. Commit og push.

### Task 2: Fraværsberegner på Fravær

**Files:** Create `src/lib/absence.js`, `test/absence.test.js`. Modify `manifest.json`, `content.js` (`renderAbsenceView`), `views.css`.

- `LP.absenceForecast(rows, picks)`: `rows` fra `parseAbsence`; `picks` = `{ mods: { <hold>: k }, hours: { <hold>: h } }`. Giver pr. hold `{ hold, now, then }` for moduler (a/n til (a+k)/(n+k)) og elevtid (m/T til (m+h)/(T+h)) og en samlet linje. Nævner 0 giver `null`, ikke NaN.
- Visning: et panel "Fraværsberegner" under tabellen. Til venstre de kommende moduler i to uger fra skemaet (denne og næste uge), grupperet pr. dag med et flueben pr. modul og et pr. dag. Til højre en tabel: Hold, Nu, Med valgte, Ændring, kun for hold med valg. Under modulerne en liste over ikke-afleverede opgaver med flueben til skriftligt fravær (elevtimer fra opgavelisten). "Nulstil" fjerner alle valg. Alle tal står med "ca.".

- [ ] **Step 1:** RED: tests for absenceForecast (normal, 0 moduler, ingen elevtid, samlet linje, Review Focus 3).
- [ ] **Step 2:** GREEN.
- [ ] **Step 3:** Visning og CSS. Skærmbilleder offline i begge temaer med to valgte moduler.
- [ ] **Step 4:** `npm test`, audit af `subnav/fravaerelev.aspx --own --offline` (0). Commit og push.

### Task 3: Snit-simulator på Karakterer

**Files:** Modify `src/lib/grades.js`, `test/grades.test.js`, `content.js` (`renderGradesView`), `views.css`.

- `LP.simulateAverage(protocol, overrides, extra)`: `overrides` = `{ <linjeindeks>: '7' }`, `extra` = `[{ subject, grade, weight: 1 }]`. Giver `{ avg, weight, n }` som `gradeAverage`.
- `LP.yearAverage(current)`: snit af tal-karakterer i kolonnen Årskarakter, uden vægt.
- Visning: karaktererne i Beviset og i "Karakterer i år" (Årskarakter og Eksamen) er knapper. Et klik åbner en lille menu med -3, 00, 02, 4, 7, 10, 12 og "Fjern". Simulerede celler får accent-kant og tagget "simuleret". Nøgletallene viser det simulerede snit, forskellen ("+0,4") og en knap "Nulstil". Tal nummer to er "snit af årskarakterer".
- Tastatur: knapperne kan nås med Tab, menuen lukkes med Esc.

- [ ] **Step 1:** RED: tests for simulateAverage (override, extra med vægt 1, linje der ikke tæller med, Review Focus 4) og yearAverage.
- [ ] **Step 2:** GREEN.
- [ ] **Step 3:** Visning og CSS. Skærmbillede med en simuleret karakter.
- [ ] **Step 4:** `npm test`, audit af `grades/grade_report.aspx --own --offline` (0). Commit og push.

### Task 4: Travle uger på Opgaver

**Files:** Create `src/lib/busy.js`, `test/busy.test.js`. Modify `manifest.json`, `content.js` (`renderTasksView`), `views.css`.

- `LP.busyWeeks(tasks, now, n = 8)`: de næste 8 uger (mandag til søndag, ISO-ugenummer). Pr. uge antal ikke-afleverede opgaver og summen af elevtimer (`hours` med komma). Den travleste uge har `top: true` (flest elevtimer, ellers flest opgaver). Uger uden opgaver er med som 0.
- Visning: et panel øverst med 8 søjler (uge-nummer under, elevtimer og antal over). Søjlehøjden følger elevtimerne. Den travleste uge står i accent, de andre i `--ink-2`. Et klik på en uge filtrerer listen til opgaver med frist i den uge; et klik igen eller "Alle uger" fjerner filteret. Søjlerne er knapper med `aria-pressed`.

- [ ] **Step 1:** RED: tests for busyWeeks (årsskifte uge 52/53 til 1, afleverede tæller ikke, komma-timer, tom liste).
- [ ] **Step 2:** GREEN.
- [ ] **Step 3:** Visning og CSS. Skærmbilleder i begge temaer.
- [ ] **Step 4:** `npm test`, audit af `OpgaverElev.aspx --own --offline` (0). Commit og push.

### Task 5: Klar til i morgen og huskeliste på Forside

**Files:** Create `src/lib/day.js`, `test/day.test.js`. Modify `manifest.json`, `content.js` (Forside), `views.css`.

- `LP.nextSchoolDay(lessons, now)`: første dag efter i dag med mindst ét modul, der ikke er aflyst. Fredag og weekend giver mandag (hvis der er moduler).
- `LP.eveningMode(lessons, now)`: sand, når dagens sidste modul er slut, eller når der ikke er moduler i dag.
- `LP.dayPlan(lessons, day)`: første modul (tid og lokale), antal moduler, sidste sluttid og fagkoderne den dag.
- Forside om aftenen: panelet "Klar til <dag>" øverst i stedet for Nu/Næste: "Du møder 08:00 i B208", "6 moduler, fri 14:55", ændringer for dagen fra loggen, lektierne for dagen med flueben (de eksisterende) og huskelisten for dagens fag.
- Huskeliste: i panelet kan man skrive en ting til et af dagens fag ("+ Tilføj til huskeliste": vælg fag, skriv, Enter) og fjerne den igen. Gemmes i indstillingerne som `remember`. Popuppen får redigering i plan 5.

- [ ] **Step 1:** RED: tests for nextSchoolDay (fredag, lørdag, ferie med tom uge, Review Focus 5), eveningMode og dayPlan.
- [ ] **Step 2:** GREEN.
- [ ] **Step 3:** Visning, huskeliste og CSS. Skærmbilleder offline (fixturen er fra en dag; tiden sættes med en `now`-parameter i testen og i skærmbilledet via `?lp-now=` kun i udvikling, hvis det behøves).
- [ ] **Step 4:** `npm test`, audit af `forside.aspx --own --offline` (0). Commit og push.

### Task 6: Samlet kontrol

- [ ] **Step 1:** `npm test`, `npm run audit -- --own` og `--own --width 1024` live. Forventet: 0.
- [ ] **Step 2:** Skærmbilleder af de fire sider i begge temaer. Skriv `docs/superpowers/plans/notes-efter-plan-4.md` (tjek for persondata). Commit og push.
