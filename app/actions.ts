"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { encrypt, generateToken } from "@/lib/crypto-utils"
import { verifyTurnstileToken } from "./actions/turnstile"
import { getTurnstileKeys } from "./actions/config"

// Input validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  turnstileToken: z.string().min(1, "Verification token is required"),
})

// Type for the form data
type ContactFormData = z.infer<typeof contactFormSchema>

// Type for the response
type SubmitResponse = {
  success: boolean
  message?: string
  errors?: Record<string, string>
  turnstileFailed?: boolean
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

// Submit contact form
export async function submitContactForm(formData: ContactFormData): Promise<SubmitResponse> {
  try {
    // Validate CSRF protection
    validateCSRF()

    // Validate form data
    try {
      contactFormSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message
          }
        })
        return {
          success: false,
          message: "Validation failed",
          errors,
        }
      }
      throw error
    }

    // Generate a unique idempotency key for this verification
    const idempotencyKey = crypto.randomUUID()

    // Get the Turnstile keys from the configuration
    const { secretKey } = await getTurnstileKeys()

    // Verify Turnstile token
    const verificationResult = await verifyTurnstileToken(formData.turnstileToken, idempotencyKey, secretKey)

    if (!verificationResult.success) {
      return {
        success: false,
        message: "Security verification failed. Please try again.",
        turnstileFailed: true,
      }
    }

    // Log form submission (in a real app, you would send an email or save to a database)
    console.log("Form submitted:", {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      timestamp: new Date().toISOString(),
      turnstileVerified: true,
      turnstileHostname: verificationResult.hostname,
      turnstileTimestamp: verificationResult.challenge_ts,
    })

    // Simulate a delay to show loading state (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success response
    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Update the getSecureDownloadUrl function to handle missing environment variables
export async function getSecureDownloadUrl(): Promise<{ url: string }> {
  try {
    // Generate a unique token
    const token = generateToken()

    // Encrypt the token
    const encryptedToken = encrypt(token)

    // Get the base URL from headers if VERCEL_URL is not available
    let baseUrl: string

    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      // Use the public environment variable if available
      baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    } else {
      // Fallback to using the request headers to determine the base URL
      const headersList = headers()
      const host = headersList.get("host") || "localhost:3000"
      const protocol = host.includes("localhost") ? "http" : "https"
      baseUrl = `${protocol}://${host}`
    }

    const downloadUrl = `${baseUrl}/api/download-resume?token=${encryptedToken}`

    return { url: downloadUrl }
  } catch (error) {
    console.error("Error generating secure download URL:", error)
    throw error
  }
}
