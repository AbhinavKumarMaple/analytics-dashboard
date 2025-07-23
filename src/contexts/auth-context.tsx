import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export interface AuthContextType {
  user: User;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Default user for development - allows anyone to use the site without login
const defaultUser: User = {
  id: "dev-user",
  email: "dev@panthera.com",
  name: "Development User",
  role: "admin",
  avatar: "",
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always provide the default user
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Mock login function that always succeeds
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set user based on email for different roles if needed
      if (email.includes("admin")) {
        setUser({ ...defaultUser, email, name: "Admin User", role: "admin" });
      } else if (email.includes("analyst")) {
        setUser({ ...defaultUser, email, name: "Analyst User", role: "analyst" });
      } else {
        setUser({ ...defaultUser, email, name: "Viewer User", role: "viewer" });
      }

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return true; // Still return true to allow access
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout that doesn't redirect
  const logout = () => {
    // Reset to default user instead of null
    setUser(defaultUser);
    // Don't redirect to login
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
