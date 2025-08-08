import { z } from "zod"

// Schema for Turnstile site key
export const turnstileSiteKeySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  environment: z.enum(["development", "staging", "production"]),
  siteKey: z.string().min(1, "Site key is required"),
  secretKey: z.string().min(1, "Secret key is required"),
  domain: z.string().min(1, "Domain is required"),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string(),
  lastUsed: z.string().datetime().optional(),
})

// Type for Turnstile site key
export type TurnstileSiteKey = z.infer<typeof turnstileSiteKeySchema>

// Schema for Turnstile site key creation
export const createTurnstileSiteKeySchema = turnstileSiteKeySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  lastUsed: true,
})

// Type for Turnstile site key creation
export type CreateTurnstileSiteKey = z.infer<typeof createTurnstileSiteKeySchema>

// Schema for Turnstile site key update
export const updateTurnstileSiteKeySchema = turnstileSiteKeySchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    lastUsed: true,
  })
  .partial()

// Type for Turnstile site key update
export type UpdateTurnstileSiteKey = z.infer<typeof updateTurnstileSiteKeySchema>

// Schema for Turnstile verification
export const turnstileVerificationSchema = z.object({
  success: z.boolean(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  error_codes: z.array(z.string()).optional(),
  action: z.string().optional(),
  cdata: z.string().optional(),
})

// Type for Turnstile verification
export type TurnstileVerification = z.infer<typeof turnstileVerificationSchema>

// Schema for Turnstile log
export const turnstileLogSchema = z.object({
  id: z.string().uuid(),
  siteKeyId: z.string().uuid(),
  action: z.enum(["created", "updated", "deleted", "viewed", "used"]),
  success: z.boolean(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.string().datetime(),
  performedBy: z.string(),
  details: z.string().optional(),
})

// Type for Turnstile log
export type TurnstileLog = z.infer<typeof turnstileLogSchema>

// Schema for Turnstile analytics
export const turnstileAnalyticsSchema = z.object({
  id: z.string().uuid(),
  siteKeyId: z.string().uuid(),
  date: z.string().datetime(),
  totalVerifications: z.number().int().nonnegative(),
  successfulVerifications: z.number().int().nonnegative(),
  failedVerifications: z.number().int().nonnegative(),
  averageResponseTime: z.number().nonnegative().optional(),
})

// Type for Turnstile analytics
export type TurnstileAnalytics = z.infer<typeof turnstileAnalyticsSchema>
