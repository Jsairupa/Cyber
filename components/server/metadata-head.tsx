// This is a server component for handling metadata and head elements
import type { Metadata } from "next"

interface MetadataHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
}

export function generateMetadata({
  title = "Cybersecurity Portfolio",
  description = "A showcase of cybersecurity expertise and projects",
  keywords = "cybersecurity, security researcher, penetration testing, security analysis",
  ogImage = "/og-image.png",
}: MetadataHeadProps): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function MetadataHead({
  title = "Cybersecurity Portfolio",
  description = "A showcase of cybersecurity expertise and projects",
}: MetadataHeadProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <link rel="preload" href="/fonts/ClashDisplay-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </>
  )
}
