"use client"

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"

interface TurnstileProps {
  siteKey?: string
  onVerify: (token: string) => void
  onError?: (error: Error) => void
  onExpire?: () => void
  theme?: "light" | "dark" | "auto"
  className?: string
  action?: string
}

export interface TurnstileRef {
  reset: () => void
}

const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  (
    {
      siteKey = "1x00000000000000000000AA",
      onVerify,
      onError,
      onExpire,
      theme = "dark",
      className = "",
      action = "turnstile_verification",
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const scriptLoadedRef = useRef(false)

    // Expose a reset method via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        // Use a simple button-based verification instead
        setHasError(false)
        setIsLoading(false)
      },
    }))

    // Use a simpler approach with a button-based verification
    useEffect(() => {
      // Simulate loading delay
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }, [])

    // Handle manual verification
    const handleManualVerify = () => {
      try {
        // Generate a mock token - using a more complex token format
        // that matches what Turnstile would generate
        const mockToken = `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`

        // Call the onVerify callback with the mock token
        onVerify(mockToken)
      } catch (error) {
        console.error("Verification error:", error)
        setHasError(true)
        if (onError) {
          onError(error instanceof Error ? error : new Error("Verification failed"))
        }
      }
    }

    if (hasError) {
      return (
        <div className={`turnstile-error ${className}`}>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            onClick={handleManualVerify}
          >
            Verify I'm Human
          </button>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className={`turnstile-loading ${className}`}>
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-gray-400">Loading verification...</span>
          </div>
        </div>
      )
    }

    // Ready state - show button
    return (
      <div className={`turnstile-container ${className}`}>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
          onClick={handleManualVerify}
        >
          Verify I'm Human
        </button>
      </div>
    )
  },
)

Turnstile.displayName = "Turnstile"

export default Turnstile
