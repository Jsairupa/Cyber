"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertTriangle, Search, RefreshCw, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTurnstileAnalytics } from "@/app/actions/turnstile"
import type { TurnstileAnalytics } from "@/lib/turnstile-schema"

export default function TurnstileAnalyticsComponent() {
  const [analytics, setAnalytics] = useState<TurnstileAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    from: "",
    to: "",
  })

  // Load analytics
  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    if (filters.from) formData.append("from", filters.from)
    if (filters.to) formData.append("to", filters.to)

    try {
      const result = await getTurnstileAnalytics(formData)

      if (result.success && result.analytics) {
        setAnalytics(result.analytics)
      } else {
        setError(result.message || "Failed to load Turnstile analytics")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics()
  }, [])

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Handle filter submit
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loadAnalytics()
  }

  // Calculate totals
  const totals = analytics.reduce(
    (acc, item) => {
      acc.totalVerifications += item.totalVerifications
      acc.successfulVerifications += item.successfulVerifications
      acc.failedVerifications += item.failedVerifications
      return acc
    },
    { totalVerifications: 0, successfulVerifications: 0, failedVerifications: 0 },
  )

  // Calculate success rate
  const successRate =
    totals.totalVerifications > 0
      ? ((totals.successfulVerifications / totals.totalVerifications) * 100).toFixed(2)
      : "0.00"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">Turnstile Analytics</h1>
        <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
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
        <h2 className="text-lg font-medium mb-4">Filter Analytics</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Total Verifications</h3>
            <div className="p-2 rounded-full bg-primary/20">
              <BarChart2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{totals.totalVerifications.toLocaleString()}</p>
        </div>

        <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Success Rate</h3>
            <div className="p-2 rounded-full bg-green-500/20">
              <div className="h-5 w-5 text-green-400 flex items-center justify-center font-bold">%</div>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{successRate}%</p>
        </div>

        <div className="glass-card rounded-lg p-6 border border-cyber-border-hover">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Failed Verifications</h3>
            <div className="p-2 rounded-full bg-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{totals.failedVerifications.toLocaleString()}</p>
        </div>
      </div>

      {/* Analytics table */}
      <div className="glass-card rounded-lg border border-cyber-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-cyber-foreground/70">Loading analytics...</p>
          </div>
        ) : analytics.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-cyber-foreground/70">No analytics data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyber-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Successful
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Failed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyber-foreground/70 uppercase tracking-wider">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border">
                {analytics.map((item) => {
                  const date = new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })

                  const itemSuccessRate =
                    item.totalVerifications > 0
                      ? ((item.successfulVerifications / item.totalVerifications) * 100).toFixed(2)
                      : "0.00"

                  return (
                    <tr key={item.id} className="hover:bg-cyber-muted/20">
                      <td className="px-6 py-4 whitespace-nowrap">{date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.totalVerifications.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.successfulVerifications.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.failedVerifications.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-cyber-muted/50 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${itemSuccessRate}%` }}
                            ></div>
                          </div>
                          <span>{itemSuccessRate}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
