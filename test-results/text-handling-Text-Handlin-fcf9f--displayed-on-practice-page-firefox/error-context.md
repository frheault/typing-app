# Test info

- Name: Text Handling Functionalities >> Random Word Generation (Text Display from Topic on Practice Page) >> Text from selected topic is displayed on practice page
- Location: /app/tests/text-handling.spec.ts:9:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Invalid url: "/"
Call log:
  - navigating to "/", waiting until "load"

    at /app/tests/text-handling.spec.ts:10:18
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Text Handling Functionalities', () => {
   4 |   // Tests for Random Word Generation
   5 |   test.describe('Random Word Generation (Text Display from Topic on Practice Page)', () => {
   6 |     const topicToSelect = 'biology';
   7 |     const timeToSelect = 60;
   8 |
   9 |     test('Text from selected topic is displayed on practice page', async ({ page }) => {
> 10 |       await page.goto('/');
     |                  ^ Error: page.goto: Protocol error (Page.navigate): Invalid url: "/"
  11 |
  12 |       // Select topic and time
  13 |       await page.getByRole('combobox').first().selectOption({ value: topicToSelect });
  14 |       await page.getByRole('combobox').nth(1).selectOption({ value: timeToSelect.toString() });
  15 |
  16 |       // Click "Start Practice"
  17 |       await page.getByRole('button', { name: "Commencer l'entraînement" }).click();
  18 |
  19 |       // Wait for navigation to practice page
  20 |       await page.waitForURL(/\/practice/);
  21 |
  22 |       // Verify text display area
  23 |       const textDisplayArea = page.locator('div.font-mono').first();
  24 |       await expect(textDisplayArea).toBeVisible({ timeout: 10000 });
  25 |
  26 |       // Verify text is not empty
  27 |       await expect(textDisplayArea).not.toBeEmpty();
  28 |
  29 |       // Verify text consists of multiple words
  30 |       const displayedText = await textDisplayArea.textContent();
  31 |       expect(displayedText?.trim().includes(' ')).toBeTruthy(); // Check if there's at least one space
  32 |       expect(displayedText?.trim().split(/\s+/).length).toBeGreaterThan(1); // Check if there are multiple words
  33 |     });
  34 |   });
  35 |
  36 |   // Tests for Custom Text Input and Display
  37 |   test.describe('Custom Text Input and Display', () => {
  38 |     const uniqueText = "def print_hello_world_for_test():\n  print('Hello, World from Playwright Test!')";
  39 |     const customLabel = 'Test Custom Python Snippet';
  40 |     const selectedLanguage = 'python';
  41 |     const pythonKeyword = 'def';
  42 |     const pythonKeywordHighlightClass = 'text-blue-500'; // As per TypingTest.tsx
  43 |
  44 |     test('Custom text is correctly displayed on practice page with syntax highlighting', async ({ page }) => {
  45 |       await page.goto('/custom-text');
  46 |
  47 |       // Fill in the form
  48 |       await page.getByLabel("Libellé de l'entraînement").fill(customLabel);
  49 |       await page.getByLabel('Ou collez le texte manuellement (Le contenu du fichier téléchargé ne sera pas affiché ici)').fill(uniqueText);
  50 |       await page.getByLabel('Langue (pour la coloration syntaxique)').selectOption({ value: selectedLanguage });
  51 |
  52 |       // Submit the form
  53 |       await page.getByRole('button', { name: "Sauvegarder et Aller à l'entraînement" }).click();
  54 |
  55 |       // Wait for navigation to practice page
  56 |       await page.waitForURL(/\/practice\?savedTextId=\d+/);
  57 |
  58 |       // Verify the exact text is displayed
  59 |       const textDisplayArea = page.locator('div.font-mono').first();
  60 |       await expect(textDisplayArea).toBeVisible({ timeout: 10000 });
  61 |       
  62 |       // To get the exact text, we might need to iterate through spans or use innerText
  63 |       // and reconstruct it if it's broken into many pieces.
  64 |       // For now, we'll check if the text area contains the unique text.
  65 |       // A more robust way is to check the full text content.
  66 |       const displayedText = await textDisplayArea.innerText(); // innerText tries to represent the rendered text
  67 |       // Replace non-breaking spaces if the app uses them, and normalize newlines
  68 |       const normalizedDisplayedText = displayedText.replace(/\u00A0/g, " ").replace(/\r\n|\r/g, "\n");
  69 |       expect(normalizedDisplayedText.trim()).toEqual(uniqueText);
  70 |
  71 |
  72 |       // Verify syntax highlighting for a Python keyword
  73 |       const keywordSpan = textDisplayArea.locator(`span:has-text("${pythonKeyword}")`).first();
  74 |       await expect(keywordSpan).toBeVisible();
  75 |       const classAttribute = await keywordSpan.getAttribute('class');
  76 |       expect(classAttribute).toContain(pythonKeywordHighlightClass);
  77 |     });
  78 |   });
  79 | });
  80 |
```