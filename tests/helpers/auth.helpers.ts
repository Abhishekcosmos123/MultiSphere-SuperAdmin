import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/signin');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Logout' }).click();
  // Wait for redirect to login page
  await page.waitForURL('/signin');
}

export async function register(
  page: Page,
  email: string,
  password: string,
  name: string
) {
  await page.goto('/register');
  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign Up' }).click();
}

// Test user credentials
export const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
};
