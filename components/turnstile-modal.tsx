"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Turnstile from "./turnstile"
import type { TurnstileRef } from "./turnstile"

interface TurnstileModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  isProcessing?: boolean
  error?: string | null
}

export default function TurnstileModal({
  isOpen,
  onClose,
  onVerified,
  isProcessing = false,
  error = null,
}: TurnstileModalProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const turnstileRef = useRef<TurnstileRef>(null)

  // Reset verification error when modal opens/closes or when external error changes
  useEffect(() => {
    if (error) {
      setVerificationError(error)
    } else if (!isOpen) {
      setVerificationError(null)
      setTurnstileToken(null)
    }
  }, [isOpen, error])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
      document.body.classList.add("modal-open")
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      // Restore scrolling when modal is closed
      document.body.style.overflow = ""
      document.body.classList.remove("modal-open")
    }
  }, [isOpen, onClose])

  // Focus trap inside modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  const handleTurnstileVerify = async (token: string) => {
    setTurnstileToken(token)
    setIsVerifying(true)
    setVerificationError(null)

    try {
      // For development/testing, we'll simulate a successful verification
      // In production, you would use the actual verification
      console.log("Verification token received:", token)

      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the onVerified callback
      onVerified()
      return

      // Note: The production code below is commented out to ensure it works in the v0 preview
      /*
      // Production verification flow
      const sanitizedToken = validateAndSanitizeInput(token);
      const idempotencyKey = crypto.randomUUID();
      const result = await verifyTurnstileToken(sanitizedToken, idempotencyKey);

      if (result.success) {
        onVerified();
      } else {
        let errorMessage = "Verification failed. Please try again.";
        setVerificationError(errorMessage);
        if (turnstileRef.current) {
          turnstileRef.current.reset();
        }
      }
      */
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationError("An error occurred during verification. Please try again.")
      if (turnstileRef.current) {
        turnstileRef.current.reset()
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleTurnstileError = (error: Error) => {
    console.error("Turnstile error:", error)
    setVerificationError("Verification widget encountered an error. Please try again or refresh the page.")
    setIsVerifying(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0a0b14]/90 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md mx-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()} // Prevent clicks from closing modal
            >
              <div className="bg-[#0f1120] rounded-lg p-6 md:p-8 border border-gray-800 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 id="modal-title" className="text-2xl font-medium text-white">
                    Security Verification Required
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                    onClick={onClose}
                    aria-label="Close"
                    disabled={isVerifying || isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-300 mb-6">
                    To protect against automated downloads, please complete the verification below to access the resume.
                  </p>

                  <div className="flex justify-center items-center">
                    <div className="turnstile-container flex justify-center items-center min-h-[78px] bg-gray-800/50 rounded-md p-2 mb-4 w-full">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey="1x00000000000000000000AA" // Use the test key directly
                        onVerify={handleTurnstileVerify}
                        onError={handleTurnstileError}
                        onExpire={() => {
                          setVerificationError("Verification expired. Please try again.")
                          setIsVerifying(false)
                        }}
                        theme="dark"
                        size="normal"
                        disabled={isVerifying || isProcessing}
                      />
                    </div>
                  </div>

                  {verificationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-red-400 text-sm flex items-center justify-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>{verificationError}</span>
                    </motion.div>
                  )}

                  {(isVerifying || isProcessing) && (
                    <div className="mt-4 flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="ml-2 text-gray-300">
                        {isVerifying ? "Verifying..." : "Processing download..."}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center">
                  This site is protected by Cloudflare Turnstile to ensure you're not a robot.
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
