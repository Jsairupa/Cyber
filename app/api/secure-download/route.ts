import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/encryption"
import { getGoogleDriveDownloadUrl } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    // Get the token from the query parameters
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return new NextResponse("Unauthorized: Missing token", { status: 401 })
    }

    try {
      // Decrypt the token
      const payload = JSON.parse(decrypt(token))

      // Check if the token has expired
      if (payload.exp < Date.now()) {
        return new NextResponse("Unauthorized: Token expired", { status: 401 })
      }

      // Get the URL from the payload
      const url = payload.url

      if (!url) {
        return new NextResponse("Error: Invalid download information", { status: 400 })
      }

      // Convert Google Drive sharing URL to direct download URL
      const downloadUrl = getGoogleDriveDownloadUrl(url)
      console.log("Redirecting to:", downloadUrl)

      // Set headers for file download
      const headers = new Headers()
      headers.set("Content-Disposition", 'attachment; filename="Rahul_Itha_eJPT_Sec+_CEH.pdf"')
      headers.set("Content-Type", "application/pdf")

      // Redirect to the actual file URL
      return NextResponse.redirect(downloadUrl, { headers })
    } catch (error: any) {
      console.error("Token validation error:", error)
      return new NextResponse(`Unauthorized: Invalid token - ${error.message}`, { status: 401 })
    }
  } catch (error: any) {
    console.error("Download error:", error)
    return new NextResponse(`Internal Server Error - ${error.message}`, { status: 500 })
  }
}
