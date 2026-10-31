# Noter efter plan 1

Gennemgang af de 60 skærmbilleder i `shots/` (30 sider, 1280 px, lyst og mørkt tema), efter at topbjælken har erstattet sidemenuen. Topbjælken og fanerne er ikke vurderet. Mål er (ca.) aflæst på skærmbillederne.

## Kendte fund

- Dokumenter i 1024 px: Lectios eget panel er bredere end vinduet og bliver skåret af til højre (overflow-x: hidden fra 1.x).
- Karakterer: parseGrades læser Gustavs karakterside forkert ("Hold: 7" i karakterkolonnen, ingen vægt, snit "-"). Fejlen fandtes i 1.7. Skal rettes med en test på den rigtige fixture før snit-simulatoren (7.3).

## Sider

### Forside (forside.aspx)
- Statusmærkerne øverst til højre (valgfagsfrist, fravær) er runde pills. De skal være små firkantede tags. Begge temaer.
- "Næste time" er et stort, blødt kort med 32 px titel og meget luft (v1-look). Begge temaer.
- Alle paneler har ca. 12 px radius i stedet for ca. 4 px.
- Heldagsbegivenheder vises som stiplede bokse med radius.

### Skema (SkemaNy.aspx)
- Onsdagskolonnen er rykket ca. 20 px ned i forhold til tidsaksen, fordi en heldagsbegivenhed ligger inde i timegitteret i stedet for i heldagsrækken. Begge temaer.
- Timelinjerne kan ses gennem de halvgennemsigtige lektionsblokke, og mærket "08:00" bliver krydset af en linje.
- Afholdte lektioner er tonet så meget ned, at fag og lokale står i lys grå med for lav kontrast. Begge temaer.
- Panelet har ca. 14 px radius.

### Lektier (material_lektieoversigt.aspx)
- Ser fin ud. Det eneste er panelets radius på ca. 12 px, som går igen i alle egne visninger.

### Opgaver (OpgaverElev.aspx)
- Ser fin ud. Det eneste er panelets radius på ca. 12 px.

### Beskeder (beskeder2.aspx)
- Knappen ved siden af "Markér alle som læst" har usynlig tekst. Den er en mørk flade i lyst tema og en lys flade i mørkt tema, og teksten har samme farve som fladen.
- Mappefiltrene (Ulæste, Med flag, Nyeste osv.) er runde pills. Den valgte er sort i lyst tema og hvid i mørkt tema i stedet for blå.
- Primærknappen er sort/hvid i stedet for accentblå.
- Beskedteksten ligger i en indrammet boks med ca. 10 px radius. Liste- og læsepanelet har også stor radius.

### Fravær, Oversigt (subnav/fravaerelev.aspx)
- Ser fin ud. Det eneste er panelets radius på ca. 12 px.

### Fravær, Fraværsårsager (subnav/fravaerelev_fravaersaarsager.aspx)
- Tre store, bløde kort (ca. 14 px radius og ca. 40 px indvendig luft) med forskellig bredde, som ikke flugter. Begge temaer.
- Nøgletallene står centreret i stor, tynd skrift og passer ikke til de fede tal på Oversigt.
- Aktivitetskolonnen er Lectios grønne kursiv i lyst tema og hvid kursiv i mørkt tema.
- Tabelhovederne er blandede: de sorterbare er blå og resten grå.
- Tom tekst ("Ingen manglende ...") ligger i et kort med meget luft.

### Karakterer, Oversigt (grades/grade_report.aspx)
- Se Kendte fund (karakterkolonnen, vægten og snittet er forkerte).
- Panelet har ca. 12 px radius.

### Karakterer, Karaktermeddelelse (grades/grade_karakterblad.aspx)
- Stort, blødt kort med ca. 40 px luft. Kortet er ca. 800 px bredt, så højre del af siden står tom.
- Der er to tomme mellemrækker mellem tabelhovedet og første fag. I mørkt tema har den ene en lys, stiplet linje (Lectios gamle kant).
- Kanten under "Stamklasse:" går kun under etiketten og ikke under hele rækken.

### Studieplan, Kalender (studieplan.aspx?displaytype=ugeteksttabel)
- Hvert hold er et stort, blødt kort med ca. 12 px radius i et gitter med tre kolonner (v1-look). Kortene har forskellig højde, så gitteret får huller. Begge temaer.

### Studieplan, Undervisningsbeskrivelse (studieplan/undervisningsbeskrivelse.aspx)
- Mørkt tema: panelet har en lys, næsten hvid kant på 1 px.
- Mørkt tema: infotabellerne har en lysere flade end panelet, så det ligner kasser i en kasse.
- Lectios centrerede sidetitel ligger inde i panelet (skiferblå i lyst tema), og forløbstitlerne står i stor blå skrift. Det giver to overskriftsstile.

### Studieplan, Kontaktbøger (teacherstudybook.aspx?type=contactbooks)
- Tom tabel med kun hovedet og ingen tom tekst, i et lille kort med stor radius og meget luft. Begge temaer.

### Studieplan, Studieretning (studieretningElevValg.aspx)
- Gem, Annuller og Anvend er runde pills. I mørkt tema er de næsten usynlige (mørkeblå tekst uden flade).
- Studieretningspræsentationen er skolens egen HTML i Verdana med hvid tekst på lys petrol flade (for lav kontrast) i lyst tema. I mørkt tema bliver den en mørk kasse med kant.
- Kanten under "Nuværende studieretning:" går kun under etiketten.
- De to kort har forskellig bredde og stor radius.

### Studieplan, Valgfag (studieretningValgfag.aspx)
- Lectios flydende handlingsbjælke (Gem, Annuller, Anvend) i bunden er en rund pill med skygge. Den ligger halvgennemsigtigt oven på tabellen, så rækken under den kan ses igennem. I mørkt tema er knapteksten mørkeblå på mørk flade og ikke til at læse.
- Tabellen bruger mindre skrift (ca. 11-12 px) end resten af siden.
- Stort, blødt kort.

### Studieplan, Fagvalg (fagvalg/fagvalgoversigt.aspx)
- Kortet har ingen overskrift, men der er ca. 60 px tom plads over "Der er ingen data...". Stor radius. Begge temaer.

### Dokumenter (DokumentOversigt.aspx)
- Søg-knappen er en rund pill, og inputfelterne har ca. 8 px radius.
- Handlingslinkene (Ny fil, Ny mappe, Flyt) bruger Lectios petrolblå i stedet for accentblå. I mørkt tema er de næsten ulæselige, og "Rediger mappe" (deaktiveret) forsvinder helt.
- Mørkt tema: skillelinjen under værktøjslinjen er en lys, næsten hvid streg.
- Lectios gamle mappeikoner (gule og grå bitmaps) står i træet og i overskriften.
- Mørkt tema: fluebenet i afkrydsningsfeltet kan ikke ses.
- Stort kort med stor radius.

### Bøger (BD_UserReservations.aspx)
- Stort, blødt kort (ca. 14 px radius og ca. 40 px luft). Tabelrækkerne er ca. 43 px høje, så tabellen ikke er tæt.
- Tabelhovederne er blå (sorterbare links) i stedet for dæmpet grå.
- Mørkt tema: fluebenet i "Vis kun aktive" kan ikke ses.

### Spørgeskemaer (spoergeskema/spoergeskema_rapport.aspx)
- Tre store, bløde kort med ca. 40 px luft omkring tomme tabeller. Det fylder meget, selvom der ikke er noget indhold.
- "+ Opret spørgeskema" er Lectios petrolblå. I mørkt tema er den næsten ulæselig.
- Tabelhovederne er blå.
- Mørkt tema: fluebenet i "Vis kun aktuelle" kan ikke ses.

### Månedskalender (kalender.aspx)
- Månedsnavnene står centreret over tabellerne i tynd skrift på ca. 20 px (Lectios gamle stil), og der ligger en løs menuknap over hver.
- Rækkerne er høje (ca. 43 px for en tom dag), så tabellen ikke er tæt.
- Værktøjslinjen har to sæt pile (← og ‹ ›).
- Tabellerne fylder ikke bredden ud, så der er en tom stribe til højre.

### Dagsændringer (SkemaDagsaendringer.aspx)
- Lectios gamle skematabel står uændret. Den er smal (ca. 330 px), har grå gitterkanter om alle celler og tomme mellemrækker mellem modulparrene, har en centreret billedtekst og ligger ikke i et panel. Begge temaer.
- Lyst tema: den øverste række har Lectios cremefarvede baggrund.
- Resten af siden er tom.

### Ugeændringer (SkemaUgeaendringer.aspx)
- Lectios gamle skematabel med fuldt gitter, tomme mellemrækker og en centreret billedtekst ("Uge NN-ÅÅÅÅ"). Den ligger ikke i et panel. Begge temaer.
- Lyst tema: lektionerne står i Lectios grønne kursiv, og heldagsrækken er cremefarvet.
- Mørkt tema: lektionerne står i hvid kursiv, og linkene i heldagsrækken mister den blå linkfarve.

### Find skema, lærer (FindSkema.aspx?type=laerer)
- Hvert navn ligger i sin egen boks med kant og radius (Lectios gamle kolonneliste). Det virker tungt og bør være en tæt liste med tynde linjer. Begge temaer.
- Listen ligger ikke i et panel.

### Hovedmenu (default.aspx)
- Ét lille kort med stor radius og ca. 40 px luft, og resten af siden er tom.
- Punkttegnene er Lectios petrolblå og har en anden farve end linkene.

### Kontakt (default.aspx?menu=kontakt)
- Samme som Hovedmenu: lille, blødt kort, og punkttegnene er petrolblå.

### Hjælp (help/mainhelp.aspx)
- Der er et kort i et kort: den indre boks har skygge i lyst tema og en lys, næsten hvid kant i mørkt tema.
- Det ydre kort har ca. 60 px tom overskriftsplads øverst.

### Profil (indstillinger/studentIndstillinger.aspx)
- "Vis QR kode" (fyldt petrolblå), "Studiekort" (kontur) og "Gem" (lyseblå i lyst tema) er alle runde pills, men i tre forskellige stilarter.
- Hjælpeteksten under "Alternativ kontakt" står i Lectios petrolblå kursiv.
- Inputfelterne er ikke ens: ét har næsten ingen radius, og et andet har ca. 6 px.
- Store, bløde kort med meget luft.

### Betalinger (MinButik.aspx)
- Et lille kort med stor radius og ca. 40 px luft omkring én linje tom tekst. Begge temaer.

### Log (indstillinger/AdgangIndstillinger.aspx)
- Tabelrækkerne er ca. 55 px høje, så tabellen ikke er tæt.
- Slet-krydset er rødt i lyst tema og hvidt i mørkt tema.
- Tabelhovederne er blå.
- Stort, blødt kort.

### Studiekort (digitaltStudiekort.aspx)
- Lyst tema: kortet har en blød skygge og en grå flade, som ikke er panelfarven. Det har også stor radius.
- "Vis QR kode" er en rund pill i Lectios petrolblå. Begge temaer.
- Titlen "STUDIEKORT" står i tynd versalskrift.

### SPS (Elev_SPS.aspx)
- Tre store, bløde kort med ca. 40 px luft omkring korte tomme tekster. Kortene flugter ikke, fordi de har forskellig bredde og højde. Begge temaer.

## Mønstre

1. **Store, bløde kort overalt.** Lectios islands har ca. 12-14 px radius og ca. 40 px indvendig luft, og de egne visninger har ca. 12 px radius. Det gælder næsten alle sider. Reglen skal være: kant på 1 px, radius på ca. 4 px, tæt sidehoved og ca. 12-16 px luft. Tomme kort må ikke reservere plads til en overskrift, der ikke findes, og kort ved siden af hinanden skal flugte.
2. **Runde pill-knapper og -mærker.** Det gælder Lectios knapper (Gem, Annuller, Anvend, Søg, Vis QR kode, Studiekort), den flydende handlingsbjælke på Valgfag, mappefiltrene i Beskeder og statusmærkerne på Forside. Alle knapper skal have samme firkantede stil med ca. 4 px radius, og statusmærker skal være små firkantede tags.
3. **Lectios petrolblå som blå nummer to.** Lectios egen blå (#006493) ses stadig på handlingslinks, knapper, punkttegn og hjælpetekst. I mørkt tema er den ulæselig. Den skal altid erstattes af accentfarven.
4. **Hårde farver i mørkt tema.** Fluebenet i afkrydsningsfelter kan ikke ses, kanter og skillelinjer er lyse eller hvide (Hjælp, Undervisningsbeskrivelse, Dokumenter), og knaptekst er usynlig (Beskeder) eller næsten usynlig (deaktiverede knapper). Afkrydsningsfelter, kanter og knaptilstande skal gå gennem tokens i begge temaer.
5. **Lectios tabeller er ikke gjort ensartede.** Skematabellerne (Dags- og Ugeændringer) har fuldt gitter, grøn kursiv, creme baggrund, tomme mellemrækker og centrerede billedtekster. Andre tabeller har høje rækker (43-55 px), blandede blå og grå tabelhoveder, tomme mellemrækker og stiplede kanter. Én fælles tabelregel skal give vandrette linjer på 1 px, grå tabelhoveder, rækker på ca. 32 px og ingen tomme rækker eller stiplede kanter.
6. **Lectios gamle typografi og indhold i kanterne.** Det gælder centrerede sider- og månedstitler i tynd skrift, mappe-bitmaps, kolonnelister hvor hvert punkt er en boks, og skolens egen HTML i Verdana. Overskrifter skal følge sidehovedets skala, og Lectios ikoner og indlejret indhold skal tæmmes (skrift, farve og flade).
