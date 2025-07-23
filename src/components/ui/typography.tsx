import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-semibold tracking-tight", {
  variants: {
    variant: {
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-h4",
      h5: "text-h5",
      h6: "text-h6",
      display: "text-display font-bold",
    },
    color: {
      default: "text-gray-900",
      muted: "text-gray-500",
      primary: "text-primary-purple",
      white: "text-white",
      "primary-blue": "text-primary-blue",
      "primary-green": "text-primary-green",
      "primary-red": "text-primary-red",
    },
  },
  defaultVariants: {
    variant: "h1",
    color: "default",
  },
});

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "display";
  color?: "default" | "muted" | "primary" | "white";
}

/**
 * Heading component for consistent typography
 */
export function Heading({ className, variant, color, as, children, ...props }: HeadingProps) {
  const Component = as || "h1";

  return (
    <Component className={cn(headingVariants({ variant, color, className }))} {...props}>
      {children}
    </Component>
  );
}

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-base",
      lead: "text-lg",
      large: "text-lg",
      small: "text-sm",
      muted: "text-sm",
      xs: "text-xs",
    },
    color: {
      default: "text-gray-900",
      muted: "text-gray-500",
      primary: "text-primary-purple",
      white: "text-white",
      "primary-blue": "text-primary-blue",
      "primary-green": "text-primary-green",
      "primary-red": "text-primary-red",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
    color: "default",
    weight: "normal",
  },
});

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
  variant?: "default" | "lead" | "large" | "small" | "muted" | "xs";
  color?: "default" | "muted" | "primary" | "white";
  weight?: "normal" | "medium" | "semibold" | "bold";
}

/**
 * Text component for consistent typography
 */
export function Text({
  className,
  variant,
  color,
  weight,
  as = "p",
  children,
  ...props
}: TextProps) {
  const Component = as;

  return (
    <Component className={cn(textVariants({ variant, color, weight, className }))} {...props}>
      {children}
    </Component>
  );
}
