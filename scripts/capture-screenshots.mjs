import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../assets/screenshots");

const pages = [
  { url: "http://localhost:3000/dashboard", file: "01-dashboard.png" },
  { url: "http://localhost:3000/daily", file: "02-daily.png" },
  { url: "http://localhost:3000/transactions", file: "03-transactions.png" },
  { url: "http://localhost:3000/accounts", file: "04-accounts.png" },
  { url: "http://localhost:3000/net-worth", file: "05-net-worth.png" },
  { url: "http://localhost:3000/import", file: "06-import.png" },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
});
const page = await context.newPage();

for (const item of pages) {
  await page.goto(item.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  // Skip onboarding redirect if present by waiting for main content text
  const body = await page.locator("body").innerText();
  if (body.includes("Onboarding") || body.includes("Começar")) {
    // try force navigate again after short wait
    await page.goto(item.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2000);
  }
  await page.waitForSelector("text=Carregando Aurea Finance...", { state: "detached", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(800);
  const dest = path.join(outDir, item.file);
  await page.screenshot({ path: dest, fullPage: false });
  console.log(`OK ${item.file}`);
}

await browser.close();
