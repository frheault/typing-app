/**
 * Deobfuscates Base64 encoded text.
 * @param base64Text The Base64 encoded string.
 * @returns The decoded plain text, or an error message if decoding fails.
 */
export function deobfuscateText(base64Text: string): string {
  try {
    const cleanedBase64Text = base64Text.replace(/[^A-Za-z0-9+/=]/g, "");
    const binaryString = atob(cleanedBase64Text);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Failed to deobfuscate text (not valid Base64?):", e);
    return "Error: Could not deobfuscate text. Please ensure it is a valid Base64 encoded file.";
  }
}

/**
 * (For external use/testing) Obfuscates plain text to Base64.
 * @param plainText The plain text to encode.
 * @returns The Base64 encoded string.
 */
export function obfuscateTextForTesting(plainText: string): string {
  try {
    const bytes = new TextEncoder().encode(plainText);
    let binaryString = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  } catch (e) {
    console.error("Failed to obfuscate text:", e);
    return "Error during obfuscation.";
  }
}