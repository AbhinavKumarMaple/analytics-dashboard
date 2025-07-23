import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ className, options, placeholder, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled className="text-gray-500 dark:text-gray-400">
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-gray-700 dark:text-white">
          {option.label}
        </option>
      ))}
    </select>
  );
}
