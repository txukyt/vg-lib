// uid.js
/**
 * Generate unique IDs of any length.
 * Uses the Web Crypto API for secure random values.
 * 
 * @param {number} len - The length of the ID to generate (default 7)
 * @returns {string} A unique ID consisting of characters [0-9a-z]
 */
export function uid(len = 7) {
  // Create a typed array of the desired length
  const array = new Uint8Array(len);

  // Fill the array with cryptographically secure random values
  crypto.getRandomValues(array);

  // Convert each byte to a base-36 character and join into a string
  // Slice to ensure the exact requested length
  return Array.from(array, n => n.toString(36)).join('').slice(0, len);
}
