import { test, expect } from '@playwright/test';

test.describe('Page Existence and Navigation', () => {
  test('Home page loads correctly', async ({ page }) => {
    await page.goto('/');
    // Replace with a selector for a unique element on the home page
    await expect(page.getByRole('heading', { name: 'TypeMaster' })).toBeVisible();
  });

  test('Custom Text page loads correctly', async ({ page }) => {
    await page.goto('/custom-text');
    // Replace with a selector for a unique element on the custom text page
    await expect(page.getByRole('heading', { name: 'Custom Text' })).toBeVisible();
  });

  test('Practice page loads correctly', async ({ page }) => {
    await page.goto('/practice');
    // Replace with a selector for a unique element on the practice page
    await expect(page.getByRole('heading', { name: 'Practice' })).toBeVisible();
  });

  test('Saved Text page loads correctly', async ({ page }) => {
    await page.goto('/saved-text');
    // Replace with a selector for a unique element on the saved text page
    await expect(page.getByRole('heading', { name: 'Saved Text' })).toBeVisible();
  });

  test('Navbar "Typing Test" link navigates to home page', async ({ page }) => {
    await page.goto('/'); // Start from any page
    await page.getByRole('link', { name: "Application d'entraînement à la dactylographie" }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'TypeMaster' })).toBeVisible();
  });

  test('Navbar "Saved Text" link navigates to /saved-text', async ({ page }) => {
    await page.goto('/'); // Start from any page
    await page.getByRole('link', { name: 'Texte Sauvegardé' }).click();
    await expect(page).toHaveURL('/saved-text');
    await expect(page.getByRole('heading', { name: 'Saved Text' })).toBeVisible();
  });

  // Since there are no direct links to /custom-text and /practice in the navbar or footer,
  // we will rely on the page existence tests for those pages.
  // If these pages were accessible via UI elements not in Navbar/Footer, those would be tested here.
});
