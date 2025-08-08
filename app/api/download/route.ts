import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/encryption"
import { validatePdfFile } from "@/lib/pdf-utils"

export const runtime = "nodejs" // Use Node.js runtime for better file handling

// Define cache control headers
const CACHE_CONTROL_HEADERS = {
  public: "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
  private: "private, no-cache, no-store, must-revalidate",
}

export async function GET(request: NextRequest) {
  try {
    // Get the token from the query parameters
    const token = request.nextUrl.searchParams.get("token")
    const turnstileToken = request.nextUrl.searchParams.get("cf-turnstile-response")

    if (!token) {
      return new NextResponse("Unauthorized: Missing token", { status: 401 })
    }

    try {
      // Decrypt the token
      decrypt(token)

      // If Turnstile token is provided, verify it
      if (turnstileToken) {
        // Verify the Turnstile token
        const verificationResult = await verifyTurnstileToken(turnstileToken)

        if (!verificationResult.success) {
          console.error("Turnstile verification failed:", verificationResult["error-codes"])
          return new NextResponse("Unauthorized: Invalid verification", { status: 401 })
        }
      } else {
        // If no Turnstile token is provided, reject the request
        return new NextResponse("Unauthorized: Missing verification", { status: 401 })
      }

      // Validate the PDF file
      const resumeUrl = process.env.RESUME_FILE_URL || "/resume.pdf"
      const isValid = await validatePdfFile(resumeUrl)

      if (!isValid) {
        console.error("PDF validation failed")
        return new NextResponse("Error: Invalid file", { status: 500 })
      }

      // Set headers for file download
      const headers = new Headers()
      headers.set("Content-Disposition", 'attachment; filename="resume.pdf"')
      headers.set("Content-Type", "application/pdf")
      headers.set("Cache-Control", CACHE_CONTROL_HEADERS.private) // No caching for secure downloads

      // For v0 preview, we'll redirect to a public URL of the resume
      // In production, you would serve the actual file
      return NextResponse.redirect(new URL("/resume.pdf", request.url), {
        headers,
      })
    } catch (error) {
      console.error("Token validation error:", error)
      return new NextResponse("Unauthorized: Invalid token", { status: 401 })
    }
  } catch (error) {
    console.error("Download error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// Function to verify Turnstile token
async function verifyTurnstileToken(token: string) {
  try {
    // Get client IP address
    const ip = "127.0.0.1" // In a real environment, get this from the request

    // Get the secret key from our server-only utility
    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "1x0000000000000000000000000000000AA"

    // Create form data for the request
    const formData = new URLSearchParams()
    formData.append("secret", SECRET_KEY)
    formData.append("response", token)
    formData.append("remoteip", ip)

    // In development mode, simulate a successful verification
    if (process.env.NODE_ENV !== "production") {
      console.log("Development environment: Simulating Turnstile verification")
      return {
        success: true,
        challenge_ts: new Date().toISOString(),
        hostname: "localhost",
        "error-codes": [],
      }
    }

    // Make the request to Cloudflare's siteverify API
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      cache: "no-store", // Don't cache verification requests
    })

    if (!response.ok) {
      throw new Error(`Turnstile verification failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Turnstile verification error:", error)
    return {
      success: false,
      "error-codes": [(error as Error).message],
    }
  }
}
