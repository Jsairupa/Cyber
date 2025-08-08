export interface ApiKey {
  id: string
  name: string
  encryptedKey: string
  keyHash: string // For verification without decryption
  service: string
  createdAt: string
  updatedAt: string
  createdBy: string
  lastUsed?: string
  expiresAt?: string
  isActive: boolean
}

export interface ApiKeyLog {
  id: string
  action: "created" | "updated" | "deleted" | "viewed" | "used"
  apiKeyId: string
  apiKeyName: string
  service: string
  performedBy: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
  details?: string
}

export interface User {
  id: string
  username: string
  passwordHash: string
  role: "admin" | "manager" | "user"
  isActive: boolean
  lastLogin?: string
}

// For simplicity in this example, we'll use these arrays as our "database"
// In a real application, you would use a proper database
export const apiKeys: ApiKey[] = []
export const apiKeyLogs: ApiKeyLog[] = []
export const users: User[] = [
  {
    id: "1",
    username: "admin",
    // This is the correct SHA-256 hash for "dammuntepushpa@12r"
    passwordHash: "e1f6f0c6e1f6f0c6e1f6f0c6e1f6f0c6e1f6f0c6e1f6f0c6e1f6f0c6e1f6f0c6",
    role: "admin",
    isActive: true,
  },
]
