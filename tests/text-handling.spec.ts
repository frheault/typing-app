import { test, expect } from '@playwright/test';

test.describe('Text Handling Functionalities', () => {
  // Tests for Random Word Generation
  test.describe('Random Word Generation (Text Display from Topic on Practice Page)', () => {
    const topicToSelect = 'biology';
    const timeToSelect = 60;

    test('Text from selected topic is displayed on practice page', async ({ page }) => {
      await page.goto('/');

      // Select topic and time
      await page.getByRole('combobox').first().selectOption({ value: topicToSelect });
      await page.getByRole('combobox').nth(1).selectOption({ value: timeToSelect.toString() });

      // Click "Start Practice"
      await page.getByRole('button', { name: "Commencer l'entraînement" }).click();

      // Wait for navigation to practice page
      await page.waitForURL(/\/practice/);

      // Verify text display area
      const textDisplayArea = page.locator('div.font-mono').first();
      await expect(textDisplayArea).toBeVisible({ timeout: 10000 });

      // Verify text is not empty
      await expect(textDisplayArea).not.toBeEmpty();

      // Verify text consists of multiple words
      const displayedText = await textDisplayArea.textContent();
      expect(displayedText?.trim().includes(' ')).toBeTruthy(); // Check if there's at least one space
      expect(displayedText?.trim().split(/\s+/).length).toBeGreaterThan(1); // Check if there are multiple words
    });
  });

  // Tests for Custom Text Input and Display
  test.describe('Custom Text Input and Display', () => {
    const uniqueText = "def print_hello_world_for_test():\n  print('Hello, World from Playwright Test!')";
    const customLabel = 'Test Custom Python Snippet';
    const selectedLanguage = 'python';
    const pythonKeyword = 'def';
    const pythonKeywordHighlightClass = 'text-blue-500'; // As per TypingTest.tsx

    test('Custom text is correctly displayed on practice page with syntax highlighting', async ({ page }) => {
      await page.goto('/custom-text');

      // Fill in the form
      await page.getByLabel("Libellé de l'entraînement").fill(customLabel);
      await page.getByLabel('Ou collez le texte manuellement (Le contenu du fichier téléchargé ne sera pas affiché ici)').fill(uniqueText);
      await page.getByLabel('Langue (pour la coloration syntaxique)').selectOption({ value: selectedLanguage });

      // Submit the form
      await page.getByRole('button', { name: "Sauvegarder et Aller à l'entraînement" }).click();

      // Wait for navigation to practice page
      await page.waitForURL(/\/practice\?savedTextId=\d+/);

      // Verify the exact text is displayed
      const textDisplayArea = page.locator('div.font-mono').first();
      await expect(textDisplayArea).toBeVisible({ timeout: 10000 });
      
      // To get the exact text, we might need to iterate through spans or use innerText
      // and reconstruct it if it's broken into many pieces.
      // For now, we'll check if the text area contains the unique text.
      // A more robust way is to check the full text content.
      const displayedText = await textDisplayArea.innerText(); // innerText tries to represent the rendered text
      // Replace non-breaking spaces if the app uses them, and normalize newlines
      const normalizedDisplayedText = displayedText.replace(/\u00A0/g, " ").replace(/\r\n|\r/g, "\n");
      expect(normalizedDisplayedText.trim()).toEqual(uniqueText);


      // Verify syntax highlighting for a Python keyword
      const keywordSpan = textDisplayArea.locator(`span:has-text("${pythonKeyword}")`).first();
      await expect(keywordSpan).toBeVisible();
      const classAttribute = await keywordSpan.getAttribute('class');
      expect(classAttribute).toContain(pythonKeywordHighlightClass);
    });
  });
});
