"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "analyst" | "viewer";
}

/**
 * A component that would normally protect routes by requiring authentication,
 * but for development purposes, it simply renders the children
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // We're using the auth context but not enforcing any restrictions
  const { isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-purple border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Always render children regardless of authentication status
  return <>{children}</>;
}
