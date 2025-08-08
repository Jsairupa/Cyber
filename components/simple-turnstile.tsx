"use client"

import { useEffect, useState, forwardRef, useImperativeHandle } from "react"

interface SimpleTurnstileProps {
  siteKey?: string
  onVerify: (token: string) => void
  onError?: (error: Error) => void
  theme?: "light" | "dark" | "auto"
  className?: string
}

export interface SimpleTurnstileRef {
  reset: () => void
}

const SimpleTurnstile = forwardRef<SimpleTurnstileRef, SimpleTurnstileProps>(
  (
    {
      siteKey = "1x00000000000000000000AA", // Use the test key directly
      onVerify,
      onError,
      theme = "dark",
      className = "",
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Expose a reset method via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        // In this simplified version, we just simulate a reset
        console.log("Reset called on SimpleTurnstile")
      },
    }))

    // Simulate verification after a delay
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false)

        // Generate a mock token
        const mockToken = `mocktoken_${Math.random().toString(36).substring(2)}`

        // Call the onVerify callback with the mock token
        onVerify(mockToken)
      }, 1500)

      return () => clearTimeout(timer)
    }, [onVerify])

    if (hasError) {
      return (
        <div className={`turnstile-error ${className}`}>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            onClick={() => {
              // Generate a mock token and call onVerify
              const mockToken = `mocktoken_${Math.random().toString(36).substring(2)}`
              onVerify(mockToken)
            }}
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
            <span className="ml-2 text-sm text-gray-400">Verifying...</span>
          </div>
        </div>
      )
    }

    return (
      <div className={`turnstile-verified ${className}`}>
        <div className="flex items-center justify-center text-sm text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Verification successful
        </div>
      </div>
    )
  },
)

SimpleTurnstile.displayName = "SimpleTurnstile"

export default SimpleTurnstile
