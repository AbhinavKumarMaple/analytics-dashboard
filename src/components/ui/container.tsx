import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the container
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * Whether to center the container
   */
  centered?: boolean;
}

/**
 * Container component for consistent layout spacing
 */
export function Container({
  className,
  maxWidth = "xl",
  centered = true,
  children,
  ...props
}: ContainerProps) {
  // Map the maxWidth value to the corresponding Tailwind class
  const maxWidthClass = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  }[maxWidth];

  return (
    <div
      className={cn("w-full px-4 sm:px-6 lg:px-8", maxWidthClass, centered && "mx-auto", className)}
      {...props}
    >
      {children}
    </div>
  );
}
