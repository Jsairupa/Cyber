import EnvConfig from "@/components/env-config"

export const metadata = {
  title: "Environment Variables | Cybersecurity Portfolio",
  description: "Configure environment variables for your portfolio",
}

export default function EnvConfigPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Environment <span className="text-gradient">Variables</span>
          </h1>
          <p className="text-cyber-foreground/70 max-w-2xl mx-auto">
            Update environment variables for your portfolio, including Cloudflare Turnstile keys.
          </p>
        </div>

        <EnvConfig />
      </div>
    </div>
  )
}
