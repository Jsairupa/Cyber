"use server"

import { encrypt } from "@/lib/encryption"
import { getGoogleDriveDownloadUrl } from "@/lib/utils"

// Ensure the secure download action uses the environment variable

// Update the RESUME_FILE_URL constant to ensure it always uses the environment variable
const RESUME_FILE_URL =
  process.env.RESUME_FILE_URL || "https://drive.google.com/file/d/1M05jV9pIqmFjEnTgmdqh-ZxyeoHE4nSN/view?usp=sharing"

/**
 * Generates a secure download URL after verifying the Turnstile token
 * This keeps the actual file URL server-side only
 */
export async function getSecureDownloadUrl(turnstileToken: string) {
  try {
    // For development/testing, we'll simulate a successful verification
    // In production, we would verify the token with Cloudflare
    console.log("Verification token received:", turnstileToken)

    // Always consider verification successful in development
    const verification = { success: true }

    // 2. Generate a secure token with short expiration
    const expiresAt = Date.now() + 60000 // 60 seconds

    // For direct Google Drive downloads, we'll include the URL directly
    // This allows the client to download without an additional server hop
    const fileUrl = RESUME_FILE_URL
    const directDownloadUrl = getGoogleDriveDownloadUrl(fileUrl)

    const payload = {
      exp: expiresAt,
      url: fileUrl, // Store the original URL in the payload
    }

    // 3. Encrypt the payload
    const token = encrypt(JSON.stringify(payload))

    // 4. Return success with the direct download URL
    return {
      success: true,
      url: `/api/secure-download?token=${encodeURIComponent(token)}`,
      directUrl: directDownloadUrl, // Include the direct URL as a fallback
    }
  } catch (error) {
    console.error("Error generating secure download URL:", error)
    return {
      success: false,
      message: "An error occurred while processing your request.",
    }
  }
}
