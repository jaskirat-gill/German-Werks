import { chromium } from "@playwright/test";
import fs from "fs";

const [baseUrl, outDir, productHandle = "carbon-front-splitter", optionLabel = "Gloss"] = process.argv.slice(2);
if (!baseUrl || !outDir) {
  console.error("usage: tsx scripts/screenshots.ts <baseUrl> <outDir> [productHandle] [optionLabel]");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 } });
  const page = await context.newPage();
  const shot = (name: string) => page.screenshot({ path: `${outDir}/${name}-${width}.png`, fullPage: name !== "cart-open" });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await shot("home");

  await page.goto(`${baseUrl}/search`, { waitUntil: "networkidle" });
  await shot("catalog");

  await page.goto(`${baseUrl}/product/${productHandle}`, { waitUntil: "networkidle" });
  await shot("pdp");

  try {
    await page.getByRole("button", { name: optionLabel, exact: true }).first().click({ timeout: 5000 });
    await page.getByRole("button", { name: "Add to cart" }).first().click({ timeout: 5000 });
    await page.getByText("My Cart").waitFor({ timeout: 10000 });
    await page.getByRole("link", { name: /Carbon Front Splitter|splitter/i }).first().waitFor({ timeout: 10000 }).catch(() => undefined);
    await page.waitForTimeout(1000);
    await shot("cart-open");
  } catch (error) {
    console.error(`cart-open ${width} failed:`, (error as Error).message.split("\n")[0]);
  }

  await context.close();
}

await browser.close();
