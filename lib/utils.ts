import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the file ID from a Google Drive sharing URL
 * @param url Google Drive sharing URL
 * @returns File ID or null if not found
 */
export function extractGoogleDriveFileId(url: string): string | null {
  // Pattern for Google Drive sharing URLs
  // This handles both /file/d/ and /open?id= formats
  const filePattern = /\/file\/d\/([a-zA-Z0-9_-]+)/
  const openPattern = /[?&]id=([a-zA-Z0-9_-]+)/

  let match = url.match(filePattern)
  if (match) return match[1]

  match = url.match(openPattern)
  return match ? match[1] : null
}

/**
 * Converts a Google Drive sharing URL to a direct download URL
 * @param url Google Drive sharing URL
 * @returns Direct download URL or the original URL if not a Google Drive URL
 */
export function getGoogleDriveDownloadUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url)
  if (fileId) {
    // Use the export=download parameter to force download
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }
  return url
}

// Update the downloadFile function to prevent duplicate downloads
// Replace the existing downloadFile function with this version:

export function downloadFile(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Check if it's a Google Drive URL and convert to direct download URL if needed
      const downloadUrl = getGoogleDriveDownloadUrl(url)
      console.log("Download URL:", downloadUrl)

      // For API routes, use fetch to prevent duplicate downloads
      if (url.startsWith("/api/")) {
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.blob()
          })
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = blobUrl
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(blobUrl)
            resolve()
          })
          .catch((error) => {
            console.error("Fetch error:", error)
            reject(error)
          })
      } else {
        // For other URLs, use the anchor method
        const a = document.createElement("a")
        a.href = downloadUrl

        // For Google Drive URLs, don't set the download attribute
        if (!url.includes("drive.google.com")) {
          a.download = filename
        }

        a.target = "_blank"
        a.rel = "noopener noreferrer"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        // Resolve the promise after a short delay
        setTimeout(() => {
          resolve()
        }, 100)
      }
    } catch (error) {
      console.error("Download error:", error)
      reject(error)
    }
  })
}
