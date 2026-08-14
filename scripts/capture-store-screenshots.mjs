import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";

const appUrl = "https://8081-ibupo1mdgqwjidzqlk0ws-0df1b506.us3.manus.computer/";
const outputDir = "/home/ubuntu/imanote-diary/docs/google-play/assets/localized-screenshots";
const profileDir = "/tmp/imanote-store-capture";
const debuggingPort = 9333;
const requestedLocales = process.argv.slice(2).filter((locale) => locale === "ar" || locale === "fr");
const localesToCapture = requestedLocales.length > 0 ? requestedLocales : ["ar", "fr"];

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForDebugger() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debuggingPort}/json`);
      const pages = await response.json();
      const page = pages.find((item) => item.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Chromium is still starting.
    }
    await sleep(200);
  }
  throw new Error("Chromium debugging interface did not start.");
}

function createCdp(socketUrl) {
  const socket = new WebSocket(socketUrl);
  let nextId = 1;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => resolve({
      send(method, params = {}) {
        const id = nextId;
        nextId += 1;
        socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolveMessage, rejectMessage) => pending.set(id, { resolve: resolveMessage, reject: rejectMessage }));
      },
      close() { socket.close(); },
    }));
    socket.addEventListener("error", () => reject(new Error("Could not connect to Chromium debugging socket.")));
  });
}

function standardSettings(language) {
  return {
    language,
    appearance: "blossom",
    defaultFont: "classic",
    defaultFontSize: "medium",
    defaultLineSpacing: "normal",
    defaultPaper: "plain",
    dailyReminderEnabled: false,
    dailyReminderHour: 20,
    dailyReminderMinute: 0,
    hideReminderContent: true,
    biometricEnabled: false,
    autoLockMinutes: 5,
    lockSoundsEnabled: true,
  };
}

function demoEntry(language) {
  const now = "2026-08-14T10:00:00.000Z";
  const isArabic = language === "ar";
  return [{
    id: `store-${language}-entry`,
    title: isArabic ? "صباح هادئ" : "Un matin doux",
    body: isArabic
      ? "قهوة دافئة ولحظة امتنان صغيرة في بداية اليوم."
      : "Un café chaud et un petit moment de gratitude pour commencer la journée.",
    createdAt: now,
    updatedAt: now,
    font: "classic",
    fontSize: "medium",
    lineSpacing: "normal",
    paper: "blossom",
    stickers: isArabic ? ["flower", "heart"] : ["flower", "heart"],
    mood: "joyful",
    favorite: true,
    folder: "personal",
    isDraft: false,
    inkColor: "graphite",
  }];
}

async function evaluate(cdp, expression) {
  return cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
}

async function capture(cdp, outputPath) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(outputPath, Buffer.from(data, "base64"));
}

async function click(cdp, point) {
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 });
  await sleep(180);
}

async function prepareLocale(cdp, language) {
  await cdp.send("Page.navigate", { url: appUrl });
  await sleep(1200);
  const salt = `store-capture-${language}`;
  const verifier = createHash("sha256").update(`${salt}:1111`).digest("hex");
  const storageScript = `(() => {
    localStorage.clear();
    localStorage.setItem('imanote.settings.v1', ${JSON.stringify(JSON.stringify(standardSettings(language)))});
    localStorage.setItem('imanote.entries.v1', ${JSON.stringify(JSON.stringify(demoEntry(language)))});
    localStorage.setItem('imanote.lock.v1', ${JSON.stringify(JSON.stringify({ kind: "pin", salt, verifier }))});
    location.reload();
  })()`;
  await evaluate(cdp, storageScript);
  await sleep(3600);
  return language;
}

async function captureLocale(cdp, language) {
  await prepareLocale(cdp, language);
  const code = language === "ar" ? "ar" : "fr";
  await capture(cdp, `${outputDir}/01-lock-${code}.png`);
  const pointResponse = await evaluate(cdp, `(() => {
    const node = [...document.querySelectorAll('div')].find((element) => {
      const box = element.getBoundingClientRect();
      return element.textContent?.trim() === '1' && box.width > 50 && box.height > 50;
    });
    if (!node) throw new Error('PIN 1 button not found');
    const box = node.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  })()`);
  const point = pointResponse.result?.result?.value ?? pointResponse.result?.value;
  if (!point) throw new Error(`PIN coordinate lookup failed: ${JSON.stringify(pointResponse)}`);
  for (let count = 0; count < 4; count += 1) await click(cdp, point);
  const unlockResponse = await evaluate(cdp, `(() => {
    const textNode = [...document.querySelectorAll('div')].find((element) => /^(فتح المذكرات|Ouvrir le journal)$/.test(element.textContent?.trim() ?? ''));
    const node = textNode?.closest('[tabindex="0"]');
    if (!node) throw new Error('Unlock button not found');
    const box = node.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  })()`);
  const unlockPoint = unlockResponse.result?.result?.value ?? unlockResponse.result?.value;
  if (!unlockPoint) throw new Error(`Unlock coordinate lookup failed: ${JSON.stringify(unlockResponse)}`);
  await click(cdp, unlockPoint);
  await sleep(700);
  await capture(cdp, `${outputDir}/02-home-${code}.png`);
}

rmSync(profileDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
const chromium = spawn("chromium", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${debuggingPort}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: "ignore" });

try {
  const cdp = await createCdp(await waitForDebugger());
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: true });
  for (const locale of localesToCapture) await captureLocale(cdp, locale);
  cdp.close();
  console.log(`Saved screenshots in ${outputDir}`);
} finally {
  chromium.kill("SIGTERM");
}
