// Fælles for værktøjerne: forbind til dev-browseren, find skolen og genindlæs udvidelsen.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const EXT = path.join(ROOT, 'extension');
export const PORT = 9333;
export const ORIGIN = 'https://www.lectio.dk';
const SCHOOL_RE = /^https:\/\/www\.lectio\.dk(\/lectio\/\d+\/)/i;

export const slug = (p) => p.replace(/[^a-zA-Z0-9.]/g, '_');

// Forbinder uden at lukke browseren bagefter: browser.close() kunne lukke Gustavs login.
export async function connect() {
  const browser = await chromium.connectOverCDP(`http://localhost:${PORT}`);
  return { browser, context: browser.contexts()[0] };
}

export function lectioPage(context) {
  return context.pages().find((p) => SCHOOL_RE.test(p.url()) && !/login/i.test(p.url()));
}

export function schoolBase(context) {
  const p = lectioPage(context);
  if (!p) throw new Error('Log ind på Lectio i dev-browseren først');
  return p.url().match(SCHOOL_RE)[1];
}

// Nyere Chromium slår upakkede udvidelser fra (unsupportedDeveloperExtension), medmindre udviklertilstand er slået til.
export async function ensureDevMode(context) {
  const page = await context.newPage();
  try {
    await page.goto('chrome://extensions');
    await page.evaluate(async () => {
      await chrome.developerPrivate.updateProfileConfiguration({ inDeveloperMode: true });
      const ext = (await chrome.developerPrivate.getExtensionsInfo()).find((e) => e.name === 'Lectio+');
      if (ext && ext.state !== 'ENABLED') await chrome.management.setEnabled(ext.id, true);
    });
  } finally {
    await page.close();
  }
}

// Sætter indstillinger i udvidelsens egen chrome.storage via dens popup-side.
// Værktøjerne bruger det til at sætte temaet til "auto", så emulateMedia bestemmer lyst eller mørkt.
export async function setSettings(context, values) {
  const page = await context.newPage();
  try {
    await page.goto('chrome://extensions');
    const id = await page.evaluate(async () => (await chrome.developerPrivate.getExtensionsInfo()).find((e) => e.name === 'Lectio+')?.id);
    if (!id) throw new Error('fandt ikke Lectio+');
    await page.goto(`chrome-extension://${id}/popup.html`);
    await page.evaluate((v) => new Promise((res) => chrome.storage.sync.set(v, res)), values);
  } finally {
    await page.close();
  }
}

export async function reloadExtension(context) {
  const page = await context.newPage();
  try {
    await page.goto('chrome://extensions');
    const ok = await page.evaluate(async () => {
      await chrome.developerPrivate.updateProfileConfiguration({ inDeveloperMode: true });
      const all = await chrome.developerPrivate.getExtensionsInfo();
      const ext = all.find((e) => e.name === 'Lectio+');
      if (!ext) return false;
      await chrome.developerPrivate.reload(ext.id, { failQuietly: true });
      return true;
    });
    if (!ok) throw new Error('fandt ikke Lectio+');
    await page.waitForTimeout(500);
    return true;
  } catch (e) {
    console.error('Genindlæs Lectio+ i chrome://extensions', e.message);
    return false;
  } finally {
    await page.close();
  }
}
