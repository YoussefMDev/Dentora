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

test('public navigation opens the implemented pages', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Good care feels like being heard.' })).toBeVisible();
  await page.getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Care is easier to explore one question at a time.' })).toBeVisible();
  await page.getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A little inspiration, thoughtfully imagined.' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'We’re here to listen.' })).toBeVisible();
});

test('booking preview validates each step and clearly avoids creating a booking', async ({ page }) => {
  await page.goto('/book');
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.getByText('Choose a service to continue.')).toBeVisible();
  await page.getByLabel(/dental checkup/i).check();
  await page.getByRole('button', { name: /continue/i }).click();
  await page.locator('#visit-date').fill('2026-10-14');
  await page.getByLabel('09:00').check();
  await page.getByRole('button', { name: /continue/i }).click();
  await page.getByLabel('Name', { exact: true }).fill('Demo Visitor');
  await page.getByLabel('Email', { exact: true }).fill('demo@example.test');
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.getByRole('heading', { name: 'Review your demo details' })).toBeVisible();
  await page.getByRole('button', { name: /finish preview/i }).click();
  await expect(page.getByRole('heading', { name: 'Your preview request is ready.' })).toBeVisible();
  await expect(page.getByText(/Nothing was sent or saved/)).toBeVisible();
});

test('booking wizard renders within desktop and mobile viewports', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/book');

    await expect(page.getByRole('heading', { name: 'Let’s find a time to talk.' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Demo appointment request wizard' })).toBeVisible();
    await expect(page.getByText('What would you like to talk about?', { exact: true })).toBeVisible();
    await expect(page.getByRole('radio').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText('Pick a date and time', { exact: true })).toBeVisible();
    await page.locator('#visit-date').fill('2026-10-14');
    await page.getByLabel('09:00').check();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText('How can we address you?', { exact: true })).toBeVisible();
    await page.getByLabel('Name', { exact: true }).fill('Demo Visitor');
    await page.getByLabel('Email', { exact: true }).fill('demo@example.test');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByRole('heading', { name: 'Review your demo details' })).toBeVisible();
    await page.getByRole('button', { name: /finish preview/i }).click();
    await expect(page.getByRole('heading', { name: 'Your preview request is ready.' })).toBeVisible();
  }
});

test('contact form validates input and gives demo-only confirmation', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: /preview submission/i }).click();
  await expect(page.getByText('Enter a name (up to 100 characters).')).toBeVisible();
  await page.getByLabel('Your name').fill('Demo Visitor');
  await page.getByLabel('Email address').fill('demo@example.test');
  await page.getByLabel('How can we help?').fill('This is a demo message.');
  await page.getByRole('button', { name: /preview submission/i }).click();
  await expect(page.getByRole('heading', { name: 'Preview complete' })).toBeVisible();
  await expect(page.getByText(/has not been sent or stored/)).toBeVisible();
});

test('gallery filters illustrative items and booking status remains demo-only', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('button', { name: 'Studio', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A calm place to begin' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A smile, in simple lines' })).toHaveCount(0);
  await page.goto('/booking-status');
  await page.getByLabel('Demo reference').fill('SAMPLE-001');
  await page.getByRole('button', { name: /show demo status/i }).click();
  await expect(page.getByRole('heading', { name: 'Pending review' })).toBeVisible();
  await expect(page.getByText(/No appointment exists/)).toBeVisible();
});

test('service cards navigate to a local demo detail page and unknown slugs are handled', async ({ page }) => {
  await page.goto('/services');
  await expect(page.getByRole('heading', { name: 'Care is easier to explore one question at a time.' })).toBeVisible();
  await expect(page.locator('.category-card')).toHaveCount(6);
  await expect(page.locator('.treatment-card')).toHaveCount(7);
  const faq = page.locator('.faq-list details').first();
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open', '');
  await page.getByRole('link', { name: 'Dental checkup', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dental checkup', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reasons to talk with a dentist' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What a consultation could cover' })).toBeVisible();
  await page.goto('/services/smile-consultation');
  await expect(page.getByRole('heading', { name: 'Smile goals consultation' })).toBeVisible();
  await page.goto('/services/tooth-restoration');
  await expect(page.getByRole('heading', { name: 'Tooth restoration discussion' })).toBeVisible();
  await page.goto('/services/not-a-demo-service');
  await expect(page.getByRole('heading', { name: 'That demo service isn’t here.' })).toBeVisible();
});

test('visual assets load locally and are identified as illustrative stock photography', async ({ page }) => {
  await page.goto('/');
  const heroImage = page.getByAltText(/empty dental treatment room with an exam chair and monitor/i);
  await expect(heroImage).toBeVisible();
  await expect.poll(() => heroImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(new URL(await heroImage.evaluate((image) => (image as HTMLImageElement).src)).origin).toBe('http://127.0.0.1:4200');

  await page.getByRole('heading', { name: /technology & comfort/i }).scrollIntoViewIfNeeded();
  await expect(page.getByText(/not verified Dentora facilities/i)).toBeVisible();

  await page.goto('/services');
  const servicesImage = page.getByAltText(/unoccupied dental treatment room with an exam chair/i);
  await expect(servicesImage).toBeVisible();
  await expect.poll(() => servicesImage.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

  await page.goto('/about');
  await expect(page.getByAltText(/illustrative stock photography, not Dentora premises/i)).toBeVisible();

  await page.goto('/gallery');
  await expect(page.getByRole('img', { name: /shown as illustrative stock photography/i }).first()).toBeVisible();

  await page.goto('/services/smile-consultation');
  await expect(page.getByAltText(/not Dentora premises/i)).toBeVisible();
});
