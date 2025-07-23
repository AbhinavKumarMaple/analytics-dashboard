import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-purple text-white hover:bg-primary-purple-dark shadow-sm",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
        ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
        link: "text-primary-purple underline-offset-4 hover:underline",
        outline:
          "border border-primary-purple text-primary-purple bg-transparent hover:bg-primary-purple/10",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        success: "bg-primary-green text-white hover:bg-primary-green/90 shadow-sm",
        info: "bg-primary-blue text-white hover:bg-primary-blue/90 shadow-sm",
      },
      size: {
        default: "h-10 py-2 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-2",
        // New sizes for hero banner buttons
        "hero-sm": "h-10 px-5 py-2 text-sm",
        "hero-md": "h-12 px-6 py-3 text-base",
        "hero-lg": "h-14 px-8 py-4 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
