import { verifyToken } from "./jwt";

/**
 * Check if the user is authenticated on the client side
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  // Verify token validity
  const decodedToken = verifyToken(token);
  return !!decodedToken;
}

/**
 * Get the current user's role
 */
export function getUserRole(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");
  if (!user) {
    return null;
  }

  try {
    const userData = JSON.parse(user);
    return userData.role;
  } catch {
    return null;
  }
}
