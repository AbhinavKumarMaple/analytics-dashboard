import * as React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the divider
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Whether to add spacing around the divider
   */
  spacing?: boolean;
  /**
   * Optional label for the divider
   */
  label?: string;
}

/**
 * Divider component for separating content
 */
export function Divider({
  className,
  orientation = "horizontal",
  spacing = false,
  label,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div className={cn("h-full w-px bg-gray-200", spacing && "mx-4", className)} {...props} />
    );
  }

  if (label) {
    return (
      <div className={cn("flex w-full items-center", spacing && "my-6", className)} {...props}>
        <div className="h-px flex-1 bg-gray-200" />
        <span className="px-3 text-sm text-gray-500">{label}</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    );
  }

  return <div className={cn("h-px w-full bg-gray-200", spacing && "my-6", className)} {...props} />;
}
