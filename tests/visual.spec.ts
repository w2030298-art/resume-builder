import { expect, test, type Page } from "@playwright/test";

const templates = ["classic", "modern", "minimal", "compact"] as const;
const languages = ["zh", "en"] as const;

const templateNames = {
  classic: /经典|Classic/i,
  modern: /现代|Modern/i,
  minimal: /简约|Minimal/i,
  compact: /紧凑|Compact/i,
} as const;

async function resetApp(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await hideNextDevTools(page);
  await expect(page.locator("#resume-preview")).toBeVisible();
}

async function hideNextDevTools(page: Page) {
  await page.addStyleTag({
    content: `
      [data-nextjs-dev-tools-button],
      [data-nextjs-dev-tools-panel],
      nextjs-portal {
        display: none !important;
      }
    `,
  });
}

async function selectTemplate(page: Page, template: (typeof templates)[number]) {
  await page.getByRole("button", { name: templateNames[template] }).click();
}

async function setLanguage(page: Page, lang: "zh" | "en") {
  const buttonName = lang === "en" ? "EN" : "中文";
  const button = page.getByRole("button", { name: buttonName, exact: true });
  if (await button.isVisible()) {
    await button.click();
  }
}

test.describe("resume visual snapshots", () => {
  for (const templateName of templates) {
    for (const language of languages) {
      test(`template ${templateName} ${language}`, async ({ page }) => {
        await resetApp(page);
        await selectTemplate(page, templateName);
        await setLanguage(page, language);

        await expect(page).toHaveScreenshot(`main-${templateName}-${language}.png`, {
          fullPage: true,
        });
        await expect(page.locator("#resume-preview")).toHaveScreenshot(
          `preview-${templateName}-${language}.png`,
        );
      });
    }
  }
});

test("one click PDF export triggers download", async ({ page }) => {
  await resetApp(page);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /一键导出 PDF|Export PDF/i }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/resume\.pdf$/);
});

test("hide campus activities", async ({ page }) => {
  await resetApp(page);

  await page
    .getByRole("button", { name: /隐藏 校园经历|Hide Campus Activities/i })
    .click();

  await page.reload();
  await hideNextDevTools(page);

  const preview = page.locator("#resume-preview");
  await expect(preview).not.toContainText("校园经历");
  await expect(preview).not.toContainText("Campus Activities");
  await expect(preview).toHaveScreenshot("layout-hidden-campus.png");
});
