# Noter efter plan 3: egne visninger i D

## Status
- Forside, Skema, Lektier, Opgaver, Beskeder, Fravær, Karakterer, Studieplan, opgavesiden, lektionssiden (Indhold og Elevfeedback) og lektionspanelet er i retning D.
- `styles.css` fra 1.x er tømt og slettet. 104 døde regler (gamle layouts: `.lp-ag`, `.lp-modal`, `.lp-stats`, `.lp-task-row`, `.lp-abs-row`, `.lp-gr-row`, `.lp-spgrid` m.fl.) er fjernet. Lectio-brede regler ligger øverst i `lectio.css` og regler for egne flader øverst i `views.css`, så kaskaden er den samme som før. Radius over 4 px er rettet til D.
- Flytningen er målt med beregnede styles før (git HEAD) og efter på alle egne visninger og 23 Lectio-sider i begge temaer. Eneste forskelle: radius på en skjult knap og mappelisten, der ikke længere er sticky (se nedenfor).
- Audit: 0 brud på Lectios sider og de egne visninger, 1280 og 1024 px, lyst og mørkt tema (live).

## Fund undervejs
- `container-type` på `#lp-app` var fjernet ved et uheld i Task 2, så alle `@container`-regler var døde. Sat ind igen (Task 7).
- `.lp-btn-main` havde mørk tekst på mørk bund (kontrast 1,0), fordi `.lp-btn { color: ... !important }` i shell.css vandt. Nu fyldt accent i shell.css.
- Mappelisten på Beskeder og Dokumenter stod 104 px for langt nede. Årsagen var vores egen 1.x-regel `position: sticky; top: calc(var(--shell-h) + 16px)` inde i Lectios `overflow: hidden`-beholder. Reglen er fjernet, og `top: 0` er sat.
- `test/css-rules.test.js` tjekker nu sticky-reglen i alle CSS-filer i manifestet (før kun to), og at `styles.css` ikke er i manifestet.

## Værktøjer
- `tools/offline.mjs`: audit og skærmbilleder fra fixtures uden login (`--offline`).
- `tools/audit.mjs --click <css>`: klikker før målingen, så fx lektionspanelet kan måles.

## Ikke testet af builderen (Gustav tester selv)
- CKEditor i skrivetilstand på Elevfeedback (kræver klik på Skriv i Lectio).
- Upload og aflevering på opgavesiden, Svar i Beskeder.

## Udskudt fra review (uændret siden plan 2)
- Bredden på submit-felter, markEmptyRows der ikke fjerner markering igen, Plex på pre/code, mappeikoner (Lectios egne billeder), `display: !important` på knapper, lys fallback for skolens egen HTML i mørkt tema.
