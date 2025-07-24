import { sign, verify } from "jsonwebtoken";
import { User } from "@/types";

// Secret key for JWT signing and verification
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Token expiration time (7 days)
const EXPIRES_IN = "7d";

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: Partial<User>): string {
  return sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Set authentication token in cookies and localStorage
 */
export function setAuthToken(token: string): void {
  // Set in localStorage for client-side access
  localStorage.setItem("token", token);

  // Set in cookie for server-side access (middleware)
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
}

/**
 * Clear authentication token from cookies and localStorage
 */
export function clearAuthToken(): void {
  localStorage.removeItem("token");
  document.cookie = "token=; path=/; max-age=0";
}
