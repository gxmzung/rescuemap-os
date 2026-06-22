import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 1,
});

await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });

await page.screenshot({
  path: "../assets/screenshots/01_citizen_status_share.png",
  fullPage: true,
});

await page.getByText("기관 대시보드").click();
await page.waitForTimeout(800);
await page.screenshot({
  path: "../assets/screenshots/02_admin_dashboard.png",
  fullPage: true,
});

await page.getByText("SAR·위험 레이어").click();
await page.waitForTimeout(800);
await page.screenshot({
  path: "../assets/screenshots/03_sar_risk_layers.png",
  fullPage: true,
});

await page.getByText("오픈소스 키트").click();
await page.waitForTimeout(800);
await page.screenshot({
  path: "../assets/screenshots/04_open_source_kit.png",
  fullPage: true,
});

await browser.close();
