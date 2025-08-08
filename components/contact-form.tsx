"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { submitContactForm } from "@/app/actions"
import Turnstile from "./turnstile"
import type { TurnstileRef } from "./turnstile"
import { getTurnstileSiteKey } from "@/app/actions/env-config"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function ContactForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  // Form status state
  const [formStatus, setFormStatus] = useState<{
    isSubmitting: boolean
    isSubmitted: boolean
    isError: boolean
    message: string
  }>({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: "",
  })

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState<string | null>(null)
  const [siteKey, setSiteKey] = useState<string>("1x00000000000000000000AA")

  const turnstileRef = useRef<TurnstileRef>(null)

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle Turnstile verification
  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token)
    setTurnstileError(null)
  }

  // Handle Turnstile error
  const handleTurnstileError = (error: Error) => {
    setTurnstileError(error.message)
    setTurnstileToken(null)
  }

  // Handle Turnstile expiration
  const handleTurnstileExpire = () => {
    setTurnstileToken(null)
    setTurnstileError("Verification has expired, please verify again")
  }

  useEffect(() => {
    // Fetch the site key from the server
    const fetchSiteKey = async () => {
      try {
        const { siteKey: fetchedKey } = await getTurnstileSiteKey()
        setSiteKey(fetchedKey)
      } catch (error) {
        console.error("Failed to fetch site key:", error)
      }
    }

    fetchSiteKey()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reset status
    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
      message: "",
    })

    // Validate form data
    try {
      formSchema.parse(formData)
      setValidationErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message
          }
        })
        setValidationErrors(errors)
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          isError: true,
          message: "Please fix the errors in the form",
        })
        return
      }
    }

    // Check if Turnstile is completed
    if (!turnstileToken) {
      setTurnstileError("Please complete the verification")
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
        message: "Verification is required",
      })
      return
    }

    try {
      // Submit form with Turnstile token
      const result = await submitContactForm({
        ...formData,
        turnstileToken,
      })

      if (result.success) {
        // Reset form on success
        setFormData({ name: "", email: "", message: "" })
        setTurnstileToken(null)
        // Reset Turnstile widget
        if (turnstileRef.current) {
          turnstileRef.current.reset()
        }

        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: false,
          message: result.message || "Thank you! Your message has been sent successfully.",
        })
      } else {
        // Handle server-side validation errors
        if (result.errors) {
          setValidationErrors(result.errors)
        }

        // Handle Turnstile verification failure
        if (result.turnstileFailed) {
          setTurnstileError("Verification failed, please try again")
          if (turnstileRef.current) {
            turnstileRef.current.reset()
          }
        }

        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          isError: true,
          message: result.message || "There was an error submitting the form. Please try again.",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
        message: "An unexpected error occurred. Please try again later.",
      })
      if (turnstileRef.current) {
        turnstileRef.current.reset()
      }
    }
  }

  return (
    <div className="glass-card rounded-lg p-6 md:p-8 border border-cyber-border-hover shadow-xl">
      <h2 className="text-2xl font-display font-bold mb-6">Get in Touch</h2>

      {formStatus.isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center text-green-400"
        >
          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <p>{formStatus.message}</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`bg-cyber-muted/50 border ${validationErrors.name ? "border-red-500" : "border-cyber-border"}`}
              aria-invalid={!!validationErrors.name}
              aria-describedby={validationErrors.name ? "name-error" : undefined}
              disabled={formStatus.isSubmitting}
              required
            />
            {validationErrors.name && (
              <p id="name-error" className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={`bg-cyber-muted/50 border ${
                validationErrors.email ? "border-red-500" : "border-cyber-border"
              }`}
              aria-invalid={!!validationErrors.email}
              aria-describedby={validationErrors.email ? "email-error" : undefined}
              disabled={formStatus.isSubmitting}
              required
            />
            {validationErrors.email && (
              <p id="email-error" className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Message field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              className={`bg-cyber-muted/50 border min-h-[120px] ${
                validationErrors.message ? "border-red-500" : "border-cyber-border"
              }`}
              aria-invalid={!!validationErrors.message}
              aria-describedby={validationErrors.message ? "message-error" : undefined}
              disabled={formStatus.isSubmitting}
              required
            />
            {validationErrors.message && (
              <p id="message-error" className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.message}
              </p>
            )}
          </div>

          {/* Turnstile */}
          <div className="space-y-2">
            <div className="flex justify-center sm:justify-start">
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onVerify={handleTurnstileVerify}
                onError={handleTurnstileError}
                onExpire={handleTurnstileExpire}
                theme="dark"
                className="turnstile-container"
                action="contact_form"
              />
            </div>
            {turnstileError && (
              <p className="text-red-500 text-xs mt-1 flex items-center justify-center sm:justify-start">
                <AlertCircle className="h-3 w-3 mr-1" />
                {turnstileError}
              </p>
            )}
          </div>

          {/* Form error message */}
          {formStatus.isError && formStatus.message && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center text-red-400">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-sm">{formStatus.message}</p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
            disabled={formStatus.isSubmitting}
          >
            {formStatus.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Send Message"
            )}
          </Button>

          {/* Privacy notice */}
          <p className="text-xs text-cyber-foreground/50 text-center">
            This site is protected by Cloudflare Turnstile to ensure you're not a robot.
          </p>
        </form>
      )}
    </div>
  )
}
