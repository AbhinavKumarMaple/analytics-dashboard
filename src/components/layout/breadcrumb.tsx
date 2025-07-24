"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { navigationItems } from "@/config/navigation";

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment !== "");
    let currentPath = "";
    const items = [{ label: "Pages", href: "/market" }]; // Base "Pages" link

    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      let foundItem: any = null;

      // Search in main navigation items
      for (const navItem of navigationItems) {
        if (navItem.href === currentPath) {
          foundItem = navItem;
          break;
        }
        if (navItem.children) {
          for (const childItem of navItem.children) {
            if (childItem.href === currentPath) {
              foundItem = childItem;
              break;
            }
          }
        }
        if (foundItem) break;
      }

      if (foundItem) {
        items.push({ label: foundItem.label, href: foundItem.href });
      } else {
        // Fallback for dynamic segments or unconfigured routes
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        items.push({ label, href: currentPath });
      }
    });

    // If no specific page is matched, default to Dashboard
    if (items.length === 1 && pathname === "/") {
      items.push({ label: "Dashboard", href: "/market" });
    } else if (items.length === 1 && pathname === "/market") {
      items.push({ label: "Dashboard", href: "/market" });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="mx-2 h-3 w-3 text-gray-400 rtl:rotate-180" />}
            {index === breadcrumbItems.length - 1 ? (
              <span className=" text-[9px] font-medium text-gray-500 dark:text-gray-200 md:text-sm">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className=" text-[9px] font-medium text-gray-700 hover:text-primary-purple dark:text-gray-400 md:text-sm"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
