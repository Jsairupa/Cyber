import crypto from "crypto"
import { getServerSideEncryptionKey } from "./env-utils"

// Algorithm and constants
const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16 // For AES, this is always 16 bytes
const AUTH_TAG_LENGTH = 16

/**
 * Ensures the encryption key is the correct length (32 bytes for AES-256)
 * @param key The original key
 * @returns A Buffer with the correct key length
 */
function normalizeKey(key: string): Buffer {
  // Create a buffer from the key
  const keyBuffer = Buffer.from(key)

  // If key is already 32 bytes, use it as is
  if (keyBuffer.length === 32) {
    return keyBuffer
  }

  // If key is too short, hash it to get a consistent 32-byte key
  if (keyBuffer.length < 32) {
    return crypto.createHash("sha256").update(key).digest()
  }

  // If key is too long, truncate it
  return keyBuffer.slice(0, 32)
}

/**
 * Encrypts sensitive data using AES-256-GCM
 */
export function encrypt(text: string): string {
  try {
    // Get the encryption key from environment variables or use a default
    const ENCRYPTION_KEY = getServerSideEncryptionKey()

    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH)

    // Create cipher with normalized key, iv, and algorithm
    const normalizedKey = normalizeKey(ENCRYPTION_KEY)
    const cipher = crypto.createCipheriv(ALGORITHM, normalizedKey, iv)

    // Encrypt the data
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Get the authentication tag
    const authTag = cipher.getAuthTag()

    // Return iv + authTag + encrypted data as a single string
    // Format: iv (hex) + authTag (hex) + encrypted (hex)
    return iv.toString("hex") + authTag.toString("hex") + encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

/**
 * Decrypts data that was encrypted using the encrypt function
 */
export function decrypt(encryptedText: string): string {
  try {
    // Get the encryption key from environment variables or use a default
    const ENCRYPTION_KEY = getServerSideEncryptionKey()

    // Extract the iv, authTag and encrypted data
    const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), "hex")
    const authTag = Buffer.from(encryptedText.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2), "hex")
    const encrypted = encryptedText.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2)

    // Create decipher with normalized key
    const normalizedKey = normalizeKey(ENCRYPTION_KEY)
    const decipher = crypto.createDecipheriv(ALGORITHM, normalizedKey, iv)

    // Set the auth tag
    decipher.setAuthTag(authTag)

    // Decrypt the data
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

/**
 * Generates a secure random string for use as an API key
 */
export function generateSecureKey(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

/**
 * Hashes a value using SHA-256 for comparison purposes
 */
export function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex")
}

/**
 * Obfuscates a key for display purposes (shows only first and last few characters)
 */
export function obfuscateKey(key: string, visibleChars = 4): string {
  if (key.length <= visibleChars * 2) {
    return key
  }

  const firstPart = key.substring(0, visibleChars)
  const lastPart = key.substring(key.length - visibleChars)

  return `${firstPart}...${lastPart}`
}
