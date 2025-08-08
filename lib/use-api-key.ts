"use client"

import { useState, useEffect } from "react"
import { ApiKeyService } from "./api-key-service"

/**
 * Custom hook to securely retrieve and use API keys in client components
 */
export function useApiKey(service: string) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApiKey = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // This would be a server action in a real app
        // For demo purposes, we're using the service directly
        const keys = await ApiKeyService.getAllApiKeys("system")
        const key = keys.find((k) => k.service === service && k.isActive)

        if (key) {
          const decryptedKey = await ApiKeyService.getDecryptedApiKey(key.id, "system")
          setApiKey(decryptedKey)
        } else {
          setError(`No active API key found for service: ${service}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to retrieve API key")
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiKey()
  }, [service])

  return { apiKey, isLoading, error }
}
