import { hashValue } from "./encryption"
import { users, type User } from "./db-schema"

export class AuthService {
  /**
   * Authenticates a user by username and password
   */
  static async authenticateUser(username: string, password: string): Promise<User | null> {
    // Hash the password for comparison
    const passwordHash = hashValue(password)

    // Find the user
    const user = users.find((u) => u.username === username && u.passwordHash === passwordHash && u.isActive)

    if (user) {
      // Update last login timestamp
      user.lastLogin = new Date().toISOString()
    }

    return user || null
  }

  /**
   * Checks if a user has the required role
   */
  static hasRole(user: User, requiredRole: User["role"]): boolean {
    const roleHierarchy = {
      admin: 3,
      manager: 2,
      user: 1,
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }
}
