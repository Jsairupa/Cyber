import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-background p-4">
      <div className="glass-card rounded-lg p-8 border border-cyber-border-hover shadow-xl max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-amber-500/20">
            <AlertTriangle className="h-12 w-12 text-amber-400" />
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold mb-4">Access Denied</h1>

        <p className="text-cyber-foreground/70 mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an
          error.
        </p>

        <div className="flex flex-col space-y-4">
          <Link href="/admin/login">
            <Button variant="outline" className="w-full">
              Return to Login
            </Button>
          </Link>

          <Link href="/">
            <Button className="w-full">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
