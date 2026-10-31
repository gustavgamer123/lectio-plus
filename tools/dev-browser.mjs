// Starter en Chromium med Lectio+ indlæst og en fast profil, så Gustav kun skal logge ind én gang.
// De andre værktøjer forbinder til den via port 9333. Luk vinduet for at stoppe.
import path from 'node:path';
import { chromium } from 'playwright';
import { ROOT, EXT, PORT, ensureDevMode } from './lib.mjs';

const context = await chromium.launchPersistentContext(path.join(ROOT, '.dev-profile'), {
  headless: false,
  channel: 'chromium',
  viewport: { width: 1280, height: 800 },
  args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`, `--remote-debugging-port=${PORT}`]
});
await ensureDevMode(context);
const page = context.pages()[0] || (await context.newPage());
await page.goto('https://www.lectio.dk/lectio/login_list.aspx');
console.log(`Dev-browseren kører på port ${PORT}. Log ind på Lectio i vinduet.`);
context.on('close', () => process.exit(0));
await new Promise(() => {});
