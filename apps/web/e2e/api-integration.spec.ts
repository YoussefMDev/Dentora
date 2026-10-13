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
  await expect(page.getByRole('heading', { name: 'Care that starts with you.' })).toBeVisible();
  await page.getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A little inspiration, thoughtfully imagined.' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'We’re here to listen.' })).toBeVisible();
});

test('booking preview validates each step and clearly avoids creating a booking', async ({ page }) => {
  await page.goto('/book');
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.getByText('Choose a service to continue.')).toBeVisible();
  await page.getByLabel(/everyday care/i).check();
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
  await page.getByRole('link', { name: /explore this service/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Everyday care', exact: true })).toBeVisible();
  await page.goto('/services/not-a-demo-service');
  await expect(page.getByRole('heading', { name: 'That demo service isn’t here.' })).toBeVisible();
});
