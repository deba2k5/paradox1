import { chromium } from "playwright";

const outDir = "C:/Users/DEBANG~1/AppData/Local/Temp/claude/c--Users-Debangshu05-Downloads-paradox/19b089b8-9b1b-4990-97c5-17a96f77ae65/scratchpad";

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1600, height: 260 } });
const errors = [];
desktop.on("pageerror", (err) => errors.push(String(err)));
desktop.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
await desktop.goto("http://localhost:8080/", { waitUntil: "load", timeout: 30000 });
await desktop.waitForTimeout(20000);
await desktop.screenshot({ path: `${outDir}/nav-final-desktop.png` });
await desktop.evaluate(() => window.scrollTo(0, 300));
await desktop.waitForTimeout(800);
await desktop.screenshot({ path: `${outDir}/nav-final-scrolled.png` });

const mobile = await browser.newPage({ viewport: { width: 390, height: 700 } });
mobile.on("pageerror", (err) => errors.push(String(err)));
await mobile.goto("http://localhost:8080/", { waitUntil: "load", timeout: 30000 });
await mobile.waitForTimeout(3000);
await mobile.screenshot({ path: `${outDir}/nav-final-mobile.png` });
await mobile.click('button[aria-label="Toggle menu"]');
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: `${outDir}/nav-final-mobile-open.png` });

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
