# Test info

- Name: UI Element Verification >> Custom Text Page UI Elements >> Save and Go to Practice button is present
- Location: /app/tests/ui-elements.spec.ts:53:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Invalid url: "/custom-text"
Call log:
  - navigating to "/custom-text", waiting until "load"

    at /app/tests/ui-elements.spec.ts:34:18
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('UI Element Verification', () => {
   4 |   // Tests for Home Page
   5 |   test.describe('Home Page UI Elements', () => {
   6 |     test.beforeEach(async ({ page }) => {
   7 |       await page.goto('/');
   8 |     });
   9 |
   10 |     test('Topic selection dropdown is present', async ({ page }) => {
   11 |       await expect(page.getByRole('combobox').first()).toBeVisible();
   12 |     });
   13 |
   14 |     test('Time selection dropdown is present', async ({ page }) => {
   15 |       await expect(page.getByRole('combobox').nth(1)).toBeVisible();
   16 |     });
   17 |
   18 |     test('Start Practice button is present', async ({ page }) => {
   19 |       await expect(page.getByRole('button', { name: "Commencer l'entraînement" })).toBeVisible();
   20 |     });
   21 |
   22 |     test('Saved Texts button is present', async ({ page }) => {
   23 |       await expect(page.getByRole('button', { name: 'Textes Sauvegardés' })).toBeVisible();
   24 |     });
   25 |
   26 |     test('Create Custom Text button is present', async ({ page }) => {
   27 |       await expect(page.getByRole('button', { name: 'Créer un Texte Personnalisé' })).toBeVisible();
   28 |     });
   29 |   });
   30 |
   31 |   // Tests for Custom Text Page
   32 |   test.describe('Custom Text Page UI Elements', () => {
   33 |     test.beforeEach(async ({ page }) => {
>  34 |       await page.goto('/custom-text');
      |                  ^ Error: page.goto: Protocol error (Page.navigate): Invalid url: "/custom-text"
   35 |     });
   36 |
   37 |     test('File input for uploading code/text is present', async ({ page }) => {
   38 |       await expect(page.getByLabel('Télécharger un fichier de code/texte (.py, .cpp, .txt, ou .bin pour obfusqué)')).toBeVisible();
   39 |     });
   40 |
   41 |     test('Label input for the training session is present', async ({ page }) => {
   42 |       await expect(page.getByLabel("Libellé de l'entraînement")).toBeVisible();
   43 |     });
   44 |
   45 |     test('Text area for manually pasting text is present', async ({ page }) => {
   46 |       await expect(page.getByLabel('Ou collez le texte manuellement (Le contenu du fichier téléchargé ne sera pas affiché ici)')).toBeVisible();
   47 |     });
   48 |
   49 |     test('Language selection dropdown is present', async ({ page }) => {
   50 |       await expect(page.getByLabel('Langue (pour la coloration syntaxique)')).toBeVisible();
   51 |     });
   52 |
   53 |     test('Save and Go to Practice button is present', async ({ page }) => {
   54 |       await expect(page.getByRole('button', { name: "Sauvegarder et Aller à l'entraînement" })).toBeVisible();
   55 |     });
   56 |   });
   57 |
   58 |   // Tests for Practice Page
   59 |   test.describe('Practice Page UI Elements', () => {
   60 |     test.beforeEach(async ({ page }) => {
   61 |       await page.goto('/practice');
   62 |     });
   63 |
   64 |     test('Progress bar is present (if applicable)', async ({ page }) => {
   65 |       // This test will only pass if eclipsedTime is set and > 0
   66 |       // If practice can start with infinite time, this might not always be visible
   67 |       await expect(page.getByRole('progressbar')).toBeVisible();
   68 |     });
   69 |
   70 |     test('Character display area is present', async ({ page }) => {
   71 |       // Using a class that's specific to the character display area
   72 |       await expect(page.locator('.font-mono').first()).toBeVisible();
   73 |     });
   74 |
   75 |     test('Timer display is present', async ({ page }) => {
   76 |       await expect(page.getByText('Timer :')).toBeVisible();
   77 |     });
   78 |
   79 |     test('Accuracy display is present', async ({ page }) => {
   80 |       await expect(page.getByText('Précision :')).toBeVisible();
   81 |     });
   82 |
   83 |     test('CPM display is present', async ({ page }) => {
   84 |       await expect(page.getByText('CPM :')).toBeVisible();
   85 |     });
   86 |
   87 |     test('Submit/Finish button is present', async ({ page }) => {
   88 |       await expect(page.getByRole('button', { name: 'Soumettre / Terminer' })).toBeVisible();
   89 |     });
   90 |
   91 |     test('Reset Practice button is present', async ({ page }) => {
   92 |       await expect(page.getByRole('button', { name: "Réinitialiser l'entraînement" })).toBeVisible();
   93 |     });
   94 |   });
   95 |
   96 |   // Tests for Saved Text Page
   97 |   test.describe('Saved Text Page UI Elements', () => {
   98 |     test.beforeEach(async ({ page }) => {
   99 |       await page.goto('/saved-text');
  100 |     });
  101 |
  102 |     test('Custom Texts heading is present', async ({ page }) => {
  103 |       await expect(page.getByRole('heading', { name: 'Textes Personnalisés' })).toBeVisible();
  104 |     });
  105 |
  106 |     test('Create button is present', async ({ page }) => {
  107 |       await expect(page.getByRole('button', { name: 'Créer' })).toBeVisible();
  108 |     });
  109 |
  110 |     // Note: The following tests depend on having at least one saved text.
  111 |     // These might fail if localStorage is empty.
  112 |     test('Saved text card elements are present (if any saved texts exist)', async ({ page }) => {
  113 |       // Check if any saved text cards are rendered
  114 |       const savedTextCards = page.locator('.card-title'); // A bit generic, adjust if a better selector exists
  115 |       if (await savedTextCards.count() > 0) {
  116 |         const firstCard = savedTextCards.first();
  117 |         // Example checks for the first card, can be extended or looped for all
  118 |         await expect(firstCard).toBeVisible(); // Check for the label/title
  119 |
  120 |         // Locate buttons within the context of the first card's parent or a more specific container
  121 |         const cardContainer = firstCard.locator('xpath=ancestor::div[contains(@class, "shadow")]'); // Go up to the card container
  122 |
  123 |         await expect(cardContainer.getByRole('button', { name: 'Delete' })).toBeVisible(); // Using name based on potential aria-label or similar for icon buttons
  124 |         await expect(cardContainer.getByRole('button', { name: 'Edit' })).toBeVisible();   // Adjust if icons don't have names
  125 |         await expect(cardContainer.getByRole('link', { name: "S'entraîner" })).toBeVisible();
  126 |       } else {
  127 |         // Optionally, add an assertion here if no texts are saved, e.g., a "no texts" message.
  128 |         console.log('No saved texts found, skipping card element tests.');
  129 |       }
  130 |     });
  131 |   });
  132 | });
  133 |
```