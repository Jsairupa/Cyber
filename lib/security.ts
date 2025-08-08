import DOMPurify from "dompurify"

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side sanitization (if needed)
    // For server-side, you might need a different approach
    // like using a server-side DOMPurify with JSDOM
    return html.replace(/<[^>]*>?/gm, "") // Simple tag removal as fallback
  }

  // Client-side sanitization
  return DOMPurify.sanitize(html)
}

/**
 * Escapes special characters in text to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Validates and sanitizes user input
 */
export function validateAndSanitizeInput(input: string, maxLength = 1000): string {
  if (!input) return ""

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength)

  // Escape HTML special characters
  sanitized = escapeHtml(sanitized)

  return sanitized
}

/**
 * Creates a nonce for CSP
 */
export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64")
}
