import { NextResponse, type NextRequest } from "next/server"
import { rateLimit } from "./lib/rate-limit"
import { decrypt } from "./lib/encryption"

// Rate limiter for API routes and form submissions
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per interval
})

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add the current pathname to the request headers so we can access it in the layout
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  // Skip auth check for login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Check if user is authenticated for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("session")?.value

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      const sessionData = JSON.parse(decrypt(sessionCookie))

      // Check if session is expired
      if (new Date(sessionData.expiresAt) < new Date()) {
        const response = NextResponse.redirect(new URL("/admin/login", request.url))
        response.cookies.delete("session")
        return response
      }

      // For logs page, check if user has admin or manager role
      if (
        request.nextUrl.pathname === "/admin/logs" &&
        sessionData.user.role !== "admin" &&
        sessionData.user.role !== "manager"
      ) {
        return NextResponse.redirect(new URL("/admin/unauthorized", request.url))
      }

      // For API keys page, check if user has admin role
      if (request.nextUrl.pathname === "/admin/api-keys" && sessionData.user.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/unauthorized", request.url))
      }
    } catch (error) {
      console.error("Failed to decrypt session:", error)
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("session")
      return response
    }
  }

  // Apply rate limiting to API routes and form submissions
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    (request.method === "POST" && !request.nextUrl.pathname.startsWith("/_next"))
  ) {
    try {
      const ip = request.ip ?? "anonymous"
      await limiter.check(response, 20, ip) // 20 requests per minute per IP
    } catch {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
  }

  // Add security headers to all responses
  const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://www.google.com/recaptcha/;
    font-src 'self';
    connect-src 'self';
    frame-src https://www.google.com/recaptcha/;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `

  // Set security headers
  const securityHeaders = {
    "Content-Security-Policy": ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
    "X-XSS-Protection": "1; mode=block",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    "/admin/:path*",
    // Apply to all paths except static files and API routes that handle their own security
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
}
