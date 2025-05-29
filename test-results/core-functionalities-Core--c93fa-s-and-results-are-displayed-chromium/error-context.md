# Test info

- Name: Core Functionalities >> Typing Test Mechanism on Home Page >> Timer starts, stops, and results are displayed
- Location: /app/tests/core-functionalities.spec.ts:12:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

    at /app/tests/core-functionalities.spec.ts:14:18
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Core Functionalities', () => {
   4 |   // Tests for Typing Test Mechanism
   5 |   test.describe('Typing Test Mechanism on Home Page', () => {
   6 |     const topic = 'computer_science';
   7 |     const time = 60; // seconds
   8 |     // Taken from src/lib/topics/computer_science.ts
   9 |     const sampleText = "Alan Turing est considéré comme le père de l'informatique théorique et de l'intelligence artificielle.";
   10 |     const shortSampleText = "Alan Turing est"; // A short part of the sample text
   11 |
   12 |     test('Timer starts, stops, and results are displayed', async ({ page }) => {
   13 |       // Navigate to home page
>  14 |       await page.goto('/');
      |                  ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
   15 |
   16 |       // Select topic and time
   17 |       await page.getByRole('combobox').first().selectOption({ value: topic });
   18 |       await page.getByRole('combobox').nth(1).selectOption({ value: time.toString() });
   19 |
   20 |       // Click "Start Practice"
   21 |       await page.getByRole('button', { name: "Commencer l'entraînement" }).click();
   22 |
   23 |       // Wait for navigation to practice page and for the text to appear
   24 |       await page.waitForURL(/\/practice/);
   25 |       await expect(page.locator('div:has-text("' + sampleText.substring(0, 20) + '")').first()).toBeVisible({ timeout: 10000 });
   26 |
   27 |
   28 |       // Simulate typing
   29 |       // Direct input into a hidden textarea or via keyboard events might be needed
   30 |       // For simplicity, we'll assume typing by dispatching 'keydown' events for each char
   31 |       // This is a simplified way; a real user types into an input field which then updates the UI.
   32 |       // Playwright's page.keyboard.type() is preferred if there's a focused input.
   33 |       // Since the component listens to window keydown events, we can dispatch them.
   34 |
   35 |       // Get the timer element
   36 |       const timerDisplay = page.locator('div.flex.items-center.gap-2.w-full > div:has-text("Timer :") > span');
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
```