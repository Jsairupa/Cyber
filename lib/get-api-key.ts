import { ApiKeyService } from "./api-key-service"

/**
 * Securely retrieves an API key for a specific service on the server
 */
export async function getApiKey(service: string): Promise<string | null> {
  try {
    const keys = await ApiKeyService.getAllApiKeys("system")
    const key = keys.find((k) => k.service === service && k.isActive)

    if (!key) {
      console.error(`No active API key found for service: ${service}`)
      return null
    }

    return await ApiKeyService.getDecryptedApiKey(key.id, "system")
  } catch (error) {
    console.error(`Failed to retrieve API key for service ${service}:`, error)
    return null
  }
}
