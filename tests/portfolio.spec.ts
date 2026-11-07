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

test("technology marquee fills wide screens and supports motion controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1878, height: 1000 });
  await page.goto("/");
  const strip = page.getByRole("region", { name: "Core technologies" });
  await strip.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const track = strip.locator(":scope > div").first();
  const x = () =>
    track.evaluate((element) => element.getBoundingClientRect().x);
  const trackBox = await track.boundingBox(),
    stripBox = await strip.boundingBox();
  expect(trackBox!.width).toBeGreaterThanOrEqual(stripBox!.width - 1);
  const initial = await x();
  await page.waitForTimeout(350);
  expect(await x()).toBeLessThan(initial - 1);
  await page.getByRole("button", { name: "Pause technology marquee" }).click();
  const paused = await x();
  await page.waitForTimeout(250);
  expect(Math.abs((await x()) - paused)).toBeLessThan(0.5);
  await page.getByRole("button", { name: "Resume technology marquee" }).click();
  await strip.hover();
  const hovered = await x();
  await page.waitForTimeout(250);
  expect(Math.abs((await x()) - hovered)).toBeLessThan(0.5);
  await page.mouse.move(0, 0);
  await strip.focus();
  const focused = await x();
  await page.waitForTimeout(250);
  expect(Math.abs((await x()) - focused)).toBeLessThan(0.5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Pause technology marquee" }),
  ).toBeHidden();
  expect(await strip.locator(".technology-item:visible").count()).toBe(6);
  const reduced = await x();
  await page.waitForTimeout(250);
  expect(Math.abs((await x()) - reduced)).toBeLessThan(0.5);
});

test("project studies provide real filtering and calorie state updates", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Puzzle", exact: true }).click();
  await expect(page.locator(".preview-game")).toHaveCount(1);
  await expect(page.locator(".preview-game")).toContainText("Monument");
  await page
    .getByRole("textbox", { name: "Filter preview games" })
    .fill("missing");
  await expect(page.getByText("No matches. Try another title.")).toBeVisible();
  await page.getByRole("textbox", { name: "Filter preview games" }).fill("");
  await page
    .locator(".game-preview")
    .getByRole("button", { name: "All", exact: true })
    .click();
  await expect(page.locator(".preview-game")).toHaveCount(3);
  const total = page.getByLabel("Preview net calories");
  await expect(total).toHaveText("1,040");
  await page.getByRole("button", { name: "Add a snack" }).click();
  await expect(total).toHaveText("1,190");
  await page.getByRole("button", { name: "Take a walk" }).click();
  await expect(total).toHaveText("1,090");
  await page.getByRole("button", { name: "Reset calorie preview" }).click();
  await expect(total).toHaveText("1,040");
});
test("the curve study has a keyboard alternative to dragging", async ({
  page,
}) => {
  await page.goto("/");
  const path = page.locator(".lab-curve");
  const before = await path.getAttribute("d");
  await page.getByRole("button", { name: "Move the point" }).focus();
  await page.keyboard.press("Enter");
  await expect(path).not.toHaveAttribute("d", before!);
  await page.getByRole("button", { name: "Soft response" }).click();
  await expect(
    page.getByRole("button", { name: "Direct response" }),
  ).toHaveAttribute("aria-pressed", "false");
});
test("ambient motion can be stopped and sculpture forms are selectable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Orb", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Orb", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Loop", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Loop", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const field = page.locator(".ambient-background");
  await page.mouse.move(400, 300);
  const image = () => field.evaluate((el: HTMLCanvasElement) => el.toDataURL());
  const before = await image();
  await page.waitForTimeout(300);
  expect(await image()).not.toBe(before);
  await page.getByRole("button", { name: "Pause ambient motion" }).click();
  await page.waitForTimeout(150);
  const frozen = await image();
  await page.waitForTimeout(250);
  expect(await image()).toBe(frozen);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(field).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Resume ambient motion" }),
  ).toBeHidden();
});

test("the visual toolkit filters skills and supports keyboard selection", async ({
  page,
}) => {
  await page.goto("/");
  const toolkit = page.getByRole("region", { name: /Different tools/ });
  const nodes = page.getByRole("group", { name: "Explore technologies" });
  await expect(nodes.getByRole("button")).toHaveCount(12);
  await nodes.getByRole("button", { name: "TypeScript", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "A little more certainty." }),
  ).toBeVisible();
  await expect(
    nodes.getByRole("button", { name: "TypeScript", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("group", { name: "Filter technologies" })
    .getByRole("button", { name: "Refine", exact: true })
    .click();
  await expect(nodes.getByRole("button")).toHaveCount(3);
  await expect(
    page.getByRole("heading", { name: "Confidence in the details." }),
  ).toBeVisible();
  await nodes.getByRole("button", { name: "Playwright", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Try the whole journey." }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Filter technologies" })
    .getByRole("button", { name: "All", exact: true })
    .click();
  await expect(nodes.getByRole("button")).toHaveCount(12);
  await expect(toolkit).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  await nodes
    .getByRole("button", { name: "AI assistants", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Assisted. Still considered." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
