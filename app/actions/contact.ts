"use server"

import { z } from "zod"
import { headers } from "next/headers"
import { verifyTurnstileToken } from "./turnstile"
import { getTurnstileKeys } from "./config"

// Define a schema for input validation
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  turnstileToken: z.string().min(1, "Verification is required"),
})

// Type for the form data
type ContactFormData = z.infer<typeof ContactFormSchema>

// Type for the response
export type ContactFormResponse = {
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

// Rate limiting - simple in-memory implementation
// In production, use Redis or another distributed store
const RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per window
}

const ipRequests = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = ipRequests.get(ip)

  // If no record exists or the window has expired, create a new one
  if (!record || record.resetAt < now) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs })
    return true
  }

  // If under the limit, increment and allow
  if (record.count < RATE_LIMIT.max) {
    record.count++
    return true
  }

  // Rate limit exceeded
  return false
}

// Submit contact form
export async function submitContactForm(formData: ContactFormData): Promise<ContactFormResponse> {
  try {
    // Validate CSRF protection
    validateCSRF()

    // Get client IP for rate limiting
    const ip = headers().get("x-forwarded-for") || "anonymous"

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: "Too many requests. Please try again later.",
      }
    }

    // Validate form data
    try {
      ContactFormSchema.parse(formData)
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

    // Return success response
    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
