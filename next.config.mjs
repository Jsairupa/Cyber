/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Enable compression
  compress: true,
  
  // Enable static exports for specific paths
  output: 'standalone',
  
  // Optimize for production
  productionBrowserSourceMaps: false,
  
  // Configure headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/resume.pdf/page',
        destination: '/resume',
        permanent: true,
      },
    ]
  },
  
  // Configure rewrites
  async rewrites() {
    return [
      {
        source: '/resume',
        destination: '/resume.pdf/page',
      },
    ]
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: true,
    // Optimize packages
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default nextConfig
