import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Landing page CTA buttons", () => {
  test("hero 'Try for Free' navigates to /order", async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.getByRole("link", { name: /try for free/i }).first().click();
    await expect(page).toHaveURL(/\/en\/order/);
  });

  test("hero 'Create a Video' navigates to /order", async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.getByRole("link", { name: /create a video/i }).click();
    await expect(page).toHaveURL(/\/en\/order/);
  });

  test("bottom CTA 'Start for Free' navigates to /order", async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.getByRole("link", { name: /start for free/i }).click();
    await expect(page).toHaveURL(/\/en\/order/);
  });
});

test.describe("Order flow — category + template selection", () => {
  test("shows 4 category cards on /order", async ({ page }) => {
    await page.goto(`${BASE}/en/order`);
    await expect(page.getByText("Toddlers")).toBeVisible();
    await expect(page.getByText("Kids")).toBeVisible();
    await expect(page.getByText("Adult Fun")).toBeVisible();
    await expect(page.getByText("Pets")).toBeVisible();
  });

  test("clicking a category shows templates", async ({ page }) => {
    await page.goto(`${BASE}/en/order`);
    await page.getByText("Kids").click();
    await expect(page.getByText("Choose a Style")).toBeVisible();
    await expect(page.getByText("Choose This Style").first()).toBeVisible();
  });

  test("back button returns to category selection", async ({ page }) => {
    await page.goto(`${BASE}/en/order`);
    await page.getByText("Toddlers").click();
    await page.getByRole("button", { name: /back/i }).click();
    await expect(page.getByText("Who is this video for?")).toBeVisible();
  });

  test("'Choose This Style' navigates to the questionnaire form", async ({ page }) => {
    await page.goto(`${BASE}/en/order`);
    await page.getByText("Kids").click();
    await page.getByText("Choose This Style").first().click();
    await expect(page).toHaveURL(/\/en\/order\/.+/);
    await expect(page.getByText("About the Birthday Star")).toBeVisible();
  });
});

test.describe("Questionnaire form — toddler category", () => {
  test("shows toddler-specific extra fields", async ({ page }) => {
    await page.goto(`${BASE}/en/order`);
    await page.getByText("Toddlers").click();
    await page.getByText("Choose This Style").first().click();
    await expect(page.getByText("Favourite Colour")).toBeVisible();
    await expect(page.getByText("Favourite Animal")).toBeVisible();
    await expect(page.getByText("Include a bedtime story segment?")).toBeVisible();
  });

  test("bedtime story theme field appears when checkbox is checked", async ({ page }) => {
    await page.goto(`${BASE}/en/order`);
    await page.getByText("Toddlers").click();
    await page.getByText("Choose This Style").first().click();
    await expect(page.locator("#storyTheme")).not.toBeVisible();
    await page.getByLabel("Include a bedtime story segment?").check();
    await expect(page.locator("#storyTheme")).toBeVisible();
  });

  test("COPPA consent appears for a child under 13", async ({ page }) => {
    await page.goto(`${BASE}/en/order`);
    await page.getByText("Toddlers").click();
    await page.getByText("Choose This Style").first().click();
    await page.locator("#age").fill("4");
    await expect(
      page.getByText(/parent or legal guardian/i)
    ).toBeVisible();
  });
});
