import type React from "react"
import { cookies, headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Key, FileText, LogOut, Shield, BarChart2, Settings } from "lucide-react"
import { decrypt } from "@/lib/encryption"
import { logout } from "@/app/actions/auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip auth check for login page
  const pathname = headers().get("x-pathname") || ""
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Check if user is authenticated
  const sessionCookie = cookies().get("session")?.value

  if (!sessionCookie) {
    redirect("/admin/login")
  }

  let user
  try {
    const sessionData = JSON.parse(decrypt(sessionCookie))

    // Check if session is expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      cookies().delete("session")
      redirect("/admin/login")
    }

    user = sessionData.user
  } catch (error) {
    console.error("Failed to decrypt session:", error)
    cookies().delete("session")
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-cyber-background flex flex-col">
      {/* Header */}
      <header className="bg-cyber-card/80 backdrop-blur-md border-b border-cyber-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/api-keys" className="text-xl font-display font-bold text-gradient">
                  Security Admin
                </Link>
              </div>
              <nav className="ml-6 flex space-x-4 items-center">
                <Link
                  href="/admin/api-keys"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/api-keys"
                      ? "bg-cyber-muted text-cyber-foreground"
                      : "text-cyber-foreground/70 hover:bg-cyber-muted/50 hover:text-cyber-foreground"
                  }`}
                >
                  <Key className="h-4 w-4 inline-block mr-1" />
                  API Keys
                </Link>
                <Link
                  href="/admin/logs"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/logs"
                      ? "bg-cyber-muted text-cyber-foreground"
                      : "text-cyber-foreground/70 hover:bg-cyber-muted/50 hover:text-cyber-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4 inline-block mr-1" />
                  Audit Logs
                </Link>
                <Link
                  href="/admin/turnstile"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/turnstile"
                      ? "bg-cyber-muted text-cyber-foreground"
                      : "text-cyber-foreground/70 hover:bg-cyber-muted/50 hover:text-cyber-foreground"
                  }`}
                >
                  <Shield className="h-4 w-4 inline-block mr-1" />
                  Turnstile
                </Link>
                <Link
                  href="/admin/turnstile/analytics"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/turnstile/analytics"
                      ? "bg-cyber-muted text-cyber-foreground"
                      : "text-cyber-foreground/70 hover:bg-cyber-muted/50 hover:text-cyber-foreground"
                  }`}
                >
                  <BarChart2 className="h-4 w-4 inline-block mr-1" />
                  Analytics
                </Link>
                <Link
                  href="/admin/config"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/admin/config"
                      ? "bg-cyber-muted text-cyber-foreground"
                      : "text-cyber-foreground/70 hover:bg-cyber-muted/50 hover:text-cyber-foreground"
                  }`}
                >
                  <Settings className="h-4 w-4 inline-block mr-1" />
                  Config
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-sm text-cyber-foreground/70 mr-4">
                  Logged in as <span className="font-medium text-cyber-foreground">{user.username}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-cyber-muted/50">{user.role}</span>
                </span>
                <form action={logout}>
                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-cyber-foreground bg-cyber-muted/30 hover:bg-cyber-muted/50"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
