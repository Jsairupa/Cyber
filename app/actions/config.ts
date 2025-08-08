"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { encrypt, decrypt } from "@/lib/encryption"
import { AuthService } from "@/lib/auth-service"
import { getServerSideTurnstileSiteKey, getServerSideTurnstileSecretKey } from "@/lib/env-utils"

// Cookie name for storing the encrypted configuration
const CONFIG_COOKIE_NAME = "turnstile_config"

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

// Save Turnstile configuration
export async function saveTurnstileConfig(formData: FormData) {
  try {
    // Check authorization
    await checkAuthorization("admin")

    // Validate CSRF
    validateCSRF()

    const siteKey = formData.get("siteKey") as string
    let secretKey = formData.get("secretKey") as string

    if (!siteKey) {
      return {
        success: false,
        message: "Site key is required",
      }
    }

    // If the secret key is masked, get the existing one
    if (secretKey === "••••••••••••••••••••••••••••••••") {
      const existingConfig = await getConfigFromCookie()
      if (existingConfig && existingConfig.secretKey) {
        secretKey = existingConfig.secretKey
      } else {
        return {
          success: false,
          message: "Secret key is required",
        }
      }
    } else if (!secretKey) {
      return {
        success: false,
        message: "Secret key is required",
      }
    }

    // Create configuration object
    const config = {
      siteKey,
      secretKey,
      updatedAt: new Date().toISOString(),
    }

    // Encrypt the configuration
    const encryptedConfig = encrypt(JSON.stringify(config))

    // Set the cookie with the encrypted configuration
    cookies().set({
      name: CONFIG_COOKIE_NAME,
      value: encryptedConfig,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // 1 year expiration
      maxAge: 365 * 24 * 60 * 60,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Failed to save Turnstile configuration:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save configuration",
    }
  }
}

// Get Turnstile configuration
export async function getTurnstileConfig() {
  try {
    // Check authorization
    await checkAuthorization("admin")

    const config = await getConfigFromCookie()

    if (!config) {
      return {
        success: true,
        siteKey: "",
        secretKey: "",
      }
    }

    return {
      success: true,
      siteKey: config.siteKey,
      // Don't return the actual secret key, just indicate if it exists
      secretKey: config.secretKey ? true : false,
    }
  } catch (error) {
    console.error("Failed to get Turnstile configuration:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get configuration",
    }
  }
}

// Helper to get configuration from cookie
export async function getConfigFromCookie() {
  const configCookie = cookies().get(CONFIG_COOKIE_NAME)?.value

  if (!configCookie) {
    return null
  }

  try {
    return JSON.parse(decrypt(configCookie))
  } catch (error) {
    console.error("Failed to decrypt configuration:", error)
    return null
  }
}

// Get Turnstile keys for verification (used by the API)
export async function getTurnstileKeys() {
  try {
    const config = await getConfigFromCookie()

    // Default test keys for development
    const TEST_SITE_KEY = "1x00000000000000000000AA"
    const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA"

    if (!config || !config.siteKey || !config.secretKey) {
      // Use environment variables or fallback to test keys
      const siteKey = getServerSideTurnstileSiteKey() || TEST_SITE_KEY
      const secretKey = getServerSideTurnstileSecretKey() || TEST_SECRET_KEY

      return {
        siteKey,
        secretKey,
      }
    }

    return {
      siteKey: config.siteKey,
      secretKey: config.secretKey,
    }
  } catch (error) {
    console.error("Failed to get Turnstile keys:", error)

    // Default test keys for development
    const TEST_SITE_KEY = "1x00000000000000000000AA"
    const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA"

    // Use environment variables or fallback to test keys
    const siteKey = getServerSideTurnstileSiteKey() || TEST_SITE_KEY
    const secretKey = getServerSideTurnstileSecretKey() || TEST_SECRET_KEY

    return {
      siteKey,
      secretKey,
    }
  }
}
