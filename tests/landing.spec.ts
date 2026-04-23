import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    // baseURL ends with '/synaa-demo/' so '' resolves there; '/' would hit origin root
    await page.goto('');
  });

  test('page loads with HTTP 200', async ({ page }) => {
    const response = await page.goto('');
    expect(response?.status()).toBe(200);
  });

  test('hero headline is visible', async ({ page }) => {
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
  });

  test('all 12 agent cards render', async ({ page }) => {
    const cards = page.locator('.agent-card');
    await expect(cards).toHaveCount(12);
  });

  test('footer link resolves (href present)', async ({ page }) => {
    const footerLinks = page.locator('footer a');
    await expect(footerLinks.first()).toBeVisible();

    const hrefs = await footerLinks.evaluateAll(
      (els: HTMLAnchorElement[]) => els.map(el => el.href).filter(Boolean)
    );
    expect(hrefs.length).toBeGreaterThan(0);
  });

  test('light/dark toggle flips dark class on <html>', async ({ page }) => {
    const toggle = page.locator('#themeToggle');
    await expect(toggle).toBeVisible();

    const htmlEl = page.locator('html');

    // Force a known starting state (light)
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    const hasDarkBefore = await htmlEl.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkBefore).toBe(false);

    await toggle.click();

    const hasDarkAfter = await htmlEl.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkAfter).toBe(true);
  });
});
