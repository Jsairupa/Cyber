import { v4 as uuidv4 } from "uuid"
import { encrypt, decrypt } from "./encryption"
import type { TurnstileSiteKey, TurnstileLog, TurnstileAnalytics, TurnstileVerification } from "./turnstile-schema"

// In-memory storage for Turnstile keys and logs (in a real app, use a database)
const turnstileSiteKeys: TurnstileSiteKey[] = []
const turnstileLogs: TurnstileLog[] = []
const turnstileAnalytics: TurnstileAnalytics[] = []

// Test keys provided
const TEST_SITE_KEY = "1x00000000000000000000AA"
const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA"

// Initialize with the test key
const initializeTestKey = () => {
  if (turnstileSiteKeys.length === 0) {
    const testKey: TurnstileSiteKey = {
      id: uuidv4(),
      name: "Test Key",
      environment: "development",
      siteKey: TEST_SITE_KEY,
      secretKey: encrypt(TEST_SECRET_KEY), // Encrypt the secret key
      domain: "localhost",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "system",
    }

    turnstileSiteKeys.push(testKey)

    // Log the initialization
    TurnstileService.logAction({
      id: uuidv4(),
      siteKeyId: testKey.id,
      action: "created",
      success: true,
      timestamp: new Date().toISOString(),
      performedBy: "system",
      details: "Test Turnstile key initialized",
    })
  }
}

export class TurnstileService {
  /**
   * Creates a new Turnstile site key
   */
  static async createSiteKey(
    name: string,
    environment: TurnstileSiteKey["environment"],
    siteKey: string,
    secretKey: string,
    domain: string,
    createdBy: string,
  ): Promise<TurnstileSiteKey> {
    // Encrypt the secret key for storage
    const encryptedSecretKey = encrypt(secretKey)

    const newSiteKey: TurnstileSiteKey = {
      id: uuidv4(),
      name,
      environment,
      siteKey,
      secretKey: encryptedSecretKey,
      domain,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
    }

    // Store the site key
    turnstileSiteKeys.push(newSiteKey)

    // Log the creation
    this.logAction({
      id: uuidv4(),
      siteKeyId: newSiteKey.id,
      action: "created",
      success: true,
      timestamp: new Date().toISOString(),
      performedBy: createdBy,
      details: `Turnstile site key created for ${environment} environment on domain ${domain}`,
    })

    return newSiteKey
  }

  /**
   * Updates an existing Turnstile site key
   */
  static async updateSiteKey(
    id: string,
    updates: Partial<Omit<TurnstileSiteKey, "id" | "createdAt" | "createdBy">>,
    updatedBy: string,
  ): Promise<TurnstileSiteKey | null> {
    const index = turnstileSiteKeys.findIndex((key) => key.id === id)

    if (index === -1) {
      return null
    }

    // If updating the secret key, encrypt it
    if (updates.secretKey) {
      updates.secretKey = encrypt(updates.secretKey)
    }

    const updatedSiteKey = {
      ...turnstileSiteKeys[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    turnstileSiteKeys[index] = updatedSiteKey

    // Log the update
    this.logAction({
      id: uuidv4(),
      siteKeyId: updatedSiteKey.id,
      action: "updated",
      success: true,
      timestamp: new Date().toISOString(),
      performedBy: updatedBy,
      details: `Turnstile site key updated for ${updatedSiteKey.environment} environment`,
    })

    return updatedSiteKey
  }

  /**
   * Deletes (deactivates) a Turnstile site key
   */
  static async deleteSiteKey(id: string, deletedBy: string): Promise<boolean> {
    const index = turnstileSiteKeys.findIndex((key) => key.id === id)

    if (index === -1) {
      return false
    }

    // Instead of actually deleting, we mark it as inactive
    turnstileSiteKeys[index] = {
      ...turnstileSiteKeys[index],
      isActive: false,
      updatedAt: new Date().toISOString(),
    }

    // Log the deletion
    this.logAction({
      id: uuidv4(),
      siteKeyId: turnstileSiteKeys[index].id,
      action: "deleted",
      success: true,
      timestamp: new Date().toISOString(),
      performedBy: deletedBy,
      details: `Turnstile site key deactivated`,
    })

    return true
  }

  /**
   * Gets a Turnstile site key by ID
   */
  static async getSiteKeyById(id: string, viewedBy: string): Promise<TurnstileSiteKey | null> {
    // Initialize test key if needed
    initializeTestKey()

    const siteKey = turnstileSiteKeys.find((key) => key.id === id && key.isActive)

    if (siteKey) {
      // Log the view
      this.logAction({
        id: uuidv4(),
        siteKeyId: siteKey.id,
        action: "viewed",
        success: true,
        timestamp: new Date().toISOString(),
        performedBy: viewedBy,
        details: `Turnstile site key viewed`,
      })
    }

    return siteKey || null
  }

  /**
   * Gets all Turnstile site keys
   */
  static async getAllSiteKeys(viewedBy: string): Promise<TurnstileSiteKey[]> {
    // Initialize test key if needed
    initializeTestKey()

    // Log the view
    this.logAction({
      id: uuidv4(),
      siteKeyId: "all",
      action: "viewed",
      success: true,
      timestamp: new Date().toISOString(),
      performedBy: viewedBy,
      details: `All Turnstile site keys viewed`,
    })

    return turnstileSiteKeys.filter((key) => key.isActive)
  }

  /**
   * Gets the decrypted secret key
   */
  static async getDecryptedSecretKey(id: string, requestedBy: string): Promise<string | null> {
    // Initialize test key if needed
    initializeTestKey()

    const siteKey = turnstileSiteKeys.find((key) => key.id === id && key.isActive)

    if (!siteKey) {
      return null
    }

    // Log this sensitive action
    this.logAction({
      id: uuidv4(),
      siteKeyId: siteKey.id,
      action: "viewed",
      success: true,
      timestamp: new Date().toISOString(),
      performedBy: requestedBy,
      details: `Turnstile secret key was decrypted and viewed - SENSITIVE OPERATION`,
    })

    try {
      return decrypt(siteKey.secretKey)
    } catch (error) {
      console.error("Failed to decrypt Turnstile secret key:", error)
      return null
    }
  }

  /**
   * Gets the active site key for a specific environment and domain
   */
  static async getActiveSiteKey(
    environment: TurnstileSiteKey["environment"] = "development",
    domain = "localhost",
  ): Promise<{ siteKey: string; secretKey: string } | null> {
    // Initialize test key if needed
    initializeTestKey()

    // Find the active site key for the specified environment and domain
    let siteKey = turnstileSiteKeys.find(
      (key) => key.environment === environment && key.domain === domain && key.isActive,
    )

    // If no key found for the specific domain, try to find a key for any domain
    if (!siteKey) {
      siteKey = turnstileSiteKeys.find((key) => key.environment === environment && key.isActive)
    }

    // If still no key found, use the test key
    if (!siteKey) {
      siteKey = turnstileSiteKeys.find((key) => key.isActive)
    }

    if (!siteKey) {
      // Return the hardcoded test keys if no keys are found
      return {
        siteKey: TEST_SITE_KEY,
        secretKey: TEST_SECRET_KEY,
      }
    }

    try {
      // Decrypt the secret key
      const decryptedSecretKey = decrypt(siteKey.secretKey)

      // Update last used timestamp
      siteKey.lastUsed = new Date().toISOString()

      // Log the usage
      this.logAction({
        id: uuidv4(),
        siteKeyId: siteKey.id,
        action: "used",
        success: true,
        timestamp: new Date().toISOString(),
        performedBy: "system",
        details: `Turnstile site key was used for verification`,
      })

      return {
        siteKey: siteKey.siteKey,
        secretKey: decryptedSecretKey,
      }
    } catch (error) {
      console.error("Failed to get active Turnstile site key:", error)
      // Return the hardcoded test keys as fallback
      return {
        siteKey: TEST_SITE_KEY,
        secretKey: TEST_SECRET_KEY,
      }
    }
  }

  /**
   * Verifies a Turnstile token
   */
  static async verifyToken(
    token: string,
    secretKey = TEST_SECRET_KEY, // Default to the test secret key
    ip?: string,
  ): Promise<TurnstileVerification> {
    try {
      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          remoteip: ip,
        }),
      })

      if (!response.ok) {
        throw new Error(`Turnstile verification failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Record analytics
      this.recordVerification(result.success)

      return result
    } catch (error) {
      console.error("Turnstile verification error:", error)

      // Record failed verification
      this.recordVerification(false)

      return {
        success: false,
        error_codes: [(error as Error).message],
      }
    }
  }

  /**
   * Records a verification attempt for analytics
   */
  static recordVerification(success: boolean): void {
    const today = new Date().toISOString().split("T")[0]

    // Find or create analytics entry for today
    let analytics = turnstileAnalytics.find((a) => a.date.startsWith(today))

    if (!analytics) {
      analytics = {
        id: uuidv4(),
        siteKeyId: "all", // Aggregate analytics
        date: new Date().toISOString(),
        totalVerifications: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
        averageResponseTime: 0,
      }

      turnstileAnalytics.push(analytics)
    }

    // Update analytics
    analytics.totalVerifications += 1

    if (success) {
      analytics.successfulVerifications += 1
    } else {
      analytics.failedVerifications += 1
    }
  }

  /**
   * Logs a Turnstile action
   */
  static logAction(log: TurnstileLog): void {
    turnstileLogs.push(log)
  }

  /**
   * Gets Turnstile logs
   */
  static async getLogs(filters?: {
    siteKeyId?: string
    action?: TurnstileLog["action"]
    from?: string
    to?: string
  }): Promise<TurnstileLog[]> {
    let filteredLogs = [...turnstileLogs]

    if (filters) {
      if (filters.siteKeyId) {
        filteredLogs = filteredLogs.filter((log) => log.siteKeyId === filters.siteKeyId)
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

  /**
   * Gets Turnstile analytics
   */
  static async getAnalytics(filters?: {
    siteKeyId?: string
    from?: string
    to?: string
  }): Promise<TurnstileAnalytics[]> {
    let filteredAnalytics = [...turnstileAnalytics]

    if (filters) {
      if (filters.siteKeyId) {
        filteredAnalytics = filteredAnalytics.filter((a) => a.siteKeyId === filters.siteKeyId)
      }

      if (filters.from) {
        filteredAnalytics = filteredAnalytics.filter((a) => a.date >= filters.from!)
      }

      if (filters.to) {
        filteredAnalytics = filteredAnalytics.filter((a) => a.date <= filters.to!)
      }
    }

    // Sort by date, newest first
    return filteredAnalytics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}
