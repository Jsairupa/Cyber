import TurnstileKeyConfig from "@/components/admin/turnstile-key-config"

export const metadata = {
  title: "Turnstile Keys | Cybersecurity Portfolio",
  description: "Configure Cloudflare Turnstile keys for your portfolio",
}

export default function TurnstileKeysPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Turnstile <span className="text-gradient">Keys</span>
          </h1>
          <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
            Update your Cloudflare Turnstile keys to enable secure resume downloads with bot protection.
          </p>
        </div>

        <TurnstileKeyConfig />
      </div>
    </div>
  )
}
