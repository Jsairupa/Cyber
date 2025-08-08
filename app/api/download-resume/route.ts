import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/encryption"
import { getServerSideTurnstileSecretKey } from "@/lib/env-utils"

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

      // Set headers for file download
      const headers = new Headers()
      headers.set("Content-Disposition", 'attachment; filename="resume.pdf"')
      headers.set("Content-Type", "application/pdf")

      // Use the environment variable for the resume URL if available
      const resumeUrl =
        process.env.RESUME_FILE_URL ||
        "https://drive.google.com/file/d/1M05jV9pIqmFjEnTgmdqh-ZxyeoHE4nSN/view?usp=sharing"
      const directDownloadUrl = getGoogleDriveDownloadUrl(resumeUrl)

      // Redirect to the direct download URL
      return NextResponse.redirect(directDownloadUrl, {
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
    const SECRET_KEY = getServerSideTurnstileSecretKey()

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

function getGoogleDriveDownloadUrl(fileUrl: string): string {
  const fileId = fileUrl.match(/[-\w]{25,}/)?.[0]
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}
