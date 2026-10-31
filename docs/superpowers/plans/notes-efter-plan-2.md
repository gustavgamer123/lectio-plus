# Noter efter plan 2

Gennemgang af de 64 skærmbilleder i `shots/` (32 sider, 1280 px, lyst og mørkt tema) efter plan 2. Topbjælken og fanerne er ikke vurderet. Mål er (ca.) aflæst på skærmbillederne. Personlige data er udeladt.

## Lectios egne sider (plan 2)

Plan 2 har ryddet de store linjer: de bløde kort, pill-knapperne, den petrolblå farve, de hvide kanter i mørkt tema og de gamle skematabeller er væk. Det der er tilbage, er mindre ting, men nogle går igen på flere sider:
- Mørkt tema: fluebenet i afkrydsningsfelter er stadig (næsten) usynligt (Dokumenter, Bøger, Spørgeskemaer).
- Mørkt tema: nogle Lectio-links mister linkfarven og bliver hvide (Månedskalender, Fraværsårsager, forløbstitlen på Undervisningsbeskrivelse).
- Tom-tekster ("Der er ingen data..." osv.) har en streg under sig, som om de var en tabelrække, og tomme paneler krymper til 150-250 px.
- Tabelhoveder står centreret over venstrestillede kolonner (Bøger, Log, Fraværsårsager, Dagsændringer, Opgaveside).

### Dokumenter
- Mørkt tema: fluebenet i "Søg kun i aktuel mappe" kan ikke ses.
- Der er en dobbelt skillelinje under værktøjslinjen (to streger ca. 8 px fra hinanden). Begge temaer.
- Stregen under tom-teksten stopper ca. 35 px før panelets højre kant og flugter ikke med linjerne over den.
- Mappetræet ligger uden panel og starter ca. 70 px under panelets top, så de to kolonner ikke flugter.

### Dagsændringer
- Panelet er kun ca. 340 px bredt, og resten af siden står tom. Begge temaer.
- Modulrækkerne er ca. 50 px høje, fordi modulnavn og tid står på hver sin linje.
- Tabelhovederne (Modul, Tidspunkt osv.) er centreret over venstrestillet indhold.

### Ugeændringer
- Tabellen er bredere end panelet. Fredagskolonnen går helt ud til panelets højre kant uden luft, og den længste tekst bliver skåret af. Begge temaer.
- Alle lektioner har en tyk ravfarvet venstrekant (orange i mørkt tema). Når alt på siden er ændringer, siger kanten ikke noget, og den farver hele tabellen. Brug en tynd neutral kant eller et lille tag.

### Månedskalender
- Der er stadig to sæt pile i værktøjslinjen (← og ‹ ›), og ‹ › er mindre og tyndere end pilene på Dags- og Ugeændringer.
- Menuknappen (≡) over hver måned står på sin egen række ca. 30 px over månedsnavnet.
- De to måneder fylder ca. 2/3 af panelet, så der er en tom stribe på ca. 300 px til højre.
- Begivenhederne står ca. 8 px lavere end dag, dato og uge i samme række.
- Mørkt tema: begivenhederne er hvid tekst (kun punkttegnet er blåt). I lyst tema er de blå links.

### Find skema
- Listen ligger stadig ikke i et panel, og den starter ca. 35 px længere inde end sidetitlen (ca. 28 px inde i forhold til panelerne på de andre sider). Begge temaer.

### Undervisningsbeskrivelse
- Forløbstitlen er accentblå i lyst tema og hvid i mørkt tema.
- Etiketkolonnen er så smal, at "Fag og niveau" brydes over to linjer.

### Kontaktbøger
- Tom tabel med kun hovedet og ingen tom-tekst. Begge temaer.
- Panelet krymper til ca. 190 px.

### Studieretning
- De to paneler starter ikke i samme højde (ca. 6 px forskel), og det venstre har ca. 30 px tom plads under sidste række.
- Studieretningspræsentationen er stadig skolens egen HTML: centreret tekst, farvede venstrekanter (lyseblå, orange, lilla) og en blok med ca. 100 px tom plads. I mørkt tema får hver blok en kant, så det bliver kasser i panelet.

### Valgfag
- Den flydende handlingsbjælke (Gem, Annuller, Anvend) er firkantet nu, men den ligger stadig oven på tabellen. Den starter ca. 65 px inde i panelet, flugter ikke med det, og skjuler en sektionsoverskrift, som bliver skåret over. Begge temaer.
- Tabellen bruger stadig mindre skrift (ca. 11-12 px) end resten af siden, og den smalle første kolonne får fagnavne til at bryde, så rækkerne veksler mellem ca. 28 og 44 px.

### Fagvalg
- Der er stadig ca. 40 px tom plads over "Der er ingen data...", og tom-teksten har en streg under sig. Begge temaer.
- Panelet krymper til ca. 150 px.

### Karaktermeddelelse
- Der er ca. 45 px tom plads mellem panelhovedet og første række (Lectios tomme mellemrække). Resten ser fin ud.

### Fraværsårsager
- De tre paneler har hver sin bredde (ca. 290, 255 og 1045 px). Registreringspanelet stopper ca. 85 px før sidens højre kant.
- Aktivitetskolonnen er stadig kursiv. Den er blå i lyst tema og hvid i mørkt tema. I første række bliver teksten skåret af ved næste kolonne i stedet for at bryde.
- Tom-teksten "Ingen manglende ..." har en streg under sig.
- Nøgletallene står centreret i et lille panel, mens Oversigt (egen visning) viser dem venstrestillet og større uden panel (se Fravær nedenfor).

### Bøger
- Mørkt tema: fluebenet i "Vis kun aktive" er der, men det er mørkt på mørkt og næsten usynligt.
- "Bogtitel" står centreret over en venstrestillet kolonne.

### Spørgeskemaer
- Mørkt tema: fluebenet i "Vis kun aktuelle" kan ikke ses. Resten ser fin ud.

### SPS
- Tom-teksterne er ikke ens: én står uden streg og med ekstra luft, mens to har en streg under.
- De tre paneler har hver sin bredde, så det nederste ikke flugter med noget.

### Studiekort
- Fotoet har ca. 10 px radius og er det eneste runde element på siden.
- Titlen "STUDIEKORT" står i versaler inde i panelet i stedet for i et panelhoved som på de andre sider.

### Profil
- Panelhovederne er ikke ens. "Lectio til iPhone" har ingen hovedlinje, og titlen står i normal vægt og større skrift. De andre paneler har en fed titel over en streg.
- Der er tre knapstile på siden: fyldt accent ("Vis QR kode"), kontur med ikon ("Studiekort") og lyseblå flade ("Gem"). Alle er firkantede, men "Gem" ligner en deaktiveret knap.
- Etiketten "Alternativ kontakt:" står nederst i cellen, mens feltet står øverst.
- Inputfelterne har forskellig bredde (ca. 120 og 175 px), og "Konto"-panelet er smallere end panelet over det.
- Android-panelet bruger brødtekst på ca. 15-16 px, store ikoner og et grønt flueben, som er en ekstra farve.

### Betalinger
- Panelet krymper til ca. 180 px, og tom-teksten har en streg under sig.

### Log
- Rækkerne er stadig ca. 45 px høje (målet er ca. 32 px).
- Slet-krydset står ca. 7 px lavere end teksten i samme række.
- Tabelhovederne står centreret over venstrestillede kolonner.

### Hovedmenu
Ser fin ud.

### Kontakt
Ser fin ud.

### Hjælp
Ser fin ud. (Skolens eget indhold har ujævne tomme linjer, men det er indholdet og ikke stilen.)

## Egne visninger (input til plan 3)

Alle egne visninger undtagen Opgaveside og Lektionsside bruger en anden sidebredde og et andet sidehoved end Lectios sider. Indholdet går fra ca. 33 til 1231 px, og titlen står ved y ≈ 136. På Lectios sider går indholdet fra ca. 68 til 1196 px, og titlen står ved y ≈ 153. Det gælder ikke kun Forside, så det står ikke under hver side nedenfor.

### Forside
- Statusmærkerne øverst til højre er stadig runde pills (fristen med ravfarvet kontur, fravær neutralt). De skal være små firkantede tags. Begge temaer.
- "Næste time" er stadig et stort, blødt kort med ca. 12-14 px radius, en titel på ca. 32 px, en tyk venstrekant i fagfarven og meget luft. Begge temaer.
- Sidehovedet er en datolinje over en hilsen på ca. 28 px i stedet for den fælles sidetitel.
- De tre paneler har ca. 14 px radius og ingen hovedlinje. Titlerne er fede på ca. 17 px uden streg under, mens Lectios paneler har en titel på 14 px over en streg på 1 px.
- Heldagsbegivenheder står stadig i stiplede bokse med radius.
- Afleveringer: datoen står i en grå flise med radius, og titlerne bliver afkortet med "..." allerede ved ca. 25 tegn.
- Panelerne har forskellig højde, så der er et stort tomt felt under midterkolonnen.
- Fejl: en apostrof i et navn i lektieteksten vises som et dobbelt anførselstegn. Samme tekst og fejl ses på Lektier. Tjek afkodningen af HTML-entiteter i parseren.
- Lyst tema: én lektierække har en grå flade. Det er sandsynligvis en hover-tilstand, der er kommet med på skærmbilledet, for den ses ikke i mørkt tema.

### Skema
- Kendt fra plan 1: "Onsdagskolonnen var rykket ca. 20 px ned pga. en heldagsbegivenhed i timegitteret, og afholdte lektioner er tonet for meget ned (lav kontrast)."
  - **Status for forskydningen: stadig sand, og den er værre.** Den gælder nu alle dage med heldagsbegivenheder (mandag, tirsdag og onsdag i den viste uge). Deres lektioner og timelinjer står ca. 22 px under tidsaksen og under torsdag og fredag, så de vandrette linjer ikke flugter på tværs af dagene, og en lektion kl. 08:00 starter ud for ca. 08:20. Heldagsbegivenhederne skal have deres egen række over gitteret. Begge temaer.
  - **Status for kontrasten: ses ikke længere.** Hele den viste uge er afholdt, og alle lektioner har fuld kontrast (faget i mørk fed skrift og tid/lokale i grå). Skærmbilledet viser ingen kommende lektioner, så det kan ikke ses, om afholdte og kommende lektioner overhovedet adskilles nu.
- Lektionsblokkene har en pastelflade i hver sin fagfarve, en tyk farvet venstrekant og ca. 6 px radius. Det giver et regnbuegitter, og i mørkt tema bliver fladerne mudrede brune og vinrøde. Ugeændringer (restylet i plan 2) bruger neutrale celler.
- Panelet har ca. 14 px radius.
- Heldagsbegivenheder står i stiplede bokse med radius.
- Mærket "08:00" bliver stadig krydset af en kort gitterstreg.
- Overlappende lektioner om eftermiddagen bliver delt i smalle halve blokke, hvor faget afkortes med "...".
- "ændret" står som ravfarvet løbetekst. Det kunne være et lille firkantet tag ligesom de andre statusmærker.

### Lektier
- Stort, blødt panel med ca. 14 px radius og ca. 22 px luft.
- Fejl: apostroffen vises som et dobbelt anførselstegn (se Forside).
- Der er en tom linje (ca. 22 px) mellem lektieteksten og det første link i en lektie.
- Lange lektietekster vises som blå links over to linjer, der slutter med "...". Det er tungt. Kun titlen bør være et link, eller teksten bør afkortes til én linje.
- Citatblokken (fx spørgsmål til en tekst) bruger mindre skrift (ca. 12 px) end resten og en grå flade med radius. I mørkt tema er fladen lysere end panelet.
- Filterchipsene er firkantede og passer til retning D. De kan bruges som forbillede for Beskeder.

### Opgaver
- Stort, blødt panel med ca. 14 px radius.
- Listen er luftig, og hver opgave fylder ca. 65-90 px. Den bør være en tæt tabel som Lectios (frist, opgave, fag, elevtid og status) med rækker på ca. 32-40 px.
- Status ("venter på dig") er grå løbetekst og bør være et lille firkantet tag. I mørkt tema har den lav kontrast.
- Skillelinjerne mellem opgaverne går ca. 10 px længere til højre end stregen over "Afleveret".

### Beskeder
- Ingen af fundene fra plan 1 er rettet.
- Knappen ved siden af "Markér alle som læst" har stadig usynlig tekst: en mørk flade i lyst tema og en lys flade i mørkt tema. Begge temaer.
- Mappefiltrene er runde pills. Det valgte filter er sort i lyst tema og hvidt i mørkt tema i stedet for accentblåt. Feltet "Filtrér i mappen" er også en pill.
- Liste- og læsepanelet har ca. 12 px radius, og beskedteksten står i en indrammet boks med ca. 10 px radius.
- Der er tre rullebjælker ved siden af hinanden: én i listen, én i læsepanelet og sidens egen.
- Beskedtitlen er fed på ca. 22 px, hvilket er større end alle Lectios panelititler. Rækkerne i listen er ca. 90 px høje.

### Fravær
- Fanerne hopper: på Oversigt står titlen og fanerne ca. 28 px længere til venstre og ca. 17 px højere end på Fraværsårsager (Lectio-siden). Siden springer, når man skifter fane.
- Nøgletallene er venstrestillede tal på ca. 32 px uden panel her, men centrerede tal på ca. 24 px i et lille panel på Fraværsårsager. Vælg én form.
- Stort, blødt panel med ca. 14 px radius. Rækkerne er ca. 41 px høje, og tabelhovederne står i normal vægt, mens Lectios tabelhoveder er fede og grå.
- Data: brøken ved siden af procenten passer ikke på mindst ét hold, der har 0 i tælleren men en procent over 0. Bjælkerne ser ud til at være skaleret, så de er fulde ved 10 %, men det står ikke nogen steder. Tjek parseren mod Lectios tal.
- Der er mange tomme grå bjælker ved 0 %, og kolonnen Skriftligt blander "ingen" og "0,0 %".

### Karakterer
- parseGrades læser Gustavs karakterside forkert ("Hold: 7" i karakterkolonnen, ingen vægt, snit "-"). Fejlen fandtes i 1.7. Skal rettes med en test på den rigtige fixture før snit-simulatoren (7.3).
- Fejlen ses stadig i skærmbillederne. "Hold:" står med stor fed skrift i årskarakterkolonnen, og tallet står med lille grå skrift. Vægt er tom, og snittet er en stor fed streg. Fagkolonnen viser holdkoder i stedet for fagnavne, og samme hold står to gange uden at skelne mellem mundtlig og skriftlig.
- Fanerne hopper i forhold til Karaktermeddelelse (samme problem som Fravær).
- Stort, blødt panel med ca. 14 px radius, og rækkerne er ca. 47 px høje.

### Studieplan-kalender
- Hvert hold er stadig et stort, blødt kort med ca. 12-14 px radius i et gitter med tre kolonner. Kortene har forskellig højde, så gitteret får huller. Begge temaer.
- Korttitlerne er fede på ca. 17 px, og kortene har intet hoved med streg.
- Fanerne hopper i forhold til de restylede Lectio-faner (Undervisningsbeskrivelse, Kontaktbøger osv.). De står ca. 28 px længere til venstre og ca. 17 px højere.
- Siden bør være én tæt tabel med fag, hold, nuværende forløb, uger og fremdrift, hvor "Alle forløb" kan foldes ud.

### Opgaveside (ElevAflevering)
- Der er to panelstile på samme side. Topkortet har v1-look (ca. 14 px radius, ca. 32 px luft og en tyk venstrekant i fagfarven). "Aflevering og feedback" er Lectios restylede panel (ca. 4 px radius og en hovedlinje). Begge temaer.
- Status "Afleveret" er grøn fed småtekst i lyst tema og hvid i mørkt tema, og den står et par px højere end de andre værdier. Den skal være et lille firkantet tag med samme farve i begge temaer.
- Sidetitlen er den generelle "Opgaveaflevering", mens opgavens egen titel kun er fed på ca. 14 px. Opgavetitlen bør være sidens overskrift.
- Hovedhandlingen "Vælg dokument og send" har en lyseblå flade og ligner en deaktiveret knap. Den bør være fyldt accent.
- Tabelhovederne står centreret over venstrestillede kolonner, og dokumentikonet sidder helt op ad linkteksten.
- Godt: sidebredden og titlen følger Lectios sider.

### Lektionsside (aktivitetforside2)
- Siden består af to bløde kort med ca. 14 px radius, og topkortet har en tyk venstrekant i fagfarven. Begge temaer.
- "Lektier og materialer" har intet panelhoved. "Lektier og materialer" og "Lektier" står som to overskrifter i samme størrelse lige under hinanden.
- Oplysninger står to gange: faget står både i mærkelinjen og som titel, og holdet står både i mærkelinjen og i feltet Hold.
- Under feltrækken er der en løs skillelinje med ca. 30 px tom plads under.
- Lektieteksten er én lang, fed, blå link-blok over to linjer i en grå boks med radius.
- Godt: sidetitlen, fanerne og pilene følger Lectios sider, og pilene er firkantede.

## Mønstre til plan 3

1. **Ét sidehoved og én sidebredde.** Forside, Skema, Lektier, Opgaver, Beskeder, Fravær, Karakterer og Studieplan skal bruge samme beholder og sidetitel som Lectios sider (ca. 68-1196 px, titel ved y ≈ 153, faner lige under). Så hopper fanerne ikke længere mellem den egne visning og Lectio-siden (Fravær, Karakterer, Studieplan). Opgaveside og Lektionsside gør det allerede rigtigt.
2. **Panelet fra plan 2 overalt.** Det betyder kant på 1 px, ca. 4 px radius, et hoved med en fed titel på 14 px over en streg på 1 px og ca. 12-16 px luft. De store, bløde kort skal væk (Næste time, Studieplan-kortene og topkortene på Opgave- og Lektionsside), og det samme gælder de tykke venstrekanter i fagfarven. Overskrifter må ikke være større end sidetitlen (Næste time, beskedtitlen, nøgletallene).
3. **Tætte tabeller i stedet for luftige lister.** Opgaver, Fravær, Karakterer, Studieplan og listen i Beskeder skal følge samme tabelregel som Lectios sider: rækker på ca. 32-40 px, fede grå tabelhoveder og vandrette linjer på 1 px.
4. **Ingen pills, og status som tags.** Statusmærkerne (Forside, "venter på dig", "Afleveret", "ændret") skal være små firkantede tags med 3-4 px radius og samme farve i begge temaer. Mappefiltrene og filterfeltet i Beskeder skal være firkantede som filterchipsene i Lektier og Opgaver. Valgt tilstand og primærknapper er fyldt accent, ikke sort/hvid eller lyseblå.
5. **Fagfarver kun som små markører.** Fagfarverne bruges kun som prikker eller tynde streger, aldrig som flader (lektionsblokkene i Skema) eller tykke kortkanter. Én accentblå til links, valgt tilstand og hovedhandling.
6. **Data før stil.** Disse skal rettes, hver med en test på en rigtig fixture: parseGrades (Karakterer), brøken og procenten i Fravær, afkodningen af apostroffer og HTML-entiteter (Forside og Lektier) og heldagsrækken, der rykker dagene ned i Skema.
