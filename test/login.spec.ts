import { test, expect } from '@playwright/test';

const BASE_URL = 'https://staging.d2o84tyslvzps4.amplifyapp.com';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('successful login redirects to the dashboard', async ({ page }) => {
    await page.getByLabel('Username').fill('demo');
    await page.getByLabel('Password').fill('demo123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Dashboard should be visible
    await expect(page).toHaveURL(BASE_URL + '/');
    await expect(page.getByText('Overview')).toBeVisible();

    // User avatar with initials should appear in the top bar
    await expect(page.getByRole('button', { name: 'AM' })).toBeVisible();

    // Key KPI cards should be rendered
    await expect(page.getByText('Monthly Income')).toBeVisible();
    await expect(page.getByText('Total Spent')).toBeVisible();
  });

  test('invalid credentials show an error message', async ({ page }) => {
    await page.getByLabel('Username').fill('wronguser');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should stay on the login page
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    // Error message should appear
    await expect(
      page.getByText('Invalid credentials. Use demo / demo123')
    ).toBeVisible();

    // Dashboard should not be rendered
    await expect(page.getByText('Monthly Income')).not.toBeVisible();
  });
});
