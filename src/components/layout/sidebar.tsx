"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/navigation-store";
import { NavigationItem, navigationItems, secondaryNavigationItems } from "@/config/navigation";
import logo from "../../../public/logo.png";
import darklogo from "../../../public/darklogo.png";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();
  const { isMobileMenuOpen, toggleExpandedItem, isItemExpanded } = useNavigationStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to check for dark mode and set up observer
  useEffect(() => {
    // Initial check
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Set up a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Clean up
    return () => observer.disconnect();
  }, []);

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive =
      pathname === item.href ||
      (item.children && item.children.some((child) => pathname === child.href));
    const isExpanded = isItemExpanded(item.id);
    const IconComponent = item.icon as React.FC<React.SVGProps<SVGSVGElement>>;

    if (item.children) {
      return (
        <li key={item.id}>
          <button
            onClick={() => toggleExpandedItem(item.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-primary-purple text-white" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center">
              {IconComponent && (
                <IconComponent
                  className={cn(
                    "mr-2 h-4 w-4",
                    isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
                  )}
                />
              )}
              <span>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <ul className="mt-1 space-y-1 pl-6">
              {item.children.map((child) => {
                const isChildActive = pathname === child.href;
                const ChildIconComponent = child.icon as React.FC<React.SVGProps<SVGSVGElement>>;

                return (
                  <li key={child.id}>
                    <Link
                      href={child.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                        isChildActive
                          ? "bg-primary-purple text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {ChildIconComponent && (
                        <ChildIconComponent
                          className={cn(
                            "mr-2 h-4 w-4",
                            isChildActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                      )}
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.id}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive ? "bg-primary-purple text-white" : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform  bg-white shadow-sm transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900 md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      <div className="flex h-16 items-center justify-center px-4 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center">
          {isDarkMode ? (
            <Image src={darklogo} alt="Panthera Logo" />
          ) : (
            <Image src={logo} alt="Panthera Logo" />
          )}
          {/* <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Panthera</span> */}
        </Link>
      </div>

      <div className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm focus:border-primary-purple focus:ring-primary-purple dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <button
                    onClick={() => toggleExpandedItem(item.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href ||
                        (item.children && item.children.some((child) => pathname === child.href))
                        ? "border-l-4 border-blue-600 bg-gray-100 pl-2 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="mr-2 h-4 w-4 fill-[#4318ff]" />}
                      <span>{item.label}</span>
                    </div>
                    {isItemExpanded(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "border-l-4 border-blue-600 bg-gray-100 pl-2 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.label}
                  </Link>
                )}
                {isItemExpanded(item.id) && item.children && (
                  <ul className="mt-1 space-y-1 pl-6">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                            pathname === child.href
                              ? "border-l-4 border-blue-600 bg-gray-100 pl-2 text-gray-900 dark:bg-gray-800 dark:text-white"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          )}
                        >
                          {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {secondaryNavigationItems.length > 0 && (
            <>
              <div className="my-4 h-px bg-gray-200 dark:bg-gray-700" />
              <ul className="space-y-1">
                {secondaryNavigationItems.map((item) => (
                  <li key={item.id}>
                    {item.children ? (
                      <button
                        onClick={() => toggleExpandedItem(item.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname === item.href ||
                            (item.children &&
                              item.children.some((child) => pathname === child.href))
                            ? "border-l-4 border-blue-600 bg-gray-100 pl-2 text-gray-900 dark:bg-gray-800 dark:text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        )}
                      >
                        <div className="flex items-center">
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          <span>{item.label}</span>
                        </div>
                        {isItemExpanded(item.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "border-l-4 border-blue-600 bg-gray-100 pl-2 text-gray-900 dark:bg-gray-800 dark:text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        )}
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.label}
                      </Link>
                    )}
                    {isItemExpanded(item.id) && item.children && (
                      <ul className="mt-1 space-y-1 pl-6">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                                pathname === child.href
                                  ? "border-l-4 border-blue-600 bg-gray-100 pl-2 text-gray-900 dark:bg-gray-800 dark:text-white"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                              )}
                            >
                              {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-white">PANTHERA Analytics</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
          </div>
        </div> */}
      </div>
    </aside>
  );
};

export default Sidebar;
