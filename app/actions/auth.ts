"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AuthService } from "@/lib/auth-service"
import { encrypt } from "@/lib/encryption"

// Login action
export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return {
      success: false,
      message: "Username and password are required",
    }
  }

  try {
    const user = await AuthService.authenticateUser(username, password)

    if (!user) {
      return {
        success: false,
        message: "Invalid username or password",
      }
    }

    // Create a session
    const sessionData = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    // Encrypt the session data
    const encryptedSession = encrypt(JSON.stringify(sessionData))

    // Set the session cookie
    cookies().set({
      name: "session",
      value: encryptedSession,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return {
      success: true,
      user: {
        username: user.username,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    }
  }
}

// Logout action
export async function logout() {
  cookies().delete("session")
  redirect("/admin/login")
}
