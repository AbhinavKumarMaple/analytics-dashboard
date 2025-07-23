"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import LayoutProvider from "@/components/layout/layout-provider";
import Chatbot from "@/components/ui/Chatbot";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-purple border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <LayoutProvider>
        {children}
        <Chatbot />
      </LayoutProvider>
    </AuthProvider>
  );
}
