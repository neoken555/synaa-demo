import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('no critical or serious violations on home page', async ({ page }) => {
    await page.goto('');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (blocking.length > 0) {
      const summary = blocking
        .map(v => `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.length}`)
        .join('\n');
      throw new Error(`Accessibility violations found:\n${summary}`);
    }

    expect(blocking).toHaveLength(0);
  });
});
