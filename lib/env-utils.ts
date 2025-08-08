// This file should only be imported by server components or server actions
// It contains utilities for safely accessing environment variables on the server

/**
 * Gets the Turnstile site key from environment variables
 * This function should only be called from server components or server actions
 */
export function getServerSideTurnstileSiteKey(): string {
  // Use a default test key if the environment variable is not set
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "1x00000000000000000000AA"
}

/**
 * Gets the Turnstile secret key from environment variables
 * This function should only be called from server components or server actions
 */
export function getServerSideTurnstileSecretKey(): string {
  // Use a default test key if the environment variable is not set
  return process.env.RECAPTCHA_SECRET_KEY || "1x0000000000000000000000000000000AA"
}

/**
 * Gets the encryption key from environment variables
 * This function should only be called from server components or server actions
 */
export function getServerSideEncryptionKey(): string {
  return process.env.ENCRYPTION_KEY || "this-is-a-development-key-that-is-32-chars"
}

/**
 * Checks if the Turnstile site key is configured
 */
export function hasTurnstileSiteKey(): boolean {
  return !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
}

/**
 * Checks if the Turnstile secret key is configured
 */
export function hasTurnstileSecretKey(): boolean {
  return !!process.env.RECAPTCHA_SECRET_KEY
}
