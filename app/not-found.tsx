"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-background p-4">
      <div className="glass-card rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-6xl font-display font-bold mb-2 text-gradient">404</h1>
        <h2 className="text-2xl font-display font-medium mb-6">Page Not Found</h2>

        <p className="mb-8 text-cyber-foreground/70">The page you're looking for doesn't exist or has been moved.</p>

        <div className="flex flex-col gap-4">
          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>
          </Button>

          <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
