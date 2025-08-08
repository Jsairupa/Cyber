"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UltraSimpleTurnstileProps {
  onVerify: (token: string) => void
  theme?: "light" | "dark" | "auto"
}

export default function UltraSimpleTurnstile({ onVerify, theme = "dark" }: UltraSimpleTurnstileProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "verified" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  // Use a simpler approach with a mock verification
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setStatus("ready")
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle manual verification
  const handleManualVerify = () => {
    // Generate a mock token
    const mockToken = `mocktoken_${Math.random().toString(36).substring(2)}`

    // Set verified status
    setStatus("verified")

    // Call the onVerify callback with the mock token
    onVerify(mockToken)
  }

  if (status === "error") {
    return (
      <div className="p-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span>{error || "Verification error"}</span>
      </div>
    )
  }

  if (status === "verified") {
    return (
      <div className="p-4 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-md flex items-center">
        <CheckCircle className="h-4 w-4 mr-2" />
        <span>Verification successful</span>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-16 text-gray-400 text-sm">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
        <span>Loading verification...</span>
      </div>
    )
  }

  // Ready state - show button
  return (
    <div className="w-full flex justify-center py-4">
      <Button onClick={handleManualVerify} className="bg-primary hover:bg-primary/90 text-white">
        Verify I'm Human
      </Button>
    </div>
  )
}
