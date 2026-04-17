import { expect, test } from '@playwright/test';

test('homepage loads with the new architecture navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Cake Marketing Collective/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Culture-backed strategies for mission-focused brands.',
  );
  await expect(page.getByLabel('Primary').getByRole('link', { name: 'Services' })).toBeVisible();
  await expect(page.getByLabel('Primary').getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByLabel('Primary').getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByLabel('Primary').getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Client Portal' })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Studio' })).toBeVisible();
});

test('footer stacks the revised navigation and social links', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').scrollIntoViewIfNeeded();

  await expect(page.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/_cakemarketing/',
  );
  await expect(page.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
    'href',
    'https://www.facebook.com/cakemarketingllc',
  );
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/company/officialcakemarketing_',
  );
});

test('contact page exposes the native intake flow', async ({ page }) => {
  await page.goto('/contact');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Start with the right intake. Route to the right next step.',
  );
  await expect(page.getByText('Each service runs its own progressive intake branch.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Brand Strategy' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Social Media Strategy / Services' })).toBeVisible();
  await expect(page.getByText(/complete/)).toBeVisible();
});

test('service, case study, and insight detail routes render', async ({ page }) => {
  await page.goto('/services/performance-marketing');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Performance Marketing Agency in',
  );

  await page.goto('/work/linkfest');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('LinkFest');

  await page.goto('/insights/integrated-growth-culture-led-brands');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'What Integrated Growth Actually Looks Like for Culture-Led Brands',
  );
});

test('studio and portal routes redirect to secure access when unauthenticated', async ({ page }) => {
  await page.goto('/studio');
  await expect(page).toHaveURL(/\/access\?next=%2Fstudio/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Sign in to the Cake platform.',
  );

  await page.goto('/portal');
  await expect(page).toHaveURL(/\/access\?next=%2Fportal/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Sign in to the Cake platform.',
  );
});
