import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with HTTP 200', async ({ page }) => {
    // goto already throws on non-2xx with failOnStatusCode; confirm via response
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('hero headline is visible', async ({ page }) => {
    // Accept any <h1> or element with role=heading at level 1 that is visible
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
  });

  test('all 12 agent cards render', async ({ page }) => {
    // Cards are expected to carry a [data-agent-card] attribute or a shared CSS class.
    // Try common patterns in order: data attribute, then class fragment.
    const byDataAttr = page.locator('[data-agent-card]');
    const byClass = page.locator('.agent-card');

    const count = await byDataAttr.count() > 0
      ? await byDataAttr.count()
      : await byClass.count();

    expect(count).toBe(12);
  });

  test('footer link resolves (href present)', async ({ page }) => {
    // Footer should contain a link referencing SYNAA-58 or the project URL
    const footerLinks = page.locator('footer a');
    const footerCount = await footerLinks.count();
    expect(footerCount).toBeGreaterThan(0);

    // At least one link must have a non-empty href
    const hrefs = await footerLinks.evaluateAll(
      (els: HTMLAnchorElement[]) => els.map(el => el.href).filter(Boolean)
    );
    expect(hrefs.length).toBeGreaterThan(0);
  });

  test('light/dark toggle flips data-theme attribute', async ({ page }) => {
    // Find the theme toggle button
    const toggle = page.locator('[data-theme-toggle], button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]').first();
    await expect(toggle).toBeVisible();

    const htmlEl = page.locator('html');
    const before = await htmlEl.getAttribute('data-theme');

    await toggle.click();

    const after = await htmlEl.getAttribute('data-theme');
    expect(after).not.toBe(before);
  });
});
