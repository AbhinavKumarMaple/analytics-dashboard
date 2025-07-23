"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Sun, Moon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigationStore } from "@/store/navigation-store";
import { Breadcrumb } from "./breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { isDarkMode, toggleTheme: theme } = useTheme();
  const { toggleMobileMenu, isUserMenuOpen, toggleUserMenu, setUserMenuOpen } =
    useNavigationStore();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenu = document.getElementById("user-menu");
      if (userMenu && !userMenu.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setUserMenuOpen]);

  // const [isDarkMode, setIsDarkMode] = React.useState(false); // State for theme toggle

  const toggleTheme = () => {
    theme();
    // Implement actual theme change logic here (e.g., add/remove dark class to body)
    // document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-transparent  pt-5 dark:border-gray-700">
      <div className="flex items-center">
        <Button
          onClick={toggleMobileMenu}
          variant="ghost"
          size="sm"
          className="mr-2 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
        {/* <Link href="/dashboard" className="mr-4 flex items-center">
          <Image
            src="/images/panthera-logo.svg" // Assuming you have a logo at this path
            alt="Panthera Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Panthera</span>
        </Link> */}
        <div className="ml-6">
          <Breadcrumb />
        </div>
      </div>

      <div className=" m-6 flex items-center space-x-3 rounded-xl bg-white p-2 dark:bg-gray-700">
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Settings">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative " id="user-menu">
          <Button
            onClick={toggleUserMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a2a2de]  p-0 text-white hover:bg-[#b0b0e0]"
            aria-label="User menu"
          >
            <span className="text-sm font-medium">{getUserInitials()}</span>
          </Button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700 dark:ring-gray-600">
              <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                <p className="mt-1 text-xs font-medium capitalize text-primary-purple dark:text-primary-purple-light">
                  {user?.role}
                </p>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Settings
              </a>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
