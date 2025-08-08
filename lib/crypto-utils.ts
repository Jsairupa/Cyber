/**
 * Utility functions for encryption and security
 */

/**
 * Simple encryption function for tokens
 * Note: This is not cryptographically secure, but sufficient for basic token validation
 */
export function encrypt(text: string): string {
  // For simplicity, we'll use a basic encoding
  // In production, use a proper encryption library
  return Buffer.from(text).toString("base64")
}

/**
 * Simple decryption function for tokens
 */
export function decrypt(encryptedText: string): string {
  // For simplicity, we'll use a basic decoding
  // In production, use a proper encryption library
  return Buffer.from(encryptedText, "base64").toString()
}

/**
 * Generates a unique download token
 */
export function generateToken(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
