"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Trash2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllApiKeys, deleteApiKey } from "@/app/actions/api-keys"
import type { ApiKey } from "@/lib/db-schema"
import ApiKeyForm from "./api-key-form"

export default function ApiKeyList() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load API keys
  const loadApiKeys = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAllApiKeys()

      if (result.success && result.apiKeys) {
        setApiKeys(result.apiKeys)
      } else {
        setError(result.message || "Failed to load API keys")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Load API keys on mount
  useEffect(() => {
    loadApiKeys()
  }, [])

  // Handle API key deletion
  const handleDelete = async (id: string) => {
    setDeleteError(null)

    const formData = new FormData()
    formData.append("id", id)

    try {
      const result = await deleteApiKey(formData)

      if (result.success) {
        setApiKeys(apiKeys.filter((key) => key.id !== id))
        setShowDeleteConfirm(null)
        showSuccess("API key deleted successfully")
      } else {
        setDeleteError(result.message || "Failed to delete API key")
      }
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "An unexpected error occurred")
    }
  }

  // Show success message with auto-dismiss
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  // Handle API key creation/update success
  const handleKeySuccess = (apiKey: ApiKey, rawKey?: string) => {
    if (editingKey) {
      // Update existing key in the list
      setApiKeys(apiKeys.map((key) => (key.id === apiKey.id ? apiKey : key)))
      setEditingKey(null)
      showSuccess(rawKey ? "API key rotated successfully" : "API key updated successfully")
    } else {
      // Add new key to the list
      setApiKeys([...apiKeys, apiKey])
      setIsCreating(false)
      showSuccess("API key created successfully")
    }
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status badge
  const getStatusBadge = (apiKey: ApiKey) => {
    if (!apiKey.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </span>
      )
    }

    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expired
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Active
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">API Key Management</h1>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          Create New API Key
        </Button>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center"
          >
            <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-400">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Create/Edit form */}
      <AnimatePresence>
        {(isCreating || editingKey) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ApiKeyForm
              apiKey={editingKey || undefined}
              onSuccess={handleKeySuccess}
              onCancel={() => {
                setIsCreating(false)
                setEditingKey(null)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* API key list */}
      <div className="glass-card rounded-lg border border-cyber-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-cyber-foreground/70">Loading API keys...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-cyber-foreground/70">No API keys found</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsCreating(true)}>
              Create your first API key
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyber-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-cyber-muted/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{apiKey.name}</div>
                      <div className="text-xs text-cyber-foreground/60">ID: {apiKey.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{apiKey.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(apiKey)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(apiKey.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {apiKey.expiresAt ? formatDate(apiKey.expiresAt) : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showDeleteConfirm === apiKey.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-xs text-red-400">Confirm?</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                            onClick={() => handleDelete(apiKey.id)}
                          >
                            Yes
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(null)}>
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyber-foreground/70 hover:text-cyber-foreground"
                            onClick={() => setEditingKey(apiKey)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-500 hover:bg-red-500/20"
                            onClick={() => setShowDeleteConfirm(apiKey.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-400">{deleteError}</p>
        </div>
      )}
    </div>
  )
}
