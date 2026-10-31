# Lectio+ 2.0: design

Dato: 31. oktober 2026
Ejer: Gustav (2.g, Struer Statsgymnasium), som har lavet Lectio+
Udgangspunkt: Lectio+ 1.7.1, som ligger i Chrome Web Store. Mappen her er ikke et git-repo. På GitHub (gustavgamer123/lectio-plus) ligger samme version i undermappen `extension/` sammen med hjemmesiden.
Visuel reference: [2026-10-31-lectio-plus-2-retning-d.html](2026-10-31-lectio-plus-2-retning-d.html)

Punkter markeret **[mit valg]** blev besluttet af Claude under brainstormen og ikke af Gustav. De kan ændres.

---

## 1. Hvorfor

Lectio+ skal være noget elever faktisk får lyst til at bruge. Version 1.7 har to problemer, som Gustav selv peger på:

1. **Den ser for AI-agtig ud.** De bløde afrundede kort, de små pills og den rolige blågrønne farve ligner tusind andre apps.
2. **Den føles ikke bygget til Lectio.** Forsiden, skemaet og nogle få sider har fået deres eget design. Alle andre sider er bare gammelt Lectio med nye farver, så Lectios egne tabeller, knapper og formularer stikker igennem. Designet ved heller ikke rigtig hvad en skoledag, et modul eller et hold er.

2.0 skal løse begge dele: ét gennemført design på hele Lectio, der føles som om Lectio selv havde lavet et godt redesign. Oven i det kommer en række nye funktioner, der hjælper i en almindelig skoleuge.

## 2. Hvem

Gymnasieelever, der bruger Lectio på computeren i Chrome, Edge eller Brave. Lærere er ikke målgruppen. Lectio+ er lavet og testet på Struer Statsgymnasium, men skal virke på alle skoler der bruger Lectio. Det gør 1.7 allerede i dag, fordi siderne er bygget ens.

## 3. Mål, ikke-mål og anti-mål

**Mål**
- Hver eneste side en elev kan nå i Lectio har den samme stil, i både lyst og mørkt tema.
- Stilen er retning D, "Lectio gjort ordentligt" (se afsnit 5).
- Seks nye funktioner i 2.0.0 (afsnit 7.1 til 7.6). Kalenderen (7.7) kommer i en senere version.
- Alt fra 1.x, som hjemmesiden lover, virker stadig (afsnit 8).
- Dem der har 1.x i forvejen, får en tydelig og venlig overgang (afsnit 9).

**Ikke-mål**
- Hjemmesiden (gustavgamer123.github.io/lectio-plus). Den kommer senere, i et separat projekt.
- "Venner og ledige lokaler". Den blev foreslået og fravalgt.
- Kalenderen (7.7) er ikke med i 2.0.0. Gustav vil gerne have alt på én gang, men den venter, fordi den kræver en server og en ny privatlivspolitik. Den er beskrevet her, så designet tager højde for den.
- Lærervisning, en mobilapp, Firefox og Safari.
- At ændre noget i Lectio, som eleven ikke selv beder om.

**Anti-mål** (det ville være en fiasko, selvom det teknisk virker)
- Det er langsommere end Lectio, eller det gamle Lectio blinker frem, før det nye design kommer.
- Noget i Lectio holder op med at virke, fx at aflevere en opgave (også upload af filer), at sende eller besvare en besked, at udfylde et spørgeskema, at vælge valgfag eller at ændre profilindstillinger.
- Der er stadig sider, der ligner gammelt Lectio.
- Det ser generisk eller AI-agtigt ud igen: afrundede kort over det hele, pills, gradienter, store tomme flader.
- Eksisterende brugere bliver forvirrede over et nyt design uden nogen forklaring.
- Extensionen bliver slået fra hos eksisterende brugere ved opdateringen, fordi den beder om nye tilladelser (se afsnit 10).

## 4. Rammer

- Manifest V3. Den skal virke i Chrome, Edge og Brave.
- Al tekst i brugerfladen er på dansk, i et enkelt og direkte sprog.
- **Dine data bliver hos dig.** Alt hentes direkte fra lectio.dk på elevens egen computer og gemmes lokalt. Kalenderfunktionen er den eneste undtagelse, og den kræver et aktivt ja fra eleven (afsnit 7.7).
- Lectio behandler kun én forespørgsel ad gangen pr. bruger. Alle hentninger skal derfor gå gennem én kø, som de gør i 1.x (`fetchDoc` i content.js). Det gælder også baggrundshentningerne til notifikationer.
- Der må ikke være noget blink. Starten skal ske før siden tegnes, som `early.js` gør i dag, og indhold skal vises fra cache med det samme.
- Lectio er en ASP.NET WebForms-side. Knapper og links laver postbacks (`__doPostBack`), og formularer sendes med skjulte felter. Restyling må aldrig fjerne, flytte eller kopiere felter på en måde, så postbacks går i stykker. Til knapper bruger vi samme løsning som 1.x: man trykker på Lectios egen knap via en proxy (`data-proxy`).
- Tilgængelighed: alt kan nås med tastaturet, fokus kan altid ses, og kontrasten skal leve op til WCAG AA i begge temaer.
- Chrome Web Stores regler: ét formål, oplysning om databrug og en opdateret privatlivspolitik, før kalenderfunktionen udgives.
- **[mit valg]** Der er stadig ikke noget build-trin. Koden er almindelig JavaScript og CSS, som manifestet indlæser direkte. Den må gerne deles op i flere filer, som indlæses i rækkefølge via `content_scripts` i manifestet.

## 5. Designretning D: "Lectio, gjort ordentligt"

Gustav valgte retningen efter at have set fire bud side om side: Kvadreret, Infotavle, Farvekoder og D. Han kunne også lide hæfte-retningen (Kvadreret), men valgte den fra til fordel for ren D.

**Kendetegn (besluttet)**
- **Lectios opbygning bevares.** Menuen ligger som faner foroven, og siderne hedder det samme som i Lectio: Forside, Skema, Lektier, Opgaver, Beskeder, Fravær og Karakterer. Man skal kunne genkende alt.
- **Tæt og stramt.** Der er mere på skærmen end i 1.x, og tingene er lagt op som et værktøj, ikke som en app.
- Tiderne står på lige linje i en fast bredde. Tabeller og lister har tynde streger. Status vises som små firkantede mærker ("Mangler", "ændret", "fre 23:59").
- Der er én blå accentfarve. Rød og rav bruges kun til status.
- Paneler har en tynd kant og en lille radius (cirka 4 px). Der er ingen skygger, undtagen på ting der ligger ovenpå, som søgning og lektionspanelet.

**Udgangspunkt for farver og skrift** (fra mockuppen; builderen finjusterer)
- Lyst tema: blå `#1b5ea8`, tekst `#1d2733`, dæmpet tekst `#66717f`, streger `#e1e6ec`, baggrund `#f3f5f8`, flader `#ffffff`, rød `#c42b1c`, rav `#a35a00`, markering af igangværende række `#eef4fb`.
- Mørkt tema: det designer builderen ud fra de samme roller. Det skal være lige så gennemarbejdet og ikke bare en invertering.
- **[mit valg]** Skriften er IBM Plex Sans til tekst og IBM Plex Mono til tider, lokaler og tastaturgenveje. Begge pakkes med i extensionen som woff2 (OFL-licens), ligesom Schibsted Grotesk er i dag, og de erstatter den.
- **[mit valg]** Fagfarver bevares, fordi hjemmesiden lover "egen farve til hvert fag". De vises som en lille firkant ved fagets navn og som en stribe på 3 px i venstre side af modulerne i ugeskemaet. Fagfarverne må aldrig blive den dominerende farve på en side.

## 6. Skal, navigation og sider

**Skallen (alle sider)**
- En blå topbjælke med ordmærket "Lectio+", et søgefelt ("Søg", Ctrl+K eller /), elevens navn og klasse, en knap til tema og en knap til Lectios visning.
- En fanerække under den: Forside, Skema, Lektier, Opgaver, Beskeder (med antal ulæste), Fravær, Karakterer og "Mere". "Mere" åbner en liste med Studieplan, Dokumenter og grupperne fra `NAV_MORE` i 1.x (Skema og kalender, Studie, Dig, Lectio).
- Den aktive fane er markeret med en blå streg under.
- Hvis en Lectio-side selv har underfaner (fx under Fravær), vises de som en fanerække i niveau to i samme stil.
- I smalle vinduer kan fanerne rulles vandret. Der må ikke komme vandret rulning af hele siden.
- **[mit valg]** Sidemenuen fra 1.x til venstre forsvinder.

**Sider**
Alle sider en elev kan nå under `/lectio/<skole>/` skal have stilen. Det gælder som minimum:
- Forside, Skema (ugeskema), Lektier, Opgaver, den enkelte opgave og aflevering (`ElevAflevering.aspx`), den enkelte lektion (`aktivitet/aktivitetforside2.aspx`), Beskeder (indbakke, tråd, ny besked og svar), Fravær med underfaner og fraværsårsager, Karakterer og karaktermeddelelse, Studieplan og undervisningsbeskrivelse.
- Alle sider i `NAV_MORE`: Dags- og ugeændringer, Månedskalender, Find skema (alle typer og avanceret), Kontaktbøger, Studieretning, Valgfag, Fagvalg, Bøger, Spørgeskemaer (oversigt og besvarelse), SPS, Studiekort, Profil og indstillinger, Betalinger, Log, Hovedmenu, Kontakt og Hjælp.
- Dokumenter, med mapper og filer.
- Skema-sider for andre (lærer, lokale, hold, klasse og elev) når man finder dem via Find skema.
- **[mit valg]** Login-siden og listen over skoler bør også have stilen, men har lav prioritet. Content scriptet stopper i dag, når man ikke er logget ind.

**Krav til hver side**
Når man åbner siden i lyst og mørkt tema, er der ingen synlige rester af gammelt Lectio: Lectios skrift, gamle knapper, gamle tabeller, blå gradienter eller hvide flader i mørkt tema. Alt, hvad man kunne gøre på siden før, kan man stadig gøre.

**[mit valg] Sider der ikke kan nås lige nu.** Nogle sider kan kun ses i bestemte perioder, fx Valgfag og Fagvalg uden for valgperioden, et spørgeskema når der ikke er nogen åbne, SPS og Betalinger. De styles via de fælles regler for tabeller, formularer, knapper og faner, og tjekkes når de er tilgængelige. Det blokerer ikke for at udgive.

**[mit valg] Rigtige handlinger under test.** Builderen afleverer aldrig opgaver, sender eller besvarer aldrig beskeder, udfylder aldrig spørgeskemaer og ændrer aldrig valg eller indstillinger i Lectio. Den slags afprøver Gustav selv, ud fra en tjekliste.

Builderen vælger for hver side, om den skal have sin egen visning (som forsiden i 1.x) eller om Lectios egen opmærkning skal styles om. Tommelfingerreglen er: sider der mest viser data, kan få egne visninger, mens sider med formularer, upload eller postbacks styles om på stedet.

## 7. Nye funktioner

Gustav valgte funktion 1 til 7. Placeringen er Claudes forslag, og Gustav har ikke rettet i den. 7.1 til 7.6 kommer med i 2.0.0. 7.7 kommer senere.

### 7.1 Hvad er ændret?
- **Hvor:** øverst på Forsiden.
- **Hvad:** en liste over det der er nyt siden sidste besøg, med tidspunktet for sidste besøg. Det kan være moduler der er flyttet til et andet lokale, aflyste eller ændrede moduler, nye eller ændrede lektier, nye opgaver, ændrede frister og nye beskeder. Hver linje fører hen til det den handler om. Listen kan markeres som set.
- **Hvordan:** et øjebliksbillede af skemaet (denne og næste uge), opgaver, lektier og beskeder gemmes lokalt og vedvarende i `chrome.storage.local` pr. skole og elev. Det sammenlignes med de friske data. Første gang gemmes der kun et udgangspunkt, og der vises ingen liste.
- **[mit valg] Én fælles ændringslog.** Hver gang der hentes friske data, sammenlignes de med øjebliksbilledet. Hvis der er forskelle, skrives de i en fælles log, og øjebliksbilledet opdateres. Det gælder både når eleven besøger en side, og når der hentes i baggrunden. 7.1, 7.5 ("ændringer for dagen") og 7.6 læser alle fra den samme log.
- **[mit valg] Hvornår forsvinder en linje?** En linje bliver stående, indtil eleven trykker "Marker som set", eller indtil den ikke længere er relevant, fx fordi modulet er slut eller fristen er overstået. Det skal ikke ske ved en almindelig genindlæsning. Ændringer der allerede er sendt som notifikation, vises også, for man kan have overset notifikationen. "Sidste besøg" er tidspunktet for sidste "Marker som set".

### 7.2 Fraværsberegner
- **Hvor:** på Fravær-siden.
- **Hvad:** eleven vælger en dag eller enkelte moduler i de kommende to uger og ser for hvert hold, hvad fraværet ville blive: fra x % til y %, og samlet. Eleven kan også vælge en opgave og se hvad det ville betyde for det skriftlige fravær, hvis den ikke bliver afleveret. Elevtimerne kommer fra opgavelisten.
- Resultatet vises som et skøn ("ca."), fordi Lectios egen opgørelse kan afvige. Fraværstabellen har både en kolonne for "opgjort" og en for "hele året". Builderen undersøger hvilke tal `parseAbsence` læser, og regner ud fra opgjort fravær.

### 7.3 Snit-simulator
- **Hvor:** på Karakterer-siden, direkte i tabellen.
- **Hvad:** man klikker på en karakter og vælger en anden på 7-trinsskalaen (-3, 00, 02, 4, 7, 10, 12). Man kan også give et fag uden karakter en forventet karakter. Det vægtede snit regnes om med det samme, og forskellen vises. Det skal være tydeligt, når man ser simulerede tal, og der skal være en knap til at nulstille.
- Vægtningen bruger vægt-kolonnen fra Lectio, ligesom 1.x gør i `renderGradesView`.
- **[mit valg] To snit.** Hovedtallet er snittet på beviset. Det tager både årskarakterer og eksamenskarakterer med, hver med sin egen vægt fra Lectio, og kun der hvor der står en tal-karakter. Snittet af årskarakterer alene, som 1.x viser i dag, står ved siden af som tal nummer to. Både årskarakter og eksamenskarakter kan klikkes og simuleres.
- **[mit valg]** Simulerede karakterer gemmes ikke, når man forlader siden.

### 7.4 Travle uger
- **Hvor:** øverst på Opgaver-siden.
- **Hvad:** en tidslinje over de næste 8 uger. For hver uge vises antal afleveringer og summen af elevtimer for de opgaver, der ikke er afleveret, som en søjle. Den travleste uge er fremhævet. Klikker man på en uge, filtreres listen nedenunder.

### 7.5 Klar til i morgen
- **Hvor:** Forsiden skifter til denne visning om aftenen.
- **Hvad:** næste skoledag (efter en fredag er det mandag). Den viser hvornår og hvor du møder (første modul og lokale), hvor mange moduler du har, og hvornår du har fri. Derudover lektierne med flueben, ændringer for dagen og din huskeliste.
- **Huskeliste:** eleven skriver selv ting til et fag, fx "idrætstøj" til idræt og "kittel" til kemi. Tingene vises når faget er på skemaet næste skoledag. Huskelisten kan redigeres fra Forsiden og i indstillingerne.
- **[mit valg]** Forsiden skifter, når dagens sidste modul er slut. Er der ingen moduler i dag, vises næste skoledag hele dagen.

### 7.6 Notifikationer
- **Hvad:** Chrome-notifikationer, også når Lectio ikke er åben (men Chrome kører), ved fire ting: et modul i dag eller næste skoledag skifter lokale, et modul bliver aflyst eller ændret, der kommer en ny besked, og en frist er om 24 timer. Hver type kan slås til og fra for sig. Klikker man på en notifikation, åbnes den rigtige side i Lectio.
- **Hvordan:** en ny service worker i baggrunden henter fra lectio.dk med elevens egne cookies med jævne mellemrum, via `chrome.alarms`. Skole-id og andre nødvendige oplysninger gemmes fra content scriptet, når eleven bruger Lectio.
- Hvis eleven er logget ud af Lectio, stopper notifikationerne stille. Popuppen viser så "Log ind på Lectio for at få notifikationer".
- Notifikationer er slået fra som standard og tændes i popuppen.
- **Risiko, skal afprøves først:** det er ikke sikkert, at Lectio-sessionen holder længe nok, eller at cookies kommer med i baggrundshentninger. Builderen laver en lille prøve, før funktionen bygges færdig.
- **[mit valg] Hvis prøven ikke holder:** så kommer notifikationerne kun, mens der er en Lectio-fane åben i Chrome. Fanen må gerne ligge i baggrunden. Popuppen forklarer det med en linje som "Hold en Lectio-fane åben for at få notifikationer".
- **[mit valg] Hvornår baggrundshentningen kører og stopper:**
  - Den kører, når notifikationer eller kalenderen er slået til. Kalenderen har brug for den for at holde linket opdateret, også når eleven ikke åbner Lectio.
  - Den stopper, når eleven logger ud via Lectios log ud-knap, og når Lectio ikke har været åbnet i 3 dage.
  - Det skal stå i teksten, når man tænder for funktionen, at Lectio+ holder dig logget ind, så længe den kører. Det betyder noget på en computer man deler med andre.

### 7.7 Skema i din kalender (kommer efter 2.0.0)
- **Hvad:** eleven får et abonnementslink (iCalendar), der virker i både iPhone-kalenderen og Google Kalender og opdaterer sig selv. Det indeholder skemaet med fag, lokale og lærer, så aflyste moduler kan ses. **[mit valg]** Det dækker indeværende uge plus 4 uger frem, og afleveringsfrister kommer med som begivenheder.
- **Samtykke (besluttet af Gustav):** der må gerne være en server, men funktionen er slået fra, indtil eleven selv tænder den. Når den tændes, står det tydeligt, at skemaet bliver sendt til en server og gemt der, og hvad det betyder: alle med linket kan se skemaet. Eleven skal aktivt sige ja.
- **Hvordan:** extensionen sender skemaet til serveren, hver gang den har friske skemadata, både fra besøg og fra baggrundshentninger. Serveren gemmer kun skemadata under et tilfældigt, hemmeligt token (mindst 128 bit), og ikke elevens navn. Slår eleven funktionen fra, slettes data på serveren. Eleven kan også lave et nyt link, så det gamle holder op med at virke.
- Popuppen viser linket, en kopiér-knap, en QR-kode til telefonen og en kort vejledning til iPhone og Google.
- Hvilken teknik serveren bruger, bestemmer builderen. Et forslag er Cloudflare Workers med KV, som har et gratis niveau.
- **[mit valg] Ikke afgjort endnu:** hvis konto serveren kører på, hvilken adresse den får, og hvem der sætter den op. Det afklares med Gustav, når kalenderen skal bygges. Forslaget er Gustavs egen gratis Cloudflare-konto med en gratis workers.dev-adresse og intet betalingskort.
- Før udgivelse skal privatlivspolitikken og oplysningerne om databrug i Chrome Web Store opdateres. Privatlivspolitikken ligger på Gustavs hjemmeside. Claude skriver et udkast, og Gustav lægger det op. Hjemmesiden siger i dag "ingen server", så den formulering skal også ændres.

## 8. Det der skal med fra 1.x

Det er ting som hjemmesiden og README lover, eller som brugerne har i dag:
- Næste modul og lokale står stort på Forsiden, og ændrede eller aflyste moduler er lette at se.
- Ugeskemaet er opdelt efter tid, med en streg der viser hvor langt dagen er nået. Man skifter uge med Alt+venstre og Alt+højre.
- Klikker man på et modul, åbnes lektionspanelet med lektier, note, lokale og lærer, uden at man skifter side. Man bladrer mellem lektioner med piletasterne.
- Egne farver til fagene.
- Opgaver er grupperet i Mangler, Kommende og Afleveret. Fristerne skifter farve, når de nærmer sig. Man kan filtrere efter fag, og der står elevtimer og noter.
- Lektier har flueben, som gemmes. Indstillingen der skjuler færdige opgaver (`hideDone`) virker stadig.
- Beskeder vises som en indbakke med læsepanel.
- Studieplanen viser forløb pr. hold.
- Mørkt tema, der følger computerens indstilling, eller som man selv vælger.
- Søgning med Ctrl+K eller / efter sider, fag, opgaver og lektier.
- Ét klik tilbage til Lectios egen visning: en knap i skallen, et link på hver egen visning og `?lp=orig`.
- Indstillinger pr. funktion i popuppen.

## 9. Udrulning til eksisterende brugere

- Versionen bliver 2.0.0 og udgives som en almindelig opdatering i Chrome Web Store. Alle får det nye design med det samme.
- Første gang eleven åbner Lectio efter opdateringen, vises en kort "Nyt i 2.0" én gang. Den viser det nye design og de nye funktioner med et link til indstillingerne, og den kan lukkes. Den nævner kun det, der faktisk er med i 2.0.0, og altså ikke kalenderen.
- Indstillingerne fra 1.x overføres: `enabled`, `theme`, `colors`, `hideDone`, `dashboard`, `skema` og `views` kobles til de nye indstillinger med samme betydning.
- Knappen tilbage til Lectios visning bliver.
- Popuppen med indstillinger får det nye design og samles i grupperne Udseende, Sider, Fag (farver og huskeliste), Notifikationer, Kalender og Om.

## 10. Tilladelser

Nye tilladelser, der giver en advarsel, får Chrome til at slå extensionen fra hos eksisterende brugere, indtil de godkender. Det må ikke ske (se anti-mål).
- `notifications` lægges i `optional_permissions` og bedes om, når eleven tænder notifikationer.
- `alarms` giver ingen advarsel og må gerne ligge i `permissions`.
- Adgangen til lectio.dk er allerede dækket af content scripts. Builderen tjekker, at `host_permissions` til service workeren ikke giver en ny advarsel.
- Kalenderserveren nås enten via CORS, der tillader extensionens origin, eller via `optional_host_permissions`, som der bedes om når kalenderen tændes. Det bliver først aktuelt, når kalenderen kommer.

## 11. Test og adgang til Lectio

Besluttet af Gustav:
- Builderen har ikke sit eget elev-login. Builderen åbner et browservindue, den selv kan styre (Playwright), og Gustav logger selv ind i det. Builderen ser aldrig Gustavs adgangskode. Mens Gustav er logget ind, kan builderen åbne og gemme Lectio-siderne og tjekke designet på dem i lyst og mørkt tema.
- Handlinger der rammer rigtige mennesker, tester Gustav selv ud fra en tjekliste, som builderen laver. Det gælder fx at aflevere en opgave, sende en besked, udfylde et spørgeskema og ændre valg eller indstillinger (se også afsnit 6).
- Andre skoler kan ikke testes direkte. Builderen holder sig derfor til Lectios fælles opbygning og undgår at bygge på noget, der er særligt for Struer Statsgymnasium.

## 12. Overladt til builderen

- De præcise farver, størrelser og afstande, og hele det mørke tema, inden for retning D.
- Listen over komponenter og hvordan de ser ud i detaljer.
- Layoutet på hver side, og om siden får sin egen visning eller styles om på stedet (se tommelfingerreglen i afsnit 6).
- Hvordan koden deles op i filer, og hvordan den testes.
- Hvor tit notifikationerne henter. De skal tage hensyn til Lectios ene forespørgsel ad gangen.
- Teknikken bag kalenderserveren.
- Rækkefølgen siderne og funktionerne bygges i. Skallen og designsystemet skal dog komme først, fordi alt andet bygger på dem.
