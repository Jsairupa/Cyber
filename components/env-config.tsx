"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Key, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTurnstileSiteKey, getEnvStatus } from "@/app/actions/env-config"

export default function EnvConfig() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [envStatus, setEnvStatus] = useState({
    hasSiteKey: false,
    hasSecretKey: false,
  })

  const [config, setConfig] = useState({
    siteKey: "",
    secretKey: "",
  })

  useEffect(() => {
    // Fetch the site key and environment status from the server
    const fetchData = async () => {
      try {
        const [keyResult, statusResult] = await Promise.all([getTurnstileSiteKey(), getEnvStatus()])

        setConfig((prev) => ({ ...prev, siteKey: keyResult.siteKey }))
        setEnvStatus(statusResult)
      } catch (error) {
        console.error("Failed to fetch configuration data:", error)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate inputs
      if (!config.siteKey) {
        setError("Site Key is required")
        setIsSubmitting(false)
        return
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would update environment variables
      // For this demo, we'll just show a success message
      setSuccess(
        "Environment variables updated successfully! Please restart the application for changes to take effect.",
      )
    } catch (error) {
      console.error("Error updating environment variables:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
      <div className="flex items-center mb-6">
        <Key className="h-6 w-6 text-primary mr-3" />
        <h2 className="text-xl font-display font-bold">Environment Variables</h2>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start"
        >
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start"
        >
          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">{success}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteKey" className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            Turnstile Site Key
          </Label>
          <Input
            id="siteKey"
            name="siteKey"
            value={config.siteKey}
            onChange={(e) => setConfig({ ...config, siteKey: e.target.value })}
            placeholder="e.g., 0x4AAAAAAACdvRD3Uq..."
            className="font-mono"
            required
          />
          <p className="text-xs text-cyber-foreground/60">The public site key from your Cloudflare Turnstile widget</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretKey" className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            Turnstile Secret Key
          </Label>
          <div className="relative">
            <Input
              id="secretKey"
              name="secretKey"
              type={showSecretKey ? "text" : "password"}
              value={config.secretKey}
              onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
              placeholder="e.g., 0x4AAAAAAACdvRGFLp..."
              className="font-mono pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyber-foreground/60 hover:text-cyber-foreground"
              onClick={() => setShowSecretKey(!showSecretKey)}
            >
              {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-cyber-foreground/60">The secret key from your Cloudflare Turnstile widget</p>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Environment Variables"}
          </Button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-cyber-muted/30 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Current Environment Variables:</h3>
        <div className="text-xs text-cyber-foreground/70 space-y-2">
          <div>
            <span className="font-mono">Turnstile Site Key:</span>{" "}
            <span className="font-mono">{envStatus.hasSiteKey ? "Configured" : "Not set"}</span>
          </div>
          <div>
            <span className="font-mono">Turnstile Secret Key:</span>{" "}
            <span className="font-mono">{envStatus.hasSecretKey ? "Configured" : "Not set"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
