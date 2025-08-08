"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyTurnstileToken } from "@/app/actions/turnstile"
import { validateAndSanitizeInput } from "@/lib/security"
import Turnstile from "./turnstile"

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
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      // Restore scrolling when modal is closed
      document.body.style.overflow = ""
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
      // Sanitize token before sending to server
      const sanitizedToken = validateAndSanitizeInput(token)
      const result = await verifyTurnstileToken(sanitizedToken)

      if (result.success) {
        // Call the onVerified callback to trigger the download
        onVerified()
      } else {
        setVerificationError("Verification failed. Please try again.")
        // Reset Turnstile widget
        window.turnstile?.reset()
      }
    } catch (error) {
      setVerificationError("An error occurred during verification. Please try again.")
      // Reset Turnstile widget
      window.turnstile?.reset()
    } finally {
      setIsVerifying(false)
    }
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
            className="fixed inset-0 bg-cyber-background/80 backdrop-blur-sm z-50"
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
              <div className="glass-card rounded-lg p-6 md:p-8 border border-cyber-border-hover shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 id="modal-title" className="text-xl font-display font-medium">
                    Security Verification Required
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={onClose}
                    aria-label="Close"
                    disabled={isVerifying || isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-cyber-foreground/70 mb-6">
                    To protect against automated downloads, please complete the verification below to access the resume.
                  </p>

                  <div className="flex justify-center items-center">
                    <div className="turnstile-container">
                      <Turnstile
                        siteKey="1x00000000000000000000AA" // Using the provided test key
                        onVerify={handleTurnstileVerify}
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
                      className="mt-4 text-red-500 text-sm flex items-center justify-center"
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
                      <span className="ml-2">{isVerifying ? "Verifying..." : "Processing download..."}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-cyber-foreground/50 text-center">
                  This site is protected by Cloudflare Turnstile to ensure you're not a bot.
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
