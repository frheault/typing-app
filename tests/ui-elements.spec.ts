import { test, expect } from '@playwright/test';

test.describe('UI Element Verification', () => {
  // Tests for Home Page
  test.describe('Home Page UI Elements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('Topic selection dropdown is present', async ({ page }) => {
      await expect(page.getByRole('combobox').first()).toBeVisible();
    });

    test('Time selection dropdown is present', async ({ page }) => {
      await expect(page.getByRole('combobox').nth(1)).toBeVisible();
    });

    test('Start Practice button is present', async ({ page }) => {
      await expect(page.getByRole('button', { name: "Commencer l'entraînement" })).toBeVisible();
    });

    test('Saved Texts button is present', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Textes Sauvegardés' })).toBeVisible();
    });

    test('Create Custom Text button is present', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Créer un Texte Personnalisé' })).toBeVisible();
    });
  });

  // Tests for Custom Text Page
  test.describe('Custom Text Page UI Elements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/custom-text');
    });

    test('File input for uploading code/text is present', async ({ page }) => {
      await expect(page.getByLabel('Télécharger un fichier de code/texte (.py, .cpp, .txt, ou .bin pour obfusqué)')).toBeVisible();
    });

    test('Label input for the training session is present', async ({ page }) => {
      await expect(page.getByLabel("Libellé de l'entraînement")).toBeVisible();
    });

    test('Text area for manually pasting text is present', async ({ page }) => {
      await expect(page.getByLabel('Ou collez le texte manuellement (Le contenu du fichier téléchargé ne sera pas affiché ici)')).toBeVisible();
    });

    test('Language selection dropdown is present', async ({ page }) => {
      await expect(page.getByLabel('Langue (pour la coloration syntaxique)')).toBeVisible();
    });

    test('Save and Go to Practice button is present', async ({ page }) => {
      await expect(page.getByRole('button', { name: "Sauvegarder et Aller à l'entraînement" })).toBeVisible();
    });
  });

  // Tests for Practice Page
  test.describe('Practice Page UI Elements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/practice');
    });

    test('Progress bar is present (if applicable)', async ({ page }) => {
      // This test will only pass if eclipsedTime is set and > 0
      // If practice can start with infinite time, this might not always be visible
      await expect(page.getByRole('progressbar')).toBeVisible();
    });

    test('Character display area is present', async ({ page }) => {
      // Using a class that's specific to the character display area
      await expect(page.locator('.font-mono').first()).toBeVisible();
    });

    test('Timer display is present', async ({ page }) => {
      await expect(page.getByText('Timer :')).toBeVisible();
    });

    test('Accuracy display is present', async ({ page }) => {
      await expect(page.getByText('Précision :')).toBeVisible();
    });

    test('CPM display is present', async ({ page }) => {
      await expect(page.getByText('CPM :')).toBeVisible();
    });

    test('Submit/Finish button is present', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Soumettre / Terminer' })).toBeVisible();
    });

    test('Reset Practice button is present', async ({ page }) => {
      await expect(page.getByRole('button', { name: "Réinitialiser l'entraînement" })).toBeVisible();
    });
  });

  // Tests for Saved Text Page
  test.describe('Saved Text Page UI Elements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/saved-text');
    });

    test('Custom Texts heading is present', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Textes Personnalisés' })).toBeVisible();
    });

    test('Create button is present', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Créer' })).toBeVisible();
    });

    // Note: The following tests depend on having at least one saved text.
    // These might fail if localStorage is empty.
    test('Saved text card elements are present (if any saved texts exist)', async ({ page }) => {
      // Check if any saved text cards are rendered
      const savedTextCards = page.locator('.card-title'); // A bit generic, adjust if a better selector exists
      if (await savedTextCards.count() > 0) {
        const firstCard = savedTextCards.first();
        // Example checks for the first card, can be extended or looped for all
        await expect(firstCard).toBeVisible(); // Check for the label/title

        // Locate buttons within the context of the first card's parent or a more specific container
        const cardContainer = firstCard.locator('xpath=ancestor::div[contains(@class, "shadow")]'); // Go up to the card container

        await expect(cardContainer.getByRole('button', { name: 'Delete' })).toBeVisible(); // Using name based on potential aria-label or similar for icon buttons
        await expect(cardContainer.getByRole('button', { name: 'Edit' })).toBeVisible();   // Adjust if icons don't have names
        await expect(cardContainer.getByRole('link', { name: "S'entraîner" })).toBeVisible();
      } else {
        // Optionally, add an assertion here if no texts are saved, e.g., a "no texts" message.
        console.log('No saved texts found, skipping card element tests.');
      }
    });
  });
});
