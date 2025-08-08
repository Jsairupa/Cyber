"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ApiKeyService } from "@/lib/api-key-service"
import { AuthService } from "@/lib/auth-service"
import type { ApiKeyLog } from "@/lib/db-schema"
import { decrypt } from "@/lib/encryption"

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

// Create a new API key
export async function createApiKey(formData: FormData) {
  const user = await checkAuthorization("admin")

  const name = formData.get("name") as string
  const service = formData.get("service") as string
  const expiresAt = (formData.get("expiresAt") as string) || undefined

  if (!name || !service) {
    return {
      success: false,
      message: "Name and service are required",
    }
  }

  try {
    const result = await ApiKeyService.createApiKey(name, service, user.username, expiresAt)

    return {
      success: true,
      apiKey: result.apiKey,
      rawKey: result.rawKey,
    }
  } catch (error) {
    console.error("Failed to create API key:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create API key",
    }
  }
}

// Update an API key
export async function updateApiKey(formData: FormData) {
  const user = await checkAuthorization("admin")

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const service = formData.get("service") as string
  const isActive = formData.get("isActive") === "true"
  const expiresAt = (formData.get("expiresAt") as string) || undefined

  if (!id) {
    return {
      success: false,
      message: "API key ID is required",
    }
  }

  try {
    const updatedApiKey = await ApiKeyService.updateApiKey(
      id,
      {
        name,
        service,
        isActive,
        expiresAt,
      },
      user.username,
    )

    if (!updatedApiKey) {
      return {
        success: false,
        message: "API key not found",
      }
    }

    return {
      success: true,
      apiKey: updatedApiKey,
    }
  } catch (error) {
    console.error("Failed to update API key:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update API key",
    }
  }
}

// Rotate an API key
export async function rotateApiKey(formData: FormData) {
  const user = await checkAuthorization("admin")

  const id = formData.get("id") as string

  if (!id) {
    return {
      success: false,
      message: "API key ID is required",
    }
  }

  try {
    const result = await ApiKeyService.rotateApiKey(id, user.username)

    if (!result) {
      return {
        success: false,
        message: "API key not found",
      }
    }

    return {
      success: true,
      apiKey: result.apiKey,
      rawKey: result.rawKey,
    }
  } catch (error) {
    console.error("Failed to rotate API key:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to rotate API key",
    }
  }
}

// Delete an API key
export async function deleteApiKey(formData: FormData) {
  const user = await checkAuthorization("admin")

  const id = formData.get("id") as string

  if (!id) {
    return {
      success: false,
      message: "API key ID is required",
    }
  }

  try {
    const success = await ApiKeyService.deleteApiKey(id, user.username)

    if (!success) {
      return {
        success: false,
        message: "API key not found",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Failed to delete API key:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete API key",
    }
  }
}

// Get all API keys
export async function getAllApiKeys() {
  const user = await checkAuthorization("manager")

  try {
    const apiKeys = await ApiKeyService.getAllApiKeys(user.username)

    return {
      success: true,
      apiKeys,
    }
  } catch (error) {
    console.error("Failed to get API keys:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get API keys",
    }
  }
}

// Get API key logs
export async function getApiKeyLogs(formData: FormData) {
  const user = await checkAuthorization("manager")

  const apiKeyId = (formData.get("apiKeyId") as string) || undefined
  const service = (formData.get("service") as string) || undefined
  const action = (formData.get("action") as ApiKeyLog["action"]) || undefined
  const from = (formData.get("from") as string) || undefined
  const to = (formData.get("to") as string) || undefined

  try {
    const logs = await ApiKeyService.getApiKeyLogs({
      apiKeyId,
      service,
      action,
      from,
      to,
    })

    return {
      success: true,
      logs,
    }
  } catch (error) {
    console.error("Failed to get API key logs:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get API key logs",
    }
  }
}
