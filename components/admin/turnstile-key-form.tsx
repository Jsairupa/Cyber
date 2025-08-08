"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTurnstileSiteKey, updateTurnstileSiteKey } from "@/app/actions/turnstile"
import type { TurnstileSiteKey } from "@/lib/turnstile-schema"

interface TurnstileKeyFormProps {
  siteKey?: TurnstileSiteKey
  onSuccess?: (siteKey: TurnstileSiteKey) => void
  onCancel?: () => void
}

export default function TurnstileKeyForm({ siteKey, onSuccess, onCancel }: TurnstileKeyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const isEditing = !!siteKey

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (isEditing) {
        // Update existing site key
        formData.append("id", siteKey.id)
        const result = await updateTurnstileSiteKey(formData)

        if (result.success && result.siteKey) {
          onSuccess?.(result.siteKey)
        } else {
          setError(result.message || "Failed to update Turnstile site key")
        }
      } else {
        // Create new site key
        const result = await createTurnstileSiteKey(formData)

        if (result.success && result.siteKey) {
          onSuccess?.(result.siteKey)
        } else {
          setError(result.message || "Failed to create Turnstile site key")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
      <h2 className="text-xl font-display font-bold mb-6">
        {isEditing ? "Edit Turnstile Site Key" : "Create New Turnstile Site Key"}
      </h2>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Key Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={siteKey?.name || ""}
            placeholder="e.g., Production Turnstile Key"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="environment">Environment</Label>
          <select
            id="environment"
            name="environment"
            defaultValue={siteKey?.environment || "production"}
            className="w-full bg-cyber-muted/50 border border-cyber-border rounded-md px-3 py-2 text-sm"
            disabled={isSubmitting}
            required
          >
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            name="domain"
            defaultValue={siteKey?.domain || ""}
            placeholder="e.g., example.com"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-cyber-foreground/60">The domain where this Turnstile key will be used</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteKey">Site Key</Label>
          <Input
            id="siteKey"
            name="siteKey"
            defaultValue={siteKey?.siteKey || ""}
            placeholder="e.g., 0x4AAAAAAACdvRD3Uq..."
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-cyber-foreground/60">The public site key from Cloudflare Turnstile</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretKey">Secret Key</Label>
          <Input
            id="secretKey"
            name="secretKey"
            type="password"
            placeholder={isEditing ? "••••••••" : "e.g., 0x4AAAAAAACdvRGFLp..."}
            required={!isEditing}
            disabled={isSubmitting}
          />
          <p className="text-xs text-cyber-foreground/60">
            {isEditing ? "Leave blank to keep the current secret key" : "The secret key from Cloudflare Turnstile"}
          </p>
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="active"
                name="isActive"
                value="true"
                defaultChecked={siteKey.isActive}
                disabled={isSubmitting}
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active
              </Label>

              <input
                type="radio"
                id="inactive"
                name="isActive"
                value="false"
                defaultChecked={!siteKey.isActive}
                className="ml-4"
                disabled={isSubmitting}
              />
              <Label htmlFor="inactive" className="cursor-pointer">
                Inactive
              </Label>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : isEditing ? "Update Key" : "Create Key"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
