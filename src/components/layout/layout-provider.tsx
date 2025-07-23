"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/store/navigation-store";

interface LayoutProviderProps {
  children: React.ReactNode;
}

/**
 * Layout Provider component that handles global layout state
 * and provides context for layout-related functionality
 */
export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const { closeAllMenus } = useNavigationStore();

  // Reset navigation state on route changes
  useEffect(() => {
    closeAllMenus();
  }, [pathname, closeAllMenus]);

  // Handle escape key to close menus
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeAllMenus]);

  return <>{children}</>;
};

export default LayoutProvider;
