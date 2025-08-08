"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Shield, Key, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveTurnstileConfig, getTurnstileConfig } from "@/app/actions/config"

export default function TurnstileConfigForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showSecretKey, setShowSecretKey] = useState(false)

  const [config, setConfig] = useState({
    siteKey: "",
    secretKey: "",
  })

  // Load existing configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const result = await getTurnstileConfig()
        if (result.success) {
          setConfig({
            siteKey: result.siteKey || "",
            secretKey: result.secretKey ? "••••••••••••••••••••••••••••••••" : "",
          })
        }
      } catch (error) {
        console.error("Failed to load configuration:", error)
        setError("Failed to load configuration")
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await saveTurnstileConfig(formData)

      if (result.success) {
        setSuccess("Configuration saved successfully")
        // If the secret key field contains only asterisks, don't update it in the form
        if (
          config.secretKey === "••••••••••••••••••••••••••••••••" &&
          formData.get("secretKey") === "••••••••••••••••••••••••••••••••"
        ) {
          // Keep the masked version
        } else {
          setConfig({
            siteKey: formData.get("siteKey") as string,
            secretKey: "••••••••••••••••••••••••••••••••",
          })
        }
      } else {
        setError(result.message || "Failed to save configuration")
      }
    } catch (error) {
      console.error("Error saving configuration:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading configuration...</span>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-primary mr-3" />
        <h2 className="text-xl font-display font-bold">Cloudflare Turnstile Configuration</h2>
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
            Site Key
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
            Secret Key
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
              required={config.secretKey === ""}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyber-foreground/60 hover:text-cyber-foreground"
              onClick={() => setShowSecretKey(!showSecretKey)}
            >
              {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-cyber-foreground/60">
            The secret key from your Cloudflare Turnstile widget (stored securely)
          </p>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-cyber-muted/30 rounded-lg">
        <h3 className="text-sm font-medium mb-2">How to get your Cloudflare Turnstile keys:</h3>
        <ol className="text-xs text-cyber-foreground/70 space-y-2 list-decimal pl-4">
          <li>
            Go to the{" "}
            <a
              href="https://dash.cloudflare.com/?to=/:account/turnstile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Cloudflare Dashboard
            </a>
          </li>
          <li>Navigate to Security → Turnstile</li>
          <li>Create a new site or select an existing one</li>
          <li>Create a new widget with the domains you want to protect</li>
          <li>Copy the Site Key and Secret Key provided</li>
          <li>Paste them into the fields above</li>
        </ol>
      </div>
    </div>
  )
}
