import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('http://localhost:3000/signin');
  });

  test('should display login form', async ({ page }) => {
    // Check if login form elements are present
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Submit the form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for the error response and check for error message
    await page.waitForResponse(response => response.url().includes('/api/login') && !response.ok());
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    // Click on registration link
    await page.getByRole('link', { name: 'Register' }).click();
    
    // Check if redirected to registration page
    await expect(page).toHaveURL('http://localhost:3000/register');
  });
});
