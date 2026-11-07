import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mobile navigation reaches work and closes the menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
test("chapters support keyboard navigation and change the project media", async ({
  page,
}) => {
  await page.goto("/");
  const first = page.getByRole("tab", { name: "Assets", exact: true });
  await first.focus();
  await first.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Search", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "One search. A clearer path.",
  );
  await expect(page.locator(".project-screen img")).toHaveAttribute(
    "src",
    "/media/dreamaan-search.webp",
  );
  await page.getByRole("tab", { name: "Search", exact: true }).press("End");
  await expect(
    page.getByRole("tab", { name: "References", exact: true }),
  ).toBeFocused();
});
test("case study traps focus, plays real media, and restores focus on Escape", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Open Dreamaan case study",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Walkthrough", exact: true })
    .click();
  await expect(async () =>
    expect(
      await dialog.locator("video").evaluate((el) => el.readyState),
    ).toBeGreaterThanOrEqual(2),
  ).toPass({ timeout: 15000 });
  await dialog.getByRole("button", { name: "Next chapter" }).focus();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest("dialog") !== null,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test("layouts fit phone, tablet, desktop, and landscape widths", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 780],
    [375, 812],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 1000],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page
        .locator("[data-reveal]")
        .evaluateAll((els) =>
          els.every((el) => getComputedStyle(el).opacity === "1"),
        ),
    ).toBe(true);
  }
});
test("all published media and the resume resolve successfully", async ({
  request,
}) => {
  for (const url of [
    "/Dorsa-Khalili-CV.pdf",
    "/media/dreamaan-assets.webp",
    "/media/dreamaan-search.webp",
    "/media/dreamaan-studio.webp",
    "/media/dreamaan-references.webp",
    "/media/dreamaan-picker.webp",
    "/media/dreamaan-assets-mobile.webp",
    "/media/dreamaan-art.webp",
    "/media/dreamaan-walkthrough.webm",
    "/media/walkthrough.vtt",
    "/social-preview.png",
  ]) {
    const response = await request.get(url);
    expect(response.ok(), url).toBe(true);
    expect(response.headers()["content-type"], url).not.toContain("text/html");
  }
});
test("main page and dialog have no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const audit = async () => {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      ),
    ).toEqual([]);
  };
  await audit();
  await page
    .getByRole("button", { name: "Open Dreamaan case study", exact: true })
    .click();
  await audit();
});
