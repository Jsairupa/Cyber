export interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval: number
}

export function rateLimit(options: RateLimitOptions) {
  const { interval, uniqueTokenPerInterval } = options
  const tokenCache = new Map<string, number[]>()

  return {
    check: (res: Response, limit: number, token: string): Promise<void> => {
      const now = Date.now()
      const windowStart = now - interval

      const tokenCount = tokenCache.get(token) || []
      const validTokens = tokenCount.filter((timestamp) => timestamp > windowStart)

      tokenCache.set(token, [...validTokens, now])

      const maxTokens = limit

      // Cleanup old tokens periodically
      if (tokenCache.size > uniqueTokenPerInterval) {
        const oldestToken = [...tokenCache.entries()].sort((a, b) => a[1][0] - b[1][0])[0][0]
        tokenCache.delete(oldestToken)
      }

      if (validTokens.length >= maxTokens) {
        return Promise.reject(new Error("Rate limit exceeded"))
      }

      return Promise.resolve()
    },
  }
}
