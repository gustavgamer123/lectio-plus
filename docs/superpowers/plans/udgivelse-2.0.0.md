# Udgivelse af Lectio+ 2.0.0: tjekliste til Gustav

Pakken ligger i `dist/lectio-plus-2.0.0.zip` (lav den igen med kommandoen nederst, hvis noget er ændret).

## 1. Test selv i din egen Chrome først (5-10 minutter)
Indlæs `extension/` upakket (eller genindlæs Lectio+ på `chrome://extensions`) og prøv det, builderen ikke må:
- [ ] Aflever en opgave med en fil (Opgaver → en opgave → Vælg dokument og send). Brug en opgave, hvor det er i orden.
- [ ] Svar på en besked, og send en ny besked (Ny besked i Lectio+).
- [ ] Markér alle som læst i Beskeder.
- [ ] Skriv og gem i Elevfeedback på en lektion (Skriv, Gem).
- [ ] Slå notifikationer til i popuppen (klik Tillad), tryk Tjek nu.
- [ ] Kig et par sider igennem i mørkt tema: Forside, Skema, Opgaver, Beskeder, Fravær, Karakterer, Mere-sider.

## 2. Chrome Web Store (developer dashboard)
1. Vælg Lectio+ → **Package** → **Upload new package** → vælg `lectio-plus-2.0.0.zip`.
2. **Privacy practices / Begrundelser for tilladelser.** Nye i 2.0 (kopiér gerne):
   - `alarms`: Bruges til at tjekke Lectio hvert 20. minut, men kun når eleven selv har slået notifikationer til.
   - `offscreen`: Bruges til at læse Lectio-sider (DOMParser) i baggrunden til notifikationerne. Intet vises for brugeren.
   - `notifications` (valgfri, bedes om ved tænd): Viser notifikationer om nye lokaler, aflysninger, nye beskeder og frister.
   - Værtsadgang `https://www.lectio.dk/*`: Udvidelsen ændrer designet på lectio.dk og henter elevens egne data derfra. Ingen andre websteder.
   - `storage` (som før): Indstillinger, fagfarver, huskeliste og en lokal ændringslog.
3. **Data usage:** Lectio+ behandler indhold fra lectio.dk (skema, opgaver, beskeder, karakterer, fravær) **kun lokalt** i browseren. Intet sælges, deles eller sendes til en server. Sæt de samme flueben som i 1.x; vælg "Website content" og "Personal communications" (beskeder), hvis dashboardet spørger, og bekræft at data ikke overføres.
4. **Store listing:** ny kort beskrivelse (fra manifestet):
   "Lectio i ét roligt design med overblik, hvad er ændret, fraværsberegner, snit-simulator og notifikationer. Data bliver hos dig."
   Nye skærmbilleder: tag dem selv i Lectio, eller sløre navne i dem fra `shots/` (de indeholder dine data og må ikke lægges op som de er).
5. **Submit for review.** Opdateringen rammer brugerne efter Googles gennemgang (typisk 1-3 dage). Der kommer ingen ny tilladelsesadvarsel, så Lectio+ bliver ikke slået fra hos dem, der har 1.x.

## 3. Hjemmesiden
- Privatlivssiden siger "ingen server, ingen data sendes". Det er stadig rigtigt i 2.0. Overvej at tilføje én linje om notifikationer: "Slår du notifikationer til, tjekker Lectio+ lectio.dk med jævne mellemrum, også når Lectio er lukket, og holder dig logget ind så længe."
- Billeder og tekst på hjemmesiden viser 1.x. Den nye hjemmeside er et separat projekt.

## Lav zip-filen igen (PowerShell, fra repoets rod)
```
Remove-Item dist\lectio-plus-2.0.0.zip -ErrorAction SilentlyContinue; Compress-Archive -Path extension\* -DestinationPath dist\lectio-plus-2.0.0.zip
```
