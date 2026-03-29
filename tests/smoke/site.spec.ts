import { expect, test } from '@playwright/test';

test('homepage loads with core navigation and ctas', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Cake Marketing Collective/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Your world-building journey starts here.',
  );
  await expect(page.getByLabel('Primary').getByRole('link', { name: 'Work With Us' })).toBeVisible();
  await expect(page.getByLabel('Primary').getByRole('link', { name: 'About' })).toBeVisible();
});

test('work with us page exposes booking flow and pending form state', async ({ page }) => {
  await page.goto('/work-with-us');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Two steps, one clear next move.',
  );
  await expect(page.getByText('Public form link pending')).toBeVisible();

  const bookingLink = page.getByRole('link', { name: 'Book discovery call' }).first();
  await expect(bookingLink).toHaveAttribute(
    'href',
    /calendar\.google\.com\/calendar\/u\/0\/appointments\/schedules/,
  );
});
