import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/encryption"
import TurnstileConfigForm from "@/components/admin/turnstile-config-form"

export const metadata = {
  title: "Security Configuration | Cybersecurity Portfolio",
  description: "Configure security settings for your portfolio",
}

export default function ConfigPage() {
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-display font-bold mb-6">Security Configuration</h1>
        <TurnstileConfigForm />
      </div>
    </div>
  )
}
