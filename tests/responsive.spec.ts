import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 812, label: 'mobile (375px)' },
  { width: 768, height: 1024, label: 'tablet (768px)' },
  { width: 1280, height: 800, label: 'desktop (1280px)' },
];

for (const vp of VIEWPORTS) {
  test(`no horizontal scroll at ${vp.label}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');

    const scrollWidth: number = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth: number = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
}
