"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertTriangle, Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiKeyLogs } from "@/app/actions/api-keys"
import type { ApiKeyLog } from "@/lib/db-schema"

export default function ApiKeyLogs() {
  const [logs, setLogs] = useState<ApiKeyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    apiKeyId: "",
    service: "",
    action: "",
    from: "",
    to: "",
  })

  // Load logs
  const loadLogs = async () => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    if (filters.apiKeyId) formData.append("apiKeyId", filters.apiKeyId)
    if (filters.service) formData.append("service", filters.service)
    if (filters.action) formData.append("action", filters.action as any)
    if (filters.from) formData.append("from", filters.from)
    if (filters.to) formData.append("to", filters.to)

    try {
      const result = await getApiKeyLogs(formData)

      if (result.success && result.logs) {
        setLogs(result.logs)
      } else {
        setError(result.message || "Failed to load API key logs")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Load logs on mount
  useEffect(() => {
    loadLogs()
  }, [])

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Handle filter submit
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loadLogs()
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Get action badge color
  const getActionColor = (action: ApiKeyLog["action"]) => {
    switch (action) {
      case "created":
        return "bg-green-500/20 text-green-400"
      case "updated":
        return "bg-blue-500/20 text-blue-400"
      case "deleted":
        return "bg-red-500/20 text-red-400"
      case "viewed":
        return "bg-purple-500/20 text-purple-400"
      case "used":
        return "bg-amber-500/20 text-amber-400"
      default:
        return "bg-cyber-muted/50 text-cyber-foreground/70"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">API Key Audit Logs</h1>
        <Button variant="outline" onClick={loadLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
        <h2 className="text-lg font-medium mb-4">Filter Logs</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="apiKeyId">API Key ID</Label>
            <Input
              id="apiKeyId"
              name="apiKeyId"
              value={filters.apiKeyId}
              onChange={handleFilterChange}
              placeholder="Filter by key ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              name="service"
              value={filters.service}
              onChange={handleFilterChange}
              placeholder="Filter by service"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <select
              id="action"
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full bg-cyber-muted/50 border border-cyber-border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="viewed">Viewed</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From Date</Label>
            <Input id="from" name="from" type="date" value={filters.from} onChange={handleFilterChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To Date</Label>
            <Input id="to" name="to" type="date" value={filters.to} onChange={handleFilterChange} />
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </form>
      </div>

      {/* Logs table */}
      <div className="glass-card rounded-lg border border-cyber-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-cyber-foreground/70">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-cyber-foreground/70">No logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyber-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    API Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Performed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-cyber-muted/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(log.timestamp)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
                      >
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{log.apiKeyName}</div>
                      <div className="text-xs text-cyber-foreground/60">
                        {log.apiKeyId === "all" ? "All Keys" : `ID: ${log.apiKeyId.substring(0, 8)}...`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.performedBy}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-cyber-foreground/70 max-w-md truncate">
                        {log.details || "No details provided"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
