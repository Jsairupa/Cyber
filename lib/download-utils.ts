/**
 * Initiates a direct download of a file
 * Simplified version for the v0 preview environment
 *
 * @param url URL of the file to download
 * @param filename Suggested filename for the download
 * @returns Promise that resolves when download is initiated
 */
export function downloadFile(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Open in a new tab - most reliable method for the v0 preview
      window.open(url, "_blank")
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Detects if the user is on a mobile device
 * @returns Boolean indicating if user is on mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detects the browser type
 * @returns String indicating the browser type
 */
export function detectBrowser(): string {
  const userAgent = navigator.userAgent

  if (userAgent.indexOf("Chrome") > -1) return "chrome"
  if (userAgent.indexOf("Safari") > -1) return "safari"
  if (userAgent.indexOf("Firefox") > -1) return "firefox"
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "ie"
  if (userAgent.indexOf("Edge") > -1) return "edge"

  return "unknown"
}
