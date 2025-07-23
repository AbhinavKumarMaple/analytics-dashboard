import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

const cardVariants = cva("rounded-[20px] bg-white border transition-all duration-200", {
  variants: {
    variant: {
      default: "bg-white dark:bg-gray-800 border-gray-100  dark:border-gray-600",
      outline: "bg-transparent border-gray-200 p-6 dark:border-gray-700",
      elevated: "theme-bg border-transparent shadow-md p-6",
      interactive:
        "theme-bg border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 p-6 dark:border-gray-700 dark:hover:border-gray-600",
      // New variant for no padding, useful for tables or full-bleed content
      "no-padding": "theme-bg border-gray-200 shadow-sm dark:border-gray-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { children, ...rest } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between px-8 py-5", className)}
        {...rest}
      >
        {children}
        <div className="relative" ref={menuRef}>
          <button
            className="rounded-[20px] bg-[#F4F7FE] p-3 transition-colors dark:bg-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <MoreHorizontal className="text-[#4318ff] dark:text-gray-500" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-48  border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F4F7FE]"
                  onClick={() => {
                    console.log("Option 1 clicked");
                    setIsMenuOpen(false);
                  }}
                >
                  Option 1
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F4F7FE]"
                  onClick={() => {
                    console.log("Option 2 clicked");
                    setIsMenuOpen(false);
                  }}
                >
                  Option 2
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F4F7FE]"
                  onClick={() => {
                    console.log("Option 3 clicked");
                    setIsMenuOpen(false);
                  }}
                >
                  Option 3
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        " text-2xl font-bold leading-none tracking-tight text-[rgb(var(--foreground-rgb))]",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-[rgb(var(--foreground-rgb))]", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(" pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
