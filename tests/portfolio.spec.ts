import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("technology keys connect to work without removing or shifting cards", async ({
  page,
}) => {
  await page.goto("/");
  const react = page.getByRole("button", { name: "React", exact: true });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Dorsa");
  await expect(
    page
      .getByRole("group", { name: "Interactive technology keyboard" })
      .getByRole("button"),
  ).toHaveCount(16);
  const cards = page.locator(".work-card");
  await expect(cards).toHaveCount(3);
  await react.click();
  await expect(react).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".work-filter")).toHaveText(
    "React → 2 projects highlighted",
  );
  await expect(page.locator('.work-card[data-match="true"]')).toHaveCount(2);
  await expect(cards).toHaveCount(3);
  await page.getByRole("button", { name: "Figma", exact: true }).click();
  await expect(page.locator(".work-filter")).toHaveText(
    "Figma · Part of my workflow",
  );
  await expect(page.locator(".work-card[data-match]")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator(".work-filter")).toHaveText(
    "A few things I’ve brought to life.",
  );
});

test("physical shortcuts select keys and respect modal and modifier boundaries", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "React", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("r");
  await expect(
    page.getByRole("button", { name: "React", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Control+n");
  await expect(
    page.getByRole("button", { name: "Next.js", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page
    .getByRole("button", { name: "Explore Dreamaan", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("n");
  await expect(page.locator('.keycap[aria-label="Next.js"]')).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Explore Dreamaan", exact: true }),
  ).toBeFocused();
});

test("Dreamaan exposes all five real product scenes and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.getByRole("button", {
    name: "Explore Dreamaan",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  const home = dialog.getByLabel("Dreamaan Home walkthrough");
  await expect(home).toBeVisible();
  await expect
    .poll(() => home.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  for (const name of ["Project", "Organization", "Studio"]) {
    await dialog.getByRole("button", { name, exact: true }).click();
    await expect(
      dialog.getByLabel(`Dreamaan ${name} walkthrough`),
    ).toBeVisible();
  }
  await dialog.getByRole("button", { name: "Login", exact: true }).click();
  const image = dialog.getByRole("img");
  await expect
    .poll(() =>
      image.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBeTruthy();
  await dialog.getByRole("button", { name: "Close project" }).click();
  await expect(opener).toBeFocused();
});

test("project clips load, captions exist, and media posters are real images", async ({
  page,
  request,
}) => {
  await page.goto("/");
  for (const name of ["Game Hub", "Calorie Tracker"]) {
    await page
      .getByRole("button", { name: `Explore ${name}`, exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    const media = dialog.locator("video");
    await expect
      .poll(() => media.evaluate((v: HTMLVideoElement) => v.readyState))
      .toBeGreaterThanOrEqual(2);
    await expect(media.locator("track")).toHaveCount(1);
    if (name === "Game Hub")
      await expect(dialog).toContainText("offline catalog");
    await dialog.getByRole("button", { name: "Close project" }).click();
  }
  for (const file of [
    "calorie-walkthrough.vtt",
    "gamehub-walkthrough.vtt",
    "dreamaan-home.vtt",
  ])
    expect((await request.get(`/media/${file}`)).ok()).toBeTruthy();
  await expect
    .poll(() =>
      page
        .locator(".work-media>img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBeTruthy();
});

test("compact career selection and back to top work with reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Pardik Smart Home/ }).click();
  await expect(page.locator(".career-context")).toContainText("React, Next.js");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  const top = page.getByRole("button", { name: "Back to top", exact: true });
  await expect(top).toBeVisible();
  await top.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator("#home")).toBeFocused();
});

test("mobile navigation, aligned cards, and all viewport sizes avoid overflow", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBeTruthy();
    if (width === 390) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Work", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Open menu" }),
      ).toBeVisible();
    }
  }
  const media = await page
    .locator(".work-card:not(.featured) .work-media")
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  expect(Math.abs(media[0].top - media[1].top)).toBeLessThan(1);
  expect(Math.abs(media[0].height - media[1].height)).toBeLessThan(1);
});

test("native keyboard controls and project modal pass accessibility checks", async ({
  page,
}) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1440, height: 1000 });
  const scan = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
  expect((await scan()).violations).toEqual([]);
  await page
    .getByRole("button", { name: "Explore Dreamaan", exact: true })
    .click();
  expect((await scan()).violations).toEqual([]);
});

test("motion mode retains functional keys and plays previews only on intent", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.waitForTimeout(1200);
  const key = page.getByRole("button", { name: "React", exact: true });
  await key.hover();
  await expect(page.locator(".keyboard-readout")).toContainText(
    "Interfaces for creative workflows",
  );
  await key.click();
  await expect(key).toHaveAttribute("aria-pressed", "true");
  const preview = page.getByRole("button", {
    name: "Explore Game Hub",
    exact: true,
  });
  await preview.hover();
  const video = preview.locator("video");
  await expect
    .poll(() =>
      video.evaluate((v: HTMLVideoElement) => !v.paused && v.readyState >= 2),
    )
    .toBeTruthy();
  await page.mouse.move(0, 0);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBeTruthy();
});
