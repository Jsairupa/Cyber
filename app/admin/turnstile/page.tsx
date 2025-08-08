import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/encryption"
import TurnstileKeyList from "@/components/admin/turnstile-key-list"

export default function TurnstilePage() {
  // Check if user is authenticated
  const sessionCookie = cookies().get("session")?.value

  if (!sessionCookie) {
    redirect("/admin/login")
  }

  try {
    const sessionData = JSON.parse(decrypt(sessionCookie))

    // Check if session is expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      cookies().delete("session")
      redirect("/admin/login")
    }

    // Check if user has admin role
    if (sessionData.user.role !== "admin") {
      redirect("/admin/unauthorized")
    }
  } catch (error) {
    console.error("Failed to decrypt session:", error)
    cookies().delete("session")
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-cyber-background p-6">
      <div className="max-w-6xl mx-auto">
        <TurnstileKeyList />
      </div>
    </div>
  )
}
