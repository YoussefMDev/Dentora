import { expect, test } from '@playwright/test';

test('Angular fetches and displays the Express health response through /api', async ({ page }) => {
  const apiRequest = page.waitForRequest(
    (request) => request.url() === 'http://127.0.0.1:4200/api/health',
  );
  await page.goto('/');
  const request = await apiRequest;
  expect(new URL(request.url()).origin).toBe('http://127.0.0.1:4200');
  await expect(page.getByTestId('api-status')).toHaveText('ok');
});
