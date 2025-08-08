/**
 * Utility for testing PDF file integrity
 * This is a development-only utility that can be used to verify PDF files
 */

/**
 * Tests if a PDF file is valid by checking its header and structure
 * @param arrayBuffer The PDF file as an ArrayBuffer
 * @returns Boolean indicating if the PDF is valid
 */
export function isPdfValid(arrayBuffer: ArrayBuffer): boolean {
  // Convert ArrayBuffer to Uint8Array for easier manipulation
  const uint8Array = new Uint8Array(arrayBuffer)

  // Check PDF header (should start with %PDF-)
  const header = new TextDecoder().decode(uint8Array.slice(0, 5))
  if (header !== "%PDF-") {
    console.error("Invalid PDF header:", header)
    return false
  }

  // Check for EOF marker
  const lastBytes = uint8Array.slice(-5)
  const eofString = new TextDecoder().decode(lastBytes)
  if (!eofString.includes("EOF")) {
    console.error("Missing EOF marker in PDF")
    return false
  }

  return true
}

/**
 * Fetches a PDF file and tests its validity
 * @param url The URL of the PDF file
 * @returns Promise resolving to a validation result object
 */
export async function testPdfFile(url: string): Promise<{
  valid: boolean
  size: number
  message: string
}> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      return {
        valid: false,
        size: 0,
        message: `HTTP error: ${response.status} ${response.statusText}`,
      }
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/pdf")) {
      return {
        valid: false,
        size: 0,
        message: `Invalid content type: ${contentType}`,
      }
    }

    const arrayBuffer = await response.arrayBuffer()
    const valid = isPdfValid(arrayBuffer)

    return {
      valid,
      size: arrayBuffer.byteLength,
      message: valid ? `Valid PDF file (${(arrayBuffer.byteLength / 1024).toFixed(2)} KB)` : "Invalid PDF structure",
    }
  } catch (error) {
    return {
      valid: false,
      size: 0,
      message: `Error testing PDF: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
