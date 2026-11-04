# Noter efter plan 4: de fem nye funktioner

## Status
- **Hvad er ændret (7.1):** `src/lib/changes.js`. Øjebliksbillede pr. datatype (skema for denne og næste uge, opgaver, lektier, beskeder) i `chrome.storage.local` under `lp-changes:<skole>:<elev>`. Linjer for flyttet lokale, aflyst, ændret, ny opgave, ny frist, ny eller ændret lektie og ny besked. Panel øverst på Forside med Marker som set.
- **Fraværsberegner (7.2):** `src/lib/absence.js`. Under tabellen på Fravær: kommende moduler i to uger og ikke-afleverede opgaver med elevtid; resultat pr. hold og samlet som ca.-tal.
- **Snit-simulator (7.3):** `src/lib/grades.js` (simulateAverage, protocolIndex, yearAverage). Karaktererne i Karakterer i år og på beviset er knapper med en menu; Nulstil; tastatur med pile og Esc.
- **Travle uger (7.4):** `src/lib/busy.js`. 8 søjler øverst på Opgaver; et klik filtrerer listen.
- **Klar til i morgen (7.5):** `src/lib/day.js`. Om aftenen og på dage uden moduler: hvornår og hvor man møder, moduler og fri, dagens ændringer, lektier med flueben og huskeliste (`remember` i indstillingerne).
- Tests: 110. Audit: se nedenfor.

## Valg
- Fraværsberegneren regner på periodens brøker (moduler og elevtid), fordi "Opgjort" i Lectio kun er en procent uden nævner. Hold uden moduler eller elevtid i perioden står med en forklaring, så "ca. 100 %" ikke står alene.
- En forventet karakter uden linje på beviset regnes med vægt 1 (står under tabellen).
- Lektie-fluebenene i Klar til i morgen deler nøgle og lager med Lektier (`hwKey`, localStorage `lp-hw-done`).

## Fejl fundet og rettet undervejs
- **Beskeder kunne ikke sendes (Gustavs fejl):** Ny besked og Markér alle som læst klikkede på Lectios `javascript:`-links fra udvidelsens verden, og Chrome blokerede dem (CSP). Nu klikker `src/main/click.js` (world MAIN) på knappen (`LP.lectioClick`). Send testet hele vejen med én besked til Gustav selv efter aftale.
- **Svar manglede i læsepanelet:** alle tråde stod som "kan ikke besvares" pga. en tom `.grayed-out`, som Lectio altid har. Nu `LP.threadCanReply` (svarfelt med Send).
- **Send stod som "S end":** knappens gap lå mellem `<span class="shortcutletter">S</span>` og resten.
- **Forside genindlæste sig selv:** `chrome.storage.onChanged` reagerede også på `local`, så ændringsloggen udløste `location.reload()`. Nu kun `sync`.
- **Hvide afkrydsningsfelter i mørkt tema** i de egne visninger (Lectios CSS satte `appearance: none` og hvid bund).

## Ikke testet af builderen
- Markér alle som læst (ville markere Gustavs beskeder som læste).
- Klar til i morgen om morgenen før første modul (koden viser dagens Nu/Næste; testet med tests, ikke live).
