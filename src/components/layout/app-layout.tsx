"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useNavigationStore } from "@/store/navigation-store";
import Header from "./header";
import Sidebar from "./sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  useAuth();
  const pathname = usePathname();

  // ✅ Call hook only once
  const { closeAllMenus, isMobileMenuOpen } = useNavigationStore();

  useEffect(() => {
    closeAllMenus();
  }, [pathname, closeAllMenus]);

  return (
    <div className="bg-background-start flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
        {/* <footer className="border-t border-gray-200 p-4 text-center text-sm">
          <p>© {new Date().getFullYear()} PANTHERA Analytics. All rights reserved.</p>
        </footer> */}
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeAllMenus}
        aria-hidden="true"
      />
    </div>
  );
};

export default AppLayout;
