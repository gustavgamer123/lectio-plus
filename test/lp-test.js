(() => {
  ['lp-pill','lp-side','lp-topbar','lp-scrim','lp-app','lp-palette','lp-drawer','lp-test-css','lp-shell-head','lp-afl','lp-act-hero'].forEach((id) => document.getElementById(id)?.remove());
  document.documentElement.classList.remove('lp-lite');
  const s = document.createElement('style'); s.id = 'lp-test-css'; s.textContent = "/* ============ Lectio+ ============ */\nhtml.lp-on, html.lp-lite, #lp-pill {\n  --bg: #f3f4f1;\n  --surface: #ffffff;\n  --sunk: #f6f7f4;\n  --ink: #1c1f1e;\n  --ink-2: #5d6461;\n  --ink-3: #8c928f;\n  --rule: #e1e4df;\n  --accent: #13566b;\n  --accent-soft: #e4eff1;\n  --warn: #94570a;\n  --danger: #b3261e;\n  --ok: #2e7350;\n  --tint-l: 95%;\n  --tint-s: 45%;\n  --dot-l: 46%;\n  --side: 224px;\n  --font: \"LP Schibsted\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;\n}\nhtml[data-lp-theme=\"dark\"].lp-on, html[data-lp-theme=\"dark\"].lp-lite, html[data-lp-theme=\"dark\"] #lp-pill {\n  --bg: #111413;\n  --surface: #191d1c;\n  --sunk: #151817;\n  --ink: #e4e7e3;\n  --ink-2: #a0a7a3;\n  --ink-3: #737a77;\n  --rule: #2a302e;\n  --accent: #74b9c8;\n  --accent-soft: #1b2d31;\n  --warn: #e3a646;\n  --danger: #ef7d70;\n  --ok: #72c494;\n  --tint-l: 17%;\n  --tint-s: 22%;\n  --dot-l: 62%;\n}\n\n/* ---------- Lectios egne sider ---------- */\nhtml.lp-on body {\n  background: var(--bg) !important;\n  color: var(--ink);\n  font-family: var(--font) !important;\n  padding-left: var(--side) !important;\n  -webkit-font-smoothing: antialiased;\n}\nhtml.lp-on body *:not([class*=\"material\"]):not([class*=\"fonticon\"]):not(.material-icons):not(.material-symbols-outlined) { font-family: inherit; }\nhtml.lp-on .ls-fonticon { font-family: ls-font-icons !important; }\nhtml.lp-on .helptip-wrap,\nhtml.lp-on #s_m_HeaderContent_subnavigator_generic_tr,\nhtml.lp-on #s_m_HeaderContent_picctrlthumbimage,\nhtml.lp-on #s_m_masterFooter,\nhtml.lp-on .ls-master-footer,\nhtml.lp-on #s_m_masterHeaderDiv,\nhtml.lp-on #s_m_mastermenu,\nhtml.lp-on .ls-mobil-bottom-menu,\nhtml.lp-on #mobilMereSheetMenu { display: none !important; }\nhtml.lp-on #masterContent { background: transparent !important; max-width: none !important; }\nhtml.lp-on .outerContentFrame { background: transparent !important; padding: 20px 28px 48px !important; }\nhtml.lp-on .ls-master-pageheader {\n  background: transparent !important; border: 0 !important; box-shadow: none !important; padding: 4px 0 12px !important; margin-bottom: 12px !important;\n  border-bottom: 1px solid var(--rule) !important; width: auto !important;\n}\nhtml.lp-on .ls-master-pageheader img { display: none !important; }\nhtml.lp-on .maintitle { font-size: 24px !important; font-weight: 700 !important; color: var(--ink) !important; letter-spacing: -.015em; }\nhtml.lp-on .ls-subnav-container a, html.lp-on .ls-subnav1 a {\n  padding: 4px 10px !important; color: var(--ink-2) !important; text-decoration: none !important; background: transparent !important;\n  border: 0 !important; border-radius: 6px !important; font-weight: 500;\n}\nhtml.lp-on .ls-subnav-container a:hover { color: var(--ink) !important; background: var(--sunk) !important; }\nhtml.lp-on .ls-subnav-container a[class*=\"active\"], html.lp-on .ls-subnav-container a[aria-current] { color: var(--accent) !important; box-shadow: inset 0 -2px 0 var(--accent); border-radius: 0 !important; }\nhtml.lp-on a { color: var(--accent); }\nhtml.lp-on .lf-island, html.lp-on .ls-island-filled, html.lp-on .islandContent, html.lp-on .islandHeaderContainer {\n  background: var(--surface) !important; border-color: var(--rule) !important; border-radius: 12px; box-shadow: none !important;\n}\nhtml.lp-on .islandHeaderContainer { border-bottom: 1px solid var(--rule) !important; border-radius: 12px 12px 0 0; }\nhtml.lp-on .lf-grid, html.lp-on .ls-table-layout1, html.lp-on .ls-table-layout2, html.lp-on .ls-table-layout5 {\n  background: var(--surface) !important; color: var(--ink) !important; border: 0 !important; border-collapse: collapse !important;\n}\nhtml.lp-on .lf-grid tr, html.lp-on .ls-table-layout2 tr, html.lp-on .ls-table-layout5 tr { background: transparent !important; }\nhtml.lp-on .lf-grid th, html.lp-on .ls-table-layout2 th, html.lp-on .ls-table-layout5 th, html.lp-on .ls-table-layout1 th {\n  background: var(--surface) !important; color: var(--ink-2) !important; font-weight: 600 !important; font-size: 13px !important;\n  border: 0 !important; border-bottom: 1px solid var(--rule) !important; padding: 10px 12px !important; text-align: left;\n}\nhtml.lp-on .lf-grid td, html.lp-on .ls-table-layout2 td, html.lp-on .ls-table-layout5 td, html.lp-on .ls-table-layout1 td {\n  border: 0 !important; border-bottom: 1px solid var(--rule) !important; padding: 10px 12px !important;\n  background: transparent !important; color: inherit !important; vertical-align: top;\n}\nhtml.lp-on .lf-grid tr:hover td { background: var(--sunk) !important; }\nhtml.lp-on input[type=\"text\"], html.lp-on input[type=\"search\"], html.lp-on input[type=\"password\"], html.lp-on select, html.lp-on textarea {\n  border: 1px solid var(--rule) !important; border-radius: 8px !important; padding: 6px 10px !important;\n  background: var(--surface) !important; color: var(--ink) !important;\n}\nhtml.lp-on input[type=\"submit\"], html.lp-on input[type=\"button\"], html.lp-on .button, html.lp-on .lec-button { border-radius: 8px !important; }\nhtml.lp-on[data-lp-theme=\"dark\"] .outerContentFrame :is(td, th, span, div, p, label, h1, h2, h3, h4, li, b, strong) { color: var(--ink); }\nhtml.lp-on[data-lp-theme=\"dark\"] .outerContentFrame :is(div, section, td, span, table)[style*=\"background\"] { background-color: transparent !important; }\nhtml.lp-on[data-lp-theme=\"dark\"] .lp-dk-bg { background-color: var(--sunk) !important; background-image: none !important; border-color: var(--rule) !important; }\nhtml.lp-on[data-lp-theme=\"dark\"] .lp-dk-fg { color: var(--ink) !important; }\nhtml.lp-on[data-lp-theme=\"dark\"] .lp-dk-link { color: var(--accent) !important; }\nhtml.lp-on[data-lp-theme=\"dark\"] .outerContentFrame img:not([src*=\".svg\"]):not([class*=\"icon\"]) { opacity: .9; }\nhtml.lp-on[data-lp-theme=\"dark\"] .s2skema, html.lp-on[data-lp-theme=\"dark\"] .s2skema td { background-color: var(--surface) !important; border-color: var(--rule) !important; }\n\n/* opgaveside */\nhtml.lp-hide-done .lp-row-done { display: none !important; }\nhtml.lp-on .lp-row-missing td:first-child { box-shadow: inset 3px 0 0 var(--danger); }\nhtml.lp-on .lp-row-done td { color: var(--ink-3) !important; }\n.lp-rel { display: block; color: var(--ink-2); font-size: 12px; margin-top: 2px; }\n.lp-toolbar { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; margin: 6px 0 12px; font: 14px var(--font); color: var(--ink); }\n.lp-toolbar b { font-weight: 700; }\n.lp-switch { display: inline-flex; align-items: center; gap: 8px; margin-left: auto; color: var(--ink-2); cursor: pointer; }\n.lp-switch input { position: absolute; opacity: 0; width: 0; height: 0; }\n.lp-switch i { position: relative; width: 32px; height: 18px; border-radius: 99px; background: var(--rule); transition: background .15s; }\n.lp-switch i::after { content: \"\"; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .15s; }\n.lp-switch input:checked + i { background: var(--accent); }\n.lp-switch input:checked + i::after { transform: translateX(14px); }\n.lp-switch input:focus-visible + i { outline: 2px solid var(--accent); outline-offset: 2px; }\n\n/* status i opgavetabel */\n.lp-chip { font: 600 12.5px var(--font); color: var(--ink-2); }\n.lp-chip.is-ok { color: var(--ok); }\n.lp-chip.is-warn { color: var(--warn); }\n.lp-chip.is-danger { color: var(--danger); }\n\n/* ---------- f\u00e6lles for vores egne flader ---------- */\n#lp-side, #lp-app, #lp-palette, #lp-modal, #lp-topbar, #lp-pill { text-align: left; font-family: var(--font); color: var(--ink); line-height: 1.45; }\n#lp-side *, #lp-app *, #lp-palette *, #lp-modal *, #lp-topbar * { box-sizing: border-box; text-align: inherit; }\n#lp-side svg, #lp-app svg, #lp-palette svg, #lp-modal svg, #lp-topbar svg { width: 18px; height: 18px; flex: none; }\n#lp-app :focus-visible, #lp-side :focus-visible, #lp-modal :focus-visible, #lp-palette :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\n.lp-muted { color: var(--ink-2); }\n.lp-sd { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: hsl(var(--h, 200) 55% var(--dot-l)); margin-right: 8px; flex: none; vertical-align: 1px; }\n\n/* ---------- sidemenu ---------- */\n#lp-side {\n  position: fixed; inset: 0 auto 0 0; width: var(--side); z-index: 9000; display: flex; flex-direction: column;\n  background: var(--surface); border-right: 1px solid var(--rule); padding: 20px 12px 14px; transition: transform .2s ease;\n}\n.lp-brand { padding: 0 10px 18px; }\n.lp-brand-txt { display: flex; flex-direction: column; min-width: 0; }\n.lp-brand-txt strong { font-size: 20px; font-weight: 700; letter-spacing: -.02em; line-height: 1.1; }\n.lp-brand-txt strong span, #lp-topbar strong span, #lp-pill span { color: var(--accent); }\n.lp-brand-txt small { font-size: 12.5px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }\n.lp-search-btn {\n  display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 10px; margin-bottom: 14px; border-radius: 8px;\n  border: 1px solid var(--rule); background: var(--sunk); color: var(--ink-2); font: 500 14px var(--font); cursor: pointer;\n}\n.lp-search-btn:hover { color: var(--ink); }\n.lp-search-btn span { flex: 1; }\n#lp-side kbd, #lp-palette kbd { font: 500 11px var(--font); padding: 1px 5px; border-radius: 4px; border: 1px solid var(--rule); color: var(--ink-3); background: var(--surface); }\n.lp-nav { display: flex; flex-direction: column; gap: 1px; overflow-y: auto; flex: 1; }\n.lp-nav-item {\n  position: relative; display: flex; align-items: center; gap: 11px; padding: 7px 10px; border-radius: 7px; color: var(--ink-2) !important;\n  text-decoration: none !important; font: 500 14.5px var(--font);\n}\n.lp-nav-item svg { color: var(--ink-3); }\n.lp-nav-item:hover { color: var(--ink) !important; background: var(--sunk); }\n.lp-nav-item.is-active { color: var(--ink) !important; font-weight: 600; background: var(--accent-soft); }\n.lp-nav-item.is-active svg { color: var(--accent); }\n.lp-nav-item span { flex: 1; }\n.lp-badge { min-width: 18px; padding: 0 5px; border-radius: 9px; background: var(--accent); color: var(--surface); font: 700 11px/18px var(--font); text-align: center !important; }\n.lp-nav-sep { height: 1px; background: var(--rule); margin: 10px; }\n.lp-side-foot { border-top: 1px solid var(--rule); padding-top: 12px; display: flex; align-items: center; gap: 8px; }\n.lp-me { display: flex; align-items: center; gap: 10px; padding-left: 4px; min-width: 0; flex: 1; }\n.lp-me > div:last-child { display: flex; flex-direction: column; min-width: 0; }\n.lp-me strong { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-me small { font-size: 12px; color: var(--ink-3); }\n.lp-me .lp-avatar { display: none; }\n.lp-foot-actions { display: flex; gap: 2px; }\n.lp-icon-btn {\n  display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 7px; border: 0; background: transparent;\n  color: var(--ink-3) !important; cursor: pointer; text-decoration: none !important;\n}\n.lp-icon-btn:hover { color: var(--ink) !important; background: var(--sunk); }\n#lp-topbar, #lp-scrim { display: none; }\n\n/* ---------- overblik ---------- */\nhtml.lp-takeover #s_m_outerContentFrameDiv, html.lp-takeover .ls-master-footer, html.lp-takeover #s_m_masterfooter { display: none !important; }\n#lp-app { padding: 36px 40px 64px; max-width: 1180px; font-size: 15px; }\n#lp-app h1 { font-size: 32px; font-weight: 700; letter-spacing: -.025em; line-height: 1.15; margin: 2px 0 0; }\n#lp-app p { margin: 0; }\n.lp-date { color: var(--ink-2); font-size: 15px; }\n\n.lp-top { margin-bottom: 28px; }\n.lp-next { display: flex; gap: 40px; flex-wrap: wrap; margin-top: 26px; }\n.lp-next-item {\n  --h: 200; display: grid; grid-template-columns: auto; text-align: left; border: 0; background: none; padding: 0 0 0 16px; cursor: pointer;\n  font: inherit; color: var(--ink); border-left: 3px solid hsl(var(--h) 55% var(--dot-l)); min-width: 220px;\n}\n.lp-next-lbl { font-size: 14px; color: var(--ink-2); }\n.lp-next-item strong { font-size: 30px; font-weight: 700; letter-spacing: -.02em; line-height: 1.15; }\n.lp-next-item:hover strong { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }\n.lp-next-sub { font-size: 15px; color: var(--ink-2); }\n.lp-next-item .lp-progress { max-width: 220px; margin-top: 8px; }\n.lp-next-free { color: var(--ink-2); font-size: 16px; }\n.lp-status { margin-top: 22px !important; font-size: 15px; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 0; }\n.lp-status:empty { display: none; }\n.lp-status a { color: var(--ink) !important; text-decoration: underline; text-decoration-color: var(--rule); text-underline-offset: 3px; }\n.lp-status a:hover { text-decoration-color: currentColor; }\n.lp-status a.is-danger { color: var(--danger) !important; font-weight: 600; }\n.lp-sep { width: 1px; height: 14px; background: var(--rule); margin: 0 14px; }\n\n.lp-layout {\n  display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); background: var(--surface); border: 1px solid var(--rule); border-radius: 14px;\n}\n.lp-col-day { border-right: 1px solid var(--rule); padding: 22px 22px 18px; }\n.lp-col-main { padding: 22px 26px 20px; display: flex; flex-direction: column; gap: 30px; min-width: 0; }\n.lp-sec > header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 12px; }\n.lp-sec h2 { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -.01em; }\n.lp-link { font-size: 14px; color: var(--accent) !important; text-decoration: none !important; }\n.lp-link:hover { text-decoration: underline !important; }\n\n/* dagens moduler */\n.lp-rows { display: flex; flex-direction: column; }\n.lp-row {\n  display: grid; grid-template-columns: 46px 1fr auto; gap: 10px; align-items: start; width: 100%; padding: 10px 8px; margin: 0 -8px; width: calc(100% + 16px);\n  border: 0; background: none; border-radius: 8px; font: inherit; color: var(--ink); cursor: pointer; text-align: left;\n}\n.lp-row + .lp-row { border-top: 1px solid var(--rule); border-radius: 0; }\n.lp-row:hover { background: var(--sunk); border-radius: 8px; }\n.lp-row-time, .lp-row-end { font-variant-numeric: normal; font-size: 14px; padding-top: 1px; }\n.lp-row-time { font-weight: 600; }\n.lp-row-end { color: var(--ink-3); }\n.lp-row-main { display: flex; flex-direction: column; min-width: 0; }\n.lp-row-title { font-weight: 600; display: flex; align-items: center; flex-wrap: wrap; gap: 0 8px; }\n.lp-row-title .lp-sd { margin-right: 0; }\n.lp-row-sub { font-size: 13.5px; color: var(--ink-2); }\n.lp-hwmark { margin-left: 8px; color: var(--accent); font-weight: 600; }\n.lp-flag { font-size: 13px; font-weight: 600; }\n.lp-flag.is-warn { color: var(--warn); }\n.lp-flag.is-danger { color: var(--danger); }\n.lp-row.is-past { color: var(--ink-3); }\n.lp-row.is-past .lp-row-sub { color: var(--ink-3); }\n.lp-row.is-cancelled .lp-row-title { text-decoration: line-through; text-decoration-color: var(--danger); }\n.lp-row.is-live { background: var(--accent-soft); border-radius: 8px; border-top-color: transparent; }\n.lp-row.is-live + .lp-row { border-top-color: transparent; }\n.lp-progress { display: block; height: 3px; border-radius: 3px; background: var(--rule); overflow: hidden; margin-top: 6px; }\n.lp-progress i { display: block; height: 100%; background: var(--accent); }\n.lp-event {\n  display: flex; justify-content: space-between; width: 100%; gap: 8px; padding: 8px 10px; margin-bottom: 8px; border: 1px dashed var(--rule);\n  border-radius: 8px; background: var(--sunk); color: var(--ink); font: 600 14px var(--font); cursor: pointer; text-align: left;\n}\n.lp-event small { font-weight: 400; color: var(--ink-2); }\n\n/* kommende */\n.lp-ag-day + .lp-ag-day { margin-top: 18px; }\n.lp-ag-day h3 { margin: 0 0 4px; font-size: 15px; font-weight: 700; display: flex; gap: 10px; align-items: baseline; }\n.lp-ag-day h3 small { font-weight: 400; color: var(--ink-3); font-size: 13.5px; }\n.lp-ag-day.is-late h3 { color: var(--danger); }\n.lp-ag {\n  display: grid; grid-template-columns: 92px minmax(0, 1fr) auto; gap: 12px; align-items: baseline; padding: 8px; margin: 0 -8px;\n  border-radius: 8px; color: var(--ink) !important; text-decoration: none !important;\n}\n.lp-ag:hover { background: var(--sunk); }\n.lp-ag-kind { font-size: 13px; color: var(--ink-3); }\n.lp-ag.is-task .lp-ag-kind { color: var(--accent); font-weight: 600; }\n.lp-ag.is-late .lp-ag-kind { color: var(--danger); }\n.lp-ag-main { display: flex; flex-direction: column; min-width: 0; }\n.lp-ag-main strong { font-weight: 600; display: flex; align-items: center; }\n.lp-ag-main small { font-size: 13.5px; color: var(--ink-2); display: flex; align-items: center; }\n.lp-ag.is-hw strong { font-weight: 600; }\n.lp-ag.is-hw small.lp-clamp { white-space: pre-line; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--ink); font-size: 14px; }\n.lp-ag.is-task small .lp-sd { margin-right: 6px; }\n.lp-due { font-size: 13.5px; color: var(--ink-2); white-space: nowrap; font-variant-numeric: normal; }\n.lp-due.is-warn { color: var(--warn); font-weight: 600; }\n.lp-due.is-danger { color: var(--danger); font-weight: 600; }\n.lp-due.is-ok { color: var(--ok); }\n\n/* beskeder */\n.lp-msgs { display: flex; flex-direction: column; }\n.lp-msg { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: baseline; padding: 7px 8px 7px 20px; margin: 0 -8px; border-radius: 8px; color: var(--ink) !important; text-decoration: none !important; position: relative; }\n.lp-msg:hover { background: var(--sunk); }\n.lp-msg-main { display: flex; gap: 10px; align-items: baseline; min-width: 0; }\n.lp-msg-main strong { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-msg-main small { color: var(--ink-3); font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: none; max-width: 45%; }\n.lp-msg.is-unread strong { font-weight: 700; }\n.lp-msg.is-unread::before { content: \"\"; position: absolute; left: 6px; top: 50%; width: 7px; height: 7px; margin-top: -3px; border-radius: 50%; background: var(--accent); }\n.lp-msg-time { color: var(--ink-3); font-size: 13px; white-space: nowrap; font-variant-numeric: normal; }\n\n/* n\u00f8gletal */\n.lp-stats { display: flex; gap: 36px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid var(--rule); }\n.lp-stats:empty { display: none; }\n.lp-stat { display: flex; flex-direction: column; color: var(--ink) !important; text-decoration: none !important; }\n.lp-stat b { font-size: 22px; font-weight: 700; letter-spacing: -.01em; font-variant-numeric: normal; }\n.lp-stat span { font-size: 13.5px; color: var(--ink-2); }\n.lp-stat.is-warn b { color: var(--warn); }\n.lp-stat.is-danger b { color: var(--danger); }\n.lp-stat:hover span { text-decoration: underline; }\n\n.lp-empty { padding: 14px 0; color: var(--ink-2); font-size: 14.5px; }\n.lp-empty small { color: var(--ink-3); }\n.lp-skel { display: flex; flex-direction: column; gap: 10px; }\n.lp-skel i { display: block; height: 30px; border-radius: 6px; background: var(--sunk); }\n.lp-next .lp-skel i { width: 240px; height: 64px; }\n@media (prefers-reduced-motion: no-preference) { .lp-skel i { animation: lp-pulse 1.4s ease-in-out infinite; } }\n@keyframes lp-pulse { 50% { opacity: .5; } }\n\n/* knapper */\n.lp-btn {\n  display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--rule);\n  background: var(--surface); color: var(--ink) !important; font: 500 14px var(--font); cursor: pointer; text-decoration: none !important;\n}\n.lp-btn:hover { background: var(--sunk); }\n.lp-btn.is-disabled { color: var(--ink-3) !important; pointer-events: none; }\n.lp-btn-ghost { border-color: transparent; background: transparent; color: var(--ink-2) !important; }\n.lp-btn-primary { background: var(--accent); border-color: var(--accent); color: var(--surface) !important; justify-content: center; width: 100%; margin-top: 18px; height: 40px; font-weight: 600; }\n.lp-btn-primary:hover { background: var(--accent); filter: brightness(1.1); }\n.lp-btn-primary svg { width: 16px !important; height: 16px !important; }\n\n/* ---------- ugeskema ---------- */\n.lp-week-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }\n.lp-week-nav { display: flex; gap: 6px; flex-wrap: wrap; }\n.lp-week-card { background: var(--surface); border: 1px solid var(--rule); border-radius: 14px; padding: 8px 12px 8px 4px; overflow-x: auto; }\n.lp-week { display: grid; grid-template-columns: 48px repeat(5, minmax(140px, 1fr)); min-width: 780px; }\n.lp-gutter .lp-day-body span { position: absolute; right: 8px; transform: translateY(-50%); font-size: 12px; color: var(--ink-3); font-variant-numeric: normal; }\n.lp-day { min-width: 0; border-left: 1px solid var(--rule); }\n.lp-day-head { height: 50px; display: flex; align-items: baseline; gap: 6px; padding: 14px 10px 0; }\n.lp-day-head span { font-size: 14px; color: var(--ink-2); }\n.lp-day-head b { font-size: 18px; font-weight: 700; order: -1; }\n.lp-day.is-today .lp-day-head b, .lp-day.is-today .lp-day-head span { color: var(--accent); }\n.lp-day.is-today .lp-day-head { box-shadow: inset 0 3px 0 var(--accent); }\n.lp-day-all { min-height: 32px; padding: 0 4px; }\n.lp-week.no-allday .lp-day-all { min-height: 6px; }\n.lp-allday {\n  display: block; width: 100%; padding: 3px 8px; margin-bottom: 3px; border-radius: 6px; border: 1px dashed var(--rule);\n  background: var(--sunk); color: var(--ink); font: 500 12.5px var(--font); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;\n}\n.lp-day-body { position: relative; border-top: 1px solid var(--rule); }\n.lp-hline { position: absolute; left: 0; right: 0; border-top: 1px solid var(--rule); opacity: .6; }\n.lp-blk {\n  --h: 200; position: absolute; text-align: left; cursor: pointer; overflow: hidden; display: flex; flex-direction: column;\n  padding: 4px 8px 4px 9px; border-radius: 6px; border: 0; border-left: 3px solid hsl(var(--h) 55% var(--dot-l));\n  background: hsl(var(--h) var(--tint-s) var(--tint-l)); color: var(--ink); font: inherit; z-index: 1;\n}\n.lp-blk:hover { z-index: 3; box-shadow: 0 0 0 1px hsl(var(--h) 55% var(--dot-l)); }\n.lp-blk strong { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 10px; }\n.lp-blk small, .lp-blk em { font-size: 12px; color: var(--ink-2); font-style: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-blk.is-short { flex-direction: row; align-items: center; gap: 6px; }\n.lp-blk.is-past { opacity: .5; }\n.lp-blk.is-live { box-shadow: 0 0 0 2px var(--accent); }\n.lp-blk.is-changed { border-left-color: var(--warn); }\n.lp-blk.is-changed small::after { content: \", \u00e6ndret\"; color: var(--warn); }\n.lp-blk.is-cancelled { background: var(--sunk); border-left-color: var(--danger); }\n.lp-blk.is-cancelled strong { text-decoration: line-through; color: var(--ink-2); }\n.lp-blk.is-cancelled small::after { content: \", aflyst\"; color: var(--danger); }\n.lp-blk-icons { position: absolute; top: 7px; right: 7px; }\n.lp-blk-icons i, .lp-lg-hw { display: block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }\n.lp-nowline { position: absolute; left: 0; right: 0; border-top: 2px solid var(--danger); z-index: 4; pointer-events: none; }\n.lp-legend { display: flex; gap: 20px; flex-wrap: wrap; padding: 12px 8px 4px 52px; font-size: 13px; color: var(--ink-2); align-items: center; }\n.lp-legend span { display: inline-flex; gap: 7px; align-items: center; }\n.lp-legend i { display: inline-block; }\n.lp-lg-ch, .lp-lg-ca { width: 3px; height: 14px; border-radius: 2px; }\n.lp-lg-ch { background: var(--warn); }\n.lp-lg-ca { background: var(--danger); }\n\n/* ---------- s\u00f8gning ---------- */\n#lp-palette { position: fixed; inset: 0; z-index: 10000; display: none; align-items: flex-start; justify-content: center; padding-top: 14vh; background: rgba(15, 18, 17, .35); }\n#lp-palette.is-open { display: flex; }\n.lp-pal-box { width: min(600px, 92vw); background: var(--surface); border: 1px solid var(--rule); border-radius: 12px; box-shadow: 0 20px 50px rgba(0, 0, 0, .25); overflow: hidden; }\n.lp-pal-in { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--rule); color: var(--ink-3); }\n.lp-pal-in input { flex: 1; border: 0 !important; outline: 0; background: transparent !important; color: var(--ink) !important; font: 500 17px var(--font); padding: 0 !important; box-shadow: none !important; }\n.lp-pal-list { max-height: 56vh; overflow-y: auto; padding: 6px; }\n.lp-pal-group { font-size: 13px; font-weight: 600; color: var(--ink-3); padding: 10px 10px 4px; }\n.lp-pal-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 7px; color: var(--ink) !important; text-decoration: none !important; font-size: 14.5px; }\n.lp-pal-item span { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-pal-item small { color: var(--ink-3); font-size: 13px; white-space: nowrap; max-width: 45%; overflow: hidden; text-overflow: ellipsis; }\n.lp-pal-item svg { color: var(--ink-3); }\n.lp-pal-item.is-sel, .lp-pal-item:hover { background: var(--accent-soft); }\n\n/* ---------- lektionsdetaljer ---------- */\n#lp-modal { position: fixed; inset: 0; z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(15, 18, 17, .35); }\n.lp-modal-box {\n  --h: 200; position: relative; width: min(500px, 100%); max-height: 86vh; overflow-y: auto; background: var(--surface);\n  border-radius: 14px; box-shadow: 0 20px 50px rgba(0, 0, 0, .25); padding: 24px; font-size: 15px;\n}\n@media (prefers-reduced-motion: no-preference) { .lp-modal-box { animation: lp-in .16s ease-out; } }\n@keyframes lp-in { from { transform: translateY(6px); opacity: 0; } }\n.lp-modal-x { position: absolute; top: 14px; right: 14px; }\n.lp-modal-head { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: center; padding-right: 40px; }\n.lp-modal-subj { display: inline-flex; align-items: center; font-size: 14px; color: var(--ink-2); }\n.lp-modal-head h3 { width: 100%; margin: 4px 0 0; font-size: 24px; font-weight: 700; letter-spacing: -.02em; line-height: 1.2; }\n.lp-modal-head p { width: 100%; color: var(--ink-2); margin: 2px 0 0; }\n.lp-meta { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 16px 0 4px; padding-bottom: 14px; border-bottom: 1px solid var(--rule); }\n.lp-meta div { display: flex; gap: 6px; align-items: center; font-size: 14px; }\n.lp-meta svg { width: 15px !important; height: 15px !important; color: var(--ink-3); }\n.lp-modal-box section { margin-top: 16px; }\n.lp-modal-box h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; }\n.lp-modal-box section p { white-space: pre-line; margin: 0; }\n.lp-pad { padding: 12px 0 0; }\n\n/* ---------- tilbage-knap ---------- */\n#lp-pill {\n  position: fixed; right: 18px; bottom: 18px; z-index: 9999; padding: 9px 16px; border-radius: 8px; border: 1px solid var(--rule);\n  background: var(--surface); box-shadow: 0 8px 24px rgba(0, 0, 0, .15); font: 600 14px var(--font); cursor: pointer;\n}\n\n/* ---------- mindre sk\u00e6rme ---------- */\n@media (max-width: 980px) {\n  .lp-layout { grid-template-columns: 1fr; }\n  .lp-col-day { border-right: 0; border-bottom: 1px solid var(--rule); }\n}\n@media (max-width: 860px) {\n  html.lp-on { --side: 0px; }\n  html.lp-on body { padding-top: 52px !important; }\n  #lp-side { width: 260px; transform: translateX(-102%); box-shadow: 0 0 40px rgba(0, 0, 0, .2); }\n  html.lp-menu-open #lp-side { transform: none; }\n  html.lp-menu-open #lp-scrim { display: block; position: fixed; inset: 0; background: rgba(15, 18, 17, .35); z-index: 8999; }\n  #lp-topbar {\n    display: flex; position: fixed; top: 0; left: 0; right: 0; height: 52px; z-index: 8998; align-items: center; justify-content: space-between;\n    padding: 0 8px; background: var(--surface); border-bottom: 1px solid var(--rule);\n  }\n  #lp-topbar strong { font-size: 17px; font-weight: 700; }\n  #lp-app { padding: 22px 16px 44px; }\n  #lp-app h1 { font-size: 26px; }\n  .lp-next { gap: 18px; margin-top: 18px; }\n  .lp-next-item strong { font-size: 24px; }\n  .lp-col-day, .lp-col-main { padding: 18px 16px; }\n  .lp-ag { grid-template-columns: minmax(0, 1fr) auto; }\n  .lp-ag-kind { grid-column: 1 / -1; margin-bottom: -6px; }\n  .lp-msg-main { flex-direction: column; gap: 0; }\n  .lp-msg-main small { max-width: none; }\n  html.lp-on .outerContentFrame { padding: 12px 10px 30px !important; }\n}\n@media print {\n  #lp-side, #lp-topbar, #lp-pill { display: none !important; }\n  html.lp-on body { padding: 0 !important; }\n}\n\n/* ---------- egne visninger ---------- */\nhtml.lp-on, html.lp-on body { overflow-x: hidden; }\n.lp-vhead { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }\n.lp-vhead-actions { display: flex; gap: 6px; flex-wrap: wrap; }\n.lp-filter { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }\n.lp-filter button {\n  display: inline-flex; align-items: center; height: 30px; padding: 0 11px; border-radius: 15px; border: 1px solid var(--rule);\n  background: var(--surface); color: var(--ink-2); font: 500 13.5px var(--font); cursor: pointer;\n}\n.lp-filter button .lp-sd { margin-right: 6px; }\n.lp-filter button:hover { color: var(--ink); }\n.lp-filter button.is-on { background: var(--ink); border-color: var(--ink); color: var(--surface); }\n.lp-sheet { background: var(--surface); border: 1px solid var(--rule); border-radius: 14px; padding: 6px 24px 18px; }\n.lp-group { padding-top: 18px; }\n.lp-group[hidden] { display: none; }\n.lp-group + .lp-group { border-top: 1px solid var(--rule); margin-top: 6px; }\n.lp-group h2 { margin: 0 0 8px; font-size: 17px; font-weight: 700; display: flex; align-items: baseline; gap: 8px; }\n.lp-group h2 span { font-size: 14px; font-weight: 500; color: var(--ink-3); }\n.lp-group h2 small { font-size: 14px; font-weight: 400; color: var(--ink-3); }\n.lp-group.is-late h2 { color: var(--danger); }\n.lp-done summary { list-style: none; cursor: pointer; }\n.lp-done summary::-webkit-details-marker { display: none; }\n.lp-done summary h2::after { content: \"vis\"; font-size: 13.5px; font-weight: 500; color: var(--accent); margin-left: 4px; }\n.lp-done[open] summary h2::after { content: \"skjul\"; }\n.lp-list { display: flex; flex-direction: column; }\n.lp-list > [hidden] { display: none !important; }\n\n.lp-task-row {\n  display: grid; grid-template-columns: 110px minmax(0, 1fr) auto; gap: 16px; align-items: start; padding: 12px 10px; margin: 0 -10px;\n  border-radius: 8px; color: var(--ink) !important; text-decoration: none !important;\n}\n.lp-task-row + .lp-task-row { border-top: 1px solid var(--rule); border-radius: 0; }\n.lp-task-row:hover { background: var(--sunk); border-radius: 8px; }\n.lp-task-when { display: flex; flex-direction: column; font-variant-numeric: normal; }\n.lp-task-when b { font-weight: 600; }\n.lp-task-when small { color: var(--ink-2); font-size: 13px; }\n.lp-task-what { display: flex; flex-direction: column; min-width: 0; }\n.lp-task-what strong { font-weight: 600; }\n.lp-task-what small { color: var(--ink-2); font-size: 13.5px; display: flex; align-items: center; }\n.lp-task-what small .lp-sd { margin-right: 6px; }\n.lp-task-note { margin-top: 4px; font-size: 13.5px; color: var(--ink-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-line; }\n.lp-task-state { display: flex; flex-direction: column; align-items: flex-end; text-align: right; }\n.lp-task-state small { font-size: 12.5px; color: var(--ink-3); }\n.lp-done .lp-task-row { color: var(--ink-2) !important; }\n\n.lp-hw-item { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 10px; padding: 12px 0; }\n.lp-hw-item + .lp-hw-item { border-top: 1px solid var(--rule); }\n.lp-hw-item[hidden] { display: none; }\n.lp-check { position: relative; width: 20px; height: 20px; margin-top: 2px; cursor: pointer; }\n.lp-check input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }\n.lp-check i { position: absolute; inset: 0; border: 1.5px solid var(--ink-3); border-radius: 5px; }\n.lp-check input:checked + i { background: var(--ok); border-color: var(--ok); }\n.lp-check input:checked + i::after { content: \"\"; position: absolute; left: 6px; top: 2px; width: 5px; height: 10px; border: solid var(--surface); border-width: 0 2px 2px 0; transform: rotate(45deg); }\n.lp-check input:focus-visible + i { outline: 2px solid var(--accent); outline-offset: 2px; }\n.lp-hw-top { display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px; }\n.lp-hw-top a { display: inline-flex; align-items: center; color: var(--ink) !important; text-decoration: none !important; }\n.lp-hw-top a:hover strong { text-decoration: underline; }\n.lp-hw-top small { color: var(--ink-3); font-size: 13px; }\n.lp-hw-content { font-size: 14.5px; line-height: 1.55; overflow-wrap: anywhere; }\n.lp-hw-content a { color: var(--accent) !important; }\n.lp-hw-content img { vertical-align: -3px; max-height: 16px; opacity: .7; }\n.lp-hw-content .ls-homework-note, .lp-hw-content div[class*=\"note\"] { background: var(--sunk) !important; border: 0 !important; border-left: 3px solid var(--rule) !important; border-radius: 4px; padding: 8px 12px !important; margin: 6px 0; color: var(--ink) !important; white-space: pre-line; }\n.lp-hw-item.is-done .lp-hw-body { opacity: .45; }\n.lp-hw-item.is-done .lp-hw-top strong { text-decoration: line-through; }\n\n.lp-bignums { display: flex; gap: 48px; flex-wrap: wrap; margin-bottom: 20px; }\n.lp-bignums > div { display: flex; flex-direction: column; }\n.lp-bignums b { font-size: 34px; font-weight: 700; letter-spacing: -.02em; font-variant-numeric: normal; line-height: 1.15; }\n.lp-bignums span { color: var(--ink-2); font-size: 14.5px; }\n.lp-bignums .is-warn b { color: var(--warn); }\n.lp-bignums .is-danger b { color: var(--danger); }\n.lp-abs-table, .lp-gr-table { display: flex; flex-direction: column; }\n.lp-abs-row { display: grid; grid-template-columns: minmax(160px, 1.4fr) 100px minmax(60px, 1fr) 100px minmax(60px, 1fr); gap: 14px; align-items: center; padding: 9px 0; border-top: 1px solid var(--rule); font-variant-numeric: normal; }\n.lp-abs-row.is-head, .lp-gr-row.is-head { border-top: 0; color: var(--ink-3); font-size: 13.5px; padding-bottom: 4px; }\n.lp-abs-row > span:first-child { display: flex; align-items: center; gap: 0; }\n.lp-abs-row small, .lp-gr-row small { color: var(--ink-3); font-size: 12.5px; margin-left: 8px; }\n.lp-abs-row .is-warn { color: var(--warn); font-weight: 600; }\n.lp-abs-row .is-danger { color: var(--danger); font-weight: 600; }\n.lp-bar { display: block; height: 6px; border-radius: 3px; background: var(--sunk); overflow: hidden; }\n.lp-bar i { display: block; height: 100%; background: var(--ink-3); border-radius: 3px; }\n.lp-bar.is-warn i { background: var(--warn); }\n.lp-bar.is-danger i { background: var(--danger); }\n.lp-gr-row { display: grid; grid-template-columns: minmax(200px, 1fr) 120px 120px 60px; gap: 14px; align-items: baseline; padding: 10px 0; border-top: 1px solid var(--rule); }\n.lp-grade { font-size: 18px; font-weight: 700; font-variant-numeric: normal; }\n.lp-note { margin-top: 14px !important; font-size: 13.5px; color: var(--ink-3); }\n\n/* ---------- beskedsiden ---------- */\nhtml.lp-msgpage .lp-hide { display: none !important; }\nhtml.lp-msgpage .ls-foldertree2, html.lp-msgpage .lectiofilepicker-foldertree-col { background: transparent !important; border: 0 !important; box-shadow: none !important; }\nhtml.lp-msgpage [id$=\"ListGridSelectionTree\"] a, html.lp-on [id$=\"FolderTreeView\"] a {\n  color: var(--ink-2) !important; text-decoration: none !important; padding: 4px 8px; border-radius: 6px; display: inline-block; font-size: 14px;\n}\nhtml.lp-msgpage [id$=\"ListGridSelectionTree\"] a:hover { background: var(--sunk); color: var(--ink) !important; }\nhtml.lp-msgpage [id$=\"ListGridSelectionTree\"] img { filter: grayscale(1); opacity: .5; }\nhtml.lp-msgpage table[id*=\"threadGV\"] { width: 100% !important; }\nhtml.lp-msgpage table[id*=\"threadGV\"] td { padding: 9px 10px !important; vertical-align: middle; }\nhtml.lp-msgpage table[id*=\"threadGV\"] td:nth-child(-n+3) { width: 22px; padding-left: 4px !important; padding-right: 4px !important; }\nhtml.lp-msgpage table[id*=\"threadGV\"] img { opacity: .4; }\nhtml.lp-msgpage table[id*=\"threadGV\"] tr:hover img { opacity: .85; }\nhtml.lp-msgpage table[id*=\"threadGV\"] td:nth-child(4) { font-size: 14.5px; }\nhtml.lp-msgpage table[id*=\"threadGV\"] td:nth-child(4) a, html.lp-msgpage table[id*=\"threadGV\"] td:nth-child(4) span { color: var(--ink) !important; text-decoration: none !important; }\nhtml.lp-msgpage table[id*=\"threadGV\"] td:nth-child(n+5) { color: var(--ink-2) !important; font-size: 13.5px; }\nhtml.lp-msgpage table[id*=\"threadGV\"] td:nth-child(n+5) img { display: none; }\nhtml.lp-msgpage .lp-clickrow { cursor: pointer; }\nhtml.lp-msgpage .lp-unread td:nth-child(4), html.lp-msgpage .lp-unread td:nth-child(4) * { font-weight: 700 !important; }\nhtml.lp-msgpage .lp-unread td:first-child { box-shadow: inset 3px 0 0 var(--accent); }\n.lp-lbtn {\n  display: inline-flex !important; align-items: center; gap: 4px; height: 32px; padding: 0 12px !important; border-radius: 8px; border: 1px solid var(--rule);\n  background: var(--surface) !important; color: var(--ink) !important; text-decoration: none !important; font: 500 14px var(--font);\n}\n.lp-lbtn:hover { background: var(--sunk) !important; }\n.lp-lbtn.is-primary { background: var(--accent) !important; border-color: var(--accent); color: var(--surface) !important; }\nhtml.lp-msgpage .message-thread-container { background: transparent !important; }\nhtml.lp-msgpage .thread-header-container { border-bottom: 1px solid var(--rule); padding-bottom: 12px; margin-bottom: 14px; }\nhtml.lp-msgpage table[id*=\"MessagesGV\"], html.lp-msgpage table[id*=\"MessagesGV\"] td { background: transparent !important; border: 0 !important; box-shadow: none !important; padding: 0 !important; }\nhtml.lp-msgpage .message-thread-message-sender { color: var(--ink-2) !important; font-size: 13.5px; margin: 0 0 6px 2px; }\nhtml.lp-msgpage .message-thread-message {\n  background: var(--surface) !important; border: 1px solid var(--rule) !important; border-radius: 12px !important; padding: 16px 20px !important;\n  box-shadow: none !important; font-size: 15px; line-height: 1.55; margin-bottom: 16px;\n}\nhtml.lp-msgpage .message-thread-message * { background-color: transparent !important; }\nhtml.lp-msgpage textarea { min-height: 130px; width: 100% !important; font: 15px/1.5 var(--font) !important; }\n\n/* islands p\u00e5 Lectios \u00f8vrige sider */\nhtml.lp-on .lf-island { border: 1px solid var(--rule) !important; overflow: hidden; margin-bottom: 16px !important; }\nhtml.lp-on .islandHeaderContainer { padding: 10px 16px !important; }\nhtml.lp-on .islandHeader, html.lp-on .islandHeader h3, html.lp-on .islandHeader span { font-size: 16px !important; font-weight: 700 !important; color: var(--ink) !important; }\nhtml.lp-on .islandContent { padding: 12px 16px !important; }\n\n@media (max-width: 860px) {\n  .lp-sheet { padding: 4px 14px 14px; }\n  .lp-task-row { grid-template-columns: minmax(0, 1fr) auto; }\n  .lp-task-when { grid-column: 1 / -1; flex-direction: row; gap: 8px; }\n  .lp-abs-row { grid-template-columns: 1fr 80px 80px; }\n  .lp-abs-row > .lp-bar, .lp-abs-row > span:empty { display: none; }\n  .lp-gr-row { grid-template-columns: 1fr 70px 70px; }\n  .lp-gr-row > span:last-child { display: none; }\n}\n\n/* ---------- 1.4: opstart uden blink ---------- */\nhtml.lp-boot body::before {\n  content: \"\"; position: fixed; inset: 0 auto 0 0; width: var(--side); background: var(--surface); border-right: 1px solid var(--rule); z-index: 8990;\n}\nhtml.lp-on .ls-master-header-container,\nhtml.lp-on [id$=\"masterHeaderDiv\"],\nhtml.lp-on [id$=\"mastermenu\"] { display: none !important; }\nhtml.lp-on[data-lp-theme=\"dark\"] .lp-dk-bd { border-color: var(--rule) !important; }\nhtml.lp-on[data-lp-theme=\"dark\"] .outerContentFrame :is(table, td, th) { border-color: var(--rule) !important; }\n\n/* ---------- sidemenu: mine hold og mere ---------- */\n.lp-more { margin-top: 2px; }\n.lp-more[hidden] { display: none; }\n.lp-more summary {\n  list-style: none; display: flex; align-items: center; gap: 11px; padding: 7px 10px; border-radius: 7px; cursor: pointer;\n  color: var(--ink-2); font: 500 14.5px var(--font); user-select: none;\n}\n.lp-more summary::-webkit-details-marker { display: none; }\n.lp-more summary svg { color: var(--ink-3); }\n.lp-more summary span { flex: 1; }\n.lp-more summary::after { content: \"\"; width: 7px; height: 7px; border-right: 1.5px solid var(--ink-3); border-bottom: 1.5px solid var(--ink-3); transform: rotate(-45deg); transition: transform .15s; margin-right: 4px; }\n.lp-more[open] summary::after { transform: rotate(45deg); }\n.lp-more summary:hover { background: var(--sunk); color: var(--ink); }\n.lp-more-list { display: flex; flex-direction: column; padding: 2px 0 6px 39px; }\n.lp-more-group { margin: 8px 0 2px !important; font-size: 12.5px; color: var(--ink-3); }\n.lp-more-item { display: flex; align-items: center; padding: 4px 8px; margin-left: -8px; border-radius: 6px; color: var(--ink-2) !important; text-decoration: none !important; font-size: 14px; }\n.lp-more-item:hover { background: var(--sunk); color: var(--ink) !important; }\n.lp-more-item.is-active { color: var(--ink) !important; font-weight: 600; background: var(--accent-soft); }\n.lp-more-item .lp-sd { margin-right: 8px; }\n@media (prefers-reduced-motion: reduce) { .lp-more summary::after { transition: none; } }\n\n/* ---------- faner i egne visninger ---------- */\n.lp-tabs { display: flex; gap: 4px; flex-wrap: wrap; margin: -6px 0 18px; border-bottom: 1px solid var(--rule); }\n.lp-tabs a { padding: 8px 12px; color: var(--ink-2) !important; text-decoration: none !important; font-size: 14.5px; box-shadow: inset 0 -2px 0 transparent; }\n.lp-tabs a:hover { color: var(--ink) !important; }\n.lp-tabs a.is-on { color: var(--ink) !important; font-weight: 600; box-shadow: inset 0 -2px 0 var(--accent); }\n\n/* ---------- fra skolen ---------- */\n.lp-status a.is-warn { color: var(--warn) !important; font-weight: 600; }\n.lp-notice + .lp-notice { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--rule); }\n.lp-notice h3 { margin: 0 0 4px; font-size: 15px; font-weight: 700; }\n.lp-notice h3 a { color: var(--ink) !important; text-decoration: none !important; }\n.lp-notice h3 a:hover { text-decoration: underline !important; }\n.lp-nrow { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 14px; align-items: baseline; padding: 3px 0; }\n.lp-ntext { font-size: 14.5px; color: var(--ink-2); line-height: 1.5; max-height: 4.5em; overflow: hidden; overflow-wrap: anywhere; }\n.lp-ntext.is-open { max-height: none; }\n.lp-ntext a { color: var(--accent) !important; }\n.lp-ntime { font-size: 13.5px; color: var(--ink-3); white-space: nowrap; font-variant-numeric: normal; }\n.lp-ntime.is-warn { color: var(--warn); font-weight: 600; }\n.lp-more-btn { border: 0; background: none; padding: 2px 0; color: var(--accent); font: 500 13.5px var(--font); cursor: pointer; }\n\n/* ---------- lektionsvisning (skuffe fra h\u00f8jre) ---------- */\n#lp-drawer { position: fixed; inset: 0; z-index: 10001; font-family: var(--font); color: var(--ink); text-align: left; }\n#lp-drawer * { box-sizing: border-box; }\n#lp-drawer svg { width: 18px; height: 18px; flex: none; }\n.lp-dr-scrim { position: absolute; inset: 0; background: rgba(15, 18, 17, .32); }\n.lp-dr-panel {\n  --h: 200; position: absolute; top: 0; right: 0; bottom: 0; width: min(520px, 100%); display: flex; flex-direction: column;\n  background: var(--surface); border-left: 1px solid var(--rule); box-shadow: -20px 0 50px rgba(0, 0, 0, .18); outline: none;\n}\n@media (prefers-reduced-motion: no-preference) { .lp-dr-panel { animation: lp-slide .18s ease-out; } }\n@keyframes lp-slide { from { transform: translateX(24px); opacity: .4; } }\n.lp-dr-top { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid var(--rule); }\n.lp-dr-nav { display: flex; align-items: center; gap: 2px; }\n.lp-dr-nav .lp-icon-btn:disabled { opacity: .35; cursor: default; }\n.lp-dr-count { margin-left: 8px; font-size: 13.5px; color: var(--ink-3); font-variant-numeric: normal; }\n.lp-dr-body { flex: 1; overflow-y: auto; padding: 22px 26px 28px; }\n.lp-dr-subj { display: flex; align-items: center; gap: 8px; margin: 0 !important; font-size: 14.5px; color: var(--ink-2); }\n.lp-dr-subj .lp-sd { margin-right: 0; width: 10px; height: 10px; }\n.lp-dr-body h2 { margin: 6px 0 4px; font-size: 26px; font-weight: 700; letter-spacing: -.02em; line-height: 1.2; text-wrap: balance; }\n.lp-dr-when { margin: 0 !important; color: var(--ink-2); font-size: 15px; }\n.lp-dr-body > .lp-progress { max-width: 260px; margin-top: 10px; }\n.lp-dr-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px 20px; margin: 20px 0 6px; padding: 14px 0; border-block: 1px solid var(--rule); }\n.lp-dr-meta div { min-width: 0; }\n.lp-dr-meta dt { font-size: 13px; color: var(--ink-3); }\n.lp-dr-meta dd { margin: 2px 0 0; font-size: 14.5px; overflow-wrap: anywhere; }\n.lp-dr-content { font-size: 15px; line-height: 1.6; }\n.lp-dr-content section + section { margin-top: 14px; }\n.lp-dr-tip { opacity: .6; }\n.lp-dr-loading { margin: 14px 0 0 !important; color: var(--ink-3); font-size: 14px; }\n@media (prefers-reduced-motion: no-preference) { .lp-dr-loading { animation: lp-pulse 1.4s ease-in-out infinite; } }\n.lp-pre { white-space: pre-line; margin: 0; overflow-wrap: anywhere; }\n.lp-c-head { margin: 18px 0 6px !important; font-size: 15px; font-weight: 700; }\n.lp-dr-content > :first-child .lp-c-head, .lp-dr-content > section:first-child .lp-c-head, .lp-act > :first-child .lp-c-head { margin-top: 10px !important; }\n.lp-act { overflow-wrap: anywhere; }\n.lp-act article { margin: 0; }\n.lp-act p { margin: 0 0 8px; }\n.lp-act h5 { margin: 12px 0 4px; font-size: 15px; }\n.lp-act hr { border: 0; border-top: 1px solid var(--rule); margin: 10px 0; }\n.lp-act a { color: var(--accent); }\n.lp-act img { max-width: 100%; height: auto; border-radius: 6px; }\n.lp-act ul, .lp-act ol { padding-left: 20px; margin: 4px 0 8px; }\n.lp-act table { border-collapse: collapse; display: block; overflow-x: auto; }\n.lp-act td, .lp-act th { border: 1px solid var(--rule); padding: 4px 8px; }\n.lp-c-file { display: flex; align-items: center; gap: 8px; margin: 0 !important; padding: 8px 10px; border-radius: 8px; background: var(--sunk); font-weight: 500; }\n.lp-c-file + .lp-c-file, .lp-act article + article { margin-top: 6px !important; }\n.lp-c-file img { max-height: 18px; width: auto; border-radius: 0; }\n.lp-c-file a { text-decoration: none; }\n.lp-c-file a:hover { text-decoration: underline; }\n.lp-dr-foot { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 12px 20px 16px; border-top: 1px solid var(--rule); }\n.lp-dr-foot .lp-btn-primary { width: auto; margin: 0; padding: 0 16px; }\n.lp-dr-keys { font-size: 13px; color: var(--ink-3); }\n.lp-dr-keys kbd { font: 500 11px var(--font); padding: 1px 5px; border-radius: 4px; border: 1px solid var(--rule); color: var(--ink-2); }\n@media (max-width: 860px) {\n  .lp-dr-panel { width: 100%; border-left: 0; }\n  .lp-dr-body { padding: 18px 16px 24px; }\n  .lp-dr-keys { display: none; }\n}\n\n/* ---------- Lectios egen lektionsside ---------- */\nhtml.lp-on #homeworkContentContainer, html.lp-on .ls-paper {\n  background: var(--surface) !important; color: var(--ink) !important; border: 1px solid var(--rule) !important; border-radius: 12px;\n  box-shadow: none !important; padding: 20px 24px !important;\n}\nhtml.lp-on .ls-section-title-heading, html.lp-on .ls-section-title-heading * { font-style: normal !important; }\nhtml.lp-on .ls-section-title-heading { font-size: 18px !important; font-weight: 600 !important; }\nhtml.lp-on .ls-paper-section-heading { font-size: 17px !important; font-weight: 700 !important; margin: 16px 0 6px !important; }\nhtml.lp-on .lc-display-fragment h1 { font-size: 15px !important; font-weight: 500 !important; }\nhtml.lp-drawer-open { overflow: hidden; }\n\n/* tabeltal kun hvor tider st\u00e5r under hinanden */\n.lp-row-time, .lp-row-end, .lp-gutter .lp-day-body span { font-variant-numeric: normal; }\n\n/* =====================================================================\n   1.5: gennemg\u00e5ende design for hele Lectio\n   ===================================================================== */\nhtml.lp-on { font-size: 14px !important; }\nhtml.lp-on body { line-height: 1.5; }\nhtml.lp-on #s_m_outerContentFrameDiv > .ls-content-container,\nhtml.lp-on #m_outerContentFrameDiv > .ls-content-container { max-width: 1680px; margin-inline: auto; }\nhtml.lp-on .outerContentFrame { padding: clamp(16px, 2vw, 36px) clamp(16px, 2.4vw, 44px) 56px !important; }\nhtml.lp-on .maintitle { font-size: clamp(24px, 2vw, 32px) !important; letter-spacing: -.02em; }\n\n/* \u00f8er (Lectios kasser) */\nhtml.lp-on section.lf-island { border: 1px solid var(--rule) !important; border-radius: 14px !important; background: var(--surface) !important; box-shadow: none !important; overflow: hidden; margin-bottom: 18px; }\nhtml.lp-on section.lf-island .islandHeaderContainer { background: transparent !important; border: 0 !important; border-bottom: 1px solid var(--rule) !important; border-radius: 0 !important; padding: 14px 20px !important; min-height: 0 !important; display: flex !important; align-items: center; justify-content: space-between; gap: 12px; }\nhtml.lp-on section.lf-island .islandHeader { font-size: 17px !important; font-weight: 700 !important; color: var(--ink) !important; letter-spacing: -.01em; }\nhtml.lp-on section.lf-island .islandHeaderRight { opacity: .45; transition: opacity .15s; }\nhtml.lp-on section.lf-island:hover .islandHeaderRight { opacity: 1; }\nhtml.lp-on section.lf-island .islandContent { background: transparent !important; border: 0 !important; border-radius: 0 !important; padding: 16px 20px 18px !important; }\nhtml.lp-on .ls-std-island-layout-ltr { display: flex !important; flex-wrap: wrap; gap: 18px !important; align-items: flex-start; }\nhtml.lp-on .ls-std-island-layout-ltr > section.lf-island { margin: 0 !important; min-width: 0; max-width: 100% !important; }\nhtml.lp-on .ls-std-island-layout-ltr > section.largeBlock { flex: 1 1 560px; width: auto !important; }\nhtml.lp-on .ls-std-island-layout-ltr > section.smallBlockFixed,\nhtml.lp-on .ls-std-island-layout-ltr > section.smallBlock,\nhtml.lp-on .ls-std-island-layout-ltr > section.defaultBlock { flex: 0 1 380px; width: auto !important; }\nhtml.lp-on .ls-std-island-layout-col { display: flex !important; flex-direction: column; gap: 18px; }\nhtml.lp-on .ls-std-island-layout-col > br { display: none; }\nhtml.lp-on .ls-std-island-layout-col > section.lf-island { width: 100% !important; max-width: 100% !important; margin: 0 !important; }\n\n/* tabeller */\nhtml.lp-on .outerContentFrame table { font-size: inherit; }\nhtml.lp-on .lf-grid, html.lp-on .ls-table-layout1, html.lp-on .ls-table-layout2, html.lp-on .ls-table-layout5 { width: 100%; }\nhtml.lp-on .lf-grid th, html.lp-on .ls-table-layout2 th, html.lp-on .ls-table-layout5 th, html.lp-on .ls-table-layout1 th { font-size: 13px !important; color: var(--ink-3) !important; font-weight: 600 !important; text-transform: none !important; padding: 10px 14px !important; white-space: nowrap; }\nhtml.lp-on .lf-grid td, html.lp-on .ls-table-layout2 td, html.lp-on .ls-table-layout5 td, html.lp-on .ls-table-layout1 td { padding: 11px 14px !important; line-height: 1.45; }\nhtml.lp-on .lf-grid tr:last-child td { border-bottom: 0 !important; }\nhtml.lp-on .ls-std-table-inputlist { border-collapse: collapse; width: 100%; }\nhtml.lp-on .ls-std-table-inputlist th, html.lp-on .ls-std-table-inputlist td { padding: 8px 12px 8px 0 !important; border: 0 !important; border-bottom: 1px solid var(--rule) !important; vertical-align: top; text-align: left; }\nhtml.lp-on .ls-std-table-inputlist tr:last-child > * { border-bottom: 0 !important; }\nhtml.lp-on .ls-std-table-inputlist tr > :first-child { color: var(--ink-2) !important; font-weight: 500; white-space: nowrap; width: 1%; padding-right: 24px !important; }\n\n/* knapper og links */\nhtml.lp-on .outerContentFrame a { text-decoration: none; }\nhtml.lp-on .outerContentFrame a:hover { text-decoration: underline; }\nhtml.lp-on .buttonlink > a, html.lp-on a.buttonlink, html.lp-on .button > a, html.lp-on a.button, html.lp-on .lec-button,\nhtml.lp-on input[type=\"submit\"], html.lp-on input[type=\"button\"]:not(.hidetabinputbutton), html.lp-on button.button {\n  display: inline-flex !important; align-items: center; gap: 6px; min-height: 34px; padding: 0 14px !important; border-radius: 9px !important;\n  border: 1px solid var(--rule) !important; background: var(--surface) !important; color: var(--ink) !important; font: 500 14px var(--font) !important;\n  text-decoration: none !important; cursor: pointer; box-shadow: none !important;\n}\nhtml.lp-on .buttonlink > a:hover, html.lp-on a.buttonlink:hover, html.lp-on .button > a:hover, html.lp-on input[type=\"submit\"]:hover { background: var(--sunk) !important; }\nhtml.lp-on .buttonlink { background: transparent !important; border: 0 !important; padding: 0 !important; }\nhtml.lp-on .buttonicon a { color: var(--ink-2) !important; border-radius: 8px; }\nhtml.lp-on .buttonicon a:hover { background: var(--sunk) !important; color: var(--ink) !important; }\nhtml.lp-on input[type=\"checkbox\"], html.lp-on input[type=\"radio\"] { accent-color: var(--accent); width: 16px; height: 16px; }\nhtml.lp-on input[type=\"text\"], html.lp-on input[type=\"search\"], html.lp-on input[type=\"password\"], html.lp-on input[type=\"email\"], html.lp-on input[type=\"tel\"], html.lp-on input[type=\"number\"], html.lp-on input[type=\"date\"], html.lp-on select, html.lp-on textarea {\n  min-height: 34px; font: 14px var(--font) !important; border-color: var(--rule) !important;\n}\nhtml.lp-on input:focus, html.lp-on select:focus, html.lp-on textarea:focus { outline: 2px solid var(--accent) !important; outline-offset: 1px; border-color: var(--accent) !important; }\nhtml.lp-on textarea { line-height: 1.5 !important; padding: 10px 12px !important; }\n\n/* v\u00e6rkt\u00f8jslinjer og faner */\nhtml.lp-on .ls-std-toolbar, html.lp-on .ls-std-toolbar-filled { background: transparent !important; border: 0 !important; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 0 0 12px !important; }\nhtml.lp-on .lectioTabToolbar { display: flex !important; gap: 4px; border-bottom: 1px solid var(--rule) !important; background: transparent !important; margin-bottom: 14px; padding: 0 !important; }\nhtml.lp-on .lectioTabToolbar a { padding: 8px 14px !important; color: var(--ink-2) !important; text-decoration: none !important; border: 0 !important; background: transparent !important; box-shadow: inset 0 -2px 0 transparent; border-radius: 0 !important; }\nhtml.lp-on .lectioTabToolbar a:hover { color: var(--ink) !important; }\nhtml.lp-on .lectioTabToolbar a[class*=\"selected\"], html.lp-on .lectioTabToolbar a[aria-selected=\"true\"], html.lp-on .lectioTabToolbar .selected a { color: var(--ink) !important; font-weight: 600; box-shadow: inset 0 -2px 0 var(--accent); }\nhtml.lp-on .lectioTabContent { background: transparent !important; border: 0 !important; padding: 0 !important; }\n\n/* mappetr\u00e6er (beskeder og dokumenter) */\nhtml.lp-on .TreeNode-container { display: flex; align-items: center; gap: 4px; padding: 1px 0; }\nhtml.lp-on .TreeNode-chevron { opacity: .5; }\nhtml.lp-on a.TreeNode { display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px !important; border-radius: 8px; color: var(--ink-2) !important; text-decoration: none !important; font-size: 14px; flex: 1; min-width: 0; }\nhtml.lp-on a.TreeNode:hover { background: var(--sunk) !important; color: var(--ink) !important; }\nhtml.lp-on a.TreeNode.selectedFolder { background: var(--accent-soft) !important; color: var(--ink) !important; font-weight: 600; }\nhtml.lp-on .TreeNode-icon { filter: grayscale(1); opacity: .55; width: 16px; height: auto; }\nhtml.lp-on .TreeNode-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\nhtml.lp-on .ls-lectiofilepicker-container { display: flex !important; gap: 20px; align-items: flex-start; }\nhtml.lp-on .lectiofilepicker-foldertree-col { flex: 0 0 240px; width: 240px !important; position: sticky; top: 16px; background: transparent !important; border: 0 !important; }\nhtml.lp-on .lectiofilepicker-foldercontent-col { flex: 1 1 auto; min-width: 0; width: auto !important; background: var(--surface) !important; border: 1px solid var(--rule) !important; border-radius: 14px; padding: 16px 20px !important; }\n\n/* dialoger */\nhtml.lp-on .ui-dialog, html.lp-on dialog { background: var(--surface) !important; color: var(--ink) !important; border: 1px solid var(--rule) !important; border-radius: 14px !important; box-shadow: 0 24px 60px rgba(0, 0, 0, .25) !important; padding: 0 !important; overflow: hidden; }\nhtml.lp-on .ui-dialog-titlebar { background: transparent !important; border: 0 !important; border-bottom: 1px solid var(--rule) !important; padding: 14px 18px !important; font-weight: 700; color: var(--ink) !important; }\nhtml.lp-on .ui-dialog-content { padding: 16px 18px !important; background: transparent !important; color: var(--ink) !important; }\nhtml.lp-on .ui-widget-overlay { background: rgba(15, 18, 17, .4) !important; opacity: 1 !important; }\n\n/* sm\u00e5 sider */\nhtml.lp-on .ls-columnlist, html.lp-on [class*=\"columnlist\"] { column-gap: 24px; }\nhtml.lp-on .ls-columnlist a, html.lp-on [class*=\"columnlist\"] a { display: block; padding: 4px 6px; border-radius: 6px; }\nhtml.lp-on .ls-columnlist a:hover, html.lp-on [class*=\"columnlist\"] a:hover { background: var(--sunk); text-decoration: none; }\n\n/* beskedtr\u00e5d i Lectios egen visning */\nhtml.lp-on .message-thread-message-sender { color: var(--ink-2) !important; margin: 16px 0 6px 2px; font-size: 14px; }\nhtml.lp-on .message-thread-message { background: var(--surface) !important; border: 1px solid var(--rule) !important; border-radius: 14px !important; padding: 18px 22px !important; box-shadow: none !important; }\nhtml.lp-on .message-thread-message-header { font-size: 18px !important; font-weight: 700 !important; }\nhtml.lp-on .message-thread-message-content { font-size: 15px; line-height: 1.6; }\nhtml.lp-on .message-thread-message * { background-color: transparent !important; }\n\n/* =====================================================================\n   1.5: egne flader\n   ===================================================================== */\n#lp-app { max-width: 1480px; margin: 0 auto; container-type: inline-size; padding: clamp(20px, 2.4vw, 44px) clamp(16px, 2.6vw, 48px) 64px; }\n#lp-app.lp-dash, #lp-app.lp-msgview { max-width: 1960px; }\n.lp-btn-main { background: var(--ink) !important; border-color: var(--ink) !important; color: var(--surface) !important; }\n.lp-btn-main:hover { opacity: .88; background: var(--ink) !important; }\n.lp-link-btn { border: 0; background: none; padding: 0; color: var(--accent); font: 500 14px var(--font); cursor: pointer; }\n.lp-link-btn:hover { text-decoration: underline; }\n\n/* kort */\n.lp-card { background: var(--surface); border: 1px solid var(--rule); border-radius: 16px; padding: 18px 20px 16px; min-width: 0; }\n.lp-card.lp-week-card { padding: 8px 12px 8px 4px; }\n.lp-card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 10px; }\n.lp-card-head h2 { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -.01em; display: flex; align-items: center; min-width: 0; }\n.lp-card-head small { color: var(--ink-3); font-size: 13.5px; white-space: nowrap; }\n.lp-card-foot { display: block; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--rule); font-size: 14px; color: var(--accent) !important; text-decoration: none !important; }\n.lp-card-foot:hover { text-decoration: underline !important; }\n\n/* forside */\n.lp-dhead { display: flex; justify-content: space-between; align-items: flex-end; gap: 14px 32px; flex-wrap: wrap; margin-bottom: 20px; }\n.lp-dhead h1 { font-size: clamp(28px, 2.4vw, 40px) !important; }\n.lp-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }\n.lp-pill { display: inline-flex; align-items: center; height: 32px; padding: 0 14px; border-radius: 16px; background: var(--surface); border: 1px solid var(--rule); color: var(--ink) !important; text-decoration: none !important; font-size: 14px; font-weight: 500; white-space: nowrap; }\n.lp-pill:hover { background: var(--sunk); }\n.lp-pill.is-danger { color: var(--danger) !important; border-color: color-mix(in srgb, var(--danger) 45%, var(--rule)); }\n.lp-pill.is-warn { color: var(--warn) !important; border-color: color-mix(in srgb, var(--warn) 45%, var(--rule)); }\n.lp-hero { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 16px; margin-bottom: 20px; }\n.lp-hero .lp-skel i { height: 120px; border-radius: 16px; }\n.lp-hero-item {\n  --h: 200; position: relative; display: flex; flex-direction: column; align-items: flex-start; text-align: left; padding: 20px 24px 20px 28px;\n  border-radius: 16px; border: 1px solid var(--rule); background: var(--surface); cursor: pointer; font: inherit; color: var(--ink); overflow: hidden; min-width: 0;\n}\n.lp-hero-item::before { content: \"\"; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: hsl(var(--h) 55% var(--dot-l)); }\n.lp-hero-item:hover { border-color: hsl(var(--h) 45% var(--dot-l)); }\n.lp-hero-item[data-n=\"nu\"] { background: var(--accent-soft); }\n.lp-hero-lbl { font-size: 14px; color: var(--ink-2); }\n.lp-hero-item strong { font-size: clamp(28px, 2.6vw, 44px); font-weight: 700; letter-spacing: -.025em; line-height: 1.08; margin-top: 4px; }\n.lp-hero-room { font-size: clamp(18px, 1.5vw, 24px); font-weight: 600; margin-top: 6px; }\n.lp-hero-sub { color: var(--ink-2); font-size: 15px; margin-top: 2px; }\n.lp-hero-item .lp-progress { width: 100%; max-width: 320px; margin-top: 14px; }\n.lp-hero-free { color: var(--ink-2); font-size: 17px; margin: 0; padding: 18px 0; }\n.lp-dgrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: start; }\n.lp-span2 { grid-column: span 2; }\n.lp-span2[hidden] { display: none; }\n@container (max-width: 1080px) { .lp-dgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }\n@container (max-width: 700px) { .lp-dgrid { grid-template-columns: minmax(0, 1fr); } .lp-span2 { grid-column: auto; } .lp-dhead { align-items: flex-start; } .lp-chips { justify-content: flex-start; } }\n.lp-dash .lp-rows .lp-row { padding: 9px 8px; }\n.lp-hwl { display: flex; flex-direction: column; }\n.lp-hwi { border-bottom: 1px solid var(--rule); }\n.lp-hwi:last-child { border-bottom: 0; }\n.lp-hwi summary { list-style: none; display: grid; grid-template-columns: 14px minmax(0, 1fr); gap: 6px; padding: 10px 6px; margin: 0 -6px; border-radius: 8px; cursor: pointer; }\n.lp-hwi summary::-webkit-details-marker { display: none; }\n.lp-hwi summary:hover { background: var(--sunk); }\n.lp-hwi summary .lp-sd { margin: 7px 0 0; }\n.lp-hwi-main { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 8px; min-width: 0; }\n.lp-hwi-main strong { font-weight: 600; }\n.lp-hwi-main small { color: var(--ink-3); font-size: 13px; }\n.lp-hwi-line { flex-basis: 100%; color: var(--ink-2); font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-hwi[open] .lp-hwi-line { display: none; }\n.lp-hwi-full { padding: 0 6px 12px 20px; font-size: 14.5px; line-height: 1.55; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }\n.lp-tsks { display: flex; flex-direction: column; }\n.lp-tsk { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 9px 6px; margin: 0 -6px; border-radius: 8px; color: var(--ink) !important; text-decoration: none !important; }\n.lp-tsk + .lp-tsk { border-top: 1px solid var(--rule); border-radius: 0; }\n.lp-tsk:hover { background: var(--sunk); border-radius: 8px; }\n.lp-tsk-date { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 44px; border-radius: 10px; background: var(--sunk); line-height: 1.05; }\n.lp-tsk-date b { font-size: 17px; }\n.lp-tsk-date small { font-size: 11px; color: var(--ink-2); }\n.lp-tsk.is-late .lp-tsk-date { background: color-mix(in srgb, var(--danger) 14%, var(--surface)); color: var(--danger); }\n.lp-tsk-main { display: flex; flex-direction: column; min-width: 0; }\n.lp-tsk-main strong { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-tsk-main small { display: flex; align-items: center; color: var(--ink-2); font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-tsk-main small .lp-sd { margin-right: 6px; }\n.lp-notices .lp-notice + .lp-notice { margin-top: 12px; }\n@container (min-width: 1081px) { .lp-notices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 28px; } .lp-notices .lp-notice + .lp-notice { margin-top: 0; padding-top: 0; border-top: 0; } }\n\n/* beskeder */\n.lp-mfolders { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 14px; }\n.lp-fchip { height: 34px; padding: 0 14px; border-radius: 17px; border: 1px solid var(--rule); background: var(--surface); color: var(--ink-2); font: 500 14px var(--font); cursor: pointer; }\n.lp-fchip:hover { color: var(--ink); }\n.lp-fchip.is-on { background: var(--ink); border-color: var(--ink); color: var(--surface); }\n.lp-fselect { height: 34px !important; min-height: 34px; border-radius: 17px !important; padding: 0 12px !important; background: var(--surface) !important; color: var(--ink) !important; border: 1px solid var(--rule) !important; font: 14px var(--font) !important; }\n.lp-msearch { margin-left: auto; height: 34px; min-width: 220px; padding: 0 14px !important; border-radius: 17px !important; border: 1px solid var(--rule) !important; background: var(--surface) !important; color: var(--ink) !important; font: 14px var(--font) !important; }\n.lp-mpanes { display: grid; grid-template-columns: minmax(300px, 420px) minmax(0, 1fr); background: var(--surface); border: 1px solid var(--rule); border-radius: 16px; overflow: hidden; height: max(480px, calc(100vh - 240px)); }\n.lp-mlist { overflow-y: auto; border-right: 1px solid var(--rule); }\n.lp-mitem { position: relative; display: flex; flex-direction: column; gap: 2px; padding: 12px 16px 12px 24px; border-bottom: 1px solid var(--rule); color: var(--ink) !important; text-decoration: none !important; }\n.lp-mitem[hidden] { display: none; }\n.lp-mitem:hover { background: var(--sunk); }\n.lp-mitem.is-sel { background: var(--accent-soft); }\n.lp-mitem.is-unread::before { content: \"\"; position: absolute; left: 10px; top: 19px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }\n.lp-mi-top { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; }\n.lp-mi-top strong { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-mi-top small { color: var(--ink-3); white-space: nowrap; font-size: 13px; }\n.lp-mi-subj { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-mitem.is-unread .lp-mi-top strong, .lp-mitem.is-unread .lp-mi-subj { font-weight: 700; }\n.lp-mi-to { font-size: 13px; color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lp-mread { overflow-y: auto; padding: 26px clamp(20px, 3vw, 44px) 40px; }\n.lp-mhead { padding-bottom: 16px; border-bottom: 1px solid var(--rule); }\n.lp-mhead h2 { margin: 0; font-size: clamp(22px, 1.8vw, 28px); font-weight: 700; letter-spacing: -.02em; line-height: 1.2; }\n.lp-mhead p { margin: 4px 0 0 !important; color: var(--ink-2); font-size: 14.5px; }\n.lp-mactions { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; align-items: center; }\n.lp-mmsg { margin-top: 18px; max-width: 820px; }\n.lp-mmsg header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 6px; }\n.lp-mmsg header strong { font-weight: 600; }\n.lp-mmsg header small { color: var(--ink-3); font-size: 13.5px; white-space: nowrap; }\n.lp-mmsg h3 { margin: 0 0 6px; font-size: 15px; }\n.lp-mbody { padding: 16px 20px; border: 1px solid var(--rule); border-radius: 14px; background: var(--bg); font-size: 15px; line-height: 1.6; overflow-wrap: anywhere; }\n.lp-mbody a { color: var(--accent); }\n.lp-mbody img { max-width: 100%; height: auto; }\n@container (max-width: 860px) {\n  .lp-mpanes { grid-template-columns: minmax(0, 1fr); height: auto; }\n  .lp-mread { display: none; }\n  .lp-mlist { border-right: 0; }\n  .lp-msearch { margin-left: 0; flex: 1 1 100%; }\n}\n\n/* opgaveaflevering */\n.lp-afl { --h: 200; position: relative; max-width: 1100px; margin: 0 auto 20px; padding: 24px 28px 24px 32px; background: var(--surface); border: 1px solid var(--rule); border-radius: 16px; font-family: var(--font); color: var(--ink); overflow: hidden; }\n.lp-afl::before { content: \"\"; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: hsl(var(--h) 55% var(--dot-l)); }\n.lp-afl-subj { display: flex; align-items: center; gap: 8px; margin: 0 !important; color: var(--ink-2); font-size: 15px; }\n.lp-afl-subj .lp-sd { margin: 0; }\n.lp-afl-subj small { color: var(--ink-3); font-size: 13.5px; }\n.lp-afl h1 { margin: 6px 0 0; font-size: clamp(24px, 2.2vw, 34px); font-weight: 700; letter-spacing: -.02em; line-height: 1.15; color: var(--ink); }\n.lp-afl-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px 24px; margin: 18px 0 4px; padding: 16px 0; border-block: 1px solid var(--rule); }\n.lp-afl-facts dt { font-size: 13px; color: var(--ink-3); }\n.lp-afl-facts dd { margin: 2px 0 0; font-size: 15px; display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: baseline; }\n.lp-afl-facts .is-grade dd { font-size: 24px; font-weight: 700; }\n.lp-afl-desc h2 { margin: 16px 0 6px; font-size: 15px; font-weight: 700; }\n.lp-afl-go { margin-top: 18px; }\nhtml.lp-aflpage .ls-elevaflevering-root { max-width: 1100px; margin: 0 auto; }\nhtml.lp-aflpage .lp-afl-hasinfo .lp-afl-info { display: none !important; }\nhtml.lp-aflpage .ls-elevaflevering-root .ls-std-island-layout-ltr { flex-direction: column; flex-wrap: nowrap; }\nhtml.lp-aflpage .ls-elevaflevering-root .ls-std-island-layout-ltr > section { width: 100% !important; flex: none !important; }\nhtml.lp-aflpage .lp-afl-entries { order: -1; }\nhtml.lp-aflpage .ls-elevaflevering-root .islandHeaderRight { display: none !important; }\nhtml.lp-aflpage .lp-afl-entries textarea { width: 100% !important; min-height: 110px; }\n\n/* studieplan */\n.lp-spgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 18px; align-items: start; }\n#lp-app:has(.lp-spgrid) { max-width: 1800px; }\n.lp-sp .lp-card-head h2 .lp-sd { width: 10px; height: 10px; }\n.lp-sp-now, .lp-sp-next { display: flex; flex-direction: column; gap: 1px; }\n.lp-sp-now > span:first-child, .lp-sp-next > span:first-child { font-size: 13px; color: var(--ink-3); }\n.lp-sp-now a { color: var(--ink) !important; text-decoration: none !important; }\n.lp-sp-now a:hover strong { text-decoration: underline; }\n.lp-sp-now strong { font-size: 18px; font-weight: 700; line-height: 1.3; }\n.lp-sp-now small, .lp-sp-next small { color: var(--ink-2); font-size: 13.5px; }\n.lp-sp-now .lp-progress { margin-top: 8px; }\n.lp-sp-next { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--rule); }\n.lp-sp-next a { color: var(--ink) !important; font-weight: 500; }\n.lp-sp-none { padding: 4px 0; }\n.lp-sp-more { margin-top: 12px; }\n.lp-sp-more summary { cursor: pointer; color: var(--accent); font-size: 14px; }\n.lp-sp-group { margin: 10px 0 4px !important; font-size: 13px; color: var(--ink-3); }\n.lp-sp-more ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }\n.lp-sp-more li { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; }\n.lp-sp-more li a { color: var(--ink) !important; }\n.lp-sp-more li small { color: var(--ink-3); white-space: nowrap; }\n\n/* 1.5 rettelser efter live-test */\nhtml.lp-on[data-lp-theme=\"dark\"] { color-scheme: dark; }\nhtml.lp-on[data-lp-theme=\"light\"] { color-scheme: light; }\nhtml.lp-on section.lf-island, html.lp-on .ls-island-elevated, html.lp-on .ls-island-outlined, html.lp-on .ls-island-filled { outline: none !important; }\nhtml.lp-on .ls-card-filled { background: transparent !important; border: 0 !important; box-shadow: none !important; outline: none !important; padding: 0 !important; }\n#lp-app :is(h1, h2, h3, h4, h5), #lp-drawer :is(h2, h3, h4, h5), .lp-afl :is(h1, h2, h3) { color: var(--ink) !important; }\n.lp-nav { overflow-x: hidden; scrollbar-width: thin; }\n.lp-more-item { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }\n.lp-more-list { padding-left: 34px; }\n.lp-mlist, .lp-mread, .lp-dr-body { scrollbar-width: thin; }\nhtml.lp-aflpage .ls-elevaflevering-root section.lf-island { width: 100% !important; max-width: none !important; flex: none !important; }\nhtml.lp-aflpage .lp-afl-students.lp-afl-redundant { display: none !important; }\n\n/* =====================================================================\n   1.6: samme skal p\u00e5 alle sider\n   ===================================================================== */\nhtml.lp-on { --page-max: 1760px; --page-pad: clamp(16px, 2.6vw, 48px); --page-top: clamp(20px, 2.4vw, 40px); }\n\n/* samme bredde og placering overalt */\n#lp-app, #lp-app.lp-dash, #lp-app.lp-msgview, #lp-app:has(.lp-spgrid) { box-sizing: border-box; max-width: var(--page-max) !important; margin: 0 auto !important; padding: var(--page-top) var(--page-pad) 64px !important; }\nhtml.lp-on .outerContentFrame { padding: 0 0 64px !important; }\nhtml.lp-on .outerContentFrame > .ls-content-container { box-sizing: border-box; width: auto !important; max-width: var(--page-max) !important; margin-inline: auto !important; padding: var(--page-top) var(--page-pad) 0 !important; }\nhtml.lp-shell .ls-master-pageheader { display: none !important; }\n\n/* samme sidehoved overalt */\n.lp-vhead { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px 20px; flex-wrap: wrap; margin: 0 0 16px; font-family: var(--font); }\n#lp-app .lp-vhead h1, #lp-shell-head .lp-vhead h1 { font-size: clamp(28px, 2.2vw, 36px) !important; font-weight: 700 !important; letter-spacing: -.025em; line-height: 1.15; margin: 0 !important; color: var(--ink) !important; font-family: var(--font); }\n.lp-vhead-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }\n.lp-viewsub { margin: -4px 0 18px !important; color: var(--ink-2); font-size: 15px; font-family: var(--font); }\n.lp-vhead + .lp-viewsub { margin-top: -10px !important; }\n.lp-tabs { margin: 0 0 22px !important; font-family: var(--font); }\n.lp-tabs + .lp-viewsub { margin-top: -8px !important; }\n.lp-tabs a:hover { text-decoration: none !important; }\n#lp-shell-head { font-family: var(--font); color: var(--ink); }\n#lp-shell-head .lp-btn { text-decoration: none !important; }\n\n/* kort og Lectios kasser ser ens ud */\n.lp-card, .lp-sheet, html.lp-on section.lf-island { border-radius: 16px !important; border: 1px solid var(--rule) !important; background: var(--surface) !important; }\n.lp-card { padding: 18px 22px !important; }\n.lp-card.lp-week-card { padding: 8px 12px 8px 4px !important; }\n.lp-sheet { padding: 4px 22px 18px !important; }\nhtml.lp-on section.lf-island { margin: 0 0 20px !important; }\nhtml.lp-on .ls-std-island-layout-ltr > section.lf-island, html.lp-on .ls-std-island-layout-col > section.lf-island { margin: 0 !important; }\nhtml.lp-on .ls-std-island-layout-ltr, html.lp-on .ls-std-island-layout-col { gap: 20px !important; }\nhtml.lp-on section.lf-island .islandHeaderContainer { border-bottom: 0 !important; padding: 18px 22px 0 !important; }\nhtml.lp-on section.lf-island .islandHeader { font-size: 17px !important; font-weight: 700 !important; }\nhtml.lp-on section.lf-island .islandContent { padding: 10px 22px 18px !important; }\n.lp-card-head h2, .lp-group h2 { font-size: 17px !important; font-weight: 700 !important; }\n\n/* tabeller i kasser flugter med overskriften ligesom i de nye sider */\nhtml.lp-on section.lf-island .islandContent table :is(td, th):first-child { padding-left: 0 !important; }\nhtml.lp-on section.lf-island .islandContent table :is(td, th):last-child { padding-right: 0 !important; }\nhtml.lp-on section.lf-island .islandContent table th { border-bottom: 1px solid var(--rule) !important; }\n\n/* detaljesider flugter med titlen */\n.lp-afl, html.lp-aflpage .ls-elevaflevering-root { max-width: none !important; margin-left: 0 !important; margin-right: 0 !important; }\n.lp-afl { margin-bottom: 20px !important; }\nhtml.lp-on #masterContent, html.lp-on .ls-master-container1, html.lp-on .ls-master-container2, html.lp-on .outerContentFrame { width: auto !important; max-width: none !important; margin-left: 0 !important; margin-right: 0 !important; }\nhtml.lp-on [id$=\"helptipDiv\"] { display: none !important; }\nhtml.lp-on #masterContent, html.lp-on .ls-master-container1, html.lp-on .ls-master-container2 { display: block !important; }\nhtml.lp-on { scrollbar-gutter: stable; }\n\n/* lektionsside i samme stil som opgaveaflevering */\nhtml.lp-actpage .ls-std-toolbar-filled, html.lp-actpage nav.ls-std-rowblock, html.lp-actpage .ls-std-toolbar,\nhtml.lp-actpage .lectioTabToolbar, html.lp-actpage .ls-tocContainer-outer, html.lp-actpage [id$=\"tocAndToolbar_toolbaroutercontainer\"],\nhtml.lp-actpage [id$=\"actHeader\"] { display: none !important; }\nhtml.lp-actpage .buttonlink:has(a[href*=\"forloeb_vis\"]), html.lp-actpage :is(div, span):has(> .buttonlink a[href*=\"forloeb_vis\"]) { display: none !important; }\nhtml.lp-actpage .ls-tocandcontentparent, html.lp-actpage .ls-texteditor-container, html.lp-actpage .ls-tocContent-outer, html.lp-actpage .ls-texteditor-paper-container { display: block !important; width: auto !important; max-width: none !important; margin: 0 !important; padding: 0 !important; border: 0 !important; background: transparent !important; }\nhtml.lp-actpage #homeworkContentContainer { max-width: none !important; margin: 0 !important; padding: 18px 22px !important; border-radius: 16px !important; font-size: 15px; line-height: 1.6; min-height: 0 !important; height: auto !important; }\n.lp-act-cardhead h2 { margin: 0 0 6px; font-size: 17px; font-weight: 700; color: var(--ink) !important; font-family: var(--font); }\nhtml.lp-actpage #homeworkContentContainer .ls-paper-section-heading { font-size: 15px !important; font-weight: 700 !important; margin: 16px 0 6px !important; color: var(--ink) !important; }\nhtml.lp-actpage #homeworkContentContainer hr { border: 0 !important; border-top: 1px solid var(--rule) !important; margin: 12px 0 !important; }\nhtml.lp-actpage #homeworkContentContainer article.lc-display-fragment { margin: 6px 0 !important; }\nhtml.lp-actpage #homeworkContentContainer article.lc-display-fragment > h1 { display: flex; align-items: center; gap: 8px; margin: 0 !important; padding: 9px 12px !important; border-radius: 8px; background: var(--sunk) !important; font-size: 15px !important; font-weight: 500 !important; }\nhtml.lp-actpage #homeworkContentContainer article.lc-display-fragment > h1 a { color: var(--accent) !important; }\nhtml.lp-actpage #homeworkContentContainer article.lc-display-fragment img { max-height: 18px; width: auto; }\n.lp-afl-subj .lp-flag { margin-left: 4px; }\n.lp-afl-facts dd a { color: var(--accent) !important; }\n.lp-sep-dot { color: var(--ink-3); }\nhtml.lp-on .outerContentFrame .ls-content { display: block !important; width: auto !important; }\n#lp-shell-head svg { width: 18px; height: 18px; flex: none; }\n.lp-afl-facts dd > .lp-flist a + a::before { content: \", \"; color: var(--ink-3); }\nhtml.lp-actpage #PrintAktivititetArea, html.lp-actpage .ls-toccontent-container, html.lp-actpage .ls-tabs4, html.lp-actpage .lectioTabContent,\nhtml.lp-actpage .ls-texteditor-container, html.lp-actpage .ls-tocandcontentparent, html.lp-actpage .ls-tocContent-outer,\nhtml.lp-actpage .ls-texteditor-paper-container, html.lp-actpage #homeworkContentContainer { display: block !important; width: auto !important; max-width: none !important; min-width: 0 !important; float: none !important; }\n"; document.head.appendChild(s);
})();
/* Lectio+ : et moderne lag oven på Lectio */
(() => {
  'use strict';
  if (window.top !== window) return;
  document.documentElement.dataset.lpLoaded = '1';

  const m = location.pathname.match(/^\/lectio\/(\d+)\//i);
  if (!m) return;
  const SCHOOL = m[1];
  const BASE = `/lectio/${SCHOOL}/`;
  const PAGE = location.pathname.slice(BASE.length).toLowerCase();
  const logoutLink = document.querySelector('a[href*="logout.aspx"]');
  if (!logoutLink) { document.documentElement.classList.remove('lp-on', 'lp-takeover', 'lp-boot'); return; } // ikke logget ind

  /* ---------------- indstillinger ---------------- */
  const DEFAULTS = { enabled: true, theme: 'auto', dashboard: true, skema: true, views: true, hideDone: false };
  const hasChrome = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync;
  function loadSettings() {
    return new Promise((res) => {
      if (hasChrome) {
        try { chrome.storage.sync.get(DEFAULTS, (s) => res({ ...DEFAULTS, ...s })); return; } catch (e) { /* fald tilbage */ }
      }
      let s = {};
      try { s = JSON.parse(localStorage.getItem('lp-settings') || '{}'); } catch (e) { /* tom */ }
      res({ ...DEFAULTS, ...s });
    });
  }
  function saveSetting(key, val) {
    if (hasChrome) { try { chrome.storage.sync.set({ [key]: val }); return; } catch (e) { /* fald tilbage */ } }
    try {
      const s = JSON.parse(localStorage.getItem('lp-settings') || '{}');
      s[key] = val; localStorage.setItem('lp-settings', JSON.stringify(s));
    } catch (e) { /* ignorer */ }
  }

  /* ---------------- hjælpere ---------------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const DAYS = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const abs = (href) => { if (!href || href === '#' || /^javascript:/i.test(href)) return null; try { return new URL(href, location.origin + BASE).href; } catch (e) { return null; } };
  const num = (s) => { const v = parseFloat(String(s).replace(',', '.').replace(/[^\d.\-]/g, '')); return isNaN(v) ? null : v; };

  function isoWeek(d) {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = t.getUTCFullYear();
    const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
    return { w, y };
  }
  const weekParam = (d) => { const { w, y } = isoWeek(d); return pad(w) + y; };
  const mondayOf = (d) => { const x = startOfDay(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };

  function dayLabel(d, now = new Date()) {
    const diff = Math.round((startOfDay(d) - startOfDay(now)) / 864e5);
    if (diff === 0) return 'i dag';
    if (diff === 1) return 'i morgen';
    if (diff === -1) return 'i går';
    if (diff > 1 && diff < 7) return DAYS[d.getDay()];
    return `${d.getDate()}. ${MONTHS[d.getMonth()].slice(0, 3)}`;
  }
  function relTime(d, now = new Date()) {
    const mins = Math.round((d - now) / 6e4);
    const a = Math.abs(mins);
    let txt;
    if (a < 60) txt = `${a} min`;
    else if (a < 60 * 24) txt = `${Math.floor(a / 60)} t ${a % 60 ? (a % 60) + ' min' : ''}`.trim();
    else txt = `${Math.round(a / 1440)} ${Math.round(a / 1440) === 1 ? 'dag' : 'dage'}`;
    return mins >= 0 ? `om ${txt}` : `for ${txt} siden`;
  }

  /* fag og farver */
  const SUBJECTS = {
    DA: 'Dansk', MA: 'Matematik', EN: 'Engelsk', TY: 'Tysk', FR: 'Fransk', SP: 'Spansk', BT: 'Bioteknologi', BI: 'Biologi',
    KE: 'Kemi', FY: 'Fysik', HI: 'Historie', SA: 'Samfundsfag', RE: 'Religion', ID: 'Idræt', MU: 'Musik', BK: 'Billedkunst',
    DE: 'Design', DD: 'Design og arkitektur', PS: 'Psykologi', NG: 'Naturvidenskabeligt grundforløb', AP: 'Almen sprogforståelse',
    OL: 'Oldtidskundskab', IN: 'Informatik', NV: 'Naturvidenskab', NA: 'Naturgeografi', GE: 'Geografi', MD: 'Mediefag',
    DR: 'Dramatik', FI: 'Filosofi', LA: 'Latin', IT: 'Italiensk', KI: 'Kinesisk', JA: 'Japansk', VØ: 'Virksomhedsøkonomi',
    EØ: 'Erhvervsøkonomi', AS: 'Astronomi', BIO: 'Biologi', MAT: 'Matematik', KS: 'Kultur og samfundsfag', SRP: 'SRP', SRO: 'SRO', DHO: 'DHO'
  };
  function subjectFrom(hold, title) {
    if (!hold) return null;
    const first = hold.split(',')[0].trim();
    const parts = first.split(/\s+/);
    const code = (parts.length > 1 ? parts[parts.length - 1] : parts[0]).toUpperCase();
    if (SUBJECTS[code]) return { code, name: SUBJECTS[code] };
    if (/^[A-ZÆØÅ]{1,4}\d?$/.test(code)) return { code, name: code };
    return null;
  }
  function hueFor(str) {
    if (!str) return 230;
    let h = 0;
    for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const palette = [230, 262, 292, 330, 352, 18, 36, 152, 172, 196, 210, 120];
    return palette[h % palette.length];
  }
  const shortTeacher = (t) => (t || '').replace(/[^,]*\(([^)]+)\)/g, '$1').trim();

  function cleanText(el) {
    if (!el) return '';
    const c = el.cloneNode(true);
    c.querySelectorAll('[class*="material"], .ls-fonticon, .ls-icon, img, script, style').forEach((x) => { if (x.tagName === 'IMG' || x.textContent.trim().length < 25) x.remove(); });
    return c.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim()
      .replace(/^(?:sms|bookmark|chat|description|attach_file|mail|check_circle|schedule|event)+/i, '').trim();
  }

  /* ---------------- hentning, kø og cache ---------------- */
  // Lectio behandler kun én forespørgsel ad gangen pr. bruger. Derfor hentes alt i en kø
  // og gemmes i sessionStorage, så sider vises med det samme fra cache.
  const memo = {};
  const INITIAL = (location.pathname.slice(BASE.length) + location.search).toLowerCase();
  const pageCtrl = new AbortController();
  addEventListener('pagehide', () => pageCtrl.abort());
  let queue = Promise.resolve();
  function fetchDoc(path) {
    if (path.toLowerCase() === INITIAL) return Promise.resolve(document);
    if (!memo[path]) {
      const run = () => {
        if (pageCtrl.signal.aborted) throw new Error('afbrudt');
        return fetch(BASE + path, { credentials: 'include', signal: pageCtrl.signal })
          .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
          .then((t) => new DOMParser().parseFromString(t, 'text/html'));
      };
      const p = queue.then(run, run);
      queue = p.catch(() => {});
      memo[path] = p.catch((e) => { delete memo[path]; throw e; });
    }
    return memo[path];
  }
  const idle = (fn, timeout = 2000) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 300));

  const CACHE_KEY = 'lp-cache:' + SCHOOL;
  const ISO_RE = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/;
  let cache = {};
  try { cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}', (k, v) => (typeof v === 'string' && ISO_RE.test(v) ? new Date(v) : v)) || {}; } catch (e) { cache = {}; }
  let cacheTimer = null;
  function saveCache() {
    clearTimeout(cacheTimer);
    cacheTimer = setTimeout(() => {
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
      catch (e) { Object.keys(cache).filter((k) => k.startsWith('act:')).forEach((k) => delete cache[k]); try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e2) { /* fuld */ } }
    }, 60);
  }
  function cachePut(key, data) {
    cache[key] = { t: Date.now(), d: data };
    if (key.startsWith('act:')) {
      const acts = Object.keys(cache).filter((k) => k.startsWith('act:')).sort((a, b) => cache[a].t - cache[b].t);
      while (acts.length > 40) delete cache[acts.shift()];
    }
    saveCache();
    if (/^(msgs|tasks|hw)$/.test(key) && typeof updateBadges === 'function') updateBadges();
    if (key === 'front' && typeof renderHoldGroup === 'function') renderHoldGroup();
  }
  const isFresh = (key, min) => cache[key] && Date.now() - cache[key].t < min * 6e4;

  const TTL = { skema: 10, hw: 10, tasks: 10, msgs: 3, abs: 60, grades: 60, front: 30 }; // minutter
  const SOURCES = {
    hw: { path: 'material_lektieoversigt.aspx', parse: (d) => parseHomework(d) },
    tasks: { path: 'OpgaverElev.aspx', parse: (d) => parseAssignments(d) },
    msgs: { path: 'beskeder2.aspx', parse: (d) => parseMessages(d) },
    abs: { path: 'subnav/fravaerelev.aspx', parse: (d) => parseAbsence(d) },
    grades: { path: 'grades/grade_report.aspx', parse: (d) => parseGrades(d) },
    front: { path: 'forside.aspx', parse: (d) => parseFront(d) }
  };
  // Viser cachede data med det samme og henter kun nyt hvis de er for gamle.
  function load(key, fetcher, ttlMin, onData, onError) {
    const c = cache[key];
    if (c) { try { onData(c.d, true); } catch (e) { console.warn('[Lectio+]', e); } }
    if (c && Date.now() - c.t < ttlMin * 6e4) return;
    fetcher().then((d) => { cachePut(key, d); onData(d, false); })
      .catch((e) => { if (!c && onError && !pageCtrl.signal.aborted) onError(e); });
  }
  const loadSrc = (key, onData, onError) => load(key, () => fetchDoc(SOURCES[key].path).then(SOURCES[key].parse), TTL[key], onData, onError);
  const skemaKey = (d) => 'skema:' + weekParam(d);
  const loadWeek = (d, onData, onError) => load(skemaKey(d), () => fetchDoc('SkemaNy.aspx?week=' + weekParam(d)).then((doc) => {
    const s = parseSkema(doc); if (!s) throw new Error('Skemaet kunne ikke læses'); return s;
  }), TTL.skema, onData, onError);

  /* sikker kopi af Lectio-indhold: kun tekst, links, lister og billeder */
  const KEEP = new Set(['A', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'SPAN', 'P', 'DIV', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'ARTICLE', 'SECTION', 'HR', 'IMG', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'BLOCKQUOTE', 'PRE', 'CODE', 'SUP', 'SUB']);
  const DROP = /^(SCRIPT|STYLE|LINK|META|INPUT|TEXTAREA|SELECT|BUTTON|IFRAME|OBJECT|EMBED|NOSCRIPT|TEMPLATE|MENUTEMPLATE|DIALOG|FORM|SVG)$/;
  function safeHtml(src, base) {
    const tpl = document.createElement('template');
    const walk = (node, parent) => {
      for (const ch of node.childNodes) {
        if (ch.nodeType === 3) { parent.appendChild(document.createTextNode(ch.textContent)); continue; }
        if (ch.nodeType !== 1 || DROP.test(ch.tagName)) continue;
        if (ch.matches('[class*="fonticon"], .lf-excel-exclude, .OnlyMobile, .ls-hidden-bigscreen')) continue;
        const tag = ch.tagName;
        if (!KEEP.has(tag)) { walk(ch, parent); continue; }
        let el;
        if (/^H\d$/.test(tag)) {
          if (ch.classList.contains('ls-paper-section-heading')) { el = document.createElement('h4'); el.className = 'lp-c-head'; }
          else if (ch.closest('article')) { el = document.createElement('p'); el.className = 'lp-c-file'; }
          else el = document.createElement('h5');
        } else el = document.createElement(tag.toLowerCase());
        if (tag === 'A') {
          const h = ch.getAttribute('href');
          let u = null;
          try { if (h && h !== '#' && !/^\s*javascript:/i.test(h)) u = new URL(h, base); } catch (e) { u = null; }
          if (u) { el.href = u.href; if (u.host !== location.host) { el.target = '_blank'; el.rel = 'noopener'; } }
        }
        if (tag === 'IMG') {
          const s = ch.getAttribute('src');
          try { if (!s) continue; el.src = new URL(s, base).href; } catch (e) { continue; }
          el.alt = ch.getAttribute('alt') || ''; el.loading = 'lazy';
        }
        if ((tag === 'TD' || tag === 'TH') && ch.getAttribute('colspan')) el.colSpan = +ch.getAttribute('colspan') || 1;
        if (ch.getAttribute('title')) el.title = ch.getAttribute('title');
        parent.appendChild(el);
        walk(ch, el);
      }
    };
    walk(src, tpl.content);
    return tpl.innerHTML;
  }

  /* ---------------- parsere ---------------- */
  function parseTip(t) {
    const o = { title: '', hold: '', teacher: '', room: '', homework: '', other: '', note: '', status: null, start: null, end: null, allDay: false };
    const pre = [];
    const secs = { homework: [], other: [], note: [] };
    let sec = null;
    let dated = false;
    for (const line of (t || '').split('\n')) {
      const l = line.trim();
      if (!dated) {
        const dm = l.match(/^(\d{1,2})\/(\d{1,2})-(\d{4})\s+(?:(\d{1,2}):(\d{2})\s+til\s+(?:(\d{1,2})\/(\d{1,2})-(\d{4})\s+)?(\d{1,2}):(\d{2})|Hele dagen)/);
        if (dm) {
          dated = true;
          const D = new Date(+dm[3], +dm[2] - 1, +dm[1]);
          if (dm[4]) {
            o.start = new Date(D); o.start.setHours(+dm[4], +dm[5]);
            o.end = dm[6] ? new Date(+dm[8], +dm[7] - 1, +dm[6]) : new Date(D);
            o.end.setHours(+dm[9], +dm[10]);
          } else { o.allDay = true; o.start = D; o.end = new Date(D); o.end.setHours(23, 59); }
          continue;
        }
        if (/^Ændret!?$/i.test(l)) { o.status = 'changed'; continue; }
        if (/^Aflyst!?$/i.test(l)) { o.status = 'cancelled'; continue; }
        if (l) pre.push(l);
        continue;
      }
      let mm;
      if ((mm = l.match(/^Hold:\s*(.*)/))) { o.hold = mm[1]; sec = null; continue; }
      if ((mm = l.match(/^Lærere?:\s*(.*)/))) { o.teacher = mm[1]; sec = null; continue; }
      if ((mm = l.match(/^Lokaler?:\s*(.*)/))) { o.room = mm[1]; sec = null; continue; }
      if ((mm = l.match(/^Elever?:\s*(.*)/))) { sec = null; continue; }
      if (/^Lektier:$/.test(l)) { sec = 'homework'; continue; }
      if (/^Øvrigt indhold:$/.test(l)) { sec = 'other'; continue; }
      if (/^Note:$/.test(l)) { sec = 'note'; continue; }
      if (sec) secs[sec].push(line.replace(/\s+$/, ''));
    }
    o.title = pre.join(' ');
    for (const k in secs) o[k] = secs[k].join('\n').trim();
    o.subject = subjectFrom(o.hold, o.title);
    return o;
  }

  function parseSkema(doc) {
    const table = doc.querySelector('table.s2skema');
    if (!table) return null;
    const wk = (doc.querySelector('.s2weekHeader')?.textContent || '').match(/Uge\s+(\d+)\D+(\d{4})/);
    const weekNo = wk ? +wk[1] : null;
    const year = wk ? +wk[2] : new Date().getFullYear();
    const headerRow = table.querySelector('tr.s2dayHeader');
    const dayCells = headerRow ? [...headerRow.cells].slice(1) : [];
    const days = dayCells.map((td) => {
      const t = td.textContent.trim();
      const mm = t.match(/(\S+)\s*\((\d{1,2})\/(\d{1,2})\)/);
      if (!mm) return { name: t, date: null };
      let y = year;
      if (weekNo <= 1 && +mm[3] === 12) y--;
      if (weekNo >= 52 && +mm[3] === 1) y++;
      return { name: mm[1], date: new Date(y, +mm[3] - 1, +mm[2]) };
    });
    const modules = [...doc.querySelectorAll('.s2module-info')].map((x) => {
      const mm = x.textContent.match(/(\d+)\.\s*modul\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      return mm ? { n: +mm[1], start: mm[2], end: mm[3] } : null;
    }).filter(Boolean);
    const lessons = [];
    table.querySelectorAll('a.s2skemabrik').forEach((a) => {
      const td = a.closest('td');
      const tr = td && td.parentElement;
      const info = parseTip(a.getAttribute('data-tooltip') || '');
      const day = Math.max(0, (td ? td.cellIndex : 1) - 1);
      lessons.push({
        ...info,
        day,
        allDay: info.allDay || (tr && tr.rowIndex === 2) || !info.start,
        href: abs(a.getAttribute('href')),
        changed: a.classList.contains('s2changed') || info.status === 'changed',
        cancelled: a.classList.contains('s2cancelled') || info.status === 'cancelled'
      });
    });
    lessons.forEach((l) => { if (!l.start && days[l.day]?.date) { l.start = days[l.day].date; } });
    lessons.sort((a, b) => (a.start || 0) - (b.start || 0));
    return { week: weekNo, year, days, lessons, modules };
  }

  function parseAssignments(doc) {
    const t = doc.querySelector('#s_m_Content_Content_ExerciseGV');
    if (!t) return [];
    return [...t.rows].slice(1).filter((r) => r.cells.length > 6).map((r) => {
      const c = r.cells;
      const fm = c[3].textContent.trim().match(/(\d{1,2})\/(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/);
      const due = fm ? new Date(+fm[3], +fm[2] - 1, +fm[1], +fm[4], +fm[5]) : null;
      return {
        week: c[0].textContent.trim(),
        hold: c[1].textContent.trim(),
        title: cleanText(c[2]),
        href: abs(c[2].querySelector('a')?.getAttribute('href')),
        due,
        hours: c[4].textContent.trim(),
        status: c[5].textContent.trim(),
        absence: c[6].textContent.trim(),
        waiting: c[7].textContent.trim(),
        grade: c[9] ? c[9].textContent.trim() : '',
        subject: subjectFrom(c[1].textContent.trim())
      };
    });
  }

  function parseHomework(doc) {
    const t = doc.querySelector('#s_m_Content_Content_MaterialLektieOverblikGV');
    if (!t) return [];
    const now = new Date();
    return [...t.rows].slice(1).filter((r) => r.cells.length >= 3).map((r) => {
      const c = r.cells;
      const dateTxt = c[0].textContent.trim();
      const dm = dateTxt.match(/(\d{1,2})\/(\d{1,2})/);
      let date = null;
      if (dm) {
        date = new Date(now.getFullYear(), +dm[2] - 1, +dm[1]);
        if (date < new Date(now.getFullYear(), now.getMonth() - 6, 1)) date.setFullYear(now.getFullYear() + 1);
      }
      const activity = cleanText(c[1]);
      const holdMatch = activity.match(/modul\s*-\s*([^•]+)•/) || activity.match(/^([^•]+)•/);
      return {
        dateTxt, date, activity,
        href: abs(c[1].querySelector('a')?.getAttribute('href')),
        text: (() => {
          const cl = c[2].cloneNode(true);
          cl.querySelectorAll('[class*="fonticon"], script, style').forEach((n) => n.remove());
          cl.querySelectorAll('br').forEach((n) => n.replaceWith('\n'));
          cl.querySelectorAll('div, p, li').forEach((n) => n.prepend('\n'));
          return cl.textContent.replace(/[ \t\u00a0]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
        })(),
        subject: subjectFrom(holdMatch ? holdMatch[1].trim() : '')
      };
    });
  }

  function parseMessages(doc) {
    const t = doc.querySelector('#s_m_Content_Content_threadGV_ctl00') || doc.querySelector('table[id*="threadGV"]');
    if (!t) return [];
    return [...t.rows].slice(1).filter((r) => r.cells.length > 7).map((r) => {
      const c = r.cells;
      const readImg = r.querySelector('[id$="readId"]');
      const src = readImg ? readImg.getAttribute('src') || '' : '';
      const oc = c[3].querySelector('[onclick]')?.getAttribute('onclick') || '';
      const mid = (oc.match(/_(\d{6,})'/) || [])[1];
      const link = c[3].querySelector('a');
      return {
        subject: cleanText(c[3]),
        from: cleanText(c[4]),
        first: cleanText(c[5]),
        to: cleanText(c[6]),
        changed: cleanText(c[7]),
        unread: !!src && !/\/mread\.gif/i.test(src),
        flagged: /flag/i.test((r.querySelector('[id$="flagId"]')?.getAttribute('src')) || '') && !/noflag|flagoff|flag_off/i.test(r.querySelector('[id$="flagId"]')?.getAttribute('src') || ''),
        href: mid ? `${BASE}beskeder2.aspx?type=visbesked&id=${mid}` : abs(link && link.getAttribute('href'))
      };
    });
  }

  function parseAbsence(doc) {
    const t = doc.querySelector('table[id$="SFTabStudentAbsenceDataTable"]');
    if (!t) return null;
    const rows = [];
    let total = null;
    [...t.rows].forEach((r) => {
      const c = [...r.cells].map((x) => x.textContent.trim());
      if (c.length < 5 || !/\d/.test(c.join(''))) return;
      if (!/%/.test(c[2] || '')) return;
      const frac = (c[1] || '').match(/([\d,]+)\s*\/\s*([\d,]+)/);
      const frac2 = (c[3] || '').match(/([\d,]+)\s*\/\s*([\d,]+)/);
      const row = {
        hold: c[0],
        mods: frac ? [num(frac[1]), num(frac[2])] : null,
        pct: num(c[2]),
        wTime: frac2 ? [num(frac2[1]), num(frac2[2])] : null,
        wPct: num(c[4])
      };
      if (/samlet|i alt|total/i.test(c[0])) total = row; else rows.push(row);
    });
    if (!total) {
      const sum = (k) => rows.reduce((a, r) => (r[k] ? [a[0] + r[k][0], a[1] + r[k][1]] : a), [0, 0]);
      const m1 = sum('mods'); const m2 = sum('wTime');
      total = { hold: 'Samlet', pct: m1[1] ? (m1[0] / m1[1]) * 100 : 0, wPct: m2[1] ? (m2[0] / m2[1]) * 100 : 0, mods: m1, wTime: m2 };
    }
    rows.sort((a, b) => (b.pct || 0) - (a.pct || 0));
    return { rows, total };
  }

  function parseGrades(doc) {
    const t = [...doc.querySelectorAll('table')].find((x) => x.rows.length > 1 && /Årskarakter/.test(x.rows[0].textContent) && /Fag/.test(x.rows[0].textContent));
    if (!t) return [];
    return [...t.rows].slice(2).filter((r) => r.cells.length >= 7).map((r) => {
      const c = [...r.cells].map((x) => x.textContent.trim().split('\n')[0].trim());
      return { subject: c[0], weight: num(c[1]), grade: c[2], ects: c[3], examWeight: num(c[4]), exam: c[5], examEcts: c[6] };
    });
  }

  /* ---------------- ikoner ---------------- */
  const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICONS = {
    home: I('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
    cal: I('<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
    book: I('<path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2Z"/><path d="M4 19.5A2 2 0 0 0 6 21.5h13"/>'),
    task: I('<rect x="4" y="3.5" width="16" height="18" rx="2.5"/><path d="M9 3.5V2.5h6v1M8.5 12l2.2 2.2L15.5 9.5"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>'),
    absence: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    star: I('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>'),
    plan: I('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>'),
    doc: I('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    books: I('<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="m16 5 3.5-1 2.5 15.5-3.5 1Z"/>'),
    survey: I('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>'),
    card: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14 10h4M14 13h3"/>'),
    user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    out: I('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17 5 12l5-5M5 12h11"/>'),
    search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    left: I('<path d="m15 18-6-6 6-6"/>'),
    right: I('<path d="m9 18 6-6-6-6"/>'),
    moon: I('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>'),
    sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    menu: I('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    x: I('<path d="M6 6l12 12M18 6 6 18"/>'),
    pin: I('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    ext: I('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    layers: I('<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>')
  };

  /* ---------------- navigation ---------------- */
  const NAV_MAIN = [
    { key: 'forside', label: 'Overblik', icon: 'home', path: 'forside.aspx', words: 'forside hjem dashboard' },
    { key: 'skema', label: 'Skema', icon: 'cal', path: 'SkemaNy.aspx', words: 'skema uge timer moduler' },
    { key: 'lektier', label: 'Lektier', icon: 'book', path: 'material_lektieoversigt.aspx', words: 'lektier' },
    { key: 'opgaver', label: 'Opgaver', icon: 'task', path: 'OpgaverElev.aspx', words: 'opgaver afleveringer frister' },
    { key: 'beskeder', label: 'Beskeder', icon: 'mail', path: 'beskeder2.aspx', words: 'beskeder indbakke mail' },
    { key: 'fravaer', label: 'Fravær', icon: 'absence', path: 'subnav/fravaerelev.aspx', words: 'fravær fravaer procent' },
    { key: 'karakterer', label: 'Karakterer', icon: 'star', path: 'grades/grade_report.aspx', words: 'karakterer karakter snit' }
  ];
  const NAV_SECOND = [
    { key: 'studieplan', label: 'Studieplan', icon: 'plan', path: 'studieplan.aspx?displaytype=ugeteksttabel', words: 'studieplan forløb kalender' },
    { key: 'dokumenter', label: 'Dokumenter', icon: 'doc', path: 'DokumentOversigt.aspx', words: 'dokumenter filer' }
  ];
  const NAV_MORE = [
    { group: 'Skema og kalender', items: [
      { key: 'dagsaendringer', label: 'Dagsændringer', path: 'SkemaDagsaendringer.aspx', words: 'ændringer aflyst i dag' },
      { key: 'ugeaendringer', label: 'Ugeændringer', path: 'SkemaUgeaendringer.aspx', words: 'ændringer uge' },
      { key: 'kalender', label: 'Månedskalender', path: 'kalender.aspx', words: 'kalender måned begivenheder' },
      { key: 'findskema', label: 'Find skema', path: 'FindSkema.aspx?type=laerer', words: 'find skema lærer lokale klasse elev' }
    ] },
    { group: 'Studie', items: [
      { key: 'uvb', label: 'Undervisningsbeskrivelse', path: 'studieplan/undervisningsbeskrivelse.aspx', words: 'undervisningsbeskrivelse forløb' },
      { key: 'kontaktbog', label: 'Kontaktbøger', path: 'teacherstudybook.aspx?type=contactbooks', words: 'kontaktbog' },
      { key: 'studieretning', label: 'Studieretning', path: 'studieretningElevValg.aspx', words: 'studieretning' },
      { key: 'valgfag', label: 'Valgfag', path: 'studieretningValgfag.aspx', words: 'valgfag ønsker' },
      { key: 'fagvalg', label: 'Fagvalg', path: 'fagvalg/fagvalgoversigt.aspx', words: 'fagvalg' },
      { key: 'karakterblad', label: 'Karaktermeddelelse', path: 'grades/grade_karakterblad.aspx', words: 'karaktermeddelelse karakterblad' },
      { key: 'fravaersaarsager', label: 'Fraværsårsager', path: 'subnav/fravaerelev_fravaersaarsager.aspx', words: 'fraværsårsager årsag' }
    ] },
    { group: 'Dig', items: [
      { key: 'boger', label: 'Bøger', path: 'BD/UserReservations.aspx', words: 'bøger boger lån' },
      { key: 'sporgeskema', label: 'Spørgeskemaer', path: 'spoergeskema/spoergeskema_rapport.aspx', words: 'spørgeskema' },
      { key: 'sps', label: 'SPS', path: 'Elev_SPS.aspx', words: 'sps støtte' },
      { key: 'studiekort', label: 'Studiekort', path: 'digitaltStudiekort.aspx', words: 'studiekort id' },
      { key: 'profil', label: 'Profil', path: 'indstillinger/studentIndstillinger.aspx', words: 'profil indstillinger' },
      { key: 'betalinger', label: 'Betalinger', path: 'MinButik.aspx', words: 'betalinger butik' },
      { key: 'adgangslog', label: 'Log', path: 'indstillinger/AdgangIndstillinger.aspx', words: 'log adgang login' }
    ] },
    { group: 'Lectio', items: [
      { key: 'hovedmenu', label: 'Hovedmenu', path: 'default.aspx', words: 'hovedmenu alt menu' },
      { key: 'kontakt', label: 'Kontakt', path: 'default.aspx?menu=kontakt', words: 'kontakt skolen' },
      { key: 'hjaelp', label: 'Hjælp', path: 'help/mainhelp.aspx', words: 'hjælp help' }
    ] }
  ];
  const PAL_ONLY = [
    { label: 'Find skema for elev', path: 'FindSkema.aspx?type=elev', words: 'find elev skema' },
    { label: 'Find skema for lærer', path: 'FindSkema.aspx?type=laerer', words: 'find lærer skema' },
    { label: 'Find skema for klasse', path: 'FindSkema.aspx?type=stamklasse', words: 'find klasse skema' },
    { label: 'Find skema for lokale', path: 'FindSkema.aspx?type=lokale', words: 'find lokale rum skema' },
    { label: 'Find skema for hold', path: 'FindSkema.aspx?type=hold', words: 'find hold skema' },
    { label: 'Find skema for ressource', path: 'FindSkema.aspx?type=ressource', words: 'find ressource skema' },
    { label: 'Avanceret skema', path: 'FindSkemaAdv.aspx', words: 'avanceret skema' },
    { label: 'Undervisningsbeskrivelser for skolen', path: 'studieplan/uvb_list_off.aspx', words: 'undervisningsbeskrivelser' }
  ];
  const MORE_ITEMS = NAV_MORE.flatMap((g) => g.items);
  const pathOnly = (p) => p.split('?')[0].toLowerCase();
  function activeKey() {
    const p = PAGE;
    const exact = NAV_MAIN.concat(NAV_SECOND, MORE_ITEMS).find((n) => pathOnly(n.path) === p && (!n.path.includes('?') || n.key === 'studieplan' || location.search.toLowerCase().includes(n.path.split('?')[1].toLowerCase())));
    if (exact) return exact.key;
    if (p.startsWith('forside')) return 'forside';
    if (p.startsWith('skemany') || p.startsWith('skema/') || p.startsWith('aktivitet/')) return 'skema';
    if (p.startsWith('findskema')) return 'findskema';
    if (p.startsWith('material_lektie')) return 'lektier';
    if (p.startsWith('opgave') || p.startsWith('elevaflevering') || p.startsWith('elev_aflevering')) return 'opgaver';
    if (p.startsWith('beskeder')) return 'beskeder';
    if (p.startsWith('subnav/fravaer')) return 'fravaer';
    if (p.startsWith('grades')) return 'karakterer';
    if (p.startsWith('studieplan') || p.startsWith('studieretning') || p.startsWith('fagvalg')) return 'studieplan';
    if (p.startsWith('dokument')) return 'dokumenter';
    if (p.startsWith('bd/')) return 'boger';
    if (p.startsWith('spoergeskema')) return 'sporgeskema';
    if (p.startsWith('indstillinger')) return 'profil';
    return null;
  }

  const TITLE_RE = /^(?:Eleven|Læreren)\s+(.+?)(?:,\s*([^\s,]+)|\s\(([^)]*)\))\s+-\s+(.+)$/s;
  let USER = null;
  {
    const m = document.title.match(TITLE_RE);
    if (m) USER = { name: m[1].trim(), cls: (m[2] || (m[3] || '').split(/\s+/)[0] || '').trim() };
    try {
      if (USER) sessionStorage.setItem('lp-user:' + SCHOOL, JSON.stringify(USER));
      else USER = JSON.parse(sessionStorage.getItem('lp-user:' + SCHOOL) || 'null');
    } catch (e) { /* ignorer */ }
    USER = USER || { name: '', cls: '' };
    USER.first = USER.name.split(' ')[0];
    if (USER.name && cache.__user && cache.__user !== USER.name) cache = {};
    if (USER.name) cache.__user = USER.name;
  }
  const schoolName = (document.title.split(' - ').pop() || 'Lectio').trim();

  /* ---------------- tema ---------------- */
  let settings = DEFAULTS;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    const t = settings.theme === 'auto' ? (mq.matches ? 'dark' : 'light') : settings.theme;
    document.documentElement.setAttribute('data-lp-theme', t);
    if (t === 'dark' && typeof darkFix === 'function' && document.documentElement.classList.contains('lp-on')) setTimeout(darkFix, 0);
  }
  mq.addEventListener?.('change', applyTheme);

  /* ---------------- sidebar ---------------- */
  const sideOpen = (() => { try { return JSON.parse(localStorage.getItem('lp-side-open') || '{}'); } catch (e) { return {}; } })();
  function rememberOpen(id, open) { sideOpen[id] = open; try { localStorage.setItem('lp-side-open', JSON.stringify(sideOpen)); } catch (e) { /* ignorer */ } }
  function buildSidebar() {
    const ak = activeKey();
    const item = (n) => `<a class="lp-nav-item${n.key === ak ? ' is-active' : ''}" href="${BASE + n.path}" data-key="${n.key}"${n.key === ak ? ' aria-current="page"' : ''}>${ICONS[n.icon]}<span>${esc(n.label)}</span><b class="lp-badge" data-badge="${n.key}" hidden></b></a>`;
    const moreActive = MORE_ITEMS.some((n) => n.key === ak);
    const more = NAV_MORE.map((g) => `<p class="lp-more-group">${esc(g.group)}</p>${g.items.map((n) => `<a class="lp-more-item${n.key === ak ? ' is-active' : ''}" href="${BASE + n.path}" title="${esc(n.label)}"${n.key === ak ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}`).join('');
    const side = document.createElement('aside');
    side.id = 'lp-side';
    side.innerHTML = `
      <div class="lp-brand">
        <div class="lp-brand-txt"><strong>Lectio<span>+</span></strong><small>${esc(schoolName)}</small></div>
      </div>
      <button class="lp-search-btn" type="button">${ICONS.search}<span>Søg</span><kbd>Ctrl K</kbd></button>
      <nav class="lp-nav" aria-label="Lectio">
        ${NAV_MAIN.map(item).join('')}
        <div class="lp-nav-sep"></div>
        ${NAV_SECOND.map(item).join('')}
        <details class="lp-more" data-id="hold" hidden><summary>${ICONS.layers}<span>Mine hold</span></summary><div class="lp-more-list" id="lp-hold-list"></div></details>
        <details class="lp-more" data-id="more"${moreActive || sideOpen.more ? ' open' : ''}><summary>${ICONS.menu}<span>Mere</span></summary><div class="lp-more-list">${more}</div></details>
      </nav>
      <div class="lp-side-foot">
        <div class="lp-me"><div><strong>${esc(USER.name || 'Lectio')}</strong><small>${esc(USER.cls)}</small></div></div>
        <div class="lp-foot-actions">
          <button type="button" class="lp-icon-btn" data-act="theme" title="Skift tema" aria-label="Skift tema">${ICONS.moon}</button>
          <button type="button" class="lp-icon-btn" data-act="original" title="Vis Lectios egen visning" aria-label="Vis Lectios egen visning">${ICONS.layers}</button>
          <a class="lp-icon-btn" href="${esc(logoutLink.getAttribute('href'))}" title="Log ud" aria-label="Log ud">${ICONS.out}</a>
        </div>
      </div>`;
    document.body.appendChild(side);

    const top = document.createElement('div');
    top.id = 'lp-topbar';
    top.innerHTML = `<button type="button" class="lp-icon-btn" data-act="menu" aria-label="Menu">${ICONS.menu}</button><strong>Lectio<span>+</span></strong><button type="button" class="lp-icon-btn" data-act="search" aria-label="Søg">${ICONS.search}</button>`;
    document.body.appendChild(top);

    const scrim = document.createElement('div');
    scrim.id = 'lp-scrim';
    document.body.appendChild(scrim);

    side.querySelector('.lp-search-btn').addEventListener('click', openPalette);
    top.querySelector('[data-act=search]').addEventListener('click', openPalette);
    top.querySelector('[data-act=menu]').addEventListener('click', () => document.documentElement.classList.toggle('lp-menu-open'));
    scrim.addEventListener('click', () => document.documentElement.classList.remove('lp-menu-open'));
    side.querySelectorAll('details.lp-more').forEach((d) => d.addEventListener('toggle', () => rememberOpen(d.dataset.id, d.open)));
    side.querySelector('[data-act=theme]').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-lp-theme');
      settings.theme = cur === 'dark' ? 'light' : 'dark';
      saveSetting('theme', settings.theme);
      saveBoot();
      applyTheme();
    });
    side.querySelector('[data-act=original]').addEventListener('click', () => {
      sessionStorage.setItem('lp-original', '1');
      location.reload();
    });
    renderHoldGroup();
    updateBadges();
  }
  function renderHoldGroup() {
    const box = document.getElementById('lp-hold-list');
    const hold = cache.front?.d?.hold || [];
    if (!box || !hold.length) return;
    const here = location.href.split('#')[0];
    box.innerHTML = hold.map((h) => `<a class="lp-more-item${h.href === here ? ' is-active' : ''}" href="${esc(h.href)}">${subjDot(subjectFrom(h.name)?.code || h.name)}${esc(h.name)}</a>`).join('');
    const det = box.closest('details');
    det.hidden = false;
    if (sideOpen.hold || hold.some((h) => h.href === here)) det.open = true;
  }
  function setBadge(key, n) {
    const b = document.querySelector(`[data-badge="${key}"]`);
    if (!b) return;
    if (n > 0) { b.textContent = n > 99 ? '99+' : n; b.hidden = false; } else b.hidden = true;
  }
  function updateBadges() {
    const now = new Date();
    const today = startOfDay(now);
    if (cache.msgs) setBadge('beskeder', cache.msgs.d.filter((x) => x.unread).length);
    if (cache.tasks) setBadge('opgaver', cache.tasks.d.filter((t) => !/afleveret/i.test(t.status) && t.due && ((t.due > now && (t.due - now) / 864e5 < 7) || (t.due < now && /mangler/i.test(t.status)))).length);
    if (cache.hw) setBadge('lektier', cache.hw.d.filter((x) => x.date && x.date >= today && (x.date - today) / 864e5 <= 1).length);
  }

  /* ---------------- søgning (Ctrl+K) ---------------- */
  let paletteItems = [];
  function paletteData() {
    const out = [];
    const now = new Date();
    const page = (n, icon) => ({ group: 'Sider', label: n.label, sub: '', icon: n.icon || icon, href: BASE + n.path, words: n.words });
    NAV_MAIN.concat(NAV_SECOND).forEach((n) => out.push(page(n)));
    MORE_ITEMS.forEach((n) => out.push(page(n, 'right')));
    PAL_ONLY.forEach((n) => out.push(page(n, 'search')));
    (cache.front?.d?.hold || []).forEach((h) => out.push({ group: 'Hold', label: h.name, sub: subjectFrom(h.name)?.name || '', icon: 'layers', href: h.href, words: 'hold' }));
    const wk = cache[skemaKey(now)]?.d;
    if (wk) wk.lessons.forEach((l) => out.push({ group: 'Skema denne uge', label: l.subject?.name || l.title || 'Aktivitet', sub: `${l.start ? dayLabel(l.start, now) + (l.allDay ? '' : ' ' + hm(l.start)) : ''} ${l.room || ''}`.trim(), icon: 'cal', href: l.href || BASE + 'SkemaNy.aspx', words: `${l.hold} ${l.teacher} ${l.title}`, lesson: l, list: wk.lessons }));
    (cache.tasks?.d || []).forEach((t) => out.push({ group: 'Opgaver', label: t.title, sub: `${t.subject?.name || t.hold}, ${t.status.toLowerCase()}`, icon: 'task', href: t.href || BASE + 'OpgaverElev.aspx', words: t.hold }));
    (cache.hw?.d || []).forEach((x) => out.push({ group: 'Lektier', label: x.text.split('\n')[0].slice(0, 90), sub: `${x.dateTxt} ${x.subject?.name || ''}`, icon: 'book', href: x.href || BASE + 'material_lektieoversigt.aspx', words: x.text }));
    (cache.msgs?.d || []).forEach((x) => out.push({ group: 'Beskeder', label: x.subject, sub: x.from, icon: 'mail', href: x.href || BASE + 'beskeder2.aspx' }));
    return out;
  }
  function openPalette() {
    document.documentElement.classList.remove('lp-menu-open');
    let pal = document.getElementById('lp-palette');
    if (!pal) {
      pal = document.createElement('div');
      pal.id = 'lp-palette';
      pal.innerHTML = `<div class="lp-pal-box" role="dialog" aria-label="Søg i Lectio">
        <div class="lp-pal-in">${ICONS.search}<input type="text" placeholder="Søg efter side, hold, fag, opgave eller lektie" autocomplete="off" spellcheck="false" aria-label="Søg"><kbd>Esc</kbd></div>
        <div class="lp-pal-list" role="listbox"></div></div>`;
      document.body.appendChild(pal);
      pal.addEventListener('mousedown', (e) => { if (e.target === pal) closePalette(); });
      const input = pal.querySelector('input');
      input.addEventListener('input', () => renderPalette(input.value));
      input.addEventListener('keydown', (e) => {
        const items = [...pal.querySelectorAll('.lp-pal-item')];
        let i = items.findIndex((x) => x.classList.contains('is-sel'));
        if (e.key === 'ArrowDown') { e.preventDefault(); i = Math.min(items.length - 1, i + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); i = Math.max(0, i - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); items[i]?.click(); return; }
        else if (e.key === 'Escape') { closePalette(); return; }
        else return;
        items.forEach((x, j) => x.classList.toggle('is-sel', j === i));
        items[i]?.scrollIntoView({ block: 'nearest' });
      });
      pal.querySelector('.lp-pal-list').addEventListener('click', (e) => {
        const a = e.target.closest('.lp-pal-item');
        if (!a) return;
        const it = paletteItems[+a.dataset.i];
        if (it && it.lesson && !(e.ctrlKey || e.metaKey)) { e.preventDefault(); closePalette(); openLesson(it.lesson, it.list); }
      });
    }
    pal.classList.add('is-open');
    const input = pal.querySelector('input');
    input.value = '';
    renderPalette('');
    input.focus();
  }
  function closePalette() { document.getElementById('lp-palette')?.classList.remove('is-open'); }
  function renderPalette(q) {
    const pal = document.getElementById('lp-palette');
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const all = paletteData();
    paletteItems = (terms.length ? all.filter((it) => {
      const hay = `${it.label} ${it.sub} ${it.words || ''} ${it.group}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }) : all.filter((it) => it.group === 'Sider').slice(0, 9)).slice(0, 40);
    let lastGroup = null;
    pal.querySelector('.lp-pal-list').innerHTML = paletteItems.length ? paletteItems.map((it, i) => {
      const g = it.group !== lastGroup ? `<div class="lp-pal-group">${esc(it.group)}</div>` : '';
      lastGroup = it.group;
      return `${g}<a class="lp-pal-item${i === 0 ? ' is-sel' : ''}" role="option" data-i="${i}" href="${esc(it.href)}">${ICONS[it.icon] || ICONS.right}<span>${esc(it.label)}</span><small>${esc(it.sub)}</small></a>`;
    }).join('') : '<div class="lp-empty">Ingen resultater. Prøv et andet ord.</div>';
  }
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '') || document.activeElement?.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); openPalette(); }
    else if (k === '/' && !typing) { e.preventDefault(); openPalette(); }
    else if (k === 'escape') { closePalette(); closeModal(); }
    else if (drawerState && !typing && !e.altKey && !e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); stepLesson(e.key === 'ArrowLeft' ? -1 : 1); }
  });

  /* ---------------- lektionsvisning ---------------- */
  let drawerState = null;
  let drawerReturn = null;
  function closeModal() {
    if (!document.getElementById('lp-drawer')) return;
    document.getElementById('lp-drawer').remove();
    drawerState = null;
    document.documentElement.classList.remove('lp-drawer-open');
    if (drawerReturn && drawerReturn.isConnected) drawerReturn.focus();
  }
  function openLesson(l, list) {
    if (!l) return;
    if (!drawerState) drawerReturn = document.activeElement;
    const seq = (list && list.length ? list : [l]).filter((x) => x && x.start).slice()
      .sort((a, b) => (a.start - b.start) || ((b.allDay ? 1 : 0) - (a.allDay ? 1 : 0)));
    let idx = seq.indexOf(l);
    if (idx < 0) { seq.push(l); idx = seq.length - 1; }
    drawerState = { seq, idx };
    renderDrawer();
  }
  function stepLesson(d) {
    if (!drawerState) return;
    const n = drawerState.idx + d;
    if (n < 0 || n >= drawerState.seq.length) return;
    drawerState.idx = n;
    renderDrawer();
  }
  function loadActivity(href) {
    const id = (href.match(/absid=(\d+)/i) || [])[1] || href;
    const key = 'act:' + id;
    if (isFresh(key, 10)) return Promise.resolve(cache[key].d);
    const url = new URL(href, location.href);
    const rel = url.pathname.slice(BASE.length) + url.search;
    return fetchDoc(rel).then((doc) => {
      const box = doc.querySelector('#homeworkContentContainer');
      const ta = doc.querySelector('textarea.activity-note');
      const note = ta ? (ta.value || ta.textContent || '').trim() : '';
      let html = '';
      if (box) {
        const cl = box.cloneNode(true);
        cl.querySelectorAll('[id$="actHeader"], .ls-paper-subsection-separator').forEach((x) => x.remove());
        if (cl.textContent.trim()) html = safeHtml(cl, url.href);
      }
      const d = { html, note };
      cachePut(key, d);
      return d;
    });
  }
  function renderDrawer() {
    const { seq, idx } = drawerState;
    const l = seq[idx];
    const now = new Date();
    let dr = document.getElementById('lp-drawer');
    if (!dr) {
      dr = document.createElement('div');
      dr.id = 'lp-drawer';
      dr.innerHTML = '<div class="lp-dr-scrim"></div><aside class="lp-dr-panel" role="dialog" aria-modal="true" aria-label="Lektion" tabindex="-1"></aside>';
      document.body.appendChild(dr);
      dr.querySelector('.lp-dr-scrim').addEventListener('click', closeModal);
      dr.querySelector('.lp-dr-panel').addEventListener('click', (e) => {
        const b = e.target.closest('[data-dr]');
        if (!b) return;
        if (b.dataset.dr === 'x') closeModal(); else stepLesson(+b.dataset.dr);
      });
      document.documentElement.classList.add('lp-drawer-open');
    }
    const p = dr.querySelector('.lp-dr-panel');
    const live = !l.cancelled && !l.allDay && l.start <= now && now < l.end;
    const flag = l.cancelled ? '<span class="lp-flag is-danger">aflyst</span>' : l.changed ? '<span class="lp-flag is-warn">ændret</span>' : live ? '<span class="lp-flag is-ok">i gang</span>' : '';
    const when = `${cap(DAYS[l.start.getDay()])} ${l.start.getDate()}. ${MONTHS[l.start.getMonth()]}${l.allDay ? ', hele dagen' : `, ${hm(l.start)} til ${hm(l.end)}`}`;
    const prevL = seq[idx - 1];
    const nextL = seq[idx + 1];
    const navLabel = (x) => (x ? `${x.subject?.name || x.title || 'Aktivitet'}, ${dayLabel(x.start, now)}${x.allDay ? '' : ' ' + hm(x.start)}` : '');
    const tipBlock = (title, txt) => (txt ? `<section><h4 class="lp-c-head">${title}</h4><p class="lp-pre">${esc(txt.replace(/\s*\[\.\.\.\]\s*/g, ' ...'))}</p></section>` : '');
    const fromTip = tipBlock('Note', l.note) + tipBlock('Lektier', l.homework) + tipBlock('Øvrigt indhold', l.other);
    p.style.setProperty('--h', hueFor(l.subject?.code || l.title));
    p.innerHTML = `
      <header class="lp-dr-top">
        <div class="lp-dr-nav">
          <button type="button" class="lp-icon-btn" data-dr="-1"${prevL ? ` title="${esc(navLabel(prevL))}"` : ' disabled'} aria-label="Forrige lektion">${ICONS.left}</button>
          <button type="button" class="lp-icon-btn" data-dr="1"${nextL ? ` title="${esc(navLabel(nextL))}"` : ' disabled'} aria-label="Næste lektion">${ICONS.right}</button>
          <span class="lp-dr-count">${idx + 1} af ${seq.length}</span>
        </div>
        <button type="button" class="lp-icon-btn" data-dr="x" aria-label="Luk">${ICONS.x}</button>
      </header>
      <div class="lp-dr-body">
        <p class="lp-dr-subj">${subjDot(l.subject?.code || l.title)}<span>${esc(l.subject?.name || 'Aktivitet')}</span>${flag}</p>
        <h2>${esc(l.title || l.subject?.name || l.hold || 'Aktivitet')}</h2>
        <p class="lp-dr-when">${esc(when)}</p>
        ${live ? `<span class="lp-progress"><i style="width:${Math.round(((now - l.start) / (l.end - l.start)) * 100)}%"></i></span>` : ''}
        <dl class="lp-dr-meta">
          ${l.room ? `<div><dt>Lokale</dt><dd>${esc(l.room)}</dd></div>` : ''}
          ${l.teacher ? `<div><dt>${/,/.test(l.teacher) ? 'Lærere' : 'Lærer'}</dt><dd>${esc(l.teacher)}</dd></div>` : ''}
          ${l.hold ? `<div><dt>Hold</dt><dd>${esc(l.hold)}</dd></div>` : ''}
        </dl>
        <div class="lp-dr-content" aria-live="polite">
          ${l.href ? `${fromTip ? `<div class="lp-dr-tip">${fromTip}</div>` : ''}<p class="lp-dr-loading">Henter hele indholdet fra Lectio</p>` : (fromTip || '<p class="lp-empty">Ingen lektier eller noter.</p>')}
        </div>
      </div>
      ${l.href ? `<footer class="lp-dr-foot"><a class="lp-btn lp-btn-primary" href="${esc(l.href)}">Åbn lektionen i Lectio ${ICONS.ext}</a><span class="lp-dr-keys"><kbd>←</kbd> <kbd>→</kbd> skifter lektion</span></footer>` : ''}`;
    p.focus({ preventScroll: true });
    if (!l.href) return;
    const content = p.querySelector('.lp-dr-content');
    loadActivity(l.href).then((d) => {
      if (!drawerState || drawerState.seq[drawerState.idx] !== l || !content.isConnected) return;
      const noteHtml = d.note ? `<section><h4 class="lp-c-head">Note</h4><p class="lp-pre">${esc(d.note)}</p></section>` : '';
      content.innerHTML = noteHtml + (d.html ? `<div class="lp-act">${d.html}</div>` : '') ||
        '<p class="lp-empty">Ingen lektier eller noter til denne lektion.</p>';
    }).catch(() => {
      if (!content.isConnected) return;
      const ld = content.querySelector('.lp-dr-loading');
      if (ld) ld.textContent = 'Kunne ikke hente hele indholdet. Åbn lektionen i Lectio for at se det.';
    });
  }

  /* ---------------- komponenter ---------------- */
  const subjDot = (code) => `<i class="lp-sd" style="--h:${hueFor(code)}"></i>`;
  const skeleton = (n = 3) => `<div class="lp-skel">${'<i></i>'.repeat(n)}</div>`;
  const errBox = (e) => `<p class="lp-empty">Lectio svarede ikke. Prøv at genindlæse siden.<br><small>${esc(e?.message || e)}</small></p>`;
  const section = (title, href, body, cls = '') => `<section class="lp-sec ${cls}">
      <header><h2>${esc(title)}</h2>${href ? `<a class="lp-link" href="${href}">Åbn</a>` : ''}</header>${body}</section>`;
  const cap = (s) => s.replace(/^./, (c) => c.toUpperCase());
  const DAY_ABBR = { ma: 'mandag', ti: 'tirsdag', on: 'onsdag', to: 'torsdag', fr: 'fredag', 'lø': 'lørdag', 'sø': 'søndag' };
  // Lectio skriver fx "to 21/1 09:00". Det bliver til "torsdag 21/1 kl. 09:00".
  const niceTime = (s) => String(s || '').replace(/^(ma|ti|on|to|fr|lø|sø)\s+(\d{1,2}\/\d{1,2})(?:\s+(\d{1,2}:\d{2}))?/i, (m, d, dt, t) => `${DAY_ABBR[d.toLowerCase()]} ${dt}${t ? ' kl. ' + t : ''}`);

  function lessonRow(l, now, idx) {
    const live = !l.cancelled && l.start <= now && now < l.end;
    const past = l.end <= now;
    const prog = live ? Math.round(((now - l.start) / (l.end - l.start)) * 100) : 0;
    const note = l.cancelled ? '<span class="lp-flag is-danger">aflyst</span>' : l.changed ? '<span class="lp-flag is-warn">ændret</span>' : '';
    return `<button type="button" class="lp-row${live ? ' is-live' : ''}${past ? ' is-past' : ''}${l.cancelled ? ' is-cancelled' : ''}" data-li="${idx}">
      <span class="lp-row-time">${hm(l.start)}</span>
      <span class="lp-row-main">
        <span class="lp-row-title">${subjDot(l.subject?.code)}${esc(l.subject?.name || l.title || 'Aktivitet')}${note}</span>
        <span class="lp-row-sub">${esc([l.room, shortTeacher(l.teacher)].filter(Boolean).join(', '))}${l.homework ? '<span class="lp-hwmark">lektier</span>' : ''}</span>
        ${live ? `<span class="lp-progress"><i style="width:${prog}%"></i></span>` : ''}
      </span>
      <span class="lp-row-end">${hm(l.end)}</span>
    </button>`;
  }

  function dueText(due, status, now) {
    if (/afleveret/i.test(status)) return '<span class="lp-due is-ok">afleveret</span>';
    if (due < now) return '<span class="lp-due is-danger">mangler</span>';
    const hrs = (due - now) / 36e5;
    const cls = hrs < 24 ? 'is-danger' : hrs < 72 ? 'is-warn' : '';
    return `<span class="lp-due ${cls}">${esc(relTime(due, now))}</span>`;
  }

  /* ---------------- overblik (forside) ---------------- */
  function parseFront(doc) {
    const notices = [];
    const hold = [];
    doc.querySelectorAll('section.lf-island').forEach((s) => {
      const title = (s.querySelector('.dashboardLinkHeaderText, .dashboardTextHeader')?.textContent || '').trim();
      if (!title) return;
      if (/^hold og grupper/i.test(title)) {
        s.querySelectorAll('a[href]').forEach((a) => { const h = abs(a.getAttribute('href')); const n = a.textContent.trim(); if (h && n) hold.push({ name: n, href: h }); });
        return;
      }
      if (/^(lektier|opgaveaflevering|beskeder|i dag|i morgen|skema)/i.test(title)) return;
      const link = abs(s.querySelector('a.dashboardItemTitle')?.getAttribute('href'));
      const rows = [...s.querySelectorAll('table.dashboard tr')].map((tr) => {
        const info = tr.querySelector('td.infoCol') || tr.cells[0];
        const time = tr.querySelector('td.timeCol');
        return { html: info ? safeHtml(info, location.origin + BASE) : '', time: time ? time.textContent.trim() : '', attention: !!(time && time.classList.contains('attention')) };
      }).filter((r) => r.html.replace(/<[^>]+>/g, '').trim());
      if (rows.length) notices.push({ title, link, rows });
    });
    return { notices, hold };
  }

  async function renderDashboard(app) {
    const now = new Date();
    const today = startOfDay(now);
    const hour = now.getHours();
    const greet = hour < 10 ? 'Godmorgen' : hour < 12 ? 'God formiddag' : hour < 18 ? 'God eftermiddag' : 'God aften';
    const { w } = isoWeek(now);
    app.classList.add('lp-dash');
    const card = (id, title, link, linkLabel, body, cls = '') => `<section class="lp-card ${cls}" id="${id}">
        <header class="lp-card-head"><h2>${title}</h2>${link ? `<a class="lp-link" href="${link}">${linkLabel}</a>` : ''}</header>
        <div class="lp-card-body">${body}</div></section>`;
    app.innerHTML = `
      <header class="lp-dhead">
        <div><p class="lp-date">${esc(cap(DAYS[now.getDay()]))} ${now.getDate()}. ${esc(MONTHS[now.getMonth()])}, uge ${w}</p>
        <h1>${greet}${USER.first ? ', ' + esc(USER.first) : ''}</h1></div>
        <nav id="lp-chips" class="lp-chips" aria-label="Status"></nav>
      </header>
      <div id="lp-next" class="lp-hero">${skeleton(1)}</div>
      <div class="lp-dgrid">
        ${card('lp-c-day', 'I dag', BASE + 'SkemaNy.aspx', 'Hele ugen', skeleton(6))}
        ${card('lp-c-hw', 'Lektier', BASE + 'material_lektieoversigt.aspx', 'Alle lektier', skeleton(4))}
        ${card('lp-c-tasks', 'Afleveringer', BASE + 'OpgaverElev.aspx', 'Alle opgaver', skeleton(4))}
        ${card('lp-c-msgs', 'Beskeder', BASE + 'beskeder2.aspx', 'Indbakke', skeleton(3))}
        <section class="lp-card lp-span2" id="lp-c-front" hidden></section>
      </div>`;
    const setBody = (id, html, title) => {
      const c = document.getElementById(id);
      if (!c) return null;
      c.querySelector('.lp-card-body').innerHTML = html;
      if (title) c.querySelector('h2').textContent = title;
      return c;
    };

    /* status som små rolige pills */
    const chips = {};
    const writeChips = () => {
      const el = document.getElementById('lp-chips');
      if (!el) return;
      const out = [];
      if (chips.missing) out.push(`<a class="lp-pill is-danger" href="${BASE}OpgaverElev.aspx">${chips.missing} ${chips.missing === 1 ? 'aflevering mangler' : 'afleveringer mangler'}</a>`);
      if (chips.soon) out.push(`<a class="lp-pill" href="${BASE}OpgaverElev.aspx">${chips.soon} ${chips.soon === 1 ? 'aflevering' : 'afleveringer'} denne uge</a>`);
      if (chips.unread) out.push(`<a class="lp-pill" href="${BASE}beskeder2.aspx">${chips.unread} ${chips.unread === 1 ? 'ulæst besked' : 'ulæste beskeder'}</a>`);
      (chips.deadlines || []).forEach((d) => out.push(`<a class="lp-pill is-warn" href="${esc(d.link || '#lp-c-front')}">${esc(d.title)} senest ${esc(niceTime(d.time))}</a>`));
      if (chips.abs != null) out.push(`<a class="lp-pill${chips.abs >= 10 ? ' is-danger' : chips.abs >= 5 ? ' is-warn' : ''}" href="${BASE}subnav/fravaerelev.aspx">Fravær ${chips.abs.toFixed(1).replace('.', ',')} %</a>`);
      if (chips.avg != null) out.push(`<a class="lp-pill" href="${BASE}grades/grade_report.aspx">Snit ${chips.avg.toFixed(1).replace('.', ',')}</a>`);
      el.innerHTML = out.join('');
    };

    /* fra skolen: læses fra forsiden uden ekstra forespørgsel */
    try {
      const front = parseFront(document);
      cachePut('front', front);
      chips.deadlines = front.notices.flatMap((n) => n.rows.filter((r) => r.attention).map((r) => ({ title: n.title, time: r.time, link: n.link })));
      writeChips();
      if (front.notices.length) {
        const c = document.getElementById('lp-c-front');
        c.hidden = false;
        c.innerHTML = `<header class="lp-card-head"><h2>Fra skolen</h2></header><div class="lp-card-body lp-notices">${front.notices.map((n) => `
          <div class="lp-notice">
            <h3>${n.link ? `<a href="${esc(n.link)}">${esc(n.title)}</a>` : esc(n.title)}</h3>
            ${n.rows.map((r) => `<div class="lp-nrow"><div class="lp-ntext">${r.html}</div>${r.time ? `<span class="lp-ntime${r.attention ? ' is-warn' : ''}">${esc(niceTime(r.time))}</span>` : ''}</div>`).join('')}
          </div>`).join('')}</div>`;
        c.querySelectorAll('.lp-ntext').forEach((el) => {
          if (el.scrollHeight > el.clientHeight + 4) {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'lp-more-btn'; b.textContent = 'Læs mere';
            b.addEventListener('click', () => { const o = el.classList.toggle('is-open'); b.textContent = o ? 'Vis mindre' : 'Læs mere'; });
            el.after(b);
          }
        });
      }
    } catch (e) { console.warn('[Lectio+]', e); }

    /* skema: nu og næste øverst, dagens moduler i første kort */
    const weeks = { cur: null, next: null, askedNext: false };
    const knownLessons = () => (weeks.cur ? weeks.cur.lessons : []).concat(weeks.next ? weeks.next.lessons : []).filter((l) => l.start);
    /* lektier: kun næste skoledag, resten bag et klik */
    let hwData = null;
    const absId = (href) => ((href || '').match(/absid=(\d+)/i) || [])[1];
    const drawHomework = () => {
      if (!hwData) return;
      const upcoming = hwData.filter((x) => x.date && x.date > today).sort((a, b) => a.date - b.date);
      const todayLeft = hwData.filter((x) => x.date && sameDay(x.date, now));
      const showToday = todayLeft.length && hour < 12;
      const day = showToday ? today : upcoming[0]?.date;
      if (!day) { setBody('lp-c-hw', '<p class="lp-empty">Ingen lektier lige nu.</p>', 'Lektier'); return; }
      const items = (showToday ? todayLeft : upcoming.filter((x) => sameDay(x.date, day)));
      const later = hwData.filter((x) => x.date && x.date > day).length;
      const lessons = knownLessons();
      const body = `<div class="lp-hwl">${items.map((x, i) => {
        const id = absId(x.href);
        const lesson = id ? lessons.find((l) => absId(l.href) === id) : null;
        const lines = x.text.replace(/\s*\[\.\.\.\]\s*/g, ' ...').split('\n').map((s) => s.trim()).filter(Boolean);
        const modul = (x.activity.match(/(\d+)\.\s*modul/) || [])[1];
        return `<details class="lp-hwi">
          <summary>${subjDot(x.subject?.code)}<span class="lp-hwi-main"><strong>${esc(x.subject?.name || 'Lektie')}</strong>${lesson ? `<small>${hm(lesson.start)}</small>` : modul ? `<small>${modul}. modul</small>` : ''}<span class="lp-hwi-line">${esc(lines[0] || '')}</span></span></summary>
          <div class="lp-hwi-full"><p class="lp-pre">${esc(lines.join('\n'))}</p>
            ${lesson ? `<button type="button" class="lp-link-btn" data-hw="${i}">Se hele lektionen</button>` : x.href ? `<a class="lp-link" href="${esc(x.href)}">Åbn i Lectio</a>` : ''}</div>
        </details>`;
      }).join('')}</div>${later ? `<a class="lp-card-foot" href="${BASE}material_lektieoversigt.aspx">${later} ${later === 1 ? 'lektie' : 'lektier'} senere</a>` : ''}`;
      const c = setBody('lp-c-hw', body, `Lektier til ${dayLabel(day, now)}`);
      c.querySelectorAll('[data-hw]').forEach((b) => b.addEventListener('click', () => {
        const x = items[+b.dataset.hw];
        const lesson = lessons.find((l) => absId(l.href) === absId(x.href));
        if (lesson) openLesson(lesson, lessons);
      }));
    };
    const drawSchedule = () => {
      if (!weeks.cur) return;
      const all = knownLessons();
      const lessons = all.filter((l) => !l.allDay);
      const allDay = all.filter((l) => l.allDay);
      let targetDay = null;
      if (lessons.some((l) => sameDay(l.start, now) && l.end > now)) targetDay = today;
      else {
        const future = lessons.filter((l) => startOfDay(l.start) > today);
        if (future.length) targetDay = startOfDay(future[0].start);
        else if (!weeks.askedNext) {
          weeks.askedNext = true;
          const nxt = new Date(mondayOf(now)); nxt.setDate(nxt.getDate() + 7);
          loadWeek(nxt, (sk) => { weeks.next = sk; drawSchedule(); drawHomework(); });
        }
      }
      const dayLessons = targetDay ? lessons.filter((l) => sameDay(l.start, targetDay)) : [];
      const dayAll = targetDay ? allDay.filter((l) => sameDay(l.start, targetDay)) : [];
      const isToday = targetDay && sameDay(targetDay, now);
      const title = !targetDay ? 'Skema' : isToday ? 'I dag' : cap(dayLabel(targetDay, now));
      const seq = dayLessons.concat(dayAll);
      let body = dayAll.map((l) => `<button type="button" class="lp-event" data-li="${seq.indexOf(l)}">${esc(l.title || 'Begivenhed')}<small>hele dagen</small></button>`).join('');
      body += dayLessons.length ? `<div class="lp-rows">${dayLessons.map((l) => lessonRow(l, now, seq.indexOf(l))).join('')}</div>` : '<p class="lp-empty">Ingen moduler.</p>';
      const c = setBody('lp-c-day', body, title);
      c.querySelectorAll('[data-li]').forEach((b) => b.addEventListener('click', () => openLesson(seq[+b.dataset.li], seq)));

      const cur = dayLessons.find((l) => !l.cancelled && l.start <= now && now < l.end);
      const next = lessons.filter((l) => !l.cancelled && l.start > now)[0];
      const block = (lbl, l, sub, extra = '') => `<button type="button" class="lp-hero-item" data-n="${lbl}" style="--h:${hueFor(l.subject?.code)}">
          <span class="lp-hero-lbl">${lbl === 'nu' ? 'Nu' : cur ? 'Bagefter' : 'Næste time'}</span>
          <strong>${esc(l.subject?.name || l.title || 'Aktivitet')}</strong>
          <span class="lp-hero-room">${esc(l.room || 'Intet lokale')}</span>
          <span class="lp-hero-sub">${esc(sub)}</span>${extra}</button>`;
      let h = '';
      if (cur) {
        const prog = Math.round(((now - cur.start) / (cur.end - cur.start)) * 100);
        h += block('nu', cur, `${hm(cur.start)} til ${hm(cur.end)}, ${shortTeacher(cur.teacher)}`.replace(/, $/, ''), `<span class="lp-progress"><i style="width:${prog}%"></i></span>`);
      }
      if (next) {
        const when = sameDay(next.start, now) ? `kl. ${hm(next.start)}, ${relTime(next.start, now)}` : `${dayLabel(next.start, now)} kl. ${hm(next.start)}`;
        h += block('naeste', next, when);
      }
      const hero = document.getElementById('lp-next');
      if (!h && weeks.askedNext && !weeks.next) h = skeleton(1);
      hero.innerHTML = h || '<p class="lp-hero-free">Ingen flere timer i denne og næste uge.</p>';
      hero.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => openLesson(b.dataset.n === 'nu' ? cur : next, lessons)));
    };
    loadWeek(now, (sk) => { weeks.cur = sk; drawSchedule(); drawHomework(); }, (e) => {
      setBody('lp-c-day', errBox(e));
      document.getElementById('lp-next').innerHTML = '';
    });

    loadSrc('hw', (hw) => { hwData = hw; drawHomework(); }, (e) => setBody('lp-c-hw', errBox(e)));

    /* afleveringer: de mangler og de næste fem */
    loadSrc('tasks', (tasks) => {
      const open = tasks.filter((t) => !/afleveret/i.test(t.status) && t.due);
      const missing = open.filter((t) => t.due < now && /mangler/i.test(t.status)).sort((a, b) => b.due - a.due);
      const coming = open.filter((t) => t.due >= now).sort((a, b) => a.due - b.due);
      chips.missing = missing.length;
      chips.soon = coming.filter((t) => (t.due - now) / 864e5 < 7).length;
      writeChips();
      const row = (t, late) => `<a class="lp-tsk${late ? ' is-late' : ''}" href="${esc(t.href || BASE + 'OpgaverElev.aspx')}">
          <span class="lp-tsk-date"><b>${t.due.getDate()}</b><small>${esc(MONTHS[t.due.getMonth()].slice(0, 3))}</small></span>
          <span class="lp-tsk-main"><strong>${esc(t.title)}</strong><small>${subjDot(t.subject?.code)}${esc(t.subject?.name || t.hold)}, ${esc(DAYS[t.due.getDay()])} kl. ${hm(t.due)}</small></span>
          ${dueText(t.due, t.status, now)}</a>`;
      const shown = missing.map((t) => row(t, true)).concat(coming.slice(0, 5).map((t) => row(t)));
      const rest = coming.length - 5;
      setBody('lp-c-tasks', shown.length ? `<div class="lp-tsks">${shown.join('')}</div>${rest > 0 ? `<a class="lp-card-foot" href="${BASE}OpgaverElev.aspx">${rest} mere</a>` : ''}` : '<p class="lp-empty">Ingen kommende afleveringer.</p>');
    }, (e) => setBody('lp-c-tasks', errBox(e)));

    /* beskeder */
    loadSrc('msgs', (msgs) => {
      const unread = msgs.filter((x) => x.unread).length;
      chips.unread = unread; writeChips();
      setBody('lp-c-msgs', msgs.length ? `<div class="lp-msgs">${msgs.slice(0, 6).map((x) => `
        <a class="lp-msg${x.unread ? ' is-unread' : ''}" href="${esc(x.href || BASE + 'beskeder2.aspx')}">
          <span class="lp-msg-main"><strong>${esc(x.subject)}</strong><small>${esc(x.from)}</small></span>
          <span class="lp-msg-time">${esc(x.changed)}</span>
        </a>`).join('')}</div>` : '<p class="lp-empty">Indbakken er tom.</p>', unread ? `Beskeder, ${unread} ulæste` : 'Beskeder');
    }, (e) => setBody('lp-c-msgs', errBox(e)));

    /* fravær og snit som pills */
    loadSrc('abs', (a) => { if (a) { chips.abs = a.total.pct || 0; writeChips(); } });
    loadSrc('grades', (g) => {
      let ws = 0; let wt = 0;
      g.forEach((x) => { const v = num(x.grade); if (v != null && x.weight && /^-?\d+$/.test(x.grade.trim())) { ws += v * x.weight; wt += x.weight; } });
      if (wt) { chips.avg = ws / wt; writeChips(); }
    });

    setTimeout(() => {
      if (!document.getElementById('lp-app')) return;
      if (document.hidden) { document.addEventListener('visibilitychange', () => renderDashboard(app), { once: true }); return; }
      Object.keys(memo).forEach((k) => delete memo[k]);
      renderDashboard(app);
    }, 5 * 60 * 1000);
  }

  /* ---------------- ugeskema ---------------- */
  let weekToken = 0;
  function renderWeek(app, weekDate) {
    const token = ++weekToken;
    const now = new Date();
    const wp = weekParam(weekDate);
    const isCurrent = wp === weekParam(now);
    const { w } = isoWeek(weekDate);
    const mo = mondayOf(weekDate); const fr = new Date(mo.getTime() + 4 * 864e5);
    app.innerHTML = `${pageHead('Skema', `Uge ${w}, ${mo.getDate()}. ${MONTHS[mo.getMonth()]} til ${fr.getDate()}. ${MONTHS[fr.getMonth()]}`,
        `<button type="button" class="lp-btn" data-wk="-1" title="Forrige uge (Alt+venstre)" aria-label="Forrige uge">${ICONS.left}</button>
          <button type="button" class="lp-btn${isCurrent ? ' is-disabled' : ''}" data-wk="0">I dag</button>
          <button type="button" class="lp-btn" data-wk="1" title="Næste uge (Alt+højre)" aria-label="Næste uge">${ICONS.right}</button>
          <a class="lp-btn lp-btn-ghost" href="${BASE}SkemaNy.aspx?week=${wp}&lp=orig">Lectios visning</a>`)}
      <div id="lp-week" class="lp-card lp-week-card">${skeleton(8)}</div>`;
    app.querySelectorAll('[data-wk]').forEach((b) => b.addEventListener('click', () => {
      const d = +b.dataset.wk;
      const nd = d === 0 ? new Date() : new Date(weekDate.getTime() + d * 7 * 864e5);
      history.replaceState(null, '', `${BASE}SkemaNy.aspx?week=${weekParam(nd)}`);
      renderWeek(app, nd);
    }));
    const draw = (sk) => {
      if (token !== weekToken) return;
      const timed = sk.lessons.filter((l) => !l.allDay && l.start && l.end);
      const toMin = (s) => { const [a, b] = s.split(':').map(Number); return a * 60 + b; };
      let minM = sk.modules.length ? toMin(sk.modules[0].start) : 8 * 60;
      let maxM = sk.modules.length ? toMin(sk.modules[sk.modules.length - 1].end) : 16 * 60;
      timed.forEach((l) => { minM = Math.min(minM, l.start.getHours() * 60 + l.start.getMinutes()); maxM = Math.max(maxM, l.end.getHours() * 60 + l.end.getMinutes()); });
      const lastUsed = timed.reduce((mx, l) => Math.max(mx, l.end.getHours() * 60 + l.end.getMinutes()), minM + 4 * 60);
      maxM = Math.min(maxM, Math.max(lastUsed, minM + 6 * 60));
      minM = Math.floor(minM / 30) * 30; maxM = Math.ceil(maxM / 30) * 30;
      const PX = 1.15;
      const H = (maxM - minM) * PX;
      const hours = [];
      for (let t = Math.ceil(minM / 60) * 60; t <= maxM; t += 60) hours.push(t);
      const all = sk.lessons;
      const cols = sk.days.map((d, di) => {
        const isToday = d.date && sameDay(d.date, now);
        const dayAll = all.filter((l) => l.day === di && l.allDay);
        const dayTimed = timed.filter((l) => l.day === di);
        const lanes = [];
        dayTimed.forEach((l) => {
          let lane = lanes.findIndex((end) => end <= l.start);
          if (lane === -1) { lane = lanes.length; lanes.push(l.end); } else lanes[lane] = l.end;
          l._lane = lane;
        });
        dayTimed.forEach((l) => { l._lanes = Math.max(1, ...dayTimed.filter((o) => o.start < l.end && l.start < o.end).map((o) => o._lane + 1)); });
        const blocks = dayTimed.map((l) => {
          const top = ((l.start.getHours() * 60 + l.start.getMinutes()) - minM) * PX;
          const hgt = Math.max(22, ((l.end - l.start) / 6e4) * PX - 3);
          const live = !l.cancelled && l.start <= now && now < l.end;
          const width = 100 / l._lanes;
          return `<button type="button" class="lp-blk${l.cancelled ? ' is-cancelled' : ''}${l.changed ? ' is-changed' : ''}${live ? ' is-live' : ''}${l.end < now ? ' is-past' : ''}${hgt < 44 ? ' is-short' : ''}" data-li="${all.indexOf(l)}"
            style="--h:${hueFor(l.subject?.code)};top:${top}px;height:${hgt}px;left:calc(${width * l._lane}% + 3px);width:calc(${width}% - 6px)">
            <strong>${esc(l.subject?.name || l.title || 'Aktivitet')}</strong>
            <small>${hm(l.start)}${l.room ? ', ' + esc(l.room) : ''}</small>
            ${hgt > 60 && l.title && l.subject ? `<em>${esc(l.title)}</em>` : ''}
            <span class="lp-blk-icons">${l.homework ? '<i title="Lektier"></i>' : ''}</span>
          </button>`;
        }).join('');
        const nowM = now.getHours() * 60 + now.getMinutes();
        const nowLine = isToday && nowM >= minM && nowM <= maxM ? `<div class="lp-nowline" style="top:${(nowM - minM) * PX}px"></div>` : '';
        return `<div class="lp-day${isToday ? ' is-today' : ''}">
          <div class="lp-day-head"><span>${esc(d.name)}</span><b>${d.date ? d.date.getDate() : ''}</b></div>
          <div class="lp-day-all">${dayAll.map((l) => `<button type="button" class="lp-allday" data-li="${all.indexOf(l)}" style="--h:${hueFor(l.title)}">${esc(l.title || l.subject?.name || 'Begivenhed')}</button>`).join('')}</div>
          <div class="lp-day-body" style="height:${H}px">${hours.map((t) => `<div class="lp-hline" style="top:${(t - minM) * PX}px"></div>`).join('')}${blocks}${nowLine}</div>
        </div>`;
      }).join('');
      const anyAll = all.some((l) => l.allDay);
      const box = document.getElementById('lp-week');
      box.innerHTML = `<div class="lp-week${anyAll ? '' : ' no-allday'}">
        <div class="lp-gutter"><div class="lp-day-head"></div><div class="lp-day-all"></div><div class="lp-day-body" style="height:${H}px">${hours.map((t) => `<span style="top:${(t - minM) * PX}px">${pad(Math.floor(t / 60))}:00</span>`).join('')}</div></div>
        ${cols}</div>
        <div class="lp-legend"><span><i class="lp-lg-ch"></i>Ændret</span><span><i class="lp-lg-ca"></i>Aflyst</span><span><i class="lp-lg-hw"></i>Har lektier</span><span>Klik på et modul for at se lektier og noter</span></div>`;
      box.querySelectorAll('[data-li]').forEach((b) => b.addEventListener('click', () => openLesson(all[+b.dataset.li], all)));
    };
    const fail = (e) => { if (token === weekToken) document.getElementById('lp-week').innerHTML = errBox(e); };
    if (isCurrent && !/week=/i.test(INITIAL) && PAGE === 'skemany.aspx') {
      const sk = parseSkema(document);
      if (sk) { cachePut(skemaKey(now), sk); draw(sk); } else fail(new Error('Skemaet kunne ikke læses'));
    } else loadWeek(weekDate, draw, fail);
    // hent ugen efter i baggrunden så bladring føles øjeblikkelig
    const nextWeek = new Date(weekDate.getTime() + 7 * 864e5);
    if (!isFresh(skemaKey(nextWeek), TTL.skema)) idle(() => { if (token === weekToken) loadWeek(nextWeek, () => {}); }, 4000);
  }

  /* ---------------- forbedringer af originale sider ---------------- */
  function enhanceAssignments() {
    const t = document.querySelector('#s_m_Content_Content_ExerciseGV');
    if (!t) return;
    const now = new Date();
    const data = parseAssignments(document);
    const rows = [...t.rows].slice(1).filter((r) => r.cells.length > 6);
    rows.forEach((r, i) => {
      const d = data[i];
      if (!d) return;
      const st = d.status.toLowerCase();
      r.classList.add(st.includes('afleveret') ? 'lp-row-done' : st.includes('mangler') ? 'lp-row-missing' : 'lp-row-open');
      const cell = r.cells[5];
      if (cell && !cell.querySelector('.lp-chip')) {
        const cls = st.includes('afleveret') ? 'is-ok' : st.includes('mangler') ? 'is-danger' : d.due && d.due - now < 3 * 864e5 ? 'is-warn' : '';
        cell.innerHTML = `<span class="lp-chip ${cls}">${esc(d.status)}</span>`;
      }
      if (d.due && !st.includes('afleveret') && d.due > now) {
        const fc = r.cells[3];
        if (fc && !fc.querySelector('.lp-rel')) fc.insertAdjacentHTML('beforeend', `<small class="lp-rel">${esc(relTime(d.due, now))}</small>`);
      }
    });
    const open = data.filter((d) => !/afleveret/i.test(d.status)).length;
    const done = data.length - open;
    const bar = document.createElement('div');
    bar.className = 'lp-toolbar';
    bar.innerHTML = `<span><b>${open}</b> åbne</span><span><b>${done}</b> afleveret</span><span class="lp-muted">${data.length} i alt</span>
      <label class="lp-switch"><input type="checkbox" ${settings.hideDone ? 'checked' : ''}><i></i>Skjul afleverede</label>`;
    t.parentNode.insertBefore(bar, t);
    const cb = bar.querySelector('input');
    const apply = () => document.documentElement.classList.toggle('lp-hide-done', cb.checked);
    cb.addEventListener('change', () => { settings.hideDone = cb.checked; saveSetting('hideDone', cb.checked); apply(); });
    apply();
  }

  function originalPill() {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.id = 'lp-pill';
    pill.innerHTML = `Tilbage til Lectio<span>+</span>`;
    pill.addEventListener('click', () => {
      sessionStorage.removeItem('lp-original');
      const u = new URL(location.href); u.searchParams.delete('lp');
      location.href = u.href;
    });
    document.body.appendChild(pill);
  }


  /* ---------------- egne visninger: opgaver, lektier, fravær, karakterer ---------------- */
  const origLink = () => { const u = new URL(location.href); u.searchParams.set('lp', 'orig'); return u.href; };
  // Fælles sidehoved for alle sider: titel, handlinger til højre, faner og evt. en undertekst.
  function groupTitle() {
    const p = PAGE;
    if (p.startsWith('subnav/fravaer')) return 'Fravær';
    if (p.startsWith('grades/')) return 'Karakterer';
    if (/^(studieplan|studieretning|fagvalg\/|teacherstudybook)/.test(p)) return 'Studieplan';
    if (p.startsWith('indstillinger/') || p === 'minbutik.aspx') return 'Profil';
    if (p.startsWith('aktivitet/')) return 'Lektion';
    return '';
  }
  let shellActions = '';
  let shellTabs = '';
  const pageHead = (title, sub, actions = '') => `<header class="lp-vhead"><h1>${esc(title)}</h1>${actions ? `<div class="lp-vhead-actions">${actions}</div>` : ''}</header>${shellTabs || subTabs()}${sub ? `<p class="lp-viewsub">${sub}</p>` : ''}`;
  const viewHead = (title, sub, extra = '') => pageHead(groupTitle() || title, sub, `${extra}<a class="lp-btn lp-btn-ghost" href="${esc(origLink())}">Lectios visning</a>`);
  // Lectios egne sider får samme sidehoved som de nye sider.
  function buildPageShell() {
    const cc = document.querySelector('.outerContentFrame > .ls-content-container');
    if (!cc || document.getElementById('lp-shell-head')) return;
    const t = document.getElementById('s_m_HeaderContent_MainTitle') || document.querySelector('[id$="HeaderContent_MainTitle"], .maintitle');
    let title = (t ? t.textContent : '').trim();
    const m = title.match(TITLE_RE);
    if (m) title = m[4].trim();
    if (!title) { const dm = document.title.match(TITLE_RE); title = (dm ? dm[4] : document.title).split(' - ')[0].trim(); }
    title = groupTitle() || title.replace(/\s+oversigt$/i, '');
    const head = document.createElement('div');
    head.id = 'lp-shell-head';
    head.innerHTML = pageHead(title, '', shellActions);
    cc.prepend(head);
    head.querySelectorAll('[data-proxy]').forEach((b) => b.addEventListener('click', () => document.getElementById(b.dataset.proxy)?.click()));
    document.documentElement.classList.add('lp-shell');
  }
  // Lectios egne underfaner (fx Karaktermeddelelse og Fraværsårsager) vises også i de nye visninger.
  function subTabs() {
    const seen = new Set();
    const items = [];
    document.querySelectorAll('.ls-subnav-container a').forEach((a) => {
      if (a.closest('[id$="subnavigator_generic_tr"]')) return;
      const t = a.textContent.trim();
      const h = abs(a.getAttribute('href'));
      if (!t || !h || seen.has(t)) return;
      seen.add(t); items.push({ t, h });
    });
    if (items.length < 2) return '';
    const here = location.pathname.toLowerCase();
    return `<nav class="lp-tabs" aria-label="Undersider">${items.map((i) => { const on = new URL(i.h).pathname.toLowerCase() === here; return `<a href="${esc(i.h)}"${on ? ' class="is-on" aria-current="page"' : ''}>${esc(i.t)}</a>`; }).join('')}</nav>`;
  }
  function subjectFilter(app, items, attr = 'data-subj') {
    const subs = [...new Map(items.filter((x) => x.subject).map((x) => [x.subject.code, x.subject.name])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'da'));
    if (subs.length < 2) return '';
    setTimeout(() => {
      app.querySelectorAll('.lp-filter button').forEach((b) => b.addEventListener('click', () => {
        app.querySelectorAll('.lp-filter button').forEach((x) => x.classList.toggle('is-on', x === b));
        const v = b.dataset.f;
        app.querySelectorAll(`[${attr}]`).forEach((el) => { el.hidden = v !== '' && el.getAttribute(attr) !== v; });
        app.querySelectorAll('.lp-group').forEach((g) => { g.hidden = !g.querySelector(`[${attr}]:not([hidden])`); });
      }));
    });
    return `<div class="lp-filter" role="group" aria-label="Vis fag"><button type="button" class="is-on" data-f="">Alle fag</button>${subs.map(([c, n]) => `<button type="button" data-f="${esc(c)}">${subjDot(c)}${esc(n)}</button>`).join('')}</div>`;
  }

  function renderTasksView(app) {
    const now = new Date();
    const tasks = parseAssignments(document);
    const t = document.querySelector('#s_m_Content_Content_ExerciseGV');
    if (t) [...t.rows].slice(1).filter((r) => r.cells.length > 6).forEach((r, i) => { if (tasks[i]) tasks[i].note = r.cells[8] ? r.cells[8].innerText.trim() : ''; });
    const missing = tasks.filter((x) => /mangler/i.test(x.status)).sort((a, b) => (b.due || 0) - (a.due || 0));
    const open = tasks.filter((x) => !/afleveret|mangler/i.test(x.status)).sort((a, b) => (a.due || 0) - (b.due || 0));
    const done = tasks.filter((x) => /afleveret/i.test(x.status)).sort((a, b) => (b.due || 0) - (a.due || 0));
    const row = (x) => {
      const d = x.due;
      return `<a class="lp-task-row" href="${esc(x.href || '#')}" data-subj="${esc(x.subject?.code || '')}">
        <span class="lp-task-when">${d ? `<b>${d.getDate()}. ${esc(MONTHS[d.getMonth()].slice(0, 3))}</b><small>${esc(DAYS[d.getDay()].slice(0, 3))} kl. ${hm(d)}</small>` : ''}</span>
        <span class="lp-task-what"><strong>${esc(x.title)}</strong>
          <small>${subjDot(x.subject?.code)}${esc(x.subject?.name || x.hold)}${x.hours && x.hours !== '0,00' ? `, ${esc(x.hours)} elevtimer` : ''}${x.grade ? `, karakter ${esc(x.grade)}` : ''}</small>
          ${x.note ? `<span class="lp-task-note">${esc(x.note)}</span>` : ''}</span>
        <span class="lp-task-state">${d ? dueText(d, x.status, now) : esc(x.status)}${x.waiting && !/afleveret/i.test(x.status) ? `<small>${/elev/i.test(x.waiting) ? 'venter på dig' : /lærer/i.test(x.waiting) ? 'venter på læreren' : esc(x.waiting)}</small>` : ''}</span>
      </a>`;
    };
    const group = (title, list, cls = '') => list.length ? `<section class="lp-group ${cls}"><h2>${esc(title)} <span>${list.length}</span></h2><div class="lp-list">${list.map(row).join('')}</div></section>` : '';
    app.innerHTML = viewHead('Opgaver', `${open.length} åbne, ${missing.length} mangler, ${done.length} afleveret`) +
      subjectFilter(app, tasks) +
      `<div class="lp-sheet">${group('Mangler', missing, 'is-late')}${group('Kommende', open)}${open.length + missing.length === 0 ? '<p class="lp-empty">Ingen åbne opgaver.</p>' : ''}
       ${done.length ? `<details class="lp-group lp-done"><summary><h2>Afleveret <span>${done.length}</span></h2></summary><div class="lp-list">${done.map(row).join('')}</div></details>` : ''}</div>`;
  }

  function renderHomeworkView(app) {
    const now = new Date();
    const t = document.querySelector('#s_m_Content_Content_MaterialLektieOverblikGV');
    const items = parseHomework(document);
    const rows = t ? [...t.rows].slice(1).filter((r) => r.cells.length >= 3) : [];
    let doneSet = {};
    try { doneSet = JSON.parse(localStorage.getItem('lp-hw-done') || '{}'); } catch (e) { /* tom */ }
    const keyOf = (x) => { let h = 0; for (const ch of `${x.dateTxt}|${x.activity}|${x.text.slice(0, 80)}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'k' + h.toString(36); };
    const groups = new Map();
    items.forEach((x, i) => { x.node = rows[i] ? rows[i].cells[2] : null; x.key = keyOf(x); const k = x.date ? x.date.getTime() : x.dateTxt; if (!groups.has(k)) groups.set(k, { date: x.date, label: x.dateTxt, items: [] }); groups.get(k).items.push(x); });
    const modul = (a) => (a.match(/(\d+)\.\s*modul/) || [])[1];
    app.innerHTML = viewHead('Lektier', `${items.length} lektier de næste 14 dage. Sæt flueben når du er færdig.`) +
      subjectFilter(app, items) +
      `<div class="lp-sheet">${[...groups.values()].map((g) => `<section class="lp-group"><h2>${g.date ? esc(cap(dayLabel(g.date, now))) : esc(g.label)} <small>${g.date ? `${esc(DAYS[g.date.getDay()])} ${g.date.getDate()}/${g.date.getMonth() + 1}` : ''}</small></h2>
        <div class="lp-list">${g.items.map((x) => `<div class="lp-hw-item${doneSet[x.key] ? ' is-done' : ''}" data-subj="${esc(x.subject?.code || '')}" data-key="${x.key}">
          <label class="lp-check"><input type="checkbox" ${doneSet[x.key] ? 'checked' : ''} aria-label="Færdig"><i></i></label>
          <div class="lp-hw-body"><div class="lp-hw-top"><a href="${esc(x.href || '#')}">${subjDot(x.subject?.code)}<strong>${esc(x.subject?.name || 'Aktivitet')}</strong></a><small>${modul(x.activity) ? `${modul(x.activity)}. modul` : ''}</small></div>
          <div class="lp-hw-content" data-i="${items.indexOf(x)}"></div></div></div>`).join('')}</div></section>`).join('') || '<p class="lp-empty">Ingen lektier lige nu.</p>'}</div>`;
    app.querySelectorAll('.lp-hw-content').forEach((el) => {
      const x = items[+el.dataset.i];
      if (x.node) {
        const c = x.node.cloneNode(true);
        c.querySelectorAll('script, [class*="fonticon"]').forEach((n) => n.remove());
        while (c.firstChild) el.appendChild(c.firstChild);
      } else el.textContent = x.text;
    });
    app.querySelectorAll('.lp-hw-item input').forEach((cb) => cb.addEventListener('change', () => {
      const it = cb.closest('.lp-hw-item');
      it.classList.toggle('is-done', cb.checked);
      if (cb.checked) doneSet[it.dataset.key] = Date.now(); else delete doneSet[it.dataset.key];
      const cutoff = Date.now() - 60 * 864e5;
      Object.keys(doneSet).forEach((k) => { if (doneSet[k] < cutoff) delete doneSet[k]; });
      try { localStorage.setItem('lp-hw-done', JSON.stringify(doneSet)); } catch (e) { /* ignorer */ }
    }));
  }

  function renderAbsenceView(app) {
    const a = parseAbsence(document);
    if (!a) { app.innerHTML = viewHead('Fravær', '') + errBox('Fraværstabellen blev ikke fundet'); return; }
    const fmt = (v) => (v || 0).toFixed(1).replace('.', ',') + ' %';
    const lvl = (p) => (p >= 10 ? 'is-danger' : p >= 5 ? 'is-warn' : '');
    const max = Math.max(10, ...a.rows.map((r) => Math.max(r.pct || 0, r.wPct || 0)));
    const bar = (p) => `<span class="lp-bar ${lvl(p)}"><i style="width:${Math.max(0, Math.min(100, ((p || 0) / max) * 100))}%"></i></span>`;
    app.innerHTML = viewHead('Fravær', 'Opgjort for dette skoleår') +
      `<div class="lp-bignums">
        <div class="${lvl(a.total.pct)}"><b>${fmt(a.total.pct)}</b><span>almindeligt fravær${a.total.mods ? `, ${String(a.total.mods[0]).replace('.', ',')} af ${a.total.mods[1]} moduler` : ''}</span></div>
        <div class="${lvl(a.total.wPct)}"><b>${fmt(a.total.wPct)}</b><span>skriftligt fravær${a.total.wTime ? `, ${String(a.total.wTime[0]).replace('.', ',')} af ${String(a.total.wTime[1]).replace('.', ',')} elevtimer` : ''}</span></div>
      </div>
      <div class="lp-sheet"><section class="lp-group"><h2>Pr. hold</h2>
        <div class="lp-abs-table" role="table">
          <div class="lp-abs-row is-head" role="row"><span>Hold</span><span>Almindeligt</span><span></span><span>Skriftligt</span><span></span></div>
          ${a.rows.slice().sort((x, y) => x.hold.localeCompare(y.hold, 'da')).map((r) => { const s = subjectFrom(r.hold); return `<div class="lp-abs-row" role="row">
            <span>${subjDot(s?.code)}${esc(s?.name || r.hold)} <small>${esc(r.hold)}</small></span>
            <span class="${lvl(r.pct)}">${fmt(r.pct)}<small>${r.mods ? `${String(r.mods[0]).replace('.', ',')}/${r.mods[1]}` : ''}</small></span>${bar(r.pct)}
            <span class="${lvl(r.wPct)}">${r.wTime || r.wPct ? fmt(r.wPct) : '<small>ingen</small>'}</span>${r.wTime || r.wPct ? bar(r.wPct) : '<span></span>'}
          </div>`; }).join('')}
        </div>
        <p class="lp-note">Tallene er Lectios egne. Grafen og fraværsskemaet findes under Lectios visning.</p></section></div>`;
  }

  function renderGradesView(app) {
    const g = parseGrades(document);
    let ws = 0; let wt = 0;
    g.forEach((x) => { const v = num(x.grade); if (v != null && x.weight && /^-?\d+$/.test(x.grade.trim())) { ws += v * x.weight; wt += x.weight; } });
    const fmtW = (w) => (w == null ? '' : String(w).replace('.', ','));
    app.innerHTML = viewHead('Karakterer', g.length ? `${g.length} fag på beviset` : '') +
      `<div class="lp-bignums"><div><b>${wt ? (ws / wt).toFixed(1).replace('.', ',') : '-'}</b><span>vægtet snit af årskarakterer</span></div></div>
      <div class="lp-sheet"><section class="lp-group"><h2>Linjer på bevis</h2>
        <div class="lp-gr-table" role="table">
          <div class="lp-gr-row is-head" role="row"><span>Fag</span><span>Årskarakter</span><span>Eksamen</span><span>Vægt</span></div>
          ${g.map((x) => `<div class="lp-gr-row" role="row"><span>${esc(x.subject)}</span>
            <span class="lp-grade">${esc(x.grade || '-')}<small>${esc(x.ects && x.ects !== '-' ? x.ects : '')}</small></span>
            <span class="lp-grade">${esc(x.exam || '-')}<small>${esc(x.examEcts && x.examEcts !== '-' ? x.examEcts : '')}</small></span>
            <span class="lp-muted">${esc(fmtW(x.weight))}</span></div>`).join('') || '<p class="lp-empty">Ingen karakterer endnu.</p>'}
        </div>
        <p class="lp-note">Karakternoter, bemærkninger og protokollinjer findes under Lectios visning.</p></section></div>`;
  }

  /* ---------------- beskedsiden ---------------- */
  function enhanceMessages() {
    document.documentElement.classList.add('lp-msgpage');
    const t = document.querySelector('table[id*="threadGV"]');
    if (t && !t.dataset.lp) {
      t.dataset.lp = '1';
      [...t.rows].forEach((r, i) => {
        [5, 9].forEach((ci) => r.cells[ci] && r.cells[ci].classList.add('lp-hide'));
        if (i === 0) return;
        const oc = r.querySelector('td:nth-child(4) [onclick]')?.getAttribute('onclick') || '';
        const id = (oc.match(/_(\d{6,})'/) || [])[1];
        const read = r.querySelector('[id$="readId"]')?.getAttribute('src') || '';
        if (read && !/\/mread\.gif/i.test(read)) r.classList.add('lp-unread');
        if (id) {
          const url = `${BASE}beskeder2.aspx?type=visbesked&id=${id}`;
          r.classList.add('lp-clickrow');
          r.addEventListener('click', (e) => {
            if (e.target.closest('input, img, select, [onclick]')) return;
            if (e.ctrlKey || e.metaKey) window.open(url, '_blank'); else location.href = url;
          });
        }
      });
    }
    document.querySelectorAll('.outerContentFrame a').forEach((a) => {
      if (a.dataset.lpb) return;
      const txt = a.textContent.trim();
      if (/^(Ny besked|Alle læst|Vis\/skjul slettede|Svar|Videresend|Vedhæft fil)$/i.test(txt)) { a.dataset.lpb = '1'; a.classList.add('lp-lbtn'); if (/^Ny besked$/i.test(txt)) a.classList.add('is-primary'); }
    });
  }

  /* ---------------- beskeder: indbakke med læsepanel ---------------- */
  function msgFolders() {
    const nodes = [...document.querySelectorAll('[id$="ListGridSelectionTree"] .TreeNode-container')];
    return nodes.map((n, i) => {
      const a = n.querySelector('a.TreeNode');
      const title = (n.querySelector('.TreeNode-title')?.textContent || '').trim();
      const indent = parseFloat(n.querySelector('.TreeNode-indent')?.style.width || '0') || 0;
      return { i, a, title, indent, selected: !!a && a.classList.contains('selectedFolder') };
    }).filter((f) => f.a && f.title);
  }
  function parseThread(doc) {
    const msgs = [...doc.querySelectorAll('[id="GridRowMessage"]')].filter((m) => /\d{1,2}-\d{1,2}-\d{4}/.test(m.querySelector('.message-thread-message-sender')?.textContent || '')).map((m) => {
      const s = (m.querySelector('.message-thread-message-sender')?.textContent || '').trim().replace(/\s+/g, ' ');
      const sm = s.match(/^(.*),\s*(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/);
      const date = sm ? new Date(+sm[4], +sm[3] - 1, +sm[2], +sm[5], +sm[6]) : null;
      const body = m.querySelector('.message-thread-message-content');
      return {
        from: sm ? sm[1].trim() : s,
        date,
        title: (m.querySelector('.message-thread-message-header')?.textContent || '').trim(),
        html: body ? safeHtml(body, location.origin + BASE) : ''
      };
    });
    const rec = doc.querySelector('[id$="RecipientsReadMode"]');
    const to = rec ? ([...rec.querySelectorAll(':scope > span, :scope > a')].map((x) => x.textContent.trim()).filter(Boolean).join(', ') || rec.textContent.trim()) : '';
    const locked = !!doc.querySelector('.thread-header-content-recipients .grayed-out');
    return { msgs, to, locked, subject: msgs[0]?.title || '' };
  }
  function fmtWhen(d, now = new Date()) {
    if (!d) return '';
    if (sameDay(d, now)) return `i dag kl. ${hm(d)}`;
    const diff = Math.round((startOfDay(now) - startOfDay(d)) / 864e5);
    if (diff === 1) return `i går kl. ${hm(d)}`;
    return `${d.getDate()}. ${MONTHS[d.getMonth()].slice(0, 3)}${d.getFullYear() !== now.getFullYear() ? ' ' + d.getFullYear() : ''} kl. ${hm(d)}`;
  }
  function renderMessagesView(app) {
    const list = parseMessages(document);
    const folders = msgFolders();
    const main = folders.filter((f) => f.indent === 0).slice(0, 6);
    const rest = folders.filter((f) => !main.includes(f));
    const cur = folders.find((f) => f.selected);
    const proxy = (re) => [...document.querySelectorAll('#s_m_outerContentFrameDiv a, #s_m_outerContentFrameDiv input[type="submit"]')].find((a) => re.test((a.textContent || a.value || '').trim()));
    const newBtn = document.getElementById('s_m_Content_Content_NewMessageLnk') || proxy(/^Ny besked$/i);
    const allRead = proxy(/^Alle læst$/i);
    const idOf = (m) => ((m.href || '').match(/[?&]id=(\d+)/) || [])[1];
    app.classList.add('lp-msgview');
    app.innerHTML = `
      ${pageHead('Beskeder', `${esc(cur ? cur.title : 'Indbakke')}, ${list.length} ${list.length === 1 ? 'tråd' : 'tråde'}`,
        `${allRead ? '<button type="button" class="lp-btn" data-act="allread">Markér alle som læst</button>' : ''}${newBtn ? '<button type="button" class="lp-btn lp-btn-main" data-act="new">Ny besked</button>' : ''}<a class="lp-btn lp-btn-ghost" href="${esc(origLink())}">Lectios visning</a>`)}
      <div class="lp-mfolders">
        ${main.map((f) => `<button type="button" class="lp-fchip${f.selected ? ' is-on' : ''}" data-f="${f.i}"${f.selected ? ' aria-current="true"' : ''}>${esc(f.title.replace(/^Alle /, '').replace(/^./, (c) => c.toUpperCase()))}</button>`).join('')}
        ${rest.length ? `<select class="lp-fselect" aria-label="Andre mapper"><option value="">${rest.some((f) => f.selected) ? '' : 'Hold og grupper'}</option>${rest.map((f) => `<option value="${f.i}"${f.selected ? ' selected' : ''}>${'  '.repeat(Math.min(3, Math.round(f.indent / 16)))}${esc(f.title)}</option>`).join('')}</select>` : ''}
        <input type="search" class="lp-msearch" placeholder="Filtrér i mappen" aria-label="Filtrér beskeder">
      </div>
      <div class="lp-mpanes">
        <div class="lp-mlist" role="list">${list.length ? list.map((m, i) => `
          <a class="lp-mitem${m.unread ? ' is-unread' : ''}" role="listitem" href="${esc(m.href || '#')}" data-i="${i}">
            <span class="lp-mi-top"><strong>${esc(m.from)}</strong><small>${esc(m.changed)}</small></span>
            <span class="lp-mi-subj">${esc(m.subject)}</span>
            <span class="lp-mi-to">Til ${esc(m.to)}</span>
          </a>`).join('') : '<p class="lp-empty">Ingen beskeder i denne mappe.</p>'}</div>
        <div class="lp-mread" aria-live="polite"><p class="lp-empty">Vælg en besked for at læse den her.</p></div>
      </div>`;
    app.querySelector('[data-act=new]')?.addEventListener('click', () => newBtn.click());
    app.querySelector('[data-act=allread]')?.addEventListener('click', () => allRead.click());
    app.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => folders[+b.dataset.f]?.a.click()));
    app.querySelector('.lp-fselect')?.addEventListener('change', (e) => { const f = folders[+e.target.value]; if (f) f.a.click(); });
    app.querySelector('.lp-msearch').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      app.querySelectorAll('.lp-mitem').forEach((el) => { el.hidden = q && !el.textContent.toLowerCase().includes(q); });
    });
    const reader = app.querySelector('.lp-mread');
    const wide = () => app.querySelector('.lp-mpanes').clientWidth > 860;
    let token = 0;
    const openThread = (i) => {
      const m = list[i];
      const id = idOf(m);
      if (!id) return false;
      app.querySelectorAll('.lp-mitem').forEach((el) => el.classList.toggle('is-sel', +el.dataset.i === i));
      const t = ++token;
      reader.innerHTML = `<div class="lp-mhead"><h2>${esc(m.subject)}</h2><p>${esc(m.from)}, ${esc(m.changed)}</p></div><p class="lp-dr-loading">Henter beskeden</p>`;
      fetchDoc('beskeder2.aspx?type=visbesked&id=' + id).then((doc) => {
        if (t !== token) return;
        const th = parseThread(doc);
        delete memo['beskeder2.aspx?type=visbesked&id=' + id];
        app.querySelector(`.lp-mitem[data-i="${i}"]`)?.classList.remove('is-unread');
        if (m.unread && cache.msgs) { const cm = cache.msgs.d.find((x) => idOf(x) === id); if (cm) { cm.unread = false; cachePut('msgs', cache.msgs.d); } }
        reader.innerHTML = `
          <div class="lp-mhead">
            <h2>${esc(th.subject || m.subject)}</h2>
            <p>Til ${esc(th.to || m.to)}</p>
            <div class="lp-mactions">
              ${th.locked ? '<span class="lp-muted">Tråden kan ikke besvares</span>' : `<a class="lp-btn lp-btn-main" href="${esc(m.href)}">Svar</a>`}
              <a class="lp-btn lp-btn-ghost" href="${esc(m.href)}">Åbn i Lectio</a>
            </div>
          </div>
          ${th.msgs.map((x) => `<article class="lp-mmsg">
            <header><strong>${esc(x.from)}</strong><small>${esc(fmtWhen(x.date))}</small></header>
            ${x.title && x.title !== th.subject ? `<h3>${esc(x.title)}</h3>` : ''}
            <div class="lp-mbody">${x.html}</div></article>`).join('')}`;
        reader.scrollTop = 0;
      }).catch(() => { if (t === token) reader.innerHTML = `<p class="lp-empty">Beskeden kunne ikke hentes. <a href="${esc(m.href)}">Åbn den i Lectio</a>.</p>`; });
      return true;
    };
    app.querySelector('.lp-mlist').addEventListener('click', (e) => {
      const a = e.target.closest('.lp-mitem');
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey || !wide()) return;
      if (openThread(+a.dataset.i)) e.preventDefault();
    });
    const firstUnread = list.findIndex((m) => m.unread);
    if (wide() && list.length) openThread(firstUnread >= 0 ? firstUnread : 0);
  }

  /* ---------------- opgaveaflevering ---------------- */
  function enhanceAssignmentPage() {
    const root = document.querySelector('.ls-elevaflevering-root');
    if (!root || document.getElementById('lp-afl')) return;
    const info = {};
    let descHtml = '';
    document.querySelectorAll('table.ls-std-table-inputlist tr').forEach((tr) => {
      const cells = [...tr.cells];
      if (cells.length < 2) return;
      const k = cells[0].textContent.trim().replace(/:$/, '').toLowerCase();
      const v = cells[cells.length - 1];
      info[k] = v.textContent.trim().replace(/\s+/g, ' ').replace(/^[^:]+:\s*/, (x) => (x.toLowerCase().startsWith(k) ? '' : x));
      if (k.startsWith('opgavebeskrivelse')) descHtml = safeHtml(v, location.href);
    });
    const st = document.querySelector('[id$="StudentGV"]');
    const sRow = st && st.rows[1] ? [...st.rows[1].cells].map((c) => c.textContent.trim().replace(/\s+/g, ' ').replace(/^[^:]+:\s*/, '')) : [];
    const status = (sRow[3] || '').split('/')[0].trim();
    const waiting = sRow[2] || '';
    const grade = sRow[5] || '';
    const gradeNote = sRow[6] || '';
    const fm = (info.afleveringsfrist || '').match(/(\d{1,2})\/(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})/);
    const due = fm ? new Date(+fm[3], +fm[2] - 1, +fm[1], +fm[4], +fm[5]) : null;
    const now = new Date();
    const subj = subjectFrom(info.hold || '');
    const done = /afleveret/i.test(status);
    const fact = (label, val, cls = '') => (val ? `<div class="${cls}"><dt>${label}</dt><dd>${val}</dd></div>` : '');
    const box = document.createElement('section');
    box.id = 'lp-afl';
    box.className = 'lp-afl';
    box.style.setProperty('--h', hueFor(subj?.code));
    box.innerHTML = `
      <p class="lp-afl-subj">${subjDot(subj?.code)}${esc(subj?.name || info.hold || 'Opgave')}${info.hold && subj ? `<small>${esc(info.hold)}</small>` : ''}</p>
      <h1>${esc(info.opgavetitel || 'Opgave')}</h1>
      <dl class="lp-afl-facts">
        ${fact('Frist', due ? `${esc(cap(DAYS[due.getDay()]))} ${due.getDate()}. ${esc(MONTHS[due.getMonth()])} kl. ${hm(due)} ${done ? '' : dueText(due, status, now)}` : esc(info.afleveringsfrist || ''))}
        ${fact('Status', `<span class="lp-chip ${done ? 'is-ok' : /mangler/i.test(status) ? 'is-danger' : ''}">${esc(status || 'Ikke afleveret')}</span>`)}
        ${fact('Afventer', esc(waiting))}
        ${fact('Karakter', esc(grade), 'is-grade')}
        ${fact('Elevtid', esc(info.elevtid || ''))}
        ${fact('Ansvarlig', esc(info.ansvarlig || ''))}
      </dl>
      ${descHtml && descHtml.replace(/<[^>]+>/g, '').trim() ? `<div class="lp-afl-desc"><h2>Opgavebeskrivelse</h2><div class="lp-act">${descHtml}</div></div>` : ''}
      ${info.opgavenote ? `<div class="lp-afl-desc"><h2>Note fra læreren</h2><p class="lp-pre">${esc(info.opgavenote)}</p></div>` : ''}
      ${gradeNote ? `<div class="lp-afl-desc"><h2>Karakternote</h2><p class="lp-pre">${esc(gradeNote)}</p></div>` : ''}
      ${done ? '' : '<a class="lp-btn lp-btn-main lp-afl-go" href="#lp-afl-upload">Gå til aflevering</a>'}`;
    root.parentNode.insertBefore(box, root);
    document.documentElement.classList.add('lp-aflpage');
    if (info.opgavetitel) root.classList.add('lp-afl-hasinfo');
    const sections = [...root.querySelectorAll('section.lf-island')];
    sections.forEach((s) => {
      const h = (s.querySelector('.islandHeader')?.textContent || '').trim();
      if (/^Opgaveoplysninger/i.test(h)) s.classList.add('lp-afl-info');
      if (/^Opgaveindlæg/i.test(h)) {
        s.id = 'lp-afl-upload'; s.classList.add('lp-afl-entries');
        const hh = s.querySelector('.islandHeader'); if (hh) hh.textContent = 'Aflevering og feedback';
      }
      if (/^Afleveres af/i.test(h)) {
        s.classList.add('lp-afl-students');
        const editable = s.querySelector('input:not([type="hidden"]):not([disabled]), textarea, select');
        if (!editable && info.opgavetitel) s.classList.add('lp-afl-redundant');
      }
    });
    const entries = root.querySelector('.lp-afl-entries');
    const students = root.querySelector('.lp-afl-students');
    if (entries && students) {
      let a = entries; let b = students;
      while (a.parentElement && !a.parentElement.contains(students)) a = a.parentElement;
      while (b.parentElement && b.parentElement !== a.parentElement) b = b.parentElement;
      if (a.parentElement === b.parentElement && a !== b) a.parentElement.insertBefore(a, b);
    }
  }

  /* ---------------- lektionsside ---------------- */
  function enhanceActivityPage() {
    const content = document.getElementById('homeworkContentContainer');
    const host = document.querySelector('#contenttable, .ls-content');
    if (!content || !host || document.getElementById('lp-act-hero')) return;
    const brik = content.querySelector('[id$="actHeader"] a.s2skemabrik') || document.querySelector('a.s2skemabrik[data-tooltip]');
    const l = brik ? parseTip(brik.getAttribute('data-tooltip') || '') : {};
    if (brik) { l.changed = brik.classList.contains('s2changed') || l.status === 'changed'; l.cancelled = brik.classList.contains('s2cancelled') || l.status === 'cancelled'; }
    const noteTa = content.querySelector('textarea.activity-note');
    const note = noteTa ? (noteTa.value || noteTa.textContent || '').trim() : '';
    const forl = [...document.querySelectorAll('a[href*="forloeb_vis"]')].map((a) => ({ t: a.textContent.trim(), h: a.href })).filter((x) => x.t);
    const subj = l.subject;
    const when = l.start ? `${cap(DAYS[l.start.getDay()])} ${l.start.getDate()}. ${MONTHS[l.start.getMonth()]}${l.allDay ? ', hele dagen' : `, ${hm(l.start)} til ${hm(l.end)}`}` : '';
    const fact = (label, val) => (val ? `<div><dt>${label}</dt><dd>${val}</dd></div>` : '');
    const flag = l.cancelled ? '<span class="lp-flag is-danger">aflyst</span>' : l.changed ? '<span class="lp-flag is-warn">ændret</span>' : '';
    const hero = document.createElement('section');
    hero.id = 'lp-act-hero';
    hero.className = 'lp-afl';
    hero.style.setProperty('--h', hueFor(subj?.code || l.title));
    hero.innerHTML = `
      <p class="lp-afl-subj">${subjDot(subj?.code || l.title)}${esc(subj?.name || 'Aktivitet')}${l.hold && subj ? `<small>${esc(l.hold)}</small>` : ''}${flag}</p>
      <h1>${esc(l.title || subj?.name || 'Lektion')}</h1>
      <dl class="lp-afl-facts">
        ${fact('Tid', esc(when))}
        ${fact('Lokale', esc(l.room || ''))}
        ${fact(/,/.test(l.teacher || '') ? 'Lærere' : 'Lærer', esc(l.teacher || ''))}
        ${fact('Hold', esc(l.hold || ''))}
        ${forl.length ? fact('Forløb', `<span class="lp-flist">${forl.map((f) => `<a href="${esc(f.h)}">${esc(f.t)}</a>`).join('')}</span>`) : ''}
      </dl>
      ${note ? `<div class="lp-afl-desc"><h2>Note fra læreren</h2><p class="lp-pre">${esc(note)}</p></div>` : ''}`;
    host.prepend(hero);
    document.documentElement.classList.add('lp-actpage');
    // navigation og faner flyttes op i sidehovedet
    const btn = (id, label, icon) => (document.getElementById('s_m_Content_Content_' + id) ? `<button type="button" class="lp-btn" data-proxy="s_m_Content_Content_${id}" title="${label}" aria-label="${label}">${icon}</button>` : '');
    const holdLink = document.getElementById('s_m_Content_Content_holdActLink');
    shellActions = `${btn('ctl02', 'Min forrige lektion', ICONS.left)}${btn('ctl03', 'Min næste lektion', ICONS.right)}${holdLink ? `<a class="lp-btn lp-btn-ghost" href="${esc(holdLink.href)}">Holdets lektioner</a>` : ''}`;
    const tabs = [...document.querySelectorAll('.lectioTabToolbar a')].map((a) => ({ t: a.textContent.trim(), h: a.getAttribute('href') || '#', on: !a.getAttribute('href') || a.getAttribute('href') === '#' }));
    if (tabs.length > 1) shellTabs = `<nav class="lp-tabs" aria-label="Undersider">${tabs.map((x) => `<a href="${esc(x.on ? '#' : abs(x.h) || x.h)}"${x.on ? ' class="is-on" aria-current="page"' : ''}>${esc(x.t)}</a>`).join('')}</nav>`;
    // indholdskortet får en overskrift som de andre kort
    if (!content.querySelector('.lp-act-cardhead')) {
      const h = document.createElement('div');
      h.className = 'lp-act-cardhead';
      h.innerHTML = '<h2>Lektier og materialer</h2>';
      content.prepend(h);
    }
    if (!content.textContent.replace(/Lektier og materialer/, '').trim()) content.insertAdjacentHTML('beforeend', '<p class="lp-empty">Ingen lektier eller materialer til denne lektion.</p>');
  }

  /* ---------------- studieplan: forløb pr. hold ---------------- */
  function parseStudyPlan(doc) {
    const t = doc.querySelector('[id$="spUge_theTable"]');
    if (!t || t.rows.length < 2) return null;
    const holdAt = [];
    [...t.rows[0].cells].forEach((c) => { for (let k = 0; k < c.colSpan; k++) holdAt.push(c.textContent.trim()); });
    const cells = [...t.rows[1].cells];
    const top = (el) => parseFloat(el.style.top) || 0;
    const weeks = [...(cells[1]?.children || [])].map((w) => ({ n: +w.textContent.trim() || null, top: top(w), h: parseFloat(w.style.height) || 21 })).filter((w) => w.n);
    const weekAt = (y) => { let r = weeks[0]; for (const w of weeks) { if (w.top <= y + 1) r = w; else break; } return r ? r.n : null; };
    const thisWeekEl = t.querySelector('.thisWeek');
    const nowY = thisWeekEl ? top(thisWeekEl) + 1 : null;
    const holds = new Map();
    cells.forEach((c, i) => {
      if (!/phaseCol/.test(c.className)) return;
      const name = holdAt[i];
      if (!name || /^(måned|uge|elevtid)$/i.test(name)) return;
      if (!holds.has(name)) holds.set(name, []);
      c.querySelectorAll('.phase').forEach((p) => {
        const a = p.querySelector('a');
        const y = top(p); const hgt = parseFloat(p.style.height) || 21;
        const title = (a ? a.textContent : p.textContent).trim().replace(/\s+/g, ' ');
        if (!title) return;
        holds.get(name).push({ title, href: abs(a?.getAttribute('href')), y, y2: y + hgt, from: weekAt(y), to: weekAt(y + hgt - 2) });
      });
    });
    return { nowY, holds: [...holds.entries()].map(([name, phases]) => ({ name, phases: phases.sort((a, b) => a.y - b.y) })) };
  }
  function renderStudyPlanView(app) {
    const sp = parseStudyPlan(document);
    if (!sp) return false;
    const range = (p) => (p.from && p.to && p.from !== p.to ? `uge ${p.from} til ${p.to}` : p.from ? `uge ${p.from}` : '');
    const cards = sp.holds.filter((h) => h.phases.length).map((h) => {
      const s = subjectFrom(h.name);
      const y = sp.nowY;
      const cur = y != null ? h.phases.find((p) => p.y <= y && y < p.y2) : null;
      const next = y != null ? h.phases.find((p) => p.y > y) : null;
      const past = y != null ? h.phases.filter((p) => p.y2 <= y) : [];
      const later = y != null ? h.phases.filter((p) => p.y > y && p !== next) : h.phases;
      const prog = cur ? Math.round(((y - cur.y) / (cur.y2 - cur.y)) * 100) : 0;
      const item = (p) => `<li><a href="${esc(p.href || '#')}">${esc(p.title)}</a><small>${esc(range(p))}</small></li>`;
      return `<section class="lp-card lp-sp" style="--h:${hueFor(s?.code || h.name)}">
        <header class="lp-card-head"><h2>${subjDot(s?.code || h.name)}${esc(s?.name || h.name)}</h2><small>${esc(h.name)}</small></header>
        <div class="lp-card-body">
          ${cur ? `<div class="lp-sp-now"><span>Nu</span><a href="${esc(cur.href || '#')}"><strong>${esc(cur.title)}</strong></a><small>${esc(range(cur))}</small><span class="lp-progress"><i style="width:${prog}%"></i></span></div>` : '<p class="lp-empty lp-sp-none">Intet forløb lige nu.</p>'}
          ${next ? `<div class="lp-sp-next"><span>Næste</span><a href="${esc(next.href || '#')}">${esc(next.title)}</a><small>${esc(range(next))}</small></div>` : ''}
          ${past.length || later.length ? `<details class="lp-sp-more"><summary>Alle forløb (${h.phases.length})</summary>
            ${past.length ? `<p class="lp-sp-group">Tidligere</p><ul>${past.map(item).join('')}</ul>` : ''}
            ${later.length ? `<p class="lp-sp-group">Senere</p><ul>${later.map(item).join('')}</ul>` : ''}</details>` : ''}
        </div></section>`;
    });
    app.innerHTML = viewHead('Studieplan', 'Forløb i dine hold lige nu og hvad der kommer') +
      (cards.length ? `<div class="lp-spgrid">${cards.join('')}</div>` : '<p class="lp-empty">Studieplanen er tom.</p>');
    return true;
  }

  /* ---------------- oprydning på Lectios egne sider ---------------- */
  function tidyLectioPage() {
    const t = document.getElementById('s_m_HeaderContent_MainTitle') || document.querySelector('[id$="HeaderContent_MainTitle"], .maintitle');
    if (!t) return;
    const m = t.textContent.trim().match(TITLE_RE);
    if (m) t.textContent = m[4].trim();
  }
  function lum(c) {
    let m = c.match(/^oklch\(\s*([\d.]+)(%?)[^/)]*(?:\/\s*([\d.]+)(%?))?/);
    if (m) {
      if (m[3] !== undefined && parseFloat(m[3]) / (m[4] ? 100 : 1) < 0.35) return null;
      const v = parseFloat(m[1]); return m[2] ? v / 100 : v;
    }
    m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?/);
    if (m) {
      if (m[4] !== undefined && +m[4] < 0.35) return null;
      return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
    }
    return null;
  }
  const OWN_UI = '#lp-side, #lp-app, #lp-drawer, #lp-palette, #lp-topbar, #lp-pill, #lp-scrim, #lp-afl, #lp-act-hero, #lp-shell-head';
  // Finder lyse flader og mørk tekst i Lectios egne sider og farver dem om i mørk tilstand.
  function darkFix(root) {
    const html = document.documentElement;
    if (html.getAttribute('data-lp-theme') !== 'dark' || !html.classList.contains('lp-on') || html.classList.contains('lp-takeover')) return;
    root = root || document.getElementById('masterContent') || document.body;
    if (!root || root.nodeType !== 1 || root.closest(OWN_UI)) return;
    const els = [root, ...root.getElementsByTagName('*')];
    for (const el of els) {
      if (el.id && el.id.startsWith('lp-')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      const b = lum(cs.backgroundColor);
      if (b != null && b > 0.72) el.classList.add('lp-dk-bg');
      const f = lum(cs.color);
      if (f != null && f < 0.4) el.classList.add(el.tagName === 'A' || el.closest('a') ? 'lp-dk-link' : 'lp-dk-fg');
      if (parseFloat(cs.borderTopWidth) || parseFloat(cs.borderLeftWidth)) {
        const bd = lum(parseFloat(cs.borderTopWidth) ? cs.borderTopColor : cs.borderLeftColor);
        if (bd != null && bd > 0.6) el.classList.add('lp-dk-bd');
      }
    }
  }
  // Holder øje med det Lectio selv ændrer på siden og retter kun de nye dele.
  let lectioChange = null;
  let lectioSig = '';
  function watchPage() {
    const target = document.getElementById('masterContent') || document.body;
    const pending = new Set();
    let timer = null;
    new MutationObserver((muts) => {
      let header = false;
      for (const m of muts) {
        if (m.target.nodeType === 1 && m.target.closest('.ls-master-pageheader')) header = true;
        for (const n of m.addedNodes) if (n.nodeType === 1 && !n.closest(OWN_UI)) pending.add(n);
      }
      if (header) tidyLectioPage();
      if (!pending.size) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const nodes = [...pending];
        pending.clear();
        if (PAGE.startsWith('beskeder')) enhanceMessages();
        if (lectioChange) {
          const t = document.querySelector('table[id*="threadGV"]');
          const sig = (t ? t.textContent.length + ':' + t.rows.length : '') + (document.querySelector('.selectedFolder')?.textContent || '');
          if (sig !== lectioSig) { lectioSig = sig; lectioChange(); }
        }
        idle(() => nodes.forEach((n) => { if (n.isConnected) darkFix(n); }), 500);
      }, 120);
    }).observe(target, { childList: true, subtree: true });
  }

  /* ---------------- start ---------------- */
  function saveBoot() {
    try { localStorage.setItem('lp-boot', JSON.stringify({ enabled: settings.enabled, theme: settings.theme, dashboard: settings.dashboard, skema: settings.skema, views: settings.views })); } catch (e) { /* ignorer */ }
  }
  // Gemmer data fra den side man står på, så andre sider ikke skal hente dem igen.
  function primeCache(params) {
    const q = [...params.keys()];
    try {
      if (PAGE === 'opgaverelev.aspx' && !q.length) cachePut('tasks', parseAssignments(document));
      if (PAGE === 'material_lektieoversigt.aspx' && !q.length) cachePut('hw', parseHomework(document));
      if (PAGE === 'beskeder2.aspx' && (!q.length || params.get('mappeid') === '-70')) { const m = parseMessages(document); if (m.length) cachePut('msgs', m); }
      if (PAGE === 'subnav/fravaerelev.aspx' && !q.length) { const a = parseAbsence(document); if (a) cachePut('abs', a); }
      if (PAGE === 'grades/grade_report.aspx' && !q.length) { const g = parseGrades(document); if (g.length) cachePut('grades', g); }
      if (PAGE === 'skemany.aspx' && q.every((k) => k === 'week')) {
        const sk = parseSkema(document);
        const wk = params.get('week');
        if (sk) cachePut(wk && /^\d{6}$/.test(wk) ? 'skema:' + wk : skemaKey(new Date()), sk);
      }
      if (PAGE === 'forside.aspx' && !q.length) cachePut('front', parseFront(document));
    } catch (e) { console.warn('[Lectio+]', e); }
  }
  // Holder badges friske uden at belaste Lectio: højst én lille hentning pr. side.
  function refreshStale() {
    const k = ['msgs', 'tasks', 'hw', 'front'].find((key) => !isFresh(key, TTL[key] * 2));
    if (!k) return;
    const go = () => idle(() => fetchDoc(SOURCES[k].path).then(SOURCES[k].parse).then((d) => cachePut(k, d)).catch(() => {}), 3000);
    if (document.readyState === 'complete') setTimeout(go, 1200); else addEventListener('load', () => setTimeout(go, 1200), { once: true });
  }

  async function init() {
    try { localStorage.removeItem('lp-test-code');  } catch (e) { /* oprydning efter test */ }
    settings = await loadSettings();
    saveBoot();
    applyTheme();
    const html = document.documentElement;
    const params = new URLSearchParams(location.search);
    if (!settings.enabled) { html.classList.remove('lp-on', 'lp-takeover', 'lp-boot'); return; }
    if (params.get('lp') === 'orig') {
      html.classList.remove('lp-on', 'lp-takeover', 'lp-boot');
      if (params.get('lp') === 'orig') html.classList.add('lp-lite');
      originalPill();
      return;
    }
    html.classList.add('lp-on');
    document.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('a[href*="logout.aspx"]')) { try { sessionStorage.removeItem(CACHE_KEY); sessionStorage.removeItem('lp-user:' + SCHOOL); } catch (er) { /* ignorer */ } }
    }, true);

    const onlyWeek = [...params.keys()].every((k) => k === 'week');
    const noParams = [...params.keys()].length === 0;
    let takeover = null;
    if (settings.dashboard && PAGE === 'forside.aspx' && noParams) takeover = 'dashboard';
    if (settings.skema && PAGE === 'skemany.aspx' && onlyWeek && document.querySelector('table.s2skema')) takeover = 'skema';
    if (settings.views && noParams) {
      if (PAGE === 'opgaverelev.aspx' && document.querySelector('#s_m_Content_Content_ExerciseGV')) takeover = 'opgaver';
      if (PAGE === 'material_lektieoversigt.aspx' && document.querySelector('#s_m_Content_Content_MaterialLektieOverblikGV')) takeover = 'lektier';
      if (PAGE === 'subnav/fravaerelev.aspx' && document.querySelector('table[id$="SFTabStudentAbsenceDataTable"]')) takeover = 'fravaer';
      if (PAGE === 'grades/grade_report.aspx' && parseGrades(document).length) takeover = 'karakterer';
    }
    if (settings.views && PAGE === 'beskeder2.aspx' && [...params.keys()].every((k) => k === 'mappeid') &&
        document.querySelector('table[id*="threadGV"]') && !document.querySelector('textarea, [id$="ViewThreadPagePanel"] .message-thread-container')) takeover = 'beskeder';
    if (settings.views && PAGE === 'studieplan.aspx' && [...params.keys()].every((k) => k === 'displaytype') && params.get('displaytype') === 'ugeteksttabel' &&
        document.querySelector('[id$="spUge_theTable"] .phase')) takeover = 'studieplan';
    if (takeover) html.classList.add('lp-takeover'); else html.classList.remove('lp-takeover');

    primeCache(params);
    buildSidebar();
    tidyLectioPage();
    if (!takeover) darkFix();
    watchPage();
    html.classList.remove('lp-boot');

    if (takeover) {
      const app = document.createElement('main');
      app.id = 'lp-app';
      document.body.appendChild(app);
      if (takeover === 'dashboard') renderDashboard(app);
      else if (takeover === 'opgaver') renderTasksView(app);
      else if (takeover === 'lektier') renderHomeworkView(app);
      else if (takeover === 'fravaer') renderAbsenceView(app);
      else if (takeover === 'karakterer') renderGradesView(app);
      else if (takeover === 'beskeder') { renderMessagesView(app); const t0 = document.querySelector('table[id*="threadGV"]'); lectioSig = (t0 ? t0.textContent.length + ':' + t0.rows.length : '') + (document.querySelector('.selectedFolder')?.textContent || ''); lectioChange = () => renderMessagesView(app); }
      else if (takeover === 'studieplan') { if (!renderStudyPlanView(app)) { html.classList.remove('lp-takeover'); app.remove(); } }
      else {
        const wk = params.get('week');
        let d = new Date();
        if (wk && /^\d{6}$/.test(wk)) { d = mondayOf(new Date(+wk.slice(2), 0, 4)); d.setDate(d.getDate() + (+wk.slice(0, 2) - 1) * 7); }
        let cur = d;
        renderWeek(app, cur);
        document.addEventListener('keydown', (e) => {
          if (!e.altKey || !/Arrow(Left|Right)/.test(e.key) || drawerState) return;
          e.preventDefault();
          cur = new Date(cur.getTime() + (e.key === 'ArrowLeft' ? -7 : 7) * 864e5);
          history.replaceState(null, '', `${BASE}SkemaNy.aspx?week=${weekParam(cur)}`);
          renderWeek(app, cur);
        });
      }
    } else {
      if (PAGE === 'opgaverelev.aspx') enhanceAssignments();
      if (PAGE.startsWith('beskeder')) enhanceMessages();
      if (PAGE === 'elevaflevering.aspx') enhanceAssignmentPage();
      if (PAGE === 'aktivitet/aktivitetforside2.aspx') enhanceActivityPage();
      buildPageShell();
    }
    if (takeover !== 'dashboard') refreshStale();
  }

  if (hasChrome && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((ch) => {
      if (ch.theme && Object.keys(ch).length === 1) { settings.theme = ch.theme.newValue; saveBoot(); applyTheme(); return; }
      if (ch.hideDone && Object.keys(ch).length === 1) return;
      location.reload();
    });
  }

  init();
})();
