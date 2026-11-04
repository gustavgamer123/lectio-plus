# Lectio+ 2.0, plan 5: Notifikationer, popup, "Nyt i 2.0" og udgivelse

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Notifikationer (spec 7.6) virker i baggrunden, popuppen er i D, eksisterende brugere får en kort "Nyt i 2.0", indstillingerne fra 1.x bevares, og version 2.0.0 er klar til Chrome Web Store.

**Spec:** afsnit 7.6, 9 og 10.

## Prøven (spec 7.6, "skal afprøves først") — gennemført 2026-11-04
- En service worker (`background.js`) med `host_permissions: ["https://www.lectio.dk/*"]` henter Forside og Beskeder med elevens cookies, **også uden en åben Lectio-fane**. Siderne læses i et offscreen-dokument (`offscreen.html`, reason `DOM_PARSER`) med de samme parsere som siderne.
- Chrome viser ingen nye tilladelsesadvarsler, og Lectio+ forbliver aktiveret: værtsadgangen er den samme som indholdsscriptets, `alarms` og `offscreen` giver ingen advarsel, og `notifications` ligger i `optional_permissions`.
- Reserveplanen ("hold en Lectio-fane åben") er derfor ikke nødvendig.
- Fund under prøven: `beskeder2.aspx` uden parameter giver den mappe, eleven sidst kiggede i. Lectio+ beder nu altid om Nyeste (`mappeid=-70`).

## Global Constraints
Alt fra plan 1 til 4. Desuden:
- Notifikationer er slået fra som standard. Når de tændes, beder popuppen om `notifications`, og teksten siger, at Lectio+ holder dig logget ind, så længe den henter i baggrunden.
- Baggrunden henter hvert 20. minut, kun når notifikationer er slået til, ikke når en Lectio-fane har været aktiv de sidste 2 minutter, og stopper ved log ud, ved udløbet session og når Lectio ikke har været åbnet i 3 dage.
- Ingen data forlader computeren.

## Tasks
1. **Baggrund og notifikationer:** `background.js` (alarm, hentning, ændringslog, notifikation pr. type, klik åbner siden), `offscreen.html/js`, `lp-bg` fra indholdsscriptet, log ud stopper. Test: `lp-poll-now` live med notifikationer slået til.
2. **Popup i D:** grupperne Udseende (tema), Sider (Lectio+, Forside, Skema, egne visninger), Fag (huskeliste), Notifikationer (hovedkontakt og de fire typer, status "Log ind på Lectio for at få notifikationer"), Om (version, data bliver hos dig). Popuppen er også indstillingssiden (`options_ui`). Kalenderen nævnes ikke.
3. **Nyt i 2.0:** vises én gang på den første Lectio-side efter opdateringen (`seen20` i sync). Kort liste over det nye med link til indstillingerne. Kan lukkes med knap og Esc.
4. **Indstillinger fra 1.x:** nøglerne er de samme (`enabled`, `theme`, `colors`, `hideDone`, `dashboard`, `skema`, `views`); `settingsVersion: 2` sættes ved opdatering. Test af at 1.x-værdier overlever.
5. **Udgivelse:** version 2.0.0, ny beskrivelse, README i extension/, zip i `dist/` (gitignored), tjekliste til Gustav (Web Store-tekst, test af aflevering og besked), og merge til main efter Gustavs ja.
