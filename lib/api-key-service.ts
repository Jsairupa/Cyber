import { v4 as uuidv4 } from "uuid"
import { encrypt, decrypt, hashValue, generateSecureKey } from "./encryption"
import { type ApiKey, type ApiKeyLog, apiKeys, apiKeyLogs } from "./db-schema"

export class ApiKeyService {
  /**
   * Creates a new API key
   */
  static async createApiKey(
    name: string,
    service: string,
    createdBy: string,
    expiresAt?: string,
  ): Promise<{ apiKey: ApiKey; rawKey: string }> {
    // Generate a new secure API key
    const rawKey = generateSecureKey()

    // Hash the key for verification purposes
    const keyHash = hashValue(rawKey)

    // Encrypt the key for storage
    const encryptedKey = encrypt(rawKey)

    const newApiKey: ApiKey = {
      id: uuidv4(),
      name,
      encryptedKey,
      keyHash,
      service,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      expiresAt,
      isActive: true,
    }

    // Store the API key
    apiKeys.push(newApiKey)

    // Log the creation
    this.logApiKeyAction({
      action: "created",
      apiKeyId: newApiKey.id,
      apiKeyName: newApiKey.name,
      service: newApiKey.service,
      performedBy: createdBy,
      details: `API key created for service: ${service}`,
    })

    // Return both the API key object and the raw key
    // The raw key should only be shown once to the user
    return { apiKey: newApiKey, rawKey }
  }

  /**
   * Updates an existing API key's metadata (not the key itself)
   */
  static async updateApiKey(
    id: string,
    updates: Partial<Omit<ApiKey, "id" | "encryptedKey" | "keyHash" | "createdAt" | "createdBy">>,
    updatedBy: string,
  ): Promise<ApiKey | null> {
    const index = apiKeys.findIndex((key) => key.id === id)

    if (index === -1) {
      return null
    }

    const updatedApiKey = {
      ...apiKeys[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    apiKeys[index] = updatedApiKey

    // Log the update
    this.logApiKeyAction({
      action: "updated",
      apiKeyId: updatedApiKey.id,
      apiKeyName: updatedApiKey.name,
      service: updatedApiKey.service,
      performedBy: updatedBy,
      details: `API key metadata updated`,
    })

    return updatedApiKey
  }

  /**
   * Rotates an API key by generating a new key value but keeping the same ID
   */
  static async rotateApiKey(id: string, updatedBy: string): Promise<{ apiKey: ApiKey; rawKey: string } | null> {
    const index = apiKeys.findIndex((key) => key.id === id)

    if (index === -1) {
      return null
    }

    // Generate a new secure API key
    const rawKey = generateSecureKey()

    // Hash the key for verification purposes
    const keyHash = hashValue(rawKey)

    // Encrypt the key for storage
    const encryptedKey = encrypt(rawKey)

    const updatedApiKey = {
      ...apiKeys[index],
      encryptedKey,
      keyHash,
      updatedAt: new Date().toISOString(),
    }

    apiKeys[index] = updatedApiKey

    // Log the rotation
    this.logApiKeyAction({
      action: "updated",
      apiKeyId: updatedApiKey.id,
      apiKeyName: updatedApiKey.name,
      service: updatedApiKey.service,
      performedBy: updatedBy,
      details: `API key rotated (value changed)`,
    })

    return { apiKey: updatedApiKey, rawKey }
  }

  /**
   * Deletes (deactivates) an API key
   */
  static async deleteApiKey(id: string, deletedBy: string): Promise<boolean> {
    const index = apiKeys.findIndex((key) => key.id === id)

    if (index === -1) {
      return false
    }

    // Instead of actually deleting, we mark it as inactive
    apiKeys[index] = {
      ...apiKeys[index],
      isActive: false,
      updatedAt: new Date().toISOString(),
    }

    // Log the deletion
    this.logApiKeyAction({
      action: "deleted",
      apiKeyId: apiKeys[index].id,
      apiKeyName: apiKeys[index].name,
      service: apiKeys[index].service,
      performedBy: deletedBy,
      details: `API key deactivated`,
    })

    return true
  }

  /**
   * Gets an API key by ID
   */
  static async getApiKeyById(id: string, viewedBy: string): Promise<ApiKey | null> {
    const apiKey = apiKeys.find((key) => key.id === id && key.isActive)

    if (apiKey) {
      // Log the view
      this.logApiKeyAction({
        action: "viewed",
        apiKeyId: apiKey.id,
        apiKeyName: apiKey.name,
        service: apiKey.service,
        performedBy: viewedBy,
        details: `API key metadata viewed`,
      })
    }

    return apiKey || null
  }

  /**
   * Gets all API keys
   */
  static async getAllApiKeys(viewedBy: string): Promise<ApiKey[]> {
    // Log the view
    this.logApiKeyAction({
      action: "viewed",
      apiKeyId: "all",
      apiKeyName: "all",
      service: "all",
      performedBy: viewedBy,
      details: `All API keys viewed`,
    })

    return apiKeys.filter((key) => key.isActive)
  }

  /**
   * Gets the decrypted value of an API key
   * This should be used very carefully and only when absolutely necessary
   */
  static async getDecryptedApiKey(id: string, requestedBy: string): Promise<string | null> {
    const apiKey = apiKeys.find((key) => key.id === id && key.isActive)

    if (!apiKey) {
      return null
    }

    // Log this sensitive action
    this.logApiKeyAction({
      action: "viewed",
      apiKeyId: apiKey.id,
      apiKeyName: apiKey.name,
      service: apiKey.service,
      performedBy: requestedBy,
      details: `API key value was decrypted and viewed - SENSITIVE OPERATION`,
    })

    try {
      return decrypt(apiKey.encryptedKey)
    } catch (error) {
      console.error("Failed to decrypt API key:", error)
      return null
    }
  }

  /**
   * Verifies an API key by its raw value
   */
  static async verifyApiKey(rawKey: string, service?: string): Promise<ApiKey | null> {
    // Hash the provided key for comparison
    const keyHash = hashValue(rawKey)

    // Find the matching API key
    const apiKey = apiKeys.find(
      (key) => key.keyHash === keyHash && key.isActive && (!service || key.service === service),
    )

    if (apiKey) {
      // Update last used timestamp
      apiKey.lastUsed = new Date().toISOString()

      // Log the usage
      this.logApiKeyAction({
        action: "used",
        apiKeyId: apiKey.id,
        apiKeyName: apiKey.name,
        service: apiKey.service,
        performedBy: "system",
        details: `API key was used for authentication`,
      })
    }

    return apiKey || null
  }

  /**
   * Logs an API key action
   */
  static logApiKeyAction(logData: Omit<ApiKeyLog, "id" | "timestamp" | "ipAddress" | "userAgent">): void {
    const log: ApiKeyLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ipAddress: "", // Would be populated from request in a real app
      userAgent: "", // Would be populated from request in a real app
      ...logData,
    }

    apiKeyLogs.push(log)
  }

  /**
   * Gets API key logs
   */
  static async getApiKeyLogs(filters?: {
    apiKeyId?: string
    service?: string
    action?: ApiKeyLog["action"]
    from?: string
    to?: string
  }): Promise<ApiKeyLog[]> {
    let filteredLogs = [...apiKeyLogs]

    if (filters) {
      if (filters.apiKeyId) {
        filteredLogs = filteredLogs.filter((log) => log.apiKeyId === filters.apiKeyId)
      }

      if (filters.service) {
        filteredLogs = filteredLogs.filter((log) => log.service === filters.service)
      }

      if (filters.action) {
        filteredLogs = filteredLogs.filter((log) => log.action === filters.action)
      }

      if (filters.from) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.from!)
      }

      if (filters.to) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.to!)
      }
    }

    // Sort by timestamp, newest first
    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
}
