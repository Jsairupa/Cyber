import type React from "react"
import "./globals.css"
import "./turnstile-styles.css"
import { Inter, JetBrains_Mono, Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import type { Metadata } from "next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-clash-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Cybersecurity Portfolio",
    default: "Cybersecurity Portfolio",
  },
  description: "A showcase of cybersecurity expertise and projects",
  keywords: ["cybersecurity", "security researcher", "penetration testing", "security analysis"],
  authors: [{ name: "Rahul Itha" }],
  creator: "Rahul Itha",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Cybersecurity Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cybersecurity Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rahul0x0510",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png" }],
    shortcut: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/ClashDisplay-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div className="min-h-screen bg-cyber-background"></div>}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
