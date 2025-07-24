"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!isLoading && user) {
      router.push("/acquisition");
    }
  }, [user, isLoading, router]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-5"></div>
      <div className="relative z-10 flex h-16 items-center justify-center border-b bg-white/80 backdrop-blur-sm dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-primary-purple">PANTHERA</h1>
      </div>
      <div className="relative z-20">{children}</div>
    </div>
  );
}
