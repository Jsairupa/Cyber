"use server"

import { getServerSideTurnstileSiteKey, hasTurnstileSiteKey, hasTurnstileSecretKey } from "@/lib/env-utils"

/**
 * Server action to safely get the public Turnstile site key
 * This prevents direct exposure of the environment variable in client code
 */
export async function getTurnstileSiteKey(): Promise<{ siteKey: string }> {
  // Get the site key from our server-only utility
  const siteKey = getServerSideTurnstileSiteKey()

  // Return only the value, not the variable name
  return { siteKey }
}

/**
 * Server action to safely check if the environment variables are configured
 * Returns a masked representation of the configuration status
 */
export async function getEnvStatus(): Promise<{
  hasSiteKey: boolean
  hasSecretKey: boolean
}> {
  return {
    hasSiteKey: hasTurnstileSiteKey(),
    hasSecretKey: hasTurnstileSecretKey(),
  }
}
