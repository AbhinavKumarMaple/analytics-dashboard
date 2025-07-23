"use client";

import React from "react";
import AppLayout from "@/components/layout/app-layout";
import ProtectedRoute from "@/components/auth/protected-route";
import MobileNav from "@/components/layout/mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
      <MobileNav />
    </ProtectedRoute>
  );
}
