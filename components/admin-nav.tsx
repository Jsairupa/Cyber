"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Settings } from "lucide-react"

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="flex space-x-2 mb-6">
      <Link
        href="/admin/turnstile-config"
        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
          pathname === "/admin/turnstile-config"
            ? "bg-cyber-muted text-cyber-foreground"
            : "text-cyber-foreground/70 hover:bg-cyber-muted/50 hover:text-cyber-foreground"
        }`}
      >
        <Shield className="h-4 w-4 mr-2" />
        Turnstile Config
      </Link>

      <Link
        href="/admin"
        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
          pathname === "/admin"
            ? "bg-cyber-muted text-cyber-foreground"
            : "text-cyber-foreground/70 hover:bg-cyber-muted/50 hover:text-cyber-foreground"
        }`}
      >
        <Settings className="h-4 w-4 mr-2" />
        Admin Dashboard
      </Link>
    </div>
  )
}
