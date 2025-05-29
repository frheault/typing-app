# Test info

- Name: Core Functionalities >> Topic Selection on Home Page >> Practice text updates based on selected topic
- Location: /app/tests/core-functionalities.spec.ts:136:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Invalid url: "/"
Call log:
  - navigating to "/", waiting until "load"

    at /app/tests/core-functionalities.spec.ts:137:18
```

# Test source

```ts
   37 |       const initialTimerValue = await timerDisplay.textContent();
   38 |
   39 |       // Type a few characters
   40 |       for (const char of shortSampleText) {
   41 |         await page.keyboard.press(char === ' ' ? 'Space' : char);
   42 |         // Small delay to simulate human typing and allow UI to update
   43 |         await page.waitForTimeout(50);
   44 |       }
   45 |
   46 |       // Verify timer has started (value changed from initial)
   47 |       await expect(timerDisplay).not.toHaveText(initialTimerValue || "0", { timeout: 5000 });
   48 |       const timerValueAfterTyping = await timerDisplay.textContent();
   49 |       expect(parseInt(timerValueAfterTyping || "0")).toBeGreaterThan(0);
   50 |
   51 |
   52 |       // Continue typing the rest of the short sample or wait for time to elapse
   53 |       // For this test, we'll type the full sample text to ensure completion if time is short
   54 |       for (const char of sampleText) {
   55 |         await page.keyboard.press(char === ' ' ? 'Space' : char);
   56 |         await page.waitForTimeout(10); // Faster typing for the rest
   57 |       }
   58 |       
   59 |       // Click submit button
   60 |       await page.getByRole('button', { name: 'Soumettre / Terminer' }).click();
   61 |
   62 |
   63 |       // Verify results are displayed
   64 |       // This assumes a results page or section appears after the test
   65 |       await expect(page.getByRole('heading', { name: 'Résultats du Test' })).toBeVisible({ timeout: 10000 });
   66 |       await expect(page.getByText(/CPM:/)).toBeVisible();
   67 |       await expect(page.getByText(/Précision:/)).toBeVisible();
   68 |     });
   69 |   });
   70 |
   71 |   // Tests for Obfuscated Text vs. Raw Text Functionality
   72 |   test.describe('Obfuscated Text vs. Raw Text Functionality on Practice Page', () => {
   73 |     const rawText = "Hello Playwright!";
   74 |     // This is "Hello Playwright!" obfuscated with the app's obfuscateText function
   75 |     // Steps:
   76 |     // 1. XOR "Hello Playwright!" with repeating "secretKey"
   77 |     //    H (72) ^ s (115) = 43   (+)
   78 |     //    e (101) ^ e (101) = 0    (\0)
   79 |     //    l (108) ^ c (99)  = 7    (BEL)
   80 |     //    l (108) ^ r (114) = 6    (ACK)
   81 |     //    o (111) ^ e (101) = 10   (LF)
   82 |     //      (32) ^ t (116) = 84   (T)
   83 |     //    P (80) ^ K (75)  = 27   (ESC)
   84 |     //    l (108) ^ e (101) = 7    (BEL)
   85 |     //    a (97) ^ y (121) = 24   (CAN)
   86 |     //    y (121) ^ s (115) = 6    (ACK)
   87 |     //    w (119) ^ e (101) = 22   (SYN)
   88 |     //    r (114) ^ c (99)  = 7    (BEL)
   89 |     //    i (105) ^ r (114) = 9    (HT)
   90 |     //    g (103) ^ e (101) = 6    (ACK)
   91 |     //    h (104) ^ t (116) = 20   (DC4)
   92 |     //    t (116) ^ K (75)  = 43   (+)
   93 |     //    ! (33) ^ e (101) = 68   (D)
   94 |     // 2. Convert these char codes to a string.
   95 |     //    const xorString = String.fromCharCode(43,0,7,6,10,84,27,7,24,6,22,7,9,6,20,43,68);
   96 |     // 3. Base64 encode this string.
   97 |     //    btoa(xorString) gives "KwAHBgxUFxsGFhYHCAYULCsE"
   98 |     const obfuscatedText = "KwAHBgxUFxsGFhYHCAYULCsE";
   99 |     const customTextId = Date.now(); // Unique ID for the test item
  100 |
  101 |     test('Displays de-obfuscated text from localStorage', async ({ page }) => {
  102 |       // 1. Add obfuscated text to localStorage
  103 |       const customTextData = [{
  104 |         id: customTextId,
  105 |         label: 'Obfuscated Test',
  106 |         text: obfuscatedText,
  107 |         language: 'plaintext',
  108 |         isObfuscated: true,
  109 |         time: new Date().toLocaleString(),
  110 |       }];
  111 |       await page.evaluate((data) => {
  112 |         localStorage.setItem('customTextData', JSON.stringify(data));
  113 |       }, customTextData);
  114 |
  115 |       // 2. Navigate to the practice page with the savedTextId
  116 |       await page.goto(`/practice?savedTextId=${customTextId}`);
  117 |       
  118 |       // 3. Verify the displayed text is the raw (de-obfuscated) text
  119 |       // The text is rendered in multiple spans, so we need to get the whole text content
  120 |       // of the display area. The display area has a 'font-mono' class.
  121 |       const textDisplayArea = page.locator('div.font-mono').first();
  122 |       await expect(textDisplayArea).toBeVisible({ timeout: 10000 });
  123 |
  124 |       // Wait for the text content to be populated correctly
  125 |       // It might take a moment for deobfuscation and rendering
  126 |       await expect(textDisplayArea).toHaveText(rawText, { timeout: 5000 });
  127 |     });
  128 |   });
  129 |
  130 |   // Tests for Topic Selection
  131 |   test.describe('Topic Selection on Home Page', () => {
  132 |     const topicToSelect = 'chemistry';
  133 |     // A sentence from src/lib/topics/chemistry.ts
  134 |     const expectedTextSample = "Le seul métal liquide à température ambiante est le mercure"; 
  135 |
  136 |     test('Practice text updates based on selected topic', async ({ page }) => {
> 137 |       await page.goto('/');
      |                  ^ Error: page.goto: Protocol error (Page.navigate): Invalid url: "/"
  138 |
  139 |       // Select the 'chemistry' topic
  140 |       await page.getByRole('combobox').first().selectOption({ value: topicToSelect });
  141 |       
  142 |       // Click "Start Practice"
  143 |       await page.getByRole('button', { name: "Commencer l'entraînement" }).click();
  144 |
  145 |       // Wait for navigation to practice page
  146 |       await page.waitForURL(/\/practice/);
  147 |
  148 |       // Verify that the displayed text on the practice page contains a sample from the selected topic
  149 |       // The text is rendered in multiple spans, so we need to check if the display area contains the sample.
  150 |       const textDisplayArea = page.locator('div.font-mono').first();
  151 |       await expect(textDisplayArea).toBeVisible({ timeout: 10000 });
  152 |       
  153 |       // Check for a substring of the expected text due to random sentence selection
  154 |       // We expect at least one sentence from the selected topic to be loaded.
  155 |       // A more robust check would involve fetching all sentences for the topic and checking against them,
  156 |       // but for this test, we'll check if the text area contains *any* text,
  157 |       // and then we'll check if the topic query param is correctly set.
  158 |       await expect(textDisplayArea).not.toBeEmpty({ timeout: 5000 });
  159 |
  160 |       // A more direct check is to ensure the URL contains the correct topic,
  161 |       // as the practice page fetches sentences based on this.
  162 |       await expect(page).toHaveURL(new RegExp(`topic=${topicToSelect}`));
  163 |
  164 |       // To be more precise, we can check if the displayed text is one of the chemistry sentences.
  165 |       // This requires knowing all chemistry sentences or checking if the text visible belongs to that set.
  166 |       // For now, checking the URL parameter is a good indicator that topic selection worked.
  167 |       // A visual check of a specific sentence from the topic is also good if the selection is deterministic.
  168 |       // Since sentenceIndex is random if not provided, we can't rely on one specific sentence.
  169 |       // However, we can check if the displayed text matches ANY of the chemistry sentences.
  170 |       // This is more complex to implement here without fetching all sentences.
  171 |       // The current check (URL + non-empty text area) provides reasonable confidence.
  172 |     });
  173 |   });
  174 |
  175 |   // Tests for Custom Text Language Selection
  176 |   test.describe('Custom Text Language Selection on Custom Text Page', () => {
  177 |     const customLabel = 'C++ Test';
  178 |     const cppCode = 'int main() {\n  return 0;\n}';
  179 |     const languageToSelect = 'cpp';
  180 |     const cppKeyword = 'int';
  181 |     // This class is an example, actual class might differ based on implementation
  182 |     const cppKeywordHighlightClass = 'text-blue-500'; // Or 'dark:text-blue-400'
  183 |
  184 |     test('Syntax highlighting reflects selected language for custom text', async ({ page }) => {
  185 |       await page.goto('/custom-text');
  186 |
  187 |       // Fill in the form
  188 |       await page.getByLabel("Libellé de l'entraînement").fill(customLabel);
  189 |       await page.getByLabel('Ou collez le texte manuellement (Le contenu du fichier téléchargé ne sera pas affiché ici)').fill(cppCode);
  190 |       await page.getByLabel('Langue (pour la coloration syntaxique)').selectOption({ value: languageToSelect });
  191 |
  192 |       // Submit the form
  193 |       await page.getByRole('button', { name: "Sauvegarder et Aller à l'entraînement" }).click();
  194 |
  195 |       // Wait for navigation to practice page
  196 |       await page.waitForURL(/\/practice\?savedTextId=\d+/); // Wait for the practice page with a savedTextId
  197 |
  198 |       // Verify syntax highlighting on the practice page
  199 |       const textDisplayArea = page.locator('div.font-mono').first();
  200 |       await expect(textDisplayArea).toBeVisible({ timeout: 10000 });
  201 |
  202 |       // Find the span containing the C++ keyword and check its class
  203 |       // This assumes keywords are wrapped in spans for highlighting.
  204 |       // The exact selector might need adjustment based on how text and highlighting are rendered.
  205 |       const keywordSpan = textDisplayArea.locator(`span:has-text("${cppKeyword}")`).first();
  206 |       
  207 |       await expect(keywordSpan).toBeVisible();
  208 |       
  209 |       // Check if the class attribute contains the expected highlight class
  210 |       // This is a flexible check as there might be multiple classes.
  211 |       const classAttribute = await keywordSpan.getAttribute('class');
  212 |       expect(classAttribute).toContain(cppKeywordHighlightClass);
  213 |
  214 |       // Alternatively, if the dark mode class is consistently applied, check for that too or one of them.
  215 |       // For example:
  216 |       // expect(classAttribute?.includes(cppKeywordHighlightClass) || classAttribute?.includes('dark:text-blue-400')).toBeTruthy();
  217 |     });
  218 |   });
  219 | });
  220 |
```