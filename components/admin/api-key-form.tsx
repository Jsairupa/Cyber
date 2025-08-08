"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Copy, Key, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApiKey, rotateApiKey, updateApiKey } from "@/app/actions/api-keys"
import type { ApiKey } from "@/lib/db-schema"

interface ApiKeyFormProps {
  apiKey?: ApiKey
  onSuccess?: (apiKey: ApiKey, rawKey?: string) => void
  onCancel?: () => void
}

export default function ApiKeyForm({ apiKey, onSuccess, onCancel }: ApiKeyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const isEditing = !!apiKey

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (isEditing) {
        // Update existing API key
        formData.append("id", apiKey.id)
        const result = await updateApiKey(formData)

        if (result.success && result.apiKey) {
          onSuccess?.(result.apiKey)
        } else {
          setError(result.message || "Failed to update API key")
        }
      } else {
        // Create new API key
        const result = await createApiKey(formData)

        if (result.success && result.apiKey) {
          setNewKey(result.rawKey)
          onSuccess?.(result.apiKey, result.rawKey)
        } else {
          setError(result.message || "Failed to create API key")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRotate = async () => {
    if (!apiKey) return

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append("id", apiKey.id)

    try {
      const result = await rotateApiKey(formData)

      if (result.success && result.apiKey) {
        setNewKey(result.rawKey)
        onSuccess?.(result.apiKey, result.rawKey)
      } else {
        setError(result.message || "Failed to rotate API key")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
      <h2 className="text-xl font-display font-bold mb-6">{isEditing ? "Edit API Key" : "Create New API Key"}</h2>

      {newKey && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-center mb-2">
            <Key className="h-5 w-5 text-green-400 mr-2" />
            <h3 className="font-medium text-green-400">New API Key Generated</h3>
          </div>
          <p className="text-sm text-cyber-foreground/80 mb-2">
            This key will only be shown once. Please copy it now and store it securely.
          </p>
          <div className="flex items-center">
            <code className="bg-cyber-muted/50 p-2 rounded font-mono text-sm flex-1 overflow-x-auto">{newKey}</code>
            <Button variant="outline" size="sm" className="ml-2" onClick={copyToClipboard} disabled={!newKey}>
              {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </motion.div>
      )}

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
            defaultValue={apiKey?.name || ""}
            placeholder="e.g., Production API Key"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Input
            id="service"
            name="service"
            defaultValue={apiKey?.service || ""}
            placeholder="e.g., Payment Gateway"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
          <Input
            id="expiresAt"
            name="expiresAt"
            type="date"
            defaultValue={apiKey?.expiresAt?.split("T")[0] || ""}
            disabled={isSubmitting}
          />
          <p className="text-xs text-cyber-foreground/60">
            Leave blank for a non-expiring key (not recommended for production)
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
                defaultChecked={apiKey.isActive}
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
                defaultChecked={!apiKey.isActive}
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

          {isEditing && (
            <Button
              type="button"
              variant="outline"
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/30"
              onClick={handleRotate}
              disabled={isSubmitting}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Rotate Key
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
