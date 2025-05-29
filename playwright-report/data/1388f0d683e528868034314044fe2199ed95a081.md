# Test info

- Name: Page Existence and Navigation >> Saved Text page loads correctly
- Location: /app/tests/navigation.spec.ts:22:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/saved-text", waiting until "load"

    at /app/tests/navigation.spec.ts:23:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Page Existence and Navigation', () => {
   4 |   test('Home page loads correctly', async ({ page }) => {
   5 |     await page.goto('/');
   6 |     // Replace with a selector for a unique element on the home page
   7 |     await expect(page.getByRole('heading', { name: 'TypeMaster' })).toBeVisible();
   8 |   });
   9 |
  10 |   test('Custom Text page loads correctly', async ({ page }) => {
  11 |     await page.goto('/custom-text');
  12 |     // Replace with a selector for a unique element on the custom text page
  13 |     await expect(page.getByRole('heading', { name: 'Custom Text' })).toBeVisible();
  14 |   });
  15 |
  16 |   test('Practice page loads correctly', async ({ page }) => {
  17 |     await page.goto('/practice');
  18 |     // Replace with a selector for a unique element on the practice page
  19 |     await expect(page.getByRole('heading', { name: 'Practice' })).toBeVisible();
  20 |   });
  21 |
  22 |   test('Saved Text page loads correctly', async ({ page }) => {
> 23 |     await page.goto('/saved-text');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  24 |     // Replace with a selector for a unique element on the saved text page
  25 |     await expect(page.getByRole('heading', { name: 'Saved Text' })).toBeVisible();
  26 |   });
  27 |
  28 |   test('Navbar "Typing Test" link navigates to home page', async ({ page }) => {
  29 |     await page.goto('/'); // Start from any page
  30 |     await page.getByRole('link', { name: "Application d'entraînement à la dactylographie" }).click();
  31 |     await expect(page).toHaveURL('/');
  32 |     await expect(page.getByRole('heading', { name: 'TypeMaster' })).toBeVisible();
  33 |   });
  34 |
  35 |   test('Navbar "Saved Text" link navigates to /saved-text', async ({ page }) => {
  36 |     await page.goto('/'); // Start from any page
  37 |     await page.getByRole('link', { name: 'Texte Sauvegardé' }).click();
  38 |     await expect(page).toHaveURL('/saved-text');
  39 |     await expect(page.getByRole('heading', { name: 'Saved Text' })).toBeVisible();
  40 |   });
  41 |
  42 |   // Since there are no direct links to /custom-text and /practice in the navbar or footer,
  43 |   // we will rely on the page existence tests for those pages.
  44 |   // If these pages were accessible via UI elements not in Navbar/Footer, those would be tested here.
  45 | });
  46 |
```