"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { TurnstileService } from "@/lib/turnstile-service"
import { AuthService } from "@/lib/auth-service"
import { decrypt } from "@/lib/encryption"
import { getTurnstileKeys } from "./config"
import type { TurnstileSiteKey, TurnstileLog, TurnstileVerification } from "@/lib/turnstile-schema"

// Helper to get the current user from the session
async function getCurrentUser() {
  const sessionCookie = cookies().get("session")?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(decrypt(sessionCookie))

    // Check if session is expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      cookies().delete("session")
      return null
    }

    return sessionData.user
  } catch (error) {
    console.error("Failed to get current user:", error)
    cookies().delete("session")
    return null
  }
}

// Helper to check if user is authorized
async function checkAuthorization(requiredRole: "admin" | "manager" | "user" = "admin") {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  if (!AuthService.hasRole(user, requiredRole)) {
    throw new Error("Unauthorized: Insufficient permissions")
  }

  return user
}

// CSRF protection function
function validateCSRF() {
  const headersList = headers()
  const origin = headersList.get("origin")
  const host = headersList.get("host")

  // If origin is missing, this might be a non-browser request
  if (!origin) {
    throw new Error("Origin header is required")
  }

  // Create URL objects to compare hostname only (ignoring protocol)
  const originUrl = new URL(origin)
  const hostUrl = new URL(`https://${host}`)

  // Validate that the origin matches the host
  if (originUrl.hostname !== hostUrl.hostname) {
    throw new Error("CSRF validation failed")
  }
}

// Create a new Turnstile site key
export async function createTurnstileSiteKey(formData: FormData) {
  const user = await checkAuthorization("admin")
  validateCSRF()

  const name = formData.get("name") as string
  const environment = formData.get("environment") as TurnstileSiteKey["environment"]
  const siteKey = formData.get("siteKey") as string
  const secretKey = formData.get("secretKey") as string
  const domain = formData.get("domain") as string

  if (!name || !environment || !siteKey || !secretKey || !domain) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  try {
    const newSiteKey = await TurnstileService.createSiteKey(
      name,
      environment,
      siteKey,
      secretKey,
      domain,
      user.username,
    )

    return {
      success: true,
      siteKey: {
        ...newSiteKey,
        secretKey: "••••••••", // Don't return the encrypted secret key
      },
    }
  } catch (error) {
    console.error("Failed to create Turnstile site key:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create Turnstile site key",
    }
  }
}

// Update an existing Turnstile site key
export async function updateTurnstileSiteKey(formData: FormData) {
  const user = await checkAuthorization("admin")
  validateCSRF()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const environment = formData.get("environment") as TurnstileSiteKey["environment"]
  const siteKey = formData.get("siteKey") as string
  const secretKey = formData.get("secretKey") as string
  const domain = formData.get("domain") as string
  const isActive = formData.get("isActive") === "true"

  if (!id) {
    return {
      success: false,
      message: "Site key ID is required",
    }
  }

  const updates: Partial<TurnstileSiteKey> = {}

  if (name) updates.name = name
  if (environment) updates.environment = environment
  if (siteKey) updates.siteKey = siteKey
  if (secretKey) updates.secretKey = secretKey
  if (domain) updates.domain = domain
  updates.isActive = isActive

  try {
    const updatedSiteKey = await TurnstileService.updateSiteKey(id, updates, user.username)

    if (!updatedSiteKey) {
      return {
        success: false,
        message: "Turnstile site key not found",
      }
    }

    return {
      success: true,
      siteKey: {
        ...updatedSiteKey,
        secretKey: "••••••••", // Don't return the encrypted secret key
      },
    }
  } catch (error) {
    console.error("Failed to update Turnstile site key:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update Turnstile site key",
    }
  }
}

// Delete a Turnstile site key
export async function deleteTurnstileSiteKey(formData: FormData) {
  const user = await checkAuthorization("admin")
  validateCSRF()

  const id = formData.get("id") as string

  if (!id) {
    return {
      success: false,
      message: "Site key ID is required",
    }
  }

  try {
    const success = await TurnstileService.deleteSiteKey(id, user.username)

    if (!success) {
      return {
        success: false,
        message: "Turnstile site key not found",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Failed to delete Turnstile site key:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete Turnstile site key",
    }
  }
}

// Get all Turnstile site keys
export async function getAllTurnstileSiteKeys() {
  const user = await checkAuthorization("manager")

  try {
    const siteKeys = await TurnstileService.getAllSiteKeys(user.username)

    return {
      success: true,
      siteKeys: siteKeys.map((key) => ({
        ...key,
        secretKey: "••••••••", // Don't return the encrypted secret keys
      })),
    }
  } catch (error) {
    console.error("Failed to get Turnstile site keys:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get Turnstile site keys",
    }
  }
}

// Get Turnstile logs
export async function getTurnstileLogs(formData: FormData) {
  const user = await checkAuthorization("manager")

  const siteKeyId = (formData.get("siteKeyId") as string) || undefined
  const action = (formData.get("action") as TurnstileLog["action"]) || undefined
  const from = (formData.get("from") as string) || undefined
  const to = (formData.get("to") as string) || undefined

  try {
    const logs = await TurnstileService.getLogs({
      siteKeyId,
      action,
      from,
      to,
    })

    return {
      success: true,
      logs,
    }
  } catch (error) {
    console.error("Failed to get Turnstile logs:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get Turnstile logs",
    }
  }
}

// Get Turnstile analytics
export async function getTurnstileAnalytics(formData: FormData) {
  const user = await checkAuthorization("manager")

  const siteKeyId = (formData.get("siteKeyId") as string) || undefined
  const from = (formData.get("from") as string) || undefined
  const to = (formData.get("to") as string) || undefined

  try {
    const analytics = await TurnstileService.getAnalytics({
      siteKeyId,
      from,
      to,
    })

    return {
      success: true,
      analytics,
    }
  } catch (error) {
    console.error("Failed to get Turnstile analytics:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get Turnstile analytics",
    }
  }
}

/**
 * Verify a Turnstile token using the Cloudflare siteverify API
 * This is the critical server-side validation step required by Cloudflare
 *
 * @param token The token from the Turnstile widget
 * @param idempotencyKey Optional UUID for idempotent requests
 * @param secretKey The secret key to use for verification
 * @returns Verification result
 */
export async function verifyTurnstileToken(token: string, idempotencyKey?: string, secretKey?: string) {
  try {
    // Validate token format
    if (!token || typeof token !== "string" || token.length > 2048) {
      return {
        success: false,
        message: "Invalid token format",
        errorCodes: ["invalid-input-response"],
      }
    }

    // Get client IP address
    const headersList = headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

    // If no secret key is provided, get it from the configuration
    if (!secretKey) {
      const keys = await getTurnstileKeys()
      secretKey = keys.secretKey
    }

    // Create form data for the request
    const formData = new URLSearchParams()
    formData.append("secret", secretKey)
    formData.append("response", token)
    formData.append("remoteip", ip)

    // Add idempotency key if provided
    if (idempotencyKey) {
      formData.append("idempotency_key", idempotencyKey)
    }

    // In v0 preview, we'll simulate a successful verification
    // In production, you would make a real API call to Cloudflare
    if (process.env.NODE_ENV !== "production") {
      console.log("Development environment: Simulating Turnstile verification")

      // Log the verification attempt
      await TurnstileService.recordVerification(true)

      return {
        success: true,
        challenge_ts: new Date().toISOString(),
        hostname: "localhost",
        "error-codes": [],
      }
    }

    // Make the actual API call to Cloudflare in production
    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!result.ok) {
      throw new Error(`Turnstile verification failed: ${result.status} ${result.statusText}`)
    }

    const verification: TurnstileVerification = await result.json()

    // Log the verification result
    await TurnstileService.recordVerification(verification.success)

    // Return the verification result
    return verification
  } catch (error) {
    console.error("Turnstile verification error:", error)

    // Log the failed verification
    await TurnstileService.recordVerification(false)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Turnstile verification failed",
      "error-codes": ["internal-error"],
    }
  }
}
