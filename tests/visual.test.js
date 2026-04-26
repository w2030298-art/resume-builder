import { test } from "@playwright/test";
import { Eyes, ClassicRunner, Target, Configuration, BatchInfo } from "@applitools/eyes-playwright";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const BATCH_NAME = "Resume Builder Visual Tests";

let eyes;

test.beforeAll(async () => {
  const runner = new ClassicRunner();
  eyes = new Eyes(runner);
  const config = new Configuration();
  config.setBatch(new BatchInfo(BATCH_NAME));
  eyes.setConfiguration(config);
});

test.afterAll(async () => {
  try {
    const results = await eyes.getRunner().getAllTestResults();
    console.log("\n=== Visual Test Summary ===");
    console.log(results.toString());
  } catch {}
});

test.beforeEach(async ({ page }) => {
  await eyes.open(page, "Resume Builder", test.info().title);
});

test.afterEach(async () => {
  try {
    await eyes.close();
  } catch {}
});

test("Classic template - Chinese", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=经典", { timeout: 15000 });

  await page.locator("button", { hasText: "经典" }).click();
  await page.waitForTimeout(500);

  await eyes.check("Classic Template - Chinese", Target.window().fully());
});

test("Modern template - Chinese", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=现代", { timeout: 15000 });

  await page.locator("button", { hasText: "现代" }).click();
  await page.waitForTimeout(500);

  await eyes.check("Modern Template - Chinese", Target.window().fully());
});

test("Minimal template - Chinese", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=简约", { timeout: 15000 });

  await page.locator("button", { hasText: "简约" }).click();
  await page.waitForTimeout(500);

  await eyes.check("Minimal Template - Chinese", Target.window().fully());
});

test("Compact template - Chinese", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=紧凑", { timeout: 15000 });

  await page.locator("button", { hasText: "紧凑" }).click();
  await page.waitForTimeout(500);

  await eyes.check("Compact Template - Chinese", Target.window().fully());
});

test("Classic template - English", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=经典", { timeout: 15000 });

  await page.locator("button", { hasText: "EN" }).click();
  await page.waitForTimeout(300);

  await page.locator("button", { hasText: "Classic" }).click();
  await page.waitForTimeout(500);

  await eyes.check("Classic Template - English", Target.window().fully());
});

test("Modern template - English", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=经典", { timeout: 15000 });

  await page.locator("button", { hasText: "EN" }).click();
  await page.waitForTimeout(300);

  await page.locator("button", { hasText: "Modern" }).click();
  await page.waitForTimeout(500);

  await eyes.check("Modern Template - English", Target.window().fully());
});

test("Sidebar editor - Personal Info section", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=基本信息", { timeout: 15000 });

  await eyes.check("Editor - Personal Info", Target.region(
    page.locator(".w-\\[420px\\]")
  ).fully());
});

test("Sidebar editor - Education section", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=基本信息", { timeout: 15000 });

  await page.locator("button", { hasText: "教育背景" }).click();
  await page.waitForTimeout(300);

  await eyes.check("Editor - Education", Target.region(
    page.locator(".w-\\[420px\\]")
  ).fully());
});

test("Export bar", async ({ page }) => {
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=PDF", { timeout: 15000 });

  await eyes.check("Export Bar", Target.region(
    page.locator(".border-b").nth(1)
  ));
});
