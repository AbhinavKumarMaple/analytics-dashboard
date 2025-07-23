"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigationStore } from "@/store/navigation-store";
import { navigationItems } from "@/config/navigation";

interface MobileNavProps {
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen, toggleExpandedItem, isItemExpanded } =
    useNavigationStore();

  if (!isMobileMenuOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 top-0 z-50 flex h-full w-full flex-col bg-white dark:bg-gray-800",
        className
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-4">
        <h2 className="text-lg font-bold text-primary-purple">PANTHERA</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <nav className="space-y-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const isExpanded = isItemExpanded(item.id);

            return (
              <div key={item.id} className="space-y-2">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpandedItem(item.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-primary-purple/10 text-primary-purple"
                          : "text-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {item.label}
                      <span className="ml-2">{isExpanded ? "−" : "+"}</span>
                    </button>
                    {isExpanded && (
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm",
                              pathname === child.href
                                ? "bg-primary-purple/10 font-medium text-primary-purple"
                                : "text-gray-400 hover:bg-gray-100"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-primary-purple/10 text-primary-purple"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
